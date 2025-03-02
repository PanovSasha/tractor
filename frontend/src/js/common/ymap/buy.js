import 'suggestions-jquery/dist/js/jquery.suggestions.min'

import {
  $BODY,
  $DOCUMENT,
  $WINDOW,
  ACTIVE_CLASS,
  BODY_LOCK_CLASS,
  CLICKED_CLASS,
  DADATA_API_KEY,
  L_MOBILE_WIDTH,
  SHOW_CLASS,
  TABLET_WIDTH,
  YA_POPUP_CLASS,
  Z_INDEX_CLASS,
} from '../../lib/constants'
import { closeOverlay, overlaysFunctions } from '../overlay'
import { isEnterPressed, isEscPressed, swipeFunction } from '../../lib/utils'

const $BUY_SHELL = $('.js-buy')

const $OVERLAY = $('.js-overlay:first')
const $OVERLAY_ITEM_YA = $OVERLAY.find('.js-overlay-item-ya')

const $CITY_INPUT = $BUY_SHELL.find('#buy-city')
const $REGION_INPUT = $BUY_SHELL.find('#buy-region')
const $SUBMIT_BTN = $BUY_SHELL.find('.js-buy-form-submit-btn')

const $RESULT_SHELL = $BUY_SHELL.find('.js-buy-result')
const $NO_RESULT_SHELL = $BUY_SHELL.find('.js-buy-no-result')

const $BUY_MAP = $BUY_SHELL.find('.js-buy-map')

