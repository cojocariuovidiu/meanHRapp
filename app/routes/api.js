var User = require('../models/user')
var Interview = require('../models/interview')
var jwt = require('jsonwebtoken')
var secret = 'harrypotter'
var mongoose = require('mongoose')

module.exports = function(router) {
    //USER REGISTRATION ROUTE
    //http://127.0.0.1:3000/users
    router.post('/users', function(req, res) {
        var user = new User()

        user.username = req.body.username
        user.password = req.body.password
        user.email = req.body.email

        if (req.body.username === null || req.body.username === undefined || req.body.username === '' ||
            req.body.password === null || req.body.password === undefined || req.body.username === '' ||
            req.body.email === null || req.body.email === undefined || req.body.email === '') {
            res.json({ success: false, message: 'Ensure username, email and password were provided' })
        } else {
            user.save(function(err) {
                if (err) { //if user exists in the db or some other error
                    res.json({ success: false, message: 'Username or Email already exists' })
                } else {
                    res.json({ success: true, message: 'user created' })
                }
            })
        }
        console.log(req.body.username, req.body.password, req.body.email);
    })

    //USER LOGIN ROUTE
    //http://localhost:3000/api/authenticate
    router.post('/authenticate', function(req, res) {
        console.log(req.body.username, req.body.password);

        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Could not authenticate user' })
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password)
                } else {
                    res.json({ success: false, message: 'No password provided' })
                }
                if (!validPassword) {
                    res.json({ success: false, message: 'Could not authenticate password' })
                } else {

                    //create jwt token
                    var token = jwt.sign({
                        username: user.username,
                        email: user.email
                    }, secret, {
                        expiresIn: '24h'
                    })

                    res.json({ success: true, message: 'User authenticated!', token: token })
                }
            }
        })
    })

    //middleware (EVERYTHING AFTER THIS REQUIRE THE USER TO BE LOGGED IN)
    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token']
        if (token) {
            //verify token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) { //if token expired
                    res.json({ success: false, message: 'Token Invalid' })
                } else {
                    //takes the token, verifies it with the secret and send it back decoded
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            res.json({ success: false, message: 'No token provided' })
        }
    })

    router.post('/me', function(req, res) {
        res.send(req.decoded)
    })

    router.get('renewToken/:username', function(req, res) {
        User.find({ username: req.params.username }).select().exec(function(err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user was found' })
            } else {
                //create jwt token
                var newToken = jwt.sign({
                    username: user.username,
                    email: user.email
                }, secret, {
                    expiresIn: '24h'
                })

                res.json({ success: true, token: newToken })
            }
        });
    })

    //http://127.0.0.1:3000/api/interview
    router.post('/interview', function(req, res) {
        var interview = new Interview()

        interview.dataapplicazione = req.body.newInterview.dataapplicazione
        interview.nomecognome = req.body.newInterview.nomecognome
        interview.sesso = req.body.newInterview.sesso
        interview.eta = req.body.newInterview.eta
        interview.tel = req.body.newInterview.tel
            // interview.esito1 = req.body.newInterview.esito1
            // interview.esito2 = req.body.newInterview.esito2
            // interview.note = req.body.newInterview.note
            // interview.esitocolloquio = req.body.newInterview.esitocolloquio
        interview.sito = req.body.newInterview.sito
        interview.email = req.body.newInterview.email
        interview.username = req.body.username

        // if (req.body.nomecognome === null || req.body.nomecognome === undefined || req.body.nomecognome === '' ||
        //     req.body.sesso === null || req.body.sesso === undefined || req.body.sesso === '' ||
        //     req.body.email === null || req.body.email === undefined || req.body.email === '') {
        //     res.json({ success: false, message: 'Empty fields' })
        // } else {
        console.log(req.body)
        interview.save(function(err) {
                if (err) {
                    console.log('save failed');
                    res.json({ success: false })
                } else {
                    console.log('save success');
                    res.json({ success: true })
                }
            })
            // }
    })

    //http://127.0.0.1:3000/api/getinterviews
    router.get('/getinterviews', function(req, res) {
        Interview.find({}, function(err, interviews) {
            res.send(interviews)
        })
    })

    //http://127.0.0.1:3000/api/getinterview/:id
    router.get('/getinterview/:id', function(req, res) {

        Interview.findOne({ _id: req.params.id }).select().exec(function(err, item) {
            if (err) throw err;
            if (!item) {
                console.log('no item found')
            } else {
                console.log(item)
                res.json({ item })
            }
        })
    })

    //DONT DELETE (code for post query)
    //var id = mongoose.Types.ObjectId(req.body.id);
    // Interview.findOne({ _id: id }, function(err, obj) {
    //     console.log(obj);
    //     res.send(obj)
    // });

    // app.get('/getinterview/:id', function(req, res) {
    //     console.log(req.params.id)
    // })

    return router //return whatever the route is
}