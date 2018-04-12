$(function() {
  Bookmarks.bindEventListeners();
  api.getBookmarks(bookmarks => {
    bookmarks.forEach(bookmark => store.addBookmark(bookmark));
    Bookmarks.render();
  });
});
