import Sound from '../components/Sound';

export default class Blocks {
    constructor(blockAssign, setAssign) {
        this.sound = new Sound();
        this.allOn = false;
        this.blocks = blockAssign.map((obj, i) => {
            const { name, selector, pitch } = obj;
            return {
                name,
                el: $(selector),
            };
        });
        this.soundSets = setAssign.reduce(
            (accumulator, currentValue) => {
                const { name, sets } = currentValue;
                accumulator[name] = sets;
                return accumulator;
            },
            {}
        );
    }

    //閃爍單一方塊＋聲音(方塊名)
    flash(note) {
        let block = this.blocks.find(
            block => block.name === note
        );
        if (block) {
            // block.audio.currentTime = 0;
            // block.audio.play();
            this.sound.playNote(note);

            block.el.addClass('active');
            setTimeout(() => {
                if (this.allOn === false) {
                    block.el.removeClass('active');
                }
            }, 100);
        }
    }

    //點亮所有方塊
    turnOnAll() {
        this.allOn = true;
        this.blocks.forEach(block => {
            block.el.addClass('active');
        });
    }
    //關掉所有方塊
    turnOffAll() {
        this.allOn = false;
        this.blocks.forEach(block => {
            block.el.removeClass('active');
        });
    }
    //播放序列聲音（成功/失敗...）
    playSet(type) {
        this.soundSets[type].forEach(note =>
            this.sound.playNote(note)
        );
    }
}
