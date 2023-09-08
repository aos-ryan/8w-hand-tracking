const handRaycaster = {
  init() {
    // scene and raycaster properties
    this.scene = document.getElementById('scene').object3D
    this.raycaster = new THREE.Raycaster()
    this.raycaster.far = 1
    this.raycasterOrigin = new THREE.Vector3()
    this.raycasterDirection = new THREE.Vector3()

    // hand tracking elements
    this.palmPoint = document.getElementById('palm')
    this.thumbPoint = document.getElementById('thumbTip')

    this.palmPosition = new THREE.Vector3()
    this.palmQuaternion = new THREE.Quaternion()
    this.thumbPosition = new THREE.Vector3()
    this.targets = document.getElementById('targets').object3D.children

    // conditional logic variables
    this.handVisible = false
    this.firedShot = false
    this.bullets = []

    // shader for explosion on hit
    this.explosionMaterial = new THREE.RawShaderMaterial({
      vertexShader: `attribute vec4 position;
      attribute vec3 normal;

      uniform mat4 projectionMatrix;
      uniform mat4 modelViewMatrix;

      uniform float time;

      varying vec3 vNormal;

      void main () {
        vNormal = normal;

        vec4 offset = position;

        float dist = time * 0.5 + 0.5;

        offset.xyz += normal * dist;
        gl_Position = projectionMatrix * modelViewMatrix * offset;
      }`,
      uniforms: {
        time: { type: 'f', value: 0 },
      },
    })

    // add event listener to determine when hand is found in scene
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
        // get the position and direction of the bullet and pass to raycaster
        bullet.getWorldPosition(this.raycasterOrigin)
        bullet.getWorldDirection(this.raycasterDirection)

        // set the raycaster to use these new values
        this.raycaster.set(this.raycasterOrigin, this.raycasterDirection)

        // check the intersect objects for hits
        const hits = this.raycaster.intersectObjects(this.targets, true)
        // console.log(hits)
        if (hits.length >= 1) {
          const firstHitTarget = hits[0]

          // TODO react to being hit by the bullet in some way
          console.log('hit!')
          console.log(firstHitTarget)
          // firstHitTarget.setAttribute('material', 'shader: explode')
          // firstHitTarget.object.material = this.explosionMaterial
          // firstHitTarget.object.material.uniforms.time.value = time

          // Remove bullet from the world
          bullet.removeFromParent()

          this.bullets.splice(this.bullets.indexOf(bullet), 1)
        }

        // If no target was hit, just travel further
        bullet.position.add(this.raycasterDirection.multiplyScalar(0.2))

        // if bullet travels too far, aso remove it from the scene
        if (bullet.position.z <= -7 || bullet.position.z > 3) {
          // Remove bullet from the world
          bullet.removeFromParent()

          this.bullets.splice(this.bullets.indexOf(bullet), 1)
        }
      })
    }
    // create geometry and mesh once to be reused for every bullet
    this.geometry = new THREE.SphereGeometry(1, 32, 16)
    this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 })

    this.fireBullet = () => {
      console.log('fired shot')
      // create geometry, material, and mesh
      const bullet = new THREE.Mesh(this.geometry, this.material)

      // apply the position and rotation of the palm to the bullet
      bullet.position.copy(this.palmPosition)
      bullet.applyQuaternion(this.palmQuaternion)

      // scale the bullet down, the 3D scene is scaled relative to the hand
      bullet.scale.set(0.05, 0.05, 0.05)

      // add the bullet to the scene
      this.scene.add(bullet)

      // bullet world direction is towards positive Z, which is towards the camera in aframe

      // push the bullet to the array to handle the updates / collision
      this.bullets.push(bullet)
    }
  },
  tick() {
    if (this.handVisible) {
      // get the world position of thumb point and palm along with rotation of palm
      this.palmPoint.object3D.getWorldPosition(this.palmPosition)
      this.palmPoint.object3D.getWorldQuaternion(this.palmQuaternion)
      this.thumbPoint.object3D.getWorldPosition(this.thumbPosition)

      // number to check when the hand (really just the thumb) is squeezed together
      let squeezeCheckNum =
        Math.round(this.thumbPosition.distanceTo(this.palmPosition) * 100) / 100

      // if the hand is squeezed fire a shot
      if (this.firedShot === false && squeezeCheckNum === 0.07) {
        this.fireBullet()
        // this.firedShot = true
      }
    }
    // update the bullets in the scene
    this.updateBullets()
  },
}
export { handRaycaster }
