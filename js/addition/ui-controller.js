/**
 * UI Controller
 * 
 * Manages the user interface for the Integer Addition Exercise.
 * Handles DOM interactions and coordinates between other components.
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
        
        // DOM elements
        this.generateBtn = document.getElementById('generate-btn');
        this.exerciseContainer = document.getElementById('exercise-container');
        this.questionNumber = document.getElementById('question-number');
        this.currentQuestionSpan = document.getElementById('current-question');
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
        this.historyToggle = document.getElementById('history-toggle-checkbox');
        this.historyContainer = document.getElementById('history-container');
        this.historyList = document.getElementById('history-list');
        this.clearHistoryBtn = document.getElementById('clear-history-btn');
        
        this.isExerciseComplete = false;
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Generate button
        this.generateBtn.addEventListener('click', () => {
            this.soundManager.playSound('button-click');
            this.generateQuestions();
        });
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => {
            this.soundManager.playSound('button-click');
            this.previousQuestion();
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.soundManager.playSound('button-click');
            this.nextQuestion();
        });
        
        // Try again button
        this.tryAgainBtn.addEventListener('click', () => {
            this.soundManager.playSound('button-click');
            this.resetExercise();
        });
        
        // History toggle
        this.historyToggle.addEventListener('change', () => {
            this.toggleHistory();
        });
        
        // Clear history button
        this.clearHistoryBtn.addEventListener('click', () => {
            this.soundManager.playSound('button-click');
            this.clearHistory();
        });
        
        // User answer input
        this.userAnswerInput.addEventListener('input', () => {
            this.updateNextButtonState();
        });
        
        // Enter key to move to next question
        this.userAnswerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.nextBtn.disabled) {
                this.soundManager.playSound('button-click');
                this.nextQuestion();
            }
        });
    }
    
    /**
     * Generate new questions
     */
    generateQuestions() {
        this.soundManager.playSound('generate');
        this.generator.generateQuestionSet();
        this.isExerciseComplete = false;
        
        // Show exercise container and hide results
        this.exerciseContainer.classList.remove('hidden');
        this.resultsSummary.classList.add('hidden');
        
        // Display first question
        this.displayCurrentQuestion();
        this.updateNavigationButtons();
        this.updateQuestionCounter();
        
        // Focus on answer input
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
        
        // Set user's previous answer if it exists
        this.userAnswerInput.value = question.userAnswer || '';
        
        // Hide the correct answer initially
        this.answer.classList.add('hidden');
        
        // Update next button state
        this.updateNextButtonState();
    }
    
    /**
     * Move to the next question
     */
    nextQuestion() {
        // Check the current answer first
        this.checkCurrentAnswer();
        
        // Move to next question or show results
        const nextQuestion = this.generator.nextQuestion();
        if (nextQuestion) {
            this.displayCurrentQuestion();
            this.updateNavigationButtons();
            this.updateQuestionCounter();
            this.userAnswerInput.focus();
        } else {
            // Exercise complete
            this.completeExercise();
        }
    }
    
    /**
     * Move to the previous question
     */
    previousQuestion() {
        // Save current answer first
        this.saveCurrentAnswer();
        
        const prevQuestion = this.generator.previousQuestion();
        if (prevQuestion) {
            this.displayCurrentQuestion();
            this.updateNavigationButtons();
            this.updateQuestionCounter();
            this.userAnswerInput.focus();
        }
    }
    
    /**
     * Check the current answer
     */
    checkCurrentAnswer() {
        const userAnswer = this.userAnswerInput.value.trim();
        if (userAnswer === '') return;
        
        const isCorrect = this.generator.setUserAnswer(userAnswer);
        
        // Show the correct answer
        this.answer.classList.remove('hidden');
        
        // Play sound based on correctness
        if (isCorrect) {
            this.soundManager.playSound('correct');
        }
    }
    
    /**
     * Save the current answer without checking
     */
    saveCurrentAnswer() {
        const userAnswer = this.userAnswerInput.value.trim();
        if (userAnswer !== '') {
            this.generator.setUserAnswer(userAnswer);
        }
    }
    
    /**
     * Complete the exercise and show results
     */
    completeExercise() {
        this.isExerciseComplete = true;
        
        // Hide exercise container and show results
        this.exerciseContainer.classList.add('hidden');
        this.resultsSummary.classList.remove('hidden');
        
        // Save to history
        this.saveExerciseToHistory();
        
        // Display results
        this.displayResults();
        
        // Update history display
        this.updateHistoryDisplay();
    }
    
    /**
     * Display the results summary
     */
    displayResults() {
        const questions = this.generator.questions;
        const correctCount = this.generator.getCorrectAnswersCount();
        
        // Clear previous results
        this.resultsBody.innerHTML = '';
        
        // Add each question result
        questions.forEach((question, index) => {
            const row = document.createElement('tr');
            
            const isCorrect = question.isCorrect === true;
            const userAnswerText = question.userAnswer !== null ? question.userAnswer : 'No answer';
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${question.firstNumber} + ${question.secondNumber}</td>
                <td>${question.answer}</td>
                <td>${userAnswerText}</td>
                <td class="${isCorrect ? 'result-correct' : 'result-incorrect'}">
                    ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </td>
            `;
            
            this.resultsBody.appendChild(row);
        });
        
        // Update score
        this.scoreSpan.textContent = correctCount;
    }
    
    /**
     * Save exercise to history
     */
    saveExerciseToHistory() {
        const questions = this.generator.questions;
        questions.forEach(question => {
            this.historyManager.saveQuestion(question);
        });
    }
    
    /**
     * Reset the exercise
     */
    resetExercise() {
        this.resultsSummary.classList.add('hidden');
        this.exerciseContainer.classList.add('hidden');
        this.isExerciseComplete = false;
        
        // Clear generator state
        this.generator.questions = [];
        this.generator.currentIndex = 0;
        
        // Update question counter
        this.updateQuestionCounter();
    }
    
    /**
     * Update navigation buttons state
     */
    updateNavigationButtons() {
        this.prevBtn.disabled = !this.generator.hasPreviousQuestion();
        // Next button state is handled by updateNextButtonState()
    }
    
    /**
     * Update next button state based on user input
     */
    updateNextButtonState() {
        const hasInput = this.userAnswerInput.value.trim() !== '';
        this.nextBtn.disabled = !hasInput;
    }
    
    /**
     * Update question counter display
     */
    updateQuestionCounter() {
        const current = this.generator.getCurrentQuestionNumber() || 0;
        const total = this.generator.getTotalQuestions() || 10;
        this.currentQuestionSpan.textContent = `Question: ${current}/${total}`;
    }
    
    /**
     * Toggle history visibility
     */
    toggleHistory() {
        if (this.historyToggle.checked) {
            this.historyContainer.classList.remove('hidden');
            this.updateHistoryDisplay();
        } else {
            this.historyContainer.classList.add('hidden');
        }
    }
    
    /**
     * Update history display
     */
    updateHistoryDisplay() {
        const history = this.historyManager.getHistory();
        this.historyList.innerHTML = '';
        
        if (history.length === 0) {
            this.historyList.innerHTML = '<p class="text-center">No exercise history yet.</p>';
            return;
        }
        
        // Group questions by timestamp (same exercise session)
        const groupedHistory = this.groupHistoryBySession(history);
        
        groupedHistory.forEach((session, sessionIndex) => {
            const sessionDiv = document.createElement('div');
            sessionDiv.className = 'history-session';
            
            const sessionHeader = document.createElement('h3');
            sessionHeader.textContent = `Exercise Session ${sessionIndex + 1}`;
            sessionHeader.style.color = '#2E7D32';
            sessionHeader.style.marginBottom = '1rem';
            sessionDiv.appendChild(sessionHeader);
            
            session.forEach(question => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const isCorrect = question.userAnswer === question.answer;
                const userAnswerText = question.userAnswer !== null ? question.userAnswer : 'No answer';
                
                historyItem.innerHTML = `
                    <div class="history-problem">
                        ${question.firstNumber} + ${question.secondNumber} = ${question.answer}
                    </div>
                    <div style="margin: 0.5rem 0;">
                        Your answer: <strong>${userAnswerText}</strong>
                        <span class="${isCorrect ? 'result-correct' : 'result-incorrect'}" style="margin-left: 1rem;">
                            ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                    </div>
                    <div class="history-timestamp">
                        ${new Date(question.timestamp).toLocaleString()}
                    </div>
                `;
                
                sessionDiv.appendChild(historyItem);
            });
            
            this.historyList.appendChild(sessionDiv);
        });
    }
    
    /**
     * Group history questions by exercise session
     * @param {Array} history - Array of question objects
     * @returns {Array} - Array of session arrays
     */
    groupHistoryBySession(history) {
        const sessions = [];
        let currentSession = [];
        let lastTimestamp = null;
        
        // Sort history by timestamp (newest first)
        const sortedHistory = [...history].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        sortedHistory.forEach(question => {
            const questionTime = new Date(question.timestamp);
            
            // If this is the first question or more than 5 minutes apart, start new session
            if (!lastTimestamp || (lastTimestamp - questionTime) > 5 * 60 * 1000) {
                if (currentSession.length > 0) {
                    sessions.push([...currentSession]);
                }
                currentSession = [question];
            } else {
                currentSession.push(question);
            }
            
            lastTimestamp = questionTime;
        });
        
        // Add the last session
        if (currentSession.length > 0) {
            sessions.push(currentSession);
        }
        
        return sessions;
    }
    
    /**
     * Clear exercise history
     */
    clearHistory() {
        if (confirm('Are you sure you want to clear all exercise history?')) {
            this.historyManager.clearHistory();
            this.updateHistoryDisplay();
        }
    }
}
