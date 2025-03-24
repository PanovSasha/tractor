export const videosFns = () => {
  // autoplay, playsinline (чтобы не на всю страницу на МС), poster="*.jpg"
  const $VIDEO_SHELL = $('.js-videos-item-shell')
  const $VIDEOS_LAY_ITEM = $('.js-videos-lay-item')

  $.each($VIDEO_SHELL, function (_, el) {
    const copyVideoToOverlayShell = () => {
      const $videoEl = $($videoFileCopy[0])

      $VIDEOS_LAY_ITEM.text('').append($videoFileCopy)

      if ($videoFile[0].outerHTML.toLowerCase().includes('iframe')) {
        if ($videoEl.attr('src').toLowerCase().includes('rutube')) {
          $videoFile[0].contentWindow.postMessage(
            JSON.stringify({
              type: 'player:play',
              data: {},
            }),
            '*'
          )
        }
      }

      if ($videoFileCopy[0].outerHTML.toLowerCase().includes('<video')) {
        $videoEl.attr('controls', true).attr('autoplay', true)
      }
    }

    const openVideoOverlay = () => {
      $btn.on('click', function () {
        copyVideoToOverlayShell()
      })
    }

    const $el = $(el)
    const $btn = $el.find('.js-videos-item-btn')
    const $videoFile = $el.find('.videos__item-video')
    const $videoFileCopy = $videoFile.clone().removeClass().addClass('videos-lay__item-video')

    openVideoOverlay()
  })
}
