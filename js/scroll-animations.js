class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        // Vérifier les préférences de mouvement réduit
        this.shouldAnimate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        if (!this.shouldAnimate) {
            this.sections.forEach(section => {
                section.classList.add('section-visible');
            });
            return;
        }

        this.sections.forEach(section => {
            section.classList.add('section-hidden');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSection(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, this.options);

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    animateSection(section) {
        requestAnimationFrame(() => {
            section.classList.remove('section-hidden');
            section.classList.add('section-visible');

            const elements = section.querySelectorAll('.fade-in, .slide-in');
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('element-visible');
                }, index * 100); // Réduction du délai entre les éléments
            });

            if (section.id === 'competences') {
                this.animateSkills(section);
            }

            if (section.id === 'portfolio') {
                this.animatePortfolio(section);
            }
        });
    }

    animateSkills(section) {
        const skillBars = section.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    bar.style.width = width;
                });
            }, index * 50); // Réduction du délai entre les barres
        });
    }

    animatePortfolio(section) {
        const items = section.querySelectorAll('.portfolio-item');
        items.forEach((item, index) => {
            item.style.transform = 'scale(0.95) translateY(20px)'; // Réduction de l'amplitude
            item.style.opacity = '0';
            setTimeout(() => {
                requestAnimationFrame(() => {
                    item.style.transform = 'scale(1) translateY(0)';
                    item.style.opacity = '1';
                });
            }, index * 100);
        });
    }
}

// Styles CSS optimisés
const styles = `
    .section-hidden {
        opacity: 0;
        transform: translateY(20px);
    }

    .section-visible {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.6s ease-out;
    }

    .fade-in {
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.5s ease-out;
    }

    .slide-in {
        opacity: 0;
        transform: translateX(-20px);
        transition: all 0.5s ease-out;
    }

    .element-visible {
        opacity: 1;
        transform: translate(0);
    }

    .skill-progress {
        transition: width 0.6s ease-out;
    }

    .portfolio-item {
        transition: all 0.5s ease-out;
    }

    @media (prefers-reduced-motion: reduce) {
        .section-hidden,
        .section-visible,
        .fade-in,
        .slide-in,
        .element-visible,
        .skill-progress,
        .portfolio-item {
            transition: none !important;
            transform: none !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
}); 