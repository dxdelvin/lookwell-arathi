/* ═══════════════════════════════════════════════
   LOOKWELL — Three.js Hero Scene v3
   Geometric meshes + particle system + mouse tracking
   Organic, playful shapes inspired by reference art
   ═══════════════════════════════════════════════ */
(function () {
    'use strict';

    const canvas = document.getElementById('heroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    /* Scene setup */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Colors */
    const PALETTE = [0x7C3AED, 0xF472B6, 0xA78BFA, 0xD4A574, 0xF28B82, 0xC4B5FD, 0x6EE7B7];

    /* ── Floating geometric meshes ────────── */
    const meshes = [];
    const GEOMETRY_POOL = [
        new THREE.IcosahedronGeometry(0.4, 0),
        new THREE.OctahedronGeometry(0.35, 0),
        new THREE.TetrahedronGeometry(0.35, 0),
        new THREE.TorusGeometry(0.3, 0.12, 8, 16),
        new THREE.SphereGeometry(0.3, 6, 6),
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.DodecahedronGeometry(0.35, 0),
        new THREE.TorusKnotGeometry(0.25, 0.08, 32, 8)
    ];

    const MESH_COUNT = 40;

    for (let i = 0; i < MESH_COUNT; i++) {
        const geo = GEOMETRY_POOL[Math.floor(Math.random() * GEOMETRY_POOL.length)];
        const mat = new THREE.MeshBasicMaterial({
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
            wireframe: Math.random() > 0.35,
            transparent: true,
            opacity: 0.12 + Math.random() * 0.2
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 32,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 14 - 4
        );
        mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );

        mesh.userData = {
            speedX: (Math.random() - 0.5) * 0.003,
            speedY: (Math.random() - 0.5) * 0.003,
            rotX: (Math.random() - 0.5) * 0.01,
            rotY: (Math.random() - 0.5) * 0.01,
            scaleOscillation: Math.random() * 0.002,
            scalePhase: Math.random() * Math.PI * 2
        };

        scene.add(mesh);
        meshes.push(mesh);
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

        /* Animate meshes */
        meshes.forEach((m) => {
            m.position.x += m.userData.speedX;
            m.position.y += m.userData.speedY;
            m.rotation.x += m.userData.rotX;
            m.rotation.y += m.userData.rotY;

            /* Subtle scale breathing */
            if (m.userData.scaleOscillation > 0) {
                const s = 1 + Math.sin(time * 2 + m.userData.scalePhase) * m.userData.scaleOscillation * 40;
                m.scale.setScalar(s);
            }

            /* Wrap around boundaries */
            if (m.position.x > 18) m.position.x = -18;
            if (m.position.x < -18) m.position.x = 18;
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
