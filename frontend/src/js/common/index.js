import { accordFunctions } from './accord'
import { topLineFunctions } from './topline'
import { overlaysFunctions } from './overlay'
import { swiperFunctions } from './swiper'
import { inputFunctions } from './input'
import { selectFunctions } from './select'
import { paginationFns } from './pagination'
import { counterUpFigures } from './counterUpFigures'
import { buttonsFns } from './buttons'
import { animateSvg } from './animateSvg'
import { orderFormFns } from './orderForm'
import { spoilerFns } from './spoiler'

export const commonFunctions = () => {
  accordFunctions()
  animateSvg()
  buttonsFns()
  counterUpFigures()
  inputFunctions()
  overlaysFunctions()
  paginationFns()
  selectFunctions()
  spoilerFns()
  swiperFunctions()
  topLineFunctions()
  orderFormFns()
}
