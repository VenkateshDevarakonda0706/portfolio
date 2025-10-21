document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavbar();
    initTypingEffect();
    initOrbitAnimations();
    initSunPhotoModal();
    initSmoothScroll();
    initSectionAnimations();
    initEmailJS();
    initResumeButtons();
});

/////////////////////// NAVBAR ///////////////////////
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

/////////////////////// TYPING EFFECT ///////////////////////
function initTypingEffect() {
    const typingText = document.getElementById('typing-text');
    const phrases = ['Web Developer','Front-End','Problem Solver','Code Explorer','AI Explorer','Innovator'];
    let currentPhraseIndex = 0, currentCharIndex = 0, isDeleting = false, typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[currentPhraseIndex];
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();
}

/////////////////////// ORBIT ANIMATIONS ///////////////////////
function initOrbitAnimations() {
    const planets = document.querySelectorAll('.random-orbit');

    planets.forEach((planet, index) => {
        const startAngle = Math.random() * 360;
        const radius = 120 + (index * 40);
        const duration = 15 + Math.random() * 15;
        const direction = Math.random() > 0.5 ? 'normal' : 'reverse';

        planet.style.transform = `rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg)`;

        const animationName = `orbit${index}`;
        const keyframes = `
            @keyframes ${animationName} {
                from { transform: rotate(${startAngle}deg) translateX(${radius}px) rotate(-${startAngle}deg); }
                to { transform: rotate(${startAngle + 360}deg) translateX(${radius}px) rotate(-${startAngle + 360}deg); }
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);

        planet.style.animation = `${animationName} ${duration}s linear infinite ${direction}`;

        planet.addEventListener('mouseenter', () => planet.style.animationPlayState = 'paused');
        planet.addEventListener('mouseleave', () => planet.style.animationPlayState = 'running');
    });
}

/////////////////////// SUN PHOTO MODAL ///////////////////////
function initSunPhotoModal() {
    const sun = document.querySelector('.sun-core');
    const modal = document.getElementById('photo-modal');
    const closeBtn = document.querySelector('.close');
    const randomPhoto = document.getElementById('random-photo');

    if (sun && modal && closeBtn && randomPhoto) {
        sun.addEventListener('click', () => {
            const randomId = Math.floor(Math.random() * 1000) + 1;
            randomPhoto.src = `https://picsum.photos/600/400?random=${randomId}`;
            modal.style.display = 'block';
        });
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => { if(e.target === modal) modal.style.display='none'; });
        document.addEventListener('keydown', (e) => { if(e.key==='Escape') modal.style.display='none'; });
    }
}

/////////////////////// SMOOTH SCROLL ///////////////////////
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if(targetElement) {
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

/////////////////////// SECTION ANIMATIONS ///////////////////////
function initSectionAnimations() {
    const elements = document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-in-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.style.opacity='1';
                if(entry.target.classList.contains('slide-in-left') || entry.target.classList.contains('slide-in-right')) {
                    entry.target.style.transform='translateX(0)';
                } else {
                    entry.target.style.transform='translateY(0)';
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

/////////////////////// EMAILJS CONTACT FORM ///////////////////////
function initEmailJS() {
    emailjs.init("YOUR_PUBLIC_KEY_HERE"); // Replace with your EmailJS public key

    const form = document.getElementById("contact-form");
    if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();
            emailjs.sendForm("service_jtnlzjh", "template_1g0ebr8", this)
            .then(() => {
                alert("✅ Message sent successfully!");
                form.reset();
            }, (error) => {
                alert("❌ Failed to send message: " + error.text);
            });
        });
    }
}

/////////////////////// RESUME BUTTONS ///////////////////////
function initResumeButtons() {
    const resumePath = "resume.pdf"; // adjust path
    const downloadBtn = document.getElementById("download-cv");
    const openBtn = document.getElementById("open-cv");

    async function fileExists(url){
        try {
            const res = await fetch(url, { method: 'HEAD' });
            return res.ok;
        } catch { return false; }
    }

    downloadBtn.addEventListener("click", async () => {
        if(await fileExists(resumePath)){
            const link = document.createElement("a");
            link.href = resumePath;
            link.download = "Resume.pdf";
            link.click();
        } else alert("❌ Resume not found!");
    });

    openBtn.addEventListener("click", async () => {
        if(await fileExists(resumePath)) window.open(resumePath, "_blank");
        else alert("❌ Resume not found!");
    });
}
