const BookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks_server')
    },
    getById(db, id) {
        return db.select('*').from('bookmarks_server').where('bookmarks_server.id', '=', id).first()
    }
}

module.exports = BookmarksService 