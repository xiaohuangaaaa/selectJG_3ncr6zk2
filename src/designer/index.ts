import Designer from './designer.vue'
import DesignerMobile from './designer-mobile.vue'
import Settings from './settings'
import Property from '../property'
import { upgrade } from '../upgrade'

export default {
  ...Property,
  Views: {
    Designer,
    DesignerMobile,
    Settings,
  },
  upgrade
}
