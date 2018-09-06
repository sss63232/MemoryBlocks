import Blocks from './Blocks';

export default class Game {
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
                    sets: [1, 1, 1, 1],
                },
                {
                    name: 'wrong',
                    sets: [2, 2, 2, 2],
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

        //設定現在在的關卡跟播放間隔
        this.currentLevel = 0;
        this.playInterval = 400;
        this.mode = 'waiting';

        // HTML Element cache
        this.statusElem = document.getElementsByClassName(
            `status`
        )[0];
        this.blocksElem = document.getElementsByClassName(
            `blocks`
        )[0];

        this.blocksElem.addEventListener('click', e => {
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
        this.statusElem.textContent = message;
    }
    //開始遊戲（答案）
    startGame(answer) {
        this.mode = 'gamePlay';
        this.answer = answer;
        let notes = this.answer.split('');
        let self = this;

        this.showStatus('');
        this.timer = setInterval(() => {
            let char = notes.shift();
            if (!notes.length) {
                clearInterval(self.timer);
                self.startUserInput();
            }
            self.playNote(char);
        }, this.playInterval);
    }
    //播放音符
    playNote(note) {
        this.blocks.flash(note);
    }
    //開始輸入模式
    startUserInput() {
        this.userInput = '';
        this.mode = 'userInput';
    }
    //使用者輸入
    userSendInput(inputChar) {
        if (this.mode === 'userInput') {
            let tempString = this.userInput + inputChar;
            this.playNote(inputChar);
            this.showStatus(tempString);
            if (this.answer.indexOf(tempString) === 0) {
                if (this.answer === tempString) {
                    this.currentLevel += 1;
                    this.mode === 'waiting';
                    setTimeout(() => {
                        this.startLevel();
                    }, 1000);
                }
                this.userInput += inputChar;
            } else {
                this.currentLevel = 0;
                this.mode === 'reset';
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

        if (tempString === this.answer) {
            $('.inputStatus').addClass('correct');
            this.showMessage('Correct!');
            setTimeout(() => {
                this.blocks.turnOnAll();
                this.blocks.playSet('correct');
            }, 500);
        } else {
            $('.inputStatus').removeClass('correct');
        }
        if (tempString === '') {
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
