const store = (function() {
  const addBookmark = bookmark => {
    bookmark.detailed = false;
    store.bookmarks.push(bookmark);
  };

  const findById = id => {
    return store.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = id => {
    store.bookmarks = store.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const setMinimumRating = rating => {
    store.minimumRating = rating;
  };

  const toggleBookmarkDetailed = id => {
    const bookmark = findById(id);
    bookmark.detailed = !bookmark.detailed;
  };

  const toggleAddForm = () => {
    store.addForm = !store.addForm
  }

  return {
    bookmarks: [],
    error: null,
    minimumRating: null,
    addForm: false,
    tmpBookmark: {},
    addBookmark,
    findAndDelete,
    setMinimumRating,
    toggleBookmarkDetailed,
    toggleAddForm,
  };
})();
