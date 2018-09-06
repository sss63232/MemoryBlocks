import { Howl } from 'howler';
import soundJson from '../../assets/audio/sound.json';

export default class Sound {
    constructor() {
        this.player = new Howl(soundJson);
    }

    playNote(note) {
        this.player.play(note);
    }
}
