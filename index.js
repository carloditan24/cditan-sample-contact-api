const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('config');

require("./contact/contact");

mongoose.connect(config.DBHost);

if (config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/json'
}));

require("./contact/routes")(app);

app.use(function (err, req, res, next) {
    if (err.name === 'MongoError') {
        res.status(422).send(err);
    }
    res.status(500).send('500 - Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);

module.exports = app;