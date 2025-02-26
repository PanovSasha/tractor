import { addQueryParamsToUrl, isEnterPressed } from '../lib/utils'
import { SHOW_CLASS } from '../lib/constants'

export const inputFunctions = () => {
  const $INPUTS = $('.js-input')

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
}
