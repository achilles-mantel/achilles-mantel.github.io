/**
 * Sound Manager
 * 
 * Manages sound effects for the subtraction exercise.
 * Handles audio playback and user preferences.
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
        
        this.soundEnabled = this.loadSoundPreference();
        this.initializeSounds();
    }
    
    /**
     * Initialize sound elements and handle loading errors
     */
    initializeSounds() {
        Object.keys(this.sounds).forEach(soundName => {
            const soundElement = this.sounds[soundName];
            
            if (!soundElement) {
                console.warn(`Sound element not found: ${soundName}`);
                // Create a placeholder audio element
                this.sounds[soundName] = this.createPlaceholderAudio();
                return;
            }
            
            // Handle loading errors
            soundElement.addEventListener('error', (e) => {
                console.warn(`Failed to load sound: ${soundName}`, e);
                // Replace with placeholder
                this.sounds[soundName] = this.createPlaceholderAudio();
            });
            
            // Set volume
            soundElement.volume = 0.5;
            
            // Preload the audio
            soundElement.load();
        });
    }
    
    /**
     * Create a placeholder audio element for when sounds fail to load
     * @returns {Object} - Placeholder audio object
     */
    createPlaceholderAudio() {
        return {
            play: () => {
                // Silent placeholder - does nothing
                return Promise.resolve();
            },
            pause: () => {},
            load: () => {},
            volume: 0.5
        };
    }
    
    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    playSound(soundName) {
        if (!this.soundEnabled) {
            return;
        }
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }
        
        try {
            // Reset the sound to the beginning
            sound.currentTime = 0;
            
            // Play the sound
            const playPromise = sound.play();
            
            // Handle browsers that return a promise
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Failed to play sound: ${soundName}`, error);
                });
            }
        } catch (error) {
            console.warn(`Error playing sound: ${soundName}`, error);
        }
    }
    
    /**
     * Enable or disable sound effects
     * @param {boolean} enabled - Whether sounds should be enabled
     */
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        this.saveSoundPreference(enabled);
    }
    
    /**
     * Check if sounds are currently enabled
     * @returns {boolean} - True if sounds are enabled
     */
    isSoundEnabled() {
        return this.soundEnabled;
    }
    
    /**
     * Toggle sound on/off
     * @returns {boolean} - New sound enabled state
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSoundPreference(this.soundEnabled);
        return this.soundEnabled;
    }
    
    /**
     * Set the volume for all sounds
     * @param {number} volume - Volume level (0.0 to 1.0)
     */
    setVolume(volume) {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        
        Object.values(this.sounds).forEach(sound => {
            if (sound && typeof sound.volume !== 'undefined') {
                sound.volume = clampedVolume;
            }
        });
        
        // Save volume preference
        try {
            localStorage.setItem('subtraction-exercise-volume', clampedVolume.toString());
        } catch (error) {
            console.warn('Failed to save volume preference:', error);
        }
    }
    
    /**
     * Get the current volume level
     * @returns {number} - Current volume level (0.0 to 1.0)
     */
    getVolume() {
        const firstSound = Object.values(this.sounds)[0];
        return firstSound && typeof firstSound.volume !== 'undefined' ? firstSound.volume : 0.5;
    }
    
    /**
     * Load sound preference from localStorage
     * @returns {boolean} - Saved sound preference or default (true)
     */
    loadSoundPreference() {
        try {
            const saved = localStorage.getItem('subtraction-exercise-sound-enabled');
            if (saved !== null) {
                return saved === 'true';
            }
        } catch (error) {
            console.warn('Failed to load sound preference:', error);
        }
        
        // Default to enabled
        return true;
    }
    
    /**
     * Save sound preference to localStorage
     * @param {boolean} enabled - Whether sounds are enabled
     */
    saveSoundPreference(enabled) {
        try {
            localStorage.setItem('subtraction-exercise-sound-enabled', enabled.toString());
        } catch (error) {
            console.warn('Failed to save sound preference:', error);
        }
    }
    
    /**
     * Load volume preference from localStorage
     * @returns {number} - Saved volume level or default (0.5)
     */
    loadVolumePreference() {
        try {
            const saved = localStorage.getItem('subtraction-exercise-volume');
            if (saved !== null) {
                const volume = parseFloat(saved);
                if (!isNaN(volume) && volume >= 0 && volume <= 1) {
                    return volume;
                }
            }
        } catch (error) {
            console.warn('Failed to load volume preference:', error);
        }
        
        // Default volume
        return 0.5;
    }
    
    /**
     * Test if audio is supported in the browser
     * @returns {boolean} - True if audio is supported
     */
    isAudioSupported() {
        try {
            return !!(window.Audio || window.HTMLAudioElement);
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Get information about sound support and current state
     * @returns {Object} - Sound system information
     */
    getSoundInfo() {
        return {
            supported: this.isAudioSupported(),
            enabled: this.soundEnabled,
            volume: this.getVolume(),
            soundsLoaded: Object.keys(this.sounds).length,
            soundNames: Object.keys(this.sounds)
        };
    }
    
    /**
     * Preload all sounds (useful for mobile devices)
     */
    preloadSounds() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && typeof sound.load === 'function') {
                try {
                    sound.load();
                } catch (error) {
                    console.warn('Failed to preload sound:', error);
                }
            }
        });
    }
    
    /**
     * Clean up resources (call when the exercise is being destroyed)
     */
    cleanup() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && typeof sound.pause === 'function') {
                try {
                    sound.pause();
                } catch (error) {
                    console.warn('Failed to pause sound during cleanup:', error);
                }
            }
        });
    }
}
