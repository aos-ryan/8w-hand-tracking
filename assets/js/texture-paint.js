import PingPong from './ping-pong.js';

import vertexShader from '~/static/shaders/default.vert';
import paintShader from '~/static/shaders/paint.frag';
import stencilShader from '~/static/shaders/stencil.frag';

const buffers = {};
const getBuffer = (id) => {
    if (!buffers[id]) {
        buffers[id] = new PingPong();
    }
    return buffers[id];
};

const textures = {};
const loader = new THREE.TextureLoader();
const getTexture = (image) => {
    if (!textures[image]) {
        textures[image] = loader.load(document.getElementById(image).src);
    }
    return textures[image];
};

const TexturePaintComponent = {
    schema: {
        buffer: {
            type: 'int',
            default: 0
        },
        draw: {
            type: 'boolean',
            default: false
        },
        size: {
            type: 'float',
            default: 20
        },
        opacity: {
            type: 'float',
            default: 1
        },
        hardness: {
            type: 'float',
            default: 0
        },
        color: {
            type: 'string',
            default: '#ffa500'
        },
        image: {
            type: 'string'
        }
    },
    init() {
        this.buffer = getBuffer(this.data.buffer);
        this.mesh = this.el.getObject3D('mesh');

        this.mouse = new THREE.Vector2(0.5, 0.5);
        this.prevMouse = this.mouse.clone();

        // A set keeps unique items only, so if we add the same thing
        // twice it will still only show up once - makes the task of 
        // counting touches much more straightforward, since we don't
        // care about details of the touch, only how many there are
        this.touches = new Set();

        if (this.data.draw) {
            this.paintMaterial = new THREE.ShaderMaterial({
                depthTest: false,
                vertexShader,
                fragmentShader: paintShader,
                uniforms: {
                    uMouse: { value: new THREE.Vector2() },
                    uPrevMouse: { value: new THREE.Vector2() },
                    uTex: { value: null },
                    uColor: { value: new THREE.Color(this.data.color) },
                    uSize: { value: 20 },
                    uPressure: { value: 0 },
                    uHardness: { value: 0 }
                }
            });

            this.paintScene = new THREE.Scene();
            this.paintCamera = new THREE.OrthographicCamera(
                -0.5,
                0.5,
                0.5,
                -0.5,
                1e-5,
                100
            );
            this.paintCamera.position.z = 1;

            const geo = new THREE.PlaneBufferGeometry(1, 1);
            const mousePlane = new THREE.Mesh(geo, this.paintMaterial);
            this.paintScene.add(mousePlane);
        }

        const moccasin = getTexture(this.data.image);

        this.stencilMaterial = new THREE.ShaderMaterial({
            depthTest: false,
            transparent: true,
            vertexShader,
            fragmentShader: stencilShader,
            uniforms: {
                uTex: { value: null },
                uMask: { value: moccasin },
            }
        });

        this.mesh.material = this.stencilMaterial;

        const renderer = this.el.sceneEl.renderer;

        const clearPaint = () => {
            renderer.setClearColor(new THREE.Color(0x000000), 1);
            this.buffer.clear(renderer);
        };

        document.addEventListener('clearPaint', clearPaint);

        if (this.data.draw) {

            clearPaint();

            this.el.addEventListener('raycaster-intersected', (e) => {
                this.raycaster = e.detail.el.components.raycaster;
            });

            this.el.addEventListener('raycaster-intersected-cleared', () => {
                this.raycaster = null;
            });

            renderer.domElement.addEventListener('pointerdown', (e) => {
                this.touches.add(e.pointerId);

                // If we're touching with two fingers, kill the painting
                if (this.touches.size > 1) {
                    clearTimeout(this.timeout);
                    return;
                }

                // If we get one touch, wait a short time to see if
                // we get a second one
                this.timeout = setTimeout(() => {
                    this.paintMaterial.uniforms.uPressure.value = this.data.opacity;
                    this.firstDownFrame = true; // firstDownFrame stops us drawing lines between mouseup and mousedown
                }, 30);
            });

            ['pointerup', 'pointercancel', 'pointerout', 'pointerleave'].forEach(
                (name) => renderer.domElement.addEventListener(name, (e) => {
                    this.paintMaterial.uniforms.uPressure.value = 0;
                    this.touches.delete(e.pointerId);
                    clearTimeout(this.timeout);
                })
            );
        } else {
            this.stencilMaterial.uniforms.uTex.value = this.buffer.write().texture;
        }
    },
    update() {
        this.stencilMaterial.uniforms.uMask.value = getTexture(this.data.image);

        const uniforms = this.paintMaterial.uniforms;
        uniforms.uSize.value = this.data.size;
        uniforms.uHardness.value = this.data.hardness;
        uniforms.uColor.value.set(this.data.color);
    },
    tick() {

        if (!this.data.draw) {
            return;
        }

        const uniforms = this.paintMaterial.uniforms;

        if (this.raycaster) {
            const intersection = this.raycaster.getIntersection(this.el);
            if (intersection) {
                this.mouse.copy(intersection.uv);
            }
        }

        if (this.firstDownFrame) {
            uniforms.uPrevMouse.value.copy(this.mouse);
        } else {
            uniforms.uPrevMouse.value.copy(uniforms.uMouse.value);
        }

        this.firstDownFrame = false;

        const renderer = this.el.sceneEl.renderer;
        renderer.setRenderTarget(this.buffer.write());

        uniforms.uMouse.value.copy(this.mouse);
        uniforms.uTex.value = this.buffer.read().texture;

        renderer.render(this.paintScene, this.paintCamera);

        renderer.setRenderTarget(null);

        this.stencilMaterial.uniforms.uTex.value = this.buffer.write().texture;

        this.buffer.flip();
    }
};

export default TexturePaintComponent;