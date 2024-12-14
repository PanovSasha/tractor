import { DISABLE_CLASS, ERROR_CLASS } from '../lib/constants'

export const orderFormFns = () => {
  const $form = $('.js-order-form')

  if ($form.length) {
    const regExpEmail = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+\.[A-Z]{2,4}$/i
    const regExpPhone = /^\d+$/

    const $agreeCheckbox = $form.find('.js-order-form-agree-input')
    const $inputs = $form.find('.js-order-form-input')
    const name = $form.find('[name="fullName"]')
    const phone = $form.find('[name="phone"]')
    const email = $form.find('[name="email"]')

    const $botCheckInput = $form.find('.js-bot-check')

    const $SUBMIT_BTN = $form.find('.js-order-submit-btn')

    const ERROR_PHONE = 'error-phone'
    const ERROR_MAIL = 'error-mail'

    let isPhoneValid = false
    let isEmailValid = false

    const clearInputs = () => {
      $inputs.val('')
    }

    const isInputsValues = (submitBtnClick) => {
      let inputsWithVal = true

      $.each($inputs, function (_, el) {
        const $el = $(el)

        if ($el.val().trim() === '') {
          if (submitBtnClick) {
            $el.parent().find('.js-order-form-input-placeholder').addClass(ERROR_CLASS)

            if ($el[0].name === 'phone') {
              phone.parent().removeClass(ERROR_PHONE)
            }

            if ($el[0].name === 'email') {
              email.parent().removeClass(ERROR_MAIL)
            }
          }

          inputsWithVal = false
        }
      })

      return inputsWithVal
    }

    const checkInputValByFocusout = () => {
      $.each($inputs, function (_, el) {
        const $el = $(el)

        $el.on('focusout', function () {
          if ($el.val().trim() === '') {
            $el.parent().find('.js-order-form-input-placeholder').addClass(ERROR_CLASS)

            if ($el[0].name === 'phone') {
              phone.parent().removeClass(ERROR_PHONE)
            }

            if ($el[0].name === 'email') {
              email.parent().removeClass(ERROR_MAIL)
            }
          }
        })
      })
    }

    const sendData = () => {
      // адрес http://moidom.xyz/api/v1/addFormRecord
      // параметры params, type, bot
      //
      // params это объект содержит fullName, phone, email
      // type строка может иметь значение consultation или calculation иначе ошибка
      // bot нужен для проверки на бота если 0 то все хорошо иначе ошибка
      //
      // проверку на бота можешь навесить на событие input обязательного поля если оно произошло то это не бот и отправляем 0 иначе отправляем 1 или любое удобное для тебя значение
      const params = {
        fullName: name.val(),
        phone: `+7${phone.val()}`,
        email: email.val(),
      }

      const data = {}

      data.params = params
      data.type = $form.attr('data-form-type')
      data.bot = $botCheckInput.val() || $botCheckInput.attr('placeholder') || 0

      $.ajax({
        url: '/api/v1/addFormRecord',
        method: 'post',
        username: 'user',
        password: 'AdsgdX32ga@',
        headers: {
          'Api-Key': 'tUKdAP2Gmv/?VyvCI16rAB=UN7yFpQvirTa5Ix21BzP4w6lFfqrSoySJfKVhXCpH',
        },
        data: data,
        success: function ({ errors }) {
          let isError = false

          if (errors.length) {
            errors.forEach(({ code }) => {
              isError = true

              if (code === 6) {
                console.log('ошибка капчи')
              }
            })
          } else {
            if (window.location.hostname === 'localhost') {
              window.location.href = 'success-message.html'
            } else {
              window.location.href = '/success-message'
            }
          }
        },
      })
    }

    const checkFormFields = (submitBtnClick) => {
      const isPrivateAccept = $agreeCheckbox.prop('checked')
      const allInputsWithValues = isInputsValues(submitBtnClick)

      if (allInputsWithValues && isPrivateAccept && isPhoneValid && isEmailValid) {
        $SUBMIT_BTN.removeClass(DISABLE_CLASS)
        return true
      } else {
        $SUBMIT_BTN.addClass(DISABLE_CLASS)
      }
    }

    const checkInputValue = function (value, regexp) {
      if (regexp.test(value)) return true
    }

    const checkPhoneValue = (submitBtnClick) => {
      const checkPhone = checkInputValue(phone.val(), regExpPhone)

      if (!checkPhone) {
        phone.parent().addClass(ERROR_PHONE)
        isPhoneValid = false
      } else {
        phone.parent().removeClass(ERROR_PHONE)
        isPhoneValid = true
      }
    }

    const checkEmailValue = (submitBtnClick) => {
      const checkEmail = checkInputValue(email.val(), regExpEmail)

      if (!checkEmail) {
        if (!submitBtnClick && email.val().trim() !== '') {
          email.parent().addClass(ERROR_MAIL)
          isEmailValid = false
        }
      } else {
        email.parent().removeClass(ERROR_MAIL)
        isEmailValid = true
      }
    }

    const checkInputValueByInput = () => {
      $inputs.on('input', function () {
        const $t = $(this)

        const $tPlaceholder = $t.parent().find('.js-order-form-input-placeholder')
        if ($t.val().trim() === '') {
          $tPlaceholder.show()
        } else {
          $tPlaceholder.hide().removeClass(ERROR_CLASS)
        }

        setTimeout(() => {
          checkFormFields()
        }, 100)
      })
    }

    const checkSpecialInputsForError = () => {
      email.on('input', () => {
        checkEmailValue()
      })

      phone.on('input', () => {
        checkPhoneValue()
      })
    }

    const checkAllFieldsFormBySubmitBtnPress = () => {
      $SUBMIT_BTN.on('click', function (e) {
        checkPhoneValue(true)
        checkEmailValue(true)

        if (checkFormFields(true)) {
          sendData()
        }
      })
    }

    $agreeCheckbox.on('click', function () {
      checkFormFields()
    })

    clearInputs()
    checkInputValueByInput()
    checkInputValByFocusout()
    checkSpecialInputsForError()
    checkAllFieldsFormBySubmitBtnPress()
  }
}
