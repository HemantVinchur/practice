const express = require('express')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const logger = require('morgan')
const bodyParser = require('body-parser')
const routes = require('./routes')
const config = require('./config')
const { celebrate, Joi, errors } = require('celebrate')
const app = express();

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const URI = "mongodb://localhost:27017/practice";
mongoose.connect(URI, { useNewUrlParser: true })
    .then(() => {
        console.log("This is my database");
    }).catch((error) => {
        console.error("DB error:", error);
        process.exit(1);
    });

app.use('/api', routes);
app.use(errors());
app.use(function (req, res, next) {
    res.status(404).json({
        statusCode: 404,
        message: "Not found",
        data: {}
    })
})

app.listen(5002, () => {
    console.log("Server is running @5002")
})