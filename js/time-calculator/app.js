/**
 * Time Calculator - Main Application
 * 
 * This is the main entry point for the Time Calculator application.
 * It initializes the application and connects the UI with the calculator logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the calculator
    const calculator = new Calculator();
    
    // Initialize the UI controller
    const ui = new UI(calculator);
    
    // Initialize storage service
    const storage = new Storage();
    
    // Load any saved calculations
    const savedCalculations = storage.getCalculations();
    if (savedCalculations && savedCalculations.length > 0) {
        ui.displayHistory(savedCalculations);
    }
    
    // Set up event listeners
    ui.setupEventListeners();
});
