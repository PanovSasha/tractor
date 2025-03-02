import { accordFunctions } from './accord'
import { topLineFunctions } from './topline'
import { overlaysFunctions } from './overlay'
import { swiperFunctions } from './swiper'
import { inputFunctions } from './input'
import { selectFunctions } from './select'
import { paginationFns } from './pagination'
import { counterUpFigures } from './counterUpFigures'
import { buttonsFns } from './buttons'
import { orderFormFns } from './orderForm'
import { spoilerFns } from './spoiler'
import { searchFns } from './search'
import { videosFns } from './videos'
import { buyFunctions } from './ymap/buy'

export const commonFunctions = () => {
  accordFunctions()
  buttonsFns()
  buyFunctions()
  counterUpFigures()
  inputFunctions()
  overlaysFunctions()
  paginationFns()
  searchFns()
  selectFunctions()
  spoilerFns()
  swiperFunctions()
  topLineFunctions()
  orderFormFns()
  videosFns()
}
