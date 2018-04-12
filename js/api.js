const api = (function() {
  const BASE_URL = `https://thinkful-list-api.herokuapp.com/hiram`
  const BOOKMARKS_URL = `${BASE_URL}/bookmarks`

  getBookmarks = (callback) => {
    $.getJSON(BOOKMARKS_URL, callback)
  }

  createBookmark = (data, callback, errCallback) => {
    $.ajax({
      url: BOOKMARKS_URL,
      method: `POST`,
      contentType: `application/json`,
      data: data,
      success: callback,
      error: errCallback,
    })
  }

  updateBookmark = (id, newData, callback, errCallback) => {
    $.ajax({
      url: `${BOOKMARKS_URL}/${id}`,
      method: `PATCH`,
      contentType: `application/json`,
      data: newData,
      success: callback,
      error: errCallback,
    })
  }

  deleteBookmark = (id, callback, errCallback) => {
    $.ajax({
      url: `${BOOKMARKS_URL}/${id}`,
      method: `DELETE`,
      success: callback,
      error: errCallback,
    })
  }

  return {
    getBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  }
}())