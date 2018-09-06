/**
 * Application entry point
 */

// Load application styles
import 'styles/index.scss';

//--------------------------------
//          遊戲物件
//--------------------------------

import Game from './components/Game';
//--------------------
//     開新遊戲
var game = new Game();
setTimeout(() => {
    game.startLevel();
}, 1000);
