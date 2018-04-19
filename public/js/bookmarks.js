const Bookmarks = (function() {
  const gernerateRatingsFilter = () => {
    if (store.addForm) return ''
    return `
    <label for="rating-filter" id="ratings-filter-label">
      Minimum Rating:
    </label>
    &nbsp;
    <div class="ratings-filter">
      <select class="js-rating-filter" id="rating-filter">
        <option value="1">1</option>
        <option value="2" ${
          store.minimumRating === 2 ? 'selected' : ''
        }>2</option>
        <option value="3" ${
          store.minimumRating === 3 ? 'selected' : ''
        }>3</option>
        <option value="4" ${
          store.minimumRating === 4 ? 'selected' : ''
        }>4</option>
        <option value="5" ${
          store.minimumRating === 5 ? 'selected' : ''
        }>5</option>
      </select>
    </div>
    `
  }

  const generateFormArea = () => {
    if (!store.addForm) {
      return `<button class="btn js-button-add">Add Bookmark</button>`
    }
    return `
    <form role="form" id="js-add-bookmark-form" class="add-bookmark-form">
      <label aria-label="title">
        <p>Title</p>
        <input type="text" name="title" id="" value="${store.tmpBookmark
          .title || ''}" required>
      </label>
      <label aria-label="description">
        <p>Description</p>
        <input type="text" name="desc" id="" value="${store.tmpBookmark.desc ||
          ''}">
      </label>
      <label>
        <p>URL</p>
        <input type="text" name="url" id="" value="${store.tmpBookmark.url ||
          ''}" required>
      </label>
      <label>
        <p>Rating</p>
        <select name="rating">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </label>
      <div class="form-button-group">
        <button role="button" type="submit" class="btn">
          <span class="button-label">Add</span>
        </button>
        <button role="button" class="btn js-button-cancel" type="button">
          <span class="button-label">Cancel</span>
        </button>
      </div>
    </form>
    `
  }

  const generateBookmarkElement = bookmark => {
    let details = ``
    if (bookmark.detailed) {
      details = `
        <p class="bookmark-desc">${bookmark.desc}</p>
        <a class="bookmark-link" href="${
          bookmark.url
        }" target="_blank">Visit Site</a>
      `
    }
    return `
      <article class="js-bookmark-element bookmark-item" data-id="${
        bookmark.id
      }" tabindex="0">
        <header class="bookmark-item-header">
          <div class="bookmark-item-header-left">
            <h2 class="bookmark-item-title">${bookmark.title}</h2>
            <small class="bookmark-item-rating">
              <span class="fa fa-star ${
                bookmark.rating >= 1 ? 'checked' : ''
              }"></span>
              <span class="fa fa-star ${
                bookmark.rating >= 2 ? 'checked' : ''
              }"></span>
              <span class="fa fa-star ${
                bookmark.rating >= 3 ? 'checked' : ''
              }"></span>
              <span class="fa fa-star ${
                bookmark.rating >= 4 ? 'checked' : ''
              }"></span>
              <span class="fa fa-star ${
                bookmark.rating >= 5 ? 'checked' : ''
              }"></span>
            </small>
          </div>
          <div class="bookmark-item-header-right">
            <div class="bookmark-item-controls">
              <button role="button" class="bookmark-delete js-bookmark-delete">
                <span class="button-label" aria-label="delete"><i class="fas fa-times-circle fa-2x"></i></span>
              </button>
            </div>
          </div>
        </header>
        <div class="bookmark-item-body">
          <div class="bookmark-item-content">
            ${details}
          </div>
        </div>
      </article>
    `
  }

  const generateBookmarksString = bookmarkList => {
    const bookmarks = bookmarkList.map(bookmark =>
      generateBookmarkElement(bookmark)
    )
    return bookmarks.join('')
  }

  const render = () => {
    const bookmarks = store.bookmarks.filter(bookmark => {
      return bookmark.rating >= store.minimumRating
    })

    if (store.error) {
      $(`.err-msg-area`).html(`<p id="err-msg">${store.error}</p>`)
      store.error = null
    } else {
      $(`.err-msg-area`).html('')
    }

    const formArea = generateFormArea()
    const ratingsFilter = gernerateRatingsFilter()
    const bookmarksString = generateBookmarksString(bookmarks)

    $(`.js-form-area`).html(formArea)
    $(`.js-ratings-filter`).html(ratingsFilter)
    $(`.js-bookmarks-list`).html(bookmarksString)
  }

  const handleError = (jqXHR, status, errThrown) => {
    store.error = jqXHR.responseJSON.message
    render()
  }

  const handleAddBookmarkClicked = () => {
    $(`main`).on(`click`, `.js-button-add`, event => {
      store.toggleAddForm()
      store.setMinimumRating(1)
      render()
    })
  }

  const clearForm = () => {
    $(`#js-add-bookmark-form`)[0].reset()
    store.tmpBookmark = {}
  }

  const handleCancelClicked = () => {
    $(`main`).on(`click`, `.js-button-cancel`, event => {
      store.toggleAddForm()
      clearForm()
      render()
    })
  }

  const handleNewBookmarkSubmit = () => {
    $(`main`).on(`submit`, `#js-add-bookmark-form`, event => {
      event.preventDefault()
      const bookmark = {
        title: event.currentTarget[`title`].value,
        url: event.currentTarget[`url`].value,
        desc: event.currentTarget[`desc`].value,
        rating: event.currentTarget[`rating`].value,
      }
      store.tmpBookmark = bookmark
      api
        .createBookmark(bookmark)
        .then(data => {
          store.addBookmark(data)
          store.toggleAddForm()
          store.tmpBookmark = {}
          clearForm()
          render()
        })
        .catch(handleError)
    })
  }

  const getBookmarkIdFromElement = bookmark => {
    return $(bookmark)
      .closest(`.js-bookmark-element`)
      .data(`id`)
  }

  const handleDeleteBookmarkClicked = () => {
    $(`.js-bookmarks-list`).on(`click`, `.js-bookmark-delete`, event => {
      const id = getBookmarkIdFromElement(event.currentTarget)
      api
        .deleteBookmark(id)
        .then(data => {
          store.findAndDelete(id)
          render()
        })
        .catch(handleError)
    })
  }

  const handleChangeRatingFilter = () => {
    $(`.js-ratings-filter`).on(`change`, `.js-rating-filter`, event => {
      store.setMinimumRating(event.currentTarget.value)
      render()
    })
  }

  const handleBookmarkClicked = () => {
    $(`.js-bookmarks-list`).on(`click`, `.js-bookmark-element`, event => {
      const id = getBookmarkIdFromElement(event.currentTarget)
      store.toggleBookmarkDetailed(id)
      render()
    })

    $(`.js-bookmarks-list`).on(`keypress`, `.js-bookmark-element`, event => {
      if (event.which === 13 || event.which === 32) {
        const id = getBookmarkIdFromElement(event.currentTarget)
        store.toggleBookmarkDetailed(id)
        render()
      }
    })
  }

  const bindEventListeners = () => {
    handleAddBookmarkClicked()
    handleNewBookmarkSubmit()
    handleDeleteBookmarkClicked()
    handleChangeRatingFilter()
    handleBookmarkClicked()
    handleCancelClicked()
  }

  return {
    render,
    bindEventListeners,
  }
})()
