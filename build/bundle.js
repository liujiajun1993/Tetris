/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "73930e8e0bf5b83945f8"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotMainModule = true; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			hotMainModule = false;
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		Object.defineProperty(fn, "e", {
/******/ 			enumerable: true,
/******/ 			value: function(chunkId) {
/******/ 				if(hotStatus === "ready")
/******/ 					hotSetStatus("prepare");
/******/ 				hotChunksLoading++;
/******/ 				return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 					finishChunkLoading();
/******/ 					throw err;
/******/ 				});
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		});
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotMainModule,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotMainModule = true;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(5)(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BLOCKTYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BLOCKSIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return STEPLENGTH; });
/*
* @Author: liujiajun
* @Date:   2017-02-27 09:49:37
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 10:11:59
*/



const BLOCKSIZE = 30; // 方块大小
const STEPLENGTH = 30;

/*
 * 枚举所有的初始形状
 */
const BLOCKTYPE = [[[1, 1, 1], [1, 0, 0]], [[1, 1], [0, 1], [0, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 0], [1, 0], [1, 1]], [[1, 1, 0], [0, 1, 1]], [[0, 1], [1, 1], [1, 0]], [[1, 1, 1], [0, 0, 1]], [[0, 1], [0, 1], [1, 1]], [[1, 0, 0], [1, 1, 1]], [[1, 1], [1, 0], [1, 0]], [[1, 1, 1, 1]], [[1], [1], [1], [1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0], [1, 1], [1, 0]], [[1, 1, 1], [0, 1, 0]], [[0, 1], [1, 1], [0, 1]], [[0, 1, 1], [1, 1, 0]], [[1, 0], [1, 1], [0, 1]]];



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(0);
/*
* @Author: liujiajun
* @Date:   2017-02-27 09:51:25
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 16:45:37
*/






/**
 * 俄罗斯方块画板
 */
class TetrisArea {
	constructor() {
		this.activeBlock = null; //current dropping-down block
		this.noKeyPress = false;

		this.div = document.createElement('div');
		this.div.id = 'wrapper';
		document.body.append(this.div);

		window.onkeydown = this.onkeydown.bind(this);

		let style = window.getComputedStyle(this.div);
		this.width = parseInt(style.width);
		this.height = parseInt(style.height);
		this.blockWidth = this.width / __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCKSIZE */]; //以方格块数所计的宽度
		this.blockHeight = this.height / __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCKSIZE */];

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
		for (let i = 0; i < this.blockHeight; i++) {
			this.inactiveBlocks[i] = [];
		}

		this.startGame();
	}
	/**
  * 产生下一个方格
  */
	newActiveBlock() {
		let type = Math.floor(Math.random() * __WEBPACK_IMPORTED_MODULE_1__config__["b" /* BLOCKTYPE */].length);
		this.activeBlock = new __WEBPACK_IMPORTED_MODULE_0__block_js__["a" /* default */]({
			arr: __WEBPACK_IMPORTED_MODULE_1__config__["b" /* BLOCKTYPE */][type],
			parent: this
		});
		if (!this.activeBlock.canmove('down')) {
			alert('Game Over');
			return;
		}
		this.blockDrop(); // 新建活动方块之后，活动方块开始下坠
		this.noKeyPress = false;
	}
	deleteActiveBlock() {
		this.activeBlock = null;
	}
	onkeydown(e) {
		e.stopPropagation();
		e.preventDefault();
		if (this.noKeyPress) {
			return false;
		}
		let key = e.keyCode;
		let direction;
		switch (key) {
			case 37:
				direction = 'left';
				break;
			case 38:
				// up key
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
	startGame() {
		this.newActiveBlock();
	}
	/**
  * 返回已经被占领的位置
  * 该返回结果为一个数组，长度为this.blockWidth, 每个item表示其对应的列可用的最大高度
  * @return {Array}
  */
	getBorder() {
		this.border.fill(this.height);
		let inactiveBlocksSim = [];
		for (let i = 0; i < this.blockHeight; i++) {
			let currentRow = this.inactiveBlocks[i];
			for (let j = 0; j < currentRow.length; j++) {
				let currentBlock = currentRow[j];
				let currentLeft = parseInt(currentBlock.style.left),
				    currentTop = parseInt(currentBlock.style.top);

				if (currentTop >= this.height) {
					// 对于超出边界之外的小方块，直接删除
					this.div.removeChild(currentBlock);
					continue;
				}

				inactiveBlocksSim.push({ // 遍历并格式化后加入inactiveBlocksSim数组
					left: currentLeft,
					top: currentTop
				});
			}
		}

		for (let i = 0; i < this.blockWidth; i++) {
			let columnArr = inactiveBlocksSim.filter(item => {
				// 找出第i列的所有元素
				return item.left / __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCKSIZE */] === i;
			});
			if (columnArr.length <= 0) {
				continue;
			}
			columnArr.sort((a, b) => {
				// 按top从小到大排序
				return a.top - b.top;
			});
			columnArr[0] && (this.border[i] = columnArr[0].top); // 如果该列有元素，更新可用高度
		}
	}
	/**
  * 方块下坠
  */
	blockDrop() {
		let timeout;
		let tmFunction = () => {
			if (this.activeBlock && this.activeBlock.canmove('down')) {
				this.activeBlock.move('down');
				timeout = setTimeout(tmFunction, 500);
			} else {
				this.blockAtBottom();
			}
		};
		timeout = setTimeout(tmFunction, 500);
	}
	/**
  * 方块到达底部的处理函数
  */
	blockAtBottom() {
		this.noKeyPress = true;

		let currentBlocks = this.activeBlock.blockArr;
		for (let i = 0; i < currentBlocks.length; i++) {
			// 到达底部后，将当前活动方块全部加入inactiveBlocks
			let item = currentBlocks[i];
			item.className = 'block block-inactive';
			let topBlock = parseInt(item.style.top) / __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCKSIZE */];
			this.inactiveBlocks[topBlock].push(item);
		}
		if (this.calElinimate()) {
			// 如果有要消除的行，等待300ms后执行，留出300ms提示用户有行正在消除
			setTimeout(() => {
				this.getBorder();
				this.newActiveBlock();
			}, 1000);
		} else {
			this.getBorder();
			this.newActiveBlock();
		}
	}
	/**
  * 计算是否有整行需要消除
  * 当活动方块到达底部时运行
  * @return {boolean} 是否有行需要消除
  */
	calElinimate() {
		let fullWidth = this.blockWidth,
		    eliminateArr = []; // rowNum to be eliminated

		for (let i = 0; i < this.blockHeight; i++) {
			let currentRow = this.inactiveBlocks[i];
			if (currentRow.length >= fullWidth) {
				// 该行已满需要消除
				this.beforeElinimateRow(i); // 提示用户该行即将消除
				eliminateArr.push(i);
			}
		}
		let len = eliminateArr.length;
		if (len) {
			setTimeout(() => {
				for (let i = 0; i < len; i++) this.elinimateRow(eliminateArr[i]);
			}, 100);
		}

		return len > 0;
	}
	/**
  * 消除行之前闪烁
  * @param  {number} rowNum 对应的行，从上往下从0行开始
  */
	beforeElinimateRow(rowNum) {
		let fullWidth = this.blockWidth;
		for (let i = 0; i < fullWidth; i++) {
			this.inactiveBlocks[rowNum][i].className = 'block block-eliminate';
		}
	}
	/**
  * 消除行
  * @param  {number} rowNum 对应的行，从上往下从0行开始
  */
	elinimateRow(rowNum) {
		let fullWidth = this.blockWidth;
		for (let i = 0; i < fullWidth; i++) {
			this.div.removeChild(this.inactiveBlocks[rowNum][i]); //移除所有元素
		}
		for (let i = rowNum - 1; i >= 0; i--) {
			// 上方所有行下移，并更新this.inactiveBlocks
			let currentRow = this.inactiveBlocks[i];
			for (let j = 0; j < currentRow.length; j++) {
				currentRow[j].style.top = parseInt(currentRow[j].style.top) + __WEBPACK_IMPORTED_MODULE_1__config__["a" /* BLOCKSIZE */] + 'px';
			}
			this.inactiveBlocks[i + 1] = currentRow;
		}
		this.inactiveBlocks[0] = [];
	}
}

/* harmony default export */ __webpack_exports__["a"] = TetrisArea;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_js__ = __webpack_require__(0);
/*
* @Author: liujiajun
* @Date:   2017-02-27 09:50:36
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 10:04:11
*/




/**
 * BLOCK类，每个BLOCK中包含多个小方块
 */
