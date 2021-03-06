const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray, makeMeanieBookmark } = require('./bookmarks.fixtures')

describe.only('Bookmarks Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('bookmarks_server').truncate())

    afterEach('cleanup', () => db('bookmarks_server').truncate())

    describe.only(`GET /api/bookmarks`, () => {
        context('Given there are bookmarks in the database', () => {

            context(`Given an XSS attack bookmark`, () => {
                const meanieBookmark = {
                    id: 911,
                    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
                    rating: 'Negative 10 for being a hacker',
                    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
                }

                beforeEach('insert malicious bookmark', () => {
                    return db
                        .into('bookmarks_server')
                        .insert([meanieBookmark])
                })

                it('removes XSS attack content', () => {
                    return supertest(app)
                        .get(`/api/bookmarks/${meanieBookmark.id}`)
                        .expect(200)
                        .expect(res => {
                            expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                            expect(res.body.description).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                        })
                })
            })

            const testBookmarks = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks_server')
                    .insert(testBookmarks)
            })

            it('responds with 200 and all of the bookmarks', () => {
                return supertest(app)
                    .get('/api/bookmarks')
                    .expect(200).then(() => {
                        expect(testBookmarks)
                    })
            })
        })
    })

    describe.only(`GET /api/bookmarks/:bookmark_id`, () => {
        context('Given there are bookmarks in the database', () => {

            context(`Given an XSS attack bookmark`, () => {
                const meanieBookmark = {
                    id: 911,
                    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
                    rating: 'Negative 10 for being a hacker',
                    description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
                }

                beforeEach('insert malicious bookmark', () => {
                    return db
                        .into('bookmarks_server')
                        .insert([meanieBookmark])
                })

                it('removes XSS attack content', () => {
                    return supertest(app)
                        .get(`/api/bookmarks/${meanieBookmark.id}`)
                        .expect(200)
                        .expect(res => {
                            expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                            expect(res.body.description).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                        })
                })
            })

            const testBookmarks = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks_server')
                    .insert(testBookmarks)
            })

            it('GET /api/bookmarks responds with 200 and all of the bookmarks', () => {
                return supertest(app)
                    .get('/api/bookmarks')
                    .expect(200).then(() => {
                        expect(testBookmarks)
                    })
            })
            it('GET /api/bookmarks/:bookmark_id responds with 200 and the specified bookmark', () => {
                const bookmarkId = 2
                const expectedBookmark = testBookmarks[bookmarkId - 1]
                return supertest(app)
                    .get(`/api/bookmarks/${bookmarkId}`)
                    .expect(200).then(() => {
                        expect(expectedBookmark)
                    })
            })
        })
    })
    describe.only(`POST /api/bookmarks`, () => {

        context(`Given an XSS attack bookmark`, () => {
            const meanieBookmark = {
                id: 911,
                title: 'Naughty naughty very naughty <script>alert("xss");</script>',
                rating: 'Negative 10 for being a hacker',
                description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
            }

            beforeEach('insert malicious bookmark', () => {
                return db
                    .into('bookmarks_server')
                    .insert([meanieBookmark])
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/bookmarks/${meanieBookmark.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                        expect(res.body.description).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                    })
            })
        })

        it('creates a bookmark, responding with 201 and the new bookmark', function () {
            const newBookmark = {
                title: 'updated bookmark title',
                description: 'This is a red bookmark that resembles mario',
                rating: 'updated bookmark rating...'
            }
            return supertest(app)
                .post('/api/bookmarks')
                .send(newBookmark)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newBookmark.title)
                    expect(res.body.description).to.eql(newBookmark.description)
                    expect(res.body.rating).to.eql(newBookmark.rating)
                    expect(res.body).to.have.property('id')
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/bookmarks/${res.body.id}`)
                        .expect(res.body)
                )
        })
    })

    describe.only(`DELETE /api/bookmarks/:bookmark_id`, () => {

        context(`Given no bookmarks`, () => {
            it(`responds with 404`, () => {
                const bookmarkId = 123456
                return supertest(app)
                    .delete(`/api/bookmarks/${bookmarkId}`)
                    .expect(404, { error: { message: `Bookmark doesn't exist` } })
            })
        })

        context('Given there are bookmarks in the database', () => {
            const testBookmarks = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks_server')
                    .insert(testBookmarks)
            })

            it('responds with 204 and removes the bookmark', () => {
                const idToRemove = 2
                const expectedBookmark = testBookmarks.filter(bookmark => bookmark.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/bookmarks/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get('/api/bookmarks')
                            .expect(expectedBookmark)
                    )
            })
        })
    })

    describe.only(`PATCH /api/bookmarks/:bookmark_id`, () => {
        context(`Given no bookmarks`, () => {
            it(`responds with 404`, () => {
                const bookmarkId = 123456
                return supertest(app)
                    .patch(`/api/bookmarks/${bookmarkId}`)
                    .expect(404, { error: { message: `Bookmark doesn't exist` } })
            })
        })
        context('Given there are bookmarks in the database', () => {
            const testBookmarks = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks_server')
                    .insert(testBookmarks)
            })
            it('responds with 204 and updates the bookmark', () => {
                const idToUpdate = 2
                const updateBookmark = {
                    title: 'updated bookmark title',
                    rating: 'updated bookmark rating',
                    description: 'updated bookmark description',
                }
                const expectedBookmark = {
                    ...testBookmarks[idToUpdate - 1],
                    ...updateBookmark
                }
                return supertest(app)
                    .patch(`/api/bookmarks/${idToUpdate}`)
                    .send(updateBookmark)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/bookmarks/${idToUpdate}`)
                            .expect(expectedBookmark)
                    )
            })
            // })
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/bookmarks/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'title', 'description' or 'rating'`
                        }
                    })
            })
            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateBookmark = {
                    title: 'updated bookmark title',
                }
                const expectedBookmark = {
                    ...testBookmarks[idToUpdate - 1],
                    ...updateBookmark
                }

                return supertest(app)
                    .patch(`/api/bookmarks/${idToUpdate}`)
                    .send({
                        ...updateBookmark,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/bookmarks/${idToUpdate}`)
                            .expect(expectedBookmark)
                    )
            })
        })
    })

    const requiredFields = ['title', 'description', 'rating']

    requiredFields.forEach(field => {
        const newBookmark = {
            title: 'Test new title',
            description: 'Testing new description',
            rating: 'And the rating is...'
        }

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newBookmark[field]

            return supertest(app)
                .post('/api/bookmarks')
                .send(newBookmark)
                .expect(400, {
                    error: { message: `Missing '${field}' in request body` }
                })
        })
    })
})