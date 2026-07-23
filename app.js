/* ==========================================================================
   FIT COMPANY INTERACTION LOGIC (GSAP & VANILLA JS)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // Flatpickr Custom Dark Datepicker initialization
    if (typeof flatpickr !== 'undefined') {
        flatpickr("#booking-date", {
            locale: "pt",
            dateFormat: "d/m/Y",
            minDate: "today",
            disableMobile: "true",
            disable: [
                function(date) {
                    // Disable Sundays (0 = Sunday)
                    return (date.getDay() === 0);
                }
            ]
        });
    }
    
    // 1. Custom Cursor Follower with GSAP
    const cursor = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".custom-cursor-dot");
    
    if (cursor && cursorDot && window.innerWidth > 600) {
        let mouseX = 0, mouseY = 0;
        let ballX = 0, ballY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the dot
            gsap.set(cursorDot, { x: mouseX, y: mouseY });
        });

        // Smoothly interpolate the outer ring (lag effect)
        gsap.ticker.add(() => {
            ballX += (mouseX - ballX) * 0.15;
            ballY += (mouseY - ballY) * 0.15;
            
            gsap.set(cursor, { x: ballX, y: ballY });
        });

        // Hover expansions
        const hoverTargets = document.querySelectorAll(
            "a, button, .btn, .service-card, .gallery-item, .barber-card, .faq-trigger, input, select, textarea"
        );

        hoverTargets.forEach((target) => {
            target.addEventListener("mouseenter", () => {
                cursor.classList.add("hovered");
                gsap.to(cursorDot, { scale: 2, backgroundColor: "#FFFFFF", duration: 0.3 });
            });
            target.addEventListener("mouseleave", () => {
                cursor.classList.remove("hovered");
                gsap.to(cursorDot, { scale: 1, backgroundColor: "#a855f7", duration: 0.3 });
            });
        });
    }

    // 2. Navbar scroll styling & Active Link Highlight
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
        
        // Highlight active link based on scroll position
        let currentSectionId = "";
        const sections = document.querySelectorAll("section");
        
        sections.forEach((sec) => {
            const top = sec.offsetTop - 120;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // 3. Mobile Menu Toggling
    const hamburger = document.getElementById("hamburger-menu");
    const mobileMenu = document.getElementById("mobile-menu");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            
            if (mobileMenu.classList.contains("active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        });

        mobileMenu.addEventListener("click", () => {
            hamburger.classList.remove("active");
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
        });
    }

    // 4. Hero Slideshow with GSAP crossfades
    const slideshowContainer = document.getElementById("hero-slideshow");
    
    if (slideshowContainer) {
        const images = [
            "assets/hero_1.png",
            "assets/hero_2.png",
            "assets/hero_3.png",
            "assets/hero_4.png"
        ];
        
        // Append all images
        images.forEach((src, idx) => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = `Fit Company Slideshow ${idx + 1}`;
            img.style.position = "absolute";
            img.style.top = "0";
            img.style.left = "0";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.opacity = idx === 0 ? "1" : "0";
            img.style.transition = "transform 6s ease-out";
            img.classList.add("slideshow-img");
            slideshowContainer.appendChild(img);
        });

        const slideImages = slideshowContainer.querySelectorAll(".slideshow-img");
        let activeIdx = 0;

        // Apply scale animation immediately on the first slide
        if (slideImages[0]) {
            slideImages[0].style.transform = "scale(1.1) translate(1%, 1%)";
        }

        function nextSlide() {
            const currentImg = slideImages[activeIdx];
            activeIdx = (activeIdx + 1) % slideImages.length;
            const nextImg = slideImages[activeIdx];

            // Reset transform of next image so it animates from base
            nextImg.style.transform = "scale(1.0) translate(0, 0)";

            // Crossfade transitions
            gsap.to(currentImg, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
            gsap.to(nextImg, { 
                opacity: 1, 
                duration: 1.5, 
                ease: "power2.inOut",
                onComplete: () => {
                    nextImg.style.transform = "scale(1.1) translate(1%, 1%)";
                }
            });
        }

        setInterval(nextSlide, 5000);
    }

    // 5. GSAP Scroll Trigger reveals
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animate navbar on load
        gsap.from(".navbar", {
            y: -50,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        });

        // Animate hero texts on load
        gsap.from(".hero-label", {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out"
        });
        
        gsap.from(".hero-headline", {
            y: 40,
            opacity: 0,
            duration: 1.2,
            delay: 0.4,
            ease: "power4.out"
        });

        gsap.from(".hero-desc", {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            ease: "power3.out"
        });

        gsap.from(".hero-ctas", {
            y: 20,
            opacity: 0,
            duration: 1,
            delay: 0.8,
            ease: "power3.out"
        });

        // Trigger animations for sections
        const revealElements = document.querySelectorAll(".animate-reveal");
        
        revealElements.forEach((el) => {
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out"
            });
        });
    } else {
        // Fallback using Intersection Observer if GSAP is not loaded
        const revealElements = document.querySelectorAll(".animate-reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    entry.target.style.filter = "blur(0px)";
                    entry.target.style.transition = "opacity 1s ease-out, transform 1s ease-out, filter 1s ease-out";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => observer.observe(el));
    }

    // 6. Lightbox functionality for Gallery
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");
    const galleryItems = document.querySelectorAll(".gallery-item");

    if (lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener("click", () => {
                const imgSrc = item.dataset.img;
                lightboxImg.src = imgSrc;
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        lightboxClose.addEventListener("click", () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
        });

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    }

    // 7. Testimonials Review Slider
    const testiSlides = document.querySelectorAll(".testimonial-slide");
    const testiDotsContainer = document.getElementById("testimonial-dots");
    const prevTestiBtn = document.getElementById("prev-testi");
    const nextTestiBtn = document.getElementById("next-testi");
    let currentTestiIdx = 0;
    let testiInterval;

    if (testiSlides.length > 0) {
        if (testiDotsContainer) {
            testiDotsContainer.innerHTML = "";
            testiSlides.forEach((_, idx) => {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                if (idx === 0) dot.classList.add("active");
                dot.setAttribute("data-index", idx);
                testiDotsContainer.appendChild(dot);
            });
        }

        const testiDots = document.querySelectorAll(".dot");

        function showTestiSlide(index) {
            testiSlides.forEach(slide => slide.classList.remove("active"));
            testiDots.forEach(dot => dot.classList.remove("active"));
            
            if (testiSlides[index]) testiSlides[index].classList.add("active");
            if (testiDots[index]) testiDots[index].classList.add("active");
            currentTestiIdx = index;
        }

        function nextTestiSlide() {
            let nextIndex = (currentTestiIdx + 1) % testiSlides.length;
            showTestiSlide(nextIndex);
        }

        function startTestiAutoPlay() {
            testiInterval = setInterval(nextTestiSlide, 6000);
        }

        function resetTestiTimer() {
            clearInterval(testiInterval);
            startTestiAutoPlay();
        }

        if (nextTestiBtn && prevTestiBtn) {
            nextTestiBtn.addEventListener("click", () => {
                let nextIndex = (currentTestiIdx + 1) % testiSlides.length;
                showTestiSlide(nextIndex);
                resetTestiTimer();
            });

            prevTestiBtn.addEventListener("click", () => {
                let prevIndex = (currentTestiIdx - 1 + testiSlides.length) % testiSlides.length;
                showTestiSlide(prevIndex);
                resetTestiTimer();
            });
        }

        testiDots.forEach(dot => {
            dot.addEventListener("click", (e) => {
                const targetIdx = parseInt(e.target.dataset.index);
                showTestiSlide(targetIdx);
                resetTestiTimer();
            });
        });

        startTestiAutoPlay();
    }

    // 8. FAQ Accordion panel expansion
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const trigger = item.querySelector(".faq-trigger");
        const panel = item.querySelector(".faq-panel");

        if (trigger && panel) {
            trigger.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove("active");
                    const otherPanel = otherItem.querySelector(".faq-panel");
                    if (otherPanel) {
                        otherPanel.style.maxHeight = null;
                    }
                });

                if (!isActive) {
                    item.classList.add("active");
                    panel.style.maxHeight = panel.scrollHeight + "px";
                } else {
                    item.classList.remove("active");
                    panel.style.maxHeight = null;
                }
            });
        }
    });

    // 9. Contact form request handling (mock server post)
    const bookingForm = document.getElementById("booking-form");
    const successToast = document.getElementById("booking-success");

    if (bookingForm && successToast) {
        const dateInput = document.getElementById("booking-date");
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const formData = new FormData(bookingForm);
            const name = formData.get("name");
            const phone = formData.get("phone");
            const service = formData.get("service");
            const date = formData.get("date");
            const time = formData.get("time");

            if (name && phone && service && date && time) {
                successToast.style.display = "flex";
                bookingForm.reset();
                successToast.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    successToast.style.opacity = "0";
                    setTimeout(() => {
                        successToast.style.display = "none";
                        successToast.style.opacity = "";
                    }, 500);
                }, 8000);
            }
        });
    }

    // 10. Recovery Card Balloon Popup Logic
    const recoveryCard = document.getElementById("protese-card");
    const recoveryBalloon = document.getElementById("protese-balloon");
    const balloonClose = document.getElementById("protese-balloon-close");
    
    if (recoveryCard && recoveryBalloon) {
        recoveryCard.addEventListener("click", (e) => {
            if (e.target.closest("#protese-balloon-close")) return;
            recoveryCard.classList.toggle("active");
        });

        recoveryBalloon.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        if (balloonClose) {
            balloonClose.addEventListener("click", (e) => {
                e.stopPropagation();
                recoveryCard.classList.remove("active");
            });
        }

        document.addEventListener("click", (e) => {
            if (!recoveryCard.contains(e.target)) {
                recoveryCard.classList.remove("active");
            }
        });

        // Tab selection logic inside balloon
        const tabButtons = recoveryBalloon.querySelectorAll(".tab-btn");
        const tabContents = recoveryBalloon.querySelectorAll(".tab-content");

        tabButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const targetTab = btn.dataset.tab;

                tabButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                tabContents.forEach(content => {
                    content.classList.remove("active");
                    if (content.id === `tab-${targetTab}`) {
                        content.classList.add("active");
                    }
                });
            });
        });
    }

    // 15. Mobile Hero Floating Particles Generator (Purple, White, Silver Gray)
    const initMobileParticles = () => {
        const canvas = document.getElementById("mobile-particles-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let width = (canvas.width = canvas.parentElement.offsetWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement.offsetHeight || 500);

        const particles = [];
        const particleCount = 28;
        const colors = [
            "rgba(168, 85, 247, 0.75)",  // Electric Purple
            "rgba(168, 85, 247, 0.4)",   // Soft Purple Glow
            "rgba(255, 255, 255, 0.85)", // White
            "rgba(180, 180, 180, 0.6)"   // Silver Gray
        ];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.2 + 1.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 0.3,
                vy: - (Math.random() * 0.45 + 0.2),
                alpha: Math.random() * 0.7 + 0.3,
                pulseSpeed: Math.random() * 0.02 + 0.008
            });
        }

        const render = () => {
            if (window.innerWidth > 991) return; // Run ONLY on mobile / tablet
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.012;

                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;

                ctx.save();
                ctx.globalAlpha = Math.max(0.15, Math.min(0.9, p.alpha));
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                if (p.color.includes("168, 85, 247")) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "#a855f7";
                }
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(render);
        };

        window.addEventListener("resize", () => {
            if (window.innerWidth <= 991 && canvas.parentElement) {
                width = canvas.width = canvas.parentElement.offsetWidth;
                height = canvas.height = canvas.parentElement.offsetHeight;
            }
        });

        render();
    };

    if (window.innerWidth <= 991) {
        initMobileParticles();
    }

});
