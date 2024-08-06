const mongoose = require('mongoose')
const Topics = require('../models/topicModel')
require('dotenv').config()
const {differenceInDays} = require('date-fns') // efficiently calculates days difference, else its inefficient to calculate manually as js gives difference in ms, which should be divided by 1000*60*60*24 to get value in days.

// all controller functions

//GET all topics
const getTopics = async (req, res) => {
    try {
        const user_id = req.user._id
        const topics = await Topics.find({user_id})      // find all
        res.status(200).json(topics)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//GET a topic
const getTopic = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "Id is not valid"})
    }
    try {
        const topic = await Topics.findById(id)     // findbyId(id) returns null if not found, find({_id: id}) is returning empty object, which makes !topic as false instead of true
        if (!topic) {
            return res.status(400).json({error: "No such topic found"})
        }
        res.status(200).json(topic)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//POST a topic
const createTopic = async (req, res) => {
    const {topicName, subTopics} = req.body
    try {
        const user_id = req.user._id
        // note that create method is a part of mongoose with wraps around mongodb, it inserts one or many objects as inertOne or insertMany of mongodb, and returns the object or an array of objects
        const newTopic = await Topics.create({topicName, subTopics, user_id})
        res.status(201).json(newTopic)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//DELETE a topic
const deleteTopic = async (req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "Id is not valid"})
    }
    try {
        const response = await Topics.deleteOne({_id: id})  // finding by id and then deleting is good, because there is a chance object might not be there. same goes for update controller
        if (response.deletedCount === 0) {
            return res.status(400).json({error: "Cannot delete"})
        }
        res.status(200).json({mssg: "Successfully deleted"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//PATCH a topic
const updateTopic = async (req, res) => {
    const {id} = req.params
    const {topicName} = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "Id is not valid"})
    }
    if (topicName.trim() === '' || !topicName){
        return res.status(400).json({error: "Topic Name is not valid"})
    }
    try {
        const response = await Topics.updateOne({_id: id}, {$set: {topicName: topicName}})
        if (response.modifiedCount === 0) {
            return res.status(400).json({error: "Cannot update"})
        }
        res.status(200).json({mssg: "Successfully updated"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// Sub Topic Controllers

//POST subtopic
const createSubTopic = async (req, res) => {
    const {id} = req.params
    const {subTopicName} = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: "Id is not valid"})
    }
    if (subTopicName.trim() === ''){
        
        return res.status(400).json({error: "name is not valid"})
    }
    try {
        const topic = await Topics.findById(id)
        if (!topic) {
            return res.status(400).json({error: "No such topic found"})
        }
        topic.subTopics.push({subTopicName})
        await topic.save()
        res.status(200).json(topic)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE a subtopic
const deleteSubTopic = async (req, res) => {
    const {id, subId} = req.params
    console.log(id, subId)
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "Id is not valid"})
    }
    if (!mongoose.Types.ObjectId.isValid(subId)){
        return res.status(400).json({error: "Id is not valid"})
    }
    try {
        // const topic = Topics.findById(id)
        // if (!topic) {
        //     return res.status(400).json({error: "No such topic found"})
        // }
        // if (!topic.findById(subId)) {
        //     return res.status(400).json({error: "No such topic found"})
        // }
        // if using updateOne, it updates only one, so why check !== 1, we can also do ===0
        const topic = await Topics.findById({_id: id, "subTopics._id": subId})
        const subs = topics.subTopics
        if (subs.length < 2) {
            return res.status(400).json({error: "Atleast 1 sub workout must be present"})
        }
        const response = await Topics.updateOne({_id: id}, {$pull: {subTopics: {_id: subId}}})
        console.log(response)
        if (response.modifiedCount !== 1) {
            return res.status(400).json({error: "Cannot delete"})
        }
        if (response.modifiedCount === 1) {
            res.status(200).json({mssg:"Successfully deleted"})
        }
    } catch (error) {
        res.status(400).json({error: "Cannot delete"})
    }
}

// UPDATE a subtopic
const updateSubTopic = async (req, res) => {
    const {id, subId} = req.params
    const {subTopicName} = req.body
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error: "Id is not valid"})
    }
    if (!mongoose.Types.ObjectId.isValid(subId)){
        return res.status(400).json({error: "Id is not valid"})
    }
    try {        
        // we should use subTopics.$.subTopicName, where $ indicates we are assinging to the position of subTopicName without disturbing other fields, irrespective of number of fields.
        const response = await Topics.updateOne({_id: id, "subTopics._id": subId}, {$set: {"subTopics.$.subTopicName":subTopicName}})
        console.log(response)
        if (response.modifiedCount === 0) {
            return res.status(400).json({error: "Cannot update"})
        }
        if (response.modifiedCount === 1) {
            res.status(200).json({mssg:"Successfully updated"})
        }
    } catch (error) {
        res.status(400).json({error: "Cannot update"})
    }
}







module.exports = {getTopics, getTopic, createTopic, deleteTopic, updateTopic, createSubTopic, deleteSubTopic, updateSubTopic,}