class Block {
	constructor(params) {
		this.arr = params.arr; // Block数组，表示该方块的形状
		this.parent = params.parent; // 父对象
		this.height = this.arr.length * __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */];
		this.width = this.arr[0].length * __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */];
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
	_draw(originTop, originLeft, originClass) {
		let height = this.arr.length,
		    width = this.arr[0].length,
		    tmpClassName = originClass ? originClass : 'block block-active-' + Math.floor(Math.random() * 5);
		for (let i = 0; i < height; i++) for (let j = 0; j < width; j++) {
			if (this.arr[i][j] == 1) {
				let subBlock = document.createElement('div');
				subBlock.className = tmpClassName;
				subBlock.style.left = j * __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */] + originLeft + 'px';
				subBlock.style.top = i * __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */] + originTop + 'px';
				this.blockArr.push(subBlock);
				this.parent.div.appendChild(subBlock);
			}
		}
	}
	/**
  * 方块进行旋转
  * 保持整体左上角不变
  */
	_rotate() {
		if (this.blockArr.length <= 0) {
			return;
		}
		// 旋转时左上角的位置
		let left = parseInt(this.blockArr[0].style.left);
		let top = parseInt(this.blockArr[0].style.top);
		let originClass = this.blockArr[0].className;
		// 移除原来的所有小方格
		for (let i = 0, len = this.blockArr.length; i < len; i++) {
			this.parent.div.removeChild(this.blockArr[i]);
		}
		this.blockArr.length = 0;

		this.arr = this._rotateArr(this.arr); // 旋转
		this._draw(top, left, originClass); // 重新绘制
	}
	/**
  * 数组进行顺时针旋转
  */
	_rotateArr() {
		let arr = [];
		let height = this.arr.length,
		    width = this.arr[0].length;
		for (let i = 0; i < width; i++) {
			let tempArr = [];
			for (let j = height - 1; j >= 0; j--) {
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
	_canSingleMove(item, direction) {
		let leftBlock = parseInt(item.style.left) / __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */]; //该小方块对应的列数
		let bottom = parseInt(item.style.top) + __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */]; // 该小方块的底部位置
		switch (direction) {
			case 'left':
				return this.parent.border[leftBlock - 1] && bottom <= this.parent.border[leftBlock - 1];
			case 'right':
				return this.parent.border[leftBlock + 1] && bottom <= this.parent.border[leftBlock + 1];
			case 'down':
				return this.parent.border[leftBlock] && bottom + __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */] <= this.parent.border[leftBlock];
			default:
				return false;
		}
	}
	/**
  * 判断是否可以旋转
  */
	_canRotate() {
		let afterArr = this._rotateArr(this.arr);
		let leftBlock = parseInt(this.blockArr[0].style.left) / __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */];
		let topBlock = parseInt(this.blockArr[0].style.top) / __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */];
		for (let i = 0, len1 = afterArr.length; i < len1; i++) {
			// 逐个判断旋转之后的位置是否超过边界
			let currentRow = afterArr[i];
			for (let j = 0, len2 = currentRow.length; j < len2; j++) {
				let currentLeft = leftBlock + j,
				    currentBottom = topBlock + i + 1;
				if (currentLeft < 0 || currentLeft >= this.parent.blockWidth) {
					// 超出宽度
					return false;
				}
				if (currentBottom < 1 || currentBottom >= this.parent.blockHeight) {
					// 超出高度
					return false;
				}
				if (currentBottom > this.parent.border[currentLeft] / __WEBPACK_IMPORTED_MODULE_0__config_js__["a" /* BLOCKSIZE */]) {
					// 超出可用高度
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
	canmove(direction) {
		if (direction === 'rotate') {
			// 如果是旋转
			return this._canRotate();
		} else {
			return this.blockArr.every(item => {
				// 判断包含的每一个小方块是否可以移动
				return this._canSingleMove(item, direction);
			});
		}
	}
	/**
  * 进行移动
  * @param  {string} direction 移动方向
  */
	move(direction) {
		switch (direction) {
			case 'left':
				this.blockArr.forEach(item => {
					item.style.left = parseInt(item.style.left) - __WEBPACK_IMPORTED_MODULE_0__config_js__["c" /* STEPLENGTH */] + 'px';
				});
				break;
			case 'right':
				this.blockArr.forEach(item => {
					item.style.left = parseInt(item.style.left) + __WEBPACK_IMPORTED_MODULE_0__config_js__["c" /* STEPLENGTH */] + 'px';
				});
				break;
			case 'down':
				this.blockArr.forEach(item => {
					item.style.top = parseInt(item.style.top) + __WEBPACK_IMPORTED_MODULE_0__config_js__["c" /* STEPLENGTH */] + 'px';
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

/* harmony default export */ __webpack_exports__["a"] = Block;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tetrisArea__ = __webpack_require__(1);
/*
* @Author: liujiajun
* @Date:   2017-02-21 22:22:52
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 10:14:12
*/


__webpack_require__(2);
__webpack_require__(3);

window.onload = function () {
	setTimeout(function () {
		let tetrisArea = new __WEBPACK_IMPORTED_MODULE_0__tetrisArea__["a" /* default */]();
	}, 100);
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzM5MzBlOGUwYmY1YjgzOTQ1ZjgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdGV0cmlzQXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvdGV0cmlzLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvYmxvY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21haW4uanMiXSwibmFtZXMiOlsiQkxPQ0tTSVpFIiwiU1RFUExFTkdUSCIsIkJMT0NLVFlQRSIsIlRldHJpc0FyZWEiLCJjb25zdHJ1Y3RvciIsImFjdGl2ZUJsb2NrIiwibm9LZXlQcmVzcyIsImRpdiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiYm9keSIsImFwcGVuZCIsIndpbmRvdyIsIm9ua2V5ZG93biIsImJpbmQiLCJzdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJ3aWR0aCIsInBhcnNlSW50IiwiaGVpZ2h0IiwiYmxvY2tXaWR0aCIsImJsb2NrSGVpZ2h0IiwiYm9yZGVyIiwibGVuZ3RoIiwiZmlsbCIsImluYWN0aXZlQmxvY2tzIiwiaSIsInN0YXJ0R2FtZSIsIm5ld0FjdGl2ZUJsb2NrIiwidHlwZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImFyciIsInBhcmVudCIsImNhbm1vdmUiLCJhbGVydCIsImJsb2NrRHJvcCIsImRlbGV0ZUFjdGl2ZUJsb2NrIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0Iiwia2V5Iiwia2V5Q29kZSIsImRpcmVjdGlvbiIsIm1vdmUiLCJnZXRCb3JkZXIiLCJpbmFjdGl2ZUJsb2Nrc1NpbSIsImN1cnJlbnRSb3ciLCJqIiwiY3VycmVudEJsb2NrIiwiY3VycmVudExlZnQiLCJsZWZ0IiwiY3VycmVudFRvcCIsInRvcCIsInJlbW92ZUNoaWxkIiwicHVzaCIsImNvbHVtbkFyciIsImZpbHRlciIsIml0ZW0iLCJzb3J0IiwiYSIsImIiLCJ0aW1lb3V0IiwidG1GdW5jdGlvbiIsInNldFRpbWVvdXQiLCJibG9ja0F0Qm90dG9tIiwiY3VycmVudEJsb2NrcyIsImJsb2NrQXJyIiwiY2xhc3NOYW1lIiwidG9wQmxvY2siLCJjYWxFbGluaW1hdGUiLCJmdWxsV2lkdGgiLCJlbGltaW5hdGVBcnIiLCJiZWZvcmVFbGluaW1hdGVSb3ciLCJsZW4iLCJlbGluaW1hdGVSb3ciLCJyb3dOdW0iLCJCbG9jayIsInBhcmFtcyIsIl9kcmF3Iiwib3JpZ2luVG9wIiwib3JpZ2luTGVmdCIsIm9yaWdpbkNsYXNzIiwidG1wQ2xhc3NOYW1lIiwic3ViQmxvY2siLCJhcHBlbmRDaGlsZCIsIl9yb3RhdGUiLCJfcm90YXRlQXJyIiwidGVtcEFyciIsIl9jYW5TaW5nbGVNb3ZlIiwibGVmdEJsb2NrIiwiYm90dG9tIiwiX2NhblJvdGF0ZSIsImFmdGVyQXJyIiwibGVuMSIsImxlbjIiLCJjdXJyZW50Qm90dG9tIiwiZXZlcnkiLCJmb3JFYWNoIiwicmVxdWlyZSIsIm9ubG9hZCIsInRldHJpc0FyZWEiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQSxtQ0FBMkI7QUFDM0IscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBLDREQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBLGFBQUs7QUFDTCxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBYyw0QkFBNEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQWdCLHVDQUF1QztBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFlLHVDQUF1QztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWUsc0JBQXNCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFhLHdDQUF3QztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBLDhDQUFzQyx1QkFBdUI7O0FBRTdEO0FBQ0E7Ozs7Ozs7Ozs7QUNuc0JBO0FBQUE7Ozs7Ozs7QUFPQTs7QUFDQSxNQUFNQSxZQUFhLEVBQW5CLEMsQ0FBdUI7QUFDdkIsTUFBTUMsYUFBYSxFQUFuQjs7QUFFQTs7O0FBR0EsTUFBTUMsWUFBWSxDQUNqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFULENBRGlCLEVBRWpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFiLENBRmlCLEVBR2pCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVQsQ0FIaUIsRUFJakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILENBQWIsQ0FKaUIsRUFLakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVUsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVixDQUxpQixFQU1qQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBYixDQU5pQixFQU9qQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUQsRUFBVSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFWLENBUGlCLEVBUWpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFiLENBUmlCLEVBU2pCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVQsQ0FUaUIsRUFVakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILENBQWIsQ0FWaUIsRUFXakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxFQUFPLENBQVAsQ0FBRCxDQVhpQixFQVlqQixDQUFDLENBQUMsQ0FBRCxDQUFELEVBQUssQ0FBQyxDQUFELENBQUwsRUFBUyxDQUFDLENBQUQsQ0FBVCxFQUFhLENBQUMsQ0FBRCxDQUFiLENBWmlCLEVBYWpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQLENBYmlCLEVBY2pCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVQsQ0FkaUIsRUFlakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILENBQWIsQ0FmaUIsRUFnQmpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVQsQ0FoQmlCLEVBaUJqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxFQUFjLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBZCxDQWpCaUIsRUFrQmpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFVLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVYsQ0FsQmlCLEVBbUJqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBYixDQW5CaUIsQ0FBbEI7Ozs7Ozs7Ozs7QUNkQTtBQUFBOzs7Ozs7O0FBT0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0EsTUFBTUMsVUFBTixDQUFnQjtBQUNmQyxlQUFhO0FBQ1osT0FBS0MsV0FBTCxHQUFtQixJQUFuQixDQURZLENBQ2E7QUFDekIsT0FBS0MsVUFBTCxHQUFrQixLQUFsQjs7QUFFQSxPQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWDtBQUNBLE9BQUtGLEdBQUwsQ0FBU0csRUFBVCxHQUFjLFNBQWQ7QUFDQUYsV0FBU0csSUFBVCxDQUFjQyxNQUFkLENBQXFCLEtBQUtMLEdBQTFCOztBQUVBTSxTQUFPQyxTQUFQLEdBQW1CLEtBQUtBLFNBQUwsQ0FBZUMsSUFBZixDQUFvQixJQUFwQixDQUFuQjs7QUFFQSxNQUFJQyxRQUFRSCxPQUFPSSxnQkFBUCxDQUF3QixLQUFLVixHQUE3QixDQUFaO0FBQ0EsT0FBS1csS0FBTCxHQUFhQyxTQUFTSCxNQUFNRSxLQUFmLENBQWI7QUFDQSxPQUFLRSxNQUFMLEdBQWNELFNBQVNILE1BQU1JLE1BQWYsQ0FBZDtBQUNBLE9BQUtDLFVBQUwsR0FBa0IsS0FBS0gsS0FBTCxHQUFhLDBEQUEvQixDQWJZLENBYThCO0FBQzFDLE9BQUtJLFdBQUwsR0FBbUIsS0FBS0YsTUFBTCxHQUFjLDBEQUFqQzs7QUFFQTtBQUNBO0FBQ0EsT0FBS0csTUFBTCxHQUFjLEVBQWQ7QUFDQSxPQUFLQSxNQUFMLENBQVlDLE1BQVosR0FBcUIsS0FBS0gsVUFBMUI7QUFDQSxPQUFLRSxNQUFMLENBQVlFLElBQVosQ0FBaUIsS0FBS0wsTUFBdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBS00sY0FBTCxHQUFzQixFQUF0QjtBQUNBO0FBQ0EsT0FBSSxJQUFJQyxJQUFJLENBQVosRUFBZUEsSUFBSSxLQUFLTCxXQUF4QixFQUFxQ0ssR0FBckMsRUFBeUM7QUFDeEMsUUFBS0QsY0FBTCxDQUFvQkMsQ0FBcEIsSUFBeUIsRUFBekI7QUFDQTs7QUFFRCxPQUFLQyxTQUFMO0FBQ0E7QUFDRDs7O0FBR0FDLGtCQUFnQjtBQUNmLE1BQUlDLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFnQiwwREFBQS9CLENBQVVzQixNQUFyQyxDQUFYO0FBQ0EsT0FBS25CLFdBQUwsR0FBbUIsSUFBSSwwREFBSixDQUFVO0FBQzVCNkIsUUFBSywwREFBQWhDLENBQVU0QixJQUFWLENBRHVCO0FBRTVCSyxXQUFRO0FBRm9CLEdBQVYsQ0FBbkI7QUFJQSxNQUFHLENBQUMsS0FBSzlCLFdBQUwsQ0FBaUIrQixPQUFqQixDQUF5QixNQUF6QixDQUFKLEVBQXFDO0FBQ3BDQyxTQUFNLFdBQU47QUFDQTtBQUNBO0FBQ0QsT0FBS0MsU0FBTCxHQVZlLENBVUc7QUFDbEIsT0FBS2hDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQTtBQUNEaUMscUJBQW1CO0FBQ2xCLE9BQUtsQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0E7QUFDRFMsV0FBVTBCLENBQVYsRUFBWTtBQUNYQSxJQUFFQyxlQUFGO0FBQ0FELElBQUVFLGNBQUY7QUFDQSxNQUFHLEtBQUtwQyxVQUFSLEVBQW1CO0FBQ2xCLFVBQU8sS0FBUDtBQUNBO0FBQ0QsTUFBSXFDLE1BQU1ILEVBQUVJLE9BQVo7QUFDQSxNQUFJQyxTQUFKO0FBQ0EsVUFBT0YsR0FBUDtBQUNDLFFBQUssRUFBTDtBQUNDRSxnQkFBWSxNQUFaO0FBQ0E7QUFDRCxRQUFLLEVBQUw7QUFBUztBQUNSQSxnQkFBWSxRQUFaO0FBQ0E7QUFDRCxRQUFLLEVBQUw7QUFDQ0EsZ0JBQVksT0FBWjtBQUNBO0FBQ0QsUUFBSyxFQUFMO0FBQ0NBLGdCQUFZLE1BQVo7QUFDQTtBQUNEO0FBQ0NBLGdCQUFZLE1BQVo7QUFDQTtBQWZGO0FBaUJBLE9BQUt4QyxXQUFMLElBQW9CLEtBQUtBLFdBQUwsQ0FBaUIrQixPQUFqQixDQUF5QlMsU0FBekIsQ0FBcEIsSUFBMkQsS0FBS3hDLFdBQUwsQ0FBaUJ5QyxJQUFqQixDQUFzQkQsU0FBdEIsQ0FBM0Q7QUFDQTtBQUNEakIsYUFBVztBQUNWLE9BQUtDLGNBQUw7QUFDQTtBQUNEOzs7OztBQUtBa0IsYUFBVztBQUNWLE9BQUt4QixNQUFMLENBQVlFLElBQVosQ0FBaUIsS0FBS0wsTUFBdEI7QUFDQSxNQUFJNEIsb0JBQW9CLEVBQXhCO0FBQ0EsT0FBSSxJQUFJckIsSUFBSSxDQUFaLEVBQWVBLElBQUcsS0FBS0wsV0FBdkIsRUFBb0NLLEdBQXBDLEVBQXdDO0FBQ3ZDLE9BQUlzQixhQUFhLEtBQUt2QixjQUFMLENBQW9CQyxDQUFwQixDQUFqQjtBQUNBLFFBQUksSUFBSXVCLElBQUksQ0FBWixFQUFlQSxJQUFJRCxXQUFXekIsTUFBOUIsRUFBc0MwQixHQUF0QyxFQUEwQztBQUN6QyxRQUFJQyxlQUFlRixXQUFXQyxDQUFYLENBQW5CO0FBQ0EsUUFBSUUsY0FBY2pDLFNBQVNnQyxhQUFhbkMsS0FBYixDQUFtQnFDLElBQTVCLENBQWxCO0FBQUEsUUFDSUMsYUFBYW5DLFNBQVNnQyxhQUFhbkMsS0FBYixDQUFtQnVDLEdBQTVCLENBRGpCOztBQUdBLFFBQUdELGNBQWMsS0FBS2xDLE1BQXRCLEVBQTZCO0FBQUU7QUFDOUIsVUFBS2IsR0FBTCxDQUFTaUQsV0FBVCxDQUFxQkwsWUFBckI7QUFDQTtBQUNBOztBQUVESCxzQkFBa0JTLElBQWxCLENBQXVCLEVBQUU7QUFDeEJKLFdBQU1ELFdBRGdCO0FBRXRCRyxVQUFLRDtBQUZpQixLQUF2QjtBQUlBO0FBQ0Q7O0FBRUQsT0FBSSxJQUFJM0IsSUFBSSxDQUFaLEVBQWVBLElBQUksS0FBS04sVUFBeEIsRUFBb0NNLEdBQXBDLEVBQXdDO0FBQ3ZDLE9BQUkrQixZQUFZVixrQkFBa0JXLE1BQWxCLENBQTBCQyxJQUFELElBQVU7QUFBRTtBQUNwRCxXQUFPQSxLQUFLUCxJQUFMLEdBQVksMERBQVosS0FBMEIxQixDQUFqQztBQUNBLElBRmUsQ0FBaEI7QUFHQSxPQUFHK0IsVUFBVWxDLE1BQVYsSUFBb0IsQ0FBdkIsRUFBeUI7QUFDeEI7QUFDQTtBQUNEa0MsYUFBVUcsSUFBVixDQUFlLENBQUNDLENBQUQsRUFBR0MsQ0FBSCxLQUFTO0FBQUU7QUFDekIsV0FBT0QsRUFBRVAsR0FBRixHQUFRUSxFQUFFUixHQUFqQjtBQUNBLElBRkQ7QUFHQUcsYUFBVSxDQUFWLE1BQWlCLEtBQUtuQyxNQUFMLENBQVlJLENBQVosSUFBaUIrQixVQUFVLENBQVYsRUFBYUgsR0FBL0MsRUFWdUMsQ0FVYztBQUNyRDtBQUNEO0FBQ0Q7OztBQUdBakIsYUFBVztBQUNWLE1BQUkwQixPQUFKO0FBQ0EsTUFBSUMsYUFBYSxNQUFNO0FBQ3RCLE9BQUcsS0FBSzVELFdBQUwsSUFBb0IsS0FBS0EsV0FBTCxDQUFpQitCLE9BQWpCLENBQXlCLE1BQXpCLENBQXZCLEVBQXdEO0FBQ3ZELFNBQUsvQixXQUFMLENBQWlCeUMsSUFBakIsQ0FBc0IsTUFBdEI7QUFDQWtCLGNBQVVFLFdBQVdELFVBQVgsRUFBdUIsR0FBdkIsQ0FBVjtBQUNBLElBSEQsTUFJSTtBQUNILFNBQUtFLGFBQUw7QUFDQTtBQUNELEdBUkQ7QUFTQUgsWUFBVUUsV0FBV0QsVUFBWCxFQUF1QixHQUF2QixDQUFWO0FBQ0E7QUFDRDs7O0FBR0FFLGlCQUFlO0FBQ2QsT0FBSzdELFVBQUwsR0FBa0IsSUFBbEI7O0FBRUEsTUFBSThELGdCQUFnQixLQUFLL0QsV0FBTCxDQUFpQmdFLFFBQXJDO0FBQ0EsT0FBSSxJQUFJMUMsSUFBSSxDQUFaLEVBQWVBLElBQUd5QyxjQUFjNUMsTUFBaEMsRUFBd0NHLEdBQXhDLEVBQTRDO0FBQUU7QUFDN0MsT0FBSWlDLE9BQU9RLGNBQWN6QyxDQUFkLENBQVg7QUFDQWlDLFFBQUtVLFNBQUwsR0FBaUIsc0JBQWpCO0FBQ0EsT0FBSUMsV0FBV3BELFNBQVN5QyxLQUFLNUMsS0FBTCxDQUFXdUMsR0FBcEIsSUFBMkIsMERBQTFDO0FBQ0EsUUFBSzdCLGNBQUwsQ0FBb0I2QyxRQUFwQixFQUE4QmQsSUFBOUIsQ0FBbUNHLElBQW5DO0FBQ0E7QUFDRCxNQUFHLEtBQUtZLFlBQUwsRUFBSCxFQUF1QjtBQUFFO0FBQ3hCTixjQUFXLE1BQU07QUFDaEIsU0FBS25CLFNBQUw7QUFDQSxTQUFLbEIsY0FBTDtBQUNBLElBSEQsRUFHRyxJQUhIO0FBSUEsR0FMRCxNQU1JO0FBQ0gsUUFBS2tCLFNBQUw7QUFDQSxRQUFLbEIsY0FBTDtBQUNBO0FBQ0Q7QUFDRDs7Ozs7QUFLQTJDLGdCQUFjO0FBQ2IsTUFBSUMsWUFBWSxLQUFLcEQsVUFBckI7QUFBQSxNQUNDcUQsZUFBZSxFQURoQixDQURhLENBRU87O0FBRXBCLE9BQUksSUFBSS9DLElBQUksQ0FBWixFQUFlQSxJQUFJLEtBQUtMLFdBQXhCLEVBQXFDSyxHQUFyQyxFQUF5QztBQUN4QyxPQUFJc0IsYUFBYSxLQUFLdkIsY0FBTCxDQUFvQkMsQ0FBcEIsQ0FBakI7QUFDQSxPQUFHc0IsV0FBV3pCLE1BQVgsSUFBcUJpRCxTQUF4QixFQUFrQztBQUFFO0FBQ25DLFNBQUtFLGtCQUFMLENBQXdCaEQsQ0FBeEIsRUFEaUMsQ0FDTDtBQUM1QitDLGlCQUFhakIsSUFBYixDQUFrQjlCLENBQWxCO0FBQ0E7QUFDRDtBQUNELE1BQUlpRCxNQUFNRixhQUFhbEQsTUFBdkI7QUFDQSxNQUFHb0QsR0FBSCxFQUFPO0FBQ05WLGNBQVcsTUFBTTtBQUNoQixTQUFJLElBQUl2QyxJQUFJLENBQVosRUFBZUEsSUFBSWlELEdBQW5CLEVBQXdCakQsR0FBeEIsRUFDQyxLQUFLa0QsWUFBTCxDQUFrQkgsYUFBYS9DLENBQWIsQ0FBbEI7QUFDRCxJQUhELEVBR0UsR0FIRjtBQUlBOztBQUVELFNBQU9pRCxNQUFNLENBQWI7QUFDQTtBQUNEOzs7O0FBSUFELG9CQUFtQkcsTUFBbkIsRUFBMEI7QUFDekIsTUFBSUwsWUFBWSxLQUFLcEQsVUFBckI7QUFDQSxPQUFJLElBQUlNLElBQUksQ0FBWixFQUFlQSxJQUFJOEMsU0FBbkIsRUFBOEI5QyxHQUE5QixFQUFrQztBQUNqQyxRQUFLRCxjQUFMLENBQW9Cb0QsTUFBcEIsRUFBNEJuRCxDQUE1QixFQUErQjJDLFNBQS9CLEdBQTJDLHVCQUEzQztBQUNBO0FBQ0Q7QUFDRDs7OztBQUlBTyxjQUFhQyxNQUFiLEVBQW9CO0FBQ25CLE1BQUlMLFlBQVksS0FBS3BELFVBQXJCO0FBQ0EsT0FBSSxJQUFJTSxJQUFJLENBQVosRUFBZUEsSUFBSThDLFNBQW5CLEVBQThCOUMsR0FBOUIsRUFBa0M7QUFDakMsUUFBS3BCLEdBQUwsQ0FBU2lELFdBQVQsQ0FBcUIsS0FBSzlCLGNBQUwsQ0FBb0JvRCxNQUFwQixFQUE0Qm5ELENBQTVCLENBQXJCLEVBRGlDLENBQ3FCO0FBQ3REO0FBQ0QsT0FBSSxJQUFJQSxJQUFJbUQsU0FBUyxDQUFyQixFQUF3Qm5ELEtBQUssQ0FBN0IsRUFBZ0NBLEdBQWhDLEVBQW9DO0FBQUU7QUFDckMsT0FBSXNCLGFBQWEsS0FBS3ZCLGNBQUwsQ0FBb0JDLENBQXBCLENBQWpCO0FBQ0EsUUFBSSxJQUFJdUIsSUFBSSxDQUFaLEVBQWVBLElBQUlELFdBQVd6QixNQUE5QixFQUFzQzBCLEdBQXRDLEVBQTBDO0FBQ3pDRCxlQUFXQyxDQUFYLEVBQWNsQyxLQUFkLENBQW9CdUMsR0FBcEIsR0FBMkJwQyxTQUFTOEIsV0FBV0MsQ0FBWCxFQUFjbEMsS0FBZCxDQUFvQnVDLEdBQTdCLElBQW9DLDBEQUFyQyxHQUFrRCxJQUE1RTtBQUNBO0FBQ0QsUUFBSzdCLGNBQUwsQ0FBb0JDLElBQUksQ0FBeEIsSUFBNkJzQixVQUE3QjtBQUNBO0FBQ0QsT0FBS3ZCLGNBQUwsQ0FBb0IsQ0FBcEIsSUFBeUIsRUFBekI7QUFDQTtBQXhOYzs7QUEyTmhCLHdEQUFldkIsVUFBZixDOzs7Ozs7QUMxT0EseUM7Ozs7OztBQ0FBLHlDOzs7Ozs7O0FDQUE7QUFBQTs7Ozs7OztBQU9BOztBQUNBO0FBQ0E7OztBQUdBLE1BQU00RSxLQUFOLENBQVc7QUFDVjNFLGFBQVk0RSxNQUFaLEVBQW1CO0FBQ2xCLE9BQUs5QyxHQUFMLEdBQVc4QyxPQUFPOUMsR0FBbEIsQ0FEa0IsQ0FDSztBQUN2QixPQUFLQyxNQUFMLEdBQWM2QyxPQUFPN0MsTUFBckIsQ0FGa0IsQ0FFVztBQUM3QixPQUFLZixNQUFMLEdBQWMsS0FBS2MsR0FBTCxDQUFTVixNQUFULEdBQWtCLDZEQUFoQztBQUNBLE9BQUtOLEtBQUwsR0FBYSxLQUFLZ0IsR0FBTCxDQUFTLENBQVQsRUFBWVYsTUFBWixHQUFxQiw2REFBbEM7QUFDQSxPQUFLNkMsUUFBTCxHQUFnQixFQUFoQjtBQUNBO0FBQ0EsT0FBS1ksS0FBTCxDQUFXLENBQVgsRUFBYyxDQUFkO0FBQ0E7QUFDRDs7Ozs7O0FBTUFBLE9BQU1DLFNBQU4sRUFBaUJDLFVBQWpCLEVBQTZCQyxXQUE3QixFQUF5QztBQUN4QyxNQUFJaEUsU0FBUyxLQUFLYyxHQUFMLENBQVNWLE1BQXRCO0FBQUEsTUFDSU4sUUFBUSxLQUFLZ0IsR0FBTCxDQUFTLENBQVQsRUFBWVYsTUFEeEI7QUFBQSxNQUVJNkQsZUFBZUQsY0FBY0EsV0FBZCxHQUE0Qix3QkFBd0JyRCxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBYyxDQUF6QixDQUZ2RTtBQUdBLE9BQUksSUFBSU4sSUFBSSxDQUFaLEVBQWVBLElBQUlQLE1BQW5CLEVBQTJCTyxHQUEzQixFQUNDLEtBQUksSUFBSXVCLElBQUksQ0FBWixFQUFlQSxJQUFJaEMsS0FBbkIsRUFBMEJnQyxHQUExQixFQUE4QjtBQUM3QixPQUFHLEtBQUtoQixHQUFMLENBQVNQLENBQVQsRUFBWXVCLENBQVosS0FBa0IsQ0FBckIsRUFBdUI7QUFDdEIsUUFBSW9DLFdBQVc5RSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQTZFLGFBQVNoQixTQUFULEdBQXFCZSxZQUFyQjtBQUNBQyxhQUFTdEUsS0FBVCxDQUFlcUMsSUFBZixHQUF1QkgsSUFBSSw2REFBSixHQUFnQmlDLFVBQWpCLEdBQStCLElBQXJEO0FBQ0FHLGFBQVN0RSxLQUFULENBQWV1QyxHQUFmLEdBQXNCNUIsSUFBSSw2REFBSixHQUFnQnVELFNBQWpCLEdBQThCLElBQW5EO0FBQ0EsU0FBS2IsUUFBTCxDQUFjWixJQUFkLENBQW1CNkIsUUFBbkI7QUFDQSxTQUFLbkQsTUFBTCxDQUFZNUIsR0FBWixDQUFnQmdGLFdBQWhCLENBQTRCRCxRQUE1QjtBQUNBO0FBQ0Q7QUFDRjtBQUNEOzs7O0FBSUFFLFdBQVM7QUFDUixNQUFHLEtBQUtuQixRQUFMLENBQWM3QyxNQUFkLElBQXdCLENBQTNCLEVBQTZCO0FBQzVCO0FBQ0E7QUFDRDtBQUNBLE1BQUk2QixPQUFPbEMsU0FBUyxLQUFLa0QsUUFBTCxDQUFjLENBQWQsRUFBaUJyRCxLQUFqQixDQUF1QnFDLElBQWhDLENBQVg7QUFDQSxNQUFJRSxNQUFNcEMsU0FBUyxLQUFLa0QsUUFBTCxDQUFjLENBQWQsRUFBaUJyRCxLQUFqQixDQUF1QnVDLEdBQWhDLENBQVY7QUFDQSxNQUFJNkIsY0FBYyxLQUFLZixRQUFMLENBQWMsQ0FBZCxFQUFpQkMsU0FBbkM7QUFDQTtBQUNBLE9BQUksSUFBSTNDLElBQUksQ0FBUixFQUFXaUQsTUFBTSxLQUFLUCxRQUFMLENBQWM3QyxNQUFuQyxFQUEyQ0csSUFBSWlELEdBQS9DLEVBQW9EakQsR0FBcEQsRUFBd0Q7QUFDdkQsUUFBS1EsTUFBTCxDQUFZNUIsR0FBWixDQUFnQmlELFdBQWhCLENBQTRCLEtBQUthLFFBQUwsQ0FBYzFDLENBQWQsQ0FBNUI7QUFDQTtBQUNELE9BQUswQyxRQUFMLENBQWM3QyxNQUFkLEdBQXVCLENBQXZCOztBQUVBLE9BQUtVLEdBQUwsR0FBVyxLQUFLdUQsVUFBTCxDQUFnQixLQUFLdkQsR0FBckIsQ0FBWCxDQWRRLENBYzZCO0FBQ3JDLE9BQUsrQyxLQUFMLENBQVcxQixHQUFYLEVBQWdCRixJQUFoQixFQUFzQitCLFdBQXRCLEVBZlEsQ0FlMkI7QUFDbkM7QUFDRDs7O0FBR0FLLGNBQVk7QUFDWCxNQUFJdkQsTUFBTSxFQUFWO0FBQ0EsTUFBSWQsU0FBUyxLQUFLYyxHQUFMLENBQVNWLE1BQXRCO0FBQUEsTUFDSU4sUUFBUSxLQUFLZ0IsR0FBTCxDQUFTLENBQVQsRUFBWVYsTUFEeEI7QUFFQSxPQUFJLElBQUlHLElBQUksQ0FBWixFQUFlQSxJQUFJVCxLQUFuQixFQUEwQlMsR0FBMUIsRUFBOEI7QUFDN0IsT0FBSStELFVBQVUsRUFBZDtBQUNBLFFBQUksSUFBSXhDLElBQUk5QixTQUFTLENBQXJCLEVBQXdCOEIsS0FBSyxDQUE3QixFQUFnQ0EsR0FBaEMsRUFBb0M7QUFDbkN3QyxZQUFRakMsSUFBUixDQUFhLEtBQUt2QixHQUFMLENBQVNnQixDQUFULEVBQVl2QixDQUFaLENBQWI7QUFDQTtBQUNETyxPQUFJdUIsSUFBSixDQUFTaUMsT0FBVDtBQUNBO0FBQ0QsU0FBT3hELEdBQVA7QUFDQTtBQUNEOzs7Ozs7QUFNQXlELGdCQUFlL0IsSUFBZixFQUFxQmYsU0FBckIsRUFBK0I7QUFDOUIsTUFBSStDLFlBQVl6RSxTQUFTeUMsS0FBSzVDLEtBQUwsQ0FBV3FDLElBQXBCLElBQTRCLDZEQUE1QyxDQUQ4QixDQUN5QjtBQUN2RCxNQUFJd0MsU0FBUzFFLFNBQVN5QyxLQUFLNUMsS0FBTCxDQUFXdUMsR0FBcEIsSUFBMkIsNkRBQXhDLENBRjhCLENBRXFCO0FBQ25ELFVBQU9WLFNBQVA7QUFDQyxRQUFLLE1BQUw7QUFDQyxXQUFPLEtBQUtWLE1BQUwsQ0FBWVosTUFBWixDQUFtQnFFLFlBQVksQ0FBL0IsS0FBc0NDLFVBQVUsS0FBSzFELE1BQUwsQ0FBWVosTUFBWixDQUFtQnFFLFlBQVksQ0FBL0IsQ0FBdkQ7QUFDRCxRQUFLLE9BQUw7QUFDQyxXQUFPLEtBQUt6RCxNQUFMLENBQVlaLE1BQVosQ0FBbUJxRSxZQUFZLENBQS9CLEtBQXNDQyxVQUFVLEtBQUsxRCxNQUFMLENBQVlaLE1BQVosQ0FBbUJxRSxZQUFZLENBQS9CLENBQXZEO0FBQ0QsUUFBSyxNQUFMO0FBQ0MsV0FBTyxLQUFLekQsTUFBTCxDQUFZWixNQUFaLENBQW1CcUUsU0FBbkIsS0FBbUNDLFNBQVMsNkRBQVYsSUFBd0IsS0FBSzFELE1BQUwsQ0FBWVosTUFBWixDQUFtQnFFLFNBQW5CLENBQWpFO0FBQ0Q7QUFDQyxXQUFPLEtBQVA7QUFSRjtBQVVBO0FBQ0Q7OztBQUdBRSxjQUFZO0FBQ1gsTUFBSUMsV0FBVyxLQUFLTixVQUFMLENBQWdCLEtBQUt2RCxHQUFyQixDQUFmO0FBQ0EsTUFBSTBELFlBQVl6RSxTQUFTLEtBQUtrRCxRQUFMLENBQWMsQ0FBZCxFQUFpQnJELEtBQWpCLENBQXVCcUMsSUFBaEMsSUFBd0MsNkRBQXhEO0FBQ0EsTUFBSWtCLFdBQVdwRCxTQUFTLEtBQUtrRCxRQUFMLENBQWMsQ0FBZCxFQUFpQnJELEtBQWpCLENBQXVCdUMsR0FBaEMsSUFBdUMsNkRBQXREO0FBQ0EsT0FBSSxJQUFJNUIsSUFBSSxDQUFSLEVBQVdxRSxPQUFPRCxTQUFTdkUsTUFBL0IsRUFBdUNHLElBQUlxRSxJQUEzQyxFQUFpRHJFLEdBQWpELEVBQXFEO0FBQUU7QUFDdEQsT0FBSXNCLGFBQWE4QyxTQUFTcEUsQ0FBVCxDQUFqQjtBQUNBLFFBQUksSUFBSXVCLElBQUksQ0FBUixFQUFXK0MsT0FBT2hELFdBQVd6QixNQUFqQyxFQUF5QzBCLElBQUkrQyxJQUE3QyxFQUFtRC9DLEdBQW5ELEVBQXVEO0FBQ3RELFFBQUlFLGNBQWN3QyxZQUFZMUMsQ0FBOUI7QUFBQSxRQUNJZ0QsZ0JBQWdCM0IsV0FBVzVDLENBQVgsR0FBZSxDQURuQztBQUVBLFFBQUd5QixjQUFjLENBQWQsSUFBbUJBLGVBQWUsS0FBS2pCLE1BQUwsQ0FBWWQsVUFBakQsRUFBNEQ7QUFBRTtBQUM3RCxZQUFPLEtBQVA7QUFDQTtBQUNELFFBQUc2RSxnQkFBZ0IsQ0FBaEIsSUFBcUJBLGlCQUFpQixLQUFLL0QsTUFBTCxDQUFZYixXQUFyRCxFQUFpRTtBQUFFO0FBQ2xFLFlBQU8sS0FBUDtBQUNBO0FBQ0QsUUFBRzRFLGdCQUFpQixLQUFLL0QsTUFBTCxDQUFZWixNQUFaLENBQW1CNkIsV0FBbkIsSUFBa0MsNkRBQXRELEVBQWlFO0FBQUU7QUFDbEUsWUFBTyxLQUFQO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0E7QUFDRDs7Ozs7QUFLQWhCLFNBQVFTLFNBQVIsRUFBa0I7QUFDakIsTUFBR0EsY0FBYyxRQUFqQixFQUEwQjtBQUFFO0FBQzNCLFVBQU8sS0FBS2lELFVBQUwsRUFBUDtBQUNBLEdBRkQsTUFHSTtBQUNILFVBQU8sS0FBS3pCLFFBQUwsQ0FBYzhCLEtBQWQsQ0FBcUJ2QyxJQUFELElBQVU7QUFBRTtBQUN0QyxXQUFPLEtBQUsrQixjQUFMLENBQW9CL0IsSUFBcEIsRUFBMEJmLFNBQTFCLENBQVA7QUFDQSxJQUZNLENBQVA7QUFHQTtBQUNEO0FBQ0Q7Ozs7QUFJQUMsTUFBS0QsU0FBTCxFQUFlO0FBQ2QsVUFBT0EsU0FBUDtBQUNDLFFBQUssTUFBTDtBQUNDLFNBQUt3QixRQUFMLENBQWMrQixPQUFkLENBQXVCeEMsSUFBRCxJQUFVO0FBQy9CQSxVQUFLNUMsS0FBTCxDQUFXcUMsSUFBWCxHQUFtQmxDLFNBQVN5QyxLQUFLNUMsS0FBTCxDQUFXcUMsSUFBcEIsSUFBNEIsOERBQTdCLEdBQTJDLElBQTdEO0FBQ0EsS0FGRDtBQUdBO0FBQ0QsUUFBSyxPQUFMO0FBQ0MsU0FBS2dCLFFBQUwsQ0FBYytCLE9BQWQsQ0FBdUJ4QyxJQUFELElBQVU7QUFDL0JBLFVBQUs1QyxLQUFMLENBQVdxQyxJQUFYLEdBQW1CbEMsU0FBU3lDLEtBQUs1QyxLQUFMLENBQVdxQyxJQUFwQixJQUE0Qiw4REFBN0IsR0FBMkMsSUFBN0Q7QUFDQSxLQUZEO0FBR0E7QUFDRCxRQUFLLE1BQUw7QUFDQyxTQUFLZ0IsUUFBTCxDQUFjK0IsT0FBZCxDQUF1QnhDLElBQUQsSUFBVTtBQUMvQkEsVUFBSzVDLEtBQUwsQ0FBV3VDLEdBQVgsR0FBa0JwQyxTQUFTeUMsS0FBSzVDLEtBQUwsQ0FBV3VDLEdBQXBCLElBQTJCLDhEQUE1QixHQUEwQyxJQUEzRDtBQUNBLEtBRkQ7QUFHQTtBQUNELFFBQUssUUFBTDtBQUNDLFNBQUtpQyxPQUFMO0FBQ0E7QUFDRDtBQUNDO0FBcEJGO0FBc0JBO0FBNUpTOztBQStKWCx3REFBZVQsS0FBZixDOzs7Ozs7OztBQzNLQTtBQUFBOzs7Ozs7O0FBT0E7QUFDQSxtQkFBQXNCLENBQVEsQ0FBUjtBQUNBLG1CQUFBQSxDQUFRLENBQVI7O0FBRUF4RixPQUFPeUYsTUFBUCxHQUFnQixZQUFVO0FBQ3pCcEMsWUFBVyxZQUFVO0FBQ3BCLE1BQUlxQyxhQUFhLElBQUksNERBQUosRUFBakI7QUFDQSxFQUZELEVBRUUsR0FGRjtBQUlBLENBTEQsQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gMTAwMDA7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjczOTMwZThlMGJmNWI4Mzk0NWY4XCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RNYWluTW9kdWxlID0gdHJ1ZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RNYWluTW9kdWxlID0gZmFsc2U7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgXCJlXCIsIHtcclxuIFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHR2YWx1ZTogZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RNYWluTW9kdWxlLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdE1haW5Nb2R1bGUgPSB0cnVlO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0aG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0fSwgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyMjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcclxuIFx0XHRpZihlcnJvcikge1xyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcclxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSg1KShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA3MzkzMGU4ZTBiZjViODM5NDVmOCIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yNyAwOTo0OTozN1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTA6MTE6NTlcclxuKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuY29uc3QgQkxPQ0tTSVpFICA9IDMwO1x0Ly8g5pa55Z2X5aSn5bCPXHJcbmNvbnN0IFNURVBMRU5HVEggPSAzMDtcclxuXHJcbi8qXHJcbiAqIOaemuS4vuaJgOacieeahOWIneWni+W9oueKtlxyXG4gKi9cclxuY29uc3QgQkxPQ0tUWVBFID0gW1xyXG5cdFtbMSwxLDFdLFsxLDAsMF1dLFxyXG5cdFtbMSwxXSxbMCwxXSxbMCwxXV0sXHJcblx0W1swLDAsMV0sWzEsMSwxXV0sXHJcblx0W1sxLDBdLFsxLDBdLFsxLDFdXSxcclxuXHRbWzEsMSwwXSwgWzAsMSwxXV0sXHJcblx0W1swLDFdLFsxLDFdLFsxLDBdXSxcclxuXHRbWzEsMSwxXSwgWzAsMCwxXV0sXHJcblx0W1swLDFdLFswLDFdLFsxLDFdXSxcclxuXHRbWzEsMCwwXSxbMSwxLDFdXSxcclxuXHRbWzEsMV0sWzEsMF0sWzEsMF1dLFxyXG5cdFtbMSwxLDEsMV1dLFxyXG5cdFtbMV0sWzFdLFsxXSxbMV1dLFxyXG5cdFtbMSwxXSxbMSwxXV0sXHJcblx0W1swLDEsMF0sWzEsMSwxXV0sXHJcblx0W1sxLDBdLFsxLDFdLFsxLDBdXSxcclxuXHRbWzEsMSwxXSxbMCwxLDBdXSxcclxuXHRbWzAsMV0sWzEsMV0sIFswLDFdXSxcclxuXHRbWzAsMSwxXSwgWzEsMSwwXV0sXHJcblx0W1sxLDBdLFsxLDFdLFswLDFdXVxyXG5dO1xyXG5cclxuZXhwb3J0IHtcclxuXHRCTE9DS1RZUEUsXHJcblx0QkxPQ0tTSVpFLFxyXG5cdFNURVBMRU5HVEhcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9jb25maWcuanMiLCIvKlxyXG4qIEBBdXRob3I6IGxpdWppYWp1blxyXG4qIEBEYXRlOiAgIDIwMTctMDItMjcgMDk6NTE6MjVcclxuKiBATGFzdCBNb2RpZmllZCBieTogICBsaXVqaWFqdW5cclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTAyLTI3IDE2OjQ1OjM3XHJcbiovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgQmxvY2sgZnJvbSAnLi9ibG9jay5qcyc7XHJcbmltcG9ydCB7QkxPQ0tTSVpFLCBCTE9DS1RZUEV9IGZyb20gJy4vY29uZmlnJztcclxuXHJcbi8qKlxyXG4gKiDkv4TnvZfmlq/mlrnlnZfnlLvmnb9cclxuICovXHJcbmNsYXNzIFRldHJpc0FyZWF7XHJcblx0Y29uc3RydWN0b3IoKXtcclxuXHRcdHRoaXMuYWN0aXZlQmxvY2sgPSBudWxsO1x0Ly9jdXJyZW50IGRyb3BwaW5nLWRvd24gYmxvY2tcclxuXHRcdHRoaXMubm9LZXlQcmVzcyA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHR0aGlzLmRpdi5pZCA9ICd3cmFwcGVyJztcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuZGl2KTtcclxuXHJcblx0XHR3aW5kb3cub25rZXlkb3duID0gdGhpcy5vbmtleWRvd24uYmluZCh0aGlzKTtcclxuXHJcblx0XHRsZXQgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRpdik7XHJcblx0XHR0aGlzLndpZHRoID0gcGFyc2VJbnQoc3R5bGUud2lkdGgpO1xyXG5cdFx0dGhpcy5oZWlnaHQgPSBwYXJzZUludChzdHlsZS5oZWlnaHQpO1xyXG5cdFx0dGhpcy5ibG9ja1dpZHRoID0gdGhpcy53aWR0aCAvIEJMT0NLU0laRTtcdC8v5Lul5pa55qC85Z2X5pWw5omA6K6h55qE5a695bqmXHJcblx0XHR0aGlzLmJsb2NrSGVpZ2h0ID0gdGhpcy5oZWlnaHQgLyBCTE9DS1NJWkU7XHJcblxyXG5cdFx0Ly8gdGhpcy5ib3JkZXLooajnpLrmr4/kuIDliJfnmoTmnIDlpKflj6/nlKjpq5jluqbvvIzmlrnlnZfop6bliLDkuYvlkI7lsLHooajnpLrlt7Lnu4/op6blupVcclxuXHRcdC8vIOavj+asoeaWueWdl+inpuW6le+8jOivpeWxnuaAp+mDvemcgOimgemAmui/h3RoaXMuZ2V0Qm9yZGVy5pu05pawXHJcblx0XHR0aGlzLmJvcmRlciA9IFtdO1xyXG5cdFx0dGhpcy5ib3JkZXIubGVuZ3RoID0gdGhpcy5ibG9ja1dpZHRoO1xyXG5cdFx0dGhpcy5ib3JkZXIuZmlsbCh0aGlzLmhlaWdodCk7XHJcblxyXG5cdFx0Ly8gdGhpcy5pbmFjdGl2ZUJsb2Nrc+iusOW9leaOieWIsOW6lemDqOeahOaWueWdl1xyXG5cdFx0Ly8g5YWx5YyF5ZCrdGhpcy5ibG9ja0hlaWdodOS4quaVsOe7hO+8jOavj+S4quaVsOe7hOihqOekuuivpeihjOeahOaJgOacieWwj+aWueWdl1xyXG5cdFx0Ly8g5b2T5p+Q6KGM5omA5oul5pyJ55qE5bCP5pa55Z2X5Liq5pWw562J5LqOdGhpcy5ibG9ja1dpZHRo5pe277yM5raI6Zmk6K+l6KGMXHJcblx0XHR0aGlzLmluYWN0aXZlQmxvY2tzID0gW107XHJcblx0XHQvLyB0aGlzLmluYWN0aXZlQmxvY2tzLmZpbGwoW10pO1x0Ly8g6K+l5pa55rOV6ZSZ6K+v77yM5Zug5Li65piv55So5ZCM5LiA5LiqW13loavlhYXvvIzkuZ/lsLHmmK/or7TmiYDmnInnmoTlrZBpdGVt6YO95piv5oyH5ZCR5ZCM5LiA5Liq56m65pWw57uEXHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja0hlaWdodDsgaSsrKXtcclxuXHRcdFx0dGhpcy5pbmFjdGl2ZUJsb2Nrc1tpXSA9IFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc3RhcnRHYW1lKCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOS6p+eUn+S4i+S4gOS4quaWueagvFxyXG5cdCAqL1xyXG5cdG5ld0FjdGl2ZUJsb2NrKCl7XHJcblx0XHRsZXQgdHlwZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJMT0NLVFlQRS5sZW5ndGgpO1xyXG5cdFx0dGhpcy5hY3RpdmVCbG9jayA9IG5ldyBCbG9jayh7XHJcblx0XHRcdGFycjogQkxPQ0tUWVBFW3R5cGVdLFxyXG5cdFx0XHRwYXJlbnQ6IHRoaXNcclxuXHRcdH0pO1xyXG5cdFx0aWYoIXRoaXMuYWN0aXZlQmxvY2suY2FubW92ZSgnZG93bicpKXtcclxuXHRcdFx0YWxlcnQoJ0dhbWUgT3ZlcicpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR0aGlzLmJsb2NrRHJvcCgpO1x0Ly8g5paw5bu65rS75Yqo5pa55Z2X5LmL5ZCO77yM5rS75Yqo5pa55Z2X5byA5aeL5LiL5Z2gXHJcblx0XHR0aGlzLm5vS2V5UHJlc3MgPSBmYWxzZTtcclxuXHR9XHJcblx0ZGVsZXRlQWN0aXZlQmxvY2soKXtcclxuXHRcdHRoaXMuYWN0aXZlQmxvY2sgPSBudWxsO1xyXG5cdH1cclxuXHRvbmtleWRvd24oZSl7XHJcblx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0aWYodGhpcy5ub0tleVByZXNzKXtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0bGV0IGtleSA9IGUua2V5Q29kZTtcclxuXHRcdGxldCBkaXJlY3Rpb247XHJcblx0XHRzd2l0Y2goa2V5KXtcclxuXHRcdFx0Y2FzZSAzNzpcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMzg6IC8vIHVwIGtleVxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdyb3RhdGUnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM5OlxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdyaWdodCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgNDA6XHJcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHRcdHRoaXMuYWN0aXZlQmxvY2sgJiYgdGhpcy5hY3RpdmVCbG9jay5jYW5tb3ZlKGRpcmVjdGlvbikgJiYgdGhpcy5hY3RpdmVCbG9jay5tb3ZlKGRpcmVjdGlvbik7XHJcblx0fVxyXG5cdHN0YXJ0R2FtZSgpe1xyXG5cdFx0dGhpcy5uZXdBY3RpdmVCbG9jaygpO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiDov5Tlm57lt7Lnu4/ooqvljaDpoobnmoTkvY3nva5cclxuXHQgKiDor6Xov5Tlm57nu5PmnpzkuLrkuIDkuKrmlbDnu4TvvIzplb/luqbkuLp0aGlzLmJsb2NrV2lkdGgsIOavj+S4qml0ZW3ooajnpLrlhbblr7nlupTnmoTliJflj6/nlKjnmoTmnIDlpKfpq5jluqZcclxuXHQgKiBAcmV0dXJuIHtBcnJheX1cclxuXHQgKi9cclxuXHRnZXRCb3JkZXIoKXtcclxuXHRcdHRoaXMuYm9yZGVyLmZpbGwodGhpcy5oZWlnaHQpO1xyXG5cdFx0bGV0IGluYWN0aXZlQmxvY2tzU2ltID0gW107XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpPCB0aGlzLmJsb2NrSGVpZ2h0OyBpKyspe1xyXG5cdFx0XHRsZXQgY3VycmVudFJvdyA9IHRoaXMuaW5hY3RpdmVCbG9ja3NbaV07XHJcblx0XHRcdGZvcihsZXQgaiA9IDA7IGogPCBjdXJyZW50Um93Lmxlbmd0aDsgaisrKXtcclxuXHRcdFx0XHRsZXQgY3VycmVudEJsb2NrID0gY3VycmVudFJvd1tqXTtcclxuXHRcdFx0XHRsZXQgY3VycmVudExlZnQgPSBwYXJzZUludChjdXJyZW50QmxvY2suc3R5bGUubGVmdCksXHJcblx0XHRcdFx0ICAgIGN1cnJlbnRUb3AgPSBwYXJzZUludChjdXJyZW50QmxvY2suc3R5bGUudG9wKTtcclxuXHJcblx0XHRcdFx0aWYoY3VycmVudFRvcCA+PSB0aGlzLmhlaWdodCl7XHQvLyDlr7nkuo7otoXlh7rovrnnlYzkuYvlpJbnmoTlsI/mlrnlnZfvvIznm7TmjqXliKDpmaRcclxuXHRcdFx0XHRcdHRoaXMuZGl2LnJlbW92ZUNoaWxkKGN1cnJlbnRCbG9jayk7XHJcblx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGluYWN0aXZlQmxvY2tzU2ltLnB1c2goe1x0Ly8g6YGN5Y6G5bm25qC85byP5YyW5ZCO5Yqg5YWlaW5hY3RpdmVCbG9ja3NTaW3mlbDnu4RcclxuXHRcdFx0XHRcdGxlZnQ6IGN1cnJlbnRMZWZ0LFxyXG5cdFx0XHRcdFx0dG9wOiBjdXJyZW50VG9wXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja1dpZHRoOyBpKyspe1xyXG5cdFx0XHRsZXQgY29sdW1uQXJyID0gaW5hY3RpdmVCbG9ja3NTaW0uZmlsdGVyKChpdGVtKSA9PiB7XHQvLyDmib7lh7rnrKxp5YiX55qE5omA5pyJ5YWD57SgXHJcblx0XHRcdFx0cmV0dXJuIGl0ZW0ubGVmdCAvIEJMT0NLU0laRSA9PT0gaTtcclxuXHRcdFx0fSlcclxuXHRcdFx0aWYoY29sdW1uQXJyLmxlbmd0aCA8PSAwKXtcclxuXHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjb2x1bW5BcnIuc29ydCgoYSxiKSA9PiB7XHQvLyDmjIl0b3Dku47lsI/liLDlpKfmjpLluo9cclxuXHRcdFx0XHRyZXR1cm4gYS50b3AgLSBiLnRvcDtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNvbHVtbkFyclswXSAmJiAodGhpcy5ib3JkZXJbaV0gPSBjb2x1bW5BcnJbMF0udG9wKTtcdC8vIOWmguaenOivpeWIl+acieWFg+e0oO+8jOabtOaWsOWPr+eUqOmrmOW6plxyXG5cdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmlrnlnZfkuIvlnaBcclxuXHQgKi9cclxuXHRibG9ja0Ryb3AoKXtcclxuXHRcdGxldCB0aW1lb3V0O1xyXG5cdFx0bGV0IHRtRnVuY3Rpb24gPSAoKSA9PiB7XHJcblx0XHRcdGlmKHRoaXMuYWN0aXZlQmxvY2sgJiYgdGhpcy5hY3RpdmVCbG9jay5jYW5tb3ZlKCdkb3duJykpe1xyXG5cdFx0XHRcdHRoaXMuYWN0aXZlQmxvY2subW92ZSgnZG93bicpO1xyXG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KHRtRnVuY3Rpb24sIDUwMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZXtcclxuXHRcdFx0XHR0aGlzLmJsb2NrQXRCb3R0b20oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQodG1GdW5jdGlvbiwgNTAwKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5pa55Z2X5Yiw6L6+5bqV6YOo55qE5aSE55CG5Ye95pWwXHJcblx0ICovXHJcblx0YmxvY2tBdEJvdHRvbSgpe1xyXG5cdFx0dGhpcy5ub0tleVByZXNzID0gdHJ1ZTtcclxuXHJcblx0XHRsZXQgY3VycmVudEJsb2NrcyA9IHRoaXMuYWN0aXZlQmxvY2suYmxvY2tBcnI7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpPCBjdXJyZW50QmxvY2tzLmxlbmd0aDsgaSsrKXtcdC8vIOWIsOi+vuW6lemDqOWQju+8jOWwhuW9k+WJjea0u+WKqOaWueWdl+WFqOmDqOWKoOWFpWluYWN0aXZlQmxvY2tzXHJcblx0XHRcdGxldCBpdGVtID0gY3VycmVudEJsb2Nrc1tpXTtcclxuXHRcdFx0aXRlbS5jbGFzc05hbWUgPSAnYmxvY2sgYmxvY2staW5hY3RpdmUnO1xyXG5cdFx0XHRsZXQgdG9wQmxvY2sgPSBwYXJzZUludChpdGVtLnN0eWxlLnRvcCkgLyBCTE9DS1NJWkU7XHJcblx0XHRcdHRoaXMuaW5hY3RpdmVCbG9ja3NbdG9wQmxvY2tdLnB1c2goaXRlbSk7XHJcblx0XHR9XHJcblx0XHRpZih0aGlzLmNhbEVsaW5pbWF0ZSgpKXtcdC8vIOWmguaenOacieimgea2iOmZpOeahOihjO+8jOetieW+hTMwMG1z5ZCO5omn6KGM77yM55WZ5Ye6MzAwbXPmj5DnpLrnlKjmiLfmnInooYzmraPlnKjmtojpmaRcclxuXHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5nZXRCb3JkZXIoKTtcclxuXHRcdFx0XHR0aGlzLm5ld0FjdGl2ZUJsb2NrKCk7XHJcblx0XHRcdH0sIDEwMDApO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0dGhpcy5nZXRCb3JkZXIoKTtcclxuXHRcdFx0dGhpcy5uZXdBY3RpdmVCbG9jaygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDorqHnrpfmmK/lkKbmnInmlbTooYzpnIDopoHmtojpmaRcclxuXHQgKiDlvZPmtLvliqjmlrnlnZfliLDovr7lupXpg6jml7bov5DooYxcclxuXHQgKiBAcmV0dXJuIHtib29sZWFufSDmmK/lkKbmnInooYzpnIDopoHmtojpmaRcclxuXHQgKi9cclxuXHRjYWxFbGluaW1hdGUoKXtcclxuXHRcdGxldCBmdWxsV2lkdGggPSB0aGlzLmJsb2NrV2lkdGgsXHJcblx0XHRcdGVsaW1pbmF0ZUFyciA9IFtdO1x0Ly8gcm93TnVtIHRvIGJlIGVsaW1pbmF0ZWRcclxuXHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja0hlaWdodDsgaSsrKXtcclxuXHRcdFx0bGV0IGN1cnJlbnRSb3cgPSB0aGlzLmluYWN0aXZlQmxvY2tzW2ldO1xyXG5cdFx0XHRpZihjdXJyZW50Um93Lmxlbmd0aCA+PSBmdWxsV2lkdGgpe1x0Ly8g6K+l6KGM5bey5ruh6ZyA6KaB5raI6ZmkXHJcblx0XHRcdFx0dGhpcy5iZWZvcmVFbGluaW1hdGVSb3coaSk7XHQvLyDmj5DnpLrnlKjmiLfor6XooYzljbPlsIbmtojpmaRcclxuXHRcdFx0XHRlbGltaW5hdGVBcnIucHVzaChpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bGV0IGxlbiA9IGVsaW1pbmF0ZUFyci5sZW5ndGg7XHJcblx0XHRpZihsZW4pe1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRmb3IobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspXHJcblx0XHRcdFx0XHR0aGlzLmVsaW5pbWF0ZVJvdyhlbGltaW5hdGVBcnJbaV0pO1xyXG5cdFx0XHR9LDEwMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGxlbiA+IDA7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOa2iOmZpOihjOS5i+WJjemXqueDgVxyXG5cdCAqIEBwYXJhbSAge251bWJlcn0gcm93TnVtIOWvueW6lOeahOihjO+8jOS7juS4iuW+gOS4i+S7jjDooYzlvIDlp4tcclxuXHQgKi9cclxuXHRiZWZvcmVFbGluaW1hdGVSb3cocm93TnVtKXtcclxuXHRcdGxldCBmdWxsV2lkdGggPSB0aGlzLmJsb2NrV2lkdGg7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZnVsbFdpZHRoOyBpKyspe1xyXG5cdFx0XHR0aGlzLmluYWN0aXZlQmxvY2tzW3Jvd051bV1baV0uY2xhc3NOYW1lID0gJ2Jsb2NrIGJsb2NrLWVsaW1pbmF0ZSc7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOa2iOmZpOihjFxyXG5cdCAqIEBwYXJhbSAge251bWJlcn0gcm93TnVtIOWvueW6lOeahOihjO+8jOS7juS4iuW+gOS4i+S7jjDooYzlvIDlp4tcclxuXHQgKi9cclxuXHRlbGluaW1hdGVSb3cocm93TnVtKXtcclxuXHRcdGxldCBmdWxsV2lkdGggPSB0aGlzLmJsb2NrV2lkdGg7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZnVsbFdpZHRoOyBpKyspe1xyXG5cdFx0XHR0aGlzLmRpdi5yZW1vdmVDaGlsZCh0aGlzLmluYWN0aXZlQmxvY2tzW3Jvd051bV1baV0pO1x0Ly/np7vpmaTmiYDmnInlhYPntKBcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSA9IHJvd051bSAtIDE7IGkgPj0gMDsgaS0tKXtcdC8vIOS4iuaWueaJgOacieihjOS4i+enu++8jOW5tuabtOaWsHRoaXMuaW5hY3RpdmVCbG9ja3NcclxuXHRcdFx0bGV0IGN1cnJlbnRSb3cgPSB0aGlzLmluYWN0aXZlQmxvY2tzW2ldO1xyXG5cdFx0XHRmb3IobGV0IGogPSAwOyBqIDwgY3VycmVudFJvdy5sZW5ndGg7IGorKyl7XHJcblx0XHRcdFx0Y3VycmVudFJvd1tqXS5zdHlsZS50b3AgPSAocGFyc2VJbnQoY3VycmVudFJvd1tqXS5zdHlsZS50b3ApICsgQkxPQ0tTSVpFICkrICdweCc7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5pbmFjdGl2ZUJsb2Nrc1tpICsgMV0gPSBjdXJyZW50Um93O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5pbmFjdGl2ZUJsb2Nrc1swXSA9IFtdO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGV0cmlzQXJlYTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvdGV0cmlzQXJlYS5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGUvbm9ybWFsaXplLmNzc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlL3RldHJpcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuKiBAQXV0aG9yOiBsaXVqaWFqdW5cclxuKiBARGF0ZTogICAyMDE3LTAyLTI3IDA5OjUwOjM2XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAgbGl1amlhanVuXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wMi0yNyAxMDowNDoxMVxyXG4qL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQge0JMT0NLU0laRSwgU1RFUExFTkdUSH0gZnJvbSAnLi9jb25maWcuanMnO1xyXG4vKipcclxuICogQkxPQ0vnsbvvvIzmr4/kuKpCTE9DS+S4reWMheWQq+WkmuS4quWwj+aWueWdl1xyXG4gKi9cclxuY2xhc3MgQmxvY2t7XHJcblx0Y29uc3RydWN0b3IocGFyYW1zKXtcclxuXHRcdHRoaXMuYXJyID0gcGFyYW1zLmFycjtcdC8vIEJsb2Nr5pWw57uE77yM6KGo56S66K+l5pa55Z2X55qE5b2i54q2XHJcblx0XHR0aGlzLnBhcmVudCA9IHBhcmFtcy5wYXJlbnQ7XHQvLyDniLblr7nosaFcclxuXHRcdHRoaXMuaGVpZ2h0ID0gdGhpcy5hcnIubGVuZ3RoICogQkxPQ0tTSVpFO1xyXG5cdFx0dGhpcy53aWR0aCA9IHRoaXMuYXJyWzBdLmxlbmd0aCAqIEJMT0NLU0laRTtcclxuXHRcdHRoaXMuYmxvY2tBcnIgPSBbXTtcclxuXHRcdC8vIOa2guaWueWdl1xyXG5cdFx0dGhpcy5fZHJhdygwLCAwKTtcdFxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmoLnmja5hcnLnlLvlh7ror6XmlrnlnZfvvIxbWzEsMF0sWzEsMV3ooajnpLrkuIDkuKoyKjLmlrnlnZfvvIzkvYbmmK/nrKzkuIDooYznrKzkuozkuKrkuLrnqbpcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gb3JpZ2luVG9wIOaWueWdl+eahOi1t+Wni+eCuVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBvcmlnaW5MZWZ0IOaWueWdl+eahOi1t+Wni+eCuVxyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcmlnaW5DbGFzcyDmmK/lkKbmmK/ph43nu5jml4vovazmlrnlnZfvvIzlpoLmnpzmmK/vvIzkv53mjIFjbGFzc05hbWXkuI3lj5hcclxuXHQgKi9cclxuXHRfZHJhdyhvcmlnaW5Ub3AsIG9yaWdpbkxlZnQsIG9yaWdpbkNsYXNzKXtcclxuXHRcdGxldCBoZWlnaHQgPSB0aGlzLmFyci5sZW5ndGgsXHJcblx0XHQgICAgd2lkdGggPSB0aGlzLmFyclswXS5sZW5ndGgsXHJcblx0XHQgICAgdG1wQ2xhc3NOYW1lID0gb3JpZ2luQ2xhc3MgPyBvcmlnaW5DbGFzcyA6ICdibG9jayBibG9jay1hY3RpdmUtJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo1KTtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKylcclxuXHRcdFx0Zm9yKGxldCBqID0gMDsgaiA8IHdpZHRoOyBqKyspe1xyXG5cdFx0XHRcdGlmKHRoaXMuYXJyW2ldW2pdID09IDEpe1xyXG5cdFx0XHRcdFx0bGV0IHN1YkJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0XHRzdWJCbG9jay5jbGFzc05hbWUgPSB0bXBDbGFzc05hbWU7XHJcblx0XHRcdFx0XHRzdWJCbG9jay5zdHlsZS5sZWZ0ID0gKGogKiBCTE9DS1NJWkUgKyBvcmlnaW5MZWZ0KSArICdweCc7XHJcblx0XHRcdFx0XHRzdWJCbG9jay5zdHlsZS50b3AgPSAoaSAqIEJMT0NLU0laRSArIG9yaWdpblRvcCkgKyAncHgnO1xyXG5cdFx0XHRcdFx0dGhpcy5ibG9ja0Fyci5wdXNoKHN1YkJsb2NrKTtcclxuXHRcdFx0XHRcdHRoaXMucGFyZW50LmRpdi5hcHBlbmRDaGlsZChzdWJCbG9jayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOaWueWdl+i/m+ihjOaXi+i9rFxyXG5cdCAqIOS/neaMgeaVtOS9k+W3puS4iuinkuS4jeWPmFxyXG5cdCAqL1xyXG5cdF9yb3RhdGUoKXtcclxuXHRcdGlmKHRoaXMuYmxvY2tBcnIubGVuZ3RoIDw9IDApe1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvLyDml4vovazml7blt6bkuIrop5LnmoTkvY3nva5cclxuXHRcdGxldCBsZWZ0ID0gcGFyc2VJbnQodGhpcy5ibG9ja0FyclswXS5zdHlsZS5sZWZ0KTtcclxuXHRcdGxldCB0b3AgPSBwYXJzZUludCh0aGlzLmJsb2NrQXJyWzBdLnN0eWxlLnRvcCk7XHJcblx0XHRsZXQgb3JpZ2luQ2xhc3MgPSB0aGlzLmJsb2NrQXJyWzBdLmNsYXNzTmFtZTtcclxuXHRcdC8vIOenu+mZpOWOn+adpeeahOaJgOacieWwj+aWueagvFxyXG5cdFx0Zm9yKGxldCBpID0gMCwgbGVuID0gdGhpcy5ibG9ja0Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcblx0XHRcdHRoaXMucGFyZW50LmRpdi5yZW1vdmVDaGlsZCh0aGlzLmJsb2NrQXJyW2ldKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuYmxvY2tBcnIubGVuZ3RoID0gMDtcclxuXHJcblx0XHR0aGlzLmFyciA9IHRoaXMuX3JvdGF0ZUFycih0aGlzLmFycik7Ly8g5peL6L2sXHJcblx0XHR0aGlzLl9kcmF3KHRvcCwgbGVmdCwgb3JpZ2luQ2xhc3MpOy8vIOmHjeaWsOe7mOWItlxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmlbDnu4Tov5vooYzpobrml7bpkojml4vovaxcclxuXHQgKi9cclxuXHRfcm90YXRlQXJyKCl7XHJcblx0XHRsZXQgYXJyID0gW107XHJcblx0XHRsZXQgaGVpZ2h0ID0gdGhpcy5hcnIubGVuZ3RoLFxyXG5cdFx0ICAgIHdpZHRoID0gdGhpcy5hcnJbMF0ubGVuZ3RoO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspe1xyXG5cdFx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGogPSBoZWlnaHQgLSAxOyBqID49IDA7IGotLSl7XHJcblx0XHRcdFx0dGVtcEFyci5wdXNoKHRoaXMuYXJyW2pdW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcnIucHVzaCh0ZW1wQXJyKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhcnI7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOWIpOaWreWNleS4quWwj+aWueWdl+aYr+WQpuWPr+S7peWQkeafkOaWueWQkeenu+WKqFxyXG5cdCAqIEBwYXJhbSB7RE9NRWxlbWVudH0gaXRlbSDor6XlsI/mlrnlnZfnmoTlvJXnlKhcclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGRpcmVjdGlvbiDnp7vliqjmlrnlkJFcclxuXHQgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAg5piv5ZCm5Y+v5Lul56e75YqoXHJcblx0ICovXHJcblx0X2NhblNpbmdsZU1vdmUoaXRlbSwgZGlyZWN0aW9uKXtcclxuXHRcdGxldCBsZWZ0QmxvY2sgPSBwYXJzZUludChpdGVtLnN0eWxlLmxlZnQpIC8gQkxPQ0tTSVpFO1x0Ly/or6XlsI/mlrnlnZflr7nlupTnmoTliJfmlbBcclxuXHRcdGxldCBib3R0b20gPSBwYXJzZUludChpdGVtLnN0eWxlLnRvcCkgKyBCTE9DS1NJWkU7XHQvLyDor6XlsI/mlrnlnZfnmoTlupXpg6jkvY3nva5cclxuXHRcdHN3aXRjaChkaXJlY3Rpb24pe1xyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayAtIDFdICYmIChib3R0b20gPD0gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayAtIDFdKTtcclxuXHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnBhcmVudC5ib3JkZXJbbGVmdEJsb2NrICsgMV0gJiYgKGJvdHRvbSA8PSB0aGlzLnBhcmVudC5ib3JkZXJbbGVmdEJsb2NrICsgMV0pO1xyXG5cdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9ja10gJiYgKChib3R0b20gKyBCTE9DS1NJWkUpIDw9IHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2tdKTtcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOWIpOaWreaYr+WQpuWPr+S7peaXi+i9rFxyXG5cdCAqL1xyXG5cdF9jYW5Sb3RhdGUoKXtcclxuXHRcdGxldCBhZnRlckFyciA9IHRoaXMuX3JvdGF0ZUFycih0aGlzLmFycik7XHJcblx0XHRsZXQgbGVmdEJsb2NrID0gcGFyc2VJbnQodGhpcy5ibG9ja0FyclswXS5zdHlsZS5sZWZ0KSAvIEJMT0NLU0laRTtcclxuXHRcdGxldCB0b3BCbG9jayA9IHBhcnNlSW50KHRoaXMuYmxvY2tBcnJbMF0uc3R5bGUudG9wKSAvIEJMT0NLU0laRTtcclxuXHRcdGZvcihsZXQgaSA9IDAsIGxlbjEgPSBhZnRlckFyci5sZW5ndGg7IGkgPCBsZW4xOyBpKyspe1x0Ly8g6YCQ5Liq5Yik5pat5peL6L2s5LmL5ZCO55qE5L2N572u5piv5ZCm6LaF6L+H6L6555WMXHJcblx0XHRcdGxldCBjdXJyZW50Um93ID0gYWZ0ZXJBcnJbaV07XHJcblx0XHRcdGZvcihsZXQgaiA9IDAsIGxlbjIgPSBjdXJyZW50Um93Lmxlbmd0aDsgaiA8IGxlbjI7IGorKyl7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRMZWZ0ID0gbGVmdEJsb2NrICsgaixcclxuXHRcdFx0XHQgICAgY3VycmVudEJvdHRvbSA9IHRvcEJsb2NrICsgaSArIDE7XHJcblx0XHRcdFx0aWYoY3VycmVudExlZnQgPCAwIHx8IGN1cnJlbnRMZWZ0ID49IHRoaXMucGFyZW50LmJsb2NrV2lkdGgpe1x0Ly8g6LaF5Ye65a695bqmXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGN1cnJlbnRCb3R0b20gPCAxIHx8IGN1cnJlbnRCb3R0b20gPj0gdGhpcy5wYXJlbnQuYmxvY2tIZWlnaHQpeyAvLyDotoXlh7rpq5jluqZcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoY3VycmVudEJvdHRvbSA+ICh0aGlzLnBhcmVudC5ib3JkZXJbY3VycmVudExlZnRdIC8gQkxPQ0tTSVpFKSl7IC8vIOi2heWHuuWPr+eUqOmrmOW6plxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOWIpOaWreW9k+WJjea0u+WKqOaWueWdl+aYr+WQpuWPr+S7peenu+WKqFxyXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZGlyZWN0aW9uIOenu+WKqOaWueWQkVxyXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICDmmK/lkKblj6/ku6Xnp7vliqhcclxuXHQgKi9cclxuXHRjYW5tb3ZlKGRpcmVjdGlvbil7XHJcblx0XHRpZihkaXJlY3Rpb24gPT09ICdyb3RhdGUnKXtcdC8vIOWmguaenOaYr+aXi+i9rFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fY2FuUm90YXRlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ibG9ja0Fyci5ldmVyeSgoaXRlbSkgPT4ge1x0Ly8g5Yik5pat5YyF5ZCr55qE5q+P5LiA5Liq5bCP5pa55Z2X5piv5ZCm5Y+v5Lul56e75YqoXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NhblNpbmdsZU1vdmUoaXRlbSwgZGlyZWN0aW9uKVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cdFx0XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOi/m+ihjOenu+WKqFxyXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZGlyZWN0aW9uIOenu+WKqOaWueWQkVxyXG5cdCAqL1xyXG5cdG1vdmUoZGlyZWN0aW9uKXtcclxuXHRcdHN3aXRjaChkaXJlY3Rpb24pe1xyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHR0aGlzLmJsb2NrQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdGl0ZW0uc3R5bGUubGVmdCA9IChwYXJzZUludChpdGVtLnN0eWxlLmxlZnQpIC0gU1RFUExFTkdUSCkgKyAncHgnO1xyXG5cdFx0XHRcdH0pO1x0XHRcdFx0XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHR0aGlzLmJsb2NrQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdGl0ZW0uc3R5bGUubGVmdCA9IChwYXJzZUludChpdGVtLnN0eWxlLmxlZnQpICsgU1RFUExFTkdUSCkgKyAncHgnO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHR0aGlzLmJsb2NrQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdGl0ZW0uc3R5bGUudG9wID0gKHBhcnNlSW50KGl0ZW0uc3R5bGUudG9wKSArIFNURVBMRU5HVEgpICsgJ3B4JztcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncm90YXRlJzpcclxuXHRcdFx0XHR0aGlzLl9yb3RhdGUoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJsb2NrO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9ibG9jay5qcyIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yMSAyMjoyMjo1MlxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTA6MTQ6MTJcclxuKi9cclxuXHJcbmltcG9ydCBUZXRyaXNBcmVhIGZyb20gJy4vdGV0cmlzQXJlYSc7XHJcbnJlcXVpcmUoJy4uL3N0eWxlL25vcm1hbGl6ZS5jc3MnKTtcclxucmVxdWlyZSgnLi4vc3R5bGUvdGV0cmlzLmNzcycpO1xyXG5cclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0bGV0IHRldHJpc0FyZWEgPSBuZXcgVGV0cmlzQXJlYSgpO1xyXG5cdH0sMTAwKTtcclxuXHRcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tYWluLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==