/**
 * Formatter Class
 * 
 * Handles formatting of time values for display.
 * Provides different formatting options based on context.
 */
class Formatter {
    /**
     * Format time for display with appropriate units
     * @param {string} timeStr - Time string in HH:MM:SS format
     * @returns {string} - Formatted time with units (e.g., "2 hours 30 minutes 15 seconds")
     */
    static formatTimeWithUnits(timeStr) {
        const parts = timeStr.split(':');
        const isNegative = timeStr.startsWith('-');
        
        // Remove negative sign for processing
        if (isNegative) {
            parts[0] = parts[0].substring(1);
        }
        
        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);
        let seconds = parseInt(parts[2]);
        
        let result = [];
        
        // Add hours if non-zero
        if (hours > 0) {
            result.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
        }
        
        // Add minutes if non-zero
        if (minutes > 0) {
            result.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
        }
        
        // Add seconds if non-zero or if result is empty
        if (seconds > 0 || result.length === 0) {
            result.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
        }
        
        // Join with commas and 'and' for the last part
        let formattedTime = '';
        if (result.length === 1) {
            formattedTime = result[0];
        } else if (result.length === 2) {
            formattedTime = `${result[0]} and ${result[1]}`;
        } else {
            formattedTime = `${result.slice(0, -1).join(', ')} and ${result[result.length - 1]}`;
        }
        
        // Add negative indicator if needed
        return isNegative ? `negative ${formattedTime}` : formattedTime;
    }
    
    /**
     * Format time for child-friendly display
     * @param {string} timeStr - Time string in HH:MM:SS format
     * @returns {string} - Child-friendly formatted time
     */
    static formatTimeForChildren(timeStr) {
        const formattedTime = this.formatTimeWithUnits(timeStr);
        
        // Add emoji based on time magnitude
        // Calculate seconds without using Calculator class to avoid circular dependency
        const parts = timeStr.split(':');
        let totalSeconds = 0;
        
        // Handle negative times
        const isNegative = timeStr.startsWith('-');
        const firstPart = isNegative ? parts[0].substring(1) : parts[0];
        
        if (parts.length === 3) {
            // HH:MM:SS format
            totalSeconds = parseInt(firstPart) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) {
            // MM:SS format
            totalSeconds = parseInt(firstPart) * 60 + parseInt(parts[1]);
        } else {
            // SS format
            totalSeconds = parseInt(firstPart);
        }
        
        if (isNegative) {
            totalSeconds = -totalSeconds;
        }
        
        const absSeconds = Math.abs(totalSeconds);
        
        let emoji = '';
        if (absSeconds < 60) {
            emoji = '⏱️'; // Stopwatch for short times
        } else if (absSeconds < 3600) {
            emoji = '🕒'; // Clock for medium times
        } else {
            emoji = '⏰'; // Alarm clock for long times
        }
        
        return `${emoji} ${formattedTime}`;
    }
    
    /**
     * Format calculation for display in history
     * @param {Object} calculation - Calculation object
     * @returns {string} - Formatted calculation string
     */
    static formatCalculationForHistory(calculation) {
        const { firstValue, operation, secondValue, result } = calculation;
        
        let operationSymbol = '';
        switch (operation) {
            case 'add':
                operationSymbol = '+';
                break;
            case 'subtract':
                operationSymbol = '-';
                break;
            case 'multiply':
                operationSymbol = '×';
                break;
            case 'divide':
                operationSymbol = '÷';
                break;
        }
        
        return `${firstValue} ${operationSymbol} ${secondValue} = ${result}`;
    }
    
    /**
     * Format date and time for calculation timestamp
     * @param {Date} date - Date object
     * @returns {string} - Formatted date and time string
     */
    static formatTimestamp(date) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        
        return date.toLocaleDateString(undefined, options);
    }
}
