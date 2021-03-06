// import BookmarksService from 
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarksRouter = require('./bookmarks/bookmark-router')

const app = express()
app.use(cors())

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())

app.use('/api/bookmarks', bookmarksRouter)

app.get('/bookmarks/:bookmark_id', (req, res, next) => {
    res.json({ 'requested_id': req.params.bookmark_id, this: 'should fail' })
})

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    console.log(req)

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
       return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.use(bookmarksRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app