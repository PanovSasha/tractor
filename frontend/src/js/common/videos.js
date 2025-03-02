export const videosFns = () => {
  // autoplay, playsinline (чтобы не на всю страницу на МС), poster="*.jpg"
  const $videoShell = $('.js-videos-item-shell')

  $.each($videoShell, function (_, el) {
    const openVideoOverlay = () => {
      $video.on('click', function () {})
    }

    const $el = $(el)
    const $video = $el.find('.js-videos-item')
    const $btn = $el.find('.js-videos-item-btn')

    openVideoOverlay()

    // if (overlayVal === 'video') {
    //   const $video = $btn.find('.youtube__picture-img').clone()
    //   console.log($video[0].nodeName.toLowerCase())
    //
    //   $video
    //     .attr('autoplay', 'true')
    //     .attr('controls', 'true')
    //     .addClass('overlay-video__source')
    //     .removeClass('picture__img youtube__picture-img')
    //
    //   $videoShell.append($video).append(`
    //       <button class="btn overlay-video__close-btn js-overlay-video-close-btn">
    //       </button>
    //     `)
    //
    //   if ($video[0].nodeName.toLowerCase() === 'iframe') {
    //     $videoShell.addClass('iframe-class')
    //   } else {
    //     $videoShell.removeClass('iframe-class')
    //   }
    //
    //   $('.js-overlay-video-close-btn').on('click', function () {
    //     closeOverlay()
    //   })
    // }
  })
}
