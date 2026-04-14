/* ═══════════════════════════════════════════════
   LOOKWELL — Three.js Hero Scene v4
   Salon-themed floating objects + particle system + mouse tracking
   Scissors, lipstick, comb, mirror, nail polish, flower, brush, perfume
   ═══════════════════════════════════════════════ */
(function () {
    'use strict';

    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    /* ── WebGL detection + CSS fallback ─────────── */
    function isWebGLAvailable() {
        try {
            const t = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (t.getContext('webgl') || t.getContext('experimental-webgl')));
        } catch (e) { return false; }
    }

    function activateFallback() {
        canvas.style.display = 'none';
        const hero = document.getElementById('hero');
        if (!hero) return;
        hero.classList.add('webgl-fallback');
        /* Spawn CSS-animated orbs */
        const ORB_CFG = [
            { color: '124,58,237',  opacity: 0.25, size: 420, x: -8,  y: -10 },
            { color: '244,114,182', opacity: 0.22, size: 340, x: 68,  y: 55  },
            { color: '167,139,250', opacity: 0.18, size: 280, x: 20,  y: 75  },
            { color: '110,231,183', opacity: 0.14, size: 220, x: 80,  y: 10  },
            { color: '248,180,217', opacity: 0.16, size: 260, x: 50,  y: 35  },
            { color: '124,58,237',  opacity: 0.12, size: 180, x: 5,   y: 50  },
            { color: '244,114,182', opacity: 0.14, size: 200, x: 88,  y: 80  },
            { color: '167,139,250', opacity: 0.20, size: 310, x: 40,  y: -5  },
        ];
        ORB_CFG.forEach((cfg, i) => {
            const orb = document.createElement('div');
            orb.className = 'hero-fallback-orb';
            orb.style.cssText = [
                `width:${cfg.size}px`,
                `height:${cfg.size}px`,
                `background:radial-gradient(circle,rgba(${cfg.color},${cfg.opacity}) 0%,transparent 70%)`,
                `left:${cfg.x}%`,
                `top:${cfg.y}%`,
                `animation-duration:${11 + i * 1.7}s`,
                `animation-delay:${-(i * 1.3)}s`,
            ].join(';');
            hero.appendChild(orb);
        });
    }

    if (!isWebGLAvailable()) { activateFallback(); return; }

    /* Scene setup */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 18;

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
        console.warn('Lookwell: WebGL unavailable, using CSS fallback.', e.message);
        activateFallback();
        return;
    }
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Colors */
    const PALETTE = [0x7C3AED, 0xF472B6, 0xA78BFA, 0xD4A574, 0xF28B82, 0xC4B5FD, 0x6EE7B7];

    /* ── Material helper ─────────────────── */
    function mat(color, forceWireframe) {
        return new THREE.MeshBasicMaterial({
            color,
            wireframe: forceWireframe !== undefined ? forceWireframe : Math.random() > 0.35,
            transparent: true,
            opacity: 0.13 + Math.random() * 0.2
        });
    }

    function randColor() {
        return PALETTE[Math.floor(Math.random() * PALETTE.length)];
    }

    /* ── Salon object factories ──────────── */

    // ✂ Scissors
    function makeScissors(color) {
        const g = new THREE.Group();
        const m = mat(color, true);
        const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.6, 0.04), m);
        blade1.position.set(0.11, 0.08, 0);
        blade1.rotation.z = Math.PI / 6;
        g.add(blade1);
        const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.6, 0.04), mat(color, true));
        blade2.position.set(-0.11, 0.08, 0);
        blade2.rotation.z = -Math.PI / 6;
        g.add(blade2);
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 6, 12), mat(color, true));
        ring1.position.set(0.24, -0.32, 0);
        g.add(ring1);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 6, 12), mat(color, true));
        ring2.position.set(-0.24, -0.32, 0);
        g.add(ring2);
        return g;
    }

    // 💄 Lipstick
    function makeLipstick(color) {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.5, 8), mat(color));
        g.add(body);
        const bullet = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.1, 0.26, 8), mat(color));
        bullet.position.y = 0.38;
        g.add(bullet);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.22, 8), mat(randColor()));
        cap.position.y = -0.36;
        g.add(cap);
        return g;
    }

    // 🪮 Comb
    function makeComb(color) {
        const g = new THREE.Group();
        const m = mat(color, true);
        const spine = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.09, 0.04), m);
        g.add(spine);
        for (let i = 0; i < 9; i++) {
            const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.26, 0.03), mat(color, true));
            tooth.position.set(-0.32 + i * 0.08, -0.175, 0);
            g.add(tooth);
        }
        return g;
    }

    // 🪞 Hand mirror
    function makeMirror(color) {
        const g = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.055, 8, 22), mat(color, true));
        g.add(frame);
        const glass = new THREE.Mesh(new THREE.CircleGeometry(0.26, 20), mat(randColor(), false));
        glass.position.z = 0.01;
        g.add(glass);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.03, 0.5, 8), mat(color, true));
        handle.position.y = -0.55;
        g.add(handle);
        return g;
    }

    // 💅 Nail polish bottle
    function makeNailPolish(color) {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.46, 8), mat(color));
        g.add(body);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.14, 8), mat(color));
        neck.position.y = 0.3;
        g.add(neck);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.2, 8), mat(randColor()));
        cap.position.y = 0.5;
        g.add(cap);
        return g;
    }

    // 🌸 Flower (lotus / blossom)
    function makeFlower(color) {
        const g = new THREE.Group();
        const petalCount = 6;
        for (let i = 0; i < petalCount; i++) {
            const petal = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 4), mat(color, Math.random() > 0.4));
            const angle = (i / petalCount) * Math.PI * 2;
            petal.position.set(Math.cos(angle) * 0.23, Math.sin(angle) * 0.23, 0);
            petal.scale.set(0.75, 1.55, 0.55);
            g.add(petal);
        }
        const center = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), mat(randColor()));
        g.add(center);
        return g;
    }

    // 🖌 Hair brush
    function makeHairBrush(color) {
        const g = new THREE.Group();
        const m = mat(color, true);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.17, 0.13), m);
        g.add(head);
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                const bristle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.13, 4), mat(color, true));
                bristle.position.set(-0.16 + i * 0.1, 0.15, -0.03 + j * 0.06);
                g.add(bristle);
            }
        }
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.5, 8), mat(color, true));
        handle.rotation.z = Math.PI / 2;
        handle.position.set(-0.48, 0, 0);
        g.add(handle);
        return g;
    }

    // 🌹 Perfume / serum bottle
    function makePerfume(color) {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.48, 0.18), mat(color));
        g.add(body);
        const neck = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.1), mat(color));
        neck.position.y = 0.305;
        g.add(neck);
        const nozzle = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), mat(randColor()));
        nozzle.position.y = 0.42;
        g.add(nozzle);
        // atomiser tube
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 6), mat(color, true));
        tube.rotation.z = Math.PI / 2;
        tube.position.set(0.22, 0.38, 0);
        g.add(tube);
        return g;
    }

    /* ── Spawn floating salon objects ────── */
    const FACTORIES = [
        makeScissors, makeLipstick, makeComb, makeMirror,
        makeNailPolish, makeFlower, makeHairBrush, makePerfume
    ];

    const objects = [];
    const OBJECT_COUNT = 32;

    for (let i = 0; i < OBJECT_COUNT; i++) {
        const factory = FACTORIES[i % FACTORIES.length];
        const group = factory(PALETTE[Math.floor(Math.random() * PALETTE.length)]);

        /* Spawn only on left or right side — keep centre clear for hero text */
        const side = Math.random() > 0.5 ? 1 : -1;
        group.position.set(
            side * (6.5 + Math.random() * 11),
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 14 - 4
        );
        group.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );

        const scale = 0.7 + Math.random() * 0.7;
        group.scale.setScalar(scale);

        group.userData = {
            speedX: (Math.random() - 0.5) * 0.003,
            speedY: (Math.random() - 0.5) * 0.003,
            rotX: (Math.random() - 0.5) * 0.008,
            rotY: (Math.random() - 0.5) * 0.008,
            scaleOscillation: Math.random() * 0.002,
            scalePhase: Math.random() * Math.PI * 2,
            baseScale: scale
        };

        scene.add(group);
        objects.push(group);
    }

    /* ── Particle star field ─────────────── */
    const PARTICLE_COUNT = 250;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 40;
        positions[i3 + 1] = (Math.random() - 0.5) * 25;
        positions[i3 + 2] = (Math.random() - 0.5) * 20 - 5;

        const c = new THREE.Color(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.55
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ── HTML particles (CSS animated) ───── */
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        const HTML_PARTICLE_COUNT = 20;
        for (let i = 0; i < HTML_PARTICLE_COUNT; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = 3 + Math.random() * 6;
            const hue = Math.random() > 0.5 ? '264, 67%' : '340, 82%';
            p.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${Math.random() * 100}%;
                background: hsla(${hue}, ${40 + Math.random() * 30}%, ${0.2 + Math.random() * 0.25});
                animation-duration: ${8 + Math.random() * 14}s;
                animation-delay: ${Math.random() * 8}s;
            `;
            particlesContainer.appendChild(p);
        }
    }

    /* ── Mouse tracking ──────────────────── */
    let mx = 0, my = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    /* ── Resize handler ──────────────────── */
    function onResize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize);

    /* ── Render loop ─────────────────────── */
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        /* Camera follows mouse */
        targetX += (mx * 1.5 - targetX) * 0.03;
        targetY += (my * 1.0 - targetY) * 0.03;
        camera.position.x = targetX;
        camera.position.y = targetY;
        camera.lookAt(0, 0, 0);

        /* Animate salon objects */
        objects.forEach((m) => {
            m.position.x += m.userData.speedX;
            m.position.y += m.userData.speedY;
            m.rotation.x += m.userData.rotX;
            m.rotation.y += m.userData.rotY;

            /* Subtle scale breathing */
            if (m.userData.scaleOscillation > 0) {
                const s = m.userData.baseScale * (1 + Math.sin(time * 2 + m.userData.scalePhase) * m.userData.scaleOscillation * 40);
                m.scale.setScalar(s);
            }

            /* If drifting into centre, push back out to the near side */
            const CLEAR = 6;
            if (Math.abs(m.position.x) < CLEAR) {
                m.userData.speedX = (m.position.x >= 0 ? 1 : -1) * Math.abs(m.userData.speedX);
            }

            /* Wrap horizontally — reappear on the same side it exited, not the centre */
            if (m.position.x > 18) m.position.x = -(6.5 + Math.random() * 11);
            if (m.position.x < -18) m.position.x = (6.5 + Math.random() * 11);
            if (m.position.y > 12) m.position.y = -12;
            if (m.position.y < -12) m.position.y = 12;
        });

        /* Gentle particle rotation */
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;

        /* Twinkle effect */
        const posArr = particleGeo.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const phase = time * 0.5 + i * 0.1;
            posArr[i * 3 + 2] += Math.sin(phase) * 0.001;
        }
        particleGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();
})();
