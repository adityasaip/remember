const express = require('express')
const { getTopics, getTopic, createTopic, deleteTopic, updateTopic, createSubTopic, deleteSubTopic, updateSubTopic } = require('../controllers/topicControllers')
const { getAllReviseTopics, updateReviseTopic } = require('../controllers/reviseTopicControllers')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

router.use(requireAuth)     // running this middleware before going into any api route down below

// --  Revision topic routes  --

// GET all revise topics
router.get('/revise', getAllReviseTopics)  // this before get('/:id') because, this after '/:id' is invoking getTopic when requested /revise, so more specific route is put on the top, where express tries to match 'revise' with 'revise' as this revise is not parameter, it will invoke this. Tt will go to ':/id' when id doesnot match 'revise' and as :id is a parameter.

// Update revised topics (Mark as compelete)
router.patch('/revise/:id/:subId', updateReviseTopic)



// All Topics Routes

// GET all topics
router.get('/', getTopics)

// GET a topic
router.get('/:id', getTopic)

// POST a topic
router.post('/', createTopic)

// DELETE a topic
router.delete('/:id', deleteTopic)

// PATCH a topic
router.patch('/:id', updateTopic)

// POST a subtopic
router.post('/:id', createSubTopic)

// DELETE a subtopic
router.delete('/:id/:subId', deleteSubTopic)

// UPDATE a subtopic
router.patch('/:id/:subId', updateSubTopic)





module.exports = router