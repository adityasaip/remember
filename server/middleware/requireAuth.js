const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {

    // verify authentication
    const {authorization} = req.headers // we will send this from frontend

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required'})
    }

    // authorization value is of format 'Bearer encodedheader.encodedpayload.signature
    const token = authorization.split(' ')[1]

    try {

        const {_id} = jwt.verify(token, process.env.SECRET)   // retuns the payload(_id in our case) if success, else throws error (so try catch is used to catch it)
        // attaching user id to request object before going to any other api routes
        console.log(_id)
        req.user = await User.findOne({_id}).select('_id')      // select only returns the value given, here only _id is returned
        next()      // this will make the control move on to next middlewares or next api routes

    } catch (error) {
        console.log(error)
        res.status(401).json({error: 'Request is not authorized'})
    }
}

module.exports = requireAuth