// Modern JavaScript with optimized code using ES6+ features
class ReverseStringApp {
    constructor() {
        this.elements = {
            textInput: document.getElementById('textInput'),
            reverseBtn: document.getElementById('reverseBtn'),
            reverseBtnContainer: document.getElementById('reverseBtnContainer'),
            resultContainer: document.getElementById('resultContainer'),
            copyBtn: document.getElementById('copyBtn')
        };
        
        this.currentResult = '';
        this.minLength = 4;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        // Ensure button starts hidden using !important to override Bootstrap's .d-grid
        this.elements.reverseBtnContainer.style.setProperty('display', 'none', 'important');
        // Apply display: block !important to Copy button to match Reverse button behavior
        this.elements.copyBtn.parentElement.style.setProperty('display', 'block', 'important');
        this.updateUI();
    }
    
    bindEvents() {
        // Real-time input handling with debouncing
        this.elements.textInput.addEventListener('input', 
            this.debounce(() => this.handleInput(), 150)
        );
        
        this.elements.reverseBtn.addEventListener('click', () => this.reverseText());
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        
        // Enter key support
        this.elements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.shouldShowButton()) {
                this.reverseText();
            }
        });
    }
    
    handleInput() {
        this.updateUI();
        // Only reverse text if we have enough characters, but don't affect button visibility
        if (this.shouldShowButton()) {
            this.reverseText();
        } else {
            // Clear result when not enough characters
            this.elements.resultContainer.innerHTML = 
                `<span class="text-muted">Type at least ${this.minLength} characters to see the reverse...</span>`;
            this.elements.copyBtn.disabled = true;
            this.elements.copyBtn.className = 'btn btn-outline-secondary copy-btn';
            this.elements.copyBtn.innerHTML = 'Copy Result <i class="bi bi-clipboard ms-2"></i>';
        }
    }
    
    shouldShowButton() {
        return this.elements.textInput.value.trim().length >= this.minLength;
    }
    
    updateUI() {
        const hasEnoughText = this.shouldShowButton();
        
        // Toggle button visibility using !important to override Bootstrap's .d-grid
        this.elements.reverseBtnContainer.style.setProperty('display', hasEnoughText ? 'block' : 'none', 'important');
        
        // Debug logging (remove in production)
        console.log(`Input length: ${this.elements.textInput.value.trim().length}, Min length: ${this.minLength}, Show button: ${hasEnoughText}`);
    }
    
    reverseText() {
        const inputText = this.elements.textInput.value.trim();
        if (inputText.length < this.minLength) return;
        
        this.currentResult = [...inputText].reverse().join('');
        this.elements.resultContainer.innerHTML = `<span class="fw-semibold">${this.currentResult}</span>`;
        
        // Enable copy button
        this.elements.copyBtn.disabled = false;
        this.elements.copyBtn.className = 'btn btn-success copy-btn';
        this.elements.copyBtn.innerHTML = 'Copy Result <i class="bi bi-clipboard ms-2"></i>';
    }
    
    async copyToClipboard() {
        if (!this.currentResult || this.elements.copyBtn.disabled) return;
        
        try {
            await navigator.clipboard.writeText(this.currentResult);
            this.showCopySuccess();
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopy();
        }
    }
    
    fallbackCopy() {
        const textArea = document.createElement('textarea');
        textArea.value = this.currentResult;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showCopySuccess();
    }
    
    showCopySuccess() {
        this.elements.copyBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Copied!';
        this.elements.copyBtn.className = 'btn btn-outline-success copy-btn';
        
        setTimeout(() => {
            this.elements.copyBtn.innerHTML = 'Copy Result <i class="bi bi-clipboard ms-2"></i>';
            this.elements.copyBtn.className = 'btn btn-success copy-btn';
        }, 2000);
    }
    
    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new ReverseStringApp());