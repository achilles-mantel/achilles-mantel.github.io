/**
 * UI Controller
 * 
 * Manages the user interface for the multiplication exercise.
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
            showAnswerBtn: document.getElementById('show-answer-btn'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            currentQuestion: document.getElementById('current-question'),
            correctCount: document.getElementById('correct-count'),
            historyContainer: document.getElementById('history-container'),
            historyList: document.getElementById('history-list'),
            clearHistoryBtn: document.getElementById('clear-history-btn')
        };
        
        this.correctAnswers = 0;
        this.answerShown = false;
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Generate button click
        this.elements.generateBtn.addEventListener('click', () => {
            this.generateQuestions();
        });
        
        // Show answer button click
        this.elements.showAnswerBtn.addEventListener('click', () => {
            this.showAnswer();
        });
        
        // Previous button click
        this.elements.prevBtn.addEventListener('click', () => {
            this.showPreviousQuestion();
        });
        
        // Next button click
        this.elements.nextBtn.addEventListener('click', () => {
            this.showNextQuestion();
        });
        
        // Clear history button click
        this.elements.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });
    }
    
    /**
     * Generate new questions
     */
    generateQuestions() {
        // Play sound
        this.soundManager.playGenerateSound();
        
        // Generate questions
        const questions = this.generator.generateQuestionSet();
        
        // Reset correct answers count
        this.correctAnswers = 0;
        this.updateCorrectCount();
        
        // Show the first question
        this.showQuestion(this.generator.getCurrentQuestion());
        
        // Show the exercise container
        this.elements.exerciseContainer.classList.remove('hidden');
        
        // Save questions to history
        this.historyManager.saveQuestionSet(questions);
        
        // Update history display
        this.updateHistoryDisplay();
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
        this.elements.showAnswerBtn.textContent = 'Show Answer';
        this.answerShown = false;
        
        // Update answer text
        this.elements.answer.textContent = question.answer;
        
        // Update navigation buttons
        this.elements.prevBtn.disabled = !this.generator.hasPreviousQuestion();
        this.elements.nextBtn.disabled = !this.generator.hasNextQuestion();
    }
    
    /**
     * Show the answer for the current question
     */
    showAnswer() {
        // Play click sound
        this.soundManager.playClickSound();
        
        if (!this.answerShown) {
            // Show the answer
            this.elements.answer.classList.remove('hidden');
            this.elements.showAnswerBtn.textContent = 'Hide Answer';
            this.answerShown = true;
            
            // Play correct sound
            this.soundManager.playCorrectSound();
            
            // Increment correct answers count
            this.correctAnswers++;
            this.updateCorrectCount();
        } else {
            // Hide the answer
            this.elements.answer.classList.add('hidden');
            this.elements.showAnswerBtn.textContent = 'Show Answer';
            this.answerShown = false;
        }
    }
    
    /**
     * Show the next question
     */
    showNextQuestion() {
        // Play click sound
        this.soundManager.playClickSound();
        
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
     * Update the correct answers count display
     */
    updateCorrectCount() {
        this.elements.correctCount.textContent = `Correct: ${this.correctAnswers}`;
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
        
        // Show or hide the history container
        if (history.length > 0) {
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
        const problem = `${item.firstNumber} × ${item.secondNumber}`;
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
