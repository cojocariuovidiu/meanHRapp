var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var InterviewSchema = new Schema({
    dataapplicazione: { type: String },
    nomecognome: { type: String },
    sesso: { type: String, uppercase: true },
    eta: { type: Number },
    tel: { type: Number },
    esito1: { type: String },
    esito2: { type: String },
    note: { type: String },
    esitocolloquio: { type: String },
    sito: { type: String },
    email: { type: String },
    username: { type: String }
})

// InterviewSchema.pre('save', function(next) {
//     var interview = this
//     console.log(interview.nr);
//     next()
// })


module.exports = mongoose.model('Interview', InterviewSchema)