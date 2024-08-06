const express = require('express')
require('dotenv').config()  // loads env file contents into process.env
const mongoose = require('mongoose')
const topicRoutes = require('./routes/topics')
const userRoutes = require('./routes/user')
const app = express()


app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/topics', topicRoutes)
// app.get('/api/topics', (req, res) => {
//     res.status(200).json({"Home": "Home"})
// })
app.use('/api/user', userRoutes)

mongoose.connect(process.env.MONG_URI)
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Connected and listening to PORT 4000")
    })
})
.catch((error) => {
    console.log(error)
})

