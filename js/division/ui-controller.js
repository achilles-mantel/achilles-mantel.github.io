/**
 * UI Controller
 * 
 * Manages the user interface for the division exercise.
 * Handles DOM interactions and updates.
 */
class UIController {
    /**
     * Initialize the UI controller
     * @param {Generator} generator - Question generator instance
     * @param {HistoryManager} historyManager - History manager instance
     * @param {SoundManager} soundManager - Sound manager instance
     */
    constructor(generator, historyManager, soundManager) {
        this.generator = generator;
        this.historyManager = historyManager;
        this.soundManager = soundManager;
        
        // Store references to DOM elements
        this.elements = {
            generateBtn: document.getElementById('generate-btn'),
            exerciseContainer: document.getElementById('exercise-container'),
            questionNumber: document.getElementById('question-number'),
            firstNumber: document.getElementById('first-number'),
            secondNumber: document.getElementById('second-number'),
            answer: document.getElementById('answer'),
            userAnswer: document.getElementById('user-answer'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            currentQuestion: document.getElementById('current-question'),
            historyContainer: document.getElementById('history-container'),
            historyList: document.getElementById('history-list'),
            clearHistoryBtn: document.getElementById('clear-history-btn'),
            historyToggle: document.getElementById('history-toggle-checkbox'),
            decimalToggle: document.getElementById('decimal-toggle-checkbox'),
            resultsSummary: document.getElementById('results-summary'),
            resultsBody: document.getElementById('results-body'),
            score: document.getElementById('score'),
            tryAgainBtn: document.getElementById('try-again-btn')
        };
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Generate button click
        this.elements.generateBtn.addEventListener('click', () => {
            this.generateQuestions();
        });
        
        // User answer input events
        this.elements.userAnswer.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.handleNextButtonClick();
            }
        });
        
        // Enable/disable next button based on input
        this.elements.userAnswer.addEventListener('input', () => {
            this.updateNextButtonState();
        });
        
        // Previous button click
        this.elements.prevBtn.addEventListener('click', () => {
            this.showPreviousQuestion();
        });
        
        // Next button click
        this.elements.nextBtn.addEventListener('click', () => {
            this.handleNextButtonClick();
        });
        
        // Clear history button click
        this.elements.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });
        
        // History toggle checkbox
        this.elements.historyToggle.addEventListener('change', () => {
            this.toggleHistoryVisibility();
        });
        
        // Try again button click
        this.elements.tryAgainBtn.addEventListener('click', () => {
            this.resetExercise();
        });
    }
    
    /**
     * Generate new questions
     */
    generateQuestions() {
        // Play sound
        this.soundManager.playGenerateSound();
        
        // Set decimal mode based on checkbox
        const allowDecimals = this.elements.decimalToggle.checked;
        this.generator.setAllowDecimals(allowDecimals);
        
        // Generate questions
        const questions = this.generator.generateQuestionSet();
        
        // Hide results summary if visible
        this.elements.resultsSummary.classList.add('hidden');
        
        // Show the first question
        this.showQuestion(this.generator.getCurrentQuestion());
        
        // Show the exercise container
        this.elements.exerciseContainer.classList.remove('hidden');
        
        // Save questions to history
        this.historyManager.saveQuestionSet(questions);
        
        // Update history display
        this.updateHistoryDisplay();
        
        // Focus the user answer input
        setTimeout(() => {
            this.elements.userAnswer.focus();
        }, 100);
    }
    
    /**
     * Show a question
     * @param {Object} question - Question object to display
     */
    showQuestion(question) {
        if (!question) {
            return;
        }
        
        // Update question number
        this.elements.questionNumber.textContent = this.generator.getCurrentQuestionNumber();
        
        // Update current question indicator
        this.elements.currentQuestion.textContent = `Question: ${this.generator.getCurrentQuestionNumber()}/${this.generator.getTotalQuestions()}`;
        
        // Update numbers
        this.elements.firstNumber.textContent = question.firstNumber;
        this.elements.secondNumber.textContent = question.secondNumber;
        
        // Hide answer
        this.elements.answer.classList.add('hidden');
        
        // Update answer text
        this.elements.answer.textContent = question.answer;
        
        // Set user answer input if it exists for this question
        if (question.userAnswer !== null) {
            this.elements.userAnswer.value = question.userAnswer;
            this.elements.userAnswer.classList.add(question.isCorrect ? 'correct' : 'incorrect');
        } else {
            // Reset user answer input
            this.elements.userAnswer.value = '';
            this.elements.userAnswer.classList.remove('correct', 'incorrect');
        }
        
        // Update navigation buttons
        this.elements.prevBtn.disabled = !this.generator.hasPreviousQuestion();
        
        // Next button is disabled if no answer is entered
        this.updateNextButtonState();
    }
    
    /**
     * Handle the next button click
     */
    handleNextButtonClick() {
        // Play click sound
        this.soundManager.playClickSound();
        
        const currentQuestion = this.generator.getCurrentQuestion();
        if (!currentQuestion) {
            return;
        }
        
        // Get the user's answer
        const userAnswer = this.elements.userAnswer.value.trim();
        
        // Check if the answer is valid
        if (!userAnswer) {
            alert('Please enter your answer');
            this.elements.userAnswer.focus();
            return;
        }
        
        // Convert to number and check if valid
        const numericAnswer = Number(userAnswer);
        if (isNaN(numericAnswer)) {
            alert('Please enter a valid number');
            this.elements.userAnswer.focus();
            return;
        }
        
        // Set the user's answer and check if correct
        const isCorrect = this.generator.setUserAnswer(numericAnswer);
        
        // Update the input field styling
        this.elements.userAnswer.classList.remove('correct', 'incorrect');
        this.elements.userAnswer.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Play sound based on result
        if (isCorrect) {
            this.soundManager.playCorrectSound();
        }
        
        // Check if this is the last question
        if (!this.generator.hasNextQuestion()) {
            // If it's the last question, show the results summary
            this.showResultsSummary();
        } else {
            // Move to the next question
            this.showNextQuestion();
        }
    }
    
    /**
     * Update the next button state based on whether an answer is entered
     */
    updateNextButtonState() {
        const userAnswer = this.elements.userAnswer.value.trim();
        const currentQuestion = this.generator.getCurrentQuestion();
        
        if (currentQuestion && currentQuestion.userAnswer !== null) {
            // If the question has already been answered, enable the next button
            this.elements.nextBtn.disabled = false;
        } else {
            // Otherwise, enable only if there's an answer entered
            this.elements.nextBtn.disabled = !userAnswer;
        }
    }
    
    /**
     * Show the next question
     */
    showNextQuestion() {
        const nextQuestion = this.generator.nextQuestion();
        if (nextQuestion) {
            this.showQuestion(nextQuestion);
        }
    }
    
    /**
     * Show the previous question
     */
    showPreviousQuestion() {
        // Play click sound
        this.soundManager.playClickSound();
        
        const prevQuestion = this.generator.previousQuestion();
        if (prevQuestion) {
            this.showQuestion(prevQuestion);
        }
    }
    
    /**
     * Show the results summary
     */
    showResultsSummary() {
        // Hide the exercise container
        this.elements.exerciseContainer.classList.add('hidden');
        
        // Clear the results body
        this.elements.resultsBody.innerHTML = '';
        
        // Get all questions
        const questions = this.generator.questions;
        
        // Count correct answers
        const correctCount = this.generator.getCorrectAnswersCount();
        
        // Update the score
        this.elements.score.textContent = correctCount;
        
        // Add each question to the results table
        questions.forEach((question, index) => {
            const row = document.createElement('tr');
            
            // Question number
            const numCell = document.createElement('td');
            numCell.textContent = index + 1;
            row.appendChild(numCell);
            
            // Problem
            const problemCell = document.createElement('td');
            problemCell.textContent = `${question.firstNumber} ÷ ${question.secondNumber}`;
            row.appendChild(problemCell);
            
            // Correct answer
            const correctAnswerCell = document.createElement('td');
            correctAnswerCell.textContent = question.answer;
            row.appendChild(correctAnswerCell);
            
            // User answer
            const userAnswerCell = document.createElement('td');
            userAnswerCell.textContent = question.userAnswer !== null ? question.userAnswer : '-';
            row.appendChild(userAnswerCell);
            
            // Result
            const resultCell = document.createElement('td');
            if (question.isCorrect === true) {
                resultCell.textContent = '✓';
                resultCell.className = 'correct';
            } else if (question.isCorrect === false) {
                resultCell.textContent = '✗';
                resultCell.className = 'incorrect';
            } else {
                resultCell.textContent = '-';
            }
            row.appendChild(resultCell);
            
            // Add the row to the table
            this.elements.resultsBody.appendChild(row);
        });
        
        // Show the results summary
        this.elements.resultsSummary.classList.remove('hidden');
    }
    
    /**
     * Reset the exercise
     */
    resetExercise() {
        // Play sound
        this.soundManager.playClickSound();
        
        // Hide the results summary
        this.elements.resultsSummary.classList.add('hidden');
        
        // Generate new questions
        this.generateQuestions();
    }
    
    /**
     * Toggle the visibility of the history container
     */
    toggleHistoryVisibility() {
        if (this.elements.historyToggle.checked) {
            this.elements.historyContainer.classList.remove('hidden');
        } else {
            this.elements.historyContainer.classList.add('hidden');
        }
    }
    
    /**
     * Update the history display
     */
    updateHistoryDisplay() {
        const history = this.historyManager.getHistory();
        
        // Clear the history list
        this.elements.historyList.innerHTML = '';
        
        // Add each history item
        history.forEach(item => {
            this.addHistoryItem(item);
        });
        
        // Only show history if toggle is checked and there are items
        if (this.elements.historyToggle.checked && history.length > 0) {
            this.elements.historyContainer.classList.remove('hidden');
        } else {
            this.elements.historyContainer.classList.add('hidden');
        }
    }
    
    /**
     * Add a history item to the display
     * @param {Object} item - History item to add
     */
    addHistoryItem(item) {
        // Create history item element
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // Format the problem and answer
        const problem = `${item.firstNumber} ÷ ${item.secondNumber}`;
        const answer = `${item.answer}`;
        
        // Format the timestamp
        const timestamp = this.historyManager.formatTimestamp(item.timestamp);
        
        // Create HTML for history item
        historyItem.innerHTML = `
            <div class="history-problem">${problem} = <span class="history-answer">${answer}</span></div>
            <div class="history-timestamp">${timestamp}</div>
        `;
        
        // Add to history list
        this.elements.historyList.appendChild(historyItem);
    }
    
    /**
     * Clear the history
     */
    clearHistory() {
        // Play click sound
        this.soundManager.playClickSound();
        
        // Confirm before clearing
        if (confirm('Are you sure you want to clear all exercise history?')) {
            // Clear history
            this.historyManager.clearHistory();
            
            // Update history display
            this.updateHistoryDisplay();
        }
    }
}
