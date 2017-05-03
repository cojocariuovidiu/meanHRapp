var User = require('../models/user')
var Interview = require('../models/interview')
var Employee = require('../models/employee')
var jwt = require('jsonwebtoken')
var secret = 'harrypotter'
var multer = require('multer')
var moment = require('moment')
const fs = require('fs');
var mkdirp = require('mkdirp');

var cv = ''
var CVstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(pdf|PDF|png|PNG|jpeg|JPEG|jpg|JPG|doc|DOC|docx|DOCX)$/)) {
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
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(pdf|PDF|png|PNG|jpeg|JPEG|jpg|JPG|doc|DOC|docx|DOCX)$/)) {
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

module.exports = function (router) {

    //USER REGISTRATION ROUTE
    //http://127.0.0.1:3000/users
    router.post('/users', function (req, res) {
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
            user.save(function (err) {
                if (err) { //if user exists in the db or some other error
                    res.json({ success: false, message: 'Username or Email already exists' })
                } else {
                    res.json({ success: true, message: 'user created' })
                }
            })
        }
        //console.log(req.body.username, req.body.password, req.body.email, req.body.group);
    })

    //USER LOGIN ROUTE
    //http://localhost:3000/api/authenticate
    router.post('/authenticate', function (req, res) {
        //console.log(req.body.username, req.body.password);

        User.findOne({ username: req.body.username }).select('group email username password').exec(function (err, user) {
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
    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token']
        if (token) {
            //verify token
            jwt.verify(token, secret, function (err, decoded) {
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

    router.post('/me', function (req, res) {
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
    router.post('/interview', function (req, res) {
        //console.log(req.body)

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
        interview.datarichiamare = req.body.newInterview.datarichiamare
        interview.colloquio_sostenuto_da = req.body.newInterview.colloquio_sostenuto_da
        interview.responsabile_colloquio = req.body.newInterview.responsabile_colloquio
        interview.sito = req.body.newInterview.sito
        interview.email = req.body.newInterview.email
        interview.username = req.body.username

        // if (req.body.nomecognome === null || req.body.nomecognome === undefined || req.body.nomecognome === '' ||
        //     req.body.sesso === null || req.body.sesso === undefined || req.body.sesso === '' ||
        //     req.body.email === null || req.body.email === undefined || req.body.email === '') {
        //     res.json({ success: false, message: 'Empty fields' })
        // } else {
        interview.save(function (err) {
            if (err) {
                LogMessage(req.body.username, 'New Int Created', 'error')
                console.log(err)
                res.json({ success: false })
            } else {
                LogMessage(req.body.username, 'New Int Created', 'success')
                res.json({ success: true })
            }
        })
        //}
    })

    //http://127.0.0.1:3000/api/employee
    router.post('/employee', function (req, res) {
        //console.log(req.body)

        var employee = new Employee()
        employee.employmentdate = req.body.newEmployee.employmentdate
        employee.leavingDate = req.body.newEmployee.leavingDate
        employee.name = req.body.newEmployee.name
        employee.department = req.body.newEmployee.department
        employee.cnp = req.body.newEmployee.cnp
        employee.age = req.body.newEmployee.age
        employee.tel = req.body.newEmployee.tel
        employee.email = req.body.newEmployee.email
        employee.status = req.body.newEmployee.status
        employee.username = req.body.username

        employee.save(function (err) {
            if (err) {
                LogMessage(req.body.username, 'Employee save', 'error')
                console.log(err)
                res.json({ success: false })
            } else {
                LogMessage(req.body.username, 'Employee save', 'success')
                res.json({ success: true })
            }
        })
    })

    //http://127.0.0.1:3000/api/getinterviews
    router.post('/getinterviews', function (req, res) {
        Interview.find({}, function (err, interviews) {
            if (!err) {
                res.send(interviews)
                LogMessage(req.body.username, 'get all Int', 'success')
            } else {
                LogMessage(req.body.username, 'get all Int', 'error')
                console.log(err)
            }
        })
    })

    //http://127.0.0.1:3000/api/getemployees
    router.post('/getemployees', function (req, res) {
        Employee.find({}, function (err, employees) {
            if (!err) {
                LogMessage(req.body.username, 'get all Emp', 'success')
                res.send(employees)
            } else {
                LogMessage(req.body.username, 'get all Emp', 'error')
                console.log(err)
            }
        })
    })

    //LogMessage
    function LogMessage(username, text, action) {
        if (action === 'success') {
            console.log(username, 'OK -', text, moment(Date.now()).format('YYYY/MM/DD HH:mm'))
        } else if (action === 'error') {
            console.log(username, '- Error -', text, moment(Date.now()).format('YYYY/MM/DD HH:mm'))
        }
    }

    //http://127.0.0.1:3000/api/getWorkingEmployees
    router.get('/getWorkingEmployees', function (req, res) {
        Employee.find({ "status": "Lavora a Bitech" }, function (err, employees) {
            res.send(employees)
        })
    })

    //http://127.0.0.1:3000/api/getinterview/:id
    router.get('/getClickedInterview/:id', function (req, res) {

        Interview.findOne({ _id: req.params.id }).select().exec(function (err, item) {
            if (err) throw err;
            if (!item) {
                LogMessage(req.body.username, "Can't find id to edit.", 'error')
            } else {
                res.json({ item })
            }
        })
    })

    //http://127.0.0.1:3000/api/getEmployee/:id
    router.post('/getEmployee', function (req, res) {
        Employee.findOne({ _id: req.body.id }).select().exec(function (err, item) {
            if (err) throw err;
            if (!item) {
                LogMessage(req.body.username, "Can't find id to edit.", 'error')
            } else {
                res.json({ item })
            }
        })
    })

    // //http://127.0.0.1:3000/api/getInterviewsRangeFilter
    router.post('/getInterviewsRangeFilter', function (req, res) {
        var momentFrom = moment(req.body.from).format('YYYY/MM/DD');
        var momentTo = moment(req.body.to).add(1, 'days').format('YYYY/MM/DD');
        var i = 0

        UploadsDir = './public/uploads/CV Aprile/'

        var logger = fs.createWriteStream('./public/uploads/CV Aprile/log' + moment().format('mm') + '.txt', {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })

        Interview.find({ dataapplicazione: { $gte: momentFrom, $lte: momentTo } }, function (err, interviews) {
            res.send(interviews)

            fs.readdir((UploadsDir), (err, files) => {
                //loop interviews
                interviews.forEach(function (interview) {
                    //loop files
                    files.forEach(file => {
                        if (file.includes(interview.nomecognome)) {
                            //logger.write(interview.nomecognome + ' : ' + 'CV_' + Date.now() + '_' + file + "\r\n")

                            var getYear = 'CV ' + moment(interview.dataapplicazione).format('YYYY')
                            var getMonth = 'CV ' + moment(interview.dataapplicazione).format('MMM')
                            fullPath = getYear + '/' + getMonth + '/' + file

                            // update path to cv 
                            Interview.findOneAndUpdate({ nomecognome: interview.nomecognome }, { cv: fullPath }, function (err) {
                                if (err) {
                                    console.log('error auto-updating CV')
                                }
                            });

                            //create dir and copy files
                            mkdirp('./public/uploads' + getYear + '/' + getMonth, function (err) {
                                if (err) console.error(err)
                                else console.log('pow!')
                            });

                            //fs.linkSync(UploadsDir + '/' + file, fullPath);

                            i++
                        }
                    })

                })
                console.log(i, 'files match')
            })
        })
        // logger.end()
    })

    //http://127.0.0.1:3000/api/getInterviewsDataColDayFilter
    router.post('/getInterviewsDataColDayFilter', function (req, res) {
        var momentCustomDay = moment(req.body.day).format('YYYY/MM/DD');
        var momentCustomDayFix = moment(req.body.day).add(1, 'days').format('YYYY/MM/DD');
        Interview.find({ datacolloquio: { $gte: momentCustomDay, $lte: momentCustomDayFix } }, function (err, interviews) {
            res.send(interviews)
        })
    })

    //http://127.0.0.1:3000/api/getEmployeesRangeFilter
    router.post('/getEmployeesRangeFilter', function (req, res) {
        var momentFrom = moment(req.body.from).format('YYYY/MM/DD');
        var momentTo = moment(req.body.to).add(1, 'days').format('YYYY/MM/DD');
        console.log(momentFrom, momentTo)
        Employee.find({ employmentdate: { $gte: momentFrom, $lte: momentTo } }, function (err, employees) {
            res.send(employees)
        })
    })

    //http://127.0.0.1:3000/api/getInterviewsByStatus
    router.post('/getInterviewsByStatus', function (req, res) {
        // console.log('sorting by', req.body.option)
        if (req.body.option === 'assunto' || req.body.option === 'da rivedere' || req.body.option === 'scartato') {
            Interview.find({ esitocolloquio: req.body.option }, function (err, interviews) {
                res.send(interviews)
            })
        } else if (req.body.option === 'today') {
            getInterviewsByStatus('period', 1)
        } else if (req.body.option === 'week') {
            getInterviewsByStatus('period', 7)
            // var today = moment(Date.now()).format('YYYY/MM/DD')
            // var nextWeek = moment(Date.now()).add(7, 'days').format('YYYY/MM/DD')
            // Interview.find({ datacolloquio: { $gte: today, $lte: nextWeek } }, function (err, interviews) {
            //     res.send(interviews)
            // })
        } else if (req.body.option === 'month') {
            getInterviewsByStatus('period', 30)
            // var today = moment(Date.now()).format('YYYY/MM/DD')
            // var nextMonth = moment(Date.now()).add(30, 'days').format('YYYY/MM/DD')
            // Interview.find({ datacolloquio: { $gte: today, $lte: nextMonth } }, function (err, interviews) {
            //     res.send(interviews)
            // })
        }
        function getInterviewsByStatus(period, days) {
            var today = moment(Date.now()).format('YYYY/MM/DD')
            var todayFix = moment(Date.now()).add(days, 'days').format('YYYY/MM/DD')
            Interview.find({
                $or: [
                    { datacolloquio: { $gte: today, $lte: todayFix } },
                    { datarichiamare: { $gte: today, $lte: todayFix } }
                ]
            }
                , function (err, interviews) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('sorting by', days, 'days found:', interviews.length)
                        res.send(interviews)
                    }
                })
        }
        console.log(req.body.username, 'OK - sort Int by', req.body.option, moment(Date.now()).format('YYYY/MM/DD HH:mm'))
    })


    //http://127.0.0.1:3000/api/getEmployeesByDepartment
    router.post('/getEmployeesByDepartment', function (req, res) {
        console.log(req.body.username, 'OK - sort Emp by', req.body.option, moment(Date.now()).format('YYYY/MM/DD HH:mm'))

        Employee.find({ department: req.body.option }, function (err, interviews) {
            //console.log(interviews)
            res.send(interviews)
        })
    })

    router.delete('/interviews/:id', function (req, res) {
        //console.log('id sent:', req.params.id)

        Interview.findOne({ _id: req.params.id }).remove().exec(function (err, data) {
            if (err) {
                console.log(err, moment(Date.now()).format('YYYY/MM/DD HH:mm'));
                res.json({ success: false, message: 'Could not delete.' })
            } else {
                res.json({ success: true, message: data.result.n + ' documents deleted.' })
                console.log(data.result.n, 'Int removed OK', moment(Date.now()).format('YYYY/MM/DD HH:mm'))
            }
        })
    })

    router.delete('/employees/:id', function (req, res) {
        // Interview.findOneAndRemove({_id: req.params.id})
        //console.log('id sent:', req.params.id)

        Employee.findOne({ _id: req.params.id }).remove().exec(function (err, data) {
            if (err) {
                console.log(err);
                res.json({ success: false, message: 'Could not delete.' })
            } else {
                res.json({ success: true, message: data.result.n + ' documents deleted.' })
                console.log(data.result.n, 'Emp removed OK', moment(Date.now()).format('YYYY/MM/DD HH:mm'))
            }
        })
    })

    //http://127.0.0.1:3000/api/editEmployee/:id
    router.put('/editEmployee/:id', function (req, res) {

        let updateEmployee = {
            employmentdate: req.body.updateData.employmentdate,
            leavingDate: req.body.updateData.leavingDate,
            name: req.body.updateData.name,
            cnp: req.body.updateData.cnp,
            age: req.body.updateData.age,
            tel: req.body.updateData.tel,
            department: req.body.updateData.department,
            email: req.body.updateData.email,
            status: req.body.updateData.status,
            ci: req.body.ci
        }

        if (updateEmployee.employmentdate === null || updateEmployee.employmentdate === undefined) delete updateEmployee.employmentdate
        if (updateEmployee.leavingDate === null || updateEmployee.leavingDate === undefined) delete updateEmployee.leavingDate
        if (updateEmployee.cnp === null || updateEmployee.cnp === undefined) delete updateEmployee.cnp
        if (updateEmployee.age === null || updateEmployee.age === undefined) delete updateEmployee.age
        if (updateEmployee.tel === null || updateEmployee.tel === undefined) delete updateEmployee.tel
        if (updateEmployee.department === null || updateEmployee.department === undefined) delete updateEmployee.department
        if (updateEmployee.email === null || updateEmployee.email === undefined) delete updateEmployee.email
        if (updateEmployee.status === null || updateEmployee.status === undefined) delete updateEmployee.status
        if (updateEmployee.ci === null || updateEmployee.ci === undefined) delete updateEmployee.ci

        Employee.findOneAndUpdate({ _id: req.params.id }, updateEmployee, { new: true }, function (err) {
            if (err) {
                console.log('Employee Update Failed', moment(Date.now()).format('YYYY/MM/DD HH:mm'));
                res.json({ success: false })
            } else {
                console.log('Employee Update OK', moment(Date.now()).format('YYYY/MM/DD HH:mm'));
                res.json({ success: true })
            }
        })

    })

    //http://127.0.0.1:3000/api/editinterview/:id
    router.put('/editInterview/:id', function (req, res) {

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
            datarichiamare: req.body.updateData.datarichiamare,
            colloquio_sostenuto_da: req.body.updateData.colloquio_sostenuto_da,
            responsabile_colloquio: req.body.updateData.responsabile_colloquio,
            sito: req.body.updateData.sito,
            email: req.body.updateData.email,
            note: req.body.updateData.note,
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
        if (updateInterview.datacolloquio === undefined) delete updateInterview.datacolloquio
        if (updateInterview.datarichiamare === undefined) delete updateInterview.datarichiamare
        if (updateInterview.colloquio_sostenuto_da === null || updateInterview.colloquio_sostenuto_da === undefined) delete updateInterview.colloquio_sostenuto_da
        if (updateInterview.responsabile_colloquio === null || updateInterview.responsabile_colloquio === undefined) delete updateInterview.responsabile_colloquio
        if (updateInterview.sito === null || updateInterview.sito === undefined) delete updateInterview.sito
        if (updateInterview.email === null || updateInterview.email === undefined) delete updateInterview.email
        if (updateInterview.note === null || updateInterview.note === undefined) delete updateInterview.note
        if (updateInterview.cv === null || updateInterview.cv === undefined) delete updateInterview.cv
        if (updateInterview.ci === null || updateInterview.ci === undefined) delete updateInterview.ci

        if (updateInterview.esitocolloquio === 'elimina esitocolloquio') updateInterview.esitocolloquio = null

        console.log(updateInterview)

        Interview.findOneAndUpdate({ _id: req.params.id }, updateInterview, { new: true }, function (err) {
            if (err) {
                console.log('Interview Update Failed', moment(Date.now()).format('YYYY/MM/DD HH:mm'));
                console.log(err)
                res.json({ success: false })
            } else {
                console.log('Interview Update OK', moment(Date.now()).format('YYYY/MM/DD HH:mm'));
                res.json({ success: true })
            }
        });
    })

    //Upload file API's
    router.post('/uploadCV', function (req, res) {
        uploadCV(req, res, function (err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') { //LIMIT_FILE_SIZE if multer's error code for file too big
                    res.json({ success: false, message: 'File size is too large. Max limit is 10MB' })
                } else if (err.code === 'filetype') { //our custom error
                    res.json({ success: false, message: 'File type is invalid. Must be pdf, png, jpeg, jpg, doc, docx' })
                } else {
                    console.log('CV Upload Failed', moment(Date.now()).format('YYYY/MM/DD HH:mm'))
                    console.log(err)
                    res.json({ success: false, message: 'Unable to upload, call Administrator' })
                }
            } else {
                if (!req.file) {
                    res.json({ success: false, message: 'Nessun file selezionato!' })
                } else {
                    console.log(cv, 'upload OK', moment(Date.now()).format('YYYY/MM/DD HH:mm'))
                    res.json({ success: true, message: 'caricato con successo come CV !', cv: cv })
                }
            }
        })
    })
    router.post('/uploadCI', function (req, res) {
        uploadCI(req, res, function (err) {
            if (err) {
                if (err.code === 'LIMIT_FILE_SIZE') { //LIMIT_FILE_SIZE if multer's error code for file too big
                    res.json({ success: false, message: 'File size is too large. Max limit is 10MB' })
                } else if (err.code === 'filetype') { //our custom error
                    res.json({ success: false, message: 'File type is invalid. Must be pdf, png, jpeg, jpg, doc, docx' })
                } else {
                    console.log('CI Upload Failed', moment(Date.now()).format('YYYY/MM/DD HH:mm'))
                    console.log(err)
                    res.json({ success: false, message: 'Unable to upload, call Administrator' })
                }
            } else {
                if (!req.file) {
                    res.json({ success: false, message: 'Nessun file selezionato!' })
                } else {
                    console.log(ci, 'upload OK', moment(Date.now()).format('YYYY/MM/DD HH:mm'))
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