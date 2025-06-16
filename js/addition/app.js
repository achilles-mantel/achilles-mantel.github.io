/**
 * Addition Exercise Application
 * 
 * Main entry point for the Integer Addition Exercise application.
 * Initializes all components and sets up the application.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create assets directory if needed
    createAssetsDirectoryIfNeeded();
    
    // Initialize components
    const generator = new Generator();
    const historyManager = new HistoryManager();
    const soundManager = new SoundManager();
    const uiController = new UIController(generator, historyManager, soundManager);
    
    // Set up event listeners
    uiController.setupEventListeners();
    
    // Create placeholder audio elements if needed
    soundManager.createPlaceholderAudioElements();
    
    // Load history and update display
    uiController.updateHistoryDisplay();
    
    console.log('Addition Exercise Application initialized');
});

/**
 * Create assets directory for sounds if it doesn't exist
 * This is a helper function that would typically be done during app setup
 */
function createAssetsDirectoryIfNeeded() {
    // In a real application, this would be done server-side or during build
    // For this client-side application, we'll just check if the audio elements exist
    
    const audioElements = [
        document.getElementById('generate-sound'),
        document.getElementById('correct-sound'),
        document.getElementById('button-click')
    ];
    
    // If any audio element is missing, log a warning
    if (audioElements.some(element => !element)) {
        console.warn('Some audio elements are missing. Sound effects may not work properly.');
        console.info('In a production environment, ensure the assets/sounds directory exists with the required sound files.');
    }
}
