const handRaycaster = {
  init() {
    this.raycaster = new THREE.Raycaster()
    this.handVisible = false
    this.handObject = {}
    this.el.sceneEl.addEventListener('xrhandfound', updatePoints)
    this.el.sceneEl.addEventListener('xrhandlost', () => {
      this.handVisible = false
    })
    const updatePoints = (e) => {
      this.handObject = e.detail
    }
  },
  tick() {
    if (this.handVisible) {
      // console.log(this.el.object3D)
      // console.log('ring nail position:', )
    }
  },
}
export { handRaycaster }
