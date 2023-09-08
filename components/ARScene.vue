<template>
  <div>
    <!-- ui elements -->
    <div id="overlay" class="absolute-fill">
      <span id="promptText" v-if="hasHand"
        >Squeeze your hand to fire projectiles outward from your palm.</span
      >
      <span id="promptText" v-else
        >Point your device camera at your outstretched hand.</span
      >
    </div>

    <!-- aframe elements -->
    <a-scene
      id="scene"
      xrextras-loading
      xrextras-runtime-error
      xrextras-pause-on-hidden
      renderer="colorManagement: true"
      xrhand
      stats
    >
      <a-light type="ambient" intensity="0.8"></a-light>
      <a-assets> </a-assets>

      <a-camera position="0 1.6 0"></a-camera>

      <xrextras-hand-anchor id="hand">
        <xrextras-hand-mesh
          material="color: white; transparent: false;"
          wireframe="true"
        >
        </xrextras-hand-mesh>
        <xrextras-hand-attachment id="palm" point="palm" pointType="center">
          <a-entity id="handRaycaster" hand-raycaster> </a-entity>
        </xrextras-hand-attachment>
        <xrextras-hand-attachment id="thumbTip" point="thumbTip">
        </xrextras-hand-attachment>
      </xrextras-hand-anchor>

      <a-entity id="targets">
        <a-icosahedron
          class="pointTarget"
          position="1 1.6 -5"
          scale="0.2 0.2 0.2"
          material="wireframe: true"
          animation__rotate="property: rotation; to: 360 360 0; loop: true; dur: 6000; easing: linear;"
          @loaded="randomMove"
        >
        </a-icosahedron>
        <a-icosahedron
          class="pointTarget"
          position="-1 1.6 -3"
          scale="0.2 0.2 0.2"
          material="wireframe: true"
          animation__rotate="property: rotation; to: 360 360 0; loop: true; dur: 6000; easing: linear;"
          @loaded="randomMove"
        >
        </a-icosahedron>
      </a-entity>
      <a-sky color="black"></a-sky>
    </a-scene>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasHand: false,
    }
  },
  mounted() {
    const scene = document.getElementById('scene')
    scene.addEventListener('xrhandfound', () => (this.hasHand = true))
    scene.addEventListener('xrhandlost', () => (this.hasHand = false))
  },
  methods: {
    randomMove(e) {
      const x = (Math.random() + Math.random()).toFixed(2)
      const y = (Math.random() + Math.random()).toFixed(2)
      const z = -(Math.random() * 4 + 1 + Math.random()).toFixed(2)
      console.log(e.target)
      e.target.setAttribute(
        'animation',
        `property: position; to: ${x} ${y} ${z}; dur: 3000; loop: true; dir: alternate; easing: easeInOutQuad;`
      )
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
.absolute-fill {
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
}

#promptText {
  font-size: 14px;
  text-align: center;
  color: white;

  position: absolute;
  width: 100%;
  bottom: 5vh;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
