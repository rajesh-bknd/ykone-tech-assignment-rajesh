require('dotenv').config()
const express = require('express');
const path = require('path');
const cors = require('cors')
const indexRouter = require('./src/routes/v1.0');

const app = express();

// allow cors
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
const logger = require('./src/logger/logger')

// connect to database
const mongo = require('./src/database/mongo')
mongo.connect()

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    logger.info({
        service: "RestAPI",
        title: `404 ${req.url}`,
        data: {
            url: req.url,
            query: req.query,
            params: req.params,
            headers: req.headers,
            body: req.body
        }
    })
    res.status(404).json({message: `Sorry, you're landed on Mars ${req.url}`})
});

// error handler
app.use(function (error, req, res, next) {
    logger.error({
        service: "RestAPI",
        title: `Unhandled error ${req.url}`,
        data: {
            url: req.url,
            query: req.query,
            params: req.params,
            headers: req.headers,
            body: req.body
        },
        error: JSON.stringify(error),
        message: error.message,
        stackTrace: error.stackTrace
    })
    res.status(500).json({message: error.message});
});

// catch uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error({
        service: "RestAPI",
        title: `uncaughtException`,
        error: JSON.stringify(error),
        message: error.message,
        stackTrace: error.stackTrace
    })
})
// log on process exit
process.on('exit', (code) => {
    logger.error({
        service: "RestAPI",
        title: `uncaughtException`,
        code: code,
        error: JSON.stringify(code),
        message: null,
        stackTrace: null
    })
})
module.exports = app;
