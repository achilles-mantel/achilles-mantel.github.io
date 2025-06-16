/**
 * Question Generator
 * 
 * Generates random 1-digit by 1-digit addition questions
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
     * Generate a random 1-digit number
     * @returns {number} - Random 1-digit number (1-9)
     */
    generateOneDigitNumber() {
        return Math.floor(Math.random() * 9) + 1;
    }
    
    /**
     * Generate a new set of 10 addition questions
     * @returns {Array} - Array of question objects
     */
    generateQuestionSet() {
        this.questions = [];
        
        for (let i = 0; i < 10; i++) {
            const firstNumber = this.generateOneDigitNumber();
            const secondNumber = this.generateOneDigitNumber();
            const answer = firstNumber + secondNumber;
            
            this.questions.push({
                id: Date.now() + i, // Unique ID
                firstNumber,
                secondNumber,
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
        currentQuestion.isCorrect = numericAnswer === currentQuestion.answer;
        
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
