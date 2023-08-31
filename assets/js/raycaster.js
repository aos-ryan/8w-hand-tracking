const handRaycaster = {
  init() {
    this.raycaster = new THREE.Raycaster()
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
      let nailWorldPosition = new THREE.Vector3()
      let tipWorldPosition = new THREE.Vector3()

      this.indexNail.object3D.getWorldPosition(nailWorldPosition)
      this.indexTip.object3D.getWorldPosition(tipWorldPosition)

      console.log('indexNail positon:', this.indexNail.object3D.position)
      console.log('indexNail world positon:', nailWorldPosition)
      console.log('indexTip positon:', this.indexTip.object3D.position)
      console.log('indexTip world positon:', tipWorldPosition)
    }
  },
}
export { handRaycaster }
