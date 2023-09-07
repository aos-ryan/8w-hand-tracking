const handRaycaster = {
  init() {
    this.scene = document.getElementById('scene').object3D
    this.raycaster = new THREE.Raycaster()
    this.raycasterOrigin = new THREE.Vector3()
    this.raycasterDirection = new THREE.Vector3()

    this.handVisible = false
    this.palmPoint = document.getElementById('palm')
    this.thumbPoint = document.getElementById('thumbTip')

    this.palmPosition = new THREE.Vector3()
    this.thumbPosition = new THREE.Vector3()

    this.firedShot = false
    this.bullets = []

    this.el.sceneEl.addEventListener('xrhandfound', () => {
      console.log('hand found!')
      this.handVisible = true
    })
    this.el.sceneEl.addEventListener('xrhandlost', () => {
      this.handVisible = false
      console.log('hand lost!')
    })

    this.updateBullets = () => {
      ;[...this.bullets].forEach((bullet) => {
        bullet.getWorldPosition(this.raycasterOrigin)
        bullet.getWorldDirection(this.raycasterDirection)

        this.raycaster.set(this.raycasterOrigin, this.raycasterDirection)

        const hits = this.raycaster.intersectObjects(this.scene.children, true)

        if (hits) {
          const firstHitTarget = hits[0]

          // React to being hit by the bullet in some way:

          // Remove bullet from the world
          bullet.removeFromParent()

          this.bullets.splice(this.bullets.indexOf(bullet), 1)
        }
        // NOTE If no target was hit, just travel further, apply gravity to the bullet etc.
        bullet.position.add(this.raycasterDirection.multiplyScalar(0.1))
      })
    }

    this.fireBullet = () => {
      console.log('fired shot')

      const geometry = new THREE.SphereGeometry(1, 32, 16)
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      const bullet = new THREE.Mesh(geometry, material)
      console.log('palm positon:', this.palmPoint.object3D.position)
      console.log('palm world positon:', this.palmPosition)
      bullet.position.copy(this.palmPosition)
      bullet.scale.set(0.05, 0.05, 0.05)
      // bullet.position.z -= 2
      // this.palmPoint.object3D.getWorldPosition(bullet.position)
      this.scene.add(bullet)
      console.log('bullet position', bullet.position)
      console.log(
        'bullet world direction',
        bullet.getWorldDirection(new THREE.Vector3())
      )
      // bullet world direction is towards positive Z, which is towards the camera in aframe
    }
  },
  tick() {
    if (this.handVisible) {
      this.palmPoint.object3D.getWorldPosition(this.palmPosition)
      this.thumbPoint.object3D.getWorldPosition(this.thumbPosition)
      let squeezeCheckNum =
        Math.round(this.thumbPosition.distanceTo(this.palmPosition) * 100) / 100

      console.log(squeezeCheckNum)

      if (this.firedShot === false && squeezeCheckNum === 0.07) {
        this.fireBullet()
        this.firedShot = true
      }
    }

    // this.updateBullets()
  },
}
export { handRaycaster }
