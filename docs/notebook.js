const baseName = "grademark-first-example";
const notebook = {
    "version": 1,
    "sheet": {
        "id": "1f799620-d370-11e8-b62a-7b63438e3c42",
        "language": "javascript",
        "cells": [
            {
                "id": "31e983b0-daf5-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "# Grademark mean reversion example\r\n\r\nThis notebook demonstrates [backtesting](https://en.wikipedia.org/wiki/Backtesting) a very simple [mean reversion trading strategy](https://en.wikipedia.org/wiki/Mean_reversion_(finance)). \r\n\r\nIt uses the [Grademark](https://github.com/grademark/grademark) JavaScript API for backtesting.\r\n\r\nFor a version of this code runnable on Node.js - please see the [Grademark first example repo](https://github.com/grademark/grademark-first-example).\r\n\r\nTo keep up with my work on quantitative trading in JavaScript please see my [blog](http://www.the-data-wrangler.com/) or [YouTube channel](https://www.youtube.com/channel/UCOxw0jy384_wFRwspgq7qMQ).",
                "lastEvaluationDate": "2018-11-16T15:53:20.087+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "1b3bb2a0-daf5-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Prepare the data\r\n\r\nFirst we need some code to load, parse and prep your data as needed. Then preview your data as a table to make sure it looks ok.\r\n\r\nThe data used in this example is three years of daily prices for STW from 2015 to end 2017. STW is an exchange traded fund for the ASX 200.",
                "lastEvaluationDate": "2018-11-16T15:53:20.087+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "a4a43760-d375-11e8-b62a-7b63438e3c42",
                "cellType": "code",
                "cellScope": "global",
                "code": "const dataForge = require('data-forge');\r\nrequire('data-forge-fs');\r\nrequire('data-forge-plot');\r\nrequire('data-forge-indicators');\r\n\r\nlet inputSeries = (await dataForge.readFile(\"STW.csv\").parseCSV())\r\n    .parseDates(\"date\", \"D/MM/YYYY\")\r\n    .parseFloats([\"open\", \"high\", \"low\", \"close\", \"volume\"])\r\n    .setIndex(\"date\") // Index so we can later merge on date.\r\n    .renameSeries({ date: \"time\" })\r\n    .bake();\r\n\r\ndisplay(inputSeries.head(5));",
                "lastEvaluationDate": "2019-04-25T11:19:05.023+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "columnOrder": [
                                        "time",
                                        "open",
                                        "high",
                                        "low",
                                        "close",
                                        "volume"
                                    ],
                                    "columns": {
                                        "time": "date",
                                        "open": "number",
                                        "high": "number",
                                        "low": "number",
                                        "close": "number",
                                        "volume": "number"
                                    },
                                    "index": {
                                        "type": "date",
                                        "values": [
                                            "2015-01-01T14:00:00.000Z",
                                            "2015-01-04T14:00:00.000Z",
                                            "2015-01-05T14:00:00.000Z",
                                            "2015-01-06T14:00:00.000Z",
                                            "2015-01-07T14:00:00.000Z"
                                        ]
                                    },
                                    "values": [
                                        {
                                            "open": 50.03,
                                            "high": 50.4,
                                            "low": 50.03,
                                            "close": 50.4,
                                            "volume": 84844,
                                            "time": "2015-01-01T14:00:00.000Z"
                                        },
                                        {
                                            "open": 50.69,
                                            "high": 50.73,
                                            "low": 50.32,
                                            "close": 50.65,
                                            "volume": 42645,
                                            "time": "2015-01-04T14:00:00.000Z"
                                        },
                                        {
                                            "open": 50.18,
                                            "high": 50.18,
                                            "low": 49.46,
                                            "close": 49.77,
                                            "volume": 232437,
                                            "time": "2015-01-05T14:00:00.000Z"
                                        },
                                        {
                                            "open": 49.88,
                                            "high": 49.88,
                                            "low": 49.3,
                                            "close": 49.63,
                                            "volume": 58253,
                                            "time": "2015-01-06T14:00:00.000Z"
                                        },
                                        {
                                            "open": 49.9,
                                            "high": 50.05,
                                            "low": 49.74,
                                            "close": 49.77,
                                            "volume": 83496,
                                            "time": "2015-01-07T14:00:00.000Z"
                                        }
                                    ]
                                },
                                "displayType": "dataframe"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "10105a70-daf5-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Visualize the input data\r\n\r\nNow let's make a plot of the example data and see the shape of it.",
                "lastEvaluationDate": "2018-11-16T15:53:20.094+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "9d9a9c70-d375-11e8-b62a-7b63438e3c42",
                "cellType": "code",
                "cellScope": "global",
                "code": "display(inputSeries.tail(100).plot({}, { y: \"close\" }));",
                "lastEvaluationDate": "2019-04-25T11:19:05.028+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "data": {
                                        "columnOrder": [
                                            "time",
                                            "open",
                                            "high",
                                            "low",
                                            "close",
                                            "volume"
                                        ],
                                        "columns": {
                                            "time": "date",
                                            "open": "number",
                                            "high": "number",
                                            "low": "number",
                                            "close": "number",
                                            "volume": "number"
                                        },
                                        "index": {
                                            "type": "date",
                                            "values": [
                                                "2017-08-09T14:00:00.000Z",
                                                "2017-08-10T14:00:00.000Z",
                                                "2017-08-13T14:00:00.000Z",
                                                "2017-08-14T14:00:00.000Z",
                                                "2017-08-15T14:00:00.000Z",
                                                "2017-08-16T14:00:00.000Z",
                                                "2017-08-17T14:00:00.000Z",
                                                "2017-08-20T14:00:00.000Z",
                                                "2017-08-21T14:00:00.000Z",
                                                "2017-08-22T14:00:00.000Z",
                                                "2017-08-23T14:00:00.000Z",
                                                "2017-08-24T14:00:00.000Z",
                                                "2017-08-27T14:00:00.000Z",
                                                "2017-08-28T14:00:00.000Z",
                                                "2017-08-29T14:00:00.000Z",
                                                "2017-08-30T14:00:00.000Z",
                                                "2017-08-31T14:00:00.000Z",
                                                "2017-09-03T14:00:00.000Z",
                                                "2017-09-04T14:00:00.000Z",
                                                "2017-09-05T14:00:00.000Z",
                                                "2017-09-06T14:00:00.000Z",
                                                "2017-09-07T14:00:00.000Z",
                                                "2017-09-10T14:00:00.000Z",
                                                "2017-09-11T14:00:00.000Z",
                                                "2017-09-12T14:00:00.000Z",
                                                "2017-09-13T14:00:00.000Z",
                                                "2017-09-14T14:00:00.000Z",
                                                "2017-09-17T14:00:00.000Z",
                                                "2017-09-18T14:00:00.000Z",
                                                "2017-09-19T14:00:00.000Z",
                                                "2017-09-20T14:00:00.000Z",
                                                "2017-09-21T14:00:00.000Z",
                                                "2017-09-24T14:00:00.000Z",
                                                "2017-09-25T14:00:00.000Z",
                                                "2017-09-26T14:00:00.000Z",
                                                "2017-09-27T14:00:00.000Z",
                                                "2017-09-28T14:00:00.000Z",
                                                "2017-10-01T14:00:00.000Z",
                                                "2017-10-02T14:00:00.000Z",
                                                "2017-10-03T14:00:00.000Z",
                                                "2017-10-04T14:00:00.000Z",
                                                "2017-10-05T14:00:00.000Z",
                                                "2017-10-08T14:00:00.000Z",
                                                "2017-10-09T14:00:00.000Z",
                                                "2017-10-10T14:00:00.000Z",
                                                "2017-10-11T14:00:00.000Z",
                                                "2017-10-12T14:00:00.000Z",
                                                "2017-10-15T14:00:00.000Z",
                                                "2017-10-16T14:00:00.000Z",
                                                "2017-10-17T14:00:00.000Z",
                                                "2017-10-18T14:00:00.000Z",
                                                "2017-10-19T14:00:00.000Z",
                                                "2017-10-22T14:00:00.000Z",
                                                "2017-10-23T14:00:00.000Z",
                                                "2017-10-24T14:00:00.000Z",
                                                "2017-10-25T14:00:00.000Z",
                                                "2017-10-26T14:00:00.000Z",
                                                "2017-10-29T14:00:00.000Z",
                                                "2017-10-30T14:00:00.000Z",
                                                "2017-10-31T14:00:00.000Z",
                                                "2017-11-01T14:00:00.000Z",
                                                "2017-11-02T14:00:00.000Z",
                                                "2017-11-05T14:00:00.000Z",
                                                "2017-11-06T14:00:00.000Z",
                                                "2017-11-07T14:00:00.000Z",
                                                "2017-11-08T14:00:00.000Z",
                                                "2017-11-09T14:00:00.000Z",
                                                "2017-11-12T14:00:00.000Z",
                                                "2017-11-13T14:00:00.000Z",
                                                "2017-11-14T14:00:00.000Z",
                                                "2017-11-15T14:00:00.000Z",
                                                "2017-11-16T14:00:00.000Z",
                                                "2017-11-19T14:00:00.000Z",
                                                "2017-11-20T14:00:00.000Z",
                                                "2017-11-21T14:00:00.000Z",
                                                "2017-11-22T14:00:00.000Z",
                                                "2017-11-23T14:00:00.000Z",
                                                "2017-11-26T14:00:00.000Z",
                                                "2017-11-27T14:00:00.000Z",
                                                "2017-11-28T14:00:00.000Z",
                                                "2017-11-29T14:00:00.000Z",
                                                "2017-11-30T14:00:00.000Z",
                                                "2017-12-03T14:00:00.000Z",
                                                "2017-12-04T14:00:00.000Z",
                                                "2017-12-05T14:00:00.000Z",
                                                "2017-12-06T14:00:00.000Z",
                                                "2017-12-07T14:00:00.000Z",
                                                "2017-12-10T14:00:00.000Z",
                                                "2017-12-11T14:00:00.000Z",
                                                "2017-12-12T14:00:00.000Z",
                                                "2017-12-13T14:00:00.000Z",
                                                "2017-12-14T14:00:00.000Z",
                                                "2017-12-17T14:00:00.000Z",
                                                "2017-12-18T14:00:00.000Z",
                                                "2017-12-19T14:00:00.000Z",
                                                "2017-12-20T14:00:00.000Z",
                                                "2017-12-21T14:00:00.000Z",
                                                "2017-12-26T14:00:00.000Z",
                                                "2017-12-27T14:00:00.000Z",
                                                "2017-12-28T14:00:00.000Z"
                                            ]
                                        },
                                        "values": [
                                            {
                                                "open": 54.06,
                                                "high": 54.32,
                                                "low": 53.83,
                                                "close": 53.95,
                                                "volume": 100586,
                                                "time": "2017-08-09T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.65,
                                                "high": 53.65,
                                                "low": 53.21,
                                                "close": 53.4,
                                                "volume": 206927,
                                                "time": "2017-08-10T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.67,
                                                "high": 53.78,
                                                "low": 53.5,
                                                "close": 53.73,
                                                "volume": 92538,
                                                "time": "2017-08-13T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.05,
                                                "high": 54.19,
                                                "low": 53.96,
                                                "close": 53.99,
                                                "volume": 171919,
                                                "time": "2017-08-14T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54,
                                                "high": 54.4,
                                                "low": 53.87,
                                                "close": 54.4,
                                                "volume": 98064,
                                                "time": "2017-08-15T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.61,
                                                "high": 54.61,
                                                "low": 54.21,
                                                "close": 54.33,
                                                "volume": 55468,
                                                "time": "2017-08-16T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.72,
                                                "high": 54.09,
                                                "low": 53.69,
                                                "close": 54.07,
                                                "volume": 116179,
                                                "time": "2017-08-17T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.02,
                                                "high": 54.04,
                                                "low": 53.59,
                                                "close": 53.82,
                                                "volume": 161670,
                                                "time": "2017-08-20T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.95,
                                                "high": 54.17,
                                                "low": 53.95,
                                                "close": 54.15,
                                                "volume": 698261,
                                                "time": "2017-08-21T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.51,
                                                "high": 54.58,
                                                "low": 53.89,
                                                "close": 54.02,
                                                "volume": 85588,
                                                "time": "2017-08-22T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.95,
                                                "high": 54.23,
                                                "low": 53.82,
                                                "close": 54.09,
                                                "volume": 189374,
                                                "time": "2017-08-23T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.15,
                                                "high": 54.2,
                                                "low": 53.94,
                                                "close": 54.14,
                                                "volume": 92502,
                                                "time": "2017-08-24T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.14,
                                                "high": 54.14,
                                                "low": 53.73,
                                                "close": 53.82,
                                                "volume": 92787,
                                                "time": "2017-08-27T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.62,
                                                "high": 53.62,
                                                "low": 53.23,
                                                "close": 53.45,
                                                "volume": 111494,
                                                "time": "2017-08-28T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.67,
                                                "high": 53.67,
                                                "low": 53.38,
                                                "close": 53.54,
                                                "volume": 63560,
                                                "time": "2017-08-29T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.74,
                                                "high": 53.96,
                                                "low": 53.67,
                                                "close": 53.93,
                                                "volume": 33524,
                                                "time": "2017-08-30T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.08,
                                                "high": 54.2,
                                                "low": 53.85,
                                                "close": 54.06,
                                                "volume": 88373,
                                                "time": "2017-08-31T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.01,
                                                "high": 54.01,
                                                "low": 53.75,
                                                "close": 53.88,
                                                "volume": 48257,
                                                "time": "2017-09-03T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.99,
                                                "high": 54,
                                                "low": 53.54,
                                                "close": 53.88,
                                                "volume": 54425,
                                                "time": "2017-09-04T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.71,
                                                "high": 53.9,
                                                "low": 53.57,
                                                "close": 53.8,
                                                "volume": 51479,
                                                "time": "2017-09-05T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.03,
                                                "high": 54.17,
                                                "low": 53.8,
                                                "close": 53.81,
                                                "volume": 54210,
                                                "time": "2017-09-06T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.99,
                                                "high": 53.99,
                                                "low": 53.64,
                                                "close": 53.76,
                                                "volume": 40978,
                                                "time": "2017-09-07T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.98,
                                                "high": 54.27,
                                                "low": 53.98,
                                                "close": 54.18,
                                                "volume": 121492,
                                                "time": "2017-09-10T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.44,
                                                "high": 54.66,
                                                "low": 54.38,
                                                "close": 54.48,
                                                "volume": 50239,
                                                "time": "2017-09-11T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.82,
                                                "high": 54.82,
                                                "low": 54.49,
                                                "close": 54.5,
                                                "volume": 101023,
                                                "time": "2017-09-12T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.47,
                                                "high": 54.53,
                                                "low": 54.36,
                                                "close": 54.4,
                                                "volume": 31953,
                                                "time": "2017-09-13T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.25,
                                                "high": 54.28,
                                                "low": 53.95,
                                                "close": 54.05,
                                                "volume": 181486,
                                                "time": "2017-09-14T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.2,
                                                "high": 54.38,
                                                "low": 54.2,
                                                "close": 54.29,
                                                "volume": 92985,
                                                "time": "2017-09-17T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.37,
                                                "high": 54.48,
                                                "low": 54.21,
                                                "close": 54.21,
                                                "volume": 89168,
                                                "time": "2017-09-18T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.1,
                                                "high": 54.22,
                                                "low": 53.9,
                                                "close": 54.15,
                                                "volume": 98350,
                                                "time": "2017-09-19T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.15,
                                                "high": 54.15,
                                                "low": 53.5,
                                                "close": 53.69,
                                                "volume": 97335,
                                                "time": "2017-09-20T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.87,
                                                "high": 53.98,
                                                "low": 53.71,
                                                "close": 53.95,
                                                "volume": 60350,
                                                "time": "2017-09-21T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.19,
                                                "high": 54.2,
                                                "low": 53.93,
                                                "close": 53.97,
                                                "volume": 33898,
                                                "time": "2017-09-24T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.08,
                                                "high": 54.13,
                                                "low": 53.83,
                                                "close": 53.85,
                                                "volume": 79402,
                                                "time": "2017-09-25T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.98,
                                                "high": 53.98,
                                                "low": 53.6,
                                                "close": 53.78,
                                                "volume": 84591,
                                                "time": "2017-09-26T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.25,
                                                "high": 53.36,
                                                "low": 52.91,
                                                "close": 52.98,
                                                "volume": 222531,
                                                "time": "2017-09-27T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.02,
                                                "high": 53.15,
                                                "low": 52.8,
                                                "close": 53.06,
                                                "volume": 61870,
                                                "time": "2017-09-28T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.33,
                                                "high": 53.75,
                                                "low": 53.28,
                                                "close": 53.6,
                                                "volume": 61675,
                                                "time": "2017-10-01T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.65,
                                                "high": 53.65,
                                                "low": 53.16,
                                                "close": 53.23,
                                                "volume": 43539,
                                                "time": "2017-10-02T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.26,
                                                "high": 53.26,
                                                "low": 52.77,
                                                "close": 52.79,
                                                "volume": 151764,
                                                "time": "2017-10-03T14:00:00.000Z"
                                            },
                                            {
                                                "open": 52.87,
                                                "high": 52.95,
                                                "low": 52.79,
                                                "close": 52.8,
                                                "volume": 20993,
                                                "time": "2017-10-04T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.27,
                                                "high": 53.33,
                                                "low": 53.08,
                                                "close": 53.33,
                                                "volume": 131570,
                                                "time": "2017-10-05T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.41,
                                                "high": 53.82,
                                                "low": 53.41,
                                                "close": 53.64,
                                                "volume": 58591,
                                                "time": "2017-10-08T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.44,
                                                "high": 53.72,
                                                "low": 53.44,
                                                "close": 53.58,
                                                "volume": 701440,
                                                "time": "2017-10-09T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.65,
                                                "high": 53.99,
                                                "low": 53.58,
                                                "close": 53.94,
                                                "volume": 41330,
                                                "time": "2017-10-10T14:00:00.000Z"
                                            },
                                            {
                                                "open": 53.89,
                                                "high": 54.12,
                                                "low": 53.86,
                                                "close": 54.11,
                                                "volume": 90032,
                                                "time": "2017-10-11T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.15,
                                                "high": 54.4,
                                                "low": 54.12,
                                                "close": 54.33,
                                                "volume": 92674,
                                                "time": "2017-10-12T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.56,
                                                "high": 54.71,
                                                "low": 54.55,
                                                "close": 54.63,
                                                "volume": 62866,
                                                "time": "2017-10-15T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.74,
                                                "high": 55.1,
                                                "low": 54.74,
                                                "close": 55.01,
                                                "volume": 181283,
                                                "time": "2017-10-16T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.99,
                                                "high": 55.2,
                                                "low": 54.99,
                                                "close": 55.1,
                                                "volume": 66109,
                                                "time": "2017-10-17T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.14,
                                                "high": 55.23,
                                                "low": 54.98,
                                                "close": 55.04,
                                                "volume": 138271,
                                                "time": "2017-10-18T14:00:00.000Z"
                                            },
                                            {
                                                "open": 54.85,
                                                "high": 55.37,
                                                "low": 54.85,
                                                "close": 55.18,
                                                "volume": 213021,
                                                "time": "2017-10-19T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.32,
                                                "high": 55.36,
                                                "low": 55.06,
                                                "close": 55.07,
                                                "volume": 42863,
                                                "time": "2017-10-22T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.07,
                                                "high": 55.2,
                                                "low": 55,
                                                "close": 55.12,
                                                "volume": 35282,
                                                "time": "2017-10-23T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.27,
                                                "high": 55.32,
                                                "low": 55.1,
                                                "close": 55.17,
                                                "volume": 55123,
                                                "time": "2017-10-24T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.12,
                                                "high": 55.27,
                                                "low": 54.99,
                                                "close": 55.27,
                                                "volume": 69937,
                                                "time": "2017-10-25T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.4,
                                                "high": 55.5,
                                                "low": 54.76,
                                                "close": 55.15,
                                                "volume": 97473,
                                                "time": "2017-10-26T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.4,
                                                "high": 55.42,
                                                "low": 55.22,
                                                "close": 55.31,
                                                "volume": 31601,
                                                "time": "2017-10-29T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.29,
                                                "high": 55.45,
                                                "low": 55.22,
                                                "close": 55.23,
                                                "volume": 81692,
                                                "time": "2017-10-30T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.38,
                                                "high": 55.62,
                                                "low": 55.38,
                                                "close": 55.46,
                                                "volume": 101420,
                                                "time": "2017-10-31T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.7,
                                                "high": 55.74,
                                                "low": 55.39,
                                                "close": 55.46,
                                                "volume": 79999,
                                                "time": "2017-11-01T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.6,
                                                "high": 55.78,
                                                "low": 55.53,
                                                "close": 55.72,
                                                "volume": 59616,
                                                "time": "2017-11-02T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.77,
                                                "high": 55.77,
                                                "low": 55.6,
                                                "close": 55.63,
                                                "volume": 68785,
                                                "time": "2017-11-05T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.92,
                                                "high": 56.24,
                                                "low": 55.92,
                                                "close": 56.23,
                                                "volume": 67696,
                                                "time": "2017-11-06T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.06,
                                                "high": 56.32,
                                                "low": 56.06,
                                                "close": 56.25,
                                                "volume": 41631,
                                                "time": "2017-11-07T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.44,
                                                "high": 56.67,
                                                "low": 56.38,
                                                "close": 56.63,
                                                "volume": 78606,
                                                "time": "2017-11-08T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.43,
                                                "high": 56.54,
                                                "low": 56.38,
                                                "close": 56.44,
                                                "volume": 59056,
                                                "time": "2017-11-09T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.57,
                                                "high": 56.65,
                                                "low": 56.5,
                                                "close": 56.62,
                                                "volume": 110727,
                                                "time": "2017-11-12T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.22,
                                                "high": 56.23,
                                                "low": 55.95,
                                                "close": 56.09,
                                                "volume": 98522,
                                                "time": "2017-11-13T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.88,
                                                "high": 55.96,
                                                "low": 55.74,
                                                "close": 55.74,
                                                "volume": 103257,
                                                "time": "2017-11-14T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.68,
                                                "high": 55.94,
                                                "low": 55.6,
                                                "close": 55.84,
                                                "volume": 43752,
                                                "time": "2017-11-15T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.19,
                                                "high": 56.2,
                                                "low": 55.95,
                                                "close": 55.97,
                                                "volume": 47059,
                                                "time": "2017-11-16T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.73,
                                                "high": 55.95,
                                                "low": 55.65,
                                                "close": 55.86,
                                                "volume": 46987,
                                                "time": "2017-11-19T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.07,
                                                "high": 56.1,
                                                "low": 55.89,
                                                "close": 56.06,
                                                "volume": 49219,
                                                "time": "2017-11-20T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.32,
                                                "high": 56.39,
                                                "low": 56.19,
                                                "close": 56.3,
                                                "volume": 56837,
                                                "time": "2017-11-21T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.24,
                                                "high": 56.29,
                                                "low": 56.13,
                                                "close": 56.25,
                                                "volume": 50447,
                                                "time": "2017-11-22T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.17,
                                                "high": 56.23,
                                                "low": 55.93,
                                                "close": 56.23,
                                                "volume": 47310,
                                                "time": "2017-11-23T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.15,
                                                "high": 56.45,
                                                "low": 56.15,
                                                "close": 56.31,
                                                "volume": 59387,
                                                "time": "2017-11-26T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.16,
                                                "high": 56.45,
                                                "low": 56.16,
                                                "close": 56.24,
                                                "volume": 785248,
                                                "time": "2017-11-27T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.57,
                                                "high": 56.69,
                                                "low": 56.48,
                                                "close": 56.5,
                                                "volume": 165444,
                                                "time": "2017-11-28T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.19,
                                                "high": 56.26,
                                                "low": 55.92,
                                                "close": 56.11,
                                                "volume": 304441,
                                                "time": "2017-11-29T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.33,
                                                "high": 56.46,
                                                "low": 56.2,
                                                "close": 56.31,
                                                "volume": 55626,
                                                "time": "2017-11-30T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.34,
                                                "high": 56.45,
                                                "low": 56.2,
                                                "close": 56.26,
                                                "volume": 54864,
                                                "time": "2017-12-03T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.94,
                                                "high": 56.26,
                                                "low": 55.9,
                                                "close": 56.09,
                                                "volume": 66202,
                                                "time": "2017-12-04T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.89,
                                                "high": 56.04,
                                                "low": 55.79,
                                                "close": 55.87,
                                                "volume": 123299,
                                                "time": "2017-12-05T14:00:00.000Z"
                                            },
                                            {
                                                "open": 55.96,
                                                "high": 56.28,
                                                "low": 55.91,
                                                "close": 56.25,
                                                "volume": 47063,
                                                "time": "2017-12-06T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.3,
                                                "high": 56.5,
                                                "low": 56.24,
                                                "close": 56.33,
                                                "volume": 102838,
                                                "time": "2017-12-07T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.52,
                                                "high": 56.55,
                                                "low": 56.3,
                                                "close": 56.38,
                                                "volume": 44191,
                                                "time": "2017-12-10T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.47,
                                                "high": 56.57,
                                                "low": 56.39,
                                                "close": 56.52,
                                                "volume": 63047,
                                                "time": "2017-12-11T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.6,
                                                "high": 56.67,
                                                "low": 56.41,
                                                "close": 56.58,
                                                "volume": 114145,
                                                "time": "2017-12-12T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.74,
                                                "high": 56.84,
                                                "low": 56.53,
                                                "close": 56.53,
                                                "volume": 119652,
                                                "time": "2017-12-13T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.43,
                                                "high": 56.48,
                                                "low": 56.28,
                                                "close": 56.35,
                                                "volume": 70681,
                                                "time": "2017-12-14T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.65,
                                                "high": 56.79,
                                                "low": 56.57,
                                                "close": 56.76,
                                                "volume": 52818,
                                                "time": "2017-12-17T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.95,
                                                "high": 57.17,
                                                "low": 56.95,
                                                "close": 57.06,
                                                "volume": 62356,
                                                "time": "2017-12-18T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.9,
                                                "high": 57.19,
                                                "low": 56.9,
                                                "close": 57.1,
                                                "volume": 173303,
                                                "time": "2017-12-19T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.92,
                                                "high": 56.97,
                                                "low": 56.88,
                                                "close": 56.89,
                                                "volume": 422205,
                                                "time": "2017-12-20T14:00:00.000Z"
                                            },
                                            {
                                                "open": 57.06,
                                                "high": 57.16,
                                                "low": 57,
                                                "close": 57,
                                                "volume": 214591,
                                                "time": "2017-12-21T14:00:00.000Z"
                                            },
                                            {
                                                "open": 57.17,
                                                "high": 57.25,
                                                "low": 57,
                                                "close": 57,
                                                "volume": 92219,
                                                "time": "2017-12-26T14:00:00.000Z"
                                            },
                                            {
                                                "open": 57.11,
                                                "high": 57.11,
                                                "low": 56.57,
                                                "close": 56.79,
                                                "volume": 50671,
                                                "time": "2017-12-27T14:00:00.000Z"
                                            },
                                            {
                                                "open": 56.81,
                                                "high": 56.81,
                                                "low": 56.42,
                                                "close": 56.57,
                                                "volume": 432777,
                                                "time": "2017-12-28T14:00:00.000Z"
                                            }
                                        ]
                                    },
                                    "plotConfig": {
                                        "legend": {
                                            "show": true
                                        },
                                        "chartType": "line",
                                        "width": "100%",
                                        "height": "100%",
                                        "y": {
                                            "min": 52.79,
                                            "max": 57.1
                                        },
                                        "y2": {}
                                    },
                                    "axisMap": {
                                        "y": [
                                            {
                                                "series": "close"
                                            }
                                        ],
                                        "y2": []
                                    }
                                },
                                "displayType": "chart"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "c2ddeec0-daf4-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Compute indicators\r\n\r\nWe are going to need some indicators from which to make trading decisions!\r\n\r\nWe are testing a simple and naive mean reversion strategy. The first thing we need is a simple moving average of the STW closing proice. Let's compute that now...",
                "lastEvaluationDate": "2018-11-16T15:53:20.110+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "cffef090-d50e-11e8-9de5-774a0a7a5ea4",
                "cellType": "code",
                "cellScope": "global",
                "code": "const movingAverage = inputSeries\r\n    .deflate(bar => bar.close)  // Extract closing price series.\r\n    .sma(30)                    // 30 day moving average.\r\n    .bake();\r\n\r\ninputSeries = inputSeries\r\n    .skip(30)                           // Skip blank sma entries.\r\n    .withSeries(\"sma\", movingAverage)   // Integrate moving average into data, indexed on date.\r\n    .bake();\r\n\r\ndisplay(inputSeries.head(5));",
                "lastEvaluationDate": "2019-04-25T11:19:05.032+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "columnOrder": [
                                        "time",
                                        "open",
                                        "high",
                                        "low",
                                        "close",
                                        "volume",
                                        "sma"
                                    ],
                                    "columns": {
                                        "time": "date",
                                        "open": "number",
                                        "high": "number",
                                        "low": "number",
                                        "close": "number",
                                        "volume": "number",
                                        "sma": "number"
                                    },
                                    "index": {
                                        "type": "date",
                                        "values": [
                                            "2015-02-15T14:00:00.000Z",
                                            "2015-02-16T14:00:00.000Z",
                                            "2015-02-17T14:00:00.000Z",
                                            "2015-02-18T14:00:00.000Z",
                                            "2015-02-19T14:00:00.000Z"
                                        ]
                                    },
                                    "values": [
                                        {
                                            "open": 54.61,
                                            "high": 54.71,
                                            "low": 54.15,
                                            "close": 54.58,
                                            "volume": 109518,
                                            "time": "2015-02-15T14:00:00.000Z",
                                            "sma": 51.482333333333344
                                        },
                                        {
                                            "open": 54.37,
                                            "high": 54.64,
                                            "low": 54.27,
                                            "close": 54.41,
                                            "volume": 191610,
                                            "time": "2015-02-16T14:00:00.000Z",
                                            "sma": 51.60766666666668
                                        },
                                        {
                                            "open": 54.79,
                                            "high": 54.98,
                                            "low": 54.43,
                                            "close": 54.91,
                                            "volume": 153915,
                                            "time": "2015-02-17T14:00:00.000Z",
                                            "sma": 51.77900000000002
                                        },
                                        {
                                            "open": 55,
                                            "high": 55.31,
                                            "low": 54.75,
                                            "close": 54.93,
                                            "volume": 141390,
                                            "time": "2015-02-18T14:00:00.000Z",
                                            "sma": 51.95566666666668
                                        },
                                        {
                                            "open": 55.01,
                                            "high": 55.01,
                                            "low": 54.58,
                                            "close": 54.63,
                                            "volume": 44591,
                                            "time": "2015-02-19T14:00:00.000Z",
                                            "sma": 52.11766666666668
                                        }
                                    ]
                                },
                                "displayType": "dataframe"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "d25ee570-daf4-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Plot indicators\r\n\r\nNow we'll plot a preview of our indicator against the closing price to get an idea of what it looks like.",
                "lastEvaluationDate": "2018-11-16T15:53:20.115+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "ea402d70-daf4-11e8-831f-d150615bd7aa",
                "cellType": "code",
                "cellScope": "global",
                "code": "display(inputSeries.tail(100).plot({}, { y: [\"close\", \"sma\" ] }));",
                "lastEvaluationDate": "2019-04-25T11:19:05.037+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "data": {
                                        "columnOrder": [
                                            "time",
                                            "open",
                                            "high",
                                            "low",
                                            "close",
                                            "volume",
                                            "sma"
                                        ],
                                        "columns": {
                                            "time": "date",
                                            "open": "number",
                                            "high": "number",
                                            "low": "number",
                                            "close": "number",
                                            "volume": "number",
                                            "sma": "number"
                                        },
                                        "index": {
                                            "type": "date",
                                            "values": [
                                                "2017-08-09T14:00:00.000Z",
                                                "2017-08-10T14:00:00.000Z",
                                                "2017-08-13T14:00:00.000Z",
                                                "2017-08-14T14:00:00.000Z",
                                                "2017-08-15T14:00:00.000Z",
                                                "2017-08-16T14:00:00.000Z",
                                                "2017-08-17T14:00:00.000Z",
                                                "2017-08-20T14:00:00.000Z",
                                                "2017-08-21T14:00:00.000Z",
                                                "2017-08-22T14:00:00.000Z",
                                                "2017-08-23T14:00:00.000Z",
                                                "2017-08-24T14:00:00.000Z",
                                                "2017-08-27T14:00:00.000Z",
                                                "2017-08-28T14:00:00.000Z",
                                                "2017-08-29T14:00:00.000Z",
                                                "2017-08-30T14:00:00.000Z",
                                                "2017-08-31T14:00:00.000Z",
                                                "2017-09-03T14:00:00.000Z",
                                                "2017-09-04T14:00:00.000Z",
                                                "2017-09-05T14:00:00.000Z",
                                                "2017-09-06T14:00:00.000Z",
                                                "2017-09-07T14:00:00.000Z",
                                                "2017-09-10T14:00:00.000Z",
                                                "2017-09-11T14:00:00.000Z",
                                                "2017-09-12T14:00:00.000Z",
                                                "2017-09-13T14:00:00.000Z",
                                                "2017-09-14T14:00:00.000Z",
                                                "2017-09-17T14:00:00.000Z",
                                                "2017-09-18T14:00:00.000Z",
                                                "2017-09-19T14:00:00.000Z",
                                                "2017-09-20T14:00:00.000Z",
                                                "2017-09-21T14:00:00.000Z",
                                                "2017-09-24T14:00:00.000Z",
                                                "2017-09-25T14:00:00.000Z",
                                                "2017-09-26T14:00:00.000Z",
                                                "2017-09-27T14:00:00.000Z",
                                                "2017-09-28T14:00:00.000Z",
                                                "2017-10-01T14:00:00.000Z",
                                                "2017-10-02T14:00:00.000Z",
                                                "2017-10-03T14:00:00.000Z",
                                                "2017-10-04T14:00:00.000Z",
                                                "2017-10-05T14:00:00.000Z",
                                                "2017-10-08T14:00:00.000Z",
                                                "2017-10-09T14:00:00.000Z",
                                                "2017-10-10T14:00:00.000Z",
                                                "2017-10-11T14:00:00.000Z",
                                                "2017-10-12T14:00:00.000Z",
                                                "2017-10-15T14:00:00.000Z",
                                                "2017-10-16T14:00:00.000Z",
                                                "2017-10-17T14:00:00.000Z",
                                                "2017-10-18T14:00:00.000Z",
                                                "2017-10-19T14:00:00.000Z",
                                                "2017-10-22T14:00:00.000Z",
                                                "2017-10-23T14:00:00.000Z",
                                                "2017-10-24T14:00:00.000Z",
                                                "2017-10-25T14:00:00.000Z",
                                                "2017-10-26T14:00:00.000Z",
                                                "2017-10-29T14:00:00.000Z",
                                                "2017-10-30T14:00:00.000Z",
                                                "2017-10-31T14:00:00.000Z",
                                                "2017-11-01T14:00:00.000Z",
                                                "2017-11-02T14:00:00.000Z",
                                                "2017-11-05T14:00:00.000Z",
                                                "2017-11-06T14:00:00.000Z",
                                                "2017-11-07T14:00:00.000Z",
                                                "2017-11-08T14:00:00.000Z",
                                                "2017-11-09T14:00:00.000Z",
                                                "2017-11-12T14:00:00.000Z",
                                                "2017-11-13T14:00:00.000Z",
                                                "2017-11-14T14:00:00.000Z",
                                                "2017-11-15T14:00:00.000Z",
                                                "2017-11-16T14:00:00.000Z",
                                                "2017-11-19T14:00:00.000Z",
                                                "2017-11-20T14:00:00.000Z",
                                                "2017-11-21T14:00:00.000Z",
                                                "2017-11-22T14:00:00.000Z",
                                                "2017-11-23T14:00:00.000Z",
                                                "2017-11-26T14:00:00.000Z",
                                                "2017-11-27T14:00:00.000Z",
                                                "2017-11-28T14:00:00.000Z",
                                                "2017-11-29T14:00:00.000Z",
                                                "2017-11-30T14:00:00.000Z",
                                                "2017-12-03T14:00:00.000Z",
                                                "2017-12-04T14:00:00.000Z",
                                                "2017-12-05T14:00:00.000Z",
                                                "2017-12-06T14:00:00.000Z",
                                                "2017-12-07T14:00:00.000Z",
                                                "2017-12-10T14:00:00.000Z",
                                                "2017-12-11T14:00:00.000Z",
                                                "2017-12-12T14:00:00.000Z",
                                                "2017-12-13T14:00:00.000Z",
                                                "2017-12-14T14:00:00.000Z",
                                                "2017-12-17T14:00:00.000Z",
                                                "2017-12-18T14:00:00.000Z",
                                                "2017-12-19T14:00:00.000Z",
                                                "2017-12-20T14:00:00.000Z",
                                                "2017-12-21T14:00:00.000Z",
                                                "2017-12-26T14:00:00.000Z",
                                                "2017-12-27T14:00:00.000Z",
                                                "2017-12-28T14:00:00.000Z"
                                            ]
                                        },
                                        "values": [
                                            {
                                                "open": 54.06,
                                                "high": 54.32,
                                                "low": 53.83,
                                                "close": 53.95,
                                                "volume": 100586,
                                                "time": "2017-08-09T14:00:00.000Z",
                                                "sma": 53.73366666666665
                                            },
                                            {
                                                "open": 53.65,
                                                "high": 53.65,
                                                "low": 53.21,
                                                "close": 53.4,
                                                "volume": 206927,
                                                "time": "2017-08-10T14:00:00.000Z",
                                                "sma": 53.728333333333325
                                            },
                                            {
                                                "open": 53.67,
                                                "high": 53.78,
                                                "low": 53.5,
                                                "close": 53.73,
                                                "volume": 92538,
                                                "time": "2017-08-13T14:00:00.000Z",
                                                "sma": 53.745
                                            },
                                            {
                                                "open": 54.05,
                                                "high": 54.19,
                                                "low": 53.96,
                                                "close": 53.99,
                                                "volume": 171919,
                                                "time": "2017-08-14T14:00:00.000Z",
                                                "sma": 53.739
                                            },
                                            {
                                                "open": 54,
                                                "high": 54.4,
                                                "low": 53.87,
                                                "close": 54.4,
                                                "volume": 98064,
                                                "time": "2017-08-15T14:00:00.000Z",
                                                "sma": 53.74966666666667
                                            },
                                            {
                                                "open": 54.61,
                                                "high": 54.61,
                                                "low": 54.21,
                                                "close": 54.33,
                                                "volume": 55468,
                                                "time": "2017-08-16T14:00:00.000Z",
                                                "sma": 53.76199999999999
                                            },
                                            {
                                                "open": 53.72,
                                                "high": 54.09,
                                                "low": 53.69,
                                                "close": 54.07,
                                                "volume": 116179,
                                                "time": "2017-08-17T14:00:00.000Z",
                                                "sma": 53.784666666666666
                                            },
                                            {
                                                "open": 54.02,
                                                "high": 54.04,
                                                "low": 53.59,
                                                "close": 53.82,
                                                "volume": 161670,
                                                "time": "2017-08-20T14:00:00.000Z",
                                                "sma": 53.79033333333333
                                            },
                                            {
                                                "open": 53.95,
                                                "high": 54.17,
                                                "low": 53.95,
                                                "close": 54.15,
                                                "volume": 698261,
                                                "time": "2017-08-21T14:00:00.000Z",
                                                "sma": 53.80566666666667
                                            },
                                            {
                                                "open": 54.51,
                                                "high": 54.58,
                                                "low": 53.89,
                                                "close": 54.02,
                                                "volume": 85588,
                                                "time": "2017-08-22T14:00:00.000Z",
                                                "sma": 53.835
                                            },
                                            {
                                                "open": 53.95,
                                                "high": 54.23,
                                                "low": 53.82,
                                                "close": 54.09,
                                                "volume": 189374,
                                                "time": "2017-08-23T14:00:00.000Z",
                                                "sma": 53.84533333333333
                                            },
                                            {
                                                "open": 54.15,
                                                "high": 54.2,
                                                "low": 53.94,
                                                "close": 54.14,
                                                "volume": 92502,
                                                "time": "2017-08-24T14:00:00.000Z",
                                                "sma": 53.852999999999994
                                            },
                                            {
                                                "open": 54.14,
                                                "high": 54.14,
                                                "low": 53.73,
                                                "close": 53.82,
                                                "volume": 92787,
                                                "time": "2017-08-27T14:00:00.000Z",
                                                "sma": 53.850333333333325
                                            },
                                            {
                                                "open": 53.62,
                                                "high": 53.62,
                                                "low": 53.23,
                                                "close": 53.45,
                                                "volume": 111494,
                                                "time": "2017-08-28T14:00:00.000Z",
                                                "sma": 53.856333333333325
                                            },
                                            {
                                                "open": 53.67,
                                                "high": 53.67,
                                                "low": 53.38,
                                                "close": 53.54,
                                                "volume": 63560,
                                                "time": "2017-08-29T14:00:00.000Z",
                                                "sma": 53.85099999999999
                                            },
                                            {
                                                "open": 53.74,
                                                "high": 53.96,
                                                "low": 53.67,
                                                "close": 53.93,
                                                "volume": 33524,
                                                "time": "2017-08-30T14:00:00.000Z",
                                                "sma": 53.85066666666667
                                            },
                                            {
                                                "open": 54.08,
                                                "high": 54.2,
                                                "low": 53.85,
                                                "close": 54.06,
                                                "volume": 88373,
                                                "time": "2017-08-31T14:00:00.000Z",
                                                "sma": 53.86666666666667
                                            },
                                            {
                                                "open": 54.01,
                                                "high": 54.01,
                                                "low": 53.75,
                                                "close": 53.88,
                                                "volume": 48257,
                                                "time": "2017-09-03T14:00:00.000Z",
                                                "sma": 53.88833333333334
                                            },
                                            {
                                                "open": 53.99,
                                                "high": 54,
                                                "low": 53.54,
                                                "close": 53.88,
                                                "volume": 54425,
                                                "time": "2017-09-04T14:00:00.000Z",
                                                "sma": 53.896666666666675
                                            },
                                            {
                                                "open": 53.71,
                                                "high": 53.9,
                                                "low": 53.57,
                                                "close": 53.8,
                                                "volume": 51479,
                                                "time": "2017-09-05T14:00:00.000Z",
                                                "sma": 53.88633333333335
                                            },
                                            {
                                                "open": 54.03,
                                                "high": 54.17,
                                                "low": 53.8,
                                                "close": 53.81,
                                                "volume": 54210,
                                                "time": "2017-09-06T14:00:00.000Z",
                                                "sma": 53.87366666666667
                                            },
                                            {
                                                "open": 53.99,
                                                "high": 53.99,
                                                "low": 53.64,
                                                "close": 53.76,
                                                "volume": 40978,
                                                "time": "2017-09-07T14:00:00.000Z",
                                                "sma": 53.887333333333345
                                            },
                                            {
                                                "open": 53.98,
                                                "high": 54.27,
                                                "low": 53.98,
                                                "close": 54.18,
                                                "volume": 121492,
                                                "time": "2017-09-10T14:00:00.000Z",
                                                "sma": 53.90733333333334
                                            },
                                            {
                                                "open": 54.44,
                                                "high": 54.66,
                                                "low": 54.38,
                                                "close": 54.48,
                                                "volume": 50239,
                                                "time": "2017-09-11T14:00:00.000Z",
                                                "sma": 53.921333333333344
                                            },
                                            {
                                                "open": 54.82,
                                                "high": 54.82,
                                                "low": 54.49,
                                                "close": 54.5,
                                                "volume": 101023,
                                                "time": "2017-09-12T14:00:00.000Z",
                                                "sma": 53.94466666666668
                                            },
                                            {
                                                "open": 54.47,
                                                "high": 54.53,
                                                "low": 54.36,
                                                "close": 54.4,
                                                "volume": 31953,
                                                "time": "2017-09-13T14:00:00.000Z",
                                                "sma": 53.969000000000015
                                            },
                                            {
                                                "open": 54.25,
                                                "high": 54.28,
                                                "low": 53.95,
                                                "close": 54.05,
                                                "volume": 181486,
                                                "time": "2017-09-14T14:00:00.000Z",
                                                "sma": 53.98400000000001
                                            },
                                            {
                                                "open": 54.2,
                                                "high": 54.38,
                                                "low": 54.2,
                                                "close": 54.29,
                                                "volume": 92985,
                                                "time": "2017-09-17T14:00:00.000Z",
                                                "sma": 53.991666666666674
                                            },
                                            {
                                                "open": 54.37,
                                                "high": 54.48,
                                                "low": 54.21,
                                                "close": 54.21,
                                                "volume": 89168,
                                                "time": "2017-09-18T14:00:00.000Z",
                                                "sma": 54.005
                                            },
                                            {
                                                "open": 54.1,
                                                "high": 54.22,
                                                "low": 53.9,
                                                "close": 54.15,
                                                "volume": 98350,
                                                "time": "2017-09-19T14:00:00.000Z",
                                                "sma": 54.00933333333333
                                            },
                                            {
                                                "open": 54.15,
                                                "high": 54.15,
                                                "low": 53.5,
                                                "close": 53.69,
                                                "volume": 97335,
                                                "time": "2017-09-20T14:00:00.000Z",
                                                "sma": 54.000666666666675
                                            },
                                            {
                                                "open": 53.87,
                                                "high": 53.98,
                                                "low": 53.71,
                                                "close": 53.95,
                                                "volume": 60350,
                                                "time": "2017-09-21T14:00:00.000Z",
                                                "sma": 54.019000000000005
                                            },
                                            {
                                                "open": 54.19,
                                                "high": 54.2,
                                                "low": 53.93,
                                                "close": 53.97,
                                                "volume": 33898,
                                                "time": "2017-09-24T14:00:00.000Z",
                                                "sma": 54.02700000000001
                                            },
                                            {
                                                "open": 54.08,
                                                "high": 54.13,
                                                "low": 53.83,
                                                "close": 53.85,
                                                "volume": 79402,
                                                "time": "2017-09-25T14:00:00.000Z",
                                                "sma": 54.022333333333336
                                            },
                                            {
                                                "open": 53.98,
                                                "high": 53.98,
                                                "low": 53.6,
                                                "close": 53.78,
                                                "volume": 84591,
                                                "time": "2017-09-26T14:00:00.000Z",
                                                "sma": 54.00166666666666
                                            },
                                            {
                                                "open": 53.25,
                                                "high": 53.36,
                                                "low": 52.91,
                                                "close": 52.98,
                                                "volume": 222531,
                                                "time": "2017-09-27T14:00:00.000Z",
                                                "sma": 53.95666666666666
                                            },
                                            {
                                                "open": 53.02,
                                                "high": 53.15,
                                                "low": 52.8,
                                                "close": 53.06,
                                                "volume": 61870,
                                                "time": "2017-09-28T14:00:00.000Z",
                                                "sma": 53.922999999999995
                                            },
                                            {
                                                "open": 53.33,
                                                "high": 53.75,
                                                "low": 53.28,
                                                "close": 53.6,
                                                "volume": 61675,
                                                "time": "2017-10-01T14:00:00.000Z",
                                                "sma": 53.91566666666666
                                            },
                                            {
                                                "open": 53.65,
                                                "high": 53.65,
                                                "low": 53.16,
                                                "close": 53.23,
                                                "volume": 43539,
                                                "time": "2017-10-02T14:00:00.000Z",
                                                "sma": 53.885
                                            },
                                            {
                                                "open": 53.26,
                                                "high": 53.26,
                                                "low": 52.77,
                                                "close": 52.79,
                                                "volume": 151764,
                                                "time": "2017-10-03T14:00:00.000Z",
                                                "sma": 53.844
                                            },
                                            {
                                                "open": 52.87,
                                                "high": 52.95,
                                                "low": 52.79,
                                                "close": 52.8,
                                                "volume": 20993,
                                                "time": "2017-10-04T14:00:00.000Z",
                                                "sma": 53.800999999999995
                                            },
                                            {
                                                "open": 53.27,
                                                "high": 53.33,
                                                "low": 53.08,
                                                "close": 53.33,
                                                "volume": 131570,
                                                "time": "2017-10-05T14:00:00.000Z",
                                                "sma": 53.77399999999999
                                            },
                                            {
                                                "open": 53.41,
                                                "high": 53.82,
                                                "low": 53.41,
                                                "close": 53.64,
                                                "volume": 58591,
                                                "time": "2017-10-08T14:00:00.000Z",
                                                "sma": 53.767999999999994
                                            },
                                            {
                                                "open": 53.44,
                                                "high": 53.72,
                                                "low": 53.44,
                                                "close": 53.58,
                                                "volume": 701440,
                                                "time": "2017-10-09T14:00:00.000Z",
                                                "sma": 53.77233333333332
                                            },
                                            {
                                                "open": 53.65,
                                                "high": 53.99,
                                                "low": 53.58,
                                                "close": 53.94,
                                                "volume": 41330,
                                                "time": "2017-10-10T14:00:00.000Z",
                                                "sma": 53.78566666666666
                                            },
                                            {
                                                "open": 53.89,
                                                "high": 54.12,
                                                "low": 53.86,
                                                "close": 54.11,
                                                "volume": 90032,
                                                "time": "2017-10-11T14:00:00.000Z",
                                                "sma": 53.79166666666666
                                            },
                                            {
                                                "open": 54.15,
                                                "high": 54.4,
                                                "low": 54.12,
                                                "close": 54.33,
                                                "volume": 92674,
                                                "time": "2017-10-12T14:00:00.000Z",
                                                "sma": 53.80066666666665
                                            },
                                            {
                                                "open": 54.56,
                                                "high": 54.71,
                                                "low": 54.55,
                                                "close": 54.63,
                                                "volume": 62866,
                                                "time": "2017-10-15T14:00:00.000Z",
                                                "sma": 53.82566666666666
                                            },
                                            {
                                                "open": 54.74,
                                                "high": 55.1,
                                                "low": 54.74,
                                                "close": 55.01,
                                                "volume": 181283,
                                                "time": "2017-10-16T14:00:00.000Z",
                                                "sma": 53.86333333333333
                                            },
                                            {
                                                "open": 54.99,
                                                "high": 55.2,
                                                "low": 54.99,
                                                "close": 55.1,
                                                "volume": 66109,
                                                "time": "2017-10-17T14:00:00.000Z",
                                                "sma": 53.906666666666666
                                            },
                                            {
                                                "open": 55.14,
                                                "high": 55.23,
                                                "low": 54.98,
                                                "close": 55.04,
                                                "volume": 138271,
                                                "time": "2017-10-18T14:00:00.000Z",
                                                "sma": 53.94766666666667
                                            },
                                            {
                                                "open": 54.85,
                                                "high": 55.37,
                                                "low": 54.85,
                                                "close": 55.18,
                                                "volume": 213021,
                                                "time": "2017-10-19T14:00:00.000Z",
                                                "sma": 53.995
                                            },
                                            {
                                                "open": 55.32,
                                                "high": 55.36,
                                                "low": 55.06,
                                                "close": 55.07,
                                                "volume": 42863,
                                                "time": "2017-10-22T14:00:00.000Z",
                                                "sma": 54.02466666666666
                                            },
                                            {
                                                "open": 55.07,
                                                "high": 55.2,
                                                "low": 55,
                                                "close": 55.12,
                                                "volume": 35282,
                                                "time": "2017-10-23T14:00:00.000Z",
                                                "sma": 54.045999999999985
                                            },
                                            {
                                                "open": 55.27,
                                                "high": 55.32,
                                                "low": 55.1,
                                                "close": 55.17,
                                                "volume": 55123,
                                                "time": "2017-10-24T14:00:00.000Z",
                                                "sma": 54.06833333333332
                                            },
                                            {
                                                "open": 55.12,
                                                "high": 55.27,
                                                "low": 54.99,
                                                "close": 55.27,
                                                "volume": 69937,
                                                "time": "2017-10-25T14:00:00.000Z",
                                                "sma": 54.09733333333333
                                            },
                                            {
                                                "open": 55.4,
                                                "high": 55.5,
                                                "low": 54.76,
                                                "close": 55.15,
                                                "volume": 97473,
                                                "time": "2017-10-26T14:00:00.000Z",
                                                "sma": 54.13400000000001
                                            },
                                            {
                                                "open": 55.4,
                                                "high": 55.42,
                                                "low": 55.22,
                                                "close": 55.31,
                                                "volume": 31601,
                                                "time": "2017-10-29T14:00:00.000Z",
                                                "sma": 54.168
                                            },
                                            {
                                                "open": 55.29,
                                                "high": 55.45,
                                                "low": 55.22,
                                                "close": 55.23,
                                                "volume": 81692,
                                                "time": "2017-10-30T14:00:00.000Z",
                                                "sma": 54.202
                                            },
                                            {
                                                "open": 55.38,
                                                "high": 55.62,
                                                "low": 55.38,
                                                "close": 55.46,
                                                "volume": 101420,
                                                "time": "2017-10-31T14:00:00.000Z",
                                                "sma": 54.24566666666667
                                            },
                                            {
                                                "open": 55.7,
                                                "high": 55.74,
                                                "low": 55.39,
                                                "close": 55.46,
                                                "volume": 79999,
                                                "time": "2017-11-01T14:00:00.000Z",
                                                "sma": 54.30466666666668
                                            },
                                            {
                                                "open": 55.6,
                                                "high": 55.78,
                                                "low": 55.53,
                                                "close": 55.72,
                                                "volume": 59616,
                                                "time": "2017-11-02T14:00:00.000Z",
                                                "sma": 54.363666666666674
                                            },
                                            {
                                                "open": 55.77,
                                                "high": 55.77,
                                                "low": 55.6,
                                                "close": 55.63,
                                                "volume": 68785,
                                                "time": "2017-11-05T14:00:00.000Z",
                                                "sma": 54.41900000000001
                                            },
                                            {
                                                "open": 55.92,
                                                "high": 56.24,
                                                "low": 55.92,
                                                "close": 56.23,
                                                "volume": 67696,
                                                "time": "2017-11-06T14:00:00.000Z",
                                                "sma": 54.49833333333334
                                            },
                                            {
                                                "open": 56.06,
                                                "high": 56.32,
                                                "low": 56.06,
                                                "close": 56.25,
                                                "volume": 41631,
                                                "time": "2017-11-07T14:00:00.000Z",
                                                "sma": 54.58066666666668
                                            },
                                            {
                                                "open": 56.44,
                                                "high": 56.67,
                                                "low": 56.38,
                                                "close": 56.63,
                                                "volume": 78606,
                                                "time": "2017-11-08T14:00:00.000Z",
                                                "sma": 54.70233333333335
                                            },
                                            {
                                                "open": 56.43,
                                                "high": 56.54,
                                                "low": 56.38,
                                                "close": 56.44,
                                                "volume": 59056,
                                                "time": "2017-11-09T14:00:00.000Z",
                                                "sma": 54.81500000000002
                                            },
                                            {
                                                "open": 56.57,
                                                "high": 56.65,
                                                "low": 56.5,
                                                "close": 56.62,
                                                "volume": 110727,
                                                "time": "2017-11-12T14:00:00.000Z",
                                                "sma": 54.915666666666674
                                            },
                                            {
                                                "open": 56.22,
                                                "high": 56.23,
                                                "low": 55.95,
                                                "close": 56.09,
                                                "volume": 98522,
                                                "time": "2017-11-13T14:00:00.000Z",
                                                "sma": 55.011
                                            },
                                            {
                                                "open": 55.88,
                                                "high": 55.96,
                                                "low": 55.74,
                                                "close": 55.74,
                                                "volume": 103257,
                                                "time": "2017-11-14T14:00:00.000Z",
                                                "sma": 55.10933333333333
                                            },
                                            {
                                                "open": 55.68,
                                                "high": 55.94,
                                                "low": 55.6,
                                                "close": 55.84,
                                                "volume": 43752,
                                                "time": "2017-11-15T14:00:00.000Z",
                                                "sma": 55.210666666666675
                                            },
                                            {
                                                "open": 56.19,
                                                "high": 56.2,
                                                "low": 55.95,
                                                "close": 55.97,
                                                "volume": 47059,
                                                "time": "2017-11-16T14:00:00.000Z",
                                                "sma": 55.29866666666667
                                            },
                                            {
                                                "open": 55.73,
                                                "high": 55.95,
                                                "low": 55.65,
                                                "close": 55.86,
                                                "volume": 46987,
                                                "time": "2017-11-19T14:00:00.000Z",
                                                "sma": 55.37266666666667
                                            },
                                            {
                                                "open": 56.07,
                                                "high": 56.1,
                                                "low": 55.89,
                                                "close": 56.06,
                                                "volume": 49219,
                                                "time": "2017-11-20T14:00:00.000Z",
                                                "sma": 55.45533333333333
                                            },
                                            {
                                                "open": 56.32,
                                                "high": 56.39,
                                                "low": 56.19,
                                                "close": 56.3,
                                                "volume": 56837,
                                                "time": "2017-11-21T14:00:00.000Z",
                                                "sma": 55.53399999999999
                                            },
                                            {
                                                "open": 56.24,
                                                "high": 56.29,
                                                "low": 56.13,
                                                "close": 56.25,
                                                "volume": 50447,
                                                "time": "2017-11-22T14:00:00.000Z",
                                                "sma": 55.60533333333333
                                            },
                                            {
                                                "open": 56.17,
                                                "high": 56.23,
                                                "low": 55.93,
                                                "close": 56.23,
                                                "volume": 47310,
                                                "time": "2017-11-23T14:00:00.000Z",
                                                "sma": 55.66866666666666
                                            },
                                            {
                                                "open": 56.15,
                                                "high": 56.45,
                                                "low": 56.15,
                                                "close": 56.31,
                                                "volume": 59387,
                                                "time": "2017-11-26T14:00:00.000Z",
                                                "sma": 55.72466666666666
                                            },
                                            {
                                                "open": 56.16,
                                                "high": 56.45,
                                                "low": 56.16,
                                                "close": 56.24,
                                                "volume": 785248,
                                                "time": "2017-11-27T14:00:00.000Z",
                                                "sma": 55.765666666666654
                                            },
                                            {
                                                "open": 56.57,
                                                "high": 56.69,
                                                "low": 56.48,
                                                "close": 56.5,
                                                "volume": 165444,
                                                "time": "2017-11-28T14:00:00.000Z",
                                                "sma": 55.81233333333333
                                            },
                                            {
                                                "open": 56.19,
                                                "high": 56.26,
                                                "low": 55.92,
                                                "close": 56.11,
                                                "volume": 304441,
                                                "time": "2017-11-29T14:00:00.000Z",
                                                "sma": 55.847999999999985
                                            },
                                            {
                                                "open": 56.33,
                                                "high": 56.46,
                                                "low": 56.2,
                                                "close": 56.31,
                                                "volume": 55626,
                                                "time": "2017-11-30T14:00:00.000Z",
                                                "sma": 55.88566666666666
                                            },
                                            {
                                                "open": 56.34,
                                                "high": 56.45,
                                                "low": 56.2,
                                                "close": 56.26,
                                                "volume": 54864,
                                                "time": "2017-12-03T14:00:00.000Z",
                                                "sma": 55.92533333333332
                                            },
                                            {
                                                "open": 55.94,
                                                "high": 56.26,
                                                "low": 55.9,
                                                "close": 56.09,
                                                "volume": 66202,
                                                "time": "2017-12-04T14:00:00.000Z",
                                                "sma": 55.95766666666666
                                            },
                                            {
                                                "open": 55.89,
                                                "high": 56.04,
                                                "low": 55.79,
                                                "close": 55.87,
                                                "volume": 123299,
                                                "time": "2017-12-05T14:00:00.000Z",
                                                "sma": 55.98099999999999
                                            },
                                            {
                                                "open": 55.96,
                                                "high": 56.28,
                                                "low": 55.91,
                                                "close": 56.25,
                                                "volume": 47063,
                                                "time": "2017-12-06T14:00:00.000Z",
                                                "sma": 56.01366666666665
                                            },
                                            {
                                                "open": 56.3,
                                                "high": 56.5,
                                                "low": 56.24,
                                                "close": 56.33,
                                                "volume": 102838,
                                                "time": "2017-12-07T14:00:00.000Z",
                                                "sma": 56.05299999999999
                                            },
                                            {
                                                "open": 56.52,
                                                "high": 56.55,
                                                "low": 56.3,
                                                "close": 56.38,
                                                "volume": 44191,
                                                "time": "2017-12-10T14:00:00.000Z",
                                                "sma": 56.088666666666654
                                            },
                                            {
                                                "open": 56.47,
                                                "high": 56.57,
                                                "low": 56.39,
                                                "close": 56.52,
                                                "volume": 63047,
                                                "time": "2017-12-11T14:00:00.000Z",
                                                "sma": 56.13166666666665
                                            },
                                            {
                                                "open": 56.6,
                                                "high": 56.67,
                                                "low": 56.41,
                                                "close": 56.58,
                                                "volume": 114145,
                                                "time": "2017-12-12T14:00:00.000Z",
                                                "sma": 56.16899999999998
                                            },
                                            {
                                                "open": 56.74,
                                                "high": 56.84,
                                                "low": 56.53,
                                                "close": 56.53,
                                                "volume": 119652,
                                                "time": "2017-12-13T14:00:00.000Z",
                                                "sma": 56.204666666666654
                                            },
                                            {
                                                "open": 56.43,
                                                "high": 56.48,
                                                "low": 56.28,
                                                "close": 56.35,
                                                "volume": 70681,
                                                "time": "2017-12-14T14:00:00.000Z",
                                                "sma": 56.22566666666665
                                            },
                                            {
                                                "open": 56.65,
                                                "high": 56.79,
                                                "low": 56.57,
                                                "close": 56.76,
                                                "volume": 52818,
                                                "time": "2017-12-17T14:00:00.000Z",
                                                "sma": 56.26333333333332
                                            },
                                            {
                                                "open": 56.95,
                                                "high": 57.17,
                                                "low": 56.95,
                                                "close": 57.06,
                                                "volume": 62356,
                                                "time": "2017-12-18T14:00:00.000Z",
                                                "sma": 56.29099999999998
                                            },
                                            {
                                                "open": 56.9,
                                                "high": 57.19,
                                                "low": 56.9,
                                                "close": 57.1,
                                                "volume": 173303,
                                                "time": "2017-12-19T14:00:00.000Z",
                                                "sma": 56.319333333333326
                                            },
                                            {
                                                "open": 56.92,
                                                "high": 56.97,
                                                "low": 56.88,
                                                "close": 56.89,
                                                "volume": 422205,
                                                "time": "2017-12-20T14:00:00.000Z",
                                                "sma": 56.327999999999996
                                            },
                                            {
                                                "open": 57.06,
                                                "high": 57.16,
                                                "low": 57,
                                                "close": 57,
                                                "volume": 214591,
                                                "time": "2017-12-21T14:00:00.000Z",
                                                "sma": 56.346666666666664
                                            },
                                            {
                                                "open": 57.17,
                                                "high": 57.25,
                                                "low": 57,
                                                "close": 57,
                                                "volume": 92219,
                                                "time": "2017-12-26T14:00:00.000Z",
                                                "sma": 56.35933333333333
                                            },
                                            {
                                                "open": 57.11,
                                                "high": 57.11,
                                                "low": 56.57,
                                                "close": 56.79,
                                                "volume": 50671,
                                                "time": "2017-12-27T14:00:00.000Z",
                                                "sma": 56.38266666666666
                                            },
                                            {
                                                "open": 56.81,
                                                "high": 56.81,
                                                "low": 56.42,
                                                "close": 56.57,
                                                "volume": 432777,
                                                "time": "2017-12-28T14:00:00.000Z",
                                                "sma": 56.41033333333333
                                            }
                                        ]
                                    },
                                    "plotConfig": {
                                        "legend": {
                                            "show": true
                                        },
                                        "chartType": "line",
                                        "width": "100%",
                                        "height": "100%",
                                        "y": {
                                            "min": 52.79,
                                            "max": 57.1
                                        },
                                        "y2": {}
                                    },
                                    "axisMap": {
                                        "y": [
                                            {
                                                "series": "close"
                                            },
                                            {
                                                "series": "sma"
                                            }
                                        ],
                                        "y2": []
                                    }
                                },
                                "displayType": "chart"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "922d5540-daf4-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Define your trading strategy\r\n\r\nIt's time to define our trading strategy. A [Grademark](https://github.com/ashleydavis/grademark) strategy is a simple JavaScript object that defines rules for entry and exit. We are going to enter a position when the price is below average and then exit as soon as the price is above average. I told you this was a simple strategy!\r\n\r\nWe also set a 2% stop loss that will help limit our losses for trades that go against us.",
                "lastEvaluationDate": "2018-11-16T15:53:20.125+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "1f799622-d370-11e8-b62a-7b63438e3c42",
                "cellType": "code",
                "cellScope": "global",
                "code": "const { backtest, analyze, computeEquityCurve, computeDrawdown } = require('grademark');\r\n\r\nconst strategy = {\r\n    entryRule: (enterPosition, args) => {\r\n        if (args.bar.close < args.bar.sma) { // Buy when price is below average.\r\n            enterPosition();\r\n        }\r\n    },\r\n\r\n    exitRule: (exitPosition, args) => {\r\n        if (args.bar.close > args.bar.sma) {\r\n            exitPosition(); // Sell when price is above average.\r\n        }\r\n    },\r\n\r\n    stopLoss: args => { // Intrabar stop loss.\r\n        return args.entryPrice * (2 / 100); // Stop out on 2% loss from entry price.\r\n    },\r\n};",
                "lastEvaluationDate": "2019-04-25T11:19:05.040+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "54a7e760-daf6-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Backtest your strategy\r\n\r\nNow that we have a strategy we can simulate trading it on historical data and see how it performs!\r\n\r\nCalling the `backtest` function gives us the collection of trades that would have been executed on the historical data according to the strategy that we defined.",
                "lastEvaluationDate": "2018-11-16T15:53:20.133+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "55500e40-daf6-11e8-831f-d150615bd7aa",
                "cellType": "code",
                "cellScope": "global",
                "code": "const trades = backtest(strategy, inputSeries);\r\ndisplay(\"# trades: \" + trades.count());\r\ndisplay(trades.head(5));",
                "lastEvaluationDate": "2019-04-25T11:19:05.044+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": "# trades: 61",
                                "displayType": "string"
                            }
                        ]
                    },
                    {
                        "values": [
                            {
                                "data": {
                                    "columnOrder": [
                                        "entryTime",
                                        "entryPrice",
                                        "exitTime",
                                        "exitPrice",
                                        "profit",
                                        "profitPct",
                                        "growth",
                                        "riskPct",
                                        "riskSeries",
                                        "rmultiple",
                                        "holdingPeriod",
                                        "exitReason",
                                        "stopPrice",
                                        "stopPriceSeries",
                                        "profitTarget"
                                    ],
                                    "columns": {
                                        "entryTime": "date",
                                        "entryPrice": "number",
                                        "exitTime": "date",
                                        "exitPrice": "number",
                                        "profit": "number",
                                        "profitPct": "number",
                                        "growth": "number",
                                        "riskPct": "number",
                                        "riskSeries": "undefined",
                                        "rmultiple": "number",
                                        "holdingPeriod": "number",
                                        "exitReason": "string",
                                        "stopPrice": "number",
                                        "stopPriceSeries": "undefined",
                                        "profitTarget": "undefined"
                                    },
                                    "index": {
                                        "type": "number",
                                        "values": [
                                            0,
                                            1,
                                            2,
                                            3,
                                            4
                                        ]
                                    },
                                    "values": [
                                        {
                                            "entryTime": "2015-03-11T14:00:00.000Z",
                                            "entryPrice": 54.17,
                                            "exitTime": "2015-03-15T14:00:00.000Z",
                                            "exitPrice": 54.38,
                                            "profit": 0.21000000000000085,
                                            "profitPct": 0.38766845117223714,
                                            "growth": 1.0038766845117224,
                                            "riskPct": 1.9999999999999951,
                                            "rmultiple": 0.193834225586119,
                                            "holdingPeriod": 1,
                                            "exitReason": "exit-rule",
                                            "stopPrice": 53.086600000000004
                                        },
                                        {
                                            "entryTime": "2015-03-30T14:00:00.000Z",
                                            "entryPrice": 55.5,
                                            "exitTime": "2015-04-06T14:00:00.000Z",
                                            "exitPrice": 55.76,
                                            "profit": 0.259999999999998,
                                            "profitPct": 0.4684684684684649,
                                            "growth": 1.0046846846846846,
                                            "riskPct": 1.9999999999999991,
                                            "rmultiple": 0.23423423423423256,
                                            "holdingPeriod": 2,
                                            "exitReason": "exit-rule",
                                            "stopPrice": 54.39
                                        },
                                        {
                                            "entryTime": "2015-04-19T14:00:00.000Z",
                                            "entryPrice": 54.99,
                                            "exitTime": "2015-04-26T14:00:00.000Z",
                                            "exitPrice": 55.86,
                                            "profit": 0.8699999999999974,
                                            "profitPct": 1.5821058374249817,
                                            "growth": 1.0158210583742497,
                                            "riskPct": 2.0000000000000036,
                                            "rmultiple": 0.7910529187124895,
                                            "holdingPeriod": 4,
                                            "exitReason": "exit-rule",
                                            "stopPrice": 53.8902
                                        },
                                        {
                                            "entryTime": "2015-04-29T14:00:00.000Z",
                                            "entryPrice": 54.37,
                                            "exitTime": "2015-05-06T14:00:00.000Z",
                                            "exitPrice": 53.282599999999995,
                                            "profit": -1.0874000000000024,
                                            "profitPct": -2.0000000000000044,
                                            "growth": 0.98,
                                            "riskPct": 2.0000000000000044,
                                            "rmultiple": -1,
                                            "holdingPeriod": 4,
                                            "exitReason": "stop-loss",
                                            "stopPrice": 53.282599999999995
                                        },
                                        {
                                            "entryTime": "2015-05-10T14:00:00.000Z",
                                            "entryPrice": 53.4,
                                            "exitTime": "2015-05-26T14:00:00.000Z",
                                            "exitPrice": 54.23,
                                            "profit": 0.8299999999999983,
                                            "profitPct": 1.5543071161048658,
                                            "growth": 1.0155430711610487,
                                            "riskPct": 1.9999999999999958,
                                            "rmultiple": 0.7771535580524345,
                                            "holdingPeriod": 11,
                                            "exitReason": "exit-rule",
                                            "stopPrice": 52.332
                                        }
                                    ]
                                },
                                "displayType": "dataframe"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "95aa5c20-daf6-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Plot your trades\r\n\r\nLet's plot the profit on our trades to visualize what they look like... you can see that all the losing trades are clamped to 2%, that shows that our stop loss is working.\r\n\r\nYou might notice that one loss is greater than 2%, that's actually because there was gap down that triggered the stop loss and caused it to be greater than expected.",
                "lastEvaluationDate": "2018-11-16T15:53:20.141+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "ae3206e0-d50f-11e8-9de5-774a0a7a5ea4",
                "cellType": "code",
                "cellScope": "global",
                "code": "display(trades.plot({ chartType: \"bar\" }, { y: \"profitPct\" }));",
                "lastEvaluationDate": "2019-04-25T11:19:05.050+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "data": {
                                        "columnOrder": [
                                            "entryTime",
                                            "entryPrice",
                                            "exitTime",
                                            "exitPrice",
                                            "profit",
                                            "profitPct",
                                            "growth",
                                            "riskPct",
                                            "riskSeries",
                                            "rmultiple",
                                            "holdingPeriod",
                                            "exitReason",
                                            "stopPrice",
                                            "stopPriceSeries",
                                            "profitTarget"
                                        ],
                                        "columns": {
                                            "entryTime": "date",
                                            "entryPrice": "number",
                                            "exitTime": "date",
                                            "exitPrice": "number",
                                            "profit": "number",
                                            "profitPct": "number",
                                            "growth": "number",
                                            "riskPct": "number",
                                            "riskSeries": "undefined",
                                            "rmultiple": "number",
                                            "holdingPeriod": "number",
                                            "exitReason": "string",
                                            "stopPrice": "number",
                                            "stopPriceSeries": "undefined",
                                            "profitTarget": "undefined"
                                        },
                                        "index": {
                                            "type": "number",
                                            "values": [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                                6,
                                                7,
                                                8,
                                                9,
                                                10,
                                                11,
                                                12,
                                                13,
                                                14,
                                                15,
                                                16,
                                                17,
                                                18,
                                                19,
                                                20,
                                                21,
                                                22,
                                                23,
                                                24,
                                                25,
                                                26,
                                                27,
                                                28,
                                                29,
                                                30,
                                                31,
                                                32,
                                                33,
                                                34,
                                                35,
                                                36,
                                                37,
                                                38,
                                                39,
                                                40,
                                                41,
                                                42,
                                                43,
                                                44,
                                                45,
                                                46,
                                                47,
                                                48,
                                                49,
                                                50,
                                                51,
                                                52,
                                                53,
                                                54,
                                                55,
                                                56,
                                                57,
                                                58,
                                                59,
                                                60
                                            ]
                                        },
                                        "values": [
                                            {
                                                "entryTime": "2015-03-11T14:00:00.000Z",
                                                "entryPrice": 54.17,
                                                "exitTime": "2015-03-15T14:00:00.000Z",
                                                "exitPrice": 54.38,
                                                "profit": 0.21000000000000085,
                                                "profitPct": 0.38766845117223714,
                                                "growth": 1.0038766845117224,
                                                "riskPct": 1.9999999999999951,
                                                "rmultiple": 0.193834225586119,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 53.086600000000004
                                            },
                                            {
                                                "entryTime": "2015-03-30T14:00:00.000Z",
                                                "entryPrice": 55.5,
                                                "exitTime": "2015-04-06T14:00:00.000Z",
                                                "exitPrice": 55.76,
                                                "profit": 0.259999999999998,
                                                "profitPct": 0.4684684684684649,
                                                "growth": 1.0046846846846846,
                                                "riskPct": 1.9999999999999991,
                                                "rmultiple": 0.23423423423423256,
                                                "holdingPeriod": 2,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 54.39
                                            },
                                            {
                                                "entryTime": "2015-04-19T14:00:00.000Z",
                                                "entryPrice": 54.99,
                                                "exitTime": "2015-04-26T14:00:00.000Z",
                                                "exitPrice": 55.86,
                                                "profit": 0.8699999999999974,
                                                "profitPct": 1.5821058374249817,
                                                "growth": 1.0158210583742497,
                                                "riskPct": 2.0000000000000036,
                                                "rmultiple": 0.7910529187124895,
                                                "holdingPeriod": 4,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 53.8902
                                            },
                                            {
                                                "entryTime": "2015-04-29T14:00:00.000Z",
                                                "entryPrice": 54.37,
                                                "exitTime": "2015-05-06T14:00:00.000Z",
                                                "exitPrice": 53.282599999999995,
                                                "profit": -1.0874000000000024,
                                                "profitPct": -2.0000000000000044,
                                                "growth": 0.98,
                                                "riskPct": 2.0000000000000044,
                                                "rmultiple": -1,
                                                "holdingPeriod": 4,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 53.282599999999995
                                            },
                                            {
                                                "entryTime": "2015-05-10T14:00:00.000Z",
                                                "entryPrice": 53.4,
                                                "exitTime": "2015-05-26T14:00:00.000Z",
                                                "exitPrice": 54.23,
                                                "profit": 0.8299999999999983,
                                                "profitPct": 1.5543071161048658,
                                                "growth": 1.0155430711610487,
                                                "riskPct": 1.9999999999999958,
                                                "rmultiple": 0.7771535580524345,
                                                "holdingPeriod": 11,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.332
                                            },
                                            {
                                                "entryTime": "2015-05-28T14:00:00.000Z",
                                                "entryPrice": 54.26,
                                                "exitTime": "2015-06-02T14:00:00.000Z",
                                                "exitPrice": 53.1748,
                                                "profit": -1.0852000000000004,
                                                "profitPct": -2.000000000000001,
                                                "growth": 0.98,
                                                "riskPct": 2.000000000000001,
                                                "rmultiple": -1,
                                                "holdingPeriod": 2,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 53.1748
                                            },
                                            {
                                                "entryTime": "2015-06-04T14:00:00.000Z",
                                                "entryPrice": 51.84,
                                                "exitTime": "2015-06-23T14:00:00.000Z",
                                                "exitPrice": 53.77,
                                                "profit": 1.9299999999999997,
                                                "profitPct": 3.722993827160493,
                                                "growth": 1.037229938271605,
                                                "riskPct": 1.9999999999999991,
                                                "rmultiple": 1.8614969135802475,
                                                "holdingPeriod": 11,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 50.803200000000004
                                            },
                                            {
                                                "entryTime": "2015-06-28T14:00:00.000Z",
                                                "entryPrice": 51.52,
                                                "exitTime": "2015-06-29T14:00:00.000Z",
                                                "exitPrice": 50.4896,
                                                "profit": -1.0304000000000002,
                                                "profitPct": -2.0000000000000004,
                                                "growth": 0.98,
                                                "riskPct": 2.0000000000000004,
                                                "rmultiple": -1,
                                                "holdingPeriod": 0,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 50.4896
                                            },
                                            {
                                                "entryTime": "2015-07-01T14:00:00.000Z",
                                                "entryPrice": 51.68,
                                                "exitTime": "2015-07-08T14:00:00.000Z",
                                                "exitPrice": 50.6464,
                                                "profit": -1.0335999999999999,
                                                "profitPct": -1.9999999999999998,
                                                "growth": 0.98,
                                                "riskPct": 1.9999999999999998,
                                                "rmultiple": -1,
                                                "holdingPeriod": 4,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 50.6464
                                            },
                                            {
                                                "entryTime": "2015-07-12T14:00:00.000Z",
                                                "entryPrice": 51.28,
                                                "exitTime": "2015-07-15T14:00:00.000Z",
                                                "exitPrice": 52.95,
                                                "profit": 1.6700000000000017,
                                                "profitPct": 3.2566302652106116,
                                                "growth": 1.0325663026521061,
                                                "riskPct": 1.9999999999999944,
                                                "rmultiple": 1.6283151326053102,
                                                "holdingPeriod": 2,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 50.254400000000004
                                            },
                                            {
                                                "entryTime": "2015-07-23T14:00:00.000Z",
                                                "entryPrice": 51.87,
                                                "exitTime": "2015-07-29T14:00:00.000Z",
                                                "exitPrice": 52.8,
                                                "profit": 0.9299999999999997,
                                                "profitPct": 1.7929438982070556,
                                                "growth": 1.0179294389820706,
                                                "riskPct": 1.9999999999999967,
                                                "rmultiple": 0.8964719491035295,
                                                "holdingPeriod": 3,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 50.8326
                                            },
                                            {
                                                "entryTime": "2015-08-09T14:00:00.000Z",
                                                "entryPrice": 50.99,
                                                "exitTime": "2015-08-11T14:00:00.000Z",
                                                "exitPrice": 49.970200000000006,
                                                "profit": -1.0197999999999965,
                                                "profitPct": -1.9999999999999931,
                                                "growth": 0.9800000000000001,
                                                "riskPct": 1.9999999999999931,
                                                "rmultiple": -1,
                                                "holdingPeriod": 1,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 49.970200000000006
                                            },
                                            {
                                                "entryTime": "2015-08-13T14:00:00.000Z",
                                                "entryPrice": 50.22,
                                                "exitTime": "2015-08-20T14:00:00.000Z",
                                                "exitPrice": 49.2156,
                                                "profit": -1.0043999999999969,
                                                "profitPct": -1.9999999999999938,
                                                "growth": 0.9800000000000001,
                                                "riskPct": 1.9999999999999938,
                                                "rmultiple": -1,
                                                "holdingPeriod": 4,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 49.2156
                                            },
                                            {
                                                "entryTime": "2015-08-24T14:00:00.000Z",
                                                "entryPrice": 45.73,
                                                "exitTime": "2015-09-20T14:00:00.000Z",
                                                "exitPrice": 48.09,
                                                "profit": 2.3600000000000065,
                                                "profitPct": 5.160726000437364,
                                                "growth": 1.0516072600043735,
                                                "riskPct": 2.0000000000000004,
                                                "rmultiple": 2.5803630002186817,
                                                "holdingPeriod": 18,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 44.8154
                                            },
                                            {
                                                "entryTime": "2015-09-22T14:00:00.000Z",
                                                "entryPrice": 47.64,
                                                "exitTime": "2015-09-28T14:00:00.000Z",
                                                "exitPrice": 47.37,
                                                "profit": -0.2700000000000031,
                                                "profitPct": -0.5667506297229284,
                                                "growth": 0.9943324937027708,
                                                "riskPct": 2.000000000000007,
                                                "rmultiple": -0.2833753148614632,
                                                "holdingPeriod": 3,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 46.6872
                                            },
                                            {
                                                "entryTime": "2015-09-30T14:00:00.000Z",
                                                "entryPrice": 47.69,
                                                "exitTime": "2015-10-05T14:00:00.000Z",
                                                "exitPrice": 49.2,
                                                "profit": 1.5100000000000051,
                                                "profitPct": 3.1662822394632104,
                                                "growth": 1.031662822394632,
                                                "riskPct": 2.0000000000000027,
                                                "rmultiple": 1.5831411197316034,
                                                "holdingPeriod": 2,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 46.7362
                                            },
                                            {
                                                "entryTime": "2015-11-02T14:00:00.000Z",
                                                "entryPrice": 49.38,
                                                "exitTime": "2015-11-04T14:00:00.000Z",
                                                "exitPrice": 49.74,
                                                "profit": 0.35999999999999943,
                                                "profitPct": 0.7290400972053451,
                                                "growth": 1.0072904009720534,
                                                "riskPct": 2.000000000000001,
                                                "rmultiple": 0.3645200486026724,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 48.3924
                                            },
                                            {
                                                "entryTime": "2015-11-09T14:00:00.000Z",
                                                "entryPrice": 48.49,
                                                "exitTime": "2015-11-15T14:00:00.000Z",
                                                "exitPrice": 47.5202,
                                                "profit": -0.9697999999999993,
                                                "profitPct": -1.9999999999999987,
                                                "growth": 0.98,
                                                "riskPct": 1.9999999999999987,
                                                "rmultiple": -1,
                                                "holdingPeriod": 3,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 47.5202
                                            },
                                            {
                                                "entryTime": "2015-11-17T14:00:00.000Z",
                                                "entryPrice": 48.56,
                                                "exitTime": "2015-11-19T14:00:00.000Z",
                                                "exitPrice": 50,
                                                "profit": 1.4399999999999977,
                                                "profitPct": 2.9654036243822026,
                                                "growth": 1.029654036243822,
                                                "riskPct": 2.000000000000006,
                                                "rmultiple": 1.4827018121910966,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 47.5888
                                            },
                                            {
                                                "entryTime": "2015-11-30T14:00:00.000Z",
                                                "entryPrice": 49.28,
                                                "exitTime": "2015-12-02T14:00:00.000Z",
                                                "exitPrice": 49.73,
                                                "profit": 0.44999999999999574,
                                                "profitPct": 0.9131493506493419,
                                                "growth": 1.0091314935064934,
                                                "riskPct": 1.9999999999999958,
                                                "rmultiple": 0.4565746753246719,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 48.2944
                                            },
                                            {
                                                "entryTime": "2015-12-06T14:00:00.000Z",
                                                "entryPrice": 49.89,
                                                "exitTime": "2015-12-07T14:00:00.000Z",
                                                "exitPrice": 48.8922,
                                                "profit": -0.997799999999998,
                                                "profitPct": -1.9999999999999958,
                                                "growth": 0.9800000000000001,
                                                "riskPct": 1.9999999999999958,
                                                "rmultiple": -1,
                                                "holdingPeriod": 0,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 48.8922
                                            },
                                            {
                                                "entryTime": "2015-12-09T14:00:00.000Z",
                                                "entryPrice": 48.32,
                                                "exitTime": "2015-12-13T14:00:00.000Z",
                                                "exitPrice": 47.3536,
                                                "profit": -0.9664000000000001,
                                                "profitPct": -2.0000000000000004,
                                                "growth": 0.98,
                                                "riskPct": 2.0000000000000004,
                                                "rmultiple": -1,
                                                "holdingPeriod": 1,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 47.3536
                                            },
                                            {
                                                "entryTime": "2015-12-15T14:00:00.000Z",
                                                "entryPrice": 47.32,
                                                "exitTime": "2015-12-23T14:00:00.000Z",
                                                "exitPrice": 49.59,
                                                "profit": 2.270000000000003,
                                                "profitPct": 4.797125950972111,
                                                "growth": 1.047971259509721,
                                                "riskPct": 1.9999999999999938,
                                                "rmultiple": 2.398562975486063,
                                                "holdingPeriod": 5,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 46.3736
                                            },
                                            {
                                                "entryTime": "2016-01-05T14:00:00.000Z",
                                                "entryPrice": 48.65,
                                                "exitTime": "2016-01-06T14:00:00.000Z",
                                                "exitPrice": 47.677,
                                                "profit": -0.972999999999999,
                                                "profitPct": -1.999999999999998,
                                                "growth": 0.98,
                                                "riskPct": 1.999999999999998,
                                                "rmultiple": -1,
                                                "holdingPeriod": 0,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 47.677
                                            },
                                            {
                                                "entryTime": "2016-01-10T14:00:00.000Z",
                                                "entryPrice": 45.86,
                                                "exitTime": "2016-01-17T14:00:00.000Z",
                                                "exitPrice": 44.9428,
                                                "profit": -0.9172000000000011,
                                                "profitPct": -2.0000000000000027,
                                                "growth": 0.98,
                                                "riskPct": 2.0000000000000027,
                                                "rmultiple": -1,
                                                "holdingPeriod": 4,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 44.9428
                                            },
                                            {
                                                "entryTime": "2016-01-19T14:00:00.000Z",
                                                "entryPrice": 45.7,
                                                "exitTime": "2016-02-09T14:00:00.000Z",
                                                "exitPrice": 44.786,
                                                "profit": -0.9140000000000015,
                                                "profitPct": -2.000000000000003,
                                                "growth": 0.98,
                                                "riskPct": 2.000000000000003,
                                                "rmultiple": -1,
                                                "holdingPeriod": 13,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 44.786
                                            },
                                            {
                                                "entryTime": "2016-02-11T14:00:00.000Z",
                                                "entryPrice": 44.63,
                                                "exitTime": "2016-02-18T14:00:00.000Z",
                                                "exitPrice": 46.66,
                                                "profit": 2.029999999999994,
                                                "profitPct": 4.5485099708715975,
                                                "growth": 1.045485099708716,
                                                "riskPct": 2.0000000000000036,
                                                "rmultiple": 2.2742549854357947,
                                                "holdingPeriod": 4,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 43.7374
                                            },
                                            {
                                                "entryTime": "2016-02-24T14:00:00.000Z",
                                                "entryPrice": 46.08,
                                                "exitTime": "2016-03-01T14:00:00.000Z",
                                                "exitPrice": 47.09,
                                                "profit": 1.0100000000000051,
                                                "profitPct": 2.1918402777777892,
                                                "growth": 1.021918402777778,
                                                "riskPct": 1.9999999999999956,
                                                "rmultiple": 1.0959201388888968,
                                                "holdingPeriod": 3,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 45.1584
                                            },
                                            {
                                                "entryTime": "2016-03-29T14:00:00.000Z",
                                                "entryPrice": 47.73,
                                                "exitTime": "2016-03-31T14:00:00.000Z",
                                                "exitPrice": 47.7,
                                                "profit": -0.02999999999999403,
                                                "profitPct": -0.06285355122563174,
                                                "growth": 0.9993714644877437,
                                                "riskPct": 1.9999999999999987,
                                                "rmultiple": -0.0314267756128159,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 46.7754
                                            },
                                            {
                                                "entryTime": "2016-04-04T14:00:00.000Z",
                                                "entryPrice": 47.15,
                                                "exitTime": "2016-04-14T14:00:00.000Z",
                                                "exitPrice": 48.35,
                                                "profit": 1.2000000000000028,
                                                "profitPct": 2.545068928950165,
                                                "growth": 1.0254506892895017,
                                                "riskPct": 1.9999999999999956,
                                                "rmultiple": 1.2725344644750856,
                                                "holdingPeriod": 7,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 46.207
                                            },
                                            {
                                                "entryTime": "2016-06-02T14:00:00.000Z",
                                                "entryPrice": 50.59,
                                                "exitTime": "2016-06-06T14:00:00.000Z",
                                                "exitPrice": 51.06,
                                                "profit": 0.46999999999999886,
                                                "profitPct": 0.9290373591618875,
                                                "growth": 1.0092903735916188,
                                                "riskPct": 2.0000000000000018,
                                                "rmultiple": 0.4645186795809433,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 49.5782
                                            },
                                            {
                                                "entryTime": "2016-06-13T14:00:00.000Z",
                                                "entryPrice": 49.76,
                                                "exitTime": "2016-06-23T14:00:00.000Z",
                                                "exitPrice": 48.7648,
                                                "profit": -0.995199999999997,
                                                "profitPct": -1.9999999999999942,
                                                "growth": 0.9800000000000001,
                                                "riskPct": 1.9999999999999942,
                                                "rmultiple": -1,
                                                "holdingPeriod": 7,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 48.7648
                                            },
                                            {
                                                "entryTime": "2016-06-27T14:00:00.000Z",
                                                "entryPrice": 48.22,
                                                "exitTime": "2016-07-11T14:00:00.000Z",
                                                "exitPrice": 50.32,
                                                "profit": 2.1000000000000014,
                                                "profitPct": 4.355039402737456,
                                                "growth": 1.0435503940273745,
                                                "riskPct": 1.9999999999999951,
                                                "rmultiple": 2.1775197013687335,
                                                "holdingPeriod": 9,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 47.2556
                                            },
                                            {
                                                "entryTime": "2016-08-29T14:00:00.000Z",
                                                "entryPrice": 52,
                                                "exitTime": "2016-09-01T14:00:00.000Z",
                                                "exitPrice": 50.96,
                                                "profit": -1.0399999999999991,
                                                "profitPct": -1.9999999999999982,
                                                "growth": 0.98,
                                                "riskPct": 1.9999999999999982,
                                                "rmultiple": -1,
                                                "holdingPeriod": 2,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 50.96
                                            },
                                            {
                                                "entryTime": "2016-09-05T14:00:00.000Z",
                                                "entryPrice": 51.24,
                                                "exitTime": "2016-09-11T14:00:00.000Z",
                                                "exitPrice": 50.2152,
                                                "profit": -1.024799999999999,
                                                "profitPct": -1.999999999999998,
                                                "growth": 0.98,
                                                "riskPct": 1.999999999999998,
                                                "rmultiple": -1,
                                                "holdingPeriod": 3,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 50.2152
                                            },
                                            {
                                                "entryTime": "2016-09-13T14:00:00.000Z",
                                                "entryPrice": 49.2,
                                                "exitTime": "2016-09-22T14:00:00.000Z",
                                                "exitPrice": 51.14,
                                                "profit": 1.9399999999999977,
                                                "profitPct": 3.943089430894304,
                                                "growth": 1.039430894308943,
                                                "riskPct": 2.0000000000000036,
                                                "rmultiple": 1.9715447154471486,
                                                "holdingPeriod": 6,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 48.216
                                            },
                                            {
                                                "entryTime": "2016-10-02T14:00:00.000Z",
                                                "entryPrice": 51.01,
                                                "exitTime": "2016-10-04T14:00:00.000Z",
                                                "exitPrice": 51.1,
                                                "profit": 0.09000000000000341,
                                                "profitPct": 0.17643599294256698,
                                                "growth": 1.0017643599294257,
                                                "riskPct": 2.0000000000000053,
                                                "rmultiple": 0.08821799647128326,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 49.989799999999995
                                            },
                                            {
                                                "entryTime": "2016-10-13T14:00:00.000Z",
                                                "entryPrice": 50.86,
                                                "exitTime": "2016-10-19T14:00:00.000Z",
                                                "exitPrice": 50.91,
                                                "profit": 0.04999999999999716,
                                                "profitPct": 0.09830908375933378,
                                                "growth": 1.0009830908375934,
                                                "riskPct": 2.000000000000005,
                                                "rmultiple": 0.049154541879666766,
                                                "holdingPeriod": 3,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 49.8428
                                            },
                                            {
                                                "entryTime": "2016-10-24T14:00:00.000Z",
                                                "entryPrice": 50.67,
                                                "exitTime": "2016-10-26T14:00:00.000Z",
                                                "exitPrice": 49.656600000000005,
                                                "profit": -1.0133999999999972,
                                                "profitPct": -1.9999999999999944,
                                                "growth": 0.9800000000000001,
                                                "riskPct": 1.9999999999999944,
                                                "rmultiple": -1,
                                                "holdingPeriod": 1,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 49.656600000000005
                                            },
                                            {
                                                "entryTime": "2016-10-30T14:00:00.000Z",
                                                "entryPrice": 49.35,
                                                "exitTime": "2016-11-08T14:00:00.000Z",
                                                "exitPrice": 48.363,
                                                "profit": -0.9870000000000019,
                                                "profitPct": -2.000000000000004,
                                                "growth": 0.98,
                                                "riskPct": 2.000000000000004,
                                                "rmultiple": -1,
                                                "holdingPeriod": 6,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 48.363
                                            },
                                            {
                                                "entryTime": "2016-11-10T14:00:00.000Z",
                                                "entryPrice": 50.09,
                                                "exitTime": "2016-11-14T14:00:00.000Z",
                                                "exitPrice": 50.13,
                                                "profit": 0.03999999999999915,
                                                "profitPct": 0.0798562587342766,
                                                "growth": 1.0007985625873428,
                                                "riskPct": 2.0000000000000058,
                                                "rmultiple": 0.03992812936713818,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 49.0882
                                            },
                                            {
                                                "entryTime": "2016-11-16T14:00:00.000Z",
                                                "entryPrice": 49.78,
                                                "exitTime": "2016-11-20T14:00:00.000Z",
                                                "exitPrice": 50.37,
                                                "profit": 0.5899999999999963,
                                                "profitPct": 1.1852149457613426,
                                                "growth": 1.0118521494576134,
                                                "riskPct": 2.000000000000006,
                                                "rmultiple": 0.5926074728806694,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 48.7844
                                            },
                                            {
                                                "entryTime": "2017-01-22T14:00:00.000Z",
                                                "entryPrice": 53.09,
                                                "exitTime": "2017-01-29T14:00:00.000Z",
                                                "exitPrice": 53.11,
                                                "profit": 0.01999999999999602,
                                                "profitPct": 0.037671877943107966,
                                                "growth": 1.000376718779431,
                                                "riskPct": 1.9999999999999962,
                                                "rmultiple": 0.018835938971554018,
                                                "holdingPeriod": 3,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.028200000000005
                                            },
                                            {
                                                "entryTime": "2017-01-31T14:00:00.000Z",
                                                "entryPrice": 52.6,
                                                "exitTime": "2017-02-12T14:00:00.000Z",
                                                "exitPrice": 53.57,
                                                "profit": 0.9699999999999989,
                                                "profitPct": 1.8441064638783249,
                                                "growth": 1.0184410646387831,
                                                "riskPct": 1.9999999999999993,
                                                "rmultiple": 0.9220532319391628,
                                                "holdingPeriod": 7,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 51.548
                                            },
                                            {
                                                "entryTime": "2017-03-22T14:00:00.000Z",
                                                "entryPrice": 53.85,
                                                "exitTime": "2017-03-26T14:00:00.000Z",
                                                "exitPrice": 53.99,
                                                "profit": 0.14000000000000057,
                                                "profitPct": 0.2599814298978655,
                                                "growth": 1.0025998142989787,
                                                "riskPct": 1.9999999999999967,
                                                "rmultiple": 0.12999071494893297,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.773
                                            },
                                            {
                                                "entryTime": "2017-04-19T14:00:00.000Z",
                                                "entryPrice": 54.68,
                                                "exitTime": "2017-04-23T14:00:00.000Z",
                                                "exitPrice": 55.24,
                                                "profit": 0.5600000000000023,
                                                "profitPct": 1.0241404535479193,
                                                "growth": 1.0102414045354793,
                                                "riskPct": 2.000000000000004,
                                                "rmultiple": 0.5120702267739586,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 53.5864
                                            },
                                            {
                                                "entryTime": "2017-05-07T14:00:00.000Z",
                                                "entryPrice": 55.41,
                                                "exitTime": "2017-05-10T14:00:00.000Z",
                                                "exitPrice": 55.47,
                                                "profit": 0.060000000000002274,
                                                "profitPct": 0.10828370330265705,
                                                "growth": 1.0010828370330265,
                                                "riskPct": 1.9999999999999938,
                                                "rmultiple": 0.0541418516513287,
                                                "holdingPeriod": 2,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 54.3018
                                            },
                                            {
                                                "entryTime": "2017-05-14T14:00:00.000Z",
                                                "entryPrice": 54.6,
                                                "exitTime": "2017-06-06T14:00:00.000Z",
                                                "exitPrice": 53.508,
                                                "profit": -1.0919999999999987,
                                                "profitPct": -1.9999999999999976,
                                                "growth": 0.98,
                                                "riskPct": 1.9999999999999976,
                                                "rmultiple": -1,
                                                "holdingPeriod": 16,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 53.508
                                            },
                                            {
                                                "entryTime": "2017-06-08T14:00:00.000Z",
                                                "entryPrice": 53.39,
                                                "exitTime": "2017-06-13T14:00:00.000Z",
                                                "exitPrice": 54.63,
                                                "profit": 1.240000000000002,
                                                "profitPct": 2.3225323094212436,
                                                "growth": 1.0232253230942125,
                                                "riskPct": 1.999999999999997,
                                                "rmultiple": 1.1612661547106238,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.3222
                                            },
                                            {
                                                "entryTime": "2017-06-15T14:00:00.000Z",
                                                "entryPrice": 54.52,
                                                "exitTime": "2017-06-19T14:00:00.000Z",
                                                "exitPrice": 54.81,
                                                "profit": 0.28999999999999915,
                                                "profitPct": 0.5319148936170197,
                                                "growth": 1.0053191489361701,
                                                "riskPct": 2.0000000000000044,
                                                "rmultiple": 0.26595744680850925,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 53.4296
                                            },
                                            {
                                                "entryTime": "2017-06-21T14:00:00.000Z",
                                                "entryPrice": 53.64,
                                                "exitTime": "2017-06-28T14:00:00.000Z",
                                                "exitPrice": 54.21,
                                                "profit": 0.5700000000000003,
                                                "profitPct": 1.0626398210290833,
                                                "growth": 1.0106263982102908,
                                                "riskPct": 2.0000000000000013,
                                                "rmultiple": 0.5313199105145412,
                                                "holdingPeriod": 4,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.5672
                                            },
                                            {
                                                "entryTime": "2017-07-02T14:00:00.000Z",
                                                "entryPrice": 53.54,
                                                "exitTime": "2017-07-04T14:00:00.000Z",
                                                "exitPrice": 54.18,
                                                "profit": 0.6400000000000006,
                                                "profitPct": 1.1953679491968632,
                                                "growth": 1.0119536794919686,
                                                "riskPct": 1.999999999999997,
                                                "rmultiple": 0.5976839745984325,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.4692
                                            },
                                            {
                                                "entryTime": "2017-07-06T14:00:00.000Z",
                                                "entryPrice": 53.46,
                                                "exitTime": "2017-07-26T14:00:00.000Z",
                                                "exitPrice": 54.15,
                                                "profit": 0.6899999999999977,
                                                "profitPct": 1.290684624017953,
                                                "growth": 1.0129068462401796,
                                                "riskPct": 2.000000000000004,
                                                "rmultiple": 0.6453423120089753,
                                                "holdingPeriod": 13,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.3908
                                            },
                                            {
                                                "entryTime": "2017-07-30T14:00:00.000Z",
                                                "entryPrice": 53.45,
                                                "exitTime": "2017-08-01T14:00:00.000Z",
                                                "exitPrice": 54.2,
                                                "profit": 0.75,
                                                "profitPct": 1.4031805425631432,
                                                "growth": 1.0140318054256314,
                                                "riskPct": 2.000000000000005,
                                                "rmultiple": 0.7015902712815698,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.381
                                            },
                                            {
                                                "entryTime": "2017-08-03T14:00:00.000Z",
                                                "entryPrice": 53.5,
                                                "exitTime": "2017-08-07T14:00:00.000Z",
                                                "exitPrice": 54.2,
                                                "profit": 0.7000000000000028,
                                                "profitPct": 1.3084112149532763,
                                                "growth": 1.0130841121495329,
                                                "riskPct": 2.0000000000000004,
                                                "rmultiple": 0.654205607476638,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.43
                                            },
                                            {
                                                "entryTime": "2017-08-13T14:00:00.000Z",
                                                "entryPrice": 53.67,
                                                "exitTime": "2017-08-15T14:00:00.000Z",
                                                "exitPrice": 54,
                                                "profit": 0.3299999999999983,
                                                "profitPct": 0.6148686416992701,
                                                "growth": 1.0061486864169926,
                                                "riskPct": 1.9999999999999991,
                                                "rmultiple": 0.30743432084963523,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.5966
                                            },
                                            {
                                                "entryTime": "2017-08-28T14:00:00.000Z",
                                                "entryPrice": 53.62,
                                                "exitTime": "2017-08-31T14:00:00.000Z",
                                                "exitPrice": 54.08,
                                                "profit": 0.46000000000000085,
                                                "profitPct": 0.857888847444985,
                                                "growth": 1.0085788884744498,
                                                "riskPct": 2.0000000000000036,
                                                "rmultiple": 0.4289444237224917,
                                                "holdingPeriod": 2,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.547599999999996
                                            },
                                            {
                                                "entryTime": "2017-09-04T14:00:00.000Z",
                                                "entryPrice": 53.99,
                                                "exitTime": "2017-09-11T14:00:00.000Z",
                                                "exitPrice": 54.44,
                                                "profit": 0.44999999999999574,
                                                "profitPct": 0.8334876829042336,
                                                "growth": 1.0083348768290423,
                                                "riskPct": 1.9999999999999976,
                                                "rmultiple": 0.4167438414521173,
                                                "holdingPeriod": 4,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.9102
                                            },
                                            {
                                                "entryTime": "2017-09-21T14:00:00.000Z",
                                                "entryPrice": 53.87,
                                                "exitTime": "2017-10-03T14:00:00.000Z",
                                                "exitPrice": 52.7926,
                                                "profit": -1.0773999999999972,
                                                "profitPct": -1.999999999999995,
                                                "growth": 0.9800000000000001,
                                                "riskPct": 1.999999999999995,
                                                "rmultiple": -1,
                                                "holdingPeriod": 7,
                                                "exitReason": "stop-loss",
                                                "stopPrice": 52.7926
                                            },
                                            {
                                                "entryTime": "2017-10-05T14:00:00.000Z",
                                                "entryPrice": 53.27,
                                                "exitTime": "2017-10-11T14:00:00.000Z",
                                                "exitPrice": 53.89,
                                                "profit": 0.6199999999999974,
                                                "profitPct": 1.1638821100056267,
                                                "growth": 1.0116388211000562,
                                                "riskPct": 1.9999999999999938,
                                                "rmultiple": 0.5819410550028152,
                                                "holdingPeriod": 3,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 52.204600000000006
                                            },
                                            {
                                                "entryTime": "2017-12-06T14:00:00.000Z",
                                                "entryPrice": 55.96,
                                                "exitTime": "2017-12-10T14:00:00.000Z",
                                                "exitPrice": 56.52,
                                                "profit": 0.5600000000000023,
                                                "profitPct": 1.0007147962830634,
                                                "growth": 1.0100071479628305,
                                                "riskPct": 1.9999999999999987,
                                                "rmultiple": 0.500357398141532,
                                                "holdingPeriod": 1,
                                                "exitReason": "exit-rule",
                                                "stopPrice": 54.8408
                                            }
                                        ]
                                    },
                                    "plotConfig": {
                                        "legend": {
                                            "show": true
                                        },
                                        "chartType": "bar",
                                        "width": "100%",
                                        "height": "100%",
                                        "y": {
                                            "min": -2.0000000000000044,
                                            "max": 5.160726000437364
                                        },
                                        "y2": {}
                                    },
                                    "axisMap": {
                                        "y": [
                                            {
                                                "series": "profitPct"
                                            }
                                        ],
                                        "y2": []
                                    }
                                },
                                "displayType": "chart"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "b6023c90-daf6-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Analyze performance \r\n\r\nTo get a clear picture of how well (or not) the strategy performed we can use the `analyze` function to produce a summary of results.\r\n\r\nHere we need to specify an amount of starting capital. This is the amount of (virtual) cash that we invest in the strategy at the start of trading. You can see that executing this strategy from 2015 to end 2016 delivers us a nice profit of 83%. This is fairly optimistic (it doesn't include fees and slippage) but it's a good start.",
                "lastEvaluationDate": "2018-11-16T15:53:20.159+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "2fab5780-d376-11e8-b62a-7b63438e3c42",
                "cellType": "code",
                "cellScope": "global",
                "code": "const startingCapital = 10000;\r\nconst analysis = analyze(startingCapital, trades); // Analyse the performance of this set of trades.\r\ndisplay.table(analysis);",
                "lastEvaluationDate": "2019-04-25T11:19:05.055+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "columnNames": [
                                        "Property",
                                        "Value"
                                    ],
                                    "rows": [
                                        {
                                            "Property": "startingCapital",
                                            "Value": 10000
                                        },
                                        {
                                            "Property": "finalCapital",
                                            "Value": 13158.218982428927
                                        },
                                        {
                                            "Property": "profit",
                                            "Value": 3158.218982428927
                                        },
                                        {
                                            "Property": "profitPct",
                                            "Value": 31.58218982428927
                                        },
                                        {
                                            "Property": "growth",
                                            "Value": 1.3158218982428926
                                        },
                                        {
                                            "Property": "totalTrades",
                                            "Value": 61
                                        },
                                        {
                                            "Property": "barCount",
                                            "Value": 227
                                        },
                                        {
                                            "Property": "maxDrawdown",
                                            "Value": -658.0722956983409
                                        },
                                        {
                                            "Property": "maxDrawdownPct",
                                            "Value": -5.8807999999999945
                                        },
                                        {
                                            "Property": "maxRiskPct",
                                            "Value": 2.000000000000007
                                        },
                                        {
                                            "Property": "expectency",
                                            "Value": 0.23589672097709913
                                        },
                                        {
                                            "Property": "rmultipleStdDev",
                                            "Value": 1.0340526002621098
                                        },
                                        {
                                            "Property": "systemQuality",
                                            "Value": 0.22812835722022695
                                        },
                                        {
                                            "Property": "profitFactor",
                                            "Value": 1.7236082094137901
                                        },
                                        {
                                            "Property": "percentProfitable",
                                            "Value": 65.57377049180327
                                        },
                                        {
                                            "Property": "returnOnAccount",
                                            "Value": 5.3703900531032005
                                        }
                                    ]
                                },
                                "displayType": "table"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "097fd530-daf7-11e8-831f-d150615bd7aa",
                "cellType": "markdown",
                "code": "## Equity curve\r\n\r\nFor a more visual understanding of the strategy's performance over time, let's compute and plot the equity curve. This shows the total value of our (virtual) trading account over time.",
                "lastEvaluationDate": "2018-11-16T15:53:20.167+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "14095e00-d376-11e8-b62a-7b63438e3c42",
                "cellType": "code",
                "cellScope": "global",
                "code": "const equityCurve = computeEquityCurve(10000, trades);\r\ndisplay(equityCurve.plot({ chartType: \"area\", y: { min: 9500, label: \"Equity $\" }, x: { label: \"Trade #\" } }));",
                "lastEvaluationDate": "2019-04-25T11:19:05.059+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "data": {
                                        "columnOrder": [
                                            "__value__"
                                        ],
                                        "columns": {
                                            "__value__": "number"
                                        },
                                        "index": {
                                            "type": "number",
                                            "values": [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                                6,
                                                7,
                                                8,
                                                9,
                                                10,
                                                11,
                                                12,
                                                13,
                                                14,
                                                15,
                                                16,
                                                17,
                                                18,
                                                19,
                                                20,
                                                21,
                                                22,
                                                23,
                                                24,
                                                25,
                                                26,
                                                27,
                                                28,
                                                29,
                                                30,
                                                31,
                                                32,
                                                33,
                                                34,
                                                35,
                                                36,
                                                37,
                                                38,
                                                39,
                                                40,
                                                41,
                                                42,
                                                43,
                                                44,
                                                45,
                                                46,
                                                47,
                                                48,
                                                49,
                                                50,
                                                51,
                                                52,
                                                53,
                                                54,
                                                55,
                                                56,
                                                57,
                                                58,
                                                59,
                                                60,
                                                61
                                            ]
                                        },
                                        "values": [
                                            {
                                                "__value__": 10000
                                            },
                                            {
                                                "__value__": 10038.766845117225
                                            },
                                            {
                                                "__value__": 10085.795302409666
                                            },
                                            {
                                                "__value__": 10245.363258639823
                                            },
                                            {
                                                "__value__": 10040.455993467027
                                            },
                                            {
                                                "__value__": 10196.515515462863
                                            },
                                            {
                                                "__value__": 9992.585205153606
                                            },
                                            {
                                                "__value__": 10364.608535515228
                                            },
                                            {
                                                "__value__": 10157.316364804923
                                            },
                                            {
                                                "__value__": 9954.170037508824
                                            },
                                            {
                                                "__value__": 10278.340551600862
                                            },
                                            {
                                                "__value__": 10462.625431357732
                                            },
                                            {
                                                "__value__": 10253.372922730578
                                            },
                                            {
                                                "__value__": 10048.305464275967
                                            },
                                            {
                                                "__value__": 10566.870976974224
                                            },
                                            {
                                                "__value__": 10506.983169170213
                                            },
                                            {
                                                "__value__": 10839.663911159038
                                            },
                                            {
                                                "__value__": 10918.689407473683
                                            },
                                            {
                                                "__value__": 10700.315619324208
                                            },
                                            {
                                                "__value__": 11017.623166519983
                                            },
                                            {
                                                "__value__": 11118.230520922052
                                            },
                                            {
                                                "__value__": 10895.865910503611
                                            },
                                            {
                                                "__value__": 10677.948592293538
                                            },
                                            {
                                                "__value__": 11190.183235245911
                                            },
                                            {
                                                "__value__": 10966.379570540994
                                            },
                                            {
                                                "__value__": 10747.051979130174
                                            },
                                            {
                                                "__value__": 10532.11093954757
                                            },
                                            {
                                                "__value__": 11011.16505577615
                                            },
                                            {
                                                "__value__": 11252.512206521244
                                            },
                                            {
                                                "__value__": 11245.439602997347
                                            },
                                            {
                                                "__value__": 11531.64379225709
                                            },
                                            {
                                                "__value__": 11638.77707121263
                                            },
                                            {
                                                "__value__": 11406.001529788378
                                            },
                                            {
                                                "__value__": 11902.737390687498
                                            },
                                            {
                                                "__value__": 11664.682642873748
                                            },
                                            {
                                                "__value__": 11431.388990016272
                                            },
                                            {
                                                "__value__": 11882.138881086019
                                            },
                                            {
                                                "__value__": 11903.103250803679
                                            },
                                            {
                                                "__value__": 11914.805082548472
                                            },
                                            {
                                                "__value__": 11676.508980897503
                                            },
                                            {
                                                "__value__": 11442.978801279552
                                            },
                                            {
                                                "__value__": 11452.116736038011
                                            },
                                            {
                                                "__value__": 11587.848935199569
                                            },
                                            {
                                                "__value__": 11592.214295506668
                                            },
                                            {
                                                "__value__": 11805.987068636732
                                            },
                                            {
                                                "__value__": 11836.680442631332
                                            },
                                            {
                                                "__value__": 11957.904675401516
                                            },
                                            {
                                                "__value__": 11970.853137421442
                                            },
                                            {
                                                "__value__": 11731.436074673013
                                            },
                                            {
                                                "__value__": 12003.902467866394
                                            },
                                            {
                                                "__value__": 12067.753012908235
                                            },
                                            {
                                                "__value__": 12195.989761926834
                                            },
                                            {
                                                "__value__": 12341.776714628237
                                            },
                                            {
                                                "__value__": 12501.070129014572
                                            },
                                            {
                                                "__value__": 12676.482712677078
                                            },
                                            {
                                                "__value__": 12842.34323415136
                                            },
                                            {
                                                "__value__": 12921.306775557543
                                            },
                                            {
                                                "__value__": 13032.157225329203
                                            },
                                            {
                                                "__value__": 13140.778650619037
                                            },
                                            {
                                                "__value__": 12877.963077606657
                                            },
                                            {
                                                "__value__": 13027.84738600005
                                            },
                                            {
                                                "__value__": 13158.218982428927
                                            }
                                        ]
                                    },
                                    "plotConfig": {
                                        "legend": {
                                            "show": false
                                        },
                                        "chartType": "area",
                                        "y": {
                                            "min": 9500,
                                            "label": {
                                                "text": "Equity $"
                                            },
                                            "max": 13158.218982428927
                                        },
                                        "x": {
                                            "label": {
                                                "text": "Trade #"
                                            }
                                        },
                                        "width": "100%",
                                        "height": "100%",
                                        "y2": {}
                                    },
                                    "axisMap": {
                                        "y": [
                                            {
                                                "series": "__value__"
                                            }
                                        ],
                                        "y2": []
                                    }
                                },
                                "displayType": "chart"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "d1895d10-e4a4-11e8-b0c7-bd1ae9f8fe99",
                "cellType": "markdown",
                "code": "## Drawdown chart\r\n\r\nWe can also compute and render a drawdown chart. This gives us a feel for the amount of risk in the strategy. It shows the amount of time the strategy has spent in negative territory, that's those times when a strategy has reached a peak but is now losing value (drawing down) from that peak.",
                "lastEvaluationDate": "2018-11-16T15:53:20.178+10:00",
                "output": [],
                "errors": []
            },
            {
                "id": "1f012310-d376-11e8-b62a-7b63438e3c42",
                "cellType": "code",
                "cellScope": "global",
                "code": "const drawdown = computeDrawdown(10000, trades);\r\ndisplay(drawdown.plot({ chartType: \"area\", y: { label: \"Equity $\" }, x: { label: \"Trade #\" } }));",
                "lastEvaluationDate": "2019-04-25T11:19:05.063+10:00",
                "output": [
                    {
                        "values": [
                            {
                                "data": {
                                    "data": {
                                        "columnOrder": [
                                            "__value__"
                                        ],
                                        "columns": {
                                            "__value__": "number"
                                        },
                                        "index": {
                                            "type": "number",
                                            "values": [
                                                0,
                                                1,
                                                2,
                                                3,
                                                4,
                                                5,
                                                6,
                                                7,
                                                8,
                                                9,
                                                10,
                                                11,
                                                12,
                                                13,
                                                14,
                                                15,
                                                16,
                                                17,
                                                18,
                                                19,
                                                20,
                                                21,
                                                22,
                                                23,
                                                24,
                                                25,
                                                26,
                                                27,
                                                28,
                                                29,
                                                30,
                                                31,
                                                32,
                                                33,
                                                34,
                                                35,
                                                36,
                                                37,
                                                38,
                                                39,
                                                40,
                                                41,
                                                42,
                                                43,
                                                44,
                                                45,
                                                46,
                                                47,
                                                48,
                                                49,
                                                50,
                                                51,
                                                52,
                                                53,
                                                54,
                                                55,
                                                56,
                                                57,
                                                58,
                                                59,
                                                60,
                                                61
                                            ]
                                        },
                                        "values": [
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -204.90726517279654
                                            },
                                            {
                                                "__value__": -48.84774317696065
                                            },
                                            {
                                                "__value__": -252.7780534862177
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -207.29217071030507
                                            },
                                            {
                                                "__value__": -410.4384980064042
                                            },
                                            {
                                                "__value__": -86.26798391436569
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -209.25250862715438
                                            },
                                            {
                                                "__value__": -414.31996708176484
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -59.88780780401066
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -218.37378814947442
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -222.36461041844086
                                            },
                                            {
                                                "__value__": -440.2819286285139
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -223.80366470491754
                                            },
                                            {
                                                "__value__": -443.1312561157374
                                            },
                                            {
                                                "__value__": -658.0722956983409
                                            },
                                            {
                                                "__value__": -179.0181794697619
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -7.07260352389676
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -232.77554142425106
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -238.0547478137505
                                            },
                                            {
                                                "__value__": -471.34840067122605
                                            },
                                            {
                                                "__value__": -20.598509601479236
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -238.29610165096892
                                            },
                                            {
                                                "__value__": -471.82628126891905
                                            },
                                            {
                                                "__value__": -462.6883465104602
                                            },
                                            {
                                                "__value__": -326.95614734890296
                                            },
                                            {
                                                "__value__": -322.5907870418032
                                            },
                                            {
                                                "__value__": -108.8180139117394
                                            },
                                            {
                                                "__value__": -78.12463991713958
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -239.4170627484291
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": 0
                                            },
                                            {
                                                "__value__": -262.8155730123799
                                            },
                                            {
                                                "__value__": -112.93126461898646
                                            },
                                            {
                                                "__value__": 0
                                            }
                                        ]
                                    },
                                    "plotConfig": {
                                        "legend": {
                                            "show": false
                                        },
                                        "chartType": "area",
                                        "y": {
                                            "label": {
                                                "text": "Equity $"
                                            },
                                            "min": -658.0722956983409,
                                            "max": 0
                                        },
                                        "x": {
                                            "label": {
                                                "text": "Trade #"
                                            }
                                        },
                                        "width": "100%",
                                        "height": "100%",
                                        "y2": {}
                                    },
                                    "axisMap": {
                                        "y": [
                                            {
                                                "series": "__value__"
                                            }
                                        ],
                                        "y2": []
                                    }
                                },
                                "displayType": "chart"
                            }
                        ]
                    }
                ],
                "errors": []
            },
            {
                "id": "03d11150-e4a5-11e8-b0c7-bd1ae9f8fe99",
                "cellType": "markdown",
                "code": "## Advanced backtesting\r\n\r\nWe are only just getting started here and in future notebooks, videos and blog posts we'll explore some of the more advanced aspects of backtesting including:\r\n\r\n- Market filters\r\n- Ranking and portfolio simulation\r\n- Position sizing\r\n- Optimization\r\n- Walk-forward testing\r\n- Monte-carlo testing\r\n- Comparing systems\r\n- Eliminating bias\r\n\r\nFollow my [blog](http://www.the-data-wrangler.com/) and [YouTube channel](https://www.youtube.com/channel/UCOxw0jy384_wFRwspgq7qMQ) to keep up.",
                "lastEvaluationDate": "2018-11-16T15:53:20.193+10:00",
                "output": [],
                "errors": []
            }
        ]
    }
};