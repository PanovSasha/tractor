import counterUp from 'counterup2'

const $FIGURE = $('.js-figure')

export const counterUpFigures = () => {
  if ($FIGURE.length) {
    const callback = (entries, obs) => {
      entries.forEach((entry) => {
        const el = entry.target

        if (entry.isIntersecting) {
          counterUp(el, {
            duration: 1000,
            delay: 16,
          })

          obs.unobserve(entry.target)

          setTimeout(() => {
            entry.target.innerText = Number(entry.target.innerText).toLocaleString('ru')
          }, 1300)
        }
      })
    }

    const IO = new IntersectionObserver(callback, { threshold: 1 })

    $.each($FIGURE, function (_, el) {
      const $el = $(el)
      $el[0].innerHTML = $el[0].innerHTML.replaceAll(' ', '')

      IO.observe($el[0])
    })
  }
}
