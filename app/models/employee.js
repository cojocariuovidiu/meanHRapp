var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    name: { type: String },
    employmentdate: { type: Date },
    cnp: { type: Number },
    age: { type: Number },
    tel: { type: String },
    department: { type: String },
    email: { type: String },
    note: { type: String }
})

module.exports = mongoose.model('Employee', EmployeeSchema)