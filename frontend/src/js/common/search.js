import { $DOCUMENT, ACTIVE_CLASS, OPEN_CLASS, SHOW_CLASS } from '../lib/constants'
import { isEscPressed } from '../lib/utils'

export const searchFns = () => {
  const $SEARCH_PANEL = $('.js-topline-block-search')
  const $SEARCH_BOX = $('.js-input-box-search')
  const $MENU = $('.js-menu')

  const showSearchPanel = () => {
    const $searchBtn = $('.js-topline-block-search-show-btn')

    $searchBtn.on('click', function () {
      $SEARCH_PANEL.addClass(SHOW_CLASS)
      $MENU.removeClass(SHOW_CLASS)
    })
  }

  const hideSearchPanel = () => {
    $MENU.addClass(SHOW_CLASS)
    $SEARCH_PANEL.removeClass(SHOW_CLASS)
  }

  const hideSearchPanelBy = () => {
    $DOCUMENT.on('click', ({ target }) => {
      // if ($(target).closest($SELECTS).length) {
      //   return false
      // }
      //
      // $select.removeClass(OPEN_CLASS)
    })

    $DOCUMENT.on('keyup.select', (event) => {
      if (isEscPressed(event)) {
        hideSearchPanel()
      }
    })
  }

  const searchBySearchBtn = () => {
    $.each($SEARCH_BOX, function (_, el) {
      const $el = $(el)

      const $searchBtn = $el.find('.js-input-search-btn')
    })
  }

  showSearchPanel()
  hideSearchPanelBy()

  //TODO - написать проверку состояния панели при ресайзе
}
