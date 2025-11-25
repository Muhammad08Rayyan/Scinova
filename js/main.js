console.log("Grimoire Opened. Initializing ScinNova 9...");

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// --- CUSTOM CURSOR ---
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot follows instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline follows with lag
    gsap.to(cursorOutline, {
        left: `${posX}px`,
        top: `${posY}px`,
        duration: 0.5,
        overwrite: "auto"
    });
});

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
    gsap.to(".parallax-img", {
        yPercent: 20,
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
        const sections = gsap.utils.toArray(".hs-item");
        gsap.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
            scrollTrigger: {
                trigger: ".horizontal-scroll-section",
                pin: true,
                scrub: 1,
                end: "+=3000",
                anticipatePin: 1
            }
        });
    }
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
