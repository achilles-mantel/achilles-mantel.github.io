/**
 * UI Controller
 * 
 * Manages the user interface for the subtraction exercise.
 * Handles DOM interactions and updates.
 */
class UIController {
    /**
     * Initialize the UI controller
     * @param {Generator} generator - The question generator instance
     * @param {HistoryManager} historyManager - The history manager instance
     * @param {SoundManager} soundManager - The sound manager instance
     */
    constructor(generator, historyManager, soundManager) {
        this.generator = generator;
        this.historyManager = historyManager;
        this.soundManager = soundManager;
        
        // DOM elements
        this.generateBtn = document.getElementById('generate-btn');
        this.exerciseContainer = document.getElementById('exercise-container');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.questionNumber = document.getElementById('question-number');
        this.firstNumber = document.getElementById('first-number');
        this.secondNumber = document.getElementById('second-number');
        this.answer = document.getElementById('answer');
        this.userAnswerInput = document.getElementById('user-answer');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.resultsSummary = document.getElementById('results-summary');
        this.resultsBody = document.getElementById('results-body');
        this.scoreSpan = document.getElementById('score');
        this.tryAgainBtn = document.getElementById('try-again-btn');
        this.historyToggleCheckbox = document.getElementById('history-toggle-checkbox');
        this.historyContainer = document.getElementById('history-container');
        this.historyList = document.getElementById('history-list');
        this.clearHistoryBtn = document.getElementById('clear-history-btn');
        
        this.setupEventListeners();
        this.loadHistory();
    }
    
    /**
     * Set up event listeners for UI interactions
     */
    setupEventListeners() {
        // Generate button
        this.generateBtn.addEventListener('click', () => {
            this.soundManager.playSound('generate');
            this.generateQuestions();
        });
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => {
            this.soundManager.playSound('click');
            this.previousQuestion();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.soundManager.playSound('click');
            this.nextQuestion();
        });
        
        // User answer input
        this.userAnswerInput.addEventListener('input', () => {
            this.handleAnswerInput();
        });
        
