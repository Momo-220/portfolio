class ParallaxEffect {
    constructor() {
        this.container = document.querySelector('.hero');
        this.elements = document.querySelectorAll('.parallax-element');
        this.depth = [0.1, 0.2, 0.3, 0.4]; // Réduction des profondeurs pour un effet plus subtil
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.isEnabled = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches;
        this.rafId = null;
        
        this.init();
    }

    init() {
        if (!this.isEnabled) return;
        
        this.elements.forEach((element, index) => {
            element.style.transform = 'translate3d(0, 0, 0)';
            element.style.transition = 'transform 0.1s ease-out';
            element.setAttribute('data-depth', this.depth[index % this.depth.length]);
        });

        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        // Optimisation du mousemove avec throttle
        let ticking = false;
        document.addEventListener('mousemove', (e) => {
            if (!this.isEnabled || ticking) return;
            
            ticking = true;
            requestAnimationFrame(() => {
                this.mouseX = (e.clientX - this.windowWidth / 2) / (this.windowWidth / 2);
                this.mouseY = (e.clientY - this.windowHeight / 2) / (this.windowHeight / 2);
                ticking = false;
            });
        });

        // Optimisation du resize avec debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            
            resizeTimeout = setTimeout(() => {
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;
                this.isEnabled = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches;
                
                if (!this.isEnabled) {
                    this.resetElements();
                    if (this.rafId) {
                        cancelAnimationFrame(this.rafId);
                        this.rafId = null;
                    }
                } else if (!this.rafId) {
                    this.animate();
                }
            }, 150);
        });

        // Optimisation du gyroscope
        if (window.DeviceOrientationEvent) {
            let orientationTimeout;
            window.addEventListener('deviceorientation', (e) => {
                if (!this.isEnabled || orientationTimeout) return;
                
                orientationTimeout = setTimeout(() => {
                    const tiltX = (e.gamma / 90) * 0.5; // Réduction de la sensibilité
                    const tiltY = (e.beta / 90) * 0.5;
                    
                    this.mouseX = tiltX;
                    this.mouseY = tiltY;
                    orientationTimeout = null;
                }, 100);
            });
        }
    }

    animate() {
        if (!this.isEnabled) return;

        this.elements.forEach(element => {
            const depth = parseFloat(element.getAttribute('data-depth'));
            const translateX = this.mouseX * 50 * depth; // Réduction de l'amplitude
            const translateY = this.mouseY * 25 * depth;
            const rotateX = -this.mouseY * 10 * depth;
            const rotateY = this.mouseX * 10 * depth;
            const scale = 1 + Math.abs(depth * 0.05);

            element.style.transform = `
                translate3d(${translateX}px, ${translateY}px, 0)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale(${scale})
            `;
        });

        this.rafId = requestAnimationFrame(() => this.animate());
    }

    resetElements() {
        this.elements.forEach(element => {
            element.style.transform = 'translate3d(0, 0, 0) rotateX(0) rotateY(0) scale(1)';
        });
    }

    addElement(element, depth) {
        if (!this.isEnabled) return;
        
        element.classList.add('parallax-element');
        element.setAttribute('data-depth', depth || this.depth[0]);
        element.style.transform = 'translate3d(0, 0, 0)';
        element.style.transition = 'transform 0.1s ease-out';
        this.elements = document.querySelectorAll('.parallax-element');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const parallax = new ParallaxEffect();
    
    // Réduction du nombre d'éléments avec parallaxe
    const elementsToParallax = [
        { selector: '.hero-title', depth: 0.2 },
        { selector: '.hero-subtitle', depth: 0.3 },
        { selector: '.hero-cta', depth: 0.4 }
    ];

    elementsToParallax.forEach(({ selector, depth }) => {
        const element = document.querySelector(selector);
        if (element) {
            parallax.addElement(element, depth);
        }
    });
}); 