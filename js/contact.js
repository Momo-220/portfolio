class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.inputs = this.form.querySelectorAll('input, textarea');
        
        this.init();
    }
    
    init() {
        this.setupFormValidation();
        this.setupFloatingLabels();
    }
    
    setupFormValidation() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });
        
        this.inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
        });
    }
    
    setupFloatingLabels() {
        this.inputs.forEach(input => {
            const label = input.nextElementSibling;
            
            if (input.value) {
                label.classList.add('active');
            }
            
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
        });
    }
    
    validateInput(input) {
        const errorClass = 'error';
        let isValid = true;
        
        // Supprimer les messages d'erreur existants
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validation spécifique pour chaque type d'input
        switch(input.type) {
            case 'email':
                isValid = this.validateEmail(input.value);
                if (!isValid) {
                    this.showError(input, 'Veuillez entrer une adresse email valide');
                }
                break;
                
            case 'text':
                isValid = input.value.length >= 2;
                if (!isValid) {
                    this.showError(input, 'Ce champ doit contenir au moins 2 caractères');
                }
                break;
                
            case 'textarea':
                isValid = input.value.length >= 10;
                if (!isValid) {
                    this.showError(input, 'Votre message doit contenir au moins 10 caractères');
                }
                break;
        }
        
        input.classList.toggle(errorClass, !isValid);
        return isValid;
    }
    
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    validateForm() {
        let isValid = true;
        
        this.inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);
        
        // Animation de l'erreur
        gsap.from(errorDiv, {
            y: -10,
            opacity: 0,
            duration: 0.3
        });
    }
    
    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Animation du bouton
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
        
        try {
            // Simuler l'envoi du formulaire (à remplacer par votre logique d'envoi réelle)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Succès
            this.showSuccess();
            this.form.reset();
            
        } catch (error) {
            // Erreur
            this.showError(this.form, 'Une erreur est survenue. Veuillez réessayer.');
            
        } finally {
            // Restaurer le bouton
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Message envoyé avec succès !
        `;
        
        this.form.appendChild(successDiv);
        
        // Animation du message de succès
        gsap.from(successDiv, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "back.out"
        });
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            gsap.to(successDiv, {
                y: -20,
                opacity: 0,
                duration: 0.5,
                onComplete: () => successDiv.remove()
            });
        }, 5000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
}); 