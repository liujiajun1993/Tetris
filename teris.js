/*
* @Author: liujiajun
* @Date:   2017-02-21 22:22:52
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 09:30:12
*/

'use strict';
const BLOCKSIZE = 30;
const STEPLENGTH = 30;

/*
 * 枚举所有的初始形状
 */
const blockType = {
	0: [[1,1,1],[1,0,0]],
	1: [[1,1],[0,1],[0,1]],
	2: [[0,0,1],[1,1,1]],
	3: [[1,0],[1,0],[1,1]],
	4: [[1,1,0], [0,1,1]],
	5: [[0,1],[1,1],[1,0]],
	6: [[1,1,1], [0,0,1]],
	7: [[0,1],[0,1],[1,1]],
	8: [[1,0,0],[1,1,1]],
	9: [[1,1],[1,0],[1,0]],
	10: [[1,1,1,1]],
	11: [[1],[1],[1],[1]],
	12: [[1,1],[1,1]],
	13: [[0,1,0],[1,1,1]],
	14: [[1,0],[1,1],[1,0]],
	15: [[1,1,1],[0,1,0]],
	16: [[0,1],[1,1], [0,1]],
	17: [[0,1,1], [1,1,0]],
	18: [[1,0],[1,1],[0,1]]
};

class Block{
	constructor(params){
		this.arr = params.arr;	// Block数组，表示该方块的形状
		this.parent = params.parent;	// 父对象
		this.height = this.arr.length * BLOCKSIZE;
		this.width = this.arr[0].length * BLOCKSIZE;
		this.blockArr = [];
		// 涂方块
		this._draw(0, 0);	
	}
	/**
	 * 根据arr画出该方块，[[1,0],[1,1]表示一个2*2方块，但是第一行第二个为空
	 * @param {number} originTop 方块的起始点
	 * @param {number} originLeft 方块的起始点
	 * @param {string} originClass 是否是重绘旋转方块，如果是，保持className不变
	 */
	_draw(originTop, originLeft, originClass){
		let height = this.arr.length,
		    width = this.arr[0].length,
		    tmpClassName = originClass ? originClass : 'block block-active-' + Math.floor(Math.random()*5);
		for(let i = 0; i < height; i++)
			for(let j = 0; j < width; j++){
				if(this.arr[i][j] == 1){
					let subBlock = document.createElement('div');
					subBlock.className = tmpClassName;
					subBlock.style.left = (j * BLOCKSIZE + originLeft) + 'px';
					subBlock.style.top = (i * BLOCKSIZE + originTop) + 'px';
					this.blockArr.push(subBlock);
					this.parent.div.appendChild(subBlock);
				}
			}
	}
	/**
	 * 方块进行旋转
	 * 保持整体左上角不变
	 */
	_rotate(){
		if(this.blockArr.length <= 0){
			return;
		}
		// 旋转时左上角的位置
		let left = parseInt(this.blockArr[0].style.left);
		let top = parseInt(this.blockArr[0].style.top);
		let originClass = this.blockArr[0].className;
		// 移除原来的所有小方格
		for(let i = 0, len = this.blockArr.length; i < len; i++){
			this.parent.div.removeChild(this.blockArr[i]);
		}
		this.blockArr.length = 0;

		this.arr = this._rotateArr(this.arr);// 旋转
		this._draw(top, left, originClass);// 重新绘制
	}
	/**
	 * 数组进行顺时针旋转
	 */
	_rotateArr(){
		let arr = [];
		let height = this.arr.length,
		    width = this.arr[0].length;
		for(let i = 0; i < width; i++){
			let tempArr = [];
			for(let j = height - 1; j >= 0; j--){
				tempArr.push(this.arr[j][i]);
			}
			arr.push(tempArr);
		}
		return arr;
	}
	/**
	 * 判断单个小方块是否可以向某方向移动
	 * @param {DOMElement} item 该小方块的引用
	 * @param  {string} direction 移动方向
	 * @return {boolean}           是否可以移动
	 */
	_canSingleMove(item, direction){
		let leftBlock = parseInt(item.style.left) / BLOCKSIZE;	//该小方块对应的列数
		let bottom = parseInt(item.style.top) + BLOCKSIZE;	// 该小方块的底部位置
		switch(direction){
			case 'left':
				return this.parent.border[leftBlock - 1] && (bottom <= this.parent.border[leftBlock - 1]);
			case 'right':
				return this.parent.border[leftBlock + 1] && (bottom <= this.parent.border[leftBlock + 1]);
			case 'down':
				return this.parent.border[leftBlock] && ((bottom + BLOCKSIZE) <= this.parent.border[leftBlock]);
			default:
				return false;
		}
	}
	/**
	 * 判断是否可以旋转
	 */
	_canRotate(){
		let afterArr = this._rotateArr(this.arr);
		let leftBlock = parseInt(this.blockArr[0].style.left) / BLOCKSIZE;
		let topBlock = parseInt(this.blockArr[0].style.top) / BLOCKSIZE;
		for(let i = 0, len1 = afterArr.length; i < len1; i++){	// 逐个判断旋转之后的位置是否超过边界
			let currentRow = afterArr[i];
			for(let j = 0, len2 = currentRow.length; j < len2; j++){
				let currentLeft = leftBlock + j,
				    currentBottom = topBlock + i + 1;
				if(currentLeft < 0 || currentLeft >= this.parent.blockWidth){	// 超出宽度
					return false;
				}
				if(currentBottom < 1 || currentBottom >= this.parent.blockHeight){ // 超出高度
					return false;
				}
				if(currentBottom > (this.parent.border[currentLeft] / BLOCKSIZE)){ // 超出可用高度
					return false;
				}
			}
		}
		return true;
	}
	/**
	 * 判断当前活动方块是否可以移动
	 * @param  {string} direction 移动方向
	 * @return {boolean}           是否可以移动
	 */
	canmove(direction){
		if(direction === 'rotate'){	// 如果是旋转
			return this._canRotate();
		}
		else{
			return this.blockArr.every((item) => {	// 判断包含的每一个小方块是否可以移动
				return this._canSingleMove(item, direction)
			});
		}		
	}
	/**
	 * 进行移动
	 * @param  {string} direction 移动方向
	 */
	move(direction){
		switch(direction){
			case 'left':
				this.blockArr.forEach((item) => {
					item.style.left = (parseInt(item.style.left) - STEPLENGTH) + 'px';
				});				
				break;
			case 'right':
				this.blockArr.forEach((item) => {
					item.style.left = (parseInt(item.style.left) + STEPLENGTH) + 'px';
				});
				break;
			case 'down':
				this.blockArr.forEach((item) => {
					item.style.top = (parseInt(item.style.top) + STEPLENGTH) + 'px';
				});
				break;
			case 'rotate':
				this._rotate();
				break;
			default:
				break;
		}
	}
}

class TerisArea{
	constructor(){
		this.activeBlock = null;	//current dropping-down block

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
		let type = Math.floor(Math.random() * 19);
		this.activeBlock = new Block({
			arr: blockType[type],
			parent: this
		});
		if(!this.activeBlock.canmove('down')){
			alert('Game Over');
			return;
		}
		this.blockDrop();	// 新建活动方块之后，活动方块开始下坠
	}
	deleteActiveBlock(){
		this.activeBlock = null;
	}
	onkeydown(e){
		e.stopPropagation();
		e.preventDefault();
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

window.onload = function(){
	setTimeout(function(){
		let terisArea = new TerisArea();
	},100);
	
}