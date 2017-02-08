var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var morgan = require('morgan')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var router = express.Router()
var path = require('path')

mongoose.Promise = global.Promise; //deprecation warning goes before appRoutes
var appRoutes = require('./app/routes/api')(router)

app.use(morgan('dev')) //morgan logs every server resqest
app.use(bodyParser.json()) //for parsing the json 
app.use(bodyParser.urlencoded({ extended: true })) //for parse application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'))
app.use('/api', appRoutes) //to deconflict te backend and the frontend routes

mongoose.connect('mongodb://localhost:27017/loginapp', function(err) {
    if (err) {
        console.log('not connected to the db', err)
    } else {
        console.log('connected to Mongo');
    }
})

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
})

app.listen(port, function() {
    console.log('server is running on', port)
})