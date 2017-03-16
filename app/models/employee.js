var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    employmentdate: { type: Date },
    leavingDate: { type: Date },
    name: { type: String },
    department: { type: String },
    cnp: { type: String },
    age: { type: String },
    tel: { type: String },
    email: { type: String },
    status: { type: String },
    username: { type: String },
    ci: { type: String }
})

module.exports = mongoose.model('Employee', EmployeeSchema)