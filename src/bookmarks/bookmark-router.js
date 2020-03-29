const express = require('express')
const bookmarksService = require('./bookmarkService')
const xss = require('xss')
const path = require('path')

const bookmarksRouter = express.Router()
const jsonParser = express.json()

bookmarksRouter
    .route('/')
    .get((req, res, next) => {
        bookmarksService.getAllBookmarks(
            req.app.get('db')
        )
            .then(bookmarks => {
                res.json(bookmarks)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { title, description, rating } = req.body
        const newBookmark = { title, description, rating }

        for (const [key, value] of Object.entries(newBookmark)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        bookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
                    .json(bookmark)
            })
            .catch(next)
    })

bookmarksRouter
    .route('/:bookmark_id')
    .all((req, res, next) => {
        bookmarksService.getById(
            req.app.get('db'),
            req.params.bookmark_id
        )
            .then(bookmark => {
                if (!bookmark) {
                    return res.status(404).json({
                        error: { message: `Bookmark doesn't exist` }
                    })
                }
                res.bookmark = bookmark // save the bookmark for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.bookmark.id,
            rating: res.bookmark.rating,
            title: xss(res.bookmark.title), // sanitize title
            description: xss(res.bookmark.description), // sanitize content
            url: res.bookmark.url,
        })
    })
    .delete((req, res, next) => {
        bookmarksService.deleteBookmark(
            req.app.get('db'),
            req.params.bookmark_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, description, rating } = req.body
        const bookmarkToUpdate = { title, description, rating }

        const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'title', 'description' or 'rating'`
                }
            })
        }

        bookmarksService.updateBookmark(
            req.app.get('db'),
            req.params.bookmark_id,
            bookmarkToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = bookmarksRouter