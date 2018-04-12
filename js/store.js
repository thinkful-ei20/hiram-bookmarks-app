const store = (function() {
  const addBookmark = (bookmark) => {
    store.bookmarks.push(bookmark)
  }

  const findById = (id) => {
    return store.bookmarks.find(bookmark => bookmark.id === id)
  }

  const findAndDelete = (id) => {
    store.bookmarks = store.bookmarks.filter(bookmark => bookmark.id !== id)
  }

  const setMinimumRating = (rating) => {
    store.minimumRating = rating
  }

  return {
    bookmarks: [],
    error: null,
    minimumRating: null,
    addBookmark,
    findAndDelete,
    setMinimumRating,
  }
}())