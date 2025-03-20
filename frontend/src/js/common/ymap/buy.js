import 'suggestions-jquery/dist/js/jquery.suggestions.min'

import { ACTIVE_CLASS, HIDDEN_CLASS } from '../../lib/constants'

import { pointsDataNoDistrictSort } from './config'
import { pointsSlider } from '../swiper'
import { renderPointsToMap } from './buyRenderFns'
import { isEnterPressed } from '../../lib/utils'

const $BUY_SHELL = $('.js-buy')
const FORM_TYPE = $BUY_SHELL.attr('data-buy-type')

const $CITY_INPUT = $BUY_SHELL.find('.js-buy-actions-filters-input')
const $CITY_INPUT_PLACEHOLDER = $BUY_SHELL.find('.js-input-placeholder')

const $SUBMIT_BTN = $BUY_SHELL.find('.js-input-search-btn')

const $FILTER_TABS = $('.js-buy-actions-types-btn')
const $OPTIONS = $('.js-buy-actions-filters-select .js-select-option')
const $CURRENT_OPTION = $('.js-buy-actions-filters-select .js-select-current-btn')

export const $RESULT_SHELL = $BUY_SHELL.find('.js-buy-actions-points-wrapper')

const $BUY_MAP = $BUY_SHELL.find('.js-buy-map')

export const buyFunctions = () => {
  if ($BUY_SHELL.length) {
    async function yaMaps(latitude = 55.753995, longitude = 37.614069) {
      await ymaps3.ready

      const getCoordsByAddressInput = (marker, map) => {
        if ($CITY_INPUT.val() !== 'Город не определен') {
          $.ajax({
            url: `/api/v1/get_yandex_geo`,
            method: 'post',
            async: false,
            dataType: 'json',
            data: `geocode=${$CITY_INPUT.val()}`,
            contentType: 'application/x-www-form-urlencoded',
            headers: {
              'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
            },
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
            <svg>
                <use xlink:href="/assets/sprite/sprite.svg#geo"></use>
            </svg>
         `)
        }

        const getPointAddressByYmaps = (coordinates) => {
          $.ajax({
            url: `/api/v1/get_yandex_geo`,
            method: 'post',
            dataType: 'json',
            data: `geocode=${coordinates.toString()}`,
            contentType: 'application/x-www-form-urlencoded',
            headers: {
              'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
            },
            success: function (result) {
              if (result.status === 'success') {
                const region = result.data.response.GeoObjectCollection.featureMember[0].GeoObject.description

                $CITY_INPUT_PLACEHOLDER.addClass(HIDDEN_CLASS)
                $CITY_INPUT.val(region)
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

      const onInputFns = (marker, map) => {
        $SUBMIT_BTN.on('click', function () {
          getCoordsByAddressInput(marker, map)
          filterPoints(map, marker)
        })

        $CITY_INPUT.on('keyup', (event) => {
          if (isEnterPressed(event)) {
            getCoordsByAddressInput(marker, map)
            filterPoints(map, marker)
          }
        })
      }

      const filterPoints = (map, marker, points = pointsDataNoDistrictSort) => {
        // FORM_TYPE
        const activeTypeTab = $('.js-buy-actions-types-btn.active').attr('data-action-type') || 'none'
        const activeSelectOption = $CURRENT_OPTION.attr('data-district')

        renderPointsToMap(points, map, marker, YMapMarker)
      }

      const filterByTypeTabPress = (map, marker) => {
        $FILTER_TABS.on('click', function () {
          const $t = $(this)

          let pointsDataTypeSort = []
          const filter = $t.attr('data-action-type')

          if ($t.hasClass(ACTIVE_CLASS)) {
            $FILTER_TABS.removeClass(ACTIVE_CLASS)

            $.each(pointsDataNoDistrictSort, function (_, el) {
              if (
                $CURRENT_OPTION.attr('data-district') === el.district ||
                $CURRENT_OPTION.attr('data-district') === 'all'
              ) {
                pointsDataTypeSort.push(el)
              }
            })
          } else {
            $FILTER_TABS.removeClass(ACTIVE_CLASS)
            $t.addClass(ACTIVE_CLASS)

            $.each(pointsDataNoDistrictSort, function (_, el) {
              $.each(el.type, function (_, type) {
                if (type === filter) {
                  if (
                    $CURRENT_OPTION.attr('data-district') === el.district ||
                    $CURRENT_OPTION.attr('data-district') === 'all'
                  ) {
                    pointsDataTypeSort.push(el)
                  }
                }
              })
            })
          }

          filterPoints(map, marker, pointsDataTypeSort)
        })
      }

      const filterByDistrictSelectPress = (map, marker) => {
        $OPTIONS.on('click', function () {
          let pointsDataDistrictSort = []

          let activeFilterTab

          $.each($FILTER_TABS, function (_, el) {
            const $el = $(el)

            if ($el.hasClass(ACTIVE_CLASS)) {
              activeFilterTab = $el.attr('data-action-type')
            }
          })

          const $t = $(this)
          const district = $t.attr('data-district')

          if (district === 'all') {
            $.each(pointsDataNoDistrictSort, function (_, el) {
              if (!!activeFilterTab) {
                $.each(el.type, function (_, typeEl) {
                  if (typeEl === activeFilterTab) {
                    pointsDataDistrictSort.push(el)
                  }
                })
              } else {
                pointsDataDistrictSort.push(el)
              }
            })

            filterPoints(map, marker, pointsDataDistrictSort)
          } else {
            $.each(pointsDataNoDistrictSort, function (_, el) {
              if (district === el.district) {
                if (!!activeFilterTab) {
                  $.each(el.type, function (_, typeEl) {
                    if (typeEl === activeFilterTab) {
                      pointsDataDistrictSort.push(el)
                    }
                  })
                } else {
                  pointsDataDistrictSort.push(el)
                }
              }
            })

            filterPoints(map, marker, pointsDataDistrictSort)
          }

          $CURRENT_OPTION.attr('data-district', district)

          pointsSlider.slideTo(0, 200)
        })
      }

      window.map = null

      const LOCATION = { center: [longitude, latitude], zoom: 9 }

      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls, YMapListener, YMapMarker } = ymaps3
      const { YMapZoomControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1')

      ymaps3.ready.then(() => {
        const map = new YMap(
          document.getElementById('buy-map'),
          {
            location: LOCATION,
          },
          [new YMapDefaultSchemeLayer(), new YMapDefaultFeaturesLayer()]
        )

        map.addChild(new YMapControls({ position: 'right' }).addChild(new YMapZoomControl({})))

        const marker = addCurrentUserGeoMarker(map, YMapListener)

        controlFunctions(map)
        filterByTypeTabPress(map, marker)
        filterByDistrictSelectPress(map, marker)
        filterPoints(map, marker)
        onInputFns(marker, map)
      })
    }

    const initYMapWithFetchCoords = () => {
      const url = '/api/v1/getSuggest'

      yaMaps()
      $.ajax({
        url: url,
        method: 'get',
        dataType: 'json',
        success: function (result) {
          if (result.data) {
            const { geo_lat, geo_lon } = result.data.data
            yaMaps(geo_lat, geo_lon)
          } else {
            yaMaps()
          }
        },
      })
    }

    if ($BUY_MAP.length && navigator.geolocation && window.ymaps3) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords
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
