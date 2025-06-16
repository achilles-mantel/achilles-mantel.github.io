/**
 * History Manager
 * 
 * Manages the storage and retrieval of addition exercise history
 * using the browser's localStorage API.
 */
class HistoryManager {
    /**
     * Initialize the history manager
     */
    constructor() {
        this.storageKey = 'addition-exercise-history';
        this.maxHistoryItems = 100; // Limit to prevent storage bloat
    }
    
    /**
     * Save a question to history
     * @param {Object} question - Question object to save
     */
    saveQuestion(question) {
        try {
            const history = this.getHistory();
            
            // Add the new question with a timestamp
            const questionWithTimestamp = {
                ...question,
                timestamp: question.timestamp || new Date().toISOString(),
                viewed: true
            };
            
            history.unshift(questionWithTimestamp); // Add to beginning
            
            // Limit history size
            if (history.length > this.maxHistoryItems) {
                history.splice(this.maxHistoryItems);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(history));
        } catch (error) {
            console.warn('Failed to save question to history:', error);
            this.handleStorageError(error);
        }
    }
    
    /**
     * Get all history items
     * @returns {Array} - Array of question objects
     */
    getHistory() {
        try {
            const historyJson = localStorage.getItem(this.storageKey);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.warn('Failed to load history:', error);
            return [];
        }
    }
    
    /**
     * Clear all history
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.warn('Failed to clear history:', error);
        }
    }
    
    /**
     * Get history statistics
     * @returns {Object} - Statistics about the history
     */
    getHistoryStats() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            return {
                totalQuestions: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                accuracy: 0,
                averageScore: 0
            };
        }
        
        const correctAnswers = history.filter(q => q.isCorrect === true).length;
        const incorrectAnswers = history.filter(q => q.isCorrect === false).length;
        const totalAnswered = correctAnswers + incorrectAnswers;
        
        return {
            totalQuestions: history.length,
            correctAnswers,
            incorrectAnswers,
            accuracy: totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0,
            averageScore: totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 10) : 0
        };
    }
    
    /**
     * Get recent history (last N items)
     * @param {number} count - Number of recent items to get
     * @returns {Array} - Array of recent question objects
     */
    getRecentHistory(count = 10) {
        const history = this.getHistory();
        return history.slice(0, count);
    }
    
    /**
     * Handle storage errors
     * @param {Error} error - The storage error
     */
    handleStorageError(error) {
        if (error.name === 'QuotaExceededError') {
            // Storage quota exceeded, try to free up space
            console.warn('Storage quota exceeded. Clearing old history items.');
            this.clearOldHistory();
        } else if (error.name === 'SecurityError') {
            console.warn('Storage access denied. History will not be saved.');
        } else {
            console.warn('Unknown storage error:', error);
        }
    }
    
    /**
     * Clear old history items to free up space
     */
    clearOldHistory() {
        try {
            const history = this.getHistory();
            
            // Keep only the most recent 50 items
            const recentHistory = history.slice(0, 50);
            
            localStorage.setItem(this.storageKey, JSON.stringify(recentHistory));
            
            console.info(`Cleared old history. Kept ${recentHistory.length} recent items.`);
        } catch (error) {
            console.warn('Failed to clear old history:', error);
            // If we still can't save, clear all history
            this.clearHistory();
        }
    }
    
    /**
     * Check if localStorage is available
     * @returns {boolean} - True if localStorage is available
     */
    isStorageAvailable() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Export history as JSON string
     * @returns {string} - JSON string of history data
     */
    exportHistory() {
        const history = this.getHistory();
        const stats = this.getHistoryStats();
        
        const exportData = {
            exportDate: new Date().toISOString(),
            exerciseType: 'addition',
            statistics: stats,
            questions: history
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    /**
     * Import history from JSON string
     * @param {string} jsonString - JSON string containing history data
     * @returns {boolean} - True if import was successful
     */
    importHistory(jsonString) {
        try {
            const importData = JSON.parse(jsonString);
            
            // Validate the import data
            if (!importData.questions || !Array.isArray(importData.questions)) {
                throw new Error('Invalid import data format');
            }
            
            // Validate each question object
            const validQuestions = importData.questions.filter(q => 
                q.firstNumber !== undefined && 
                q.secondNumber !== undefined && 
                q.answer !== undefined
            );
            
            if (validQuestions.length === 0) {
                throw new Error('No valid questions found in import data');
            }
            
            // Save the imported history
            localStorage.setItem(this.storageKey, JSON.stringify(validQuestions));
            
            console.info(`Successfully imported ${validQuestions.length} questions`);
            return true;
            
        } catch (error) {
            console.warn('Failed to import history:', error);
            return false;
        }
    }
    
    /**
     * Get storage usage information
     * @returns {Object} - Storage usage information
     */
    getStorageInfo() {
        try {
            const historyData = localStorage.getItem(this.storageKey) || '';
            const sizeInBytes = new Blob([historyData]).size;
            const sizeInKB = Math.round(sizeInBytes / 1024 * 100) / 100;
            
            return {
                itemCount: this.getHistory().length,
                sizeInBytes,
                sizeInKB,
                storageAvailable: this.isStorageAvailable()
            };
        } catch (error) {
            return {
                itemCount: 0,
                sizeInBytes: 0,
                sizeInKB: 0,
                storageAvailable: false
            };
        }
    }
}
