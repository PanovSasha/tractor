import Swiper from 'swiper/bundle'

export const swiperFunctions = () => {
  const partitionSliderFns = () => {
    const partitionSlider = new Swiper('.js-partition', {
      spaceBetween: 0,
      slidesPerView: 1,
      autoplay: {
        delay: 5500,
      },
      loop: true,
      speed: 1200,
      pagination: {
        el: '.js-partition__pagination',
        type: 'bullets',
        clickable: true,
      },

      navigation: {
        prevEl: '.js-partition-btn-prev',
        nextEl: '.js-partition-btn-next',
      },
    })
  }

  const partnersSliderFns = () => {
    if ($('.js-partners').length) {
      const partnersSlider = new Swiper('.js-partners', {
        slidesPerView: 'auto',
        loop: true,
        spaceBetween: 0,
        grabCursor: true,
        autoplay: {
          delay: 1,
          disableOnInteraction: false,
        },
        freeMode: true,
        speed: 5000,
        freeModeMomentum: false,
      })
    }
  }

  partitionSliderFns()
  partnersSliderFns()
}
