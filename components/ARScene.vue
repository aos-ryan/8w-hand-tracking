<template>
  <div>
    <a-scene xrweb="allowedDevices: any;" renderer="colorManagement: true">
      <a-assets> </a-assets>

      <a-camera position="0 2 0"></a-camera>
    </a-scene>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
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
