'kiwi public';

/** @module */

/**
 * Plays alert sounds
 */
export class AudioManager {
    constructor(audio) {
        this.lastPlayed = 0;
        this.audio = audio;
    }

    /** Play the alert sound */
    play() {
        // Only play the bleep once every 2 seconds
        if (!this.lastPlayed || Date.now() - this.lastPlayed > 2000) {
            this.audio.play();
            this.lastPlayed = Date.now();
        }
    }

    listen(state) {
        state.$on('audio.bleep', () => {
            this.play();
        });
    }

    /** Watch the Kiwi state for any message highlights and play an alert */
    listenForHighlights(state) {
        state.$on('message.new', (message, buffer) => {
            if (buffer.setting('mute_sound')) {
                return;
            }

            let ignoreTypes = [
                'connection',
                'traffic',
                'nick',
            ];
            if (ignoreTypes.indexOf(message.type) > -1) {
                return;
            }

            if (message.ignore) {
                return;
            }

            let isHighlight = message.isHighlight;
            let isActiveBuffer = state.getActiveBuffer() === buffer;
            let inFocus = isActiveBuffer && state.ui.app_has_focus;

            if (isHighlight || (buffer.isQuery() && !inFocus)) {
                this.play();
            }
        });
    }
}
