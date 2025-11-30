// Add hover effect to interactive elements
const hoverables = document.querySelectorAll('a, button, .magnetic-btn, .faq-question, .module-card');
hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// --- LENIS SMOOTH SCROLL ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// --- INITIALIZATION ---
window.addEventListener("load", () => {
    initLoader();
    initHero();
    initScroll();
    initFAQ();
    initCountdown();
    initMagneticButtons();
    initKineticType();
    initGallery();
});

// --- SIMPLIFIED LOADER ---
function initLoader() {
    const tl = gsap.timeline();

    // Text Reveal
    tl.from(".loader-text", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power2.out"
    })
        .from(".loader-subtext", {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5")
        // Fade Out
        .to(".loader", {
            opacity: 0,
            duration: 1,
            delay: 1,
            pointerEvents: "none",
            ease: "power2.inOut"
        });
}

// --- HERO ANIMATIONS ---
function initHero() {
    const tl = gsap.timeline({ delay: 2.5 });

    // Fire Timer Reveal
    tl.from(".fire-timer", {
        scale: 0.8,
        opacity: 0,
        filter: "blur(10px)",
        duration: 2,
        ease: "power4.out"
    })
        .from(".hero-title-small", {
            opacity: 0,
            letterSpacing: "1em",
            duration: 1.5,
            ease: "power2.out"
        }, "-=1.5")
        // Meta Info Reveal
        .from(".hero-meta", {
            opacity: 0,
            y: 20,
            duration: 1
        }, "-=1");
}

// --- SCROLL ANIMATIONS ---
function initScroll() {
    // Parallax Image
    gsap.fromTo(".parallax-img", {
        yPercent: -10
    }, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
            trigger: ".editorial-image",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // Image Reveal (Mask)
    gsap.to(".image-frame", {
        clipPath: "inset(0 0 0 0)",
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
            trigger: ".editorial-image",
            start: "top 70%"
        }
    });

    // Text Reveals
    const revealElements = document.querySelectorAll(".reveal-text");
    revealElements.forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%"
            }
        });
    });

    // Horizontal Scroll (Desktop Only)
    if (window.innerWidth > 768) {
        const content = document.querySelector(".hs-content");
        const wrapper = document.querySelector(".horizontal-scroll-wrapper");

        gsap.to(content, {
            x: () => {
                const paddingLeft = parseFloat(window.getComputedStyle(wrapper).paddingLeft);
                return -(content.scrollWidth - window.innerWidth + paddingLeft);
            },
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-scroll-section",
                pin: true,
                scrub: 2, /* Smoother, heavier feel */
                end: "+=5000", /* Slower scroll */
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    }

    // Stacking Cards Animation
    initStackingCards();
}

// --- STACKING CARDS ANIMATION ---
function initStackingCards() {
    const cards = gsap.utils.toArray('.testimonial-card-stack');

    if (window.innerWidth <= 768) {
        // Simple fade-in for mobile
        cards.forEach(card => {
            gsap.from(card, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%"
                }
            });
        });
        return;
    }

    // Desktop stacking effect
    cards.forEach((card, index) => {
        const cardContent = card.querySelector('.card-content');

        // Calculate scale based on card index
        const scaleStart = 1 - (index * 0.05);

        // Initial state - cards start stacked
        gsap.set(card, {
            scale: scaleStart,
            transformOrigin: 'center top'
        });

        // Pin each card and animate it
        ScrollTrigger.create({
            trigger: card,
            start: "top top+=100",
            end: () => index === cards.length - 1 ? "bottom top+=100" : `+=${window.innerHeight * 0.8}`,
            pin: true,
            pinSpacing: false,
            scrub: 0.5,
            animation: gsap.timeline()
                .to(card, {
                    scale: scaleStart - 0.1,
                    opacity: 0.5,
                    rotation: -5,
                    ease: "none"
                })
                .to(cardContent, {
                    boxShadow: `
                        0 20px 60px rgba(0, 0, 0, 0.5),
                        0 0 100px rgba(212, 175, 55, 0.3)
                    `,
                    ease: "none"
                }, 0),
            onUpdate: (self) => {
                // Smooth glow transition
                const progress = self.progress;
                const glowIntensity = Math.max(0, 1 - progress);

                cardContent.style.boxShadow = `
                    0 20px 60px rgba(0, 0, 0, 0.5),
                    0 0 ${40 + (glowIntensity * 60)}px rgba(212, 175, 55, ${0.1 + (glowIntensity * 0.2)})
                `;
            }
        });
    });
}

// --- KINETIC TYPOGRAPHY (Optimized) ---
function initKineticType() {
    // Only enable on desktop for performance
    if (window.innerWidth < 768) return;

    let proxy = { skew: 0 },
        skewSetter = gsap.quickSetter(".section-title, .hs-title", "skewY", "deg"),
        clamp = gsap.utils.clamp(-10, 10); // Reduced skew for less jitter

    ScrollTrigger.create({
        onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -500); // Reduced sensitivity
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
                proxy.skew = skew;
                gsap.to(proxy, {
                    skew: 0,
                    duration: 0.5,
                    ease: "power3",
                    overwrite: true,
                    onUpdate: () => skewSetter(proxy.skew)
                });
            }
        }
    });
}

// --- MAGNETIC BUTTONS ---
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-btn');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(magnet, {
                x: x * 0.3, // Magnetic strength
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

// --- FAQ ACCORDION ---
function initFAQ() {
    const items = document.querySelectorAll(".faq-item");

    items.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close all
            items.forEach(i => {
                i.classList.remove("active");
                i.querySelector(".faq-answer").style.maxHeight = null;
            });

            // Open clicked if not active
            if (!isActive) {
                item.classList.add("active");
                const answer = item.querySelector(".faq-answer");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

// --- COUNTDOWN LOGIC ---
function initCountdown() {
    const targetDate = new Date("January 9, 2026 00:00:00").getTime();
    let fireworksTriggered = false;

    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.querySelector(".fire-timer").innerHTML = "THE NINTH AGE IS HERE";
            document.querySelector(".hero-title-small").style.display = "none";

            if (!fireworksTriggered) {
                triggerFireworks();
                fireworksTriggered = true;
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    setInterval(updateTimer, 1000);
    updateTimer();
}

function triggerFireworks() {
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// --- GALLERY PARALLAX ---
function initGallery() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const columns = document.querySelectorAll(".gallery-col");

    // Column 1 (Left) - Moves Up Slow
    gsap.to(columns[0], {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // Column 2 (Center) - Moves Down (Reverse Parallax)
    gsap.fromTo(columns[1], {
        yPercent: -20
    }, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    // Column 3 (Right) - Moves Up Slow
    gsap.to(columns[2], {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
        }
    });
}
