
const dataForge = require('data-forge');
//TODO: coming soon - require('data-forge-fs'); // For loading files.
require('data-forge-indicators'); // For the moving average indicator.
require('data-forge-plot'); // For rendering charts.
const { backtest, analyze, computeEquityCurve, computeDrawdown } = require('grademark');

async function main() {

    console.log("Loading and preparing data.");

    let inputSeries = dataForge.readFileSync("data/STW.csv")
        .parseCSV()
        .parseDates("date", "DD/MM/YYYY")
        .parseFloats(["open", "high", "low", "close", "volume"])
        .setIndex("date") // Index so we can later merge on date.
        .renameSeries({ date: "time" });

    // The example data file is available in the 'data' sub-directory of this repo.

    console.log("Computing moving average indicator.");

    // Add whatever indicators and signals you want to your data.
    const movingAverage = inputSeries.deflate(bar => bar.close).sma(30); // 30 day moving average.
    inputSeries = inputSeries
        .withSeries("sma", movingAverage)   // Integrate moving average into data based on date.
        .skip(30)                           // Skip blank sma entries.

    // This is a very simple and very naive mean reversion strategy:
    const strategy = {
        entryRule: (enterPosition, bar, lookback) => {
            if (bar.close < bar.sma) { // Buy when price is below average.
                enterPosition();
            }
        },

        exitRule: (exitPosition, position, bar, lookback) => {
            if (bar.close > bar.sma) {
                exitPosition(); // Sell when price is above average.
            }
        },
    };

    console.log("Backtesting...");

    // Backtest your strategy, then compute and print metrics:
    const trades = backtest(strategy, inputSeries)
    console.log("Made " + trades.count() + " trades!");

    console.log("Analyzing...");

    const startingCapital = 10000;
    const analysis = analyze(startingCapital, trades);
    console.log(analysis);

    console.log("Plotting...");

    // Visualize the equity curve and drawdown chart for your backtest:
    await computeEquityCurve(startingCapital, trades)
        .plot()
        .renderImage("output/my-equity-curve.png");

    await computeDrawdown(startingCapital, trades)
        .plot()
        .renderImage("output/my-drawdown.png");
};

main()
    .then(() => console.log("Finished"))
    .catch(err => {
        console.error("An error occurred.");
        console.error(err && err.stack || err);
    })