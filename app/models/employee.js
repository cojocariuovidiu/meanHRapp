var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    employmentdate: { type: Date },
    name: { type: String },
    department: { type: String },
    cnp: { type: Number },
    age: { type: Number },
    tel: { type: String },
    email: { type: String },
    note: { type: String },
    username: { type: String }
})

module.exports = mongoose.model('Employee', EmployeeSchema)