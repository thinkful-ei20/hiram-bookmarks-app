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

    $(`.js-bookmarks-list`).html(bookmarksString)
  }

  const handleError = (jqXHR, status, errThrown) => {
    store.error = jqXHR.responseJSON.message
    render()
  }

  const handleNewBookmarkSubmit = () => {
    $(`#js-add-bookmark-form`).submit(event => {
      event.preventDefault()
      const bookmark = {
        title: event.currentTarget[`title`].value,
        url: event.currentTarget[`url`].value,
        desc: event.currentTarget[`desc`].value,
        rating: event.currentTarget[`rating`].value,
      }
      api.createBookmark(bookmark, data => {
        store.addItem(data)
        render()
      }, handleError)
    })
  }

  const getBookmarkIdFromElement = (bookmark) => {
    return $(bookmark)
      .closest(`.js-bookmark-element`)
      .data(`id`)
  }

  const handleDeleteBookmarkClicked = () => {
    $(`.js-bookmarks-list`).on(`click`, `.js-bookmark-delete`, event => {
      const id = getBookmarkIdFromElement(event.currentTarget)
      api.deleteBookmark(id, data => {
        store.findAndDelete(id)
        render()
      }, handleError)
    })
  }

  const handleChangeRatingFilter = () => {
    $(`.js-rating-filter`).on(`change`, event => {
      store.setRatingLevel(event.currentTarget.value)
      render()
    })
  }

  const bindEventListeners = () => {
    handleNewBookmarkSubmit()
    handleDeleteBookmarkClicked()
    handleChangeRatingFilter()
  }

  return {
    render,
    bindEventListeners,
  }
}())