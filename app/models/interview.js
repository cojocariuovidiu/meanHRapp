var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var InterviewSchema = new Schema({
    dataapplicazione: { type: Date },
    nomecognome: { type: String },
    sesso: { type: String, uppercase: true },
    eta: { type: Number },
    tel: { type: String },
    esito1: { type: String },
    esito2: { type: String },
    esitocolloquio: { type: String },
    sito: { type: String },
    email: { type: String },
    note: { type: String },
    username: { type: String },
    cv: { type: String }
})

// InterviewSchema.pre('save', function(next) {
//     var interview = this
//     console.log(interview.nr);
//     next()
// })


module.exports = mongoose.model('Interview', InterviewSchema)