/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

//--------------------------------
//          方塊 Class
//--------------------------------

class Blocks {
    constructor(blockAssign, setAssign) {
        this.allOn = false;
        this.blocks = blockAssign.map((obj, i) => {
            const { name, selector, pitch } = obj;
            return {
                name,
                el: $(selector),
                audio: this.getAudioObject(pitch),
            };
        });
        this.soundSets = setAssign.map((d, i) => {
            const { name, sets } = d;
            return {
                name,
                sets: sets.map(pitch =>
                    this.getAudioObject(pitch)
                ),
            };
        });
    }

    //閃爍單一方塊＋聲音(方塊名)
    flash(note) {
        let block = this.blocks.find(
            block => block.name === note
        );
        if (block) {
            block.audio.currentTime = 0;
            block.audio.play();
            block.el.addClass('active');
            setTimeout(() => {
                if (this.allOn == false) {
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
    //取得聲音物件
    getAudioObject(pitch) {
        return new Audio(
            'https://awiclass.monoame.com/pianosound/set/' +
                pitch +
                '.wav'
        );
    }
    //播放序列聲音（成功/失敗...）
    playSet(type) {
        this.soundSets
            .find(set => set.name == type)
            .sets.forEach(o => {
                o.currentTime = 0;
                o.play();
            });
    }
}

//--------------------------------
//          遊戲物件
//--------------------------------
class Game {
    constructor() {
        //定義關卡
        this.blocks = new Blocks(
            [
                {
                    selector: '.block1',
                    name: '1',
                    pitch: '1',
                },
                {
                    selector: '.block2',
                    name: '2',
                    pitch: '2',
                },
                {
                    selector: '.block3',
                    name: '3',
                    pitch: '3',
                },
                {
                    selector: '.block4',
                    name: '4',
                    pitch: '4',
                },
            ],
            [
                {
                    name: 'correct',
                    sets: [1, 3, 5, 8],
                },
                {
                    name: 'wrong',
                    sets: [2, 4, 5.5, 7],
                },
            ]
        );
        this.levels = [
            '1234',
            '12324',
            '231234',
            '41233412',
            '41323134132',
            '2342341231231423414232',
        ];
        let _this = this;
        //下載關卡
        $.ajax({
            url:
                'https://2017.awiclass.monoame.com/api/demo/memorygame/leveldata',
            success: function(res) {
                _this.levels = res;
            },
        });
        //設定現在在的關卡跟播放間隔
        this.currentLevel = 0;
        this.playInterval = 400;
        this.mode = 'waiting';

        document
            .getElementsByClassName(`blocks`)[0]
            .addEventListener('click', e => {
                const blockId = e.target.dataset.blockId;
                this.userSendInput(blockId);
            });
    }

    //開始關卡
    startLevel() {
        // console.log("start Level "+ this.currentLevel)
        this.showMessage('Level ' + this.currentLevel);
        this.startGame(this.levels[this.currentLevel]);
    }
    //顯示訊息
    showMessage(message) {
        console.log(message);
        $('.status').text(message);
    }
    //開始遊戲（答案）
    startGame(answer) {
        this.mode = 'gamePlay';
        this.answer = answer;
        let notes = this.answer.split('');
        let _this = this;

        this.showStatus('');
        this.timer = setInterval(function() {
            let char = notes.shift();
            if (!notes.length) {
                clearInterval(_this.timer);
                _this.startUserInput();
            }
            _this.playNote(char);
        }, this.playInterval);
    }
    //播放音符
    playNote(note) {
        console.log(note);
        this.blocks.flash(note);
    }
    //開始輸入模式
    startUserInput() {
        this.userInput = '';
        this.mode = 'userInput';
    }
    //使用者輸入
    userSendInput(inputChar) {
        if (this.mode == 'userInput') {
            let tempString = this.userInput + inputChar;
            this.playNote(inputChar);
            this.showStatus(tempString);
            if (this.answer.indexOf(tempString) == 0) {
                if (this.answer == tempString) {
                    this.currentLevel += 1;
                    this.mode == 'waiting';
                    setTimeout(() => {
                        this.startLevel();
                    }, 1000);
                }
                this.userInput += inputChar;
            } else {
                this.currentLevel = 0;
                this.mode == 'reset';
                setTimeout(() => {
                    this.startLevel();
                }, 1000);
            }
        }
    }
    //顯示回答狀態
    showStatus(tempString) {
        $('.inputStatus').html('');
        this.answer.split('').forEach((d, i) => {
            var circle = $("<div class='circle'></div>");
            if (i < tempString.length) {
                circle.addClass('correct');
            }
            $('.inputStatus').append(circle);
        });

        if (tempString == this.answer) {
            $('.inputStatus').addClass('correct');
            this.showMessage('Correct!');
            setTimeout(() => {
                this.blocks.turnOnAll();
                this.blocks.playSet('correct');
            }, 500);
        } else {
            $('.inputStatus').removeClass('correct');
        }
        if (tempString == '') {
            this.blocks.turnOffAll();
        }
        if (this.answer.indexOf(tempString) != 0) {
            this.showMessage('Wrong...');
            $('.inputStatus').addClass('wrong');
            this.blocks.turnOnAll();
            this.blocks.playSet('wrong');
        } else {
            $('.inputStatus').removeClass('wrong');
        }
    }
}

//--------------------
//     開新遊戲
var game = new Game();
setTimeout(() => {
    game.startLevel();
}, 1000);
