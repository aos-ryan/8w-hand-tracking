import { OimoWorld, OimoBody } from '~/assets/js/physics-component.js'
import CubeMapSceneComponent from '~/assets/js/cubemap-realtime.js'
import { polygonOffsetComponent } from '~/assets/js/polygon-offset'
import { handRaycaster } from '~/assets/js/raycaster'

AFRAME.registerComponent('oimo-world', OimoWorld)
AFRAME.registerComponent('oimo-body', OimoBody)
AFRAME.registerComponent('cubemap-scene', CubeMapSceneComponent)
AFRAME.registerComponent('polygon-offset', polygonOffsetComponent)
AFRAME.registerComponent('hand-raycaster', handRaycaster)
