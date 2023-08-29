<template>
  <div>
    <a-scene
      xrweb="allowedDevices: any;"
      renderer="colorManagement: true"
      shadow="enabled: true; autoUpdate: true; type: pcfsoft"
      oimo-world
      cubemap-scene
    >
      <a-assets>
        <img id="concrete-albedo" src="/textures/concrete-albedo.png" />
        <img id="concrete-roughness" src="/textures/concrete-roughness.png" />
        <img id="concrete-normal" src="/textures/concrete-normal.png" />
      </a-assets>

      <a-camera position="0 2 0"></a-camera>

      <a-entity
        xr-light
        light="type: directional;
          castShadow: true;
          shadowMapHeight:2048;
          shadowMapWidth:2048;
          shadowCameraTop: 10;
          target: #group;
          shadowRadius: 10"
        xrextras-attach="target: group; offset: 0 15 0;"
        shadow
      >
      </a-entity>

      <a-light xr-light type="ambient"> </a-light>

      <a-entity id="group">
        <a-box
          id="ground"
          scale="1000 2 1000"
          position="0 -0.99 0"
          material="shader: shadow; transparent: true; opacity: 0.4"
          shadow="cast: false"
          oimo-body="shape: box;"
        >
        </a-box>

        <component
          v-for="(box, i) in boxes"
          :key="`box-${i}`"
          :is="`a-${box.component}`"
          :oimo-body="`shape: ${box.component}; move: true`"
          :scale="box.scale"
          :position="box.position"
          shadow
          :material="`src: #concrete-albedo; normalMap: #concrete-normal; color: #${box.color};`"
          :animation__enter="`property: scale; from: 0 0 0; to: ${box.scale}; startEvents: enter`"
          :animation__leave="`property: scale; from: ${box.scale}; to: 0 0 0; dur: 400; autoplay: false; startEvents: leave`"
        >
        </component>
      </a-entity>
    </a-scene>
  </div>
</template>

<script>

const rand = (min, max) => min + Math.random() * (max - min)

export default {
  data() {
    return {
      boxes: [],
    }
  },
  mounted() {
    this.addBox()
  },
  methods: {
    addBox() {
      if (this.boxes.length > 200) {
        return
      }

      const isBox = Math.random() > 0.5

      let scale = [rand(0.1, 1.0), rand(0.1, 1.0), rand(0.1, 1.0)].join(' ')
      const position = [rand(-5, 5), rand(10, 50), rand(-5, -1)].join(' ')
      const color = new THREE.Color()
      color.setHSL(Math.random(), 0.7, 0.5)

      if (!isBox) {
        const s = rand(0.05, 0.5)
        scale = [s, s, s].join(' ')
      }

      this.boxes.push({
        component: isBox ? 'box' : 'sphere',
        position,
        scale,
        color: color.getHexString(),
      })

      setTimeout(this.addBox, 200)
    },
  },
}
</script>

<style scoped>
div {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>