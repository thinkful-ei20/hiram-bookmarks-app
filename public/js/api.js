const api = (function() {
  const BASE_URL = `https://thinkful-list-api.herokuapp.com/hiram`
  const BOOKMARKS_URL = `${BASE_URL}/bookmarks`

  getBookmarks = () => {
    return $.getJSON(BOOKMARKS_URL)
  }

  createBookmark = data => {
    return $.ajax({
      url: BOOKMARKS_URL,
      method: `POST`,
      contentType: `application/json`,
      data: JSON.stringify(data),
    })
  }

  updateBookmark = (id, newData) => {
    return $.ajax({
      url: `${BOOKMARKS_URL}/${id}`,
      method: `PATCH`,
      contentType: `application/json`,
      data: JSON.stringify(newData),
    })
  }

  deleteBookmark = id => {
    return $.ajax({
      url: `${BOOKMARKS_URL}/${id}`,
      method: `DELETE`,
    })
  }

  return {
    getBookmarks,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  }
})()
