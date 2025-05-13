/**
 * Calculator Class
 * 
 * Handles all time calculation operations including:
 * - Addition
 * - Subtraction
 * - Multiplication
 * - Division
 * 
 * All times are internally represented in seconds for calculations.
 */
class Calculator {
    /**
     * Convert time string to seconds
     * @param {string} timeStr - Time in format HH:MM:SS, MM:SS, or SS
     * @returns {number} - Time in seconds
     */
    parseTimeToSeconds(timeStr) {
        // Validate input format
        if (!Validator.isValidTimeFormat(timeStr)) {
            throw new Error('Invalid time format. Please use HH:MM:SS, MM:SS, or SS format.');
        }
        
        const parts = timeStr.split(':');
        let seconds = 0;
        
        // Calculate seconds based on parts
        if (parts.length === 3) {
            // HH:MM:SS format
            seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) {
            // MM:SS format
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else {
            // SS format
            seconds = parseInt(parts[0]);
        }
        
        return seconds;
    }
    
    /**
     * Convert seconds to formatted time string
     * @param {number} seconds - Time in seconds
     * @returns {string} - Formatted time string (HH:MM:SS)
     */
    formatSecondsToTime(seconds) {
        // Handle negative times
        const isNegative = seconds < 0;
        seconds = Math.abs(seconds);
        
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        
        // Format with leading zeros
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        // Add negative sign if needed
        return `${isNegative ? '-' : ''}${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    
    /**
     * Add two time values
     * @param {string} time1 - First time value
     * @param {string} time2 - Second time value
     * @returns {string} - Result in HH:MM:SS format
     */
    add(time1, time2) {
        const seconds1 = this.parseTimeToSeconds(time1);
        const seconds2 = this.parseTimeToSeconds(time2);
        const resultSeconds = seconds1 + seconds2;
        return this.formatSecondsToTime(resultSeconds);
    }
    
    /**
     * Subtract second time from first time
     * @param {string} time1 - First time value
     * @param {string} time2 - Second time value
     * @returns {string} - Result in HH:MM:SS format
     */
    subtract(time1, time2) {
        const seconds1 = this.parseTimeToSeconds(time1);
        const seconds2 = this.parseTimeToSeconds(time2);
        const resultSeconds = seconds1 - seconds2;
        return this.formatSecondsToTime(resultSeconds);
    }
    
    /**
     * Multiply time by a factor
     * @param {string} time - Time value
     * @param {number} factor - Multiplication factor
     * @returns {string} - Result in HH:MM:SS format
     */
    multiply(time, factor) {
        if (isNaN(factor)) {
            throw new Error('Multiplication factor must be a number');
        }
        
        const seconds = this.parseTimeToSeconds(time);
        const resultSeconds = seconds * factor;
        return this.formatSecondsToTime(resultSeconds);
    }
    
    /**
     * Divide time by a divisor
     * @param {string} time - Time value
     * @param {number} divisor - Division factor
     * @returns {string} - Result in HH:MM:SS format
     */
    divide(time, divisor) {
        if (isNaN(divisor)) {
            throw new Error('Division factor must be a number');
        }
        
        if (divisor === 0) {
            throw new Error('Cannot divide by zero');
        }
        
        const seconds = this.parseTimeToSeconds(time);
        const resultSeconds = seconds / divisor;
        return this.formatSecondsToTime(resultSeconds);
    }
    
    /**
     * Perform calculation based on operation type
     * @param {string} time1 - First time value
     * @param {string} operation - Operation type (add, subtract, multiply, divide)
     * @param {string|number} time2OrFactor - Second time value or factor/divisor
     * @returns {string} - Result in HH:MM:SS format
     */
    calculate(time1, operation, time2OrFactor) {
        switch (operation) {
            case 'add':
                return this.add(time1, time2OrFactor);
            case 'subtract':
                return this.subtract(time1, time2OrFactor);
            case 'multiply':
                return this.multiply(time1, parseFloat(time2OrFactor));
            case 'divide':
                return this.divide(time1, parseFloat(time2OrFactor));
            default:
                throw new Error('Invalid operation. Supported operations: add, subtract, multiply, divide');
        }
    }
}
