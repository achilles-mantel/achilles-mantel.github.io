/**
 * Validator Class
 * 
 * Handles validation of time inputs and provides error messages.
 * Designed to be user-friendly for children while ensuring data integrity.
 */
class Validator {
    /**
     * Check if a time string is in a valid format
     * @param {string} timeStr - Time string to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    static isValidTimeFormat(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') {
            return false;
        }
        
        // Handle negative time values
        let timeToCheck = timeStr;
        if (timeStr.startsWith('-')) {
            timeToCheck = timeStr.substring(1);
        }
        
        // Regular expressions for different time formats
        const patterns = {
            // HH:MM:SS format (00:00:00 to 99:59:59)
            hhmmss: /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/,
            // MM:SS format (00:00 to 59:59)
            mmss: /^([0-5][0-9]):([0-5][0-9])$/,
            // SS format (0 to 59)
            ss: /^([0-5]?[0-9])$/
        };
        
        // Check if the time string matches any of the valid patterns
        const isValidFormat = patterns.hhmmss.test(timeToCheck) || 
                             patterns.mmss.test(timeToCheck) || 
                             patterns.ss.test(timeToCheck);
        
        // If the format is valid, check for extreme values
        if (isValidFormat) {
            const parts = timeToCheck.split(':');
            
            // Check for extreme values
            if (parts.length === 3) {
                // HH:MM:SS format - limit hours to reasonable value (0-999)
                const hours = parseInt(parts[0]);
                if (hours > 999) {
                    return false;
                }
            }
        }
        
        return isValidFormat;
    }
    
    /**
     * Check if a number input is valid for multiplication or division
     * @param {string|number} value - Value to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    static isValidNumber(value) {
        // Convert to number if it's a string
        const num = parseFloat(value);
        
        // Check if it's a valid number
        if (isNaN(num) || !isFinite(num)) {
            return false;
        }
        
        // Check for extreme values
        if (Math.abs(num) > 1000000) {
            return false; // Limit to reasonable values to prevent performance issues
        }
        
        return true;
    }
    
    /**
     * Get a user-friendly error message for invalid time format
     * @returns {string} - Error message
     */
    static getTimeFormatErrorMessage() {
        return "Oops! Please enter time like this: hours:minutes:seconds (for example, 01:30:45) or minutes:seconds (for example, 05:30) or just seconds (for example, 45). Hours should be less than 1000.";
    }
    
    /**
     * Get a user-friendly error message for invalid number
     * @returns {string} - Error message
     */
    static getNumberErrorMessage() {
        return "Oops! Please enter a valid number for multiplication or division. The number should be between -1,000,000 and 1,000,000.";
    }
    
    /**
     * Get a user-friendly error message for division by zero
     * @returns {string} - Error message
     */
    static getDivisionByZeroErrorMessage() {
        return "Oops! We can't divide by zero. Please try a different number.";
    }
    
    /**
     * Validate all inputs for a calculation
     * @param {string} time1 - First time value
     * @param {string} operation - Operation type
     * @param {string|number} time2OrFactor - Second time value or factor/divisor
     * @returns {Object} - Validation result {isValid, errorMessage}
     */
    static validateCalculationInputs(time1, operation, time2OrFactor) {
        // Validate first time input
        if (!this.isValidTimeFormat(time1)) {
            return {
                isValid: false,
                errorMessage: this.getTimeFormatErrorMessage()
            };
        }
        
        // For addition and subtraction, validate second time input
        if (operation === 'add' || operation === 'subtract') {
            if (!this.isValidTimeFormat(time2OrFactor)) {
                return {
                    isValid: false,
                    errorMessage: this.getTimeFormatErrorMessage()
                };
            }
        }
        
        // For multiplication and division, validate factor/divisor
        if (operation === 'multiply' || operation === 'divide') {
            if (!this.isValidNumber(time2OrFactor)) {
                return {
                    isValid: false,
                    errorMessage: this.getNumberErrorMessage()
                };
            }
            
            // Check for division by zero
            if (operation === 'divide' && parseFloat(time2OrFactor) === 0) {
                return {
                    isValid: false,
                    errorMessage: this.getDivisionByZeroErrorMessage()
                };
            }
        }
        
        // All validations passed
        return {
            isValid: true,
            errorMessage: null
        };
    }
}
