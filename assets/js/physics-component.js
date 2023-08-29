import { World } from 'oimo';

const world = new World();

const OimoWorld = {

    init() {
        this.paused = false;

        document.addEventListener('visibilitychange', () => {
            this.paused = document.visibilityState === 'hidden';
        });
    },

    tick() {
        if (!this.paused) {
            world.step();
        }
    }
}

let tex = null;
const loadRoughnessMap = () => {
    if (tex === null) {
        const img = document.getElementById('concrete-roughness').src;
        tex = new THREE.TextureLoader().load(img);
    }

    return tex;
};

const OimoBody = {
    schema: {
        shape: {
            type: "string",
            default: "box"
        },
        move: {
            type: "boolean",
            default: false
        }
    },
    init() {

        this.origin = this.el.object3D.position.clone();
        const size = this.el.object3D.scale.toArray([1, 1, 1]);
        const pos = this.origin.toArray([0, 0, 0]);

        this.body = world.add({
            type: this.data.shape,
            move: this.data.move,
            size,
            pos,
            world
        });

        if (this.data.move) {
            const mat = this.el.getObject3D('mesh').material;
            mat.metalness = Math.random();
            mat.roughnessMap = loadRoughnessMap();
            mat.roughness = Math.random();
        }

        this.startTime = performance.now();
        this.pauseTime = 0;
        this.paused = false;

        document.addEventListener('visibilitychange', () => {
            this.paused = document.visibilityState === 'hidden';
            const now = performance.now();
            if (this.paused) {
                this.pauseTime = now - this.startTime;
            } else {
                this.startTime = now - this.pauseTime;
            }
        });
    },

    tick() {

        if (this.paused) {
            return;
        }

        this.el.object3D.position.copy(this.body.getPosition());
        this.el.object3D.quaternion.copy(this.body.getQuaternion());

        if (this.data.move) {
            const now = performance.now();
            if (now - this.startTime > 15000) {

                this.el.emit('leave');
                setTimeout(() => {
                    this.body.resetPosition(this.origin.x, this.origin.y, this.origin.z);
                    this.el.emit('enter');
                }, 600);

                this.startTime = now;
            }
        }
    }
};

export { OimoWorld, OimoBody };
