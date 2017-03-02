var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
    cnp: { type: Number }
})

module.exports = mongoose.model('Employee', EmployeeSchema)