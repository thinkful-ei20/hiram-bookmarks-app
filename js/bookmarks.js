const Bookmarks = (function() {
  const generateFormArea = () => {
    if (!store.addForm) {
      return `<button class="button-add js-button-add">Add Bookmark</button>`;
    }
    return `
    <form role="form" id="js-add-bookmark-form" class="add-bookmark-form">
      <label aria-label="title">
        <p>Title</p>
        <input type="text" name="title" id="" required>
      </label>
      <label aria-label="description">
        <p>Description</p>
        <input type="text" name="desc" id="">
      </label>
      <label>
        <p>URL</p>
        <input type="text" name="url" id="" required>
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
      <button role="button" type="submit">Add</button>
    </form>
    `;
  };

  const generateBookmarkElement = bookmark => {
    let details = ``;
    if (bookmark.detailed) {
      details = `
        <p class="bookmark-desc">${bookmark.desc}</p>
        <a class="bookmark-link" href="${
          bookmark.url
        }" target="_blank">Visit Site</a>
      `;
    }
    return `
      <li class="js-bookmark-element bookmark-item" data-id="${bookmark.id}">
        <h2>${bookmark.title} - ${bookmark.rating}</h2>
        ${details}
        <div class="bookmark-item-controls">
          <button role="button" class="bookmark-delete js-bookmark-delete">
            <span class="button-label">delete</span>
          </button>
        </div>
      </li>
    `;
  };

  const generateBookmarksString = bookmarkList => {
    const bookmarks = bookmarkList.map(bookmark =>
      generateBookmarkElement(bookmark)
    );
    return bookmarks.join("");
  };

  const render = () => {
    const bookmarks = store.bookmarks.filter(bookmark => {
      return bookmark.rating >= store.minimumRating;
    });

    if (store.error) {
      $(`#err-msg`).html(store.error);
      store.error = null;
    }

    const formArea = generateFormArea();
    const bookmarksString = generateBookmarksString(bookmarks);

    $(`.js-form-area`).html(formArea);
    $(`.js-bookmarks-list`).html(bookmarksString);
  };

  const handleError = (jqXHR, status, errThrown) => {
    store.error = jqXHR.responseJSON.message;
    render();
  };

  const handleAddBookmarkClicked = () => {
    $(`main`).on(`click`, `.js-button-add`, event => {
      store.toggleAddForm();
      render();
    });
  };

  const handleNewBookmarkSubmit = () => {
    $(`main`).on(`submit`, `#js-add-bookmark-form`, event => {
      event.preventDefault();
      const bookmark = {
        title: event.currentTarget[`title`].value,
        url: event.currentTarget[`url`].value,
        desc: event.currentTarget[`desc`].value,
        rating: event.currentTarget[`rating`].value
      };
      api.createBookmark(
        bookmark,
        data => {
          store.addBookmark(data);
          store.toggleAddForm();
          event.currentTarget[`title`].value = "";
          event.currentTarget[`url`].value = "";
          event.currentTarget[`desc`].value = "";
          event.currentTarget[`rating`].value = "";
          render();
        },
        handleError
      );
    });
  };

  const getBookmarkIdFromElement = bookmark => {
    return $(bookmark)
      .closest(`.js-bookmark-element`)
      .data(`id`);
  };

  const handleDeleteBookmarkClicked = () => {
    $(`.js-bookmarks-list`).on(`click`, `.js-bookmark-delete`, event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(
        id,
        data => {
          store.findAndDelete(id);
          render();
        },
        handleError
      );
    });
  };

  const handleChangeRatingFilter = () => {
    $(`.js-rating-filter`).on(`change`, event => {
      store.setMinimumRating(event.currentTarget.value);
      render();
    });
  };

  const handleBookmarkClicked = () => {
    $(`.js-bookmarks-list`).on(`click`, `.js-bookmark-element`, event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      store.toggleBookmarkDetailed(id);
      render();
    });
  };

  const bindEventListeners = () => {
    handleAddBookmarkClicked();
    handleNewBookmarkSubmit();
    handleDeleteBookmarkClicked();
    handleChangeRatingFilter();
    handleBookmarkClicked();
  };

  return {
    render,
    bindEventListeners
  };
})();
