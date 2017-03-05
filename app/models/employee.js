var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    cnp: { type: Number },
    department: { type: String },
    username: { type: String }
})

module.exports = mongoose.model('Employee', EmployeeSchema)