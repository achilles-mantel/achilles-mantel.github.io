/**
 * UI Class
 * 
 * Handles all user interface interactions and display updates.
 * Connects user actions with the calculator logic.
 */
class UI {
    /**
     * Initialize UI with calculator instance
     * @param {Calculator} calculator - Calculator instance
     */
    constructor(calculator) {
        this.calculator = calculator;
        this.storage = new Storage();
        this.currentOperation = 'add'; // Default operation
        
        // Store references to DOM elements
        this.elements = {
            timeInput1: document.getElementById('time-input-1'),
            timeInput2: document.getElementById('time-input-2'),
            operationButtons: document.querySelectorAll('.operation-btn'),
            calculateButton: document.getElementById('calculate-btn'),
            resultDisplay: document.getElementById('result-display'),
            resultText: document.getElementById('result-text'),
            resultFormatted: document.getElementById('result-formatted'),
            errorMessage: document.getElementById('error-message'),
            historyContainer: document.getElementById('history-container'),
            historyList: document.getElementById('history-list'),
            clearHistoryBtn: document.getElementById('clear-history-btn'),
            secondInputLabel: document.getElementById('second-input-label')
        };
    }
    
    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Operation button clicks
        this.elements.operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.setOperation(button.dataset.operation);
            });
        });
        
        // Calculate button click
        this.elements.calculateButton.addEventListener('click', () => {
            this.performCalculation();
        });
        
        // Enter key in input fields
        this.elements.timeInput1.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performCalculation();
        });
        
        this.elements.timeInput2.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performCalculation();
        });
        
        // Clear history button
        if (this.elements.clearHistoryBtn) {
            this.elements.clearHistoryBtn.addEventListener('click', () => {
                this.clearHistory();
            });
        }
    }
    
    /**
     * Set the current operation
     * @param {string} operation - Operation type (add, subtract, multiply, divide)
     */
    setOperation(operation) {
        // Update current operation
        this.currentOperation = operation;
        
        // Update UI to reflect selected operation
        this.elements.operationButtons.forEach(button => {
            if (button.dataset.operation === operation) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });
        
        // Update second input label based on operation
        if (operation === 'multiply' || operation === 'divide') {
            this.elements.secondInputLabel.textContent = 'Number:';
            this.elements.timeInput2.placeholder = 'Enter a number';
        } else {
            this.elements.secondInputLabel.textContent = 'Time 2:';
            this.elements.timeInput2.placeholder = 'HH:MM:SS';
        }
        
        // Clear any previous error messages
        this.showError('');
    }
    
    /**
     * Perform the calculation and update the UI
     */
    performCalculation() {
        // Get input values
        const time1 = this.elements.timeInput1.value.trim();
        const time2OrFactor = this.elements.timeInput2.value.trim();
        
        // Validate inputs
        const validation = Validator.validateCalculationInputs(
            time1, 
            this.currentOperation, 
            time2OrFactor
        );
        
        if (!validation.isValid) {
            this.showError(validation.errorMessage);
            return;
        }
        
        try {
            // Perform calculation
            const result = this.calculator.calculate(
                time1, 
                this.currentOperation, 
                time2OrFactor
            );
            
            // Display result
            this.displayResult(result);
            
            // Save calculation to history
            const calculation = {
                firstValue: time1,
                operation: this.currentOperation,
                secondValue: time2OrFactor,
                result: result
            };
            
            this.saveToHistory(calculation);
            
            // Clear error message
            this.showError('');
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    /**
     * Display the calculation result
     * @param {string} result - Calculation result in HH:MM:SS format
     */
    displayResult(result) {
        // Show the result container
        this.elements.resultDisplay.classList.remove('hidden');
        
        // Update the result text
        this.elements.resultText.textContent = result;
        
        // Update the formatted result
        const formattedResult = Formatter.formatTimeForChildren(result);
        this.elements.resultFormatted.innerHTML = formattedResult;
        
        // Add animation class
        this.elements.resultDisplay.classList.add('result-animation');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.elements.resultDisplay.classList.remove('result-animation');
        }, 1000);
    }
    
    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        if (message) {
            this.elements.errorMessage.textContent = message;
            this.elements.errorMessage.classList.remove('hidden');
        } else {
            this.elements.errorMessage.textContent = '';
            this.elements.errorMessage.classList.add('hidden');
        }
    }
    
    /**
     * Save calculation to history and update history display
     * @param {Object} calculation - Calculation object
     */
    saveToHistory(calculation) {
        // Save to storage
        const savedCalculation = this.storage.saveCalculation(calculation);
        
        // Update history display
        this.addCalculationToHistoryDisplay(savedCalculation);
    }
    
    /**
     * Add a calculation to the history display
     * @param {Object} calculation - Calculation object
     */
    addCalculationToHistoryDisplay(calculation) {
        // Create history item element
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.id = calculation.id;
        
        // Format the calculation for display
        const calculationText = Formatter.formatCalculationForHistory(calculation);
        
        // Format the timestamp
        const timestamp = new Date(calculation.timestamp);
        const formattedTime = Formatter.formatTimestamp(timestamp);
        
        // Create HTML for history item
        historyItem.innerHTML = `
            <div class="history-calculation">${calculationText}</div>
            <div class="history-timestamp">${formattedTime}</div>
            <button class="history-delete-btn" title="Delete">×</button>
            <button class="history-reload-btn" title="Reload">↻</button>
        `;
        
        // Add event listeners for delete and reload buttons
        const deleteBtn = historyItem.querySelector('.history-delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteHistoryItem(calculation.id);
        });
        
        const reloadBtn = historyItem.querySelector('.history-reload-btn');
        reloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.reloadCalculation(calculation);
        });
        
        // Add click event to reload calculation when clicking on the item
        historyItem.addEventListener('click', () => {
            this.reloadCalculation(calculation);
        });
        
        // Add to history list (at the beginning)
        if (this.elements.historyList.firstChild) {
            this.elements.historyList.insertBefore(historyItem, this.elements.historyList.firstChild);
        } else {
            this.elements.historyList.appendChild(historyItem);
        }
        
        // Show history container if it was hidden
        this.elements.historyContainer.classList.remove('hidden');
    }
    
    /**
     * Display all calculations from history
     * @param {Array} calculations - Array of calculation objects
     */
    displayHistory(calculations) {
        // Clear current history display
        this.elements.historyList.innerHTML = '';
        
        // Add each calculation to the display
        calculations.forEach(calculation => {
            this.addCalculationToHistoryDisplay(calculation);
        });
        
        // Show or hide history container based on whether there are items
        if (calculations.length > 0) {
            this.elements.historyContainer.classList.remove('hidden');
        } else {
            this.elements.historyContainer.classList.add('hidden');
        }
    }
    
    /**
     * Delete a history item
     * @param {string} id - ID of the calculation to delete
     */
    deleteHistoryItem(id) {
        // Delete from storage
        const deleted = this.storage.deleteCalculation(id);
        
        if (deleted) {
            // Remove from display
            const historyItem = document.querySelector(`.history-item[data-id="${id}"]`);
            if (historyItem) {
                historyItem.classList.add('fade-out');
                
                // Remove after animation completes
                setTimeout(() => {
                    historyItem.remove();
                    
                    // Hide history container if no items left
                    if (this.elements.historyList.children.length === 0) {
                        this.elements.historyContainer.classList.add('hidden');
                    }
                }, 300);
            }
        }
    }
    
    /**
     * Clear all history
     */
    clearHistory() {
        // Confirm before clearing
        if (confirm('Are you sure you want to clear all calculation history?')) {
            // Clear from storage
            this.storage.clearCalculations();
            
            // Clear display with animation
            const historyItems = this.elements.historyList.querySelectorAll('.history-item');
            historyItems.forEach((item, index) => {
                // Stagger the fade-out animation
                setTimeout(() => {
                    item.classList.add('fade-out');
                }, index * 100);
            });
            
            // Remove all items after animations complete
            setTimeout(() => {
                this.elements.historyList.innerHTML = '';
                this.elements.historyContainer.classList.add('hidden');
            }, historyItems.length * 100 + 300);
        }
    }
    
    /**
     * Reload a calculation from history
     * @param {Object} calculation - Calculation object to reload
     */
    reloadCalculation(calculation) {
        // Set input values
        this.elements.timeInput1.value = calculation.firstValue;
        this.elements.timeInput2.value = calculation.secondValue;
        
        // Set operation
        this.setOperation(calculation.operation);
        
        // Display result
        this.displayResult(calculation.result);
    }
}
