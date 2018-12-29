
const dataForge = require('data-forge');
require('data-forge-fs'); // For loading files.
require('data-forge-indicators'); // For the moving average indicator.
require('data-forge-plot'); // For rendering charts.
const { backtest, analyze, computeEquityCurve, computeDrawdown } = require('grademark');
var Table = require('easy-table');
const fs = require('fs');

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
    const movingAverage = inputSeries
        .deflate(bar => bar.close)          // Extract closing price series.
        .sma(30);                           // 30 day moving average.
    
    inputSeries = inputSeries
        .withSeries("sma", movingAverage)   // Integrate moving average into data, indexed on date.
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

        stopLoss: (entryPrice, latestBar, lookback) => { // Intrabar stop loss.
            return entryPrice * (5/100); // Stop out on 5% loss from entry price.
        },
    };

    console.log("Backtesting...");

    // Backtest your strategy, then compute and print metrics:
    const trades = backtest(strategy, inputSeries);
    console.log("Made " + trades.count() + " trades!");

    trades.asCSV().writeFileSync("./output/trades.csv");

    console.log("Analyzing...");

    const startingCapital = 10000;
    const analysis = analyze(startingCapital, trades);

    const analysisTable = new Table();

    for (const key of Object.keys(analysis)) {
        analysisTable.cell("Metric", key);
        analysisTable.cell("Value", analysis[key]);
        analysisTable.newRow();
    }

    const analysisOutput = analysisTable.toString();
    console.log(analysisOutput);
    const analysisOutputFilePath = "output/analysis.txt";
    fs.writeFileSync(analysisOutputFilePath, analysisOutput);
    console.log(">> " + analysisOutputFilePath);

    console.log("Plotting...");

    // Visualize the equity curve and drawdown chart for your backtest:
    const equityCurve = computeEquityCurve(startingCapital, trades);
    const equityCurveOutputFilePath = "output/my-equity-curve.png";
    await equityCurve
        .plot({ chartType: "area", y: { label: "Equity $" }})
        .renderImage(equityCurveOutputFilePath);
    console.log(">> " + equityCurveOutputFilePath);

    const equityCurvePctOutputFilePath = "output/my-equity-curve-pct.png";
    await equityCurve
        .select(v => ((v - startingCapital) / startingCapital) * 100)
        .plot({ chartType: "area", y: { label: "Equity %" }})
        .renderImage(equityCurvePctOutputFilePath);
    console.log(">> " + equityCurvePctOutputFilePath);
        
    const drawdown = computeDrawdown(startingCapital, trades);
    const drawdownOutputFilePath = "output/my-drawdown.png";
    await drawdown
        .plot({ chartType: "area", y: { label: "Drawdown $" }})
        .renderImage(drawdownOutputFilePath);
    console.log(">> " + drawdownOutputFilePath);
        
    const drawdownPctOutputFilePath = "output/my-drawdown-pct.png";
    await drawdown
        .select(v => (v / startingCapital) * 100)
        .plot({ chartType: "area", y: { label: "Drawdown %" }})
        .renderImage(drawdownPctOutputFilePath);
    console.log(">> " + drawdownPctOutputFilePath);
};

main()
    .then(() => console.log("Finished"))
    .catch(err => {
        console.error("An error occurred.");
        console.error(err && err.stack || err);
    });