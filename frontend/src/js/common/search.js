import { $DOCUMENT, HIDDEN_CLASS, IS_DEV, SHOW_CLASS } from '../lib/constants'
import { addQueryParamsToUrl, isEnterPressed, isEscPressed } from '../lib/utils'
import qs from 'qs'

export const searchFns = () => {
  const $SEARCH_PANEL = $('.js-topline-block-search')
  const $SEARCH_BTN = $SEARCH_PANEL.find('.js-input-search-btn')
  const $SEARCH_PLACEHOLDER = $SEARCH_PANEL.find('.js-input-placeholder')
  const $SEARCH_INPUT = $SEARCH_PANEL.find('.js-input')

  const $MENU = $('.js-menu')

  const clearSearchInputByFirstRender = () => {
    let search = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    if (search.q) {
      $SEARCH_PLACEHOLDER.addClass(HIDDEN_CLASS)
      $SEARCH_INPUT.val(search.q)
    } else {
      $SEARCH_INPUT.val('')
    }
  }

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
      if ($(target).closest($SEARCH_PANEL).length) {
        return false
      }

      hideSearchPanel()
    })

    $DOCUMENT.on('keyup.select', (event) => {
      if (isEscPressed(event)) {
        hideSearchPanel()
      }
    })
  }

  const goToSearchPage = () => {
    if ($SEARCH_INPUT !== '') {
      IS_DEV
        ? addQueryParamsToUrl({ q: $SEARCH_INPUT.val() }, null, 'search.html')
        : addQueryParamsToUrl({ q: $SEARCH_INPUT.val() }, null, 'search/')
    }
  }

  const searchBySearchBtn = () => {
    $SEARCH_BTN.on('click', function () {
      goToSearchPage()
    })
  }

  const searchByEnterPress = () => {
    $DOCUMENT.on('keyup.select', (event) => {
      if (isEnterPressed(event)) {
        goToSearchPage()
      }
    })
  }

  showSearchPanel()
  hideSearchPanelBy()
  searchBySearchBtn()
  searchByEnterPress()
  clearSearchInputByFirstRender()

  //TODO - написать проверку состояния панели при ресайзе
}
