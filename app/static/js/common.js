/* ═══════════════════════════════════════════════
   LOOKWELL — Common JavaScript v3
   Preloader, custom cursor, navbar, smooth reveal,
   back-to-top, mobile touch enhancements
   ═══════════════════════════════════════════════ */
(function () {
    'use strict';

    /* ── Preloader ──────────────────────────── */
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => preloader.classList.add('hide'), 400);
            setTimeout(() => preloader.remove(), 900);
        });
    }

    /* ── Custom Cursor (desktop only) ───────── */
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let cx = 0, cy = 0, dx = 0, dy = 0;

        document.addEventListener('mousemove', (e) => {
            cx = e.clientX;
            cy = e.clientY;
            dot.style.transform = `translate(${cx - 3}px, ${cy - 3}px)`;
        });

        (function follow() {
            dx += (cx - dx) * 0.15;
            dy += (cy - dy) * 0.15;
            ring.style.transform = `translate(${dx - 18}px, ${dy - 18}px)`;
            requestAnimationFrame(follow);
        })();

        /* Hover grow on interactive elements */
        const hoverables = 'a, button, .btn, .service-card, .card, .review-card, .testimonial-card, .credential-card, .class-item, .nav-link, .nav-cta, .social-link, input, textarea';
        document.querySelectorAll(hoverables).forEach((el) => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    /* ── Navbar ──────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (navbar) {
        const onScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    if (hamburger && navLinks) {
        const toggle = () => {
            const open = hamburger.classList.toggle('open');
            navLinks.classList.toggle('open', open);
            if (navOverlay) navOverlay.classList.toggle('show', open);
            document.body.style.overflow = open ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggle);
        if (navOverlay) navOverlay.addEventListener('click', toggle);

        navLinks.querySelectorAll('.nav-link, .nav-cta').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
                if (navOverlay) navOverlay.classList.remove('show');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── Back to top ────────────────────────── */
    const btt = document.getElementById('backToTop');
    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
        btt.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ── Section reveal via IntersectionObserver */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach((el) => io.observe(el));
    }

    /* ── Active nav link highlight ──────────── */
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });

    /* ── Mobile touch: remove 300ms delay ───── */
    document.addEventListener('touchstart', function() {}, { passive: true });

})();
