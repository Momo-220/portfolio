class AIAssistant {
    constructor() {
        // Initialisation des éléments DOM
        this.container = document.querySelector('.ai-assistant-container');
        this.chatbox = document.querySelector('.ai-chatbox');
        this.input = document.querySelector('.ai-input');
        this.sendButton = document.querySelector('.ai-send-button');
        this.toggleButton = document.querySelector('.ai-toggle-button');
        
        // Vérification de l'existence des éléments
        if (!this.container || !this.chatbox || !this.input || !this.sendButton || !this.toggleButton) {
            console.error('Éléments du chat bot manquants');
            return;
        }
        
        this.messages = [];
        this.isMinimized = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    setupEventListeners() {
        // Gestion de l'envoi des messages
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Gestion du bouton de basculement
        this.toggleButton.addEventListener('click', () => {
            this.isMinimized = !this.isMinimized;
            this.container.classList.toggle('ai-minimized', this.isMinimized);
            if (!this.isMinimized) {
                this.input.focus();
                this.chatbox.scrollTop = this.chatbox.scrollHeight;
            }
        });
    }

    addWelcomeMessage() {
        const welcomeMessages = {
            fr: [
                "Bonjour ! Je suis votre assistant virtuel. Comment puis-je vous aider ?",
                "Je peux vous renseigner sur mes services, mon expérience, ou mes projets.",
                "N'hésitez pas à me poser des questions !"
            ],
            en: [
                "Hello! I'm your virtual assistant. How can I help you?",
                "I can tell you about my services, experience, or projects.",
                "Feel free to ask me any questions!"
            ]
        };

        const currentLang = document.documentElement.lang || 'fr';
        const messages = welcomeMessages[currentLang] || welcomeMessages.fr;

        messages.forEach((message, index) => {
        setTimeout(() => {
                this.addMessage('assistant', message);
            }, index * 1000);
        });
    }

    handleSend() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        this.input.value = '';
        this.processMessage(message);
    }

    addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('ai-message', `ai-${sender}-message`);
        
        const contentElement = document.createElement('div');
        contentElement.classList.add('ai-message-content');
        contentElement.textContent = text;
        
        messageElement.appendChild(contentElement);
        this.chatbox.appendChild(messageElement);
        
        // Animation fluide du défilement
        this.chatbox.scrollTo({
            top: this.chatbox.scrollHeight,
            behavior: 'smooth'
        });
        
        this.messages.push({ sender, text });
    }

    processMessage(message) {
        // Afficher l'indicateur de frappe
        const typingElement = document.createElement('div');
        typingElement.classList.add('ai-message', 'ai-assistant-message', 'ai-typing');
        typingElement.textContent = '...';
        this.chatbox.appendChild(typingElement);

        // Réponses prédéfinies basées sur la langue actuelle
        const responses = {
            fr: {
                'bonjour': 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
                'salut': 'Salut ! Je suis là pour répondre à vos questions.',
                'projet': 'Je serais ravi de vous parler de mes projets. Lequel vous intéresse en particulier ?',
                'contact': 'Vous pouvez me contacter par email à personelmomo1@gmail.com ou par téléphone au +90 555 078 11 18.',
                'expérience': 'J\'ai plus de 2 ans d\'expérience en développement web, spécialisé en React, Node.js et technologies modernes.',
                'compétences': 'Mes principales compétences incluent : React, Node.js, JavaScript, Python, et l\'intégration d\'IA.',
                'formation': 'J\'ai une formation approfondie en développement web et continue à me former sur les dernières technologies.',
                'disponibilité': 'Je suis actuellement disponible pour de nouveaux projets et collaborations.',
                'tarif': 'Mes tarifs varient selon les projets. Je peux vous faire un devis personnalisé.',
                'merci': 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.',
                'au revoir': 'Au revoir ! N\'hésitez pas à revenir si vous avez d\'autres questions.',
                'default': 'Je comprends votre question. Pourriez-vous me donner plus de détails pour que je puisse mieux vous aider ?'
            },
            en: {
                'hello': 'Hello! How can I help you today?',
                'hi': 'Hi! I\'m here to answer your questions.',
                'project': 'I\'d love to tell you about my projects. Which one interests you?',
                'contact': 'You can contact me via email at personelmomo1@gmail.com or phone at +90 555 078 11 18.',
                'experience': 'I have over 2 years of experience in web development, specialized in React, Node.js and modern technologies.',
                'skills': 'My main skills include: React, Node.js, JavaScript, Python, and AI integration.',
                'education': 'I have extensive training in web development and continue to learn about the latest technologies.',
                'availability': 'I am currently available for new projects and collaborations.',
                'pricing': 'My rates vary by project. I can provide you with a personalized quote.',
                'thanks': 'You\'re welcome! Don\'t hesitate if you have any other questions.',
                'goodbye': 'Goodbye! Feel free to come back if you have more questions.',
                'default': 'I understand your question. Could you provide more details so I can better assist you?'
            }
        };

        const currentLang = document.documentElement.lang || 'fr';
        const currentResponses = responses[currentLang] || responses.fr;

        // Simuler un délai de réponse naturel
        setTimeout(() => {
            this.chatbox.removeChild(typingElement);
            
            // Trouver la réponse appropriée
            let response = currentResponses.default;
            const messageLower = message.toLowerCase();
            
            for (let keyword in currentResponses) {
                if (messageLower.includes(keyword)) {
                    response = currentResponses[keyword];
                    break;
                }
            }
            
            this.addMessage('assistant', response);
        }, Math.random() * 500 + 1000); // Délai aléatoire entre 1 et 1.5 secondes
    }
}

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.aiAssistant = new AIAssistant();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du chat bot:', error);
    }
}); 