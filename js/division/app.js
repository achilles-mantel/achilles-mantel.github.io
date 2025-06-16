/**
 * Division Exercise Application
 * 
 * Main entry point for the Integer Division Exercise application.
 * Initializes all components and sets up the application.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    const generator = new Generator();
    const historyManager = new HistoryManager();
    const soundManager = new SoundManager();
    const uiController = new UIController(generator, historyManager, soundManager);
    
    // Set up event listeners
    uiController.setupEventListeners();
    
    // Load history and update display
    uiController.updateHistoryDisplay();
    
    console.log('Division Exercise Application initialized');
});
