const initCubeMap = (scene) => {

    const camTexture_ = new THREE.Texture()
    const refMat = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0xffffff,
        map: camTexture_,
    })

    const renderTarget = new THREE.WebGLCubeRenderTarget(256, {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        encoding: THREE.sRGBEncoding,
    })

    // cubemap scene
    const cubeMapScene = new THREE.Scene()
    const cubeCamera = new THREE.CubeCamera(1, 1000, renderTarget)
    const sphere = new THREE.SphereGeometry(100, 15, 15)
    const sphereMesh = new THREE.Mesh(sphere, refMat)
    sphereMesh.scale.set(-1, 1, 1)
    sphereMesh.rotation.set(Math.PI, -Math.PI / 2, 0)
    cubeMapScene.add(sphereMesh)

    window.XR8.XrController.configure({ enableLighting: true })
    window.XR8.addCameraPipelineModule({
        name: 'cubemap-process',
        onUpdate: () => {
            cubeCamera.update(scene.renderer, cubeMapScene)
        },

        onProcessCpu: ({ frameStartResult }) => {
            const { cameraTexture } = frameStartResult
            // force initialization
            const texProps = scene.renderer.properties.get(camTexture_)
            texProps.__webglTexture = cameraTexture
        },
    })

    return cubeCamera.renderTarget.texture;

};

const CubeMapSceneComponent = {
    init() {
        const scene = this.el.sceneEl;
        const threeScene = this.el.object3D;
        threeScene.environment = initCubeMap(scene);
        scene.emit('cubemap-ready');
    }
};

export default CubeMapSceneComponent;