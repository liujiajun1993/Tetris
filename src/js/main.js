/*
* @Author: liujiajun
* @Date:   2017-02-21 22:22:52
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 10:14:12
*/

import TetrisArea from './tetrisArea';
require('../style/normalize.css');
require('../style/tetris.css');

window.onload = function(){
	setTimeout(function(){
		let tetrisArea = new TetrisArea();
	},100);
	
}