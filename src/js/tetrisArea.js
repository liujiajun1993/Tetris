/*
* @Author: liujiajun
* @Date:   2017-02-27 09:51:25
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 11:23:29
*/

'use strict';

import Block from './block.js';
import {BLOCKSIZE, BLOCKTYPE} from './config';

/**
 * 俄罗斯方块画板
 */
class TetrisArea{
	constructor(){
		this.activeBlock = null;	//current dropping-down block
		this.noKeyPress = false;

		this.div = document.createElement('div');
		this.div.id = 'wrapper';
		document.body.append(this.div);

		window.onkeydown = this.onkeydown.bind(this);

		let style = window.getComputedStyle(this.div);
		this.width = parseInt(style.width);
		this.height = parseInt(style.height);
		this.blockWidth = this.width / BLOCKSIZE;	//以方格块数所计的宽度
		this.blockHeight = this.height / BLOCKSIZE;

		// this.border表示每一列的最大可用高度，方块触到之后就表示已经触底
		// 每次方块触底，该属性都需要通过this.getBorder更新
		this.border = [];
		this.border.length = this.blockWidth;
		this.border.fill(this.height);

		// this.inactiveBlocks记录掉到底部的方块
		// 共包含this.blockHeight个数组，每个数组表示该行的所有小方块
		// 当某行所拥有的小方块个数等于this.blockWidth时，消除该行
		this.inactiveBlocks = [];
		// this.inactiveBlocks.fill([]);	// 该方法错误，因为是用同一个[]填充，也就是说所有的子item都是指向同一个空数组
		for(let i = 0; i < this.blockHeight; i++){
			this.inactiveBlocks[i] = [];
		}

		this.startGame();
	}
	/**
	 * 产生下一个方格
	 */
	newActiveBlock(){
		let type = Math.floor(Math.random() * BLOCKTYPE.length);
		this.activeBlock = new Block({
			arr: BLOCKTYPE[type],
			parent: this
		});
		if(!this.activeBlock.canmove('down')){
			alert('Game Over');
			return;
		}
		this.blockDrop();	// 新建活动方块之后，活动方块开始下坠
		this.noKeyPress = false;
	}
	deleteActiveBlock(){
		this.activeBlock = null;
	}
	onkeydown(e){
		e.stopPropagation();
		e.preventDefault();
		if(this.noKeyPress){
			return false;
		}
		let key = e.keyCode;
		let direction;
		switch(key){
			case 37:
				direction = 'left';
				break;
			case 38: // up key
				direction = 'rotate';
				break;
			case 39:
				direction = 'right';
				break;
			case 40:
				direction = 'down';
				break;
			default:
				direction = 'left';
				break;
		}
		this.activeBlock && this.activeBlock.canmove(direction) && this.activeBlock.move(direction);
	}
	startGame(){
		this.newActiveBlock();
	}
	/**
	 * 返回已经被占领的位置
	 * 该返回结果为一个数组，长度为this.blockWidth, 每个item表示其对应的列可用的最大高度
	 * @return {Array}
	 */
	getBorder(){
		this.border.fill(this.height);
		let inactiveBlocksSim = [];
		for(let i = 0; i< this.blockHeight; i++){
			let currentRow = this.inactiveBlocks[i];
			for(let j = 0; j < currentRow.length; j++){
				let currentBlock = currentRow[j];
				inactiveBlocksSim.push({	// 遍历并格式化后加入inactiveBlocksSim数组
					left: parseInt(currentBlock.style.left),
					top: parseInt(currentBlock.style.top)
				});
			}
		}

		for(let i = 0; i < this.blockWidth; i++){			
			let columnArr = inactiveBlocksSim.filter((item) => {	// 找出第i列的所有元素
				return item.left / BLOCKSIZE === i;
			})
			if(columnArr.length <= 0){
				continue;
			}
			columnArr.sort((a,b) => {	// 按top从小到大排序
				return a.top - b.top;
			});
			columnArr[0] && (this.border[i] = columnArr[0].top);	// 如果该列有元素，更新可用高度
		}
	}
	/**
	 * 方块下坠
	 */
	blockDrop(){
		let timeout;
		let tmFunction = () => {
			if(this.activeBlock && this.activeBlock.canmove('down')){
				this.activeBlock.move('down');
				timeout = setTimeout(tmFunction, 500);
			}
			else{
				this.blockAtBottom();
			}
		}
		timeout = setTimeout(tmFunction, 500);
	}
	/**
	 * 方块到达底部的处理函数
	 */
	blockAtBottom(){
		this.noKeyPress = true;

		let currentBlocks = this.activeBlock.blockArr;
		for(let i = 0; i< currentBlocks.length; i++){	// 到达底部后，将当前活动方块全部加入inactiveBlocks
			let item = currentBlocks[i];
			item.className = 'block block-inactive';
			let topBlock = parseInt(item.style.top) / BLOCKSIZE;
			this.inactiveBlocks[topBlock].push(item);
		}
		if(this.calElinimate()){	// 如果有要消除的行，等待300ms后执行，留出300ms提示用户有行正在消除
			setTimeout(() => {
				this.getBorder();
				this.newActiveBlock();
			}, 1000);
		}
		else{
			this.getBorder();
			this.newActiveBlock();
		}
	}
	/**
	 * 计算是否有整行需要消除
	 * 当活动方块到达底部时运行
	 * @return {boolean} 是否有行需要消除
	 */
	calElinimate(){
		let fullWidth = this.blockWidth,
			eliminateCount = 0;
		for(let i = 0; i < this.blockHeight; i++){
			let currentRow = this.inactiveBlocks[i];
			if(currentRow.length === fullWidth){	// 该行已满需要消除
				this.beforeElinimateRow(i);	// 提示用户该行即将消除
				setTimeout(() => {
					this.elinimateRow(i);
				},100);
				eliminateCount++;
			}
		}
		return eliminateCount > 0;
	}
	/**
	 * 消除行之前闪烁
	 * @param  {number} rowNum 对应的行，从上往下从0行开始
	 */
	beforeElinimateRow(rowNum){
		let fullWidth = this.blockWidth;
		for(let i = 0; i < fullWidth; i++){
			this.inactiveBlocks[rowNum][i].className = 'block block-eliminate';
		}
	}
	/**
	 * 消除行
	 * @param  {number} rowNum 对应的行，从上往下从0行开始
	 */
	elinimateRow(rowNum){
		let fullWidth = this.blockWidth;
		for(let i = 0; i < fullWidth; i++){
			this.div.removeChild(this.inactiveBlocks[rowNum][i]);	//移除所有元素
		}
		for(let i = rowNum - 1; i > 0; i--){	// 上方所有行下移，并更新this.inactiveBlocks
			let currentRow = this.inactiveBlocks[i];
			for(let j = 0; j < currentRow.length; j++){
				currentRow[j].style.top = (parseInt(currentRow[j].style.top) + BLOCKSIZE )+ 'px';
			}
			this.inactiveBlocks[i + 1] = currentRow;
		}
		this.inactiveBlocks[0] = [];
	}
}

export default TetrisArea;