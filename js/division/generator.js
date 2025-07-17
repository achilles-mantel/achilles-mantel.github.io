/**
 * Question Generator
 * 
 * Generates random 4-digit by 1-digit integer division questions
 * and manages the question set.
 */
class Generator {
    /**
     * Initialize the generator
     */
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.allowDecimals = false;
    }
    
    /**
     * Set whether to allow decimal results
     * @param {boolean} allowDecimals - Whether to allow decimal results
     */
    setAllowDecimals(allowDecimals) {
        this.allowDecimals = allowDecimals;
    }
    
    /**
     * Generate a random 4-digit number that is divisible by the divisor (for integer division)
     * @param {number} divisor - The divisor (1-9)
     * @returns {number} - Random 4-digit number that is divisible by the divisor
     */
    generateDividend(divisor) {
        // Generate a random 3-digit quotient (result)
        const quotient = Math.floor(Math.random() * 900) + 100;
        
        // Calculate the dividend by multiplying the quotient by the divisor
        // This ensures the division will result in a whole number
        return quotient * divisor;
    }
    
    /**
     * Generate a random 4-digit number for decimal division
     * @param {number} divisor - The divisor (1-9)
     * @returns {number} - Random 4-digit number
     */
    generateDecimalDividend(divisor) {
        // Generate a random 4-digit number (1000-9999)
        return Math.floor(Math.random() * 9000) + 1000;
    }
    
    /**
     * Round a number to 2 decimal places
     * @param {number} num - The number to round
     * @returns {number} - The rounded number
     */
    roundToTwoDecimals(num) {
        return Math.round(num * 100) / 100;
    }
    
    /**
     * Generate a random 1-digit divisor (1-9)
     * @returns {number} - Random 1-digit number (1-9)
     */
    generateDivisor() {
        return Math.floor(Math.random() * 9) + 1;
    }
    
    /**
     * Generate a new set of 10 division questions
     * @returns {Array} - Array of question objects
     */
    generateQuestionSet() {
        this.questions = [];
        
        for (let i = 0; i < 10; i++) {
            const divisor = this.generateDivisor();
            let dividend, answer;
            
            if (this.allowDecimals) {
                // Generate decimal division problems
                dividend = this.generateDecimalDividend(divisor);
                answer = this.roundToTwoDecimals(dividend / divisor);
            } else {
                // Generate integer division problems
                dividend = this.generateDividend(divisor);
                answer = dividend / divisor;
            }
            
            this.questions.push({
                id: Date.now() + i, // Unique ID
                firstNumber: dividend,
                secondNumber: divisor,
                answer,
                userAnswer: null,
                isCorrect: null,
                timestamp: new Date().toISOString()
            });
        }
        
        this.currentIndex = 0;
        return this.questions;
    }
    
    /**
     * Set the user's answer for the current question
     * @param {number} userAnswer - The user's answer
     * @returns {boolean} - Whether the answer is correct
     */
    setUserAnswer(userAnswer) {
        const currentQuestion = this.getCurrentQuestion();
        if (!currentQuestion) {
            return false;
        }
        
        // Convert to number to ensure proper comparison
        const numericAnswer = Number(userAnswer);
        
        // Set the user's answer
        currentQuestion.userAnswer = numericAnswer;
        
        // Check if the answer is correct
        // For decimal answers, round both to 2 decimal places for comparison
        if (this.allowDecimals) {
            const roundedUserAnswer = this.roundToTwoDecimals(numericAnswer);
            const roundedCorrectAnswer = this.roundToTwoDecimals(currentQuestion.answer);
            currentQuestion.isCorrect = roundedUserAnswer === roundedCorrectAnswer;
        } else {
            currentQuestion.isCorrect = numericAnswer === currentQuestion.answer;
        }
        
        return currentQuestion.isCorrect;
    }
    
    /**
     * Get the number of correct answers
     * @returns {number} - Number of correct answers
     */
    getCorrectAnswersCount() {
        return this.questions.filter(q => q.isCorrect === true).length;
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