        this.userAnswerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.nextQuestion();
            }
        });
        
        // Try again button
        this.tryAgainBtn.addEventListener('click', () => {
            this.soundManager.playSound('click');
            this.resetExercise();
        });
        
        // History toggle
        this.historyToggleCheckbox.addEventListener('change', () => {
            this.toggleHistory();
        });
        
        // Clear history button
        this.clearHistoryBtn.addEventListener('click', () => {
            this.soundManager.playSound('click');
            this.clearHistory();
        });
    }
    
    /**
     * Generate a new set of questions
     */
    generateQuestions() {
        this.generator.generateQuestionSet();
        this.showExercise();
        this.displayCurrentQuestion();
        this.updateNavigationButtons();
        this.updateQuestionCounter();
    }
    
    /**
     * Show the exercise container and hide results
     */
    showExercise() {
        this.exerciseContainer.classList.remove('hidden');
        this.resultsSummary.classList.add('hidden');
        this.userAnswerInput.focus();
    }
    
    /**
     * Display the current question
     */
    displayCurrentQuestion() {
        const question = this.generator.getCurrentQuestion();
        if (!question) return;
        
        this.questionNumber.textContent = this.generator.getCurrentQuestionNumber();
        this.firstNumber.textContent = question.firstNumber;
        this.secondNumber.textContent = question.secondNumber;
        this.answer.textContent = question.answer;
        
        // Clear and reset user input
        this.userAnswerInput.value = question.userAnswer || '';
        this.userAnswerInput.classList.remove('correct', 'incorrect');
        this.answer.classList.add('hidden');
        
        // Show feedback if question was already answered
        if (question.userAnswer !== null) {
            this.showAnswerFeedback(question.isCorrect);
        }
        
        this.userAnswerInput.focus();
    }
    
    /**
     * Handle user answer input
     */
    handleAnswerInput() {
        const userAnswer = this.userAnswerInput.value.trim();
        
        // Enable/disable next button based on input
        this.nextBtn.disabled = userAnswer === '';
        
        // Remove previous feedback classes
        this.userAnswerInput.classList.remove('correct', 'incorrect');
    }
    
    /**
     * Move to the next question
     */
    nextQuestion() {
        // Check current answer if not already checked
        const currentQuestion = this.generator.getCurrentQuestion();
        if (currentQuestion && currentQuestion.userAnswer === null) {
            this.checkCurrentAnswer();
        }
        
        // Move to next question or show results
        const nextQuestion = this.generator.nextQuestion();
        if (nextQuestion) {
            this.displayCurrentQuestion();
            this.updateNavigationButtons();
            this.updateQuestionCounter();
        } else {
            this.showResults();
        }
    }
    
    /**
     * Move to the previous question
     */
    previousQuestion() {
        const prevQuestion = this.generator.previousQuestion();
        if (prevQuestion) {
            this.displayCurrentQuestion();
            this.updateNavigationButtons();
            this.updateQuestionCounter();
        }
    }
    
    /**
     * Check the current answer
     */
    checkCurrentAnswer() {
        const userAnswer = this.userAnswerInput.value.trim();
        if (userAnswer === '') return;
        
        const isCorrect = this.generator.setUserAnswer(userAnswer);
        this.showAnswerFeedback(isCorrect);
        
        if (isCorrect) {
            this.soundManager.playSound('correct');
        }
    }
    
    /**
     * Show feedback for the answer
     * @param {boolean} isCorrect - Whether the answer is correct
     */
    showAnswerFeedback(isCorrect) {
        if (isCorrect) {
            this.userAnswerInput.classList.add('correct');
            this.userAnswerInput.classList.remove('incorrect');
        } else {
            this.userAnswerInput.classList.add('incorrect');
            this.userAnswerInput.classList.remove('correct');
            this.answer.classList.remove('hidden');
        }
    }
    
    /**
     * Update navigation buttons state
     */
    updateNavigationButtons() {
        this.prevBtn.disabled = !this.generator.hasPreviousQuestion();
        
        // Next button is enabled if there's input or if we're not on the last question
        const hasInput = this.userAnswerInput.value.trim() !== '';
        const hasNext = this.generator.hasNextQuestion();
        this.nextBtn.disabled = !hasInput && hasNext;
        
        // Change next button text for last question
        if (!hasNext) {
            this.nextBtn.textContent = 'Finish';
        } else {
            this.nextBtn.textContent = 'Next';
        }
    }
    
    /**
     * Update the question counter display
     */
    updateQuestionCounter() {
        const current = this.generator.getCurrentQuestionNumber();
        const total = this.generator.getTotalQuestions();
        this.currentQuestionSpan.textContent = `Question: ${current}/${total}`;
    }
    
    /**
     * Show the results summary
     */
    showResults() {
        this.exerciseContainer.classList.add('hidden');
        this.resultsSummary.classList.remove('hidden');
        
        this.displayResults();
        this.saveToHistory();
    }
    
    /**
     * Display the results in the summary table
     */
    displayResults() {
        const questions = this.generator.questions;
        const correctCount = this.generator.getCorrectAnswersCount();
        
        // Clear previous results
        this.resultsBody.innerHTML = '';
        
        // Add each question result
        questions.forEach((question, index) => {
            const row = document.createElement('tr');
            
            const resultClass = question.isCorrect ? 'result-correct' : 'result-incorrect';
            const resultText = question.isCorrect ? '✓ Correct' : '✗ Incorrect';
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${question.firstNumber} - ${question.secondNumber}</td>
                <td>${question.answer}</td>
                <td>${question.userAnswer !== null ? question.userAnswer : 'No answer'}</td>
                <td class="${resultClass}">${resultText}</td>
            `;
            
            this.resultsBody.appendChild(row);
        });
        
        // Update score
        this.scoreSpan.textContent = correctCount;
    }
    
    /**
     * Reset the exercise to start over
     */
    resetExercise() {
        this.resultsSummary.classList.add('hidden');
        this.generateQuestions();
    }
    
    /**
     * Save the current exercise to history
     */
    saveToHistory() {
        const questions = this.generator.questions;
        const correctCount = this.generator.getCorrectAnswersCount();
        const totalQuestions = questions.length;
        
        const exerciseData = {
            timestamp: new Date().toISOString(),
            questions: questions,
            score: correctCount,
            totalQuestions: totalQuestions
        };
        
        this.historyManager.saveExercise(exerciseData);
        this.loadHistory();
    }
    
    /**
     * Toggle history visibility
     */
    toggleHistory() {
        if (this.historyToggleCheckbox.checked) {
            this.historyContainer.classList.remove('hidden');
            this.loadHistory();
        } else {
            this.historyContainer.classList.add('hidden');
        }
    }
    
    /**
     * Load and display exercise history
     */
    loadHistory() {
        if (!this.historyToggleCheckbox.checked) return;
        
        const history = this.historyManager.getHistory();
        this.historyList.innerHTML = '';
        
        if (history.length === 0) {
            this.historyList.innerHTML = '<p class="text-center">No exercise history yet.</p>';
            return;
        }
        
        history.forEach((exercise, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(exercise.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-score">Score: ${exercise.score}/${exercise.totalQuestions}</span>
                    <span class="history-item-timestamp">${formattedDate}</span>
                </div>
            `;
            
            this.historyList.appendChild(historyItem);
        });
    }
    
    /**
     * Clear exercise history
     */
    clearHistory() {
        if (confirm('Are you sure you want to clear all exercise history?')) {
            this.historyManager.clearHistory();
            this.loadHistory();
        }
    }
}
