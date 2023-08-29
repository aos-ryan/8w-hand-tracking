export default {
    schema: {
        scale: {
            type: 'boolean',
            default: true
        },
        translate: {
            type: 'boolean',
            default: true
        },
        clampScale: {
            type: 'boolean',
            default: true
        },
        clampTranslation: {
            type: 'boolean',
            default: true
        }
    },
    init() {
        const obj = this.el.object3D;

        const touches = [];

        const va = new THREE.Vector2();
        const vb = va.clone();

        const mva = va.clone();
        const mvb = vb.clone();

        let startScale = 1;
        let currentScale = 1;
        let startDist = 0;
        let startAngle = 0;

        const startMidpoint = new THREE.Vector2();
        const currentMidpoint = startMidpoint.clone();

        const startOffset = new THREE.Vector2(obj.position.x, obj.position.y);
        const currentOffset = new THREE.Vector2(0, 0);
        const offsetTmp = new THREE.Vector2(0, 0);

        document.addEventListener('restart', () => {
            obj.position.x = obj.position.y = 0;
            startScale = currentScale = 1;
            obj.scale.setScalar(1);
        });

        window.addEventListener('pointerdown', (e) => {
            touches.push(e);

            if (touches.length <= 1) {
                return;
            }

            va.set(touches[0].clientX, touches[0].clientY);
            vb.set(touches[1].clientX, touches[1].clientY);

            // get the mid point between where your fingers started
            startDist = va.distanceTo(vb);
            offsetTmp.subVectors(vb, va);
            startAngle = offsetTmp.angle();
            startMidpoint.set(Math.cos(startAngle) * startDist * -0.5, Math.sin(startAngle) * startDist * -0.5);
            startMidpoint.add(vb);
        });

        ['pointerup', 'pointercancel', 'pointerout', 'pointerleave'].forEach((name) => window.addEventListener(name, (e) => {
            const index = touches.findIndex((x) => x.pointerId === e.pointerId);
            touches.splice(index, 1);

            if (touches.length < 2) {
                startScale = currentScale;
                startOffset.set(obj.position.x, obj.position.y);
            }
        }));

        window.addEventListener('pointermove', (e) => {
            if (touches.length <= 1) {
                return;
            }

            // Replace the previous touch with this id, with this one
            const index = touches.findIndex((x) => x.pointerId === e.pointerId);
            touches.splice(index, 1, e);

            // put our first two touches into vectors to make them easier to work with
            mva.set(touches[0].clientX, touches[0].clientY);
            mvb.set(touches[1].clientX, touches[1].clientY);

            const msd = mva.distanceTo(mvb);
            currentScale = msd / startDist * startScale;
            if (this.data.clampScale) {
                currentScale = Math.max(0.5, Math.min(3, currentScale));
            }

            // get the mid point between where your fingers are now
            offsetTmp.subVectors(mvb, mva);
            const currentAngle = offsetTmp.angle();
            currentMidpoint.set(Math.cos(currentAngle) * msd * -0.5, Math.sin(currentAngle) * msd * -0.5);
            currentMidpoint.add(mvb);

            // get the offset between these mid points as our translation
            currentOffset.subVectors(startMidpoint, currentMidpoint);

            // get the size of the camera frustum at the distance our plane is
            const camera = this.el.sceneEl.camera;
            const distance = Math.abs(camera.position.z - obj.position.z);
            const frustumHeight = distance * 2 * Math.tan(camera.fov * 0.5 * Math.PI / 180);
            const frustumWidth = frustumHeight * camera.aspect;

            // get the world position of the point between your fingers
            offsetTmp.copy(currentMidpoint);
            offsetTmp.x = (offsetTmp.x / window.innerWidth - 0.5) * frustumWidth;
            offsetTmp.y = -(offsetTmp.y / window.innerHeight - 0.5) * frustumHeight;

            // get the distance / angle between fingers and object
            currentMidpoint.copy(offsetTmp);
            offsetTmp.set(obj.position.x, obj.position.y);
            offsetTmp.subVectors(offsetTmp, currentMidpoint);
            const offsetDist = offsetTmp.length();
            const offsetAngle = offsetTmp.angle();
            const nudgeDist = (offsetDist * currentScale - offsetDist) * 0.2;

            // Get the difference between the current offset and where it would be
            // if it were scaled by currentScale
            const nudgeX = Math.cos(offsetAngle) * nudgeDist;
            const nudgeY = Math.sin(offsetAngle) * nudgeDist;

            // get the normalized coords for where to put our object
            const newX = -currentOffset.x / window.innerWidth;
            const newY = currentOffset.y / window.innerHeight;

            // Final translated position
            let objX = (startOffset.x + newX * frustumWidth) + nudgeX;
            let objY = (startOffset.y + newY * frustumHeight) + nudgeY;

            // For paint mode, we don't want to push the object too far off screen
            if (this.data.clampTranslation) {
                objX = Math.max(-frustumWidth, Math.min(frustumWidth, objX));
                objY = Math.max(-frustumHeight, Math.min(frustumHeight, objY));
            }

            if (this.data.translate) {
                obj.position.x = objX;
                obj.position.y = objY;
            }

            if (this.data.scale) {
                obj.scale.setScalar(currentScale);
            }

            e.stopPropagation();
            e.preventDefault();
        });
    }
}