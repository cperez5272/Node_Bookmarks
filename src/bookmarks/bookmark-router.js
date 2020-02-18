const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { books } = require('../book')
const bookRouter = express.Router()
const bodyParser = express.json()

bookRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(books)
    })
.post(bodyParser, (req, res) => {
    const { name, content } = req.body
    if (!name) {
        logger.error(`Name is very much required`)
        return res
            .status(400)
            .send('Invalid data! Need name!')
    }
    if (!content) {
        logger.error(`Some content would be dope.`)
        return res
            .status(400)
            .send('Bad data! Need to see content!')
    }

    const id = uuid()

    const book = {
        id,
        name,
        content
    }

    books.push(book)

    logger.info(`book with id ${id} has been created! Yaaay!`)

    res
        .status(201)
        .location(`http://localhost:8000/card/${id}`)
        .json(book)
})

bookRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params
        const book = books.find(found => found.id == id)

        if(!book) {
            logger.error(`Book with id ${id} cannot be found`)
            return res
                .status(404)
                .send('Find the darn book!')
        }
        res.json(book)
})
    .delete((req, res) => {
        const { id } = req.params
        const bookIndex = books.findIndex(found => found.id == id)
        if (bookIndex === -1) {
            logger.error(`Book with id ${id} was not found :c`)
            return res
                .status(404)
                .send('Nope Nope Not Found Nope')
        }

        books.splice(bookIndex, 1)

        logger.info(`Books with id ${id} has been removed. :D`)
        res
            .status(204)
            .end()
    })


module.exports = bookRouter