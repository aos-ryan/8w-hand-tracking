export default {
    init() {
        const doRepos = () => {
            const camera = this.el.sceneEl.camera;
            const fov = camera.fov * Math.PI / 180;
            const ar = camera.aspect;

            this.el.object3D.scale.x = ar;
            this.el.object3D.scale.y = 1;

            const fillDist = Math.abs(1 / 2 / Math.tan(fov / 2));
            this.el.object3D.position.z = fillDist * -1;
        };

        if (this.el.sceneEl.camera) {
            doRepos();
        } else {
            this.el.sceneEl.addEventListener('camera-set-active', doRepos);
        }
    }
};