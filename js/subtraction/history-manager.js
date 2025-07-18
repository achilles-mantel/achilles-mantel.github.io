/**
 * History Manager
 * 
 * Manages saving and retrieving exercise history using localStorage.
 * Handles storage errors and provides fallback functionality.
 */
class HistoryManager {
    /**
     * Initialize the history manager
     */
    constructor() {
        this.storageKey = 'subtraction-exercise-history';
        this.maxHistoryItems = 50; // Limit history to prevent storage bloat
    }
    
    /**
     * Save an exercise to history
     * @param {Object} exerciseData - The exercise data to save
     */
    saveExercise(exerciseData) {
        try {
            let history = this.getHistory();
            
            // Add new exercise to the beginning of the array
            history.unshift(exerciseData);
            
            // Limit history size
            if (history.length > this.maxHistoryItems) {
                history = history.slice(0, this.maxHistoryItems);
            }
            
            // Save to localStorage
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            
        } catch (error) {
            console.warn('Failed to save exercise to history:', error);
            
            // If storage is full, try to clear some space
            if (error.name === 'QuotaExceededError') {
                this.clearOldHistory();
                // Try saving again with reduced history
                try {
                    let history = this.getHistory();
                    history.unshift(exerciseData);
                    history = history.slice(0, Math.floor(this.maxHistoryItems / 2));
                    localStorage.setItem(this.storageKey, JSON.stringify(history));
                } catch (retryError) {
                    console.error('Failed to save exercise even after clearing history:', retryError);
                }
            }
        }
    }
    
    /**
     * Get exercise history from localStorage
     * @returns {Array} - Array of exercise history objects
     */
    getHistory() {
        try {
            const historyJson = localStorage.getItem(this.storageKey);
            if (!historyJson) {
                return [];
            }
            
            const history = JSON.parse(historyJson);
            
            // Validate that it's an array
            if (!Array.isArray(history)) {
                console.warn('Invalid history format, resetting history');
                this.clearHistory();
                return [];
            }
            
            return history;
            
        } catch (error) {
            console.warn('Failed to load exercise history:', error);
            return [];
        }
    }
    
    /**
     * Clear all exercise history
     */
    clearHistory() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.warn('Failed to clear exercise history:', error);
        }
    }
    
    /**
     * Clear old history items to free up space
     */
    clearOldHistory() {
        try {
            let history = this.getHistory();
            
            // Keep only the most recent 25% of items
            const keepCount = Math.floor(this.maxHistoryItems * 0.25);
            history = history.slice(0, keepCount);
            
            localStorage.setItem(this.storageKey, JSON.stringify(history));
            
        } catch (error) {
            console.warn('Failed to clear old history:', error);
            // If we can't even do this, clear everything
            this.clearHistory();
        }
    }
    
    /**
     * Get the total number of exercises completed
     * @returns {number} - Total number of exercises in history
     */
    getTotalExercisesCompleted() {
        return this.getHistory().length;
    }
    
    /**
     * Get statistics about exercise performance
     * @returns {Object} - Statistics object with averages and totals
     */
    getStatistics() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            return {
                totalExercises: 0,
                averageScore: 0,
                bestScore: 0,
                totalQuestionsAnswered: 0,
                totalCorrectAnswers: 0
            };
        }
        
        let totalScore = 0;
        let bestScore = 0;
        let totalQuestions = 0;
        let totalCorrect = 0;
        
        history.forEach(exercise => {
            totalScore += exercise.score;
            totalQuestions += exercise.totalQuestions;
            totalCorrect += exercise.score;
            
            if (exercise.score > bestScore) {
                bestScore = exercise.score;
            }
        });
        
        return {
            totalExercises: history.length,
            averageScore: Math.round((totalScore / history.length) * 10) / 10,
            bestScore: bestScore,
            totalQuestionsAnswered: totalQuestions,
            totalCorrectAnswers: totalCorrect,
            accuracyPercentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
        };
    }
    
    /**
     * Get recent exercise performance (last 10 exercises)
     * @returns {Array} - Array of recent exercise scores
     */
    getRecentPerformance() {
        const history = this.getHistory();
        return history.slice(0, 10).map(exercise => ({
            timestamp: exercise.timestamp,
            score: exercise.score,
            totalQuestions: exercise.totalQuestions,
            percentage: Math.round((exercise.score / exercise.totalQuestions) * 100)
        }));
    }
    
    /**
     * Check if localStorage is available
     * @returns {boolean} - True if localStorage is available
     */
    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Get storage usage information
     * @returns {Object} - Storage usage information
     */
    getStorageInfo() {
        if (!this.isStorageAvailable()) {
            return {
                available: false,
                message: 'localStorage is not available'
            };
        }
        
        try {
            const historyData = localStorage.getItem(this.storageKey);
            const dataSize = historyData ? historyData.length : 0;
            const historyCount = this.getHistory().length;
            
            return {
                available: true,
                historyCount: historyCount,
                dataSize: dataSize,
                maxItems: this.maxHistoryItems
            };
        } catch (error) {
            return {
                available: false,
                message: 'Error accessing localStorage: ' + error.message
            };
        }
    }
}
