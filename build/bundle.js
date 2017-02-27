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
/******/ 	var hotCurrentHash = "1c15da16b514b6e03839"; // eslint-disable-line no-unused-vars
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
/******/ 	return hotCreateRequire(9)(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\r\n\r\n/**\r\n * 1. Set default font family to sans-serif.\r\n * 2. Prevent iOS text size adjust after orientation change, without disabling\r\n *    user zoom.\r\n */\r\n\r\nhtml {\r\n  font-family: sans-serif; /* 1 */\r\n  -ms-text-size-adjust: 100%; /* 2 */\r\n  -webkit-text-size-adjust: 100%; /* 2 */\r\n}\r\n\r\n/**\r\n * Remove default margin.\r\n */\r\n\r\nbody {\r\n  margin: 0;\r\n}\r\n\r\n/* HTML5 display definitions\r\n   ========================================================================== */\r\n\r\n/**\r\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\r\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\r\n * and Firefox.\r\n * Correct `block` display not defined for `main` in IE 11.\r\n */\r\n\r\narticle,\r\naside,\r\ndetails,\r\nfigcaption,\r\nfigure,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmain,\r\nmenu,\r\nnav,\r\nsection,\r\nsummary {\r\n  display: block;\r\n}\r\n\r\n/**\r\n * 1. Correct `inline-block` display not defined in IE 8/9.\r\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\r\n */\r\n\r\naudio,\r\ncanvas,\r\nprogress,\r\nvideo {\r\n  display: inline-block; /* 1 */\r\n  vertical-align: baseline; /* 2 */\r\n}\r\n\r\n/**\r\n * Prevent modern browsers from displaying `audio` without controls.\r\n * Remove excess height in iOS 5 devices.\r\n */\r\n\r\naudio:not([controls]) {\r\n  display: none;\r\n  height: 0;\r\n}\r\n\r\n/**\r\n * Address `[hidden]` styling not present in IE 8/9/10.\r\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\r\n */\r\n\r\n[hidden],\r\ntemplate {\r\n  display: none;\r\n}\r\n\r\n/* Links\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove the gray background color from active links in IE 10.\r\n */\r\n\r\na {\r\n  background-color: transparent;\r\n}\r\n\r\n/**\r\n * Improve readability when focused and also mouse hovered in all browsers.\r\n */\r\n\r\na:active,\r\na:hover {\r\n  outline: 0;\r\n}\r\n\r\n/* Text-level semantics\r\n   ========================================================================== */\r\n\r\n/**\r\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\r\n */\r\n\r\nabbr[title] {\r\n  border-bottom: 1px dotted;\r\n}\r\n\r\n/**\r\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\r\n */\r\n\r\nb,\r\nstrong {\r\n  font-weight: bold;\r\n}\r\n\r\n/**\r\n * Address styling not present in Safari and Chrome.\r\n */\r\n\r\ndfn {\r\n  font-style: italic;\r\n}\r\n\r\n/**\r\n * Address variable `h1` font-size and margin within `section` and `article`\r\n * contexts in Firefox 4+, Safari, and Chrome.\r\n */\r\n\r\nh1 {\r\n  font-size: 2em;\r\n  margin: 0.67em 0;\r\n}\r\n\r\n/**\r\n * Address styling not present in IE 8/9.\r\n */\r\n\r\nmark {\r\n  background: #ff0;\r\n  color: #000;\r\n}\r\n\r\n/**\r\n * Address inconsistent and variable font size in all browsers.\r\n */\r\n\r\nsmall {\r\n  font-size: 80%;\r\n}\r\n\r\n/**\r\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\r\n */\r\n\r\nsub,\r\nsup {\r\n  font-size: 75%;\r\n  line-height: 0;\r\n  position: relative;\r\n  vertical-align: baseline;\r\n}\r\n\r\nsup {\r\n  top: -0.5em;\r\n}\r\n\r\nsub {\r\n  bottom: -0.25em;\r\n}\r\n\r\n/* Embedded content\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove border when inside `a` element in IE 8/9/10.\r\n */\r\n\r\nimg {\r\n  border: 0;\r\n}\r\n\r\n/**\r\n * Correct overflow not hidden in IE 9/10/11.\r\n */\r\n\r\nsvg:not(:root) {\r\n  overflow: hidden;\r\n}\r\n\r\n/* Grouping content\r\n   ========================================================================== */\r\n\r\n/**\r\n * Address margin not present in IE 8/9 and Safari.\r\n */\r\n\r\nfigure {\r\n  margin: 1em 40px;\r\n}\r\n\r\n/**\r\n * Address differences between Firefox and other browsers.\r\n */\r\n\r\nhr {\r\n  box-sizing: content-box;\r\n  height: 0;\r\n}\r\n\r\n/**\r\n * Contain overflow in all browsers.\r\n */\r\n\r\npre {\r\n  overflow: auto;\r\n}\r\n\r\n/**\r\n * Address odd `em`-unit font size rendering in all browsers.\r\n */\r\n\r\ncode,\r\nkbd,\r\npre,\r\nsamp {\r\n  font-family: monospace, monospace;\r\n  font-size: 1em;\r\n}\r\n\r\n/* Forms\r\n   ========================================================================== */\r\n\r\n/**\r\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\r\n * styling of `select`, unless a `border` property is set.\r\n */\r\n\r\n/**\r\n * 1. Correct color not being inherited.\r\n *    Known issue: affects color of disabled elements.\r\n * 2. Correct font properties not being inherited.\r\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\r\n */\r\n\r\nbutton,\r\ninput,\r\noptgroup,\r\nselect,\r\ntextarea {\r\n  color: inherit; /* 1 */\r\n  font: inherit; /* 2 */\r\n  margin: 0; /* 3 */\r\n}\r\n\r\n/**\r\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\r\n */\r\n\r\nbutton {\r\n  overflow: visible;\r\n}\r\n\r\n/**\r\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\r\n * All other form control elements do not inherit `text-transform` values.\r\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\r\n * Correct `select` style inheritance in Firefox.\r\n */\r\n\r\nbutton,\r\nselect {\r\n  text-transform: none;\r\n}\r\n\r\n/**\r\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\r\n *    and `video` controls.\r\n * 2. Correct inability to style clickable `input` types in iOS.\r\n * 3. Improve usability and consistency of cursor style between image-type\r\n *    `input` and others.\r\n */\r\n\r\nbutton,\r\nhtml input[type=\"button\"], /* 1 */\r\ninput[type=\"reset\"],\r\ninput[type=\"submit\"] {\r\n  -webkit-appearance: button; /* 2 */\r\n  cursor: pointer; /* 3 */\r\n}\r\n\r\n/**\r\n * Re-set default cursor for disabled elements.\r\n */\r\n\r\nbutton[disabled],\r\nhtml input[disabled] {\r\n  cursor: default;\r\n}\r\n\r\n/**\r\n * Remove inner padding and border in Firefox 4+.\r\n */\r\n\r\nbutton::-moz-focus-inner,\r\ninput::-moz-focus-inner {\r\n  border: 0;\r\n  padding: 0;\r\n}\r\n\r\n/**\r\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\r\n * the UA stylesheet.\r\n */\r\n\r\ninput {\r\n  line-height: normal;\r\n}\r\n\r\n/**\r\n * It's recommended that you don't attempt to style these elements.\r\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\r\n *\r\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\r\n * 2. Remove excess padding in IE 8/9/10.\r\n */\r\n\r\ninput[type=\"checkbox\"],\r\ninput[type=\"radio\"] {\r\n  box-sizing: border-box; /* 1 */\r\n  padding: 0; /* 2 */\r\n}\r\n\r\n/**\r\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\r\n * `font-size` values of the `input`, it causes the cursor style of the\r\n * decrement button to change from `default` to `text`.\r\n */\r\n\r\ninput[type=\"number\"]::-webkit-inner-spin-button,\r\ninput[type=\"number\"]::-webkit-outer-spin-button {\r\n  height: auto;\r\n}\r\n\r\n/**\r\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\r\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\r\n *    (include `-moz` to future-proof).\r\n */\r\n\r\ninput[type=\"search\"] {\r\n  -webkit-appearance: textfield; /* 1 */ /* 2 */\r\n  box-sizing: content-box;\r\n}\r\n\r\n/**\r\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\r\n * Safari (but not Chrome) clips the cancel button when the search input has\r\n * padding (and `textfield` appearance).\r\n */\r\n\r\ninput[type=\"search\"]::-webkit-search-cancel-button,\r\ninput[type=\"search\"]::-webkit-search-decoration {\r\n  -webkit-appearance: none;\r\n}\r\n\r\n/**\r\n * Define consistent border, margin, and padding.\r\n */\r\n\r\nfieldset {\r\n  border: 1px solid #c0c0c0;\r\n  margin: 0 2px;\r\n  padding: 0.35em 0.625em 0.75em;\r\n}\r\n\r\n/**\r\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\r\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\r\n */\r\n\r\nlegend {\r\n  border: 0; /* 1 */\r\n  padding: 0; /* 2 */\r\n}\r\n\r\n/**\r\n * Remove default vertical scrollbar in IE 8/9/10/11.\r\n */\r\n\r\ntextarea {\r\n  overflow: auto;\r\n}\r\n\r\n/**\r\n * Don't inherit the `font-weight` (applied by a rule above).\r\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\r\n */\r\n\r\noptgroup {\r\n  font-weight: bold;\r\n}\r\n\r\n/* Tables\r\n   ========================================================================== */\r\n\r\n/**\r\n * Remove most spacing between table cells.\r\n */\r\n\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n}\r\n\r\ntd,\r\nth {\r\n  padding: 0;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, "/*\r\n* @Author: liujiajun\r\n* @Date:   2017-02-21 21:59:47\r\n* @Last Modified by:   liujiajun\r\n* @Last Modified time: 2017-02-26 17:31:06\r\n*/\r\n#wrapper{\r\n\twidth: 300px;\r\n\theight: 600px;\r\n\tmargin: 10px auto;\r\n\tborder: 1px solid #333;\r\n\tposition: relative;\r\n}\r\n.block{\r\n\tbox-sizing: border-box;\r\n\tposition: absolute;\r\n\twidth: 30px;\r\n\theight: 30px;\r\n}\r\n.block-active-0{\r\n\tbackground: #9f5f9f;\r\n}\r\n.block-active-2{\r\n\tbackground: #93db70;\r\n}\r\n.block-active-3{\r\n\tbackground: #7f00ff;\r\n}\r\n.block-active-4{\r\n\tbackground: #8e6b23;\r\n}\r\n.block-active-1{\r\n\tbackground: #236b8e;\r\n}\r\n.block-inactive{\r\n\tbackground: #7093db;\r\n}\r\n.block-eliminate{\r\n\tbackground: #f00;\r\n}", ""]);

// exports


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__block_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(2);
/*
* @Author: liujiajun
* @Date:   2017-02-27 09:51:25
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 11:23:29
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
				inactiveBlocksSim.push({ // 遍历并格式化后加入inactiveBlocksSim数组
					left: parseInt(currentBlock.style.left),
					top: parseInt(currentBlock.style.top)
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
		    eliminateCount = 0;
		for (let i = 0; i < this.blockHeight; i++) {
			let currentRow = this.inactiveBlocks[i];
			if (currentRow.length === fullWidth) {
				// 该行已满需要消除
				this.beforeElinimateRow(i); // 提示用户该行即将消除
				setTimeout(() => {
					this.elinimateRow(i);
				}, 100);
				eliminateCount++;
			}
		}
		return eliminateCount > 0;
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
		for (let i = rowNum - 1; i > 0; i--) {
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(0);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(0, function() {
			var newContent = __webpack_require__(0);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(4)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(1, function() {
			var newContent = __webpack_require__(1);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_js__ = __webpack_require__(2);
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
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tetrisArea__ = __webpack_require__(5);
/*
* @Author: liujiajun
* @Date:   2017-02-21 22:22:52
* @Last Modified by:   liujiajun
* @Last Modified time: 2017-02-27 10:14:12
*/


__webpack_require__(6);
__webpack_require__(7);

window.onload = function () {
	setTimeout(function () {
		let tetrisArea = new __WEBPACK_IMPORTED_MODULE_0__tetrisArea__["a" /* default */]();
	}, 100);
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMWMxNWRhMTZiNTE0YjZlMDM4MzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlL25vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlL3RldHJpcy5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdGV0cmlzQXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvbm9ybWFsaXplLmNzcz82NTZjIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS90ZXRyaXMuY3NzP2EzODEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2Jsb2NrLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbIkJMT0NLU0laRSIsIlNURVBMRU5HVEgiLCJCTE9DS1RZUEUiLCJUZXRyaXNBcmVhIiwiY29uc3RydWN0b3IiLCJhY3RpdmVCbG9jayIsIm5vS2V5UHJlc3MiLCJkaXYiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsImJvZHkiLCJhcHBlbmQiLCJ3aW5kb3ciLCJvbmtleWRvd24iLCJiaW5kIiwic3R5bGUiLCJnZXRDb21wdXRlZFN0eWxlIiwid2lkdGgiLCJwYXJzZUludCIsImhlaWdodCIsImJsb2NrV2lkdGgiLCJibG9ja0hlaWdodCIsImJvcmRlciIsImxlbmd0aCIsImZpbGwiLCJpbmFjdGl2ZUJsb2NrcyIsImkiLCJzdGFydEdhbWUiLCJuZXdBY3RpdmVCbG9jayIsInR5cGUiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJhcnIiLCJwYXJlbnQiLCJjYW5tb3ZlIiwiYWxlcnQiLCJibG9ja0Ryb3AiLCJkZWxldGVBY3RpdmVCbG9jayIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsImtleSIsImtleUNvZGUiLCJkaXJlY3Rpb24iLCJtb3ZlIiwiZ2V0Qm9yZGVyIiwiaW5hY3RpdmVCbG9ja3NTaW0iLCJjdXJyZW50Um93IiwiaiIsImN1cnJlbnRCbG9jayIsInB1c2giLCJsZWZ0IiwidG9wIiwiY29sdW1uQXJyIiwiZmlsdGVyIiwiaXRlbSIsInNvcnQiLCJhIiwiYiIsInRpbWVvdXQiLCJ0bUZ1bmN0aW9uIiwic2V0VGltZW91dCIsImJsb2NrQXRCb3R0b20iLCJjdXJyZW50QmxvY2tzIiwiYmxvY2tBcnIiLCJjbGFzc05hbWUiLCJ0b3BCbG9jayIsImNhbEVsaW5pbWF0ZSIsImZ1bGxXaWR0aCIsImVsaW1pbmF0ZUNvdW50IiwiYmVmb3JlRWxpbmltYXRlUm93IiwiZWxpbmltYXRlUm93Iiwicm93TnVtIiwicmVtb3ZlQ2hpbGQiLCJCbG9jayIsInBhcmFtcyIsIl9kcmF3Iiwib3JpZ2luVG9wIiwib3JpZ2luTGVmdCIsIm9yaWdpbkNsYXNzIiwidG1wQ2xhc3NOYW1lIiwic3ViQmxvY2siLCJhcHBlbmRDaGlsZCIsIl9yb3RhdGUiLCJsZW4iLCJfcm90YXRlQXJyIiwidGVtcEFyciIsIl9jYW5TaW5nbGVNb3ZlIiwibGVmdEJsb2NrIiwiYm90dG9tIiwiX2NhblJvdGF0ZSIsImFmdGVyQXJyIiwibGVuMSIsImxlbjIiLCJjdXJyZW50TGVmdCIsImN1cnJlbnRCb3R0b20iLCJldmVyeSIsImZvckVhY2giLCJyZXF1aXJlIiwib25sb2FkIiwidGV0cmlzQXJlYSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBLG1DQUEyQjtBQUMzQixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0EsYUFBSztBQUNMLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBYSw0QkFBNEI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWUsdUNBQXVDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZSxzQkFBc0I7QUFDckM7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQWEsd0NBQXdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0EsOENBQXNDLHVCQUF1Qjs7QUFFN0Q7QUFDQTs7Ozs7OztBQ25zQkE7QUFDQTs7O0FBR0E7QUFDQSwyUUFBNFEsOEJBQThCLHlDQUF5Qyw2Q0FBNkMsYUFBYSw2REFBNkQsZ0JBQWdCLEtBQUssNGdCQUE0Z0IscUJBQXFCLEtBQUsscU5BQXFOLDRCQUE0Qix1Q0FBdUMsYUFBYSxzS0FBc0ssb0JBQW9CLGdCQUFnQixLQUFLLHNMQUFzTCxvQkFBb0IsS0FBSyxvTUFBb00sb0NBQW9DLEtBQUssK0hBQStILGlCQUFpQixLQUFLLGlPQUFpTyxnQ0FBZ0MsS0FBSywrR0FBK0csd0JBQXdCLEtBQUssdUZBQXVGLHlCQUF5QixLQUFLLGdLQUFnSyxxQkFBcUIsdUJBQXVCLEtBQUssNkVBQTZFLHVCQUF1QixrQkFBa0IsS0FBSyxvR0FBb0cscUJBQXFCLEtBQUssOEdBQThHLHFCQUFxQixxQkFBcUIseUJBQXlCLCtCQUErQixLQUFLLGFBQWEsa0JBQWtCLEtBQUssYUFBYSxzQkFBc0IsS0FBSyx3TUFBd00sZ0JBQWdCLEtBQUssMkZBQTJGLHVCQUF1QixLQUFLLHdNQUF3TSx1QkFBdUIsS0FBSyw0RkFBNEYsOEJBQThCLGdCQUFnQixLQUFLLHVFQUF1RSxxQkFBcUIsS0FBSywwSEFBMEgsd0NBQXdDLHFCQUFxQixLQUFLLDhqQkFBOGpCLHFCQUFxQiw0QkFBNEIsd0JBQXdCLGFBQWEsNEZBQTRGLHdCQUF3QixLQUFLLGlWQUFpViwyQkFBMkIsS0FBSyw4WkFBOFosaUNBQWlDLDhCQUE4QixhQUFhLHdIQUF3SCxzQkFBc0IsS0FBSyxxSUFBcUksZ0JBQWdCLGlCQUFpQixLQUFLLDBJQUEwSSwwQkFBMEIsS0FBSyxxVkFBcVYsNkJBQTZCLHlCQUF5QixhQUFhLDBWQUEwVixtQkFBbUIsS0FBSyw2T0FBNk8sb0NBQW9DLDhDQUE4QyxLQUFLLG9WQUFvViwrQkFBK0IsS0FBSyx5RkFBeUYsZ0NBQWdDLG9CQUFvQixxQ0FBcUMsS0FBSyxnTEFBZ0wsZ0JBQWdCLHlCQUF5QixhQUFhLDZGQUE2RixxQkFBcUIsS0FBSyxvTEFBb0wsd0JBQXdCLEtBQUsscUxBQXFMLGdDQUFnQyx3QkFBd0IsS0FBSyxtQkFBbUIsaUJBQWlCLEtBQUs7O0FBRXJ6Ujs7Ozs7OztBQ1BBO0FBQ0E7OztBQUdBO0FBQ0EsMExBQTJMLG1CQUFtQixvQkFBb0Isd0JBQXdCLDZCQUE2Qix5QkFBeUIsS0FBSyxXQUFXLDZCQUE2Qix5QkFBeUIsa0JBQWtCLG1CQUFtQixLQUFLLG9CQUFvQiwwQkFBMEIsS0FBSyxvQkFBb0IsMEJBQTBCLEtBQUssb0JBQW9CLDBCQUEwQixLQUFLLG9CQUFvQiwwQkFBMEIsS0FBSyxvQkFBb0IsMEJBQTBCLEtBQUssb0JBQW9CLDBCQUEwQixLQUFLLHFCQUFxQix1QkFBdUIsS0FBSzs7QUFFbndCOzs7Ozs7Ozs7O0FDUEE7QUFBQTs7Ozs7OztBQU9BOztBQUNBLE1BQU1BLFlBQWEsRUFBbkIsQyxDQUF1QjtBQUN2QixNQUFNQyxhQUFhLEVBQW5COztBQUVBOzs7QUFHQSxNQUFNQyxZQUFZLENBQ2pCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVQsQ0FEaUIsRUFFakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILENBQWIsQ0FGaUIsRUFHakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVCxDQUhpQixFQUlqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBYixDQUppQixFQUtqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUQsRUFBVSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFWLENBTGlCLEVBTWpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFiLENBTmlCLEVBT2pCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFVLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVYsQ0FQaUIsRUFRakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILENBQWIsQ0FSaUIsRUFTakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVCxDQVRpQixFQVVqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBYixDQVZpQixFQVdqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLEVBQU8sQ0FBUCxDQUFELENBWGlCLEVBWWpCLENBQUMsQ0FBQyxDQUFELENBQUQsRUFBSyxDQUFDLENBQUQsQ0FBTCxFQUFTLENBQUMsQ0FBRCxDQUFULEVBQWEsQ0FBQyxDQUFELENBQWIsQ0FaaUIsRUFhakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsQ0FiaUIsRUFjakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVCxDQWRpQixFQWVqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBYixDQWZpQixFQWdCakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVCxDQWhCaUIsRUFpQmpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQLEVBQWMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFkLENBakJpQixFQWtCakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVUsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVixDQWxCaUIsRUFtQmpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFiLENBbkJpQixDQUFsQjs7Ozs7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQSx3Q0FBd0MsZ0JBQWdCO0FBQ3hELElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxvQkFBb0I7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isc0JBQXNCO0FBQ3RDO0FBQ0E7QUFDQSxrQkFBa0IsMkJBQTJCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsbUJBQW1CO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDJCQUEyQjtBQUM1QztBQUNBO0FBQ0EsUUFBUSx1QkFBdUI7QUFDL0I7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGdDQUFnQyxzQkFBc0I7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3JQQTtBQUFBOzs7Ozs7O0FBT0E7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0EsTUFBTUMsVUFBTixDQUFnQjtBQUNmQyxlQUFhO0FBQ1osT0FBS0MsV0FBTCxHQUFtQixJQUFuQixDQURZLENBQ2E7QUFDekIsT0FBS0MsVUFBTCxHQUFrQixLQUFsQjs7QUFFQSxPQUFLQyxHQUFMLEdBQVdDLFNBQVNDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FBWDtBQUNBLE9BQUtGLEdBQUwsQ0FBU0csRUFBVCxHQUFjLFNBQWQ7QUFDQUYsV0FBU0csSUFBVCxDQUFjQyxNQUFkLENBQXFCLEtBQUtMLEdBQTFCOztBQUVBTSxTQUFPQyxTQUFQLEdBQW1CLEtBQUtBLFNBQUwsQ0FBZUMsSUFBZixDQUFvQixJQUFwQixDQUFuQjs7QUFFQSxNQUFJQyxRQUFRSCxPQUFPSSxnQkFBUCxDQUF3QixLQUFLVixHQUE3QixDQUFaO0FBQ0EsT0FBS1csS0FBTCxHQUFhQyxTQUFTSCxNQUFNRSxLQUFmLENBQWI7QUFDQSxPQUFLRSxNQUFMLEdBQWNELFNBQVNILE1BQU1JLE1BQWYsQ0FBZDtBQUNBLE9BQUtDLFVBQUwsR0FBa0IsS0FBS0gsS0FBTCxHQUFhLDBEQUEvQixDQWJZLENBYThCO0FBQzFDLE9BQUtJLFdBQUwsR0FBbUIsS0FBS0YsTUFBTCxHQUFjLDBEQUFqQzs7QUFFQTtBQUNBO0FBQ0EsT0FBS0csTUFBTCxHQUFjLEVBQWQ7QUFDQSxPQUFLQSxNQUFMLENBQVlDLE1BQVosR0FBcUIsS0FBS0gsVUFBMUI7QUFDQSxPQUFLRSxNQUFMLENBQVlFLElBQVosQ0FBaUIsS0FBS0wsTUFBdEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBS00sY0FBTCxHQUFzQixFQUF0QjtBQUNBO0FBQ0EsT0FBSSxJQUFJQyxJQUFJLENBQVosRUFBZUEsSUFBSSxLQUFLTCxXQUF4QixFQUFxQ0ssR0FBckMsRUFBeUM7QUFDeEMsUUFBS0QsY0FBTCxDQUFvQkMsQ0FBcEIsSUFBeUIsRUFBekI7QUFDQTs7QUFFRCxPQUFLQyxTQUFMO0FBQ0E7QUFDRDs7O0FBR0FDLGtCQUFnQjtBQUNmLE1BQUlDLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsTUFBTCxLQUFnQiwwREFBQS9CLENBQVVzQixNQUFyQyxDQUFYO0FBQ0EsT0FBS25CLFdBQUwsR0FBbUIsSUFBSSwwREFBSixDQUFVO0FBQzVCNkIsUUFBSywwREFBQWhDLENBQVU0QixJQUFWLENBRHVCO0FBRTVCSyxXQUFRO0FBRm9CLEdBQVYsQ0FBbkI7QUFJQSxNQUFHLENBQUMsS0FBSzlCLFdBQUwsQ0FBaUIrQixPQUFqQixDQUF5QixNQUF6QixDQUFKLEVBQXFDO0FBQ3BDQyxTQUFNLFdBQU47QUFDQTtBQUNBO0FBQ0QsT0FBS0MsU0FBTCxHQVZlLENBVUc7QUFDbEIsT0FBS2hDLFVBQUwsR0FBa0IsS0FBbEI7QUFDQTtBQUNEaUMscUJBQW1CO0FBQ2xCLE9BQUtsQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0E7QUFDRFMsV0FBVTBCLENBQVYsRUFBWTtBQUNYQSxJQUFFQyxlQUFGO0FBQ0FELElBQUVFLGNBQUY7QUFDQSxNQUFHLEtBQUtwQyxVQUFSLEVBQW1CO0FBQ2xCLFVBQU8sS0FBUDtBQUNBO0FBQ0QsTUFBSXFDLE1BQU1ILEVBQUVJLE9BQVo7QUFDQSxNQUFJQyxTQUFKO0FBQ0EsVUFBT0YsR0FBUDtBQUNDLFFBQUssRUFBTDtBQUNDRSxnQkFBWSxNQUFaO0FBQ0E7QUFDRCxRQUFLLEVBQUw7QUFBUztBQUNSQSxnQkFBWSxRQUFaO0FBQ0E7QUFDRCxRQUFLLEVBQUw7QUFDQ0EsZ0JBQVksT0FBWjtBQUNBO0FBQ0QsUUFBSyxFQUFMO0FBQ0NBLGdCQUFZLE1BQVo7QUFDQTtBQUNEO0FBQ0NBLGdCQUFZLE1BQVo7QUFDQTtBQWZGO0FBaUJBLE9BQUt4QyxXQUFMLElBQW9CLEtBQUtBLFdBQUwsQ0FBaUIrQixPQUFqQixDQUF5QlMsU0FBekIsQ0FBcEIsSUFBMkQsS0FBS3hDLFdBQUwsQ0FBaUJ5QyxJQUFqQixDQUFzQkQsU0FBdEIsQ0FBM0Q7QUFDQTtBQUNEakIsYUFBVztBQUNWLE9BQUtDLGNBQUw7QUFDQTtBQUNEOzs7OztBQUtBa0IsYUFBVztBQUNWLE9BQUt4QixNQUFMLENBQVlFLElBQVosQ0FBaUIsS0FBS0wsTUFBdEI7QUFDQSxNQUFJNEIsb0JBQW9CLEVBQXhCO0FBQ0EsT0FBSSxJQUFJckIsSUFBSSxDQUFaLEVBQWVBLElBQUcsS0FBS0wsV0FBdkIsRUFBb0NLLEdBQXBDLEVBQXdDO0FBQ3ZDLE9BQUlzQixhQUFhLEtBQUt2QixjQUFMLENBQW9CQyxDQUFwQixDQUFqQjtBQUNBLFFBQUksSUFBSXVCLElBQUksQ0FBWixFQUFlQSxJQUFJRCxXQUFXekIsTUFBOUIsRUFBc0MwQixHQUF0QyxFQUEwQztBQUN6QyxRQUFJQyxlQUFlRixXQUFXQyxDQUFYLENBQW5CO0FBQ0FGLHNCQUFrQkksSUFBbEIsQ0FBdUIsRUFBRTtBQUN4QkMsV0FBTWxDLFNBQVNnQyxhQUFhbkMsS0FBYixDQUFtQnFDLElBQTVCLENBRGdCO0FBRXRCQyxVQUFLbkMsU0FBU2dDLGFBQWFuQyxLQUFiLENBQW1Cc0MsR0FBNUI7QUFGaUIsS0FBdkI7QUFJQTtBQUNEOztBQUVELE9BQUksSUFBSTNCLElBQUksQ0FBWixFQUFlQSxJQUFJLEtBQUtOLFVBQXhCLEVBQW9DTSxHQUFwQyxFQUF3QztBQUN2QyxPQUFJNEIsWUFBWVAsa0JBQWtCUSxNQUFsQixDQUEwQkMsSUFBRCxJQUFVO0FBQUU7QUFDcEQsV0FBT0EsS0FBS0osSUFBTCxHQUFZLDBEQUFaLEtBQTBCMUIsQ0FBakM7QUFDQSxJQUZlLENBQWhCO0FBR0EsT0FBRzRCLFVBQVUvQixNQUFWLElBQW9CLENBQXZCLEVBQXlCO0FBQ3hCO0FBQ0E7QUFDRCtCLGFBQVVHLElBQVYsQ0FBZSxDQUFDQyxDQUFELEVBQUdDLENBQUgsS0FBUztBQUFFO0FBQ3pCLFdBQU9ELEVBQUVMLEdBQUYsR0FBUU0sRUFBRU4sR0FBakI7QUFDQSxJQUZEO0FBR0FDLGFBQVUsQ0FBVixNQUFpQixLQUFLaEMsTUFBTCxDQUFZSSxDQUFaLElBQWlCNEIsVUFBVSxDQUFWLEVBQWFELEdBQS9DLEVBVnVDLENBVWM7QUFDckQ7QUFDRDtBQUNEOzs7QUFHQWhCLGFBQVc7QUFDVixNQUFJdUIsT0FBSjtBQUNBLE1BQUlDLGFBQWEsTUFBTTtBQUN0QixPQUFHLEtBQUt6RCxXQUFMLElBQW9CLEtBQUtBLFdBQUwsQ0FBaUIrQixPQUFqQixDQUF5QixNQUF6QixDQUF2QixFQUF3RDtBQUN2RCxTQUFLL0IsV0FBTCxDQUFpQnlDLElBQWpCLENBQXNCLE1BQXRCO0FBQ0FlLGNBQVVFLFdBQVdELFVBQVgsRUFBdUIsR0FBdkIsQ0FBVjtBQUNBLElBSEQsTUFJSTtBQUNILFNBQUtFLGFBQUw7QUFDQTtBQUNELEdBUkQ7QUFTQUgsWUFBVUUsV0FBV0QsVUFBWCxFQUF1QixHQUF2QixDQUFWO0FBQ0E7QUFDRDs7O0FBR0FFLGlCQUFlO0FBQ2QsT0FBSzFELFVBQUwsR0FBa0IsSUFBbEI7O0FBRUEsTUFBSTJELGdCQUFnQixLQUFLNUQsV0FBTCxDQUFpQjZELFFBQXJDO0FBQ0EsT0FBSSxJQUFJdkMsSUFBSSxDQUFaLEVBQWVBLElBQUdzQyxjQUFjekMsTUFBaEMsRUFBd0NHLEdBQXhDLEVBQTRDO0FBQUU7QUFDN0MsT0FBSThCLE9BQU9RLGNBQWN0QyxDQUFkLENBQVg7QUFDQThCLFFBQUtVLFNBQUwsR0FBaUIsc0JBQWpCO0FBQ0EsT0FBSUMsV0FBV2pELFNBQVNzQyxLQUFLekMsS0FBTCxDQUFXc0MsR0FBcEIsSUFBMkIsMERBQTFDO0FBQ0EsUUFBSzVCLGNBQUwsQ0FBb0IwQyxRQUFwQixFQUE4QmhCLElBQTlCLENBQW1DSyxJQUFuQztBQUNBO0FBQ0QsTUFBRyxLQUFLWSxZQUFMLEVBQUgsRUFBdUI7QUFBRTtBQUN4Qk4sY0FBVyxNQUFNO0FBQ2hCLFNBQUtoQixTQUFMO0FBQ0EsU0FBS2xCLGNBQUw7QUFDQSxJQUhELEVBR0csSUFISDtBQUlBLEdBTEQsTUFNSTtBQUNILFFBQUtrQixTQUFMO0FBQ0EsUUFBS2xCLGNBQUw7QUFDQTtBQUNEO0FBQ0Q7Ozs7O0FBS0F3QyxnQkFBYztBQUNiLE1BQUlDLFlBQVksS0FBS2pELFVBQXJCO0FBQUEsTUFDQ2tELGlCQUFpQixDQURsQjtBQUVBLE9BQUksSUFBSTVDLElBQUksQ0FBWixFQUFlQSxJQUFJLEtBQUtMLFdBQXhCLEVBQXFDSyxHQUFyQyxFQUF5QztBQUN4QyxPQUFJc0IsYUFBYSxLQUFLdkIsY0FBTCxDQUFvQkMsQ0FBcEIsQ0FBakI7QUFDQSxPQUFHc0IsV0FBV3pCLE1BQVgsS0FBc0I4QyxTQUF6QixFQUFtQztBQUFFO0FBQ3BDLFNBQUtFLGtCQUFMLENBQXdCN0MsQ0FBeEIsRUFEa0MsQ0FDTjtBQUM1Qm9DLGVBQVcsTUFBTTtBQUNoQixVQUFLVSxZQUFMLENBQWtCOUMsQ0FBbEI7QUFDQSxLQUZELEVBRUUsR0FGRjtBQUdBNEM7QUFDQTtBQUNEO0FBQ0QsU0FBT0EsaUJBQWlCLENBQXhCO0FBQ0E7QUFDRDs7OztBQUlBQyxvQkFBbUJFLE1BQW5CLEVBQTBCO0FBQ3pCLE1BQUlKLFlBQVksS0FBS2pELFVBQXJCO0FBQ0EsT0FBSSxJQUFJTSxJQUFJLENBQVosRUFBZUEsSUFBSTJDLFNBQW5CLEVBQThCM0MsR0FBOUIsRUFBa0M7QUFDakMsUUFBS0QsY0FBTCxDQUFvQmdELE1BQXBCLEVBQTRCL0MsQ0FBNUIsRUFBK0J3QyxTQUEvQixHQUEyQyx1QkFBM0M7QUFDQTtBQUNEO0FBQ0Q7Ozs7QUFJQU0sY0FBYUMsTUFBYixFQUFvQjtBQUNuQixNQUFJSixZQUFZLEtBQUtqRCxVQUFyQjtBQUNBLE9BQUksSUFBSU0sSUFBSSxDQUFaLEVBQWVBLElBQUkyQyxTQUFuQixFQUE4QjNDLEdBQTlCLEVBQWtDO0FBQ2pDLFFBQUtwQixHQUFMLENBQVNvRSxXQUFULENBQXFCLEtBQUtqRCxjQUFMLENBQW9CZ0QsTUFBcEIsRUFBNEIvQyxDQUE1QixDQUFyQixFQURpQyxDQUNxQjtBQUN0RDtBQUNELE9BQUksSUFBSUEsSUFBSStDLFNBQVMsQ0FBckIsRUFBd0IvQyxJQUFJLENBQTVCLEVBQStCQSxHQUEvQixFQUFtQztBQUFFO0FBQ3BDLE9BQUlzQixhQUFhLEtBQUt2QixjQUFMLENBQW9CQyxDQUFwQixDQUFqQjtBQUNBLFFBQUksSUFBSXVCLElBQUksQ0FBWixFQUFlQSxJQUFJRCxXQUFXekIsTUFBOUIsRUFBc0MwQixHQUF0QyxFQUEwQztBQUN6Q0QsZUFBV0MsQ0FBWCxFQUFjbEMsS0FBZCxDQUFvQnNDLEdBQXBCLEdBQTJCbkMsU0FBUzhCLFdBQVdDLENBQVgsRUFBY2xDLEtBQWQsQ0FBb0JzQyxHQUE3QixJQUFvQywwREFBckMsR0FBa0QsSUFBNUU7QUFDQTtBQUNELFFBQUs1QixjQUFMLENBQW9CQyxJQUFJLENBQXhCLElBQTZCc0IsVUFBN0I7QUFDQTtBQUNELE9BQUt2QixjQUFMLENBQW9CLENBQXBCLElBQXlCLEVBQXpCO0FBQ0E7QUExTWM7O0FBNk1oQix3REFBZXZCLFVBQWYsQzs7Ozs7O0FDNU5BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7QUNwQkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7Ozs7QUNwQkE7QUFBQTs7Ozs7OztBQU9BOztBQUNBO0FBQ0E7OztBQUdBLE1BQU15RSxLQUFOLENBQVc7QUFDVnhFLGFBQVl5RSxNQUFaLEVBQW1CO0FBQ2xCLE9BQUszQyxHQUFMLEdBQVcyQyxPQUFPM0MsR0FBbEIsQ0FEa0IsQ0FDSztBQUN2QixPQUFLQyxNQUFMLEdBQWMwQyxPQUFPMUMsTUFBckIsQ0FGa0IsQ0FFVztBQUM3QixPQUFLZixNQUFMLEdBQWMsS0FBS2MsR0FBTCxDQUFTVixNQUFULEdBQWtCLDZEQUFoQztBQUNBLE9BQUtOLEtBQUwsR0FBYSxLQUFLZ0IsR0FBTCxDQUFTLENBQVQsRUFBWVYsTUFBWixHQUFxQiw2REFBbEM7QUFDQSxPQUFLMEMsUUFBTCxHQUFnQixFQUFoQjtBQUNBO0FBQ0EsT0FBS1ksS0FBTCxDQUFXLENBQVgsRUFBYyxDQUFkO0FBQ0E7QUFDRDs7Ozs7O0FBTUFBLE9BQU1DLFNBQU4sRUFBaUJDLFVBQWpCLEVBQTZCQyxXQUE3QixFQUF5QztBQUN4QyxNQUFJN0QsU0FBUyxLQUFLYyxHQUFMLENBQVNWLE1BQXRCO0FBQUEsTUFDSU4sUUFBUSxLQUFLZ0IsR0FBTCxDQUFTLENBQVQsRUFBWVYsTUFEeEI7QUFBQSxNQUVJMEQsZUFBZUQsY0FBY0EsV0FBZCxHQUE0Qix3QkFBd0JsRCxLQUFLQyxLQUFMLENBQVdELEtBQUtFLE1BQUwsS0FBYyxDQUF6QixDQUZ2RTtBQUdBLE9BQUksSUFBSU4sSUFBSSxDQUFaLEVBQWVBLElBQUlQLE1BQW5CLEVBQTJCTyxHQUEzQixFQUNDLEtBQUksSUFBSXVCLElBQUksQ0FBWixFQUFlQSxJQUFJaEMsS0FBbkIsRUFBMEJnQyxHQUExQixFQUE4QjtBQUM3QixPQUFHLEtBQUtoQixHQUFMLENBQVNQLENBQVQsRUFBWXVCLENBQVosS0FBa0IsQ0FBckIsRUFBdUI7QUFDdEIsUUFBSWlDLFdBQVczRSxTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWY7QUFDQTBFLGFBQVNoQixTQUFULEdBQXFCZSxZQUFyQjtBQUNBQyxhQUFTbkUsS0FBVCxDQUFlcUMsSUFBZixHQUF1QkgsSUFBSSw2REFBSixHQUFnQjhCLFVBQWpCLEdBQStCLElBQXJEO0FBQ0FHLGFBQVNuRSxLQUFULENBQWVzQyxHQUFmLEdBQXNCM0IsSUFBSSw2REFBSixHQUFnQm9ELFNBQWpCLEdBQThCLElBQW5EO0FBQ0EsU0FBS2IsUUFBTCxDQUFjZCxJQUFkLENBQW1CK0IsUUFBbkI7QUFDQSxTQUFLaEQsTUFBTCxDQUFZNUIsR0FBWixDQUFnQjZFLFdBQWhCLENBQTRCRCxRQUE1QjtBQUNBO0FBQ0Q7QUFDRjtBQUNEOzs7O0FBSUFFLFdBQVM7QUFDUixNQUFHLEtBQUtuQixRQUFMLENBQWMxQyxNQUFkLElBQXdCLENBQTNCLEVBQTZCO0FBQzVCO0FBQ0E7QUFDRDtBQUNBLE1BQUk2QixPQUFPbEMsU0FBUyxLQUFLK0MsUUFBTCxDQUFjLENBQWQsRUFBaUJsRCxLQUFqQixDQUF1QnFDLElBQWhDLENBQVg7QUFDQSxNQUFJQyxNQUFNbkMsU0FBUyxLQUFLK0MsUUFBTCxDQUFjLENBQWQsRUFBaUJsRCxLQUFqQixDQUF1QnNDLEdBQWhDLENBQVY7QUFDQSxNQUFJMkIsY0FBYyxLQUFLZixRQUFMLENBQWMsQ0FBZCxFQUFpQkMsU0FBbkM7QUFDQTtBQUNBLE9BQUksSUFBSXhDLElBQUksQ0FBUixFQUFXMkQsTUFBTSxLQUFLcEIsUUFBTCxDQUFjMUMsTUFBbkMsRUFBMkNHLElBQUkyRCxHQUEvQyxFQUFvRDNELEdBQXBELEVBQXdEO0FBQ3ZELFFBQUtRLE1BQUwsQ0FBWTVCLEdBQVosQ0FBZ0JvRSxXQUFoQixDQUE0QixLQUFLVCxRQUFMLENBQWN2QyxDQUFkLENBQTVCO0FBQ0E7QUFDRCxPQUFLdUMsUUFBTCxDQUFjMUMsTUFBZCxHQUF1QixDQUF2Qjs7QUFFQSxPQUFLVSxHQUFMLEdBQVcsS0FBS3FELFVBQUwsQ0FBZ0IsS0FBS3JELEdBQXJCLENBQVgsQ0FkUSxDQWM2QjtBQUNyQyxPQUFLNEMsS0FBTCxDQUFXeEIsR0FBWCxFQUFnQkQsSUFBaEIsRUFBc0I0QixXQUF0QixFQWZRLENBZTJCO0FBQ25DO0FBQ0Q7OztBQUdBTSxjQUFZO0FBQ1gsTUFBSXJELE1BQU0sRUFBVjtBQUNBLE1BQUlkLFNBQVMsS0FBS2MsR0FBTCxDQUFTVixNQUF0QjtBQUFBLE1BQ0lOLFFBQVEsS0FBS2dCLEdBQUwsQ0FBUyxDQUFULEVBQVlWLE1BRHhCO0FBRUEsT0FBSSxJQUFJRyxJQUFJLENBQVosRUFBZUEsSUFBSVQsS0FBbkIsRUFBMEJTLEdBQTFCLEVBQThCO0FBQzdCLE9BQUk2RCxVQUFVLEVBQWQ7QUFDQSxRQUFJLElBQUl0QyxJQUFJOUIsU0FBUyxDQUFyQixFQUF3QjhCLEtBQUssQ0FBN0IsRUFBZ0NBLEdBQWhDLEVBQW9DO0FBQ25Dc0MsWUFBUXBDLElBQVIsQ0FBYSxLQUFLbEIsR0FBTCxDQUFTZ0IsQ0FBVCxFQUFZdkIsQ0FBWixDQUFiO0FBQ0E7QUFDRE8sT0FBSWtCLElBQUosQ0FBU29DLE9BQVQ7QUFDQTtBQUNELFNBQU90RCxHQUFQO0FBQ0E7QUFDRDs7Ozs7O0FBTUF1RCxnQkFBZWhDLElBQWYsRUFBcUJaLFNBQXJCLEVBQStCO0FBQzlCLE1BQUk2QyxZQUFZdkUsU0FBU3NDLEtBQUt6QyxLQUFMLENBQVdxQyxJQUFwQixJQUE0Qiw2REFBNUMsQ0FEOEIsQ0FDeUI7QUFDdkQsTUFBSXNDLFNBQVN4RSxTQUFTc0MsS0FBS3pDLEtBQUwsQ0FBV3NDLEdBQXBCLElBQTJCLDZEQUF4QyxDQUY4QixDQUVxQjtBQUNuRCxVQUFPVCxTQUFQO0FBQ0MsUUFBSyxNQUFMO0FBQ0MsV0FBTyxLQUFLVixNQUFMLENBQVlaLE1BQVosQ0FBbUJtRSxZQUFZLENBQS9CLEtBQXNDQyxVQUFVLEtBQUt4RCxNQUFMLENBQVlaLE1BQVosQ0FBbUJtRSxZQUFZLENBQS9CLENBQXZEO0FBQ0QsUUFBSyxPQUFMO0FBQ0MsV0FBTyxLQUFLdkQsTUFBTCxDQUFZWixNQUFaLENBQW1CbUUsWUFBWSxDQUEvQixLQUFzQ0MsVUFBVSxLQUFLeEQsTUFBTCxDQUFZWixNQUFaLENBQW1CbUUsWUFBWSxDQUEvQixDQUF2RDtBQUNELFFBQUssTUFBTDtBQUNDLFdBQU8sS0FBS3ZELE1BQUwsQ0FBWVosTUFBWixDQUFtQm1FLFNBQW5CLEtBQW1DQyxTQUFTLDZEQUFWLElBQXdCLEtBQUt4RCxNQUFMLENBQVlaLE1BQVosQ0FBbUJtRSxTQUFuQixDQUFqRTtBQUNEO0FBQ0MsV0FBTyxLQUFQO0FBUkY7QUFVQTtBQUNEOzs7QUFHQUUsY0FBWTtBQUNYLE1BQUlDLFdBQVcsS0FBS04sVUFBTCxDQUFnQixLQUFLckQsR0FBckIsQ0FBZjtBQUNBLE1BQUl3RCxZQUFZdkUsU0FBUyxLQUFLK0MsUUFBTCxDQUFjLENBQWQsRUFBaUJsRCxLQUFqQixDQUF1QnFDLElBQWhDLElBQXdDLDZEQUF4RDtBQUNBLE1BQUllLFdBQVdqRCxTQUFTLEtBQUsrQyxRQUFMLENBQWMsQ0FBZCxFQUFpQmxELEtBQWpCLENBQXVCc0MsR0FBaEMsSUFBdUMsNkRBQXREO0FBQ0EsT0FBSSxJQUFJM0IsSUFBSSxDQUFSLEVBQVdtRSxPQUFPRCxTQUFTckUsTUFBL0IsRUFBdUNHLElBQUltRSxJQUEzQyxFQUFpRG5FLEdBQWpELEVBQXFEO0FBQUU7QUFDdEQsT0FBSXNCLGFBQWE0QyxTQUFTbEUsQ0FBVCxDQUFqQjtBQUNBLFFBQUksSUFBSXVCLElBQUksQ0FBUixFQUFXNkMsT0FBTzlDLFdBQVd6QixNQUFqQyxFQUF5QzBCLElBQUk2QyxJQUE3QyxFQUFtRDdDLEdBQW5ELEVBQXVEO0FBQ3RELFFBQUk4QyxjQUFjTixZQUFZeEMsQ0FBOUI7QUFBQSxRQUNJK0MsZ0JBQWdCN0IsV0FBV3pDLENBQVgsR0FBZSxDQURuQztBQUVBLFFBQUdxRSxjQUFjLENBQWQsSUFBbUJBLGVBQWUsS0FBSzdELE1BQUwsQ0FBWWQsVUFBakQsRUFBNEQ7QUFBRTtBQUM3RCxZQUFPLEtBQVA7QUFDQTtBQUNELFFBQUc0RSxnQkFBZ0IsQ0FBaEIsSUFBcUJBLGlCQUFpQixLQUFLOUQsTUFBTCxDQUFZYixXQUFyRCxFQUFpRTtBQUFFO0FBQ2xFLFlBQU8sS0FBUDtBQUNBO0FBQ0QsUUFBRzJFLGdCQUFpQixLQUFLOUQsTUFBTCxDQUFZWixNQUFaLENBQW1CeUUsV0FBbkIsSUFBa0MsNkRBQXRELEVBQWlFO0FBQUU7QUFDbEUsWUFBTyxLQUFQO0FBQ0E7QUFDRDtBQUNEO0FBQ0QsU0FBTyxJQUFQO0FBQ0E7QUFDRDs7Ozs7QUFLQTVELFNBQVFTLFNBQVIsRUFBa0I7QUFDakIsTUFBR0EsY0FBYyxRQUFqQixFQUEwQjtBQUFFO0FBQzNCLFVBQU8sS0FBSytDLFVBQUwsRUFBUDtBQUNBLEdBRkQsTUFHSTtBQUNILFVBQU8sS0FBSzFCLFFBQUwsQ0FBY2dDLEtBQWQsQ0FBcUJ6QyxJQUFELElBQVU7QUFBRTtBQUN0QyxXQUFPLEtBQUtnQyxjQUFMLENBQW9CaEMsSUFBcEIsRUFBMEJaLFNBQTFCLENBQVA7QUFDQSxJQUZNLENBQVA7QUFHQTtBQUNEO0FBQ0Q7Ozs7QUFJQUMsTUFBS0QsU0FBTCxFQUFlO0FBQ2QsVUFBT0EsU0FBUDtBQUNDLFFBQUssTUFBTDtBQUNDLFNBQUtxQixRQUFMLENBQWNpQyxPQUFkLENBQXVCMUMsSUFBRCxJQUFVO0FBQy9CQSxVQUFLekMsS0FBTCxDQUFXcUMsSUFBWCxHQUFtQmxDLFNBQVNzQyxLQUFLekMsS0FBTCxDQUFXcUMsSUFBcEIsSUFBNEIsOERBQTdCLEdBQTJDLElBQTdEO0FBQ0EsS0FGRDtBQUdBO0FBQ0QsUUFBSyxPQUFMO0FBQ0MsU0FBS2EsUUFBTCxDQUFjaUMsT0FBZCxDQUF1QjFDLElBQUQsSUFBVTtBQUMvQkEsVUFBS3pDLEtBQUwsQ0FBV3FDLElBQVgsR0FBbUJsQyxTQUFTc0MsS0FBS3pDLEtBQUwsQ0FBV3FDLElBQXBCLElBQTRCLDhEQUE3QixHQUEyQyxJQUE3RDtBQUNBLEtBRkQ7QUFHQTtBQUNELFFBQUssTUFBTDtBQUNDLFNBQUthLFFBQUwsQ0FBY2lDLE9BQWQsQ0FBdUIxQyxJQUFELElBQVU7QUFDL0JBLFVBQUt6QyxLQUFMLENBQVdzQyxHQUFYLEdBQWtCbkMsU0FBU3NDLEtBQUt6QyxLQUFMLENBQVdzQyxHQUFwQixJQUEyQiw4REFBNUIsR0FBMEMsSUFBM0Q7QUFDQSxLQUZEO0FBR0E7QUFDRCxRQUFLLFFBQUw7QUFDQyxTQUFLK0IsT0FBTDtBQUNBO0FBQ0Q7QUFDQztBQXBCRjtBQXNCQTtBQTVKUzs7QUErSlgsd0RBQWVULEtBQWYsQzs7Ozs7Ozs7QUMzS0E7QUFBQTs7Ozs7OztBQU9BO0FBQ0EsbUJBQUF3QixDQUFRLENBQVI7QUFDQSxtQkFBQUEsQ0FBUSxDQUFSOztBQUVBdkYsT0FBT3dGLE1BQVAsR0FBZ0IsWUFBVTtBQUN6QnRDLFlBQVcsWUFBVTtBQUNwQixNQUFJdUMsYUFBYSxJQUFJLDREQUFKLEVBQWpCO0FBQ0EsRUFGRCxFQUVFLEdBRkY7QUFJQSxDQUxELEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IDEwMDAwO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCIxYzE1ZGExNmI1MTRiNmUwMzgzOVwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90TWFpbk1vZHVsZSA9IHRydWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90TWFpbk1vZHVsZSA9IGZhbHNlO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSkge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIFwiZVwiLCB7XHJcbiBcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0dmFsdWU6IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90TWFpbk1vZHVsZSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RNYWluTW9kdWxlID0gdHJ1ZTtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdCgpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDA7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XHJcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xyXG4gXHRcdGlmKCFkZWZlcnJlZCkgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuIFx0XHRcdH0sIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdH1cclxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoOSkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gOSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMWMxNWRhMTZiNTE0YjZlMDM4MzkiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKiEgbm9ybWFsaXplLmNzcyB2My4wLjIgfCBNSVQgTGljZW5zZSB8IGdpdC5pby9ub3JtYWxpemUgKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiAxLiBTZXQgZGVmYXVsdCBmb250IGZhbWlseSB0byBzYW5zLXNlcmlmLlxcclxcbiAqIDIuIFByZXZlbnQgaU9TIHRleHQgc2l6ZSBhZGp1c3QgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlLCB3aXRob3V0IGRpc2FibGluZ1xcclxcbiAqICAgIHVzZXIgem9vbS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5odG1sIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyAvKiAxICovXFxyXFxuICAtbXMtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcclxcbiAgLXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiAxMDAlOyAvKiAyICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSBkZWZhdWx0IG1hcmdpbi5cXHJcXG4gKi9cXHJcXG5cXHJcXG5ib2R5IHtcXHJcXG4gIG1hcmdpbjogMDtcXHJcXG59XFxyXFxuXFxyXFxuLyogSFRNTDUgZGlzcGxheSBkZWZpbml0aW9uc1xcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQ29ycmVjdCBgYmxvY2tgIGRpc3BsYXkgbm90IGRlZmluZWQgZm9yIGFueSBIVE1MNSBlbGVtZW50IGluIElFIDgvOS5cXHJcXG4gKiBDb3JyZWN0IGBibG9ja2AgZGlzcGxheSBub3QgZGVmaW5lZCBmb3IgYGRldGFpbHNgIG9yIGBzdW1tYXJ5YCBpbiBJRSAxMC8xMVxcclxcbiAqIGFuZCBGaXJlZm94LlxcclxcbiAqIENvcnJlY3QgYGJsb2NrYCBkaXNwbGF5IG5vdCBkZWZpbmVkIGZvciBgbWFpbmAgaW4gSUUgMTEuXFxyXFxuICovXFxyXFxuXFxyXFxuYXJ0aWNsZSxcXHJcXG5hc2lkZSxcXHJcXG5kZXRhaWxzLFxcclxcbmZpZ2NhcHRpb24sXFxyXFxuZmlndXJlLFxcclxcbmZvb3RlcixcXHJcXG5oZWFkZXIsXFxyXFxuaGdyb3VwLFxcclxcbm1haW4sXFxyXFxubWVudSxcXHJcXG5uYXYsXFxyXFxuc2VjdGlvbixcXHJcXG5zdW1tYXJ5IHtcXHJcXG4gIGRpc3BsYXk6IGJsb2NrO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiAxLiBDb3JyZWN0IGBpbmxpbmUtYmxvY2tgIGRpc3BsYXkgbm90IGRlZmluZWQgaW4gSUUgOC85LlxcclxcbiAqIDIuIE5vcm1hbGl6ZSB2ZXJ0aWNhbCBhbGlnbm1lbnQgb2YgYHByb2dyZXNzYCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5hdWRpbyxcXHJcXG5jYW52YXMsXFxyXFxucHJvZ3Jlc3MsXFxyXFxudmlkZW8ge1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrOyAvKiAxICovXFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7IC8qIDIgKi9cXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUHJldmVudCBtb2Rlcm4gYnJvd3NlcnMgZnJvbSBkaXNwbGF5aW5nIGBhdWRpb2Agd2l0aG91dCBjb250cm9scy5cXHJcXG4gKiBSZW1vdmUgZXhjZXNzIGhlaWdodCBpbiBpT1MgNSBkZXZpY2VzLlxcclxcbiAqL1xcclxcblxcclxcbmF1ZGlvOm5vdChbY29udHJvbHNdKSB7XFxyXFxuICBkaXNwbGF5OiBub25lO1xcclxcbiAgaGVpZ2h0OiAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIGBbaGlkZGVuXWAgc3R5bGluZyBub3QgcHJlc2VudCBpbiBJRSA4LzkvMTAuXFxyXFxuICogSGlkZSB0aGUgYHRlbXBsYXRlYCBlbGVtZW50IGluIElFIDgvOS8xMSwgU2FmYXJpLCBhbmQgRmlyZWZveCA8IDIyLlxcclxcbiAqL1xcclxcblxcclxcbltoaWRkZW5dLFxcclxcbnRlbXBsYXRlIHtcXHJcXG4gIGRpc3BsYXk6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi8qIExpbmtzXFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW1vdmUgdGhlIGdyYXkgYmFja2dyb3VuZCBjb2xvciBmcm9tIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXHJcXG4gKi9cXHJcXG5cXHJcXG5hIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBJbXByb3ZlIHJlYWRhYmlsaXR5IHdoZW4gZm9jdXNlZCBhbmQgYWxzbyBtb3VzZSBob3ZlcmVkIGluIGFsbCBicm93c2Vycy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5hOmFjdGl2ZSxcXHJcXG5hOmhvdmVyIHtcXHJcXG4gIG91dGxpbmU6IDA7XFxyXFxufVxcclxcblxcclxcbi8qIFRleHQtbGV2ZWwgc2VtYW50aWNzXFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIHN0eWxpbmcgbm90IHByZXNlbnQgaW4gSUUgOC85LzEwLzExLCBTYWZhcmksIGFuZCBDaHJvbWUuXFxyXFxuICovXFxyXFxuXFxyXFxuYWJiclt0aXRsZV0ge1xcclxcbiAgYm9yZGVyLWJvdHRvbTogMXB4IGRvdHRlZDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBzdHlsZSBzZXQgdG8gYGJvbGRlcmAgaW4gRmlyZWZveCA0KywgU2FmYXJpLCBhbmQgQ2hyb21lLlxcclxcbiAqL1xcclxcblxcclxcbmIsXFxyXFxuc3Ryb25nIHtcXHJcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIHN0eWxpbmcgbm90IHByZXNlbnQgaW4gU2FmYXJpIGFuZCBDaHJvbWUuXFxyXFxuICovXFxyXFxuXFxyXFxuZGZuIHtcXHJcXG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyB2YXJpYWJsZSBgaDFgIGZvbnQtc2l6ZSBhbmQgbWFyZ2luIHdpdGhpbiBgc2VjdGlvbmAgYW5kIGBhcnRpY2xlYFxcclxcbiAqIGNvbnRleHRzIGluIEZpcmVmb3ggNCssIFNhZmFyaSwgYW5kIENocm9tZS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5oMSB7XFxyXFxuICBmb250LXNpemU6IDJlbTtcXHJcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3Mgc3R5bGluZyBub3QgcHJlc2VudCBpbiBJRSA4LzkuXFxyXFxuICovXFxyXFxuXFxyXFxubWFyayB7XFxyXFxuICBiYWNrZ3JvdW5kOiAjZmYwO1xcclxcbiAgY29sb3I6ICMwMDA7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3MgaW5jb25zaXN0ZW50IGFuZCB2YXJpYWJsZSBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbnNtYWxsIHtcXHJcXG4gIGZvbnQtc2l6ZTogODAlO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBQcmV2ZW50IGBzdWJgIGFuZCBgc3VwYCBhZmZlY3RpbmcgYGxpbmUtaGVpZ2h0YCBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICovXFxyXFxuXFxyXFxuc3ViLFxcclxcbnN1cCB7XFxyXFxuICBmb250LXNpemU6IDc1JTtcXHJcXG4gIGxpbmUtaGVpZ2h0OiAwO1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xcclxcbn1cXHJcXG5cXHJcXG5zdXAge1xcclxcbiAgdG9wOiAtMC41ZW07XFxyXFxufVxcclxcblxcclxcbnN1YiB7XFxyXFxuICBib3R0b206IC0wLjI1ZW07XFxyXFxufVxcclxcblxcclxcbi8qIEVtYmVkZGVkIGNvbnRlbnRcXHJcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSBib3JkZXIgd2hlbiBpbnNpZGUgYGFgIGVsZW1lbnQgaW4gSUUgOC85LzEwLlxcclxcbiAqL1xcclxcblxcclxcbmltZyB7XFxyXFxuICBib3JkZXI6IDA7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIENvcnJlY3Qgb3ZlcmZsb3cgbm90IGhpZGRlbiBpbiBJRSA5LzEwLzExLlxcclxcbiAqL1xcclxcblxcclxcbnN2Zzpub3QoOnJvb3QpIHtcXHJcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxyXFxufVxcclxcblxcclxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXHJcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3MgbWFyZ2luIG5vdCBwcmVzZW50IGluIElFIDgvOSBhbmQgU2FmYXJpLlxcclxcbiAqL1xcclxcblxcclxcbmZpZ3VyZSB7XFxyXFxuICBtYXJnaW46IDFlbSA0MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIGRpZmZlcmVuY2VzIGJldHdlZW4gRmlyZWZveCBhbmQgb3RoZXIgYnJvd3NlcnMuXFxyXFxuICovXFxyXFxuXFxyXFxuaHIge1xcclxcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XFxyXFxuICBoZWlnaHQ6IDA7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIENvbnRhaW4gb3ZlcmZsb3cgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbnByZSB7XFxyXFxuICBvdmVyZmxvdzogYXV0bztcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBvZGQgYGVtYC11bml0IGZvbnQgc2l6ZSByZW5kZXJpbmcgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbmNvZGUsXFxyXFxua2JkLFxcclxcbnByZSxcXHJcXG5zYW1wIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTtcXHJcXG4gIGZvbnQtc2l6ZTogMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBGb3Jtc1xcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogS25vd24gbGltaXRhdGlvbjogYnkgZGVmYXVsdCwgQ2hyb21lIGFuZCBTYWZhcmkgb24gT1MgWCBhbGxvdyB2ZXJ5IGxpbWl0ZWRcXHJcXG4gKiBzdHlsaW5nIG9mIGBzZWxlY3RgLCB1bmxlc3MgYSBgYm9yZGVyYCBwcm9wZXJ0eSBpcyBzZXQuXFxyXFxuICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCBjb2xvciBub3QgYmVpbmcgaW5oZXJpdGVkLlxcclxcbiAqICAgIEtub3duIGlzc3VlOiBhZmZlY3RzIGNvbG9yIG9mIGRpc2FibGVkIGVsZW1lbnRzLlxcclxcbiAqIDIuIENvcnJlY3QgZm9udCBwcm9wZXJ0aWVzIG5vdCBiZWluZyBpbmhlcml0ZWQuXFxyXFxuICogMy4gQWRkcmVzcyBtYXJnaW5zIHNldCBkaWZmZXJlbnRseSBpbiBGaXJlZm94IDQrLCBTYWZhcmksIGFuZCBDaHJvbWUuXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uLFxcclxcbmlucHV0LFxcclxcbm9wdGdyb3VwLFxcclxcbnNlbGVjdCxcXHJcXG50ZXh0YXJlYSB7XFxyXFxuICBjb2xvcjogaW5oZXJpdDsgLyogMSAqL1xcclxcbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcclxcbiAgbWFyZ2luOiAwOyAvKiAzICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3MgYG92ZXJmbG93YCBzZXQgdG8gYGhpZGRlbmAgaW4gSUUgOC85LzEwLzExLlxcclxcbiAqL1xcclxcblxcclxcbmJ1dHRvbiB7XFxyXFxuICBvdmVyZmxvdzogdmlzaWJsZTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBpbmNvbnNpc3RlbnQgYHRleHQtdHJhbnNmb3JtYCBpbmhlcml0YW5jZSBmb3IgYGJ1dHRvbmAgYW5kIGBzZWxlY3RgLlxcclxcbiAqIEFsbCBvdGhlciBmb3JtIGNvbnRyb2wgZWxlbWVudHMgZG8gbm90IGluaGVyaXQgYHRleHQtdHJhbnNmb3JtYCB2YWx1ZXMuXFxyXFxuICogQ29ycmVjdCBgYnV0dG9uYCBzdHlsZSBpbmhlcml0YW5jZSBpbiBGaXJlZm94LCBJRSA4LzkvMTAvMTEsIGFuZCBPcGVyYS5cXHJcXG4gKiBDb3JyZWN0IGBzZWxlY3RgIHN0eWxlIGluaGVyaXRhbmNlIGluIEZpcmVmb3guXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uLFxcclxcbnNlbGVjdCB7XFxyXFxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQXZvaWQgdGhlIFdlYktpdCBidWcgaW4gQW5kcm9pZCA0LjAuKiB3aGVyZSAoMikgZGVzdHJveXMgbmF0aXZlIGBhdWRpb2BcXHJcXG4gKiAgICBhbmQgYHZpZGVvYCBjb250cm9scy5cXHJcXG4gKiAyLiBDb3JyZWN0IGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgYGlucHV0YCB0eXBlcyBpbiBpT1MuXFxyXFxuICogMy4gSW1wcm92ZSB1c2FiaWxpdHkgYW5kIGNvbnNpc3RlbmN5IG9mIGN1cnNvciBzdHlsZSBiZXR3ZWVuIGltYWdlLXR5cGVcXHJcXG4gKiAgICBgaW5wdXRgIGFuZCBvdGhlcnMuXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uLFxcclxcbmh0bWwgaW5wdXRbdHlwZT1cXFwiYnV0dG9uXFxcIl0sIC8qIDEgKi9cXHJcXG5pbnB1dFt0eXBlPVxcXCJyZXNldFxcXCJdLFxcclxcbmlucHV0W3R5cGU9XFxcInN1Ym1pdFxcXCJdIHtcXHJcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogYnV0dG9uOyAvKiAyICovXFxyXFxuICBjdXJzb3I6IHBvaW50ZXI7IC8qIDMgKi9cXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmUtc2V0IGRlZmF1bHQgY3Vyc29yIGZvciBkaXNhYmxlZCBlbGVtZW50cy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5idXR0b25bZGlzYWJsZWRdLFxcclxcbmh0bWwgaW5wdXRbZGlzYWJsZWRdIHtcXHJcXG4gIGN1cnNvcjogZGVmYXVsdDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmVtb3ZlIGlubmVyIHBhZGRpbmcgYW5kIGJvcmRlciBpbiBGaXJlZm94IDQrLlxcclxcbiAqL1xcclxcblxcclxcbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcXHJcXG5pbnB1dDo6LW1vei1mb2N1cy1pbm5lciB7XFxyXFxuICBib3JkZXI6IDA7XFxyXFxuICBwYWRkaW5nOiAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIEZpcmVmb3ggNCsgc2V0dGluZyBgbGluZS1oZWlnaHRgIG9uIGBpbnB1dGAgdXNpbmcgYCFpbXBvcnRhbnRgIGluXFxyXFxuICogdGhlIFVBIHN0eWxlc2hlZXQuXFxyXFxuICovXFxyXFxuXFxyXFxuaW5wdXQge1xcclxcbiAgbGluZS1oZWlnaHQ6IG5vcm1hbDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogSXQncyByZWNvbW1lbmRlZCB0aGF0IHlvdSBkb24ndCBhdHRlbXB0IHRvIHN0eWxlIHRoZXNlIGVsZW1lbnRzLlxcclxcbiAqIEZpcmVmb3gncyBpbXBsZW1lbnRhdGlvbiBkb2Vzbid0IHJlc3BlY3QgYm94LXNpemluZywgcGFkZGluZywgb3Igd2lkdGguXFxyXFxuICpcXHJcXG4gKiAxLiBBZGRyZXNzIGJveCBzaXppbmcgc2V0IHRvIGBjb250ZW50LWJveGAgaW4gSUUgOC85LzEwLlxcclxcbiAqIDIuIFJlbW92ZSBleGNlc3MgcGFkZGluZyBpbiBJRSA4LzkvMTAuXFxyXFxuICovXFxyXFxuXFxyXFxuaW5wdXRbdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXHJcXG5pbnB1dFt0eXBlPVxcXCJyYWRpb1xcXCJdIHtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IC8qIDEgKi9cXHJcXG4gIHBhZGRpbmc6IDA7IC8qIDIgKi9cXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogRml4IHRoZSBjdXJzb3Igc3R5bGUgZm9yIENocm9tZSdzIGluY3JlbWVudC9kZWNyZW1lbnQgYnV0dG9ucy4gRm9yIGNlcnRhaW5cXHJcXG4gKiBgZm9udC1zaXplYCB2YWx1ZXMgb2YgdGhlIGBpbnB1dGAsIGl0IGNhdXNlcyB0aGUgY3Vyc29yIHN0eWxlIG9mIHRoZVxcclxcbiAqIGRlY3JlbWVudCBidXR0b24gdG8gY2hhbmdlIGZyb20gYGRlZmF1bHRgIHRvIGB0ZXh0YC5cXHJcXG4gKi9cXHJcXG5cXHJcXG5pbnB1dFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcXHJcXG5pbnB1dFt0eXBlPVxcXCJudW1iZXJcXFwiXTo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XFxyXFxuICBoZWlnaHQ6IGF1dG87XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIDEuIEFkZHJlc3MgYGFwcGVhcmFuY2VgIHNldCB0byBgc2VhcmNoZmllbGRgIGluIFNhZmFyaSBhbmQgQ2hyb21lLlxcclxcbiAqIDIuIEFkZHJlc3MgYGJveC1zaXppbmdgIHNldCB0byBgYm9yZGVyLWJveGAgaW4gU2FmYXJpIGFuZCBDaHJvbWVcXHJcXG4gKiAgICAoaW5jbHVkZSBgLW1vemAgdG8gZnV0dXJlLXByb29mKS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5pbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXSB7XFxyXFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IHRleHRmaWVsZDsgLyogMSAqLyAvKiAyICovXFxyXFxuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmVtb3ZlIGlubmVyIHBhZGRpbmcgYW5kIHNlYXJjaCBjYW5jZWwgYnV0dG9uIGluIFNhZmFyaSBhbmQgQ2hyb21lIG9uIE9TIFguXFxyXFxuICogU2FmYXJpIChidXQgbm90IENocm9tZSkgY2xpcHMgdGhlIGNhbmNlbCBidXR0b24gd2hlbiB0aGUgc2VhcmNoIGlucHV0IGhhc1xcclxcbiAqIHBhZGRpbmcgKGFuZCBgdGV4dGZpZWxkYCBhcHBlYXJhbmNlKS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5pbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtY2FuY2VsLWJ1dHRvbixcXHJcXG5pbnB1dFt0eXBlPVxcXCJzZWFyY2hcXFwiXTo6LXdlYmtpdC1zZWFyY2gtZGVjb3JhdGlvbiB7XFxyXFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIERlZmluZSBjb25zaXN0ZW50IGJvcmRlciwgbWFyZ2luLCBhbmQgcGFkZGluZy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5maWVsZHNldCB7XFxyXFxuICBib3JkZXI6IDFweCBzb2xpZCAjYzBjMGMwO1xcclxcbiAgbWFyZ2luOiAwIDJweDtcXHJcXG4gIHBhZGRpbmc6IDAuMzVlbSAwLjYyNWVtIDAuNzVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCBgY29sb3JgIG5vdCBiZWluZyBpbmhlcml0ZWQgaW4gSUUgOC85LzEwLzExLlxcclxcbiAqIDIuIFJlbW92ZSBwYWRkaW5nIHNvIHBlb3BsZSBhcmVuJ3QgY2F1Z2h0IG91dCBpZiB0aGV5IHplcm8gb3V0IGZpZWxkc2V0cy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5sZWdlbmQge1xcclxcbiAgYm9yZGVyOiAwOyAvKiAxICovXFxyXFxuICBwYWRkaW5nOiAwOyAvKiAyICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSA4LzkvMTAvMTEuXFxyXFxuICovXFxyXFxuXFxyXFxudGV4dGFyZWEge1xcclxcbiAgb3ZlcmZsb3c6IGF1dG87XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIERvbid0IGluaGVyaXQgdGhlIGBmb250LXdlaWdodGAgKGFwcGxpZWQgYnkgYSBydWxlIGFib3ZlKS5cXHJcXG4gKiBOT1RFOiB0aGUgZGVmYXVsdCBjYW5ub3Qgc2FmZWx5IGJlIGNoYW5nZWQgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gT1MgWC5cXHJcXG4gKi9cXHJcXG5cXHJcXG5vcHRncm91cCB7XFxyXFxuICBmb250LXdlaWdodDogYm9sZDtcXHJcXG59XFxyXFxuXFxyXFxuLyogVGFibGVzXFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW1vdmUgbW9zdCBzcGFjaW5nIGJldHdlZW4gdGFibGUgY2VsbHMuXFxyXFxuICovXFxyXFxuXFxyXFxudGFibGUge1xcclxcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXHJcXG4gIGJvcmRlci1zcGFjaW5nOiAwO1xcclxcbn1cXHJcXG5cXHJcXG50ZCxcXHJcXG50aCB7XFxyXFxuICBwYWRkaW5nOiAwO1xcclxcbn1cXHJcXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL34vcG9zdGNzcy1sb2FkZXIhLi9zcmMvc3R5bGUvbm9ybWFsaXplLmNzc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIvKlxcclxcbiogQEF1dGhvcjogbGl1amlhanVuXFxyXFxuKiBARGF0ZTogICAyMDE3LTAyLTIxIDIxOjU5OjQ3XFxyXFxuKiBATGFzdCBNb2RpZmllZCBieTogICBsaXVqaWFqdW5cXHJcXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjYgMTc6MzE6MDZcXHJcXG4qL1xcclxcbiN3cmFwcGVye1xcclxcblxcdHdpZHRoOiAzMDBweDtcXHJcXG5cXHRoZWlnaHQ6IDYwMHB4O1xcclxcblxcdG1hcmdpbjogMTBweCBhdXRvO1xcclxcblxcdGJvcmRlcjogMXB4IHNvbGlkICMzMzM7XFxyXFxuXFx0cG9zaXRpb246IHJlbGF0aXZlO1xcclxcbn1cXHJcXG4uYmxvY2t7XFxyXFxuXFx0Ym94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG5cXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuXFx0d2lkdGg6IDMwcHg7XFxyXFxuXFx0aGVpZ2h0OiAzMHB4O1xcclxcbn1cXHJcXG4uYmxvY2stYWN0aXZlLTB7XFxyXFxuXFx0YmFja2dyb3VuZDogIzlmNWY5ZjtcXHJcXG59XFxyXFxuLmJsb2NrLWFjdGl2ZS0ye1xcclxcblxcdGJhY2tncm91bmQ6ICM5M2RiNzA7XFxyXFxufVxcclxcbi5ibG9jay1hY3RpdmUtM3tcXHJcXG5cXHRiYWNrZ3JvdW5kOiAjN2YwMGZmO1xcclxcbn1cXHJcXG4uYmxvY2stYWN0aXZlLTR7XFxyXFxuXFx0YmFja2dyb3VuZDogIzhlNmIyMztcXHJcXG59XFxyXFxuLmJsb2NrLWFjdGl2ZS0xe1xcclxcblxcdGJhY2tncm91bmQ6ICMyMzZiOGU7XFxyXFxufVxcclxcbi5ibG9jay1pbmFjdGl2ZXtcXHJcXG5cXHRiYWNrZ3JvdW5kOiAjNzA5M2RiO1xcclxcbn1cXHJcXG4uYmxvY2stZWxpbWluYXRle1xcclxcblxcdGJhY2tncm91bmQ6ICNmMDA7XFxyXFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vfi9wb3N0Y3NzLWxvYWRlciEuL3NyYy9zdHlsZS90ZXRyaXMuY3NzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yNyAwOTo0OTozN1xyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTA6MTE6NTlcclxuKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuY29uc3QgQkxPQ0tTSVpFICA9IDMwO1x0Ly8g5pa55Z2X5aSn5bCPXHJcbmNvbnN0IFNURVBMRU5HVEggPSAzMDtcclxuXHJcbi8qXHJcbiAqIOaemuS4vuaJgOacieeahOWIneWni+W9oueKtlxyXG4gKi9cclxuY29uc3QgQkxPQ0tUWVBFID0gW1xyXG5cdFtbMSwxLDFdLFsxLDAsMF1dLFxyXG5cdFtbMSwxXSxbMCwxXSxbMCwxXV0sXHJcblx0W1swLDAsMV0sWzEsMSwxXV0sXHJcblx0W1sxLDBdLFsxLDBdLFsxLDFdXSxcclxuXHRbWzEsMSwwXSwgWzAsMSwxXV0sXHJcblx0W1swLDFdLFsxLDFdLFsxLDBdXSxcclxuXHRbWzEsMSwxXSwgWzAsMCwxXV0sXHJcblx0W1swLDFdLFswLDFdLFsxLDFdXSxcclxuXHRbWzEsMCwwXSxbMSwxLDFdXSxcclxuXHRbWzEsMV0sWzEsMF0sWzEsMF1dLFxyXG5cdFtbMSwxLDEsMV1dLFxyXG5cdFtbMV0sWzFdLFsxXSxbMV1dLFxyXG5cdFtbMSwxXSxbMSwxXV0sXHJcblx0W1swLDEsMF0sWzEsMSwxXV0sXHJcblx0W1sxLDBdLFsxLDFdLFsxLDBdXSxcclxuXHRbWzEsMSwxXSxbMCwxLDBdXSxcclxuXHRbWzAsMV0sWzEsMV0sIFswLDFdXSxcclxuXHRbWzAsMSwxXSwgWzEsMSwwXV0sXHJcblx0W1sxLDBdLFsxLDFdLFswLDFdXVxyXG5dO1xyXG5cclxuZXhwb3J0IHtcclxuXHRCTE9DS1RZUEUsXHJcblx0QkxPQ0tTSVpFLFxyXG5cdFNURVBMRU5HVEhcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9jb25maWcuanMiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgaXRlbVsxXSArIFwifVwiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKGl0ZW1bMV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0LmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgbWVtbztcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH07XG5cdH0sXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAvbXNpZSBbNi05XVxcYi8udGVzdChzZWxmLm5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG5cdH0pLFxuXHRnZXRIZWFkRWxlbWVudCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcblx0fSksXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiA8aGVhZD4uXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0KTtcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0KTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCkge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZVxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcblx0dmFyIGhlYWQgPSBnZXRIZWFkRWxlbWVudCgpO1xuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgaGVhZC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXHRsaW5rRWxlbWVudC5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmU7XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcblx0XHRpZihuZXdPYmopIHtcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0aWYoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcblxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuKiBAQXV0aG9yOiBsaXVqaWFqdW5cclxuKiBARGF0ZTogICAyMDE3LTAyLTI3IDA5OjUxOjI1XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAgbGl1amlhanVuXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wMi0yNyAxMToyMzoyOVxyXG4qL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IEJsb2NrIGZyb20gJy4vYmxvY2suanMnO1xyXG5pbXBvcnQge0JMT0NLU0laRSwgQkxPQ0tUWVBFfSBmcm9tICcuL2NvbmZpZyc7XHJcblxyXG4vKipcclxuICog5L+E572X5pav5pa55Z2X55S75p2/XHJcbiAqL1xyXG5jbGFzcyBUZXRyaXNBcmVhe1xyXG5cdGNvbnN0cnVjdG9yKCl7XHJcblx0XHR0aGlzLmFjdGl2ZUJsb2NrID0gbnVsbDtcdC8vY3VycmVudCBkcm9wcGluZy1kb3duIGJsb2NrXHJcblx0XHR0aGlzLm5vS2V5UHJlc3MgPSBmYWxzZTtcclxuXHJcblx0XHR0aGlzLmRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0dGhpcy5kaXYuaWQgPSAnd3JhcHBlcic7XHJcblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZCh0aGlzLmRpdik7XHJcblxyXG5cdFx0d2luZG93Lm9ua2V5ZG93biA9IHRoaXMub25rZXlkb3duLmJpbmQodGhpcyk7XHJcblxyXG5cdFx0bGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5kaXYpO1xyXG5cdFx0dGhpcy53aWR0aCA9IHBhcnNlSW50KHN0eWxlLndpZHRoKTtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gcGFyc2VJbnQoc3R5bGUuaGVpZ2h0KTtcclxuXHRcdHRoaXMuYmxvY2tXaWR0aCA9IHRoaXMud2lkdGggLyBCTE9DS1NJWkU7XHQvL+S7peaWueagvOWdl+aVsOaJgOiuoeeahOWuveW6plxyXG5cdFx0dGhpcy5ibG9ja0hlaWdodCA9IHRoaXMuaGVpZ2h0IC8gQkxPQ0tTSVpFO1xyXG5cclxuXHRcdC8vIHRoaXMuYm9yZGVy6KGo56S65q+P5LiA5YiX55qE5pyA5aSn5Y+v55So6auY5bqm77yM5pa55Z2X6Kem5Yiw5LmL5ZCO5bCx6KGo56S65bey57uP6Kem5bqVXHJcblx0XHQvLyDmr4/mrKHmlrnlnZfop6blupXvvIzor6XlsZ7mgKfpg73pnIDopoHpgJrov4d0aGlzLmdldEJvcmRlcuabtOaWsFxyXG5cdFx0dGhpcy5ib3JkZXIgPSBbXTtcclxuXHRcdHRoaXMuYm9yZGVyLmxlbmd0aCA9IHRoaXMuYmxvY2tXaWR0aDtcclxuXHRcdHRoaXMuYm9yZGVyLmZpbGwodGhpcy5oZWlnaHQpO1xyXG5cclxuXHRcdC8vIHRoaXMuaW5hY3RpdmVCbG9ja3PorrDlvZXmjonliLDlupXpg6jnmoTmlrnlnZdcclxuXHRcdC8vIOWFseWMheWQq3RoaXMuYmxvY2tIZWlnaHTkuKrmlbDnu4TvvIzmr4/kuKrmlbDnu4TooajnpLror6XooYznmoTmiYDmnInlsI/mlrnlnZdcclxuXHRcdC8vIOW9k+afkOihjOaJgOaLpeacieeahOWwj+aWueWdl+S4quaVsOetieS6jnRoaXMuYmxvY2tXaWR0aOaXtu+8jOa2iOmZpOivpeihjFxyXG5cdFx0dGhpcy5pbmFjdGl2ZUJsb2NrcyA9IFtdO1xyXG5cdFx0Ly8gdGhpcy5pbmFjdGl2ZUJsb2Nrcy5maWxsKFtdKTtcdC8vIOivpeaWueazlemUmeivr++8jOWboOS4uuaYr+eUqOWQjOS4gOS4qltd5aGr5YWF77yM5Lmf5bCx5piv6K+05omA5pyJ55qE5a2QaXRlbemDveaYr+aMh+WQkeWQjOS4gOS4quepuuaVsOe7hFxyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMuYmxvY2tIZWlnaHQ7IGkrKyl7XHJcblx0XHRcdHRoaXMuaW5hY3RpdmVCbG9ja3NbaV0gPSBbXTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnN0YXJ0R2FtZSgpO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiDkuqfnlJ/kuIvkuIDkuKrmlrnmoLxcclxuXHQgKi9cclxuXHRuZXdBY3RpdmVCbG9jaygpe1xyXG5cdFx0bGV0IHR5cGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBCTE9DS1RZUEUubGVuZ3RoKTtcclxuXHRcdHRoaXMuYWN0aXZlQmxvY2sgPSBuZXcgQmxvY2soe1xyXG5cdFx0XHRhcnI6IEJMT0NLVFlQRVt0eXBlXSxcclxuXHRcdFx0cGFyZW50OiB0aGlzXHJcblx0XHR9KTtcclxuXHRcdGlmKCF0aGlzLmFjdGl2ZUJsb2NrLmNhbm1vdmUoJ2Rvd24nKSl7XHJcblx0XHRcdGFsZXJ0KCdHYW1lIE92ZXInKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5ibG9ja0Ryb3AoKTtcdC8vIOaWsOW7uua0u+WKqOaWueWdl+S5i+WQju+8jOa0u+WKqOaWueWdl+W8gOWni+S4i+WdoFxyXG5cdFx0dGhpcy5ub0tleVByZXNzID0gZmFsc2U7XHJcblx0fVxyXG5cdGRlbGV0ZUFjdGl2ZUJsb2NrKCl7XHJcblx0XHR0aGlzLmFjdGl2ZUJsb2NrID0gbnVsbDtcclxuXHR9XHJcblx0b25rZXlkb3duKGUpe1xyXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGlmKHRoaXMubm9LZXlQcmVzcyl7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGxldCBrZXkgPSBlLmtleUNvZGU7XHJcblx0XHRsZXQgZGlyZWN0aW9uO1xyXG5cdFx0c3dpdGNoKGtleSl7XHJcblx0XHRcdGNhc2UgMzc6XHJcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM4OiAvLyB1cCBrZXlcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAncm90YXRlJztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAzOTpcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDQwOlxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHR0aGlzLmFjdGl2ZUJsb2NrICYmIHRoaXMuYWN0aXZlQmxvY2suY2FubW92ZShkaXJlY3Rpb24pICYmIHRoaXMuYWN0aXZlQmxvY2subW92ZShkaXJlY3Rpb24pO1xyXG5cdH1cclxuXHRzdGFydEdhbWUoKXtcclxuXHRcdHRoaXMubmV3QWN0aXZlQmxvY2soKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICog6L+U5Zue5bey57uP6KKr5Y2g6aKG55qE5L2N572uXHJcblx0ICog6K+l6L+U5Zue57uT5p6c5Li65LiA5Liq5pWw57uE77yM6ZW/5bqm5Li6dGhpcy5ibG9ja1dpZHRoLCDmr4/kuKppdGVt6KGo56S65YW25a+55bqU55qE5YiX5Y+v55So55qE5pyA5aSn6auY5bqmXHJcblx0ICogQHJldHVybiB7QXJyYXl9XHJcblx0ICovXHJcblx0Z2V0Qm9yZGVyKCl7XHJcblx0XHR0aGlzLmJvcmRlci5maWxsKHRoaXMuaGVpZ2h0KTtcclxuXHRcdGxldCBpbmFjdGl2ZUJsb2Nrc1NpbSA9IFtdO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaTwgdGhpcy5ibG9ja0hlaWdodDsgaSsrKXtcclxuXHRcdFx0bGV0IGN1cnJlbnRSb3cgPSB0aGlzLmluYWN0aXZlQmxvY2tzW2ldO1xyXG5cdFx0XHRmb3IobGV0IGogPSAwOyBqIDwgY3VycmVudFJvdy5sZW5ndGg7IGorKyl7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRCbG9jayA9IGN1cnJlbnRSb3dbal07XHJcblx0XHRcdFx0aW5hY3RpdmVCbG9ja3NTaW0ucHVzaCh7XHQvLyDpgY3ljoblubbmoLzlvI/ljJblkI7liqDlhaVpbmFjdGl2ZUJsb2Nrc1NpbeaVsOe7hFxyXG5cdFx0XHRcdFx0bGVmdDogcGFyc2VJbnQoY3VycmVudEJsb2NrLnN0eWxlLmxlZnQpLFxyXG5cdFx0XHRcdFx0dG9wOiBwYXJzZUludChjdXJyZW50QmxvY2suc3R5bGUudG9wKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMuYmxvY2tXaWR0aDsgaSsrKXtcdFx0XHRcclxuXHRcdFx0bGV0IGNvbHVtbkFyciA9IGluYWN0aXZlQmxvY2tzU2ltLmZpbHRlcigoaXRlbSkgPT4ge1x0Ly8g5om+5Ye656ysaeWIl+eahOaJgOacieWFg+e0oFxyXG5cdFx0XHRcdHJldHVybiBpdGVtLmxlZnQgLyBCTE9DS1NJWkUgPT09IGk7XHJcblx0XHRcdH0pXHJcblx0XHRcdGlmKGNvbHVtbkFyci5sZW5ndGggPD0gMCl7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29sdW1uQXJyLnNvcnQoKGEsYikgPT4ge1x0Ly8g5oyJdG9w5LuO5bCP5Yiw5aSn5o6S5bqPXHJcblx0XHRcdFx0cmV0dXJuIGEudG9wIC0gYi50b3A7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjb2x1bW5BcnJbMF0gJiYgKHRoaXMuYm9yZGVyW2ldID0gY29sdW1uQXJyWzBdLnRvcCk7XHQvLyDlpoLmnpzor6XliJfmnInlhYPntKDvvIzmm7TmlrDlj6/nlKjpq5jluqZcclxuXHRcdH1cclxuXHR9XHJcblx0LyoqXHJcblx0ICog5pa55Z2X5LiL5Z2gXHJcblx0ICovXHJcblx0YmxvY2tEcm9wKCl7XHJcblx0XHRsZXQgdGltZW91dDtcclxuXHRcdGxldCB0bUZ1bmN0aW9uID0gKCkgPT4ge1xyXG5cdFx0XHRpZih0aGlzLmFjdGl2ZUJsb2NrICYmIHRoaXMuYWN0aXZlQmxvY2suY2FubW92ZSgnZG93bicpKXtcclxuXHRcdFx0XHR0aGlzLmFjdGl2ZUJsb2NrLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCh0bUZ1bmN0aW9uLCA1MDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2V7XHJcblx0XHRcdFx0dGhpcy5ibG9ja0F0Qm90dG9tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KHRtRnVuY3Rpb24sIDUwMCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOaWueWdl+WIsOi+vuW6lemDqOeahOWkhOeQhuWHveaVsFxyXG5cdCAqL1xyXG5cdGJsb2NrQXRCb3R0b20oKXtcclxuXHRcdHRoaXMubm9LZXlQcmVzcyA9IHRydWU7XHJcblxyXG5cdFx0bGV0IGN1cnJlbnRCbG9ja3MgPSB0aGlzLmFjdGl2ZUJsb2NrLmJsb2NrQXJyO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaTwgY3VycmVudEJsb2Nrcy5sZW5ndGg7IGkrKyl7XHQvLyDliLDovr7lupXpg6jlkI7vvIzlsIblvZPliY3mtLvliqjmlrnlnZflhajpg6jliqDlhaVpbmFjdGl2ZUJsb2Nrc1xyXG5cdFx0XHRsZXQgaXRlbSA9IGN1cnJlbnRCbG9ja3NbaV07XHJcblx0XHRcdGl0ZW0uY2xhc3NOYW1lID0gJ2Jsb2NrIGJsb2NrLWluYWN0aXZlJztcclxuXHRcdFx0bGV0IHRvcEJsb2NrID0gcGFyc2VJbnQoaXRlbS5zdHlsZS50b3ApIC8gQkxPQ0tTSVpFO1xyXG5cdFx0XHR0aGlzLmluYWN0aXZlQmxvY2tzW3RvcEJsb2NrXS5wdXNoKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0aWYodGhpcy5jYWxFbGluaW1hdGUoKSl7XHQvLyDlpoLmnpzmnInopoHmtojpmaTnmoTooYzvvIznrYnlvoUzMDBtc+WQjuaJp+ihjO+8jOeVmeWHujMwMG1z5o+Q56S655So5oi35pyJ6KGM5q2j5Zyo5raI6ZmkXHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHRoaXMuZ2V0Qm9yZGVyKCk7XHJcblx0XHRcdFx0dGhpcy5uZXdBY3RpdmVCbG9jaygpO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH1cclxuXHRcdGVsc2V7XHJcblx0XHRcdHRoaXMuZ2V0Qm9yZGVyKCk7XHJcblx0XHRcdHRoaXMubmV3QWN0aXZlQmxvY2soKTtcclxuXHRcdH1cclxuXHR9XHJcblx0LyoqXHJcblx0ICog6K6h566X5piv5ZCm5pyJ5pW06KGM6ZyA6KaB5raI6ZmkXHJcblx0ICog5b2T5rS75Yqo5pa55Z2X5Yiw6L6+5bqV6YOo5pe26L+Q6KGMXHJcblx0ICogQHJldHVybiB7Ym9vbGVhbn0g5piv5ZCm5pyJ6KGM6ZyA6KaB5raI6ZmkXHJcblx0ICovXHJcblx0Y2FsRWxpbmltYXRlKCl7XHJcblx0XHRsZXQgZnVsbFdpZHRoID0gdGhpcy5ibG9ja1dpZHRoLFxyXG5cdFx0XHRlbGltaW5hdGVDb3VudCA9IDA7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja0hlaWdodDsgaSsrKXtcclxuXHRcdFx0bGV0IGN1cnJlbnRSb3cgPSB0aGlzLmluYWN0aXZlQmxvY2tzW2ldO1xyXG5cdFx0XHRpZihjdXJyZW50Um93Lmxlbmd0aCA9PT0gZnVsbFdpZHRoKXtcdC8vIOivpeihjOW3sua7oemcgOimgea2iOmZpFxyXG5cdFx0XHRcdHRoaXMuYmVmb3JlRWxpbmltYXRlUm93KGkpO1x0Ly8g5o+Q56S655So5oi36K+l6KGM5Y2z5bCG5raI6ZmkXHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHR0aGlzLmVsaW5pbWF0ZVJvdyhpKTtcclxuXHRcdFx0XHR9LDEwMCk7XHJcblx0XHRcdFx0ZWxpbWluYXRlQ291bnQrKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVsaW1pbmF0ZUNvdW50ID4gMDtcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5raI6Zmk6KGM5LmL5YmN6Zeq54OBXHJcblx0ICogQHBhcmFtICB7bnVtYmVyfSByb3dOdW0g5a+55bqU55qE6KGM77yM5LuO5LiK5b6A5LiL5LuOMOihjOW8gOWni1xyXG5cdCAqL1xyXG5cdGJlZm9yZUVsaW5pbWF0ZVJvdyhyb3dOdW0pe1xyXG5cdFx0bGV0IGZ1bGxXaWR0aCA9IHRoaXMuYmxvY2tXaWR0aDtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmdWxsV2lkdGg7IGkrKyl7XHJcblx0XHRcdHRoaXMuaW5hY3RpdmVCbG9ja3Nbcm93TnVtXVtpXS5jbGFzc05hbWUgPSAnYmxvY2sgYmxvY2stZWxpbWluYXRlJztcclxuXHRcdH1cclxuXHR9XHJcblx0LyoqXHJcblx0ICog5raI6Zmk6KGMXHJcblx0ICogQHBhcmFtICB7bnVtYmVyfSByb3dOdW0g5a+55bqU55qE6KGM77yM5LuO5LiK5b6A5LiL5LuOMOihjOW8gOWni1xyXG5cdCAqL1xyXG5cdGVsaW5pbWF0ZVJvdyhyb3dOdW0pe1xyXG5cdFx0bGV0IGZ1bGxXaWR0aCA9IHRoaXMuYmxvY2tXaWR0aDtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmdWxsV2lkdGg7IGkrKyl7XHJcblx0XHRcdHRoaXMuZGl2LnJlbW92ZUNoaWxkKHRoaXMuaW5hY3RpdmVCbG9ja3Nbcm93TnVtXVtpXSk7XHQvL+enu+mZpOaJgOacieWFg+e0oFxyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpID0gcm93TnVtIC0gMTsgaSA+IDA7IGktLSl7XHQvLyDkuIrmlrnmiYDmnInooYzkuIvnp7vvvIzlubbmm7TmlrB0aGlzLmluYWN0aXZlQmxvY2tzXHJcblx0XHRcdGxldCBjdXJyZW50Um93ID0gdGhpcy5pbmFjdGl2ZUJsb2Nrc1tpXTtcclxuXHRcdFx0Zm9yKGxldCBqID0gMDsgaiA8IGN1cnJlbnRSb3cubGVuZ3RoOyBqKyspe1xyXG5cdFx0XHRcdGN1cnJlbnRSb3dbal0uc3R5bGUudG9wID0gKHBhcnNlSW50KGN1cnJlbnRSb3dbal0uc3R5bGUudG9wKSArIEJMT0NLU0laRSApKyAncHgnO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuaW5hY3RpdmVCbG9ja3NbaSArIDFdID0gY3VycmVudFJvdztcclxuXHRcdH1cclxuXHRcdHRoaXMuaW5hY3RpdmVCbG9ja3NbMF0gPSBbXTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRldHJpc0FyZWE7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL3RldHJpc0FyZWEuanMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vbm9ybWFsaXplLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi9ub3JtYWxpemUuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi9ub3JtYWxpemUuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZS9ub3JtYWxpemUuY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi90ZXRyaXMuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuL3RldHJpcy5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuL3RldHJpcy5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlL3RldHJpcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuKiBAQXV0aG9yOiBsaXVqaWFqdW5cclxuKiBARGF0ZTogICAyMDE3LTAyLTI3IDA5OjUwOjM2XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAgbGl1amlhanVuXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wMi0yNyAxMDowNDoxMVxyXG4qL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5pbXBvcnQge0JMT0NLU0laRSwgU1RFUExFTkdUSH0gZnJvbSAnLi9jb25maWcuanMnO1xyXG4vKipcclxuICogQkxPQ0vnsbvvvIzmr4/kuKpCTE9DS+S4reWMheWQq+WkmuS4quWwj+aWueWdl1xyXG4gKi9cclxuY2xhc3MgQmxvY2t7XHJcblx0Y29uc3RydWN0b3IocGFyYW1zKXtcclxuXHRcdHRoaXMuYXJyID0gcGFyYW1zLmFycjtcdC8vIEJsb2Nr5pWw57uE77yM6KGo56S66K+l5pa55Z2X55qE5b2i54q2XHJcblx0XHR0aGlzLnBhcmVudCA9IHBhcmFtcy5wYXJlbnQ7XHQvLyDniLblr7nosaFcclxuXHRcdHRoaXMuaGVpZ2h0ID0gdGhpcy5hcnIubGVuZ3RoICogQkxPQ0tTSVpFO1xyXG5cdFx0dGhpcy53aWR0aCA9IHRoaXMuYXJyWzBdLmxlbmd0aCAqIEJMT0NLU0laRTtcclxuXHRcdHRoaXMuYmxvY2tBcnIgPSBbXTtcclxuXHRcdC8vIOa2guaWueWdl1xyXG5cdFx0dGhpcy5fZHJhdygwLCAwKTtcdFxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmoLnmja5hcnLnlLvlh7ror6XmlrnlnZfvvIxbWzEsMF0sWzEsMV3ooajnpLrkuIDkuKoyKjLmlrnlnZfvvIzkvYbmmK/nrKzkuIDooYznrKzkuozkuKrkuLrnqbpcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gb3JpZ2luVG9wIOaWueWdl+eahOi1t+Wni+eCuVxyXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBvcmlnaW5MZWZ0IOaWueWdl+eahOi1t+Wni+eCuVxyXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBvcmlnaW5DbGFzcyDmmK/lkKbmmK/ph43nu5jml4vovazmlrnlnZfvvIzlpoLmnpzmmK/vvIzkv53mjIFjbGFzc05hbWXkuI3lj5hcclxuXHQgKi9cclxuXHRfZHJhdyhvcmlnaW5Ub3AsIG9yaWdpbkxlZnQsIG9yaWdpbkNsYXNzKXtcclxuXHRcdGxldCBoZWlnaHQgPSB0aGlzLmFyci5sZW5ndGgsXHJcblx0XHQgICAgd2lkdGggPSB0aGlzLmFyclswXS5sZW5ndGgsXHJcblx0XHQgICAgdG1wQ2xhc3NOYW1lID0gb3JpZ2luQ2xhc3MgPyBvcmlnaW5DbGFzcyA6ICdibG9jayBibG9jay1hY3RpdmUtJyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo1KTtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKylcclxuXHRcdFx0Zm9yKGxldCBqID0gMDsgaiA8IHdpZHRoOyBqKyspe1xyXG5cdFx0XHRcdGlmKHRoaXMuYXJyW2ldW2pdID09IDEpe1xyXG5cdFx0XHRcdFx0bGV0IHN1YkJsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHRcdFx0XHRzdWJCbG9jay5jbGFzc05hbWUgPSB0bXBDbGFzc05hbWU7XHJcblx0XHRcdFx0XHRzdWJCbG9jay5zdHlsZS5sZWZ0ID0gKGogKiBCTE9DS1NJWkUgKyBvcmlnaW5MZWZ0KSArICdweCc7XHJcblx0XHRcdFx0XHRzdWJCbG9jay5zdHlsZS50b3AgPSAoaSAqIEJMT0NLU0laRSArIG9yaWdpblRvcCkgKyAncHgnO1xyXG5cdFx0XHRcdFx0dGhpcy5ibG9ja0Fyci5wdXNoKHN1YkJsb2NrKTtcclxuXHRcdFx0XHRcdHRoaXMucGFyZW50LmRpdi5hcHBlbmRDaGlsZChzdWJCbG9jayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOaWueWdl+i/m+ihjOaXi+i9rFxyXG5cdCAqIOS/neaMgeaVtOS9k+W3puS4iuinkuS4jeWPmFxyXG5cdCAqL1xyXG5cdF9yb3RhdGUoKXtcclxuXHRcdGlmKHRoaXMuYmxvY2tBcnIubGVuZ3RoIDw9IDApe1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvLyDml4vovazml7blt6bkuIrop5LnmoTkvY3nva5cclxuXHRcdGxldCBsZWZ0ID0gcGFyc2VJbnQodGhpcy5ibG9ja0FyclswXS5zdHlsZS5sZWZ0KTtcclxuXHRcdGxldCB0b3AgPSBwYXJzZUludCh0aGlzLmJsb2NrQXJyWzBdLnN0eWxlLnRvcCk7XHJcblx0XHRsZXQgb3JpZ2luQ2xhc3MgPSB0aGlzLmJsb2NrQXJyWzBdLmNsYXNzTmFtZTtcclxuXHRcdC8vIOenu+mZpOWOn+adpeeahOaJgOacieWwj+aWueagvFxyXG5cdFx0Zm9yKGxldCBpID0gMCwgbGVuID0gdGhpcy5ibG9ja0Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcblx0XHRcdHRoaXMucGFyZW50LmRpdi5yZW1vdmVDaGlsZCh0aGlzLmJsb2NrQXJyW2ldKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuYmxvY2tBcnIubGVuZ3RoID0gMDtcclxuXHJcblx0XHR0aGlzLmFyciA9IHRoaXMuX3JvdGF0ZUFycih0aGlzLmFycik7Ly8g5peL6L2sXHJcblx0XHR0aGlzLl9kcmF3KHRvcCwgbGVmdCwgb3JpZ2luQ2xhc3MpOy8vIOmHjeaWsOe7mOWItlxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmlbDnu4Tov5vooYzpobrml7bpkojml4vovaxcclxuXHQgKi9cclxuXHRfcm90YXRlQXJyKCl7XHJcblx0XHRsZXQgYXJyID0gW107XHJcblx0XHRsZXQgaGVpZ2h0ID0gdGhpcy5hcnIubGVuZ3RoLFxyXG5cdFx0ICAgIHdpZHRoID0gdGhpcy5hcnJbMF0ubGVuZ3RoO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHdpZHRoOyBpKyspe1xyXG5cdFx0XHRsZXQgdGVtcEFyciA9IFtdO1xyXG5cdFx0XHRmb3IobGV0IGogPSBoZWlnaHQgLSAxOyBqID49IDA7IGotLSl7XHJcblx0XHRcdFx0dGVtcEFyci5wdXNoKHRoaXMuYXJyW2pdW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhcnIucHVzaCh0ZW1wQXJyKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhcnI7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOWIpOaWreWNleS4quWwj+aWueWdl+aYr+WQpuWPr+S7peWQkeafkOaWueWQkeenu+WKqFxyXG5cdCAqIEBwYXJhbSB7RE9NRWxlbWVudH0gaXRlbSDor6XlsI/mlrnlnZfnmoTlvJXnlKhcclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGRpcmVjdGlvbiDnp7vliqjmlrnlkJFcclxuXHQgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAg5piv5ZCm5Y+v5Lul56e75YqoXHJcblx0ICovXHJcblx0X2NhblNpbmdsZU1vdmUoaXRlbSwgZGlyZWN0aW9uKXtcclxuXHRcdGxldCBsZWZ0QmxvY2sgPSBwYXJzZUludChpdGVtLnN0eWxlLmxlZnQpIC8gQkxPQ0tTSVpFO1x0Ly/or6XlsI/mlrnlnZflr7nlupTnmoTliJfmlbBcclxuXHRcdGxldCBib3R0b20gPSBwYXJzZUludChpdGVtLnN0eWxlLnRvcCkgKyBCTE9DS1NJWkU7XHQvLyDor6XlsI/mlrnlnZfnmoTlupXpg6jkvY3nva5cclxuXHRcdHN3aXRjaChkaXJlY3Rpb24pe1xyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayAtIDFdICYmIChib3R0b20gPD0gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayAtIDFdKTtcclxuXHRcdFx0Y2FzZSAncmlnaHQnOlxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnBhcmVudC5ib3JkZXJbbGVmdEJsb2NrICsgMV0gJiYgKGJvdHRvbSA8PSB0aGlzLnBhcmVudC5ib3JkZXJbbGVmdEJsb2NrICsgMV0pO1xyXG5cdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9ja10gJiYgKChib3R0b20gKyBCTE9DS1NJWkUpIDw9IHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2tdKTtcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOWIpOaWreaYr+WQpuWPr+S7peaXi+i9rFxyXG5cdCAqL1xyXG5cdF9jYW5Sb3RhdGUoKXtcclxuXHRcdGxldCBhZnRlckFyciA9IHRoaXMuX3JvdGF0ZUFycih0aGlzLmFycik7XHJcblx0XHRsZXQgbGVmdEJsb2NrID0gcGFyc2VJbnQodGhpcy5ibG9ja0FyclswXS5zdHlsZS5sZWZ0KSAvIEJMT0NLU0laRTtcclxuXHRcdGxldCB0b3BCbG9jayA9IHBhcnNlSW50KHRoaXMuYmxvY2tBcnJbMF0uc3R5bGUudG9wKSAvIEJMT0NLU0laRTtcclxuXHRcdGZvcihsZXQgaSA9IDAsIGxlbjEgPSBhZnRlckFyci5sZW5ndGg7IGkgPCBsZW4xOyBpKyspe1x0Ly8g6YCQ5Liq5Yik5pat5peL6L2s5LmL5ZCO55qE5L2N572u5piv5ZCm6LaF6L+H6L6555WMXHJcblx0XHRcdGxldCBjdXJyZW50Um93ID0gYWZ0ZXJBcnJbaV07XHJcblx0XHRcdGZvcihsZXQgaiA9IDAsIGxlbjIgPSBjdXJyZW50Um93Lmxlbmd0aDsgaiA8IGxlbjI7IGorKyl7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRMZWZ0ID0gbGVmdEJsb2NrICsgaixcclxuXHRcdFx0XHQgICAgY3VycmVudEJvdHRvbSA9IHRvcEJsb2NrICsgaSArIDE7XHJcblx0XHRcdFx0aWYoY3VycmVudExlZnQgPCAwIHx8IGN1cnJlbnRMZWZ0ID49IHRoaXMucGFyZW50LmJsb2NrV2lkdGgpe1x0Ly8g6LaF5Ye65a695bqmXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGN1cnJlbnRCb3R0b20gPCAxIHx8IGN1cnJlbnRCb3R0b20gPj0gdGhpcy5wYXJlbnQuYmxvY2tIZWlnaHQpeyAvLyDotoXlh7rpq5jluqZcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoY3VycmVudEJvdHRvbSA+ICh0aGlzLnBhcmVudC5ib3JkZXJbY3VycmVudExlZnRdIC8gQkxPQ0tTSVpFKSl7IC8vIOi2heWHuuWPr+eUqOmrmOW6plxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOWIpOaWreW9k+WJjea0u+WKqOaWueWdl+aYr+WQpuWPr+S7peenu+WKqFxyXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZGlyZWN0aW9uIOenu+WKqOaWueWQkVxyXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICDmmK/lkKblj6/ku6Xnp7vliqhcclxuXHQgKi9cclxuXHRjYW5tb3ZlKGRpcmVjdGlvbil7XHJcblx0XHRpZihkaXJlY3Rpb24gPT09ICdyb3RhdGUnKXtcdC8vIOWmguaenOaYr+aXi+i9rFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5fY2FuUm90YXRlKCk7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ibG9ja0Fyci5ldmVyeSgoaXRlbSkgPT4ge1x0Ly8g5Yik5pat5YyF5ZCr55qE5q+P5LiA5Liq5bCP5pa55Z2X5piv5ZCm5Y+v5Lul56e75YqoXHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuX2NhblNpbmdsZU1vdmUoaXRlbSwgZGlyZWN0aW9uKVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cdFx0XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOi/m+ihjOenu+WKqFxyXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZGlyZWN0aW9uIOenu+WKqOaWueWQkVxyXG5cdCAqL1xyXG5cdG1vdmUoZGlyZWN0aW9uKXtcclxuXHRcdHN3aXRjaChkaXJlY3Rpb24pe1xyXG5cdFx0XHRjYXNlICdsZWZ0JzpcclxuXHRcdFx0XHR0aGlzLmJsb2NrQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdGl0ZW0uc3R5bGUubGVmdCA9IChwYXJzZUludChpdGVtLnN0eWxlLmxlZnQpIC0gU1RFUExFTkdUSCkgKyAncHgnO1xyXG5cdFx0XHRcdH0pO1x0XHRcdFx0XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHR0aGlzLmJsb2NrQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdGl0ZW0uc3R5bGUubGVmdCA9IChwYXJzZUludChpdGVtLnN0eWxlLmxlZnQpICsgU1RFUExFTkdUSCkgKyAncHgnO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdkb3duJzpcclxuXHRcdFx0XHR0aGlzLmJsb2NrQXJyLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0XHRcdGl0ZW0uc3R5bGUudG9wID0gKHBhcnNlSW50KGl0ZW0uc3R5bGUudG9wKSArIFNURVBMRU5HVEgpICsgJ3B4JztcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncm90YXRlJzpcclxuXHRcdFx0XHR0aGlzLl9yb3RhdGUoKTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEJsb2NrO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9ibG9jay5qcyIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yMSAyMjoyMjo1MlxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTA6MTQ6MTJcclxuKi9cclxuXHJcbmltcG9ydCBUZXRyaXNBcmVhIGZyb20gJy4vdGV0cmlzQXJlYSc7XHJcbnJlcXVpcmUoJy4uL3N0eWxlL25vcm1hbGl6ZS5jc3MnKTtcclxucmVxdWlyZSgnLi4vc3R5bGUvdGV0cmlzLmNzcycpO1xyXG5cclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0bGV0IHRldHJpc0FyZWEgPSBuZXcgVGV0cmlzQXJlYSgpO1xyXG5cdH0sMTAwKTtcclxuXHRcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy9tYWluLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==