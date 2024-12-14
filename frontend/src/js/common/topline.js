import { $BODY, $TOPLINE, BODY_LOCK_CLASS, MOBILE_CLASS, ROTATE_CLASS, SHOW_CLASS } from '../lib/constants'

export const topLineFunctions = () => {
  const toggleMobileMenu = () => {
    const $burger = $('.js-topline-burger')

    $burger.on('click', function () {
      const $t = $(this)

      $TOPLINE.toggleClass(MOBILE_CLASS)
      $BODY.toggleClass(BODY_LOCK_CLASS)
      $('.js-submenu').removeClass(SHOW_CLASS)
      $('.js-topline-nav-item-open-btn').removeClass(ROTATE_CLASS)
    })
  }

  const toggleShowToplineSubmenu = () => {
    const $navItemsWithSubMenu = $('.js-topline-nav-item-with-submenu')

    $.each($navItemsWithSubMenu, function (_, el) {
      const $el = $(el)

      const $openBtn = $el.find('.js-topline-nav-item-open-btn')
      const $submenu = $el.find('.js-submenu')

      $openBtn.on('click', function () {
        $submenu.toggleClass(SHOW_CLASS)
        $openBtn.toggleClass(ROTATE_CLASS)
      })
    })
  }

  toggleMobileMenu()
  toggleShowToplineSubmenu()
}
