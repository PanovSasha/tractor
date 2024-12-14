import { $BODY, $DOCUMENT, BODY_LOCK_CLASS, SHOW_CLASS } from '../lib/constants'
import { isEscPressed } from '../lib/utils'

export function overlaysFunctions() {
  const $overlay = $('.js-overlay')
  const $overlayItems = $('.js-overlay-item')
  const $BTNS = $('.js-show-overlay-btn')
  const $videoShell = $('.js-overlay-video-shell')

  const closeOverlay = () => {
    $BODY.removeClass(BODY_LOCK_CLASS)
    $videoShell.text('')
    $overlay.removeClass(SHOW_CLASS)
    $overlayItems.removeClass(SHOW_CLASS)
  }

  const toggleOverlay = () => {
    if ($overlay.hasClass(SHOW_CLASS)) {
      $BODY.addClass(BODY_LOCK_CLASS)
    } else {
      closeOverlay()
    }
  }

  const openOverlay = () => {
    $BTNS.on('click', function (event) {
      const $btn = $(this)
      const overlayVal = $btn.attr('data-overlay-anchor')

      if (overlayVal === 'video') {
        const $video = $btn.find('.youtube__picture-img').clone()
        console.log($video[0].nodeName.toLowerCase())

        $video
          .attr('autoplay', 'true')
          .attr('controls', 'true')
          .addClass('overlay-video__source')
          .removeClass('picture__img youtube__picture-img')

        $videoShell.append($video).append(`
          <button class="btn overlay-video__close-btn js-overlay-video-close-btn">
          </button>
        `)

        if ($video[0].nodeName.toLowerCase() === 'iframe') {
          $videoShell.addClass('iframe-class')
        } else {
          $videoShell.removeClass('iframe-class')
        }

        $('.js-overlay-video-close-btn').on('click', function () {
          closeOverlay()
        })
      }

      $overlay.addClass(SHOW_CLASS)
      $overlayItems.removeClass(SHOW_CLASS)
      $(`[data-overlay="${overlayVal}"]`).addClass(SHOW_CLASS)

      toggleOverlay()
    })
  }

  const closeOverlayByActions = () => {
    $overlay.on('click', ({ target }) => {
      if ($(target).hasClass('js-overlay')) {
        closeOverlay()
      }
    })

    $DOCUMENT.on('keyup', (event) => {
      if (isEscPressed(event)) {
        closeOverlay()
      }
    })
  }

  const closeOverlayByCloseBtn = () => {
    const $closeBtn = $('.js-overlay-close-btn')

    $closeBtn.on('click', function () {
      toggleOverlay()
    })
  }

  const closeOverlayByOrderBtn = () => {
    const $closeBtn = $('.js-topline-order-btn')

    $closeBtn.on('click', function () {
      closeOverlay()
    })
  }

  openOverlay()
  closeOverlayByActions()
  closeOverlayByCloseBtn()
  closeOverlayByOrderBtn()
}
