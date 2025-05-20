/**
 * Sound Manager
 * 
 * Manages sound effects for the multiplication exercise.
 * Handles playing sounds and managing sound settings.
 */
class SoundManager {
    /**
     * Initialize the sound manager
     */
    constructor() {
        this.sounds = {
            generate: document.getElementById('generate-sound'),
            correct: document.getElementById('correct-sound'),
            click: document.getElementById('button-click')
        };
        
        this.soundEnabled = true;
        this.loadSoundPreference();
    }
    
    /**
     * Load sound preference from local storage
     */
    loadSoundPreference() {
        try {
            const soundPref = localStorage.getItem('multiplicationSoundEnabled');
            if (soundPref !== null) {
                this.soundEnabled = soundPref === 'true';
            }
        } catch (e) {
            // If we can't access localStorage, default to enabled
            this.soundEnabled = true;
        }
    }
    
    /**
     * Save sound preference to local storage
     */
    saveSoundPreference() {
        try {
            localStorage.setItem('multiplicationSoundEnabled', this.soundEnabled.toString());
        } catch (e) {
            console.warn('Could not save sound preference to local storage');
        }
    }
    
    /**
     * Toggle sound on/off
     * @returns {boolean} - New sound state (true = enabled, false = disabled)
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundPreference();
        return this.soundEnabled;
    }
    
    /**
     * Check if sound is enabled
     * @returns {boolean} - True if sound is enabled
     */
    isSoundEnabled() {
        return this.soundEnabled;
    }
    
    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     * @returns {boolean} - True if sound played successfully
     */
    playSound(soundName) {
        if (!this.soundEnabled) {
            return false;
        }
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound "${soundName}" not found`);
            return false;
        }
        
        try {
            // Reset the sound to the beginning
            sound.currentTime = 0;
            
            // Play the sound
            const playPromise = sound.play();
            
            // Handle play promise (might be rejected if user hasn't interacted with the page)
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Could not play sound: ${error}`);
                });
            }
            
            return true;
        } catch (error) {
            console.warn(`Error playing sound: ${error}`);
            return false;
        }
    }
    
    /**
     * Play the generate sound
     */
    playGenerateSound() {
        this.playSound('generate');
    }
    
    /**
     * Play the correct sound
     */
    playCorrectSound() {
        this.playSound('correct');
    }
    
    /**
     * Play the button click sound
     */
    playClickSound() {
        this.playSound('click');
    }
    
    /**
     * Create a directory for sound assets if it doesn't exist
     * This is a helper method that would typically be used during setup
     */
    static createSoundDirectory() {
        // This would typically be done server-side or during app setup
        console.log('Sound directory would be created here in a real application');
    }
    
    /**
     * Check if the browser supports audio
     * @returns {boolean} - True if audio is supported
     */
    static isAudioSupported() {
        return typeof Audio !== 'undefined';
    }
    
    /**
     * Create placeholder audio elements if they don't exist
     * This is useful if the HTML doesn't include the audio elements
     */
    createPlaceholderAudioElements() {
        if (!this.sounds.generate) {
            this.sounds.generate = this.createAudioElement('generate-sound', 'assets/sounds/generate.mp3');
        }
        
        if (!this.sounds.correct) {
            this.sounds.correct = this.createAudioElement('correct-sound', 'assets/sounds/correct.mp3');
        }
        
        if (!this.sounds.click) {
            this.sounds.click = this.createAudioElement('button-click', 'assets/sounds/click.mp3');
        }
    }
    
    /**
     * Create an audio element
     * @param {string} id - ID for the audio element
     * @param {string} src - Source URL for the audio file
     * @returns {HTMLAudioElement} - Created audio element
     */
    createAudioElement(id, src) {
        const audio = document.createElement('audio');
        audio.id = id;
        audio.src = src;
        audio.preload = 'auto';
        document.body.appendChild(audio);
        return audio;
    }
}
