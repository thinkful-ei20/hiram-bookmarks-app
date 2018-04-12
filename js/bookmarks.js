const Bookmarks = (function() {
  const generateBookmarkElement = (bookmark) => {
    return `
      <li class="js-bookmark-element bookmark-item" data-id="${bookmark.id}">
        ${bookmark.title}
        <div class="bookmark-item-controls>
          <button role="button" class="bookmark-delete js-bookmark-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>
    `
  }

  const generateBookmarksString = (bookmarkList) => {
    const bookmarks = bookmarkList.map(bookmark => generateBookmarkElement(bookmark))
    return bookmarks.join('')
  }

  const render = () => {
    const bookmarks = store.bookmarks.filter(bookmark => {
      return bookmark.rating > store.minimumRating 
    })

    if (store.error) {
      $(`#err-msg`).html(store.error)
      store.error = null
    }

    console.log(`render ran`)
    const bookmarksString = generateBookmarksString(bookmarks)

    $(`.bookmarks-list`).html(bookmarksString)
  }

  const handleError = (jqXHR, status, errThrown) => {
    store.error = jqXHR.responseJSON.message
    render()
  }

  const handleNewBookmarkSubmit = () => {
    $(`#js-bookmarks-list-form`).submit(event => {
      event.preventDefault()
      const bookmark = {
        title: this[`title`],
        url: this[`url`],
        desc: this[`desc`],
        rating: this[`rating`],
      }
      console.log(bookmark)
    })
  }

  return {

  }
}())