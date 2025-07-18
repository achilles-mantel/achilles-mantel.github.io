/**
 * Subtraction Exercise Application
 * 
 * Main application file that initializes and coordinates all components
 * for the subtraction exercise feature.
 */

// Global variables to hold our application components
let generator;
let historyManager;
let soundManager;
let uiController;

/**
 * Initialize the application when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all components
        initializeApplication();
        
        // Set up global error handling
        setupErrorHandling();
        
        console.log('Subtraction Exercise application initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize Subtraction Exercise application:', error);
        showErrorMessage('Failed to load the application. Please refresh the page and try again.');
    }
});

/**
 * Initialize all application components
 */
function initializeApplication() {
    // Initialize the question generator
    generator = new Generator();
    
    // Initialize the history manager
    historyManager = new HistoryManager();
    
    // Initialize the sound manager
    soundManager = new SoundManager();
    
    // Initialize the UI controller (this coordinates everything)
    uiController = new UIController(generator, historyManager, soundManager);
    
    // Set up additional event listeners
    setupAdditionalEventListeners();
    
    // Preload sounds for better mobile experience
    soundManager.preloadSounds();
}

/**
 * Set up additional event listeners for the application
 */
function setupAdditionalEventListeners() {
    // Handle page visibility changes (pause sounds when page is hidden)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause any playing sounds
            soundManager.cleanup();
        }
    });
    
    // Handle beforeunload to clean up resources
    window.addEventListener('beforeunload', function() {
        if (soundManager) {
            soundManager.cleanup();
        }
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        // Only handle shortcuts when not typing in an input field
        if (event.target.tagName.toLowerCase() === 'input') {
            return;
        }
        
        switch(event.key) {
            case 'g':
            case 'G':
                // Generate new questions
                if (uiController) {
                    event.preventDefault();
                    document.getElementById('generate-btn').click();
                }
                break;
                
            case 'ArrowLeft':
                // Previous question
                if (uiController) {
                    event.preventDefault();
                    document.getElementById('prev-btn').click();
                }
                break;
                
            case 'ArrowRight':
                // Next question
                if (uiController) {
                    event.preventDefault();
                    document.getElementById('next-btn').click();
                }
                break;
        }
    });
}

/**
 * Set up global error handling
 */
function setupErrorHandling() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', function(event) {
        console.error('Uncaught error in Subtraction Exercise:', event.error);
        
        // Don't show error messages for minor issues
        if (event.error && event.error.name !== 'NetworkError') {
            showErrorMessage('An unexpected error occurred. The application may not work correctly.');
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection in Subtraction Exercise:', event.reason);
        
        // Prevent the default browser behavior (logging to console)
        event.preventDefault();
    });
}

/**
 * Show an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    // Create a simple error display
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f8d7da;
        color: #721c24;
        padding: 15px 20px;
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        z-index: 1000;
        max-width: 90%;
        text-align: center;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    errorDiv.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        color: #721c24;
        cursor: pointer;
        margin-left: 10px;
        padding: 0;
        line-height: 1;
    `;
    
    closeButton.addEventListener('click', function() {
        document.body.removeChild(errorDiv);
    });
    
    errorDiv.appendChild(closeButton);
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(function() {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 10000);
}

/**
 * Get application status information (useful for debugging)
 * @returns {Object} - Application status information
 */
function getApplicationStatus() {
    return {
        initialized: !!(generator && historyManager && soundManager && uiController),
        components: {
            generator: !!generator,
            historyManager: !!historyManager,
            soundManager: !!soundManager,
            uiController: !!uiController
        },
        soundInfo: soundManager ? soundManager.getSoundInfo() : null,
        storageInfo: historyManager ? historyManager.getStorageInfo() : null,
        currentQuestion: generator ? generator.getCurrentQuestionNumber() : 0,
        totalQuestions: generator ? generator.getTotalQuestions() : 0
    };
}

/**
 * Restart the application (useful for error recovery)
 */
function restartApplication() {
    try {
        // Clean up existing components
        if (soundManager) {
            soundManager.cleanup();
        }
        
        // Clear global variables
        generator = null;
        historyManager = null;
        soundManager = null;
        uiController = null;
        
        // Reinitialize
        initializeApplication();
        
        console.log('Subtraction Exercise application restarted successfully');
        
    } catch (error) {
        console.error('Failed to restart Subtraction Exercise application:', error);
        showErrorMessage('Failed to restart the application. Please refresh the page.');
    }
}

// Make some functions available globally for debugging
window.subtractionExercise = {
    getStatus: getApplicationStatus,
    restart: restartApplication,
    components: {
        get generator() { return generator; },
        get historyManager() { return historyManager; },
        get soundManager() { return soundManager; },
        get uiController() { return uiController; }
    }
};
