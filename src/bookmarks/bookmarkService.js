const BookmarksService = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks_server')
    },
    getById(db, id) {
        return db.select('*').from('bookmarks_server').where('bookmarks_server.id', '=', id).first()
    },
    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks_server')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks_server')
          .where({ id })
          .delete()
      },
      updateBookmark(knex, id, newBookmarkFields) {
        return knex('bookmarks_server')
          .where({ id })
          .update(newBookmarkFields)
      },
    }

module.exports = BookmarksService 