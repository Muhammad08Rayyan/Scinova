// --- CUSTOM CURSOR ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    if (cursorDot && cursorOutline) {
        // Dot follows cursor exactly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    }
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
    initMagneticButtons();
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
            scrub: 0.5 // Smoother scrub
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
                scrub: 1.5, /* Smoother, heavier feel */
                end: "+=5000", /* Slower scroll */
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });
    }

    // Stacking Cards Animation
    initStackingCards();
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
            // Timer Expired: Show 00s
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";

            if (!fireworksTriggered) {
                startFireworks();
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

// --- CANVAS FIREWORKS ENGINE ---
function startFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Resize handling
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    // Fireworks variables
    const fireworks = [];
    const particles = [];

    // Helper: Random number
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Firework Class
    class Firework {
        constructor(sx, sy, tx, ty) {
            this.x = sx;
            this.y = sy;
            this.sx = sx;
            this.sy = sy;
            this.tx = tx;
            this.ty = ty;
            this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
            this.distanceTraveled = 0;
            this.coordinates = [];
            this.coordinateCount = 3;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = Math.atan2(ty - sy, tx - sx);
            this.speed = 2;
            this.acceleration = 1.05;
            this.brightness = random(50, 70);
            this.targetRadius = 1;
        }

        update(index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            if (this.targetRadius < 8) {
                this.targetRadius += 0.3;
            } else {
                this.targetRadius = 1;
            }

            this.speed *= this.acceleration;
            const vx = Math.cos(this.angle) * this.speed;
            const vy = Math.sin(this.angle) * this.speed;
            this.distanceTraveled = Math.sqrt(Math.pow(this.sx - this.x, 2) + Math.pow(this.sy - this.y, 2));

            if (this.distanceTraveled >= this.distanceToTarget) {
                createParticles(this.tx, this.ty);
                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = 'hsl(' + random(0, 360) + ', 100%, ' + this.brightness + '%)';
            ctx.stroke();
        }
    }

    // Particle Class
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.coordinates = [];
            this.coordinateCount = 5;
            while (this.coordinateCount--) {
                this.coordinates.push([this.x, this.y]);
            }
            this.angle = random(0, Math.PI * 2);
            this.speed = random(1, 10);
            this.friction = 0.95;
            this.gravity = 1;
            this.hue = random(0, 360);
            this.brightness = random(50, 80);
            this.alpha = 1;
            this.decay = random(0.015, 0.03);
        }

        update(index) {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);
            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;

            if (this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
            ctx.stroke();
        }
    }

    function createParticles(x, y) {
        let particleCount = 30;
        while (particleCount--) {
            particles.push(new Particle(x, y));
        }
    }

    // Animation Loop
    function loop() {
        requestAnimationFrame(loop);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        let i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i);
        }

        let j = particles.length;
        while (j--) {
            particles[j].draw();
            particles[j].update(j);
        }

        // Random launch
        if (Math.random() < 0.05) {
            fireworks.push(new Firework(width / 2, height, random(0, width), random(0, height / 2)));
        }
    }

    loop();
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
