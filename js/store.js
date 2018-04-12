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
    store.minumumRating = rating
  }

  return {
    bookmarks: [],
    error: null,
    minumumRating: null,
    addBookmark,
    findAndDelete,
    setMinimumRating,
  }
}())