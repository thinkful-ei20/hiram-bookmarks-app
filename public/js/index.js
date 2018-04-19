$(function() {
  Bookmarks.bindEventListeners()
  api
    .getBookmarks()
    .then(bookmarks =>
      bookmarks.forEach(bookmark => store.addBookmark(bookmark))
    )
    .then(() => Bookmarks.render())
})
