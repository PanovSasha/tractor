import 'paginationjs/dist/pagination.min'
import qs from 'qs'

import { deleteSpinner, isEnterPressed, morph, renderSpinner } from '../lib/utils'
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

// Отправить выбранные детали
// /api/v1/add_order
// все тоже самое что и с parts
// принимает параметры в json
// {
//   "name": "Иван",
//   "phone": "56456456456",
//   "parts": ["90.32.031-01СБ", "20005493AAFG", "100.71.011СБ"]
// }

export const catalogFns = (data) => {
  if ($CATALOG.length) {
    const $CATALOG_ASIDE = $('.js-catalog-aside')
    const $CATALOG_RESULT = $CATALOG.find('.js-catalog-results')
    const $CATALOG_LIST = $CATALOG.find('.js-catalog-results-items')

    const $CART = $CATALOG.find('.js-catalog-aside-cart')
    const $CART_LIST = $CATALOG.find('.js-catalog-aside-cart-list')
    const $CART_SUM = $CATALOG.find('.js-catalog-aside-cart-sum')

    const $ARTICLE_INPUT = $CATALOG.find('[name="article"]')
    const $ARTICLE_INPUT_SHELL = $ARTICLE_INPUT.parent('.js-catalog-filters-input-box')
    const $ARTICLE_INPUT_ERASE_BTN = $ARTICLE_INPUT_SHELL.find('.js-input-erase-btn')
    const $ARTICLE_INPUT_SEARCH_BTN = $ARTICLE_INPUT_SHELL.find('.js-input-search-btn')

    const $NAME_INPUT = $CATALOG.find('[name="name"]')
    const $NAME_INPUT_SHELL = $NAME_INPUT.parent('.js-catalog-filters-input-box')
    const $NAME_INPUT_ERASE_BTN = $NAME_INPUT_SHELL.find('.js-input-erase-btn')
    const $NAME_INPUT_SEARCH_BTN = $NAME_INPUT_SHELL.find('.js-input-search-btn')

    const $SELECT = $CATALOG.find('.js-catalog-filters-select')
    const $SELECT_CURRENT_BTN = $SELECT.find('.js-select-current-btn')

    const $TITLE_COUNT = $CATALOG.find('.js-catalog-results-count')

    const $PAGINATION = $('.js-catalog-result-pagination')

    let STORE = []

    const scrollToTopCatalog = () => {
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $CATALOG.offset().top - 100,
          },
          300
        )
    }

    const addItemToCart = (article, name, price) => {
      const deleteItemByPressDelCartBtn = () => {
        const $delBtns = $('.js-catalog-aside-cart-list-item-del')

        $delBtns.on('click', function () {
          const $cartItem = $(this).parents('.js-catalog-aside-cart-list-item')
          const article = $cartItem.attr('data-article')

          deleteItemFromStores(article)
          deleteItemFromCart(article)

          if ($CART_LIST.children().length === 0) {
            $CART.removeClass(SHOW_CLASS)
          }

          $.each($('.js-catalog-results-item'), function (_, el) {
            const $el = $(el)

            if ($el.attr('data-article') === article) {
              $el.attr('data-condition', 'add')
            }
          })

          console.log(STORE, 'Store')
        })
      }

      $CART.addClass(SHOW_CLASS)

      $CART_LIST.append(
        `
               <div
                data-article="${article}"
                class="catalog__aside-cart-list-item js-catalog-aside-cart-list-item">
                <p class="catalog__aside-cart-item-name">
                  ${name.toLowerCase()}
                </p>
                
                <p class="catalog__aside-cart-item-price-name">
                  Цена с&nbsp;НДС
                </p>
                
                <p class="catalog__aside-cart-item-price js-catalog-aside-cart-item-price">
                  ${price}
                </p>
                
                <button
                  class="catalog__aside-cart-list-item-del js-catalog-aside-cart-list-item-del btn btn--primary">
                </button>
              </div>
          `
      )

      deleteItemByPressDelCartBtn()
    }

    const setAddConditionForItemsFromStore = () => {
      const $currentItems = $('.js-catalog-results-item')

      $.each(STORE, function (_, elemStore) {
        $.each($currentItems, function (_, el) {
          const $el = $(el)

          if (elemStore.article === $el.attr('data-article')) {
            $el.attr('data-condition', 'del')

            const article = $el.attr('data-article')
            const name = $el.find('.js-catalog-results-item-name').text()
            const price = $el.find('.js-catalog-results-item-price-value').text()
          }
        })
      })
    }

    const initStores = () => {
      const items = window.localStorage.getItem('items')

      if (items) {
        STORE = JSON.parse(items)
      }

      $.each(STORE, function (_, el) {
        changeCartSum(el.price, 'add')
        addItemToCart(el.article, el.name, el.price)
      })

      console.log(STORE)
    }

    const changeCartSum = (price, operation) => {
      const cartSum = Number($CART_SUM.text().replaceAll(' ', '').replaceAll(',', '.').replaceAll('₽', ''))

      const clearPrise = Number(price.replaceAll(' ', '').replaceAll(',', '.').replaceAll('₽', ''))

      let finalSum

      if (operation === 'add') {
        finalSum = cartSum + clearPrise
      }

      if (operation === 'del') {
        finalSum = cartSum - clearPrise
      }

      finalSum = finalSum.toFixed(2).toString().replaceAll('.', ', ')

      $CART_SUM.text(`${finalSum} ₽`)
    }

    const addItemToStores = (article, name, price) => {
      let isItemInStore = false

      if (STORE.length) {
        console.log('yui')

        console.log(STORE, ' STORESTORE')

        $.each(STORE, function (_, el) {
          console.log(el.article, 'el.article')
          console.log(article, 'article')

          if (el.article === article) {
            isItemInStore = true
          }
        })

        if (!isItemInStore) {
          STORE.push({ article, name, price })
        }
      } else {
        STORE.push({ article, name, price })
      }

      console.log(STORE, 'store')

      window.localStorage.setItem('items', JSON.stringify(STORE))

      addItemToCart(article, name, price)
      changeCartSum(price, 'add')
    }

    const deleteItemFromCart = (article) => {
      const $cartItems = $('.js-catalog-aside-cart-list-item')

      $.each($cartItems, function (_, el) {
        const $el = $(el)
        const price = $el.find('.js-catalog-aside-cart-item-price').text()

        if ($el.attr('data-article') === article) {
          $el.remove()
          changeCartSum(price, 'del')
        }
      })

      if ($CART_LIST.children().length === 0) {
        $CART.removeClass(SHOW_CLASS)
      }
    }

    const deleteItemFromStores = (item) => {
      const tempStore = []

      $.each(STORE, function (_, el) {
        if (el.article !== item) {
          tempStore.push(el)
        }
      })

      STORE = tempStore

      window.localStorage.setItem('items', JSON.stringify(STORE))
    }

    const itemsFn = () => {
      const $items = $('.js-catalog-results-item')

      $.each($items, function (_, el) {
        const $item = $(el)
        const article = $item.attr('data-article')
        const name = $item.find('.js-catalog-results-item-name').text()
        const price = $item.find('.js-catalog-results-item-price-value').text()

        const $itemAddBtn = $item.find('.js-catalog-results-item-add-to-cart')
        const $itemDelBtn = $item.find('.js-catalog-results-item-del-from-cart')

        $itemAddBtn.on('click', function () {
          addItemToStores(article, name, price)
          $item.attr('data-condition', 'del')
        })

        $itemDelBtn.on('click', function () {
          deleteItemFromStores(article)
          deleteItemFromCart(article)
          $item.attr('data-condition', 'add')
        })
      })
    }

    const renderData = (data) => {
      const renderTime = (productTime) => {
        if (/^\d+$/.test(productTime)) {
          return `
            ${productTime}
            
             <p class="catalog-results__item-time-descr">
              Срок изготовления
             </p>
          `
        }

        return productTime
      }

      const renderDataItem = (data) => {
        let items = ''

        $.each(data, function (_, el) {
          const { code, name, priceVat, priceWithVat, productTime, technics } = el

          items =
            items +
            `
              <div
                data-condition=""
                data-article="${code}"
                class="catalog-results__item download js-catalog-results-item">
                <div class="catalog-results__item-body">
                  <h3 class="catalog-results__item-name js-catalog-results-item-name">${name}</h3>
                  
                  <div class="catalog-results__item-props">
                    <div class="catalog-results__item-article">
                      ${code}
                    </div>
                    
                    <div class="catalog-results__item-time">
                      ${renderTime(productTime)}
                    </div>
                    
                    <div class="catalog-results__item-tractor-name">
                      ${technics}
                    </div>
                    
                    <div class="catalog-results__item-price">
                      Цена без НДС
                      
                      <p
                        class="catalog-results__item-price-value">
                        ${priceVat}&nbsp;₽
                      </p>
                    </div>
                    
                    <div class="catalog-results__item-price">
                      Цена с&nbsp;НДС
                      
                      <p
                        class="catalog-results__item-price-value js-catalog-results-item-price-value">${priceWithVat}&nbsp;₽</p>
                    </div>
                  </div>
                </div>
                
                <button
                class="catalog-results__item-add-to-cart js-catalog-results-item-add-to-cart"
                type="button">
                  <svg class="icon icon--24">
                    <use xlink:href="/assets/sprite/sprite.svg#cart"></use>
                  </svg>
                  
                  <span class="only-tablet">
                    Добавить в&nbsp;корзину
                  </span>
                </button>
                
                <button class="btn btn--primary catalog-results__item-del-from-cart js-catalog-results-item-del-from-cart">
                  Удалить
                </button>
                
                <button 
                class="catalog-results__item-add-to-cart catalog-results__item-add-to-cart--absolute js-catalog-results-item-add-to-cart"
                type="button">
                </button>
                
                <button class="btn btn--primary catalog-results__item-del-from-cart catalog-results__item-del-from-cart--absolute js-catalog-results-item-del-from-cart">
                </button>
              </div>
          `
        })

        return items
      }

      $CATALOG_LIST.removeClass(NO_RESULT_CLASS).append(renderDataItem(data))

      itemsFn()
    }

    const getDataParams = () => {
      const data = {}

      data.article = $ARTICLE_INPUT.val()
      data.name = $NAME_INPUT.val()
      data.tractor = $SELECT_CURRENT_BTN.attr('data-tractor')

      return data
    }

    const addFiltersValueToUrl = (filters) => {
      window.history.replaceState({}, document.title, window.location.pathname)

      const url = new URL(window.location.href)

      $.each(filters, function (i, el) {
        url.searchParams.set(i, el)
      })

      window.history.replaceState({}, document.title, url)
    }

    const dataQuery = (currentPage = 1) => {
      data = getDataParams()
      data.page = currentPage

      addFiltersValueToUrl(data)
      scrollToTopCatalog()

      setTimeout(() => {
        $CATALOG_LIST.html('').addClass(NO_RESULT_CLASS)
        $CATALOG_RESULT.removeClass(PAGINATION_CLASS)
        renderSpinner($CATALOG_LIST)
      }, 400)

      $.ajax({
        type: 'post',
        url: '/api/v1/parts',
        headers: {
          'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
        },
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: (data) => {
          const { codes, items, names, countRecord, nav: { page, pageCount, pageEnd, pageSize } = {} } = data.data
          deleteSpinner()

          if (countRecord) {
            $TITLE_COUNT.text(countRecord)
          } else {
            $TITLE_COUNT.text(0)

            $CATALOG_LIST.html(`Запчасти по&nbsp;вашим параметрам не&nbsp;найдены, измените условия поиска.`)
            $CATALOG_LIST.removeClass(NO_RESULT_CLASS)
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

          setAddConditionForItemsFromStore()
        },
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
      const maxPageElem = 10

      renderPagination($lastPageNum * maxPageElem)
    }

    const renderPagination = (items, pageSize = 10) => {
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
        },
        afterPreviousOnClick: () => {
          queryDataByActivePaginationElem()
        },
        afterGoButtonOnClick: () => {
          queryDataByActivePaginationElem()
        },
        afterGoInputOnEnter: () => {
          queryDataByActivePaginationElem()
        },
        afterPageOnClick: () => {
          queryDataByActivePaginationElem()
        },
        callback: function (data, pagination) {
          paginationFns()
        },
      })
    }

    const queryDataByActivePaginationElem = () => {
      const activeElemNum = $PAGINATION.find('.active').attr('data-num')

      dataQuery(activeElemNum)
    }

    const queryBySearchBtns = () => {
      $ARTICLE_INPUT_SEARCH_BTN.on('click', function () {
        dataQuery()
      })

      $NAME_INPUT_SEARCH_BTN.on('click', function () {
        dataQuery()
      })
    }

    const queryByEraseBtn = () => {
      $ARTICLE_INPUT_ERASE_BTN.on('click', function () {
        dataQuery()
      })

      $NAME_INPUT_ERASE_BTN.on('click', function () {
        dataQuery()
      })
    }

    const queryByEnterPressInInputs = () => {
      $ARTICLE_INPUT.on('keyup', (event) => {
        if (isEnterPressed(event)) {
          dataQuery()
        }
      })

      $NAME_INPUT.on('keyup', (event) => {
        if (isEnterPressed(event)) {
          dataQuery()
        }
      })
    }

    itemsFn()
    initStores()
    queryByEraseBtn()
    queryBySearchBtns()
    firstRenderPagination()
    queryByEnterPressInInputs()
    setAddConditionForItemsFromStore()
  }
}
