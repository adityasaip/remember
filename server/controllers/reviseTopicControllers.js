const mongoose = require('mongoose')
const Topics = require('../models/topicModel')
require('dotenv').config()
const {differenceInCalendarDays} = require('date-fns') 
// date-fns js library efficiently calculates days difference and many other things, else its inefficient to calculate manually as js gives difference in ms, which should be divided by 1000*60*60*24 to get value in days.
// on thing to note is, {differenceInDays} calculates elapsed time, only if its past 24 hrs, it regards it as 1 day. So we need difference in calender days.

// -- Revise Topics --

// GET all revise topics
const getAllReviseTopics = async (req, res) => {
    const user_id = req.user._id
    try {
        const topics = await Topics.find({user_id})    // yet to handle edge case topics = [] or null
        const reviseTopics = []
        const helper = (topics) => { 
            for (let topic of topics){
                const addTopic = {_id: topic._id, topicName: topic.topicName}
                const subTopics = []
                const currentDate = new Date()
                for (let subTopic of topic.subTopics) {
                    const subTopicName = subTopic.subTopicName
                    const lastLearntDate = subTopic.lastLearntDate
                    const revisionCount = subTopic.revisionCount
                    if (revisionCount >= process.env.LIMIT) {
                        continue
                    }
                    const days = differenceInCalendarDays(currentDate, lastLearntDate)
                    // console.log(days, subTopicName)
                    switch(revisionCount) {
                        case 6:
                            if (days >= 60) { 
                                subTopics.push({_id: subTopic._id, subTopicName: subTopicName, 6:6})
                            }
                            break   // if not included, the control will enter next cases even if no match
                        case 5:
                            if (days >= 45) { 
                                subTopics.push({_id: subTopic._id, subTopicName: subTopicName, 5:5})
                            }
                            break
                        case 4:
                            if (days >= 30) { 
                                subTopics.push({_id: subTopic._id, subTopicName: subTopicName, 4:4})
                            } 
                            break   
                        case 3:
                            if (days >= 21) { 
                                subTopics.push({_id: subTopic._id, subTopicName: subTopicName, 3:3})
                            }  
                            break
                        case 2:
                            if (days >= 7) { 
                                subTopics.push({_id: subTopic._id, subTopicName: subTopicName, 2:2})
                            }  
                            break
                        case 1:
                            if (days >= 3) { 
                                subTopics.push({_id: subTopic._id, subTopicName: subTopicName, 1:1})
                            } 
                            break
                        case 0:
                            if (days >= 1) { 
                                subTopics.push({_id: subTopic._id, subTopicName: subTopicName, 0:0})
                            }  
                            break
                    }
                    // console.log(subTopics)
                }
                addTopic.subTopics = subTopics
                if (subTopics.length > 0) {
                    reviseTopics.push(addTopic)
                }
            }
        }
        helper(topics)
        
        res.status(200).json(reviseTopics)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// PATCH a revise topic
// User should be able to mark it complete and so I can increment revisionCount by 1. 
// the thing is I have to either remove the topic instantly from /revise endpoint, or gray the button 'mark it complete' after converting it to 'completed'. In this way the user cannot click it again. And the topic will be removed by itself after the re fetch, but what if I am using localstorage at client side or sessionstorage cache, this will remove unpredictably and the user might find it surprising.
// So, I can go by instantly removing it after both ' marked as completed and incremented revisionCount'
// Obviously I cannot re fetch all of the remaining revision topics as this not performance efficient, I can hide it with logic at the client side, yet there is an edge case to this, as the user can still inspect and manipulate logic to show it, and he can trigger the mark as complete function again. I can handle this by using date comparison, if lastLearntDate is current date itself, then I return error/already revised as the message, else increment revisionCount by 1.
// one more edge case can be user sending the same requests again and again. I can make this hard by graying out the 'mark as complete' button, but yet to figure out the best way.
// so finally, instantly remove the topic after incrementing revisionCount if lastLearnt date is not the current date, in which case its already revised.

const updateReviseTopic = async (req, res) => {

    const {id, subId} = req.params
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(subId)) {
        return res.status(400).json({error: 'Id is not valid'})
    }
    try {
        const topic = await Topics.findOne({_id: id, "subTopics._id": subId}, {"subTopics.$": 1})   //finding and storing the required subtopic
        if (!topic || topic.subTopics == null || topic.subTopics.length === 0) {
            return res.status(400).json({error: 'Not found'})
        }
        const lastLearntDate = topic.subTopics[0].lastLearntDate
        const currentDate = new Date()
        if (differenceInCalendarDays(currentDate, lastLearntDate) > 0) {      // yet to set default null for subtopics
            // const sub = topic.subTopics.findById(subId)
            // MongoDB uses the positional operator $ to locate the index of the matched subdocument within the subWorkouts array.
            
            const response = await Topics.updateOne({_id: id, "subTopics._id": subId}, {$set: {"subTopics.$.lastLearntDate": currentDate} ,$inc: {"subTopics.$.revisionCount": 1}})
            
            if (response.modifiedCount === 0) {     // modified count would be 2? or 1? should be checked. Okay checked, it gives 1, meaning it updated one topic
                return res.status(400).json({error: "Cannot Update"})
            }
            res.status(200).json({mssg:"Good work! Revised!"})
        }
        if (differenceInCalendarDays(currentDate, lastLearntDate) == 0) {
            res.status(200).json({mssg: "Already marked as revised"})
        }
         // yet to take care that this count only updates if last learnt date is not same day. Taken care.
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {getAllReviseTopics, updateReviseTopic}