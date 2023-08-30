<template>
  <div>
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

      <a-camera
        look-controls="enabled: false"
        wasd-controls="enabled: false"
        position="0 1.6 0"
      ></a-camera>

      <xrextras-hand-anchor id="hand">
        <xrextras-hand-mesh> </xrextras-hand-mesh>
        <xrextras-hand-attachment
          id="indexTip"
          point="indexTip"
          pointType="center"
        >
        </xrextras-hand-attachment>
        <xrextras-hand-attachment
          id="indexNail"
          point="indexNail"
          pointType="center"
        >
          <a-entity id="handRaycaster" hand-raycaster> </a-entity>
        </xrextras-hand-attachment>
      </xrextras-hand-anchor>

      <a-sphere class="pointTarget" position="0 8 -20"> </a-sphere>
      <a-sphere class="pointTarget" position="5 8 -20"> </a-sphere>
      <a-sphere class="pointTarget" position="-5 8 -20"> </a-sphere>
    </a-scene>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
    const scene = document.getElementById('scene')
    // scene.addEventListener('xrhandfound', (e) => {
    //   console.log(e.detail)
    // })
    // const raycaster = document.getElementById('handRaycaster')
    // raycaster.addEventListener('raycaster-intersection', (e) => {
    //   console.log(e.detail)
    // })
  },
  methods: {},
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
