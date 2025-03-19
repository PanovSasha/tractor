import 'suggestions-jquery/dist/js/jquery.suggestions.min'
import Swiper from 'swiper/bundle'

import {
  $WINDOW,
  ACTIVE_CLASS,
  BODY_LOCK_CLASS,
  CLICKED_CLASS,
  DADATA_API_KEY,
  SHOW_CLASS,
  TABLET_WIDTH,
  Z_INDEX_CLASS,
} from '../../lib/constants'
import { isEnterPressed, isEscPressed } from '../../lib/utils'

import { pointsDataNoDistrictSort } from './config'
import { pointsSlider } from '../swiper'
import { renderPointsToMap } from './buySortFns'

const $BUY_SHELL = $('.js-buy')

const $CITY_INPUT = $BUY_SHELL.find('#buy-city')
const $REGION_INPUT = $BUY_SHELL.find('#buy-region')
const $SUBMIT_BTN = $BUY_SHELL.find('.js-buy-form-submit-btn')

const $FILTER_TABS = $('.js-buy-actions-types-btn')
const $OPTIONS = $('.js-buy-actions-filters-select .js-select-option')
const $CURRENT_OPTION = $('.js-buy-actions-filters-select .js-select-current-btn')

export const $RESULT_SHELL = $BUY_SHELL.find('.js-buy-actions-points-wrapper')

const $BUY_MAP = $BUY_SHELL.find('.js-buy-map')

