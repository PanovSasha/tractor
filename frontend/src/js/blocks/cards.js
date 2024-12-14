import qs from 'qs'
import { addQueryParamsToUrl } from '../lib/utils'
import { SHOW_CLASS } from '../lib/constants'

export const cardsFns = () => {
  const $PAGINATION = $('.js-cards-pagination')
  const $CARDS_SHELL = $('.js-cards-shell')

  if ($CARDS_SHELL.length) {
    const paginationFns = () => {
      const $range = $PAGINATION.find('.paginationjs-ellipsis')
      const $goInput = $PAGINATION.find('.paginationjs-go-input')
      const $goBtn = $PAGINATION.find('.paginationjs-go-button')

      $range.on('click', function () {
        $goInput.toggleClass(SHOW_CLASS)
        $goBtn.toggleClass(SHOW_CLASS)
      })
    }

    const renderPagination = (items, pageSize = 14) => {
      const renderPaginationTertiaryShell = () => {
        const add = (elem) => {
          $.each(elem, function (_, el) {
            const $el = $(el)
            $el.find('a').addClass('btn btn--tertiary')

            $el.append(`
            <div class="btn-tertiary-bg"></div>
            <div class="btn-tertiary-border"></div>
           `)
          })
        }

        const $pageBtns = $('.J-paginationjs-page')
        const $prevBtn = $('.paginationjs-prev')
        const $btns = $('.paginationjs-next')

        add($pageBtns)
        add($prevBtn)
        add($btns)
      }

      const itemsArr = []
      let pageNumber = 1

      itemsArr.length = items

      $PAGINATION.text('')

      const { page } = qs.parse(window.location.search, { ignoreQueryPrefix: true })

      if (page) {
        pageNumber = page
      }

      const pages = Math.ceil(items / pageSize)

      $PAGINATION.pagination({
        pageNumber: pageNumber,
        pageSize: pageSize,
        showGoInput: true,
        showGoButton: true,
        dataSource: itemsArr,
        afterGoButtonOnClick: (_, f) => {
          if (f <= pages) {
            addQueryParamsToUrl({ page: f })
          }
        },
        afterGoInputOnEnter: (_, f) => {
          if (f <= pages) {
            addQueryParamsToUrl({ page: f })
          }
        },
        callback: function (data, pagination) {
          paginationFns()
        },
      })

      renderPaginationTertiaryShell(items)
    }

    const firstRenderPagination = () => {
      const $lastPageNum = $PAGINATION.find('.paginationjs-last').attr('data-num')
      const maxPageElem = $CARDS_SHELL.children().length

      renderPagination($lastPageNum * maxPageElem, maxPageElem)
    }

    const addFiltersToUrlByYearPress = () => {
      const $yearBtns = $('[data-sort-type]')

      $yearBtns.on('click', function () {
        const $t = $(this)

        addQueryParamsToUrl({
          [$t.attr('data-sort-type')]: $t.attr('data-value'),
          page: 1,
        })
      })
    }

    const addFiltersToUrlByPaginationPress = () => {
      const $pageBtns = $PAGINATION.find('[data-num]')

      $pageBtns.on('click', function () {
        const $t = $(this)

        addQueryParamsToUrl({ page: $t.attr('data-num') })
      })
    }

    addFiltersToUrlByYearPress()
    firstRenderPagination()
    addFiltersToUrlByPaginationPress()
  }
}
