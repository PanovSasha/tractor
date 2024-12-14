const $animateSvg = $('.js-animate-svg')

export const animateSvg = () => {
  if ($animateSvg.length) {
    const callback = (entries, obs) => {
      entries.forEach((entry) => {
        const el = entry.target

        if (entry.isIntersecting) {
          const animatePaths = $(el).find('.js-animate-path')

          $.each(animatePaths, function (_, el) {
            const $el = $(el)
            $el.addClass('animate')

            el.setAttribute(
              'style',
              'stroke-dasharray:' +
                Math.floor(el.getTotalLength()) +
                ';stroke-dashoffset:' +
                Math.floor(el.getTotalLength())
            )
          })
        }
      })
    }

    const IO = new IntersectionObserver(callback, { threshold: 1 })

    $.each($animateSvg, function (_, el) {
      const $el = $(el)

      IO.observe($el[0])
    })
  }
}
