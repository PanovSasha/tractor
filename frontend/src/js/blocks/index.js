import { tabsFunctions } from './tabs'
import { shellFns } from './shell'
import { cardsFns } from './cards'

export const blockFunctions = () => {
  cardsFns()
  shellFns()
  tabsFunctions()
}
