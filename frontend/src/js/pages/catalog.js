// тут пример данных http://moidom.xyz/catalog/
// url для запроса данных http://moidom.xyz/api/v1/getCatalogList
// параметры currentPage, filter, sort
// currentPage это номер страницы для пагинации
// filter массив с фильтрами
// sort принимает asc и desc
// когда будешь записывать в адресную строку фильтр обязательно множественный выбор у параметра указывай со скобками []
// "Api-Key": "tUKdAP2Gmv/?VyvCI16rAB=UN7yFpQvirTa5Ix21BzP4w6lFfqrSoySJfKVhXCpH"

import 'paginationjs/dist/pagination.min'
import qs from 'qs'

import { deleteSpinner, morph, renderSpinner } from '../lib/utils'
import {
  $WINDOW,
  CHECKED_CLASS,
  CLOSE_CLASS,
  NO_RESULT_CLASS,
  OPEN_CLASS,
  PAGINATION_CLASS,
  SHOW_CLASS,
  TABLET_WIDTH,
} from '../lib/constants'

const $CATALOG = $('.js-catalog')

export const catalogFns = (data) => {
  if ($CATALOG.length) {
    const $CATALOG_ASIDE = $('.js-catalog-aside')
    const $CATALOG_RESULT = $CATALOG.find('.js-catalog-result')
    const $CATALOG_LIST = $CATALOG.find('.js-catalog-result-list')

    const $CATALOG_FILTER_SHELLS = $CATALOG_ASIDE.find('[data-filter-type]')
    const $CATALOG_FILTER_INPUTS = $CATALOG_FILTER_SHELLS.find('input')
    const $ASIDE_SHOW_BTN = $CATALOG_ASIDE.find('.js-catalog-aside-open-shell-btn')
    const $CATALOG_APPLY_FILTER_BTN = $CATALOG_ASIDE.find('.js-aside-filters-apply-btn')
    const $CATALOG_APPLY_CLEAR_BTN = $CATALOG_ASIDE.find('.js-aside-filters-clear-btn')

    const $MIN_INPUT = $CATALOG_ASIDE.find('.js-aside-filters-block-input-min')
    const $MIN_INPUT_ERASE_BTN = $MIN_INPUT.parent().find('.js-input-erase-btn')
    const $MAX_INPUT = $CATALOG_ASIDE.find('.js-aside-filters-block-input-max')
    const $MAX_INPUT_ERASE_BTN = $MAX_INPUT.parent().find('.js-input-erase-btn')

    const $SORT_ASK_BTN = $CATALOG.find('.js-select-option-up')
    const $SORT_DESC_BTN = $CATALOG.find('.js-select-option-down')

    const $TITLE_COUNT = $CATALOG.find('.js-catalog-result-title-text-count')

    const $range = $('#range')

    const minVal = $range.attr('min')
    const maxVal = $range.attr('max')

    const $PAGINATION = $('.js-catalog-result-pagination')

    const scrollToTopCatalog = () => {
      $('html, body').stop().animate(
        {
          scrollTop: $CATALOG.offset().top,
        },
        600
      )
    }

    const toggleOpenFilters = () => {
      $ASIDE_SHOW_BTN.on('click', function () {
        $CATALOG.toggleClass(OPEN_CLASS)

        if (!$CATALOG.hasClass(OPEN_CLASS)) {
          $CATALOG.addClass(CLOSE_CLASS).removeClass(SHOW_CLASS)
        } else {
          scrollToTopCatalog()
          $CATALOG.removeClass(CLOSE_CLASS)
        }
      })
    }

    const toggleShowAsideBtns = () => {
      $CATALOG_FILTER_INPUTS.on('click', function () {
        if (isInputsEmpty()) {
          $CATALOG_ASIDE.removeClass(CHECKED_CLASS)
        } else {
          $CATALOG_ASIDE.addClass(CHECKED_CLASS)
        }
      })
    }

    const isInputsEmpty = () => {
      if (
        ($MIN_INPUT.val() === '' && $MAX_INPUT.val() === '' && !$CATALOG_FILTER_SHELLS.find('input:checked').length) ||
        ($MIN_INPUT.val() === minVal &&
          $MAX_INPUT.val() === maxVal &&
          !$CATALOG_FILTER_SHELLS.find('input:checked').length) ||
        ($MIN_INPUT.val() === '' &&
          $MAX_INPUT.val() === maxVal &&
          !$CATALOG_FILTER_SHELLS.find('input:checked').length) ||
        ($MIN_INPUT.val() === minVal && $MAX_INPUT.val() === '' && !$CATALOG_FILTER_SHELLS.find('input:checked').length)
      ) {
        return true
      }
    }

    const doubleRangeInputFns = () => {
      class DualRange {
        constructor(a, e) {
          document.querySelectorAll(a).forEach((a) => {
            const t = a.parentNode,
              n = a.className
            ;(a.className = ''),
              a.classList.add('aside-filters__dualrange-input-max'),
              a.max || (a.max = 100),
              a.min || (a.min = 0),
              a.setAttribute('value', a.max || 100),
              a.setAttribute('step', a.step || 1),
              a.setAttribute('data-dualrange-max', ''),
              (a.outerHTML = `<div class="aside-filters__dualrange ${n}" data-dualrange-valmin="${a.min}" data-dualrange-valmax="${a.max}"><input data-dualrange-min step="0.1" type="range" min="${a.min}" max="${a.max}" value="${a.min}" class="aside-filters__dualrange-input-min">${a.outerHTML}<div class="aside-filters__dualrange-min" style="left: 0%; transform: translate(0%, -50%);"></div><div class="aside-filters__dualrange-max" style="left: 100%; transform: translate(-100%, -50%);"></div><div class="aside-filters__dualrange-range"></div></div>`),
              this.init(t, e)
          })
        }

        init(a, e) {
          a.querySelectorAll('.aside-filters__dualrange input').forEach((a, t) => {
            ;(a.step = 0 === t ? a.nextElementSibling.step : a.step), this.range(a, e)
          })
        }

        range(a, e) {
          const t = a.parentNode,
            n = t.children

          a.addEventListener('input', (t) => {
            const l = (100 / (a.max - a.min)) * (a.value - a.min),
              r = parseFloat(n[0].value),
              s = parseFloat(n[1].value),
              i = parseFloat(n[0].step),
              u = new Event('input')

            if (r > s)
              return (
                (n[0].value = r - Math.max(1, i)),
                (n[1].value = s + Math.max(1, i)),
                n[0].dispatchEvent(u),
                n[1].dispatchEvent(u),
                !1
              )
            ;(n[a.hasAttribute('data-dualrange-max') ? 3 : 2].style.left = `${l}%`),
              (n[a.hasAttribute('data-dualrange-max') ? 3 : 2].style.transform = `translate(-${l}%, -50%)`),
              e &&
                (clearTimeout(window.dualRangeCallback),
                (window.dualRangeCallback = setTimeout(() => {
                  e({
                    min: parseFloat(a.parentNode.children[0].value),
                    max: parseFloat(a.parentNode.children[1].value),
                  })
                }, 10)))
          }),
            (a.name =
              'aside-filters__dualrange-input-min' === a.className ? `${a.nextElementSibling.name}[]` : `${a.name}[]`),
            t.addEventListener('mousemove', (a) => {
              const e = a.offsetX,
                n = t.clientWidth,
                l = parseFloat(t.querySelector('.aside-filters__dualrange-min').style.left),
                r = parseFloat(t.querySelector('.aside-filters__dualrange-max').style.left),
                s = parseInt((100 * e) / n) - l < Math.abs((100 * e) / n - r)

              t
                .querySelector(s ? '.aside-filters__dualrange-input-min' : '.aside-filters__dualrange-input-max')
                .classList.add('aside-filters__dualrange-zindex'),
                t
                  .querySelector(s ? '.aside-filters__dualrange-input-max' : '.aside-filters__dualrange-input-min')
                  .classList.remove('aside-filters__dualrange-zindex')

              if (isInputsEmpty()) {
                $CATALOG_ASIDE.removeClass(CHECKED_CLASS)
              } else {
                $CATALOG_ASIDE.addClass(CHECKED_CLASS)
              }
            })
        }

        callback(a, e) {
          e()
        }
      }

      new DualRange('#range', (e) => {
        $MIN_INPUT.attr('value', e.min).val(e.min)
        $MAX_INPUT.attr('value', e.max).val(e.max)
      })

      const $minRangeThumb = $('.aside-filters__dualrange-min')
      const $maxRangeThumb = $('.aside-filters__dualrange-max')

      const setMinThumbsPosition = () => {
        if (Number($MIN_INPUT.val()) < Number(minVal) && Number($MAX_INPUT.val()) > Number($MIN_INPUT.val())) {
          $maxRangeThumb.css('left', `0`)
          $maxRangeThumb.css('transform', `translate(0, -50%)`)
        } else {
          if (Number($MAX_INPUT.val()) > Number($MIN_INPUT.val())) {
            const l = (100 / (maxVal - minVal)) * ($MIN_INPUT.val() - minVal)
            $minRangeThumb.css('left', `${l}%`)
            $minRangeThumb.css('transform', `translate(-${l}%, -50%)`)
          } else {
            const l = (100 / (maxVal - minVal)) * ($MAX_INPUT.val() - minVal)
            $maxRangeThumb.css('left', `${l}%`)
            $maxRangeThumb.css('transform', `translate(-${l}%, -50%)`)
          }
        }
      }

      const setMaxThumbsPosition = () => {
        if (Number($MAX_INPUT.val()) >= Number(maxVal) && Number($MAX_INPUT.val()) > Number($MIN_INPUT.val())) {
          $maxRangeThumb.css('left', `100%`)
          $maxRangeThumb.css('transform', `translate(-100%, -50%)`)
        } else {
          if (Number($MAX_INPUT.val()) > Number($MIN_INPUT.val())) {
            const l = (100 / (maxVal - minVal)) * ($MAX_INPUT.val() - minVal)
            $maxRangeThumb.css('left', `${l}%`)
            $maxRangeThumb.css('transform', `translate(-${l}%, -50%)`)
          } else {
            const l = (100 / (maxVal - minVal)) * ($MIN_INPUT.val() - minVal)
            $maxRangeThumb.css('left', `${l}%`)
            $maxRangeThumb.css('transform', `translate(-${l}%, -50%)`)
          }
        }
      }

      const resetRangeThumbsPosition = () => {
        $CATALOG_APPLY_CLEAR_BTN.on('click', function () {
          $MIN_INPUT.val(minVal)
          $MAX_INPUT.val(maxVal)
          setMinThumbsPosition()
          setMaxThumbsPosition()
        })
      }

      const setRangeThumbsPositionByInput = () => {
        $MIN_INPUT.on('input', function () {
          setMinThumbsPosition()

          if ($MIN_INPUT.val() !== minVal && $MIN_INPUT.val() !== '') {
            $CATALOG_ASIDE.addClass(CHECKED_CLASS)
          }

          if (isInputsEmpty()) {
            $CATALOG_ASIDE.removeClass(CHECKED_CLASS)
          }
        })

        $MIN_INPUT_ERASE_BTN.on('click', function () {
          setMinThumbsPosition()

          if (isInputsEmpty()) {
            $CATALOG_ASIDE.removeClass(CHECKED_CLASS)
          }
        })

        $MIN_INPUT.on('focusout', function () {
          if (Number($MIN_INPUT.val()) < Number(minVal) && Number($MAX_INPUT.val()) > Number($MIN_INPUT.val())) {
            $MIN_INPUT.val(minVal)
            $maxRangeThumb.css('left', `0`)
            $maxRangeThumb.css('transform', `translate(0, -50%)`)
          } else {
            if (Number($MAX_INPUT.val()) < Number($MIN_INPUT.val())) {
              $MIN_INPUT.val($MAX_INPUT.val())
              const l = (100 / (maxVal - minVal)) * ($MAX_INPUT.val() - minVal)
              $minRangeThumb.css('left', `${l}%`)
              $minRangeThumb.css('transform', `translate(-${l}%, -50%)`)
            }
          }
        })

        $MAX_INPUT.on('input', function () {
          setMaxThumbsPosition()
        })

        $MAX_INPUT_ERASE_BTN.on('click', function () {
          setMaxThumbsPosition()

          if (isInputsEmpty()) {
            $CATALOG_ASIDE.removeClass(CHECKED_CLASS)
          }
        })

        $MAX_INPUT.on('focusout', function () {
          if (Number($MAX_INPUT.val()) >= Number(maxVal) && Number($MAX_INPUT.val()) > Number($MIN_INPUT.val())) {
            $MAX_INPUT.val(maxVal)
            $maxRangeThumb.css('left', `100%`)
            $maxRangeThumb.css('transform', `translate(-100%, -50%)`)
          } else {
            if (Number($MAX_INPUT.val()) < Number($MIN_INPUT.val())) {
              setTimeout(() => {
                $MAX_INPUT.val($MIN_INPUT.val())
                const l = (100 / (maxVal - minVal)) * ($MAX_INPUT.val() - minVal)
                $maxRangeThumb.css('left', `${l}%`)
                $maxRangeThumb.css('transform', `translate(-${l}%, -50%)`)
              }, 10)
            }
          }
        })
      }

      setRangeThumbsPositionByInput()
      resetRangeThumbsPosition()
      setMinThumbsPosition()
      setMaxThumbsPosition()
    }

    const renderData = (data) => {
      const renderDataItem = (data) => {
        let items = ''

        $.each(data, function (_, el) {
          const {
            name,
            code,
            constructionTechnology,
            houseSize,
            id,
            livingArea,
            numberFloors,
            numberRooms,
            previewPicture,
            url,
          } = el

          const { src } = previewPicture

          items =
            items +
            `
                <a
                href="${url}"
                class="houses__card accessibility-link">
                <div class="houses__card-picture picture picture--scale">
                  <img
                    class="picture__img"
                    loading="lazy" src="${src}" alt="">
                  
                  <div class="houses__card-props">
                    <span class="houses__card-prop">
                      ${numberFloors}
                    </span>
                    
                    <span class="houses__card-prop">
                      ${morph(numberRooms, ['комната', 'комнаты', 'комнат'])}
                    </span>
                  </div>
                </div>
                
                <div class="houses__card-title-shell">
                  <h3 class="h5 houses__card-title">
                    ${name}
                  </h3>
                  
                  <div class="houses__card-title-types">
                    <p class="houses__card-title-type">
                      ${constructionTechnology}
                    </p>
                  </div>
                </div>
                
                <div class="houses__card-data">
                  <p>
                    Площадь дома: ${livingArea}&nbsp;м²
                  </p>
                  
                  <p>
                    Размеры: ${houseSize}
                  </p>
                </div>
                
                <div class="houses__card-tags">
                  <p
                    class="btn btn--primary-text houses__card-tag houses__card-tag--year">
                    Подробнее
                    
                    <svg class="icon icon--16">
                      <use
                        xlink:href="/assets/sprite/sprite.svg#arrow-right"></use>
                    </svg>
                  </p>
                </div>
              </a>
          `
        })

        return items
      }

      $CATALOG_LIST.removeClass(NO_RESULT_CLASS).append(renderDataItem(data))
    }

    const getDataParams = () => {
      const filterData = {}
      const data = {}

      data.sort = $CATALOG.find('.active.js-select-option').attr('data-sort')

      $.each($CATALOG_FILTER_SHELLS, function (_, shell) {
        const $shell = $(shell)

        const type = $shell.attr('data-filter-type')
        const $checkedInputs = $shell.find('input:checked')

        if ($checkedInputs.length) {
          let checkedFilters = []

          $.each($checkedInputs, function (_, el) {
            const $el = $(el)

            checkedFilters.push($el.attr('name'))
          })

          filterData[type] = checkedFilters
        }
      })

      filterData['square-min'] = [$MIN_INPUT.val()]
      filterData['square-max'] = [$MAX_INPUT.val()]

      data.filter = filterData

      return data
    }

    const addFiltersValueToUrl = (filters) => {
      window.history.replaceState({}, document.title, window.location.pathname)

      const url = new URL(window.location.href)

      const { filter, currentPage, sort } = filters

      if (currentPage) {
        url.searchParams.set('currentPage', currentPage)
      }

      if (sort) {
        url.searchParams.set('sort', sort)
      }

      $.each(filter, function (i, el) {
        if (el.length > 1) {
          $.each(el, function (_, elem) {
            url.searchParams.append(`${i}[]`, elem)
          })
        } else {
          url.searchParams.set(i, el)
        }
      })

      window.history.replaceState({}, document.title, url)
    }

    const dataQuery = (currentPage = 1) => {
      data = getDataParams()
      data.currentPage = currentPage

      addFiltersValueToUrl(data)

      $CATALOG_LIST.html('').addClass(NO_RESULT_CLASS)
      $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
      renderSpinner($CATALOG_LIST)

      $.ajax({
        type: 'POST',
        url: '/api/v1/getCatalogList',
        headers: {
          'Api-Key': 'tUKdAP2Gmv/?VyvCI16rAB=UN7yFpQvirTa5Ix21BzP4w6lFfqrSoySJfKVhXCpH',
        },
        data: data,
        processData: true,
        success: (data) => {
          scrollToTopCatalog()
          deleteSpinner()

          const { countRecord, endList, items, pageCount, pageSize } = data.data

          if (countRecord) {
            $TITLE_COUNT.text(`Найдено проектов: ${countRecord}`)
          } else {
            $TITLE_COUNT.text(`Найдено проектов: 0`)

            $CATALOG_LIST.html(`Проекты по&nbsp;вашим параметрам не&nbsp;найдены, измените условия поиска.`)
          }

          if (items.length) {
            renderData(items)

            if (countRecord > pageSize) {
              if (currentPage === 1 && pageCount > 1) {
                $CATALOG_RESULT.addClass(PAGINATION_CLASS)
                renderPagination(countRecord, pageSize)
              }
            } else {
              $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
            }
          } else {
            $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
          }
        },
      })
    }

    const dataQueryByApplyFilterBtnPress = () => {
      $CATALOG_APPLY_FILTER_BTN.on('click', function () {
        dataQuery()

        if ($WINDOW.width() <= TABLET_WIDTH) {
          $CATALOG.removeClass(OPEN_CLASS)
        }
      })
    }

    const dataQueryBySortBtnPress = () => {
      $SORT_ASK_BTN.on('click', function () {
        dataQuery()
      })

      $SORT_DESC_BTN.on('click', function () {
        dataQuery()
      })
    }

    const resetFilters = () => {
      $CATALOG_APPLY_CLEAR_BTN.on('click', function () {
        setTimeout(() => {
          $CATALOG_FILTER_SHELLS.find('input:checked').prop('checked', false)
          $CATALOG_ASIDE.removeClass(CHECKED_CLASS)

          if ($WINDOW.width() > TABLET_WIDTH) {
            dataQuery()
          }
        }, 100)
      })
    }

    const paginationFns = () => {
      const $range = $PAGINATION.find('.paginationjs-ellipsis')
      const $goInput = $PAGINATION.find('.paginationjs-go-input')
      const $goBtn = $PAGINATION.find('.paginationjs-go-button')

      $range.on('click', function () {
        $goInput.toggleClass(SHOW_CLASS)
        $goBtn.toggleClass(SHOW_CLASS)
      })
    }

    const firstRenderPagination = () => {
      const $lastPageNum = $PAGINATION.find('.paginationjs-last').attr('data-num')
      const maxPageElem = 12

      renderPagination($lastPageNum * maxPageElem)
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

      $PAGINATION.pagination({
        pageNumber: pageNumber,
        pageSize: pageSize,
        showGoInput: true,
        showGoButton: true,
        dataSource: itemsArr,
        afterNextOnClick: () => {
          queryDataByActivePaginationElem()
          renderPaginationTertiaryShell(items)
        },
        afterPreviousOnClick: () => {
          queryDataByActivePaginationElem()
          renderPaginationTertiaryShell(items)
        },
        afterGoButtonOnClick: () => {
          queryDataByActivePaginationElem()
          renderPaginationTertiaryShell(items)
        },
        afterGoInputOnEnter: () => {
          queryDataByActivePaginationElem()
          renderPaginationTertiaryShell(items)
        },
        afterPageOnClick: () => {
          queryDataByActivePaginationElem()
          renderPaginationTertiaryShell(items)
        },
        callback: function (data, pagination) {
          paginationFns()
        },
      })

      renderPaginationTertiaryShell(items)
    }

    const queryDataByActivePaginationElem = () => {
      const activeElemNum = $PAGINATION.find('.active').attr('data-num')

      dataQuery(activeElemNum)
    }

    firstRenderPagination()
    dataQueryByApplyFilterBtnPress()
    dataQueryBySortBtnPress()
    toggleShowAsideBtns()
    resetFilters()
    toggleOpenFilters()
    doubleRangeInputFns()
  }
}
