var User = require('../models/user')
var Interview = require('../models/interview')
var Employee = require('../models/employee')
var jwt = require('jsonwebtoken')
var secret = 'harrypotter'
var multer = require('multer')
var moment = require('moment')

var cv = ''
var CVstorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|png|jpeg|jpg|doc|docx)$/)) {
            var err = new Error()
            err.code = 'filetype'
            return cb(err)
        } else {
            cv = 'CV_' + Date.now() + '_' + file.originalname
            cb(null, cv)
        }
    }
})
var uploadCV = multer({
        storage: CVstorage,
        limits: { fileSize: 10000000 } //limit 10 MB
    }).single('myfile') //from service and input html field


var ci = ''
var CIstorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|png|jpeg|jpg|doc|docx)$/)) {
            var err = new Error()
            err.code = 'filetype'
            return cb(err)
        } else {
            ci = 'CI_' + Date.now() + '_' + file.originalname
            cb(null, ci)
        }
    }
})
var uploadCI = multer({
        storage: CIstorage,
        limits: { fileSize: 10000000 } //limit 10 MB
    }).single('myfile') //from service and input html field

module.exports = function(router) {

    //USER REGISTRATION ROUTE
    //http://127.0.0.1:3000/users
    router.post('/users', function(req, res) {
        var user = new User()

        user.username = req.body.username
        user.password = req.body.password
        user.email = req.body.email
        user.group = req.body.group

        // console.log(user.group)

        if (req.body.username === null || req.body.username === undefined || req.body.username === '' ||
            req.body.password === null || req.body.password === undefined || req.body.username === '' ||
            req.body.email === null || req.body.email === undefined || req.body.email === '' ||
            req.body.group === null || req.body.group === undefined || req.body.group === '') {
            res.json({ success: false, message: 'Ensure group, username, email and password were provided' })
        } else {
            user.save(function(err) {
                if (err) { //if user exists in the db or some other error
                    res.json({ success: false, message: 'Username or Email already exists' })
                } else {
                    res.json({ success: true, message: 'user created' })
                }
            })
        }
        console.log(req.body.username, req.body.password, req.body.email, req.body.group);
    })

    //USER LOGIN ROUTE
    //http://localhost:3000/api/authenticate
    router.post('/authenticate', function(req, res) {
        console.log(req.body.username, req.body.password);

        User.findOne({ username: req.body.username }).select('group email username password').exec(function(err, user) {
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
                        email: user.email,
                        group: user.group
                    }, secret, {
                        expiresIn: '6360h'
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
                    console.log('Token Invalid', err)
                    res.json({ success: false, message: 'Token Invalid' })
                } else {
                    //takes the token, verifies it with the secret and send it back decoded
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            console.log('No token provided')
            res.json({ success: false, message: 'No token provided' })
        }
    })

    router.post('/me', function(req, res) {
        res.send(req.decoded)
    })

    // router.get('renewToken/:username', function(req, res) {
    //     User.find({ username: req.params.username }).select().exec(function(err, user) {
    //         if (err) throw err;
    //         if (!user) {
    //             res.json({ success: false, message: 'No user was found' })
    //         } else {
    //             //create jwt token
    //             var newToken = jwt.sign({
    //                 username: user.username,
    //                 email: user.email
    //             }, secret, {
    //                 expiresIn: '24h'
    //             })

    //             res.json({ success: true, token: newToken })
    //         }
    //     });
    // })

    //http://127.0.0.1:3000/api/interview
    router.post('/interview', function(req, res) {
        console.log(req.body)

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
        interview.datacolloquio = req.body.newInterview.datacolloquio
        interview.colloquio_sostenuto_da = req.body.newInterview.colloquio_sostenuto_da
        interview.responsabile_colloquio = req.body.newInterview.responsabile_colloquio
        interview.sito = req.body.newInterview.sito
        interview.email = req.body.newInterview.email
        interview.username = req.body.username
        interview.interviewStatus = req.body.interviewStatus

        // if (req.body.nomecognome === null || req.body.nomecognome === undefined || req.body.nomecognome === '' ||
        //     req.body.sesso === null || req.body.sesso === undefined || req.body.sesso === '' ||
        //     req.body.email === null || req.body.email === undefined || req.body.email === '') {
        //     res.json({ success: false, message: 'Empty fields' })
        // } else {
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

    //http://127.0.0.1:3000/api/employee
    router.post('/employee', function(req, res) {
        console.log(req.body)

        var employee = new Employee()
        employee.employmentdate = req.body.newEmployee.employmentdate
        employee.name = req.body.newEmployee.name
        employee.department = req.body.newEmployee.department
        employee.cnp = req.body.newEmployee.cnp
        employee.age = req.body.newEmployee.age
        employee.tel = req.body.newEmployee.tel
        employee.email = req.body.newEmployee.email
        employee.note = req.body.newEmployee.note
        employee.username = req.body.username

        employee.save(function(err) {
            if (err) {
                console.log('save failed');
                console.log(err)
                res.json({ success: false })
            } else {
                console.log('save success');
                res.json({ success: true })
            }
        })
    })

    //http://127.0.0.1:3000/api/getinterviews
    router.get('/getinterviews', function(req, res) {
        Interview.find({}, function(err, interviews) {
            res.send(interviews)
        })
    })

    //http://127.0.0.1:3000/api/getemployees
    router.get('/getemployees', function(req, res) {
        Employee.find({}, function(err, employees) {
            res.send(employees)
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

    //http://127.0.0.1:3000/api/getEmployee/:id
    router.get('/getEmployee/:id', function(req, res) {

        Employee.findOne({ _id: req.params.id }).select().exec(function(err, item) {
            if (err) throw err;
            if (!item) {
                console.log("can't find id to edit.")
            } else {
                res.json({ item })
            }
        })
    })

    //http://127.0.0.1:3000/api/getInterviewsRangeFilter
    router.post('/getInterviewsRangeFilter', function(req, res) {
        var momentFrom = moment(req.body.from).format('YYYY/MM/DD');
        var momentTo = moment(req.body.to).add('days', 1).format('YYYY/MM/DD');
        Interview.find({ dataapplicazione: { $gte: momentFrom, $lte: momentTo } }, function(err, interviews) {
            res.send(interviews)
        })
    })

    //http://127.0.0.1:3000/api/getEmployeesRangeFilter
    router.post('/getEmployeesRangeFilter', function(req, res) {
        var momentFrom = moment(req.body.from).format('YYYY/MM/DD');
        var momentTo = moment(req.body.to).add('days', 1).format('YYYY/MM/DD');
        Employee.find({ employmentdate: { $gte: momentFrom, $lte: momentTo } }, function(err, employees) {
            res.send(employees)
        })
    })

    //http://127.0.0.1:3000/api/getInterviewsByStatus
    router.post('/getInterviewsByStatus', function(req, res) {
        console.log(req.body.option)
        Interview.find({ interviewStatus: req.body.option }, function(err, interviews) {
            console.log(interviews)
            res.send(interviews)
        })
    })

    //http://127.0.0.1:3000/api/getEmployeesByDepartment
    router.post('/getEmployeesByDepartment', function(req, res) {
        console.log(req.body.option)

        Employee.find({ department: req.body.option }, function(err, interviews) {
            console.log(interviews)
            res.send(interviews)
        })
    })

    router.delete('/interviews/:id', function(req, res) {
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

    router.delete('/employees/:id', function(req, res) {
        // Interview.findOneAndRemove({_id: req.params.id})
        console.log('id sent:', req.params.id)

        Employee.findOne({ _id: req.params.id }).remove().exec(function(err, data) {
            if (err) {
                console.log(err);
                res.json({ success: false, message: 'Could not delete.' })
            } else {
                res.json({ success: true, message: data.result.n + ' documents deleted.' })
                console.log(data.result.n, 'document removed.')
            }
        })
    })

    //http://127.0.0.1:3000/api/editEmployee/:id
    router.put('/editEmployee/:id', function(req, res) {

        let updateEmployee = {
            employmentdate: req.body.updateData.employmentdate,
            name: req.body.updateData.name,
            cnp: req.body.updateData.cnp,
            age: req.body.updateData.age,
            tel: req.body.updateData.tel,
            department: req.body.updateData.department,
            email: req.body.updateData.email,
            note: req.body.updateData.note,
            ci: req.body.ci
        }

        if (updateEmployee.employmentdate === null || updateEmployee.employmentdate === undefined) delete updateEmployee.employmentdate
        if (updateEmployee.cnp === null || updateEmployee.cnp === undefined) delete updateEmployee.cnp
        if (updateEmployee.age === null || updateEmployee.age === undefined) delete updateEmployee.age
        if (updateEmployee.tel === null || updateEmployee.tel === undefined) delete updateEmployee.tel
        if (updateEmployee.department === null || updateEmployee.department === undefined) delete updateEmployee.department
        if (updateEmployee.email === null || updateEmployee.email === undefined) delete updateEmployee.email
        if (updateEmployee.note === null || updateEmployee.note === undefined) delete updateEmployee.note
        if (updateEmployee.ci === null || updateEmployee.ci === undefined) delete updateEmployee.ci

        Employee.findOneAndUpdate({ _id: req.params.id }, updateEmployee, { new: true }, function(err) {
            if (err) {
                console.log('update failed');
                console.log(err)
                res.json({ success: false })
            } else {
                console.log('update success');
                res.json({ success: true })
            }
        })

    })

    //http://127.0.0.1:3000/api/editinterview/:id
    router.put('/editinterview/:id', function(req, res) {

        let updateInterview = {
            dataapplicazione: req.body.updateData.dataapplicazione,
            nomecognome: req.body.updateData.nomecognome,
            sesso: req.body.updateData.sesso,
            eta: req.body.updateData.eta,
            tel: req.body.updateData.tel,
            esito1: req.body.updateData.esito1,
            esito2: req.body.updateData.esito2,
            esitocolloquio: req.body.updateData.esitocolloquio,
            datacolloquio: req.body.updateData.datacolloquio,
            colloquio_sostenuto_da: req.body.updateData.colloquio_sostenuto_da,
            responsabile_colloquio: req.body.updateData.responsabile_colloquio,
            sito: req.body.updateData.sito,
            email: req.body.updateData.email,
            note: req.body.updateData.note,
            interviewStatus: req.body.interviewStatus,
            cv: req.body.cv,
            ci: req.body.ci
        }

        if (updateInterview.dataapplicazione === null || updateInterview.dataapplicazione === undefined) delete updateInterview.dataapplicazione
        if (updateInterview.sesso === null || updateInterview.sesso === undefined) delete updateInterview.sesso
        if (updateInterview.eta === null || updateInterview.eta === undefined) delete updateInterview.eta
        if (updateInterview.tel === null || updateInterview.tel === undefined) delete updateInterview.tel
        if (updateInterview.esito1 === null || updateInterview.esito1 === undefined) delete updateInterview.esito1
        if (updateInterview.esito2 === null || updateInterview.esito2 === undefined) delete updateInterview.esito2
        if (updateInterview.esitocolloquio === null || updateInterview.esitocolloquio === undefined) delete updateInterview.esitocolloquio
        if (updateInterview.datacolloquio === null || updateInterview.datacolloquio === undefined) delete updateInterview.datacolloquio
        if (updateInterview.colloquio_sostenuto_da === null || updateInterview.colloquio_sostenuto_da === undefined) delete updateInterview.colloquio_sostenuto_da
        if (updateInterview.responsabile_colloquio === null || updateInterview.responsabile_colloquio === undefined) delete updateInterview.responsabile_colloquio
        if (updateInterview.sito === null || updateInterview.sito === undefined) delete updateInterview.sito
        if (updateInterview.email === null || updateInterview.email === undefined) delete updateInterview.email
        if (updateInterview.note === null || updateInterview.note === undefined) delete updateInterview.note
        if (updateInterview.interviewStatus === null || updateInterview.interviewStatus === undefined) delete updateInterview.interviewStatus
        if (updateInterview.cv === null || updateInterview.cv === undefined) delete updateInterview.cv
        if (updateInterview.ci === null || updateInterview.ci === undefined) delete updateInterview.ci

        console.log(updateInterview)

        Interview.findOneAndUpdate({ _id: req.params.id }, updateInterview, { new: true }, function(err) {
            if (err) {
                console.log('update failed');
                console.log(err)
                res.json({ success: false })
            } else {
                console.log('update success');
                res.json({ success: true })
            }
        });
    })

    //Upload file API's
    router.post('/uploadCV', function(req, res) {
        uploadCV(req, res, function(err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') { //LIMIT_FILE_SIZE if multer's error code for file too big
                    res.json({ success: false, message: 'File size is too large. Max limit is 10MB' })
                } else if (err.code === 'filetype') { //our custom error
                    res.json({ success: false, message: 'File type is invalid. Must be pdf, png, jpeg, jpg, doc, docx' })
                } else {
                    console.log(err)
                    res.json({ success: false, message: 'Unable to upload, call Administrator' })
                }
            } else {
                if (!req.file) {
                    res.json({ success: false, message: 'Nessun file selezionato!' })
                } else {
                    console.log(cv)
                    res.json({ success: true, message: 'caricato con successo come CV !', cv: cv })
                }
            }
        })
    })
    router.post('/uploadCI', function(req, res) {
        uploadCI(req, res, function(err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') { //LIMIT_FILE_SIZE if multer's error code for file too big
                    res.json({ success: false, message: 'File size is too large. Max limit is 10MB' })
                } else if (err.code === 'filetype') { //our custom error
                    res.json({ success: false, message: 'File type is invalid. Must be pdf, png, jpeg, jpg, doc, docx' })
                } else {
                    console.log(err)
                    res.json({ success: false, message: 'Unable to upload, call Administrator' })
                }
            } else {
                if (!req.file) {
                    res.json({ success: false, message: 'Nessun file selezionato!' })
                } else {
                    console.log(ci)
                    res.json({ success: true, message: 'caricato con successo come CI !', ci: ci })
                }
            }
        })
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