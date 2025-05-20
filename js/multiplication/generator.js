/**
 * Question Generator
 * 
 * Generates random 3-digit by 3-digit multiplication questions
 * and manages the question set.
 */
class Generator {
    /**
     * Initialize the generator
     */
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
    }
    
    /**
     * Generate a random 3-digit number
     * @returns {number} - Random 3-digit number (100-999)
     */
    generateThreeDigitNumber() {
        return Math.floor(Math.random() * 900) + 100;
    }
    
    /**
     * Generate a new set of 10 multiplication questions
     * @returns {Array} - Array of question objects
     */
    generateQuestionSet() {
        this.questions = [];
        
        for (let i = 0; i < 10; i++) {
            const firstNumber = this.generateThreeDigitNumber();
            const secondNumber = this.generateThreeDigitNumber();
            const answer = firstNumber * secondNumber;
            
            this.questions.push({
                id: Date.now() + i, // Unique ID
                firstNumber,
                secondNumber,
                answer,
                timestamp: new Date().toISOString()
            });
        }
        
        this.currentIndex = 0;
        return this.questions;
    }
    
    /**
     * Get the current question
     * @returns {Object|null} - Current question object or null if no questions
     */
    getCurrentQuestion() {
        if (this.questions.length === 0) {
            return null;
        }
        
        return this.questions[this.currentIndex];
    }
    
    /**
     * Move to the next question
     * @returns {Object|null} - Next question object or null if at the end
     */
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            return this.getCurrentQuestion();
        }
        
        return null;
    }
    
    /**
     * Move to the previous question
     * @returns {Object|null} - Previous question object or null if at the beginning
     */
    previousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrentQuestion();
        }
        
        return null;
    }
    
    /**
     * Get the current question index (1-based for display)
     * @returns {number} - Current question number (1-based)
     */
    getCurrentQuestionNumber() {
        return this.currentIndex + 1;
    }
    
    /**
     * Get the total number of questions
     * @returns {number} - Total number of questions
     */
    getTotalQuestions() {
        return this.questions.length;
    }
    
    /**
     * Check if there is a next question
     * @returns {boolean} - True if there is a next question
     */
    hasNextQuestion() {
        return this.currentIndex < this.questions.length - 1;
    }
    
    /**
     * Check if there is a previous question
     * @returns {boolean} - True if there is a previous question
     */
    hasPreviousQuestion() {
        return this.currentIndex > 0;
    }
}