export const buyFunctions = () => {
  if ($BUY_SHELL.length) {
    async function yaMaps(latitude = 55.753995, longitude = 37.614069) {
      const Y_LAT = latitude
      const Y_LON = longitude

      await ymaps3.ready

      const getCoordsByAddressInput = (marker, map) => {
        if ($CITY_INPUT.val() !== 'Город не определен') {
          $.ajax({
            url: `/api/v1/get_yandex_geo&geocode=${$CITY_INPUT.val()}`,
            method: 'post',
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

      // const addressInputWithDropdownFns = (marker, map) => {
      //   const $selectInputShell = $('.js-contact-form-input-elem')
      //   const $cityShell = $('.js-contact-form-input-elem-city')
      //   const $cityInput = $cityShell.find('.js-buy-form-input')
      //   const $cityInputEraseBtn = $cityShell.find('.js-input-erase-btn')
      //   const $dropdownCityBtns = $cityShell.find('.js-contact-form-input-dropdown-btn')
      //   const $dropdownCity = $cityShell.find('.js-contact-form-input-dropdown-shell')
      //
      //   const $regionShell = $('.js-contact-form-input-elem-region')
      //   const $regionInput = $regionShell.find('.js-buy-form-input')
      //   const $dropdownRegionBtns = $regionShell.find('.js-contact-form-input-dropdown-btn')
      //   const $dropdownRegion = $regionShell.find('.js-contact-form-input-dropdown-shell')
      //   $.each($selectInputShell, function (_, shell) {
      //     const toggleShowDropdown = () => {
      //       $Input.on('focus', function () {
      //         const $t = $(this)
      //
      //         $dropdownShell.addClass(SHOW_CLASS)
      //       })
      //
      //       $DOCUMENT.on('click', ({ target }) => {
      //         if ($(target).closest($shell).length) {
      //           return false
      //         }
      //
      //         $dropdownShell.removeClass(SHOW_CLASS)
      //       })
      //
      //       $DOCUMENT.on('keyup', (event) => {
      //         if (isEscPressed(event)) {
      //           $dropdownShell.removeClass(SHOW_CLASS)
      //         }
      //       })
      //     }
      //
      //     const $shell = $(shell)
      //     const $Input = $shell.find('.js-buy-form-input')
      //     const $dropdownShell = $shell.find('.js-contact-form-input-dropdown-shell')
      //     const $dropdownBtns = $shell.find('.js-contact-form-input-dropdown-btn')
      //
      //     toggleShowDropdown()
      //   })
      //
      //   const writePressBntDataValtoInput = () => {
      //     $dropdownCityBtns.on('click', function () {
      //       const $btn = $(this)
      //
      //       $cityInput.val($btn.attr('data-city'))
      //       $dropdownCity.removeClass(SHOW_CLASS)
      //       $regionInput.val($btn.attr('data-region'))
      //       getCoordsByAddressInput(marker, map)
      //       filterPoints(map, marker)
      //     })
      //
      //     $dropdownRegionBtns.on('click', function () {
      //       const $btn = $(this)
      //
      //       $regionInput.val($btn.attr('data-btn-region'))
      //       $dropdownRegion.removeClass(SHOW_CLASS)
      //     })
      //   }
      //
      //   $CITY_INPUT.on('keyup', (event) => {
      //     if (isEnterPressed(event)) {
      //       $dropdownCity.removeClass(SHOW_CLASS)
      //
      //       getCoordsByAddressInput(marker, map)
      //       filterPoints(map, marker)
      //     }
      //   })
      //
      //   const filterCityDropdownBtnsByRegionInput = () => {
      //     const checkRegionInput = (cityClick = false) => {
      //       if (!cityClick) {
      //         $cityInput.val('')
      //       }
      //
      //       if ($regionInput.val().trim() !== '') {
      //         $dropdownCityBtns.hide()
      //       }
      //
      //       if ($regionInput.val().trim().toLowerCase() === 'все') {
      //         $dropdownCityBtns.show()
      //       }
      //
      //       if ($regionInput.val().trim() !== '') {
      //         $.each($dropdownCityBtns, function (_, btn) {
      //           const $btn = $(btn)
      //
      //           if ($btn.attr('data-region').toLowerCase() === $regionInput.val().trim().toLowerCase()) {
      //             $btn.show()
      //           }
      //         })
      //       }
      //     }
      //
      //     $dropdownRegionBtns.on('click', function () {
      //       checkRegionInput()
      //     })
      //
      //     $dropdownCityBtns.on('click', function () {
      //       checkRegionInput(true)
      //     })
      //
      //     $regionInput.on('input', function () {
      //       checkRegionInput()
      //     })
      //
      //     $cityInput.on('input', function () {
      //       if ($cityInput.val().trim() !== '') {
      //         $dropdownCityBtns.hide()
      //       }
      //
      //       $.each($dropdownCityBtns, function (_, btn) {
      //         const $btn = $(btn)
      //
      //         if ($btn.attr('data-city').toLowerCase().indexOf($cityInput.val().trim().toLowerCase()) >= 0) {
      //           $btn.show()
      //         }
      //       })
      //     })
      //
      //     $cityInputEraseBtn.on('click', function () {
      //       checkRegionInput()
      //     })
      //   }
      //
      //   writePressBntDataValtoInput()
      //   filterCityDropdownBtnsByRegionInput()
      // }

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
            url: `/api/v1/get_yandex_geo`,
            method: 'post',
            dataType: 'json',
            data: `geocode=${coordinates.toString()}`,
            contentType: 'application/x-www-form-urlencoded',
            headers: {
              'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
            },
            success: function (result) {
              console.log(result)

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

      const filterPoints = (map, marker, points = pointsDataNoDistrictSort) => {
        renderPointsToMap(points, map, marker, YMapMarker)
      }

      const filterByTypeTabPress = (map, marker) => {
        $FILTER_TABS.on('click', function () {
          const $t = $(this)

          let pointsDataTypeSort = []
          const filter = $t.attr('data-action-type')

          $FILTER_TABS.removeClass(ACTIVE_CLASS)
          $t.addClass(ACTIVE_CLASS)

          $.each(pointsDataNoDistrictSort, function (_, el) {
            $.each(el.type, function (_, type) {
              if (type === filter) {
                if ($CURRENT_OPTION.attr('data-district') === el.district) {
                  pointsDataTypeSort.push(el)
                } else {
                  pointsDataTypeSort.push(el)
                }
              }
            })
          })

          filterPoints(map, marker, pointsDataTypeSort)
          pointsSlider.slideTo(0, 200)
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
            filterPoints(map, marker, pointsDataNoDistrictSort)
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
        // addressInputWithDropdownFns(marker, map)
        filterPoints(map, marker)

        $SUBMIT_BTN.on('click', function () {
          // getCoordsByAddressInput(marker, map)
          // filterPoints(map, marker)
        })
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
            console.log('weqe')
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
