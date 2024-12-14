import { addQueryParamsToUrl, isEnterPressed } from '../lib/utils'
import { SHOW_CLASS } from '../lib/constants'

export const inputFunctions = () => {
  const $INPUTS = $('.js-input')
  const $SEARCH_INPUTS = $('.js-input-search')

  const clearAllFormInputs = () => {
    $INPUTS.val('')
  }

  $.each($INPUTS, function (_, el) {
    const $input = $(el)
    const $inputBox = $(el).parent('.js-input-box')

    const $eraseBtn = $inputBox.find('.js-input-erase-btn:first')

    const toggleShowEraseBtn = () => {
      $input.on('input', function () {
        if ($input.val().trim() !== '') {
          $eraseBtn.addClass(SHOW_CLASS)
        } else {
          $eraseBtn.removeClass(SHOW_CLASS)
        }
      })
    }

    const eraseInputValByBtn = () => {
      $eraseBtn.on('click', function () {
        $input.val('').focus()
        $eraseBtn.removeClass(SHOW_CLASS)
      })
    }

    const showEraseBtnOnFocusInput = () => {
      $input.on('focus', function () {
        if ($input.val().trim() !== '') {
          $eraseBtn.addClass(SHOW_CLASS)
        }
      })
    }

    toggleShowEraseBtn()
    eraseInputValByBtn()
    showEraseBtnOnFocusInput()
  })

  $.each($SEARCH_INPUTS, function (_, el) {
    const $input = $(el)
    const $inputBox = $(el).parent('.js-input-box')
    const $searchBtn = $inputBox.find('.js-input-search-btn:first')

    if ($SEARCH_INPUTS.length) {
      $searchBtn.on('click', function () {
        addQueryParamsToUrl({ q: $input.val() }, null, 'search/')
      })

      $input.on('keyup', (event) => {
        if (isEnterPressed(event)) {
          addQueryParamsToUrl({ q: $input.val() }, null, 'search/')
        }
      })
    }
  })
  // clearAllFormInputs()
}
