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

  partitionSliderFns()
}
