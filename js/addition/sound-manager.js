/**
 * Sound Manager
 * 
 * Manages sound effects for the Integer Addition Exercise.
 * Handles audio playback and user preferences.
 */
class SoundManager {
    /**
     * Initialize the sound manager
     */
    constructor() {
        this.sounds = {
            'generate': null,
            'correct': null,
            'button-click': null
        };
        
        this.soundEnabled = true;
        this.storageKey = 'addition-exercise-sound-enabled';
        
        // Load sound preference
        this.loadSoundPreference();
        
        // Initialize audio elements
        this.initializeAudioElements();
    }
    
    /**
     * Initialize audio elements
     */
    initializeAudioElements() {
        // Get audio elements from the DOM
        this.sounds.generate = document.getElementById('generate-sound');
        this.sounds.correct = document.getElementById('correct-sound');
        this.sounds['button-click'] = document.getElementById('button-click');
        
        // Set up audio elements
        Object.values(this.sounds).forEach(audio => {
            if (audio) {
                audio.volume = 0.5; // Set moderate volume
                audio.preload = 'auto';
                
                // Handle audio loading errors
                audio.addEventListener('error', (e) => {
                    console.warn('Audio loading error:', e);
                });
                
                // Handle audio loading success
                audio.addEventListener('canplaythrough', () => {
                    console.log('Audio loaded successfully:', audio.src);
                });
            }
        });
    }
    
    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    playSound(soundName) {
        if (!this.soundEnabled) {
            return;
        }
        
        const audio = this.sounds[soundName];
        if (!audio) {
            console.warn(`Sound '${soundName}' not found`);
            return;
        }
        
        try {
            // Reset the audio to the beginning
            audio.currentTime = 0;
            
            // Play the sound
            const playPromise = audio.play();
            
            // Handle the promise if it exists (modern browsers)
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Audio playback failed:', error);
                    // Don't show error to user, just log it
                });
            }
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }
    
    /**
     * Toggle sound on/off
     * @returns {boolean} - New sound enabled state
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundPreference();
        return this.soundEnabled;
    }
    
    /**
     * Set sound enabled state
     * @param {boolean} enabled - Whether sound should be enabled
     */
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.saveSoundPreference();
    }
    
    /**
     * Get current sound enabled state
     * @returns {boolean} - Whether sound is enabled
     */
    isSoundEnabled() {
        return this.soundEnabled;
    }
    
    /**
     * Save sound preference to localStorage
     */
    saveSoundPreference() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.soundEnabled));
        } catch (error) {
            console.warn('Failed to save sound preference:', error);
        }
    }
    
    /**
     * Load sound preference from localStorage
     */
    loadSoundPreference() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved !== null) {
                this.soundEnabled = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load sound preference:', error);
            this.soundEnabled = true; // Default to enabled
        }
    }
    
    /**
     * Create placeholder audio elements if they don't exist
     * This is useful for development when audio files might not be available
     */
    createPlaceholderAudioElements() {
        const soundFiles = {
            'generate-sound': 'assets/sounds/generate.mp3',
            'correct-sound': 'assets/sounds/correct.mp3',
            'button-click': 'assets/sounds/click.mp3'
        };
        
        Object.entries(soundFiles).forEach(([id, src]) => {
            let audio = document.getElementById(id);
            
            if (!audio) {
                // Create audio element if it doesn't exist
                audio = document.createElement('audio');
                audio.id = id;
                audio.src = src;
                audio.preload = 'auto';
                document.body.appendChild(audio);
                
                console.info(`Created placeholder audio element: ${id}`);
            }
            
            // Update our sounds reference
            const soundName = id.replace('-sound', '').replace('-', '-');
            if (soundName === 'generate') {
                this.sounds.generate = audio;
            } else if (soundName === 'correct') {
                this.sounds.correct = audio;
            } else if (soundName === 'button-click') {
                this.sounds['button-click'] = audio;
            }
        });
    }
    
    /**
     * Test all sound effects
     */
    testAllSounds() {
        console.log('Testing all sound effects...');
        
        const soundNames = Object.keys(this.sounds);
        let index = 0;
        
        const playNext = () => {
            if (index < soundNames.length) {
                const soundName = soundNames[index];
                console.log(`Playing sound: ${soundName}`);
                this.playSound(soundName);
                index++;
                setTimeout(playNext, 1000); // Wait 1 second between sounds
            } else {
                console.log('Sound test complete');
            }
        };
        
        playNext();
    }
    
    /**
     * Check if audio is supported by the browser
     * @returns {boolean} - Whether audio is supported
     */
    isAudioSupported() {
        return !!(document.createElement('audio').canPlayType);
    }
    
    /**
     * Get audio support information
     * @returns {Object} - Audio support information
     */
    getAudioSupportInfo() {
        const audio = document.createElement('audio');
        
        return {
            supported: this.isAudioSupported(),
            mp3: !!(audio.canPlayType && audio.canPlayType('audio/mpeg;').replace(/no/, '')),
            ogg: !!(audio.canPlayType && audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '')),
            wav: !!(audio.canPlayType && audio.canPlayType('audio/wav; codecs="1"').replace(/no/, '')),
            webm: !!(audio.canPlayType && audio.canPlayType('audio/webm; codecs="vorbis"').replace(/no/, ''))
        };
    }
    
    /**
     * Set volume for all sounds
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        
        Object.values(this.sounds).forEach(audio => {
            if (audio) {
                audio.volume = clampedVolume;
            }
        });
    }
    
    /**
     * Get current volume level
     * @returns {number} - Current volume level (0.0 to 1.0)
     */
    getVolume() {
        const firstAudio = Object.values(this.sounds).find(audio => audio);
        return firstAudio ? firstAudio.volume : 0.5;
    }
}
