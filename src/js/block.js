/*
* @Author: liujiajun
* @Date:   2017-02-27 09:50:36
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 10:04:11
*/

'use strict';
import {BLOCKSIZE, STEPLENGTH} from './config.js';
/**
 * BLOCK类，每个BLOCK中包含多个小方块
 */
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

export default Block;