import Desktop from './runtime-desktop.vue'
import Mobile from './runtime-mobile.vue'
import Property from '../property'
import { upgrade } from '../upgrade'

export default {
  ...Property,
  Views: {
    Desktop,
    Mobile,
  },
  upgrade
}
