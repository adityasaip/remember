// defining schema

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subSchema = new Schema({
    subTopicName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    lastLearntDate: {
        type: Date,
        default: Date.now
    },
    revisionCount: {
        type: Number,
        default: 0
    }
},{timestamps: true})

const topicSchema = new Schema({
    topicName: {
        type: String,
        required: true
    },
    subTopics: {
        type: [subSchema],
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Topics', topicSchema)