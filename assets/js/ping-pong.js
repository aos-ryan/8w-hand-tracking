class PingPong {
    constructor(size = { width: 1024, height: 1024 }, options = { depthBuffer: false }) {
        this.targets = [
            new THREE.WebGLRenderTarget(size.width, size.height, options),
            new THREE.WebGLRenderTarget(size.width, size.height, options)
        ];

        this.index = 0;
        this.flip = () => this.index = 1 - this.index;
        this.read = () => this.targets[this.index];
        this.write = () => this.targets[1 - this.index];
        this.resize = (w, h) => this.targets.forEach((t) => t.setSize(w, h));
        this.clear = (renderer) => {
            this.targets.forEach((t) => {
                renderer.setRenderTarget(t);
                renderer.clear();
            });
            renderer.setRenderTarget(null);
        };
    }
}

export default PingPong;