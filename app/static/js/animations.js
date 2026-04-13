/* ═══════════════════════════════════════════════
   LOOKWELL — GSAP Animations v3
   ScrollTrigger reveals, hero entrance, counters,
   parallax, stagger groups
   ═══════════════════════════════════════════════ */
(function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* ── Shared defaults ────────────────────── */
    const EASE = 'power3.out';
    const DEFAULTS = { duration: 0.5, ease: EASE };

    /* ── Helper: create ScrollTrigger ────────── */
    function animOnScroll(targets, from, triggerOpts) {
        const els = gsap.utils.toArray(targets);
        if (!els.length) return;
        const to = { opacity: 1, x: 0, y: 0 };
        els.forEach((el, i) => {
            gsap.fromTo(el,
                { ...from },
                {
                    ...DEFAULTS,
                    ...to,
                    delay: i * (from.stagger || 0),
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 105%',
                        toggleActions: 'play none none none',
                        ...triggerOpts
                    }
                }
            );
        });
    }

    /* ── Fade-up / left / right animation sets ─ */
    animOnScroll('.anim-fade-up', { y: 20, opacity: 0, stagger: 0.04 });
    animOnScroll('.anim-fade-left', { x: 30, opacity: 0, stagger: 0.04 });
    animOnScroll('.anim-fade-right', { x: -30, opacity: 0, stagger: 0.04 });

    /* ── Hero entrance stagger (if hero present) ─ */
    const hero = document.querySelector('.hero-content');
    if (hero) {
        const tl = gsap.timeline({ defaults: DEFAULTS });
        tl.fromTo('.hero-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
          .fromTo('.hero-title', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2')
          .fromTo('.hero-desc', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.2')
          .fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.15')
          .fromTo('.hero-stats', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '-=0.15')
          .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.1');
    }

    /* ── Marquee entrance ───────────────────── */
    const marquee = document.querySelector('.marquee-strip');
    if (marquee) {
        gsap.fromTo(marquee,
            { opacity: 0, y: 10 },
            {
                opacity: 1, y: 0,
                duration: 0.4,
                scrollTrigger: {
                    trigger: marquee,
                    start: 'top 105%'
                }
            }
        );
    }

    /* ── Card stagger groups ────────────────── */
    const cardGroups = [
        '.services-scroll .service-card',
        '.testimonial-track .testimonial-card',
        '.credentials-grid .credential-card',
        '.reviews-grid .review-card',
        '.stats-row .stat-block',
        '.service-blocks .service-block'
    ];

    cardGroups.forEach((selector) => {
        const cards = gsap.utils.toArray(selector);
        if (!cards.length) return;
        gsap.fromTo(cards,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 0.4,
                stagger: 0.06,
                ease: EASE,
                scrollTrigger: {
                    trigger: cards[0].parentElement,
                    start: 'top 105%'
                }
            }
        );
    });

    /* ── Number counter animation ───────────── */
    document.querySelectorAll('.stat-num, .stat-block .stat-num, .highlight-num, .badge-number').forEach((el) => {
        const raw = el.textContent;
        const num = parseFloat(raw);
        if (isNaN(num)) return;

        const suffix = raw.replace(String(num), '');
        const isFloat = raw.includes('.');

        ScrollTrigger.create({
            trigger: el,
            start: 'top 105%',
            onEnter: () => {
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: num,
                    duration: 1.5,
                    ease: 'power2.out',
                    onUpdate: () => {
                        el.textContent = (isFloat ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
                    }
                });
            },
            once: true
        });
    });

    /* ── Section title subtle parallax ──────── */
    gsap.utils.toArray('.section-title').forEach((el) => {
        gsap.to(el, {
            y: -10,
            scrollTrigger: {
                trigger: el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    /* ── Training badges bounce-in ──────────── */
    const badges = gsap.utils.toArray('.training-badges .badge');
    if (badges.length) {
        gsap.fromTo(badges,
            { y: 15, opacity: 0, scale: 0.9 },
            {
                y: 0, opacity: 1, scale: 1,
                stagger: 0.05,
                duration: 0.35,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: badges[0].parentElement,
                    start: 'top 105%'
                }
            }
        );
    }

    /* ── Service block alternating slide-in ─── */
    gsap.utils.toArray('.service-block').forEach((block, i) => {
        gsap.fromTo(block,
            { x: i % 2 === 0 ? -20 : 20, opacity: 0 },
            {
                x: 0, opacity: 1,
                duration: 0.4,
                ease: EASE,
                scrollTrigger: {
                    trigger: block,
                    start: 'top 105%'
                }
            }
        );
    });

    /* ── Map reveal ─────────────────────────── */
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        gsap.fromTo(mapContainer,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 0.5,
                ease: EASE,
                scrollTrigger: {
                    trigger: mapContainer,
                    start: 'top 105%'
                }
            }
        );
    }

    /* ── Experience badge elastic pop ────────── */
    const expBadge = document.querySelector('.experience-badge');
    if (expBadge) {
        gsap.fromTo(expBadge,
            { scale: 0.5, opacity: 0 },
            {
                scale: 1, opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: expBadge,
                    start: 'top 105%'
                }
            }
        );
    }

    /* ── CTA banner entrance ────────────────── */
    gsap.utils.toArray('.cta-inner').forEach((el) => {
        gsap.fromTo(el,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1,
                duration: 0.45,
                ease: EASE,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 105%'
                }
            }
        );
    });

    /* ── Highlight cards scale-in ───────────── */
    const highlights = gsap.utils.toArray('.highlight-card');
    if (highlights.length) {
        gsap.fromTo(highlights,
            { scale: 0.9, opacity: 0 },
            {
                scale: 1, opacity: 1,
                stagger: 0.07,
                duration: 0.35,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: highlights[0].parentElement,
                    start: 'top 105%'
                }
            }
        );
    }

    /* ── Review CTA cards ───────────────────── */
    const ctaCards = gsap.utils.toArray('.review-cta-card');
    if (ctaCards.length) {
        gsap.fromTo(ctaCards,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1,
                stagger: 0.07,
                duration: 0.4,
                ease: EASE,
                scrollTrigger: {
                    trigger: ctaCards[0].parentElement,
                    start: 'top 105%'
                }
            }
        );
    }

})();
