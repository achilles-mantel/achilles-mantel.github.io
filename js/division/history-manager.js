/**
 * History Manager
 * 
 * Manages the history of division questions and answers.
 * Saves and retrieves history from local storage.
 */
class HistoryManager {
    /**
     * Initialize the history manager
     */
    constructor() {
        this.storageKey = 'divisionExerciseHistory';
        this.maxHistoryItems = 50; // Maximum number of history items to store
        this.storageAvailable = this.isStorageAvailable();
    }
    
    /**
     * Check if local storage is available
     * @returns {boolean} - True if available, false otherwise
     */
    isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('Local storage is not available. History will not be saved.');
            return false;
        }
    }
    
    /**
     * Save a question to history
     * @param {Object} question - Question object to save
     * @returns {boolean} - True if saved successfully
     */
    saveToHistory(question) {
        if (!this.storageAvailable) {
            return false;
        }
        
        try {
            // Get existing history
            const history = this.getHistory();
            
            // Add new question to the beginning of the array
            history.unshift({
                ...question,
                viewed: true // Mark as viewed
            });
            
            // Limit the number of stored items
            if (history.length > this.maxHistoryItems) {
                history.pop(); // Remove the oldest item
            }
            
            // Save to local storage
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error('Error saving to history:', error);
            
            // Try to free up space if quota exceeded
            if (this.isQuotaExceededError(error)) {
                this.freeUpStorageSpace();
            }
            
            return false;
        }
    }
    
    /**
     * Get the question history
     * @returns {Array} - Array of question objects
     */
    getHistory() {
        if (!this.storageAvailable) {
            return [];
        }
        
        try {
            const historyJson = localStorage.getItem(this.storageKey);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.error('Error retrieving history:', error);
            return [];
        }
    }
    
    /**
     * Clear the question history
     * @returns {boolean} - True if cleared successfully
     */
    clearHistory() {
        if (!this.storageAvailable) {
            return false;
        }
        
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing history:', error);
            return false;
        }
    }
    
    /**
     * Save a set of questions to history
     * @param {Array} questions - Array of question objects
     * @returns {boolean} - True if saved successfully
     */
    saveQuestionSet(questions) {
        if (!this.storageAvailable || !questions || questions.length === 0) {
            return false;
        }
        
        let success = true;
        
        // Save each question to history
        questions.forEach(question => {
            if (!this.saveToHistory(question)) {
                success = false;
            }
        });
        
        return success;
    }
    
    /**
     * Check if an error is a quota exceeded error
     * @param {Error} error - Error object
     * @returns {boolean} - True if it's a quota exceeded error
     */
    isQuotaExceededError(error) {
        return (
            error.name === 'QuotaExceededError' ||
            error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
            error.name === 'QUOTA_EXCEEDED_ERR' ||
            error.code === 22 ||
            error.code === 1014
        );
    }
    
    /**
     * Free up storage space by removing older items
     */
    freeUpStorageSpace() {
        try {
            const history = this.getHistory();
            
            // Keep only half of the most recent items
            if (history.length > 10) {
                const reducedHistory = history.slice(0, Math.floor(history.length / 2));
                localStorage.setItem(this.storageKey, JSON.stringify(reducedHistory));
            } else {
                // If we have very few items, just clear everything
                this.clearHistory();
            }
        } catch (error) {
            console.error('Error freeing up storage space:', error);
            // Last resort: try to clear everything
            try {
                this.clearHistory();
            } catch (e) {
                // Nothing more we can do
            }
        }
    }
    
    /**
     * Format a timestamp for display
     * @param {string} timestamp - ISO timestamp string
     * @returns {string} - Formatted date and time
     */
    formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Unknown date';
        }
    }
}
