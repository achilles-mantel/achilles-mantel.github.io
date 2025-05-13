/**
 * Storage Class
 * 
 * Handles saving and retrieving calculation history from local storage.
 * Provides methods for managing stored calculations.
 */
class Storage {
    constructor() {
        this.storageKey = 'timeCalculatorHistory';
        this.maxHistoryItems = 50; // Maximum number of history items to store
        this.storageAvailable = this.isStorageAvailable();
        
        // Show warning if storage is not available
        if (!this.storageAvailable) {
            console.warn('Local storage is not available. Calculation history will not be saved.');
        }
    }
    
    /**
     * Save a calculation to local storage
     * @param {Object} calculation - Calculation object to save
     * @returns {Object} - Saved calculation with ID and timestamp
     */
    saveCalculation(calculation) {
        // If storage is not available, just return the calculation with ID and timestamp
        if (!this.storageAvailable) {
            return {
                ...calculation,
                id: this.generateId(),
                timestamp: new Date().toISOString()
            };
        }
        
        // Get existing calculations
        const calculations = this.getCalculations() || [];
        
        // Add new calculation with timestamp and ID
        const newCalculation = {
            ...calculation,
            id: this.generateId(),
            timestamp: new Date().toISOString()
        };
        
        // Add to beginning of array (most recent first)
        calculations.unshift(newCalculation);
        
        // Limit the number of stored calculations
        if (calculations.length > this.maxHistoryItems) {
            calculations.pop(); // Remove oldest calculation
        }
        
        // Save to local storage
        this.saveToLocalStorage(calculations);
        
        return newCalculation;
    }
    
    /**
     * Get all saved calculations
     * @returns {Array} - Array of calculation objects or empty array if storage is not available
     */
    getCalculations() {
        if (!this.storageAvailable) {
            return [];
        }
        
        try {
            const calculationsJson = localStorage.getItem(this.storageKey);
            return calculationsJson ? JSON.parse(calculationsJson) : [];
        } catch (error) {
            console.error('Error retrieving calculations from local storage:', error);
            return [];
        }
    }
    
    /**
     * Clear all saved calculations
     * @returns {boolean} - True if successful, false otherwise
     */
    clearCalculations() {
        if (!this.storageAvailable) {
            return false;
        }
        
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing calculations from local storage:', error);
            return false;
        }
    }
    
    /**
     * Delete a specific calculation by ID
     * @param {string} id - ID of calculation to delete
     * @returns {boolean} - True if deletion was successful
     */
    deleteCalculation(id) {
        if (!this.storageAvailable) {
            return false;
        }
        
        try {
            const calculations = this.getCalculations();
            const initialLength = calculations.length;
            
            const filteredCalculations = calculations.filter(calc => calc.id !== id);
            
            if (filteredCalculations.length !== initialLength) {
                this.saveToLocalStorage(filteredCalculations);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error deleting calculation from local storage:', error);
            return false;
        }
    }
    
    /**
     * Save calculations array to local storage
     * @param {Array} calculations - Array of calculation objects
     * @returns {boolean} - True if successful, false otherwise
     */
    saveToLocalStorage(calculations) {
        if (!this.storageAvailable) {
            return false;
        }
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(calculations));
            return true;
        } catch (error) {
            console.error('Error saving to local storage:', error);
            
            // Check if the error is due to quota exceeded
            if (error.name === 'QuotaExceededError' || 
                error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || 
                error.name === 'QUOTA_EXCEEDED_ERR') {
                console.warn('Local storage quota exceeded. Trying to free up space...');
                
                // Try to free up space by removing oldest items
                this.freeUpStorageSpace();
                
                // Try saving again with fewer items
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify(calculations.slice(0, Math.floor(calculations.length / 2))));
                    return true;
                } catch (retryError) {
                    console.error('Still unable to save to local storage after freeing space:', retryError);
                    return false;
                }
            }
            
            return false;
        }
    }
    
    /**
     * Attempt to free up local storage space by removing oldest calculations
     */
    freeUpStorageSpace() {
        try {
            const calculations = this.getCalculations();
            
            // If we have more than 10 items, keep only the 5 most recent
            if (calculations.length > 10) {
                this.saveToLocalStorage(calculations.slice(0, 5));
            } else {
                // Otherwise just clear everything
                this.clearCalculations();
            }
        } catch (error) {
            console.error('Error while trying to free up storage space:', error);
        }
    }
    
    /**
     * Generate a unique ID for a calculation
     * @returns {string} - Unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    /**
     * Check if local storage is available
     * @returns {boolean} - True if local storage is available
     */
    isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }
}
