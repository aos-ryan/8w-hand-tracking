const handRaycaster = {
  init() {
    this.raycaster = new THREE.Raycaster()
    this.arrow = new THREE.ArrowHelper()
    this.handVisible = false
    this.indexNail = document.getElementById('indexNail')
    this.indexTip = document.getElementById('indexTip')

    this.el.sceneEl.addEventListener('xrhandfound', () => {
      console.log('hand found!')
      this.handVisible = true
    })
    this.el.sceneEl.addEventListener('xrhandlost', () => {
      this.handVisible = false
      console.log('hand lost!')
    })
  },
  tick() {
    if (this.handVisible) {
      console.log('indexNail positon:', this.indexNail.object3D.position)
      console.log('indexTip positon:', this.indexTip.object3D.position)
      this.raycaster.set(
        this.indexTip.object3D.position,
        this.indexNail.object3D.position
      )
      this.arrow.position.copy(this.indexNail.object3D.position)
      this.arrow.setDirection(this.indexTip.object3D.position)
    }
  },
}
export { handRaycaster }