export const buyFunctions = () => {
  if ($BUY_SHELL.length) {
    const renderPhone = (phone, className = '') => {
      let str = ''
      let phoneNumber = ''

      if (phone) {
        let clearPhoneStr = ''
        let phoneStr = ''
        let clearPhone = []

        phoneNumber = phone
          .replaceAll('-', '')
          .replaceAll('.', '')
          .replaceAll("'", ',')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('*', '')

        if (phoneNumber.indexOf('\n') >= 0) {
          clearPhone = phoneNumber.replaceAll('\n', ',').split(',')
        } else {
          if (phoneNumber.indexOf(',') >= 0) {
            clearPhone = phoneNumber.split(',')
          } else {
            if (phoneNumber.indexOf(';') >= 0) {
              clearPhone = phoneNumber.split(';')
            } else {
              clearPhone.push(phoneNumber)
            }
          }
        }

        $.each(clearPhone, function (i, el) {
          let elPhoneNumber

          phoneStr = el.trim().replaceAll(' ', '')

          if (phoneStr.length < 8 && i > 0) {
            if (clearPhone[0].toString().slice(0, 1) === '+') {
              phoneStr = clearPhone[0].toString().slice(0, 5) + phoneStr.toString()
            } else {
              phoneStr = clearPhone[0].toString().slice(0, 4) + phoneStr.toString()
            }
          }

          if (phoneStr.slice(0, 1) === '8') {
            phoneStr = '+7' + phoneStr.slice(1)
          }

          if (el.indexOf('доб') >= 0) {
            elPhoneNumber = phoneStr.split('доб')[0]
            phoneStr = phoneStr.replaceAll('доб', ' доб. ')
          } else {
            elPhoneNumber = phoneStr
          }

          if (i === clearPhone.length - 1) {
            str =
              str +
              `<a 
              class="accessibility-link ${className}"
              target="_blank"
              href="tel:${elPhoneNumber}">
              ${phoneStr}
             </a>`
          } else {
            str =
              str +
              `<a 
              class="accessibility-link ${className}"
              target="_blank"
              href="tel:${elPhoneNumber}">
              ${phoneStr}
             </a>, `
          }
        })
      }

      return str
    }

    async function yaMaps(latitude = 55.753995, longitude = 37.614069) {
      const Y_LAT = latitude
      const Y_LON = longitude

      await ymaps3.ready

      const getCoordsByAddressInput = (marker, map) => {
        if ($CITY_INPUT.val() !== 'Город не определен') {
          $.ajax({
            url: `/bitrix/services/main/ajax.php?action=synchro:core.api.Location.getYandexGeo&geocode=${$CITY_INPUT.val()}`,
            method: 'get',
            async: false,
            dataType: 'json',
            success: function (result) {
              if (result) {
                let coords = result.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')

                marker.update({ coordinates: coords })
                map.update({
                  location: {
                    center: coords,
                    duration: 400,
                  },
                })
              }
            },
          })
        }
      }

      const addressInputWithDropdownFns = (marker, map) => {
        const $selectInputShell = $('.js-contact-form-input-elem')
        const $cityShell = $('.js-contact-form-input-elem-city')
        const $cityInput = $cityShell.find('.js-buy-form-input')
        const $cityInputEraseBtn = $cityShell.find('.js-input-erase-btn')
        const $dropdownCityBtns = $cityShell.find('.js-contact-form-input-dropdown-btn')
        const $dropdownCity = $cityShell.find('.js-contact-form-input-dropdown-shell')

        const $regionShell = $('.js-contact-form-input-elem-region')
        const $regionInput = $regionShell.find('.js-buy-form-input')
        const $dropdownRegionBtns = $regionShell.find('.js-contact-form-input-dropdown-btn')
        const $dropdownRegion = $regionShell.find('.js-contact-form-input-dropdown-shell')
        $.each($selectInputShell, function (_, shell) {
          const toggleShowDropdown = () => {
            $Input.on('focus', function () {
              const $t = $(this)

              $dropdownShell.addClass(SHOW_CLASS)
            })

            $DOCUMENT.on('click', ({ target }) => {
              if ($(target).closest($shell).length) {
                return false
              }

              $dropdownShell.removeClass(SHOW_CLASS)
            })

            $DOCUMENT.on('keyup', (event) => {
              if (isEscPressed(event)) {
                $dropdownShell.removeClass(SHOW_CLASS)
              }
            })
          }

          const $shell = $(shell)
          const $Input = $shell.find('.js-buy-form-input')
          const $dropdownShell = $shell.find('.js-contact-form-input-dropdown-shell')
          const $dropdownBtns = $shell.find('.js-contact-form-input-dropdown-btn')

          toggleShowDropdown()
        })

        const writePressBntDataValtoInput = () => {
          $dropdownCityBtns.on('click', function () {
            const $btn = $(this)

            $cityInput.val($btn.attr('data-city'))
            $dropdownCity.removeClass(SHOW_CLASS)
            $regionInput.val($btn.attr('data-region'))
            getCoordsByAddressInput(marker, map)
            queryPoints(map, marker)
          })

          $dropdownRegionBtns.on('click', function () {
            const $btn = $(this)

            $regionInput.val($btn.attr('data-btn-region'))
            $dropdownRegion.removeClass(SHOW_CLASS)
          })
        }

        $CITY_INPUT.on('keyup', (event) => {
          if (isEnterPressed(event)) {
            $dropdownCity.removeClass(SHOW_CLASS)

            getCoordsByAddressInput(marker, map)
            queryPoints(map, marker)
          }
        })

        const filterCityDropdownBtnsByRegionInput = () => {
          const checkRegionInput = (cityClick = false) => {
            if (!cityClick) {
              $cityInput.val('')
            }

            if ($regionInput.val().trim() !== '') {
              $dropdownCityBtns.hide()
            }

            if ($regionInput.val().trim().toLowerCase() === 'все') {
              $dropdownCityBtns.show()
            }

            if ($regionInput.val().trim() !== '') {
              $.each($dropdownCityBtns, function (_, btn) {
                const $btn = $(btn)

                if ($btn.attr('data-region').toLowerCase() === $regionInput.val().trim().toLowerCase()) {
                  $btn.show()
                }
              })
            }
          }

          $dropdownRegionBtns.on('click', function () {
            checkRegionInput()
          })

          $dropdownCityBtns.on('click', function () {
            checkRegionInput(true)
          })

          $regionInput.on('input', function () {
            checkRegionInput()
          })

          $cityInput.on('input', function () {
            if ($cityInput.val().trim() !== '') {
              $dropdownCityBtns.hide()
            }

            $.each($dropdownCityBtns, function (_, btn) {
              const $btn = $(btn)

              if ($btn.attr('data-city').toLowerCase().indexOf($cityInput.val().trim().toLowerCase()) >= 0) {
                $btn.show()
              }
            })
          })

          $cityInputEraseBtn.on('click', function () {
            checkRegionInput()
          })
        }

        writePressBntDataValtoInput()
        filterCityDropdownBtnsByRegionInput()
      }

      const controlFunctions = (map) => {
        function rotateCamera(angle) {
          map.update({
            camera: {
              azimuth: map.azimuth + angle,
              tilt: map.tilt,
              duration: 1000,
            },
          })
        }

        function tiltCamera(angle) {
          map.update({
            camera: {
              azimuth: map.azimuth,
              tilt: map.tilt + angle,
              duration: 1000,
            },
          })
        }

        $('#changeAzimuthLeft').on('click', function () {
          rotateCamera(Math.PI / 4)
        })

        $('#changeAzimuthRight').on('click', function () {
          rotateCamera(-Math.PI / 4)
        })

        $('#upTilt').on('click', function () {
          tiltCamera(-Math.PI / 4)
          $BUY_MAP.removeClass('skew')
        })

        $('#downTilt').on('click', function () {
          tiltCamera(Math.PI / 4)
          $BUY_MAP.addClass('skew')
        })
      }

      const addCurrentUserGeoMarker = (map) => {
        const renderGeoIcon = () => {
          $('.js-map-geo').html(`
            <svg class="icon icon--32">
                <use xlink:href="/assets/sprite/sprite.svg#geo"></use>
            </svg>
         `)
        }

        const getPointAddressByYmaps = (coordinates) => {
          $.ajax({
            url: `/bitrix/services/main/ajax.php?action=synchro:core.api.Location.getYandexGeo&geocode=${coordinates.toString()}`,
            method: 'get',
            dataType: 'json',
            success: function (result) {
              if (result.status === 'success') {
                const point = result.data.response.GeoObjectCollection.featureMember[0]

                let region = point.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components[0].name

                if (region.toLowerCase() === 'россия') {
                  region = 'РФ'
                }

                const addressComponents = point.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components

                let city = 'Город не определен'

                if (addressComponents.filter((x) => x.kind === 'locality')[0]) {
                  city = addressComponents.filter((x) => x.kind === 'locality')[0].name
                }

                $REGION_INPUT.val(region)
                $CITY_INPUT.val(city)
              }
            },
          })
        }

        const createGeoMarker = (map) => {
          const markerElement = document.createElement('div')
          markerElement.className = 'buy-map__geo js-map-geo'
          markerElement.onclick = () =>
            map.update({
              location: {
                longitude,
                latitude,
                duration: 400,
              },
            })

          return new YMapMarker(
            {
              coordinates: [longitude, latitude],
              draggable: true,
              mapFollowsOnDrag: true,
              onDragEnd: (coordinates) => {
                marker.update({ coordinates: coordinates })
                // геокодер DADATA - 10000 запросов бесплатно, но только по России,
                // getPointAddressByDadata(coordinates);

                //геокодер ymaps - 1000 запросов бесплатно, по всему миру
                getPointAddressByYmaps(coordinates)
              },
            },
            markerElement
          )
        }

        const marker = createGeoMarker(map)

        getPointAddressByYmaps([longitude, latitude])

        map.addChild(marker)

        renderGeoIcon()

        return marker
      }

      const renderSite = (site, className = '') => {
        if (site) {
          if (site.indexOf('.') >= 0) {
            let siteLink = ''
            let siteStr = ''

            siteStr = site
              .replaceAll(`https:\\\\`, '')
              .replaceAll('https://', '')
              .replaceAll('http:\\\\', '')
              .replaceAll('www.', '')
              .replaceAll('/', '')
              .replaceAll(`\\`, '')
              .replaceAll(`/www`, '')
              .replaceAll(`//www`, '')
              .replaceAll(`http:///`, '')
              .replaceAll(`http:/`, '')
              .replaceAll(`http:`, '')

            siteStr = 'www.' + siteStr
            siteLink = 'https://' + siteStr

            return `  <a
                 target="_blank"
                 href="${siteLink}"
                 class="${className} accessibility-link">
                 ${siteStr}
              </a>`
          } else {
            return '-'
          }
        } else {
          return '-'
        }
      }

      const pointFunctions = (el, i) => {
        const { city, country, latitude, longitude, name, network, phone, street, url } = el

        const renderSiteRow = (SITE) => {
          if (SITE) {
            return `
          <div class="buy-map-point__info-row">
              <span class="buy-map-point__info-title">
                Сайт
              </span>

             ${renderSite(SITE, 'buy-map-point__info-val')}
            </div>`
          } else return `-`
        }

        const renderPhoneRow = (PHONE) => {
          if (PHONE) {
            return `
           <div class="buy-map-point__info-row">
              <span class="buy-map-point__info-title">
                Телефон
              </span>

              <div class="buy-map-point__info-val">
                ${renderPhone(PHONE)}
              </div>
            </div>
        `
          } else return ``
        }

        const pointStr = `.js-buy-map-point-${i}`

        const $point = $(pointStr)

        $point.append(`
       <div class="buy-map-point__popup">
        <div class="buy-map-point__shell js-buy-map-point-shell">
          <button class="buy-map-point__close-btn js-buy-map-point-close-btn">
              <svg class="icon icon--24">
                <use xlink:href="/assets/sprite/sprite.svg#cross"></use>
              </svg>
          </button>

          <h4 class="h4 buy-map-point__name">
            ${name}
          </h4>

          <p class="buy-map-point__adress">
             ${country}, ${street}
          </p>

          <div class="buy-map-point__info-container">
            ${renderSiteRow(url)}

            ${renderPhoneRow(phone)}
          </div>
        </div>
      </div>
    `)
      }

      const renderPoint = (el, map, i) => {
        const { latitude, longitude } = el

        const point = document.createElement('div')
        point.className = `buy-map__point js-buy-map-point js-buy-map-point-${i}`

        point.onclick = () => {
          if ($WINDOW.width() > TABLET_WIDTH) {
            map.update({
              location: {
                center: [Number(longitude), Number(latitude)],
                duration: 500,
              },
            })
          }

          if ($WINDOW.width() <= L_MOBILE_WIDTH) {
            swipeFunction(document.querySelectorAll('.js-overlay'), () => {
              closeOverlay()
            })
          }
        }

        const marker = new YMapMarker(
          {
            coordinates: [longitude, latitude],
            draggable: false,
          },
          point
        )

        map.addChild(marker)

        pointFunctions(el, i)
      }

      const renderNearListPoint = (points) => {
        const isUrl = (url) => {
          if (url) {
            return `   <td class='buy__table-row-cell buy__table-row-cell--blue buy__table-row-cell--no-wrap'>
                    ${renderSite(url)}
                  </td>`
          } else {
            return `   <td class='buy__table-row-cell  buy__table-row-cell--no-tablet'>
                  </td>`
          }
        }

        const makeUrl = (latitude, longitude) => {
          return `https://yandex.ru/maps/?rtext=${Y_LAT},${Y_LON}~${latitude},${longitude}&rtt=auto`
        }

        let str = ''

        $.each(points, function (i, el) {
          const { brand, city, country, latitude, longitude, name, network, phone, street, url } = el.elem

          str =
            str +
            `   <tr class='buy__table-row'>
                  <td class='buy__table-row-cell'>
                    <h5 class='buy__table-row-cell-title'>${name}</h5>
                  </td>

                  <td class='buy__table-row-cell'>
                    <a target='_blank' class='accessibility-link' href='https://yandex.ru/maps/?pt=${latitude},${longitude}&amp;z=16.7&amp;l=map'>
                      ${country}, ${street}
                    </a>
                  </td>

                  <td class='buy__table-row-cell buy__table-row-cell--blue'>
                    ${renderPhone(phone)}
                  </td>

                  ${isUrl(url)}

                  <td class='buy__table-row-cell buy__table-row-cell--no-wrap'>
                    <p>${brand}</p>
                  </td>

                  <td class='buy__table-row-cell buy__table-row-cell--blue'>
                    <a class='accessibility-link' target='_blank' href='${makeUrl(
                      latitude,
                      longitude
                    )}'>построить маршрут</a>
                  </td>
                </tr>
         `
        })

        return str
      }

      const renderNearList = (points) => {
        const $list = $('.js-buy-table-shell')

        $list.text('').append(`
                 <table class="buy__table js-buy-table">
                <tr class="buy__table-header">
                  <th class="buy__table-head-cell">Название компании</th>

                  <th class="buy__table-head-cell">Адрес</th>

                  <th class="buy__table-head-cell">Телефон</th>

                  <th class="buy__table-head-cell">Сайт</th>

                  <th class="buy__table-head-cell">Бренд</th>

                  <th class="buy__table-head-cell"></th>
                </tr>
                
                ${renderNearListPoint(points)}
              </table>
       `)
      }

      const renderPointsToMap = (data, map, marker) => {
        const pointsPopup = () => {
          const $points = $(`.js-buy-map-point`)

          $points.on('click', function () {
            const $t = $(this)

            if ($WINDOW.width() > TABLET_WIDTH) {
              $points.removeClass(ACTIVE_CLASS).removeClass(CLICKED_CLASS)
              $points.parent().removeClass(Z_INDEX_CLASS)

              $t.addClass(ACTIVE_CLASS).addClass(CLICKED_CLASS)
              $t.parent().addClass(Z_INDEX_CLASS)
            } else {
              const $clonePopup = $t.find('.js-buy-map-point-shell').clone()

              $BODY.addClass(BODY_LOCK_CLASS)
              $OVERLAY.addClass(SHOW_CLASS).addClass(YA_POPUP_CLASS)
              $OVERLAY_ITEM_YA.html('').append($clonePopup).addClass(SHOW_CLASS)
              closePointPopup()
            }
          })

          $points.on('mouseenter', function () {
            const $t = $(this)

            if ($WINDOW.width() > TABLET_WIDTH) {
              $points.removeClass(ACTIVE_CLASS)
              $points.parent().removeClass(Z_INDEX_CLASS)

              $t.addClass(ACTIVE_CLASS)
              $t.parent().addClass(Z_INDEX_CLASS)
            }
          })

          $points.on('mouseleave', function () {
            const $t = $(this)

            if (!$t.hasClass(CLICKED_CLASS) && $WINDOW.width() > TABLET_WIDTH) {
              $points.removeClass(ACTIVE_CLASS)
              $points.parent().removeClass(Z_INDEX_CLASS)
            }
          })
        }

        const closePointPopup = () => {
          $DOCUMENT.on('click', function ({ target }) {
            if (
              !$(target).parents('.js-buy-map-point').length &&
              !$(target).hasClass('js-buy-map-point') &&
              $WINDOW.width() >= TABLET_WIDTH
            ) {
              $('.js-buy-map-point').removeClass(ACTIVE_CLASS).removeClass(CLICKED_CLASS)
            }
          })

          $('.js-buy-map-point-close-btn').on('click', function () {
            setTimeout(() => {
              closeOverlay()

              $('.js-buy-map-point').removeClass(ACTIVE_CLASS).removeClass(CLICKED_CLASS)
            }, 100)
          })
        }

        const distanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
          const deg2rad = (deg) => {
            return deg * (Math.PI / 180)
          }

          const R = 6371 // Radius of the earth in km
          const dLat = deg2rad(lat2 - lat1) // deg2rad below
          const dLon = deg2rad(lon2 - lon1)
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

          return R * c
        }

        const sortNearPoints = (data, coordsGeoPoint) => {
          const sortedPointsByDistance = []

          let leftBottom = []
          let rightTop = []

          $.each(data, function (i, elem) {
            const { latitude, longitude } = elem

            const distance = distanceBetweenPoints(coordsGeoPoint[1], coordsGeoPoint[0], latitude, longitude)

            sortedPointsByDistance[i] = { distance, elem }

            renderPoint(elem, map, i)
          })

          pointsPopup()

          if (sortedPointsByDistance.length > 6) {
            sortedPointsByDistance.sort(function (a, b) {
              return a.distance - b.distance
            }).length = 7
          } else {
            sortedPointsByDistance.sort(function (a, b) {
              return a.distance - b.distance
            })
          }

          renderNearList(sortedPointsByDistance)

          let sortedPointsByDistanceLength = sortedPointsByDistance.length

          $.each(sortedPointsByDistance, function (i, el) {
            if (
              i + 2 <= sortedPointsByDistance.length - 1 &&
              sortedPointsByDistance[i].distance + sortedPointsByDistance[i + 1].distance <=
                sortedPointsByDistance[i + 2].distance
            ) {
              sortedPointsByDistanceLength = i + 2
            }
          })

          sortedPointsByDistance.length = sortedPointsByDistanceLength

          leftBottom = [sortedPointsByDistance[0].elem.longitude, sortedPointsByDistance[0].elem.latitude]
          rightTop = [sortedPointsByDistance[0].elem.longitude, sortedPointsByDistance[0].elem.latitude]

          $.each(sortedPointsByDistance, function (i, el) {
            const { longitude, latitude } = el

            if (latitude < leftBottom[0]) {
              leftBottom[0] = longitude
            }

            if (latitude > rightTop[0]) {
              rightTop[0] = longitude
            }

            if (longitude < leftBottom[1]) {
              leftBottom[1] = latitude
            }

            if (latitude > rightTop[1]) {
              rightTop[1] = latitude
            }
          })

          return { leftBottom, rightTop }
        }

        const changeGeoCoordsForBoundsMap = (leftBottom, rightTop, coordsGeoPoint) => {
          let checkedLeftBottom = leftBottom
          let checkedRightTop = rightTop

          if (coordsGeoPoint[0] < checkedLeftBottom[0]) {
            checkedLeftBottom[0] = coordsGeoPoint[0]
          }

          if (coordsGeoPoint[1] < checkedLeftBottom[1]) {
            checkedLeftBottom[1] = coordsGeoPoint[1]
          }

          if (coordsGeoPoint[0] > checkedRightTop[0]) {
            checkedRightTop[0] = coordsGeoPoint[0]
          }

          if (coordsGeoPoint[1] > checkedRightTop[1]) {
            checkedRightTop[1] = coordsGeoPoint[1]
          }

          checkedLeftBottom[0] = Number(checkedLeftBottom[0]) - 0.4
          checkedLeftBottom[1] = Number(checkedLeftBottom[1]) - 0.4

          checkedRightTop[0] = Number(checkedRightTop[0]) + 0.4
          checkedRightTop[1] = Number(checkedRightTop[1]) + 0.4

          return { checkedLeftBottom, checkedRightTop }
        }

        $(`.js-buy-map-point`).hide()

        const coordsGeoPoint = marker._props.coordinates
        const { leftBottom, rightTop } = sortNearPoints(data, coordsGeoPoint)

        const { checkedLeftBottom, checkedRightTop } = changeGeoCoordsForBoundsMap(leftBottom, rightTop, coordsGeoPoint)

        map.setLocation({
          bounds: [checkedLeftBottom, checkedRightTop],
          duration: 500,
        })

        closePointPopup()
      }

      const queryPoints = (map, marker) => {
        $.ajax({
          url: '/bitrix/services/main/ajax.php?action=synchro:core.api.Products.getSalesPoints',
          method: 'post',
          username: 'admin',
          password: '1234wsad',
          success: function (result) {
            const { data } = result

            if (data.length) {
              $NO_RESULT_SHELL.hide()
              $RESULT_SHELL.show()

              renderPointsToMap(data, map, marker)
            } else {
              $RESULT_SHELL.hide()
              $NO_RESULT_SHELL.show()
            }
          },
        })
      }

      window.map = null

      const LOCATION = { center: [longitude, latitude], zoom: 9 }

      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapListener, YMapMarker } = ymaps3
      const { YMapZoomControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1')

      ymaps3.ready.then(() => {
        console.log('hi')

        const map = new YMap(
          document.getElementById('buy-map'),
          {
            location: LOCATION,
          },
          [new YMapDefaultSchemeLayer(), new YMapDefaultFeaturesLayer()]
        )

        // map.addChild(new YMapControls({ position: 'right' }).addChild(new YMapZoomControl({})))
        //
        // const marker = addCurrentUserGeoMarker(map, YMapListener)
        //
        // controlFunctions(map)
        // addressInputWithDropdownFns(marker, map)
        // queryPoints(map, marker)

        $SUBMIT_BTN.on('click', function () {
          getCoordsByAddressInput(marker, map)
          queryPoints(map, marker)
        })
      })
    }

    const initYMapWithFetchCoords = () => {
      const url = '/bitrix/services/main/ajax.php?action=synchro:core.api.Location.getSuggest'
      console.log('wqe')
      yaMaps()
      // $.ajax({
      //   url: url,
      //   method: 'get',
      //   dataType: 'json',
      //   success: function (result) {
      //     if (result.data) {
      //       const { geo_lat, geo_lon } = result.data.data
      //       console.log('wqeqe')
      //       yaMaps(geo_lat, geo_lon)
      //     } else {
      //       console.log('weqe')
      //       yaMaps()
      //     }
      //   },
      // })
    }

    if ($BUY_MAP.length && navigator.geolocation && window.ymaps3) {
      console.log('hui')

      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords
          console.log('qweqe')
          yaMaps(latitude, longitude)
        },

        function (error) {
          initYMapWithFetchCoords()
        },
        { timeout: 1000, enableHighAccuracy: true }
      )
    }
  }
}
