'use strict';

var bodyParser = require('body-parser')


const logger = require('morgan'),
    busboyBodyParser = require('busboy-body-parser');

module.exports = (app) => {
    app.use(logger('dev'));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
    app.use(bodyParser.json()) //for parsing the json 
    app.use(bodyParser.urlencoded({ extended: true })) //for parse application/x-www-form-urlencoded
    app.use(express.static(__dirname + '/public'))
    app.use('/api', appRoutes) //to deconflict te backend and the frontend routes
    app.use(busboyBodyParser({ limit: '10mb' }));

    //[*]Routes Configuration
    let main = require('../routes/api.js');
    app.use('/api', main);
}