class TypedTextAnimation {
    constructor() {
        this.texts = [
            "✨ Créateur d'Expériences Web Exceptionnelles",
            "🚀 Expert en Solutions Digitales Innovantes",
            "💡 Architecte de Projets Web sur Mesure",
            "🎯 Votre Vision, Mon Expertise Technique"
        ];
        this.textElement = document.querySelector('.typed-text');
        this.cursorElement = document.querySelector('.cursor');
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 50;
        this.erasingSpeed = 25;
        this.delayAfterWord = 2000;
        this.delayBeforeStart = 1000;
    }

    type() {
        if (!this.textElement || !this.cursorElement) {
            console.error('Elements not found');
            return;
        }

        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.charIndex--;
            this.typingSpeed = this.erasingSpeed;
        } else {
            this.charIndex++;
            this.typingSpeed = 50 + Math.random() * 50;
        }

        this.textElement.textContent = currentText.substring(0, this.charIndex);

        if (!this.isDeleting && this.charIndex === currentText.length) {
            this.typingSpeed = this.delayAfterWord;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            this.typingSpeed = this.delayBeforeStart;
        }

        setTimeout(() => this.type(), this.typingSpeed);
    }

    start() {
        this.textElement.parentElement.classList.add('fade-in');
        
        setTimeout(() => {
            this.type();
            this.cursorElement.style.animation = 'blink 1s infinite';
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const typedAnimation = new TypedTextAnimation();
    setTimeout(() => {
        typedAnimation.start();
    }, 800);
}); 