import { OimoWorld, OimoBody } from '~/assets/js/physics-component.js'
import CubeMapSceneComponent from '~/assets/js/cubemap-realtime.js'
import { polygonOffsetComponent } from '~/assets/js/polygon-offset'
import { handRaycaster } from '~/assets/js/raycaster'

AFRAME.registerComponent('oimo-world', OimoWorld)
AFRAME.registerComponent('oimo-body', OimoBody)
AFRAME.registerComponent('cubemap-scene', CubeMapSceneComponent)
AFRAME.registerComponent('polygon-offset', polygonOffsetComponent)
AFRAME.registerComponent('hand-raycaster', handRaycaster)

AFRAME.registerShader('explode', {
  schema: {
    timeMsec: { type: 'time', is: 'uniform' },
  },
  vertexShader: `
  attribute vec4 position;
  attribute vec3 normal;

  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;

  uniform float timeMsec;

  varying vec3 vNormal;

  void main () {
    float time = timeMsec / 1000.0
    vNormal = normal;

    vec4 offset = position;

    float dist = time * 0.5 + 0.5;

    offset.xyz += normal * dist;
    gl_Position = projectionMatrix * modelViewMatrix * offset;
  }
  `,
})
