var User = require('../models/user')
var Interview = require('../models/interview')
var jwt = require('jsonwebtoken')
var secret = 'harrypotter'
var mongoose = require('mongoose')
var multer = require('multer')
var moment = require('moment')

var cv = ''
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|png|jpeg|jpg)$/)) {
            var err = new Error()
            err.code = 'filetype'
            return cb(err)
        } else {
            cv = Date.now() + '_' + file.originalname
            cb(null, cv)
        }
    }
})
var upload = multer({
        storage: storage,
        limits: { fileSize: 10000000 } //limit 10 MB
    }).single('myfile') //from service and input html field

module.exports = function(router) {

    router.post('/upload', function(req, res) {
        upload(req, res, function(err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') { //LIMIT_FILE_SIZE if multer's error code for file too big
                    res.json({ success: false, message: 'File size is too large. Max limit is 10MB' })
                } else if (err.code === 'filetype') { //our custom error
                    res.json({ success: false, message: 'File type is invalid. Must be pdf, png, jpeg, jpg' })
                } else {
                    console.log(err)
                    res.json({ success: false, message: 'Unable to upload, call Administrator' })
                }
            } else {
                if (!req.file) {
                    res.json({ success: false, message: 'No file was selected' })
                } else {
                    console.log(cv)
                    res.json({ success: true, message: 'uploaded succesfully!', cv: cv })
                }
            }
        })
    })

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
        interview.esito1 = req.body.newInterview.esito1
        interview.esito2 = req.body.newInterview.esito2
        interview.note = req.body.newInterview.note
        interview.esitocolloquio = req.body.newInterview.esitocolloquio
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
                    console.log(err)
                    res.json({ success: false })
                } else {
                    console.log('save success');
                    res.json({ success: true })
                }
            })
            //}
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
                console.log("can't find id to edit.")
            } else {
                res.json({ item })
            }
        })
    })

    //http://127.0.0.1:3000/api/getInterviewsFiltered
    router.post('/getInterviewsFiltered', function(req, res) {
        var start = new Date(req.body.year - 1, 11, 32);
        var end = new Date(req.body.year, 11, 32);

        // console.log(start)
        // console.log(end)
        console.log('sorting by:', req.body.year)

        Interview.find({ dataapplicazione: { $gte: start, $lt: end } }, function(err, interviews) {
            res.send(interviews)
        })

    })

    //http://127.0.0.1:3000/api/getRangeFilter
    router.post('/getRangeFilter', function(req, res) {
        console.log(req.body.from)
        console.log(req.body.to)

        var momentFrom = moment(req.body.from).format('YYYY/MM/DD');
        var momentTo = moment(req.body.to).add('days', 1).format('YYYY/MM/DD');

        console.log(momentFrom)
        console.log(momentTo)

        Interview.find({ dataapplicazione: { $gte: momentFrom, $lte: momentTo } }, function(err, interviews) {
            res.send(interviews)
        })
    })

    router.delete('/interviews/:id', function(req, res) {
        // Interview.findOneAndRemove({_id: req.params.id})
        console.log('id sent:', req.params.id)

        Interview.findOne({ _id: req.params.id }).remove().exec(function(err, data) {
            if (err) {
                console.log(err);
                res.json({ success: false, message: 'Could not delete.' })
            } else {
                res.json({ success: true, message: data.result.n + ' documents deleted.' })
                console.log(data.result.n, 'document removed.')
            }
        })
    })

    //http://127.0.0.1:3000/api/editinterview/:id
    router.put('/editinterview/:id', function(req, res) {

        var id = req.params.id
        console.log(id)
        console.log(req.body.updateData.note)
        console.log(req.body.cv)

        var cv
        if (!req.body.cv) {
            Interview.findOneAndUpdate({ _id: id }, {
                dataapplicazione: req.body.updateData.dataapplicazione,
                nomecognome: req.body.updateData.nomecognome,
                sesso: req.body.updateData.sesso,
                eta: req.body.updateData.eta,
                tel: req.body.updateData.tel,
                esito1: req.body.updateData.esito1,
                esito2: req.body.updateData.esito2,
                esitocolloquio: req.body.updateData.esitocolloquio,
                sito: req.body.updateData.sito,
                email: req.body.updateData.email,
                note: req.body.updateData.note,

                // username: { type: String }

            }, { new: true }, function(err) {
                if (err) {
                    console.log('update failed (no CV)');
                    console.log(err)
                    res.json({ success: false })
                } else {
                    console.log('update success (no CV)');
                    res.json({ success: true })
                }
            });
        } else {
            Interview.findOneAndUpdate({ _id: id }, {
                dataapplicazione: req.body.updateData.dataapplicazione,
                nomecognome: req.body.updateData.nomecognome,
                sesso: req.body.updateData.sesso,
                eta: req.body.updateData.eta,
                tel: req.body.updateData.tel,
                esito1: req.body.updateData.esito1,
                esito2: req.body.updateData.esito2,
                esitocolloquio: req.body.updateData.esitocolloquio,
                sito: req.body.updateData.sito,
                email: req.body.updateData.email,
                note: req.body.updateData.note,
                cv: req.body.cv

                // username: { type: String }

            }, { new: true }, function(err) {
                if (err) {
                    console.log('update failed (with CV)');
                    console.log(err)
                    res.json({ success: false })
                } else {
                    console.log('update success (with CV)');
                    res.json({ success: true })
                }
            });
        }

    })

    // router.post('/api/uploadcv', function(req, res) {
    //     //let part = req.files.fileslet writeStream -
    // })


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