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
/******/ 	var hotCurrentHash = "15417b5bf409e9c7e8d1"; // eslint-disable-line no-unused-vars
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
* @Last Modified time: 2017-02-27 16:12:36
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTU0MTdiNWJmNDA5ZTljN2U4ZDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdGV0cmlzQXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvbm9ybWFsaXplLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvdGV0cmlzLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvYmxvY2suanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21haW4uanMiXSwibmFtZXMiOlsiQkxPQ0tTSVpFIiwiU1RFUExFTkdUSCIsIkJMT0NLVFlQRSIsIlRldHJpc0FyZWEiLCJjb25zdHJ1Y3RvciIsImFjdGl2ZUJsb2NrIiwibm9LZXlQcmVzcyIsImRpdiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiYm9keSIsImFwcGVuZCIsIndpbmRvdyIsIm9ua2V5ZG93biIsImJpbmQiLCJzdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJ3aWR0aCIsInBhcnNlSW50IiwiaGVpZ2h0IiwiYmxvY2tXaWR0aCIsImJsb2NrSGVpZ2h0IiwiYm9yZGVyIiwibGVuZ3RoIiwiZmlsbCIsImluYWN0aXZlQmxvY2tzIiwiaSIsInN0YXJ0R2FtZSIsIm5ld0FjdGl2ZUJsb2NrIiwidHlwZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImFyciIsInBhcmVudCIsImNhbm1vdmUiLCJhbGVydCIsImJsb2NrRHJvcCIsImRlbGV0ZUFjdGl2ZUJsb2NrIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0Iiwia2V5Iiwia2V5Q29kZSIsImRpcmVjdGlvbiIsIm1vdmUiLCJnZXRCb3JkZXIiLCJpbmFjdGl2ZUJsb2Nrc1NpbSIsImN1cnJlbnRSb3ciLCJqIiwiY3VycmVudEJsb2NrIiwicHVzaCIsImxlZnQiLCJ0b3AiLCJjb2x1bW5BcnIiLCJmaWx0ZXIiLCJpdGVtIiwic29ydCIsImEiLCJiIiwidGltZW91dCIsInRtRnVuY3Rpb24iLCJzZXRUaW1lb3V0IiwiYmxvY2tBdEJvdHRvbSIsImN1cnJlbnRCbG9ja3MiLCJibG9ja0FyciIsImNsYXNzTmFtZSIsInRvcEJsb2NrIiwiY2FsRWxpbmltYXRlIiwiZnVsbFdpZHRoIiwiZWxpbWluYXRlQXJyIiwiYmVmb3JlRWxpbmltYXRlUm93IiwibGVuIiwiZWxpbmltYXRlUm93Iiwicm93TnVtIiwicmVtb3ZlQ2hpbGQiLCJCbG9jayIsInBhcmFtcyIsIl9kcmF3Iiwib3JpZ2luVG9wIiwib3JpZ2luTGVmdCIsIm9yaWdpbkNsYXNzIiwidG1wQ2xhc3NOYW1lIiwic3ViQmxvY2siLCJhcHBlbmRDaGlsZCIsIl9yb3RhdGUiLCJfcm90YXRlQXJyIiwidGVtcEFyciIsIl9jYW5TaW5nbGVNb3ZlIiwibGVmdEJsb2NrIiwiYm90dG9tIiwiX2NhblJvdGF0ZSIsImFmdGVyQXJyIiwibGVuMSIsImxlbjIiLCJjdXJyZW50TGVmdCIsImN1cnJlbnRCb3R0b20iLCJldmVyeSIsImZvckVhY2giLCJyZXF1aXJlIiwib25sb2FkIiwidGV0cmlzQXJlYSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBLG1DQUEyQjtBQUMzQixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0EsYUFBSztBQUNMLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBYSw0QkFBNEI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQWUsdUNBQXVDO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZSxzQkFBc0I7QUFDckM7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQWEsd0NBQXdDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0EsOENBQXNDLHVCQUF1Qjs7QUFFN0Q7QUFDQTs7Ozs7Ozs7OztBQ25zQkE7QUFBQTs7Ozs7OztBQU9BOztBQUNBLE1BQU1BLFlBQWEsRUFBbkIsQyxDQUF1QjtBQUN2QixNQUFNQyxhQUFhLEVBQW5COztBQUVBOzs7QUFHQSxNQUFNQyxZQUFZLENBQ2pCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVQsQ0FEaUIsRUFFakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILENBQWIsQ0FGaUIsRUFHakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVCxDQUhpQixFQUlqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBUCxFQUFhLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBYixDQUppQixFQUtqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUQsRUFBVSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFWLENBTGlCLEVBTWpCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQU8sQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFQLEVBQWEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFiLENBTmlCLEVBT2pCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBRCxFQUFVLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQVYsQ0FQaUIsRUFRakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBTyxDQUFDLENBQUQsRUFBRyxDQUFILENBQVAsRUFBYSxDQUFDLENBQUQsRUFBRyxDQUFILENBQWIsQ0FSaUIsRUFTakIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBVCxDQVRpQixFQVVqQixDQUFDLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBRCxFQUFPLENBQUMsQ0FBRCxF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IGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSAxMDAwMDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiMTU0MTdiNWJmNDA5ZTljN2U4ZDFcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdE1haW5Nb2R1bGUgPSB0cnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdE1haW5Nb2R1bGUgPSBmYWxzZTtcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBcImVcIiwge1xyXG4gXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdHZhbHVlOiBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdE1haW5Nb2R1bGUsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90TWFpbk1vZHVsZSA9IHRydWU7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoKS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDUpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDE1NDE3YjViZjQwOWU5YzdlOGQxIiwiLypcclxuKiBAQXV0aG9yOiBsaXVqaWFqdW5cclxuKiBARGF0ZTogICAyMDE3LTAyLTI3IDA5OjQ5OjM3XHJcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAgbGl1amlhanVuXHJcbiogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wMi0yNyAxMDoxMTo1OVxyXG4qL1xyXG5cclxuJ3VzZSBzdHJpY3QnO1xyXG5jb25zdCBCTE9DS1NJWkUgID0gMzA7XHQvLyDmlrnlnZflpKflsI9cclxuY29uc3QgU1RFUExFTkdUSCA9IDMwO1xyXG5cclxuLypcclxuICog5p6a5Li+5omA5pyJ55qE5Yid5aeL5b2i54q2XHJcbiAqL1xyXG5jb25zdCBCTE9DS1RZUEUgPSBbXHJcblx0W1sxLDEsMV0sWzEsMCwwXV0sXHJcblx0W1sxLDFdLFswLDFdLFswLDFdXSxcclxuXHRbWzAsMCwxXSxbMSwxLDFdXSxcclxuXHRbWzEsMF0sWzEsMF0sWzEsMV1dLFxyXG5cdFtbMSwxLDBdLCBbMCwxLDFdXSxcclxuXHRbWzAsMV0sWzEsMV0sWzEsMF1dLFxyXG5cdFtbMSwxLDFdLCBbMCwwLDFdXSxcclxuXHRbWzAsMV0sWzAsMV0sWzEsMV1dLFxyXG5cdFtbMSwwLDBdLFsxLDEsMV1dLFxyXG5cdFtbMSwxXSxbMSwwXSxbMSwwXV0sXHJcblx0W1sxLDEsMSwxXV0sXHJcblx0W1sxXSxbMV0sWzFdLFsxXV0sXHJcblx0W1sxLDFdLFsxLDFdXSxcclxuXHRbWzAsMSwwXSxbMSwxLDFdXSxcclxuXHRbWzEsMF0sWzEsMV0sWzEsMF1dLFxyXG5cdFtbMSwxLDFdLFswLDEsMF1dLFxyXG5cdFtbMCwxXSxbMSwxXSwgWzAsMV1dLFxyXG5cdFtbMCwxLDFdLCBbMSwxLDBdXSxcclxuXHRbWzEsMF0sWzEsMV0sWzAsMV1dXHJcbl07XHJcblxyXG5leHBvcnQge1xyXG5cdEJMT0NLVFlQRSxcclxuXHRCTE9DS1NJWkUsXHJcblx0U1RFUExFTkdUSFxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2NvbmZpZy5qcyIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yNyAwOTo1MToyNVxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTY6MTI6MzZcclxuKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBCbG9jayBmcm9tICcuL2Jsb2NrLmpzJztcclxuaW1wb3J0IHtCTE9DS1NJWkUsIEJMT0NLVFlQRX0gZnJvbSAnLi9jb25maWcnO1xyXG5cclxuLyoqXHJcbiAqIOS/hOe9l+aWr+aWueWdl+eUu+adv1xyXG4gKi9cclxuY2xhc3MgVGV0cmlzQXJlYXtcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0dGhpcy5hY3RpdmVCbG9jayA9IG51bGw7XHQvL2N1cnJlbnQgZHJvcHBpbmctZG93biBibG9ja1xyXG5cdFx0dGhpcy5ub0tleVByZXNzID0gZmFsc2U7XHJcblxyXG5cdFx0dGhpcy5kaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdHRoaXMuZGl2LmlkID0gJ3dyYXBwZXInO1xyXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmQodGhpcy5kaXYpO1xyXG5cclxuXHRcdHdpbmRvdy5vbmtleWRvd24gPSB0aGlzLm9ua2V5ZG93bi5iaW5kKHRoaXMpO1xyXG5cclxuXHRcdGxldCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZGl2KTtcclxuXHRcdHRoaXMud2lkdGggPSBwYXJzZUludChzdHlsZS53aWR0aCk7XHJcblx0XHR0aGlzLmhlaWdodCA9IHBhcnNlSW50KHN0eWxlLmhlaWdodCk7XHJcblx0XHR0aGlzLmJsb2NrV2lkdGggPSB0aGlzLndpZHRoIC8gQkxPQ0tTSVpFO1x0Ly/ku6XmlrnmoLzlnZfmlbDmiYDorqHnmoTlrr3luqZcclxuXHRcdHRoaXMuYmxvY2tIZWlnaHQgPSB0aGlzLmhlaWdodCAvIEJMT0NLU0laRTtcclxuXHJcblx0XHQvLyB0aGlzLmJvcmRlcuihqOekuuavj+S4gOWIl+eahOacgOWkp+WPr+eUqOmrmOW6pu+8jOaWueWdl+inpuWIsOS5i+WQjuWwseihqOekuuW3sue7j+inpuW6lVxyXG5cdFx0Ly8g5q+P5qyh5pa55Z2X6Kem5bqV77yM6K+l5bGe5oCn6YO96ZyA6KaB6YCa6L+HdGhpcy5nZXRCb3JkZXLmm7TmlrBcclxuXHRcdHRoaXMuYm9yZGVyID0gW107XHJcblx0XHR0aGlzLmJvcmRlci5sZW5ndGggPSB0aGlzLmJsb2NrV2lkdGg7XHJcblx0XHR0aGlzLmJvcmRlci5maWxsKHRoaXMuaGVpZ2h0KTtcclxuXHJcblx0XHQvLyB0aGlzLmluYWN0aXZlQmxvY2tz6K6w5b2V5o6J5Yiw5bqV6YOo55qE5pa55Z2XXHJcblx0XHQvLyDlhbHljIXlkKt0aGlzLmJsb2NrSGVpZ2h05Liq5pWw57uE77yM5q+P5Liq5pWw57uE6KGo56S66K+l6KGM55qE5omA5pyJ5bCP5pa55Z2XXHJcblx0XHQvLyDlvZPmn5DooYzmiYDmi6XmnInnmoTlsI/mlrnlnZfkuKrmlbDnrYnkuo50aGlzLmJsb2NrV2lkdGjml7bvvIzmtojpmaTor6XooYxcclxuXHRcdHRoaXMuaW5hY3RpdmVCbG9ja3MgPSBbXTtcclxuXHRcdC8vIHRoaXMuaW5hY3RpdmVCbG9ja3MuZmlsbChbXSk7XHQvLyDor6Xmlrnms5XplJnor6/vvIzlm6DkuLrmmK/nlKjlkIzkuIDkuKpbXeWhq+WFhe+8jOS5n+WwseaYr+ivtOaJgOacieeahOWtkGl0ZW3pg73mmK/mjIflkJHlkIzkuIDkuKrnqbrmlbDnu4RcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmJsb2NrSGVpZ2h0OyBpKyspe1xyXG5cdFx0XHR0aGlzLmluYWN0aXZlQmxvY2tzW2ldID0gW107XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5zdGFydEdhbWUoKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5Lqn55Sf5LiL5LiA5Liq5pa55qC8XHJcblx0ICovXHJcblx0bmV3QWN0aXZlQmxvY2soKXtcclxuXHRcdGxldCB0eXBlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogQkxPQ0tUWVBFLmxlbmd0aCk7XHJcblx0XHR0aGlzLmFjdGl2ZUJsb2NrID0gbmV3IEJsb2NrKHtcclxuXHRcdFx0YXJyOiBCTE9DS1RZUEVbdHlwZV0sXHJcblx0XHRcdHBhcmVudDogdGhpc1xyXG5cdFx0fSk7XHJcblx0XHRpZighdGhpcy5hY3RpdmVCbG9jay5jYW5tb3ZlKCdkb3duJykpe1xyXG5cdFx0XHRhbGVydCgnR2FtZSBPdmVyJyk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHRoaXMuYmxvY2tEcm9wKCk7XHQvLyDmlrDlu7rmtLvliqjmlrnlnZfkuYvlkI7vvIzmtLvliqjmlrnlnZflvIDlp4vkuIvlnaBcclxuXHRcdHRoaXMubm9LZXlQcmVzcyA9IGZhbHNlO1xyXG5cdH1cclxuXHRkZWxldGVBY3RpdmVCbG9jaygpe1xyXG5cdFx0dGhpcy5hY3RpdmVCbG9jayA9IG51bGw7XHJcblx0fVxyXG5cdG9ua2V5ZG93bihlKXtcclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRpZih0aGlzLm5vS2V5UHJlc3Mpe1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRsZXQga2V5ID0gZS5rZXlDb2RlO1xyXG5cdFx0bGV0IGRpcmVjdGlvbjtcclxuXHRcdHN3aXRjaChrZXkpe1xyXG5cdFx0XHRjYXNlIDM3OlxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdsZWZ0JztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAzODogLy8gdXAga2V5XHJcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ3JvdGF0ZSc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgMzk6XHJcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSA0MDpcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAnZG93bic7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5hY3RpdmVCbG9jayAmJiB0aGlzLmFjdGl2ZUJsb2NrLmNhbm1vdmUoZGlyZWN0aW9uKSAmJiB0aGlzLmFjdGl2ZUJsb2NrLm1vdmUoZGlyZWN0aW9uKTtcclxuXHR9XHJcblx0c3RhcnRHYW1lKCl7XHJcblx0XHR0aGlzLm5ld0FjdGl2ZUJsb2NrKCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOi/lOWbnuW3sue7j+iiq+WNoOmihueahOS9jee9rlxyXG5cdCAqIOivpei/lOWbnue7k+aenOS4uuS4gOS4quaVsOe7hO+8jOmVv+W6puS4unRoaXMuYmxvY2tXaWR0aCwg5q+P5LiqaXRlbeihqOekuuWFtuWvueW6lOeahOWIl+WPr+eUqOeahOacgOWkp+mrmOW6plxyXG5cdCAqIEByZXR1cm4ge0FycmF5fVxyXG5cdCAqL1xyXG5cdGdldEJvcmRlcigpe1xyXG5cdFx0dGhpcy5ib3JkZXIuZmlsbCh0aGlzLmhlaWdodCk7XHJcblx0XHRsZXQgaW5hY3RpdmVCbG9ja3NTaW0gPSBbXTtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGk8IHRoaXMuYmxvY2tIZWlnaHQ7IGkrKyl7XHJcblx0XHRcdGxldCBjdXJyZW50Um93ID0gdGhpcy5pbmFjdGl2ZUJsb2Nrc1tpXTtcclxuXHRcdFx0Zm9yKGxldCBqID0gMDsgaiA8IGN1cnJlbnRSb3cubGVuZ3RoOyBqKyspe1xyXG5cdFx0XHRcdGxldCBjdXJyZW50QmxvY2sgPSBjdXJyZW50Um93W2pdO1xyXG5cdFx0XHRcdGluYWN0aXZlQmxvY2tzU2ltLnB1c2goe1x0Ly8g6YGN5Y6G5bm25qC85byP5YyW5ZCO5Yqg5YWlaW5hY3RpdmVCbG9ja3NTaW3mlbDnu4RcclxuXHRcdFx0XHRcdGxlZnQ6IHBhcnNlSW50KGN1cnJlbnRCbG9jay5zdHlsZS5sZWZ0KSxcclxuXHRcdFx0XHRcdHRvcDogcGFyc2VJbnQoY3VycmVudEJsb2NrLnN0eWxlLnRvcClcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmJsb2NrV2lkdGg7IGkrKyl7XHRcdFx0XHJcblx0XHRcdGxldCBjb2x1bW5BcnIgPSBpbmFjdGl2ZUJsb2Nrc1NpbS5maWx0ZXIoKGl0ZW0pID0+IHtcdC8vIOaJvuWHuuesrGnliJfnmoTmiYDmnInlhYPntKBcclxuXHRcdFx0XHRyZXR1cm4gaXRlbS5sZWZ0IC8gQkxPQ0tTSVpFID09PSBpO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHRpZihjb2x1bW5BcnIubGVuZ3RoIDw9IDApe1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbHVtbkFyci5zb3J0KChhLGIpID0+IHtcdC8vIOaMiXRvcOS7juWwj+WIsOWkp+aOkuW6j1xyXG5cdFx0XHRcdHJldHVybiBhLnRvcCAtIGIudG9wO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Y29sdW1uQXJyWzBdICYmICh0aGlzLmJvcmRlcltpXSA9IGNvbHVtbkFyclswXS50b3ApO1x0Ly8g5aaC5p6c6K+l5YiX5pyJ5YWD57Sg77yM5pu05paw5Y+v55So6auY5bqmXHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOaWueWdl+S4i+WdoFxyXG5cdCAqL1xyXG5cdGJsb2NrRHJvcCgpe1xyXG5cdFx0bGV0IHRpbWVvdXQ7XHJcblx0XHRsZXQgdG1GdW5jdGlvbiA9ICgpID0+IHtcclxuXHRcdFx0aWYodGhpcy5hY3RpdmVCbG9jayAmJiB0aGlzLmFjdGl2ZUJsb2NrLmNhbm1vdmUoJ2Rvd24nKSl7XHJcblx0XHRcdFx0dGhpcy5hY3RpdmVCbG9jay5tb3ZlKCdkb3duJyk7XHJcblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQodG1GdW5jdGlvbiwgNTAwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNle1xyXG5cdFx0XHRcdHRoaXMuYmxvY2tBdEJvdHRvbSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCh0bUZ1bmN0aW9uLCA1MDApO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmlrnlnZfliLDovr7lupXpg6jnmoTlpITnkIblh73mlbBcclxuXHQgKi9cclxuXHRibG9ja0F0Qm90dG9tKCl7XHJcblx0XHR0aGlzLm5vS2V5UHJlc3MgPSB0cnVlO1xyXG5cclxuXHRcdGxldCBjdXJyZW50QmxvY2tzID0gdGhpcy5hY3RpdmVCbG9jay5ibG9ja0FycjtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGk8IGN1cnJlbnRCbG9ja3MubGVuZ3RoOyBpKyspe1x0Ly8g5Yiw6L6+5bqV6YOo5ZCO77yM5bCG5b2T5YmN5rS75Yqo5pa55Z2X5YWo6YOo5Yqg5YWlaW5hY3RpdmVCbG9ja3NcclxuXHRcdFx0bGV0IGl0ZW0gPSBjdXJyZW50QmxvY2tzW2ldO1xyXG5cdFx0XHRpdGVtLmNsYXNzTmFtZSA9ICdibG9jayBibG9jay1pbmFjdGl2ZSc7XHJcblx0XHRcdGxldCB0b3BCbG9jayA9IHBhcnNlSW50KGl0ZW0uc3R5bGUudG9wKSAvIEJMT0NLU0laRTtcclxuXHRcdFx0dGhpcy5pbmFjdGl2ZUJsb2Nrc1t0b3BCbG9ja10ucHVzaChpdGVtKTtcclxuXHRcdH1cclxuXHRcdGlmKHRoaXMuY2FsRWxpbmltYXRlKCkpe1x0Ly8g5aaC5p6c5pyJ6KaB5raI6Zmk55qE6KGM77yM562J5b6FMzAwbXPlkI7miafooYzvvIznlZnlh7ozMDBtc+aPkOekuueUqOaIt+acieihjOato+WcqOa2iOmZpFxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmdldEJvcmRlcigpO1xyXG5cdFx0XHRcdHRoaXMubmV3QWN0aXZlQmxvY2soKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHR0aGlzLmdldEJvcmRlcigpO1xyXG5cdFx0XHR0aGlzLm5ld0FjdGl2ZUJsb2NrKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOiuoeeul+aYr+WQpuacieaVtOihjOmcgOimgea2iOmZpFxyXG5cdCAqIOW9k+a0u+WKqOaWueWdl+WIsOi+vuW6lemDqOaXtui/kOihjFxyXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59IOaYr+WQpuacieihjOmcgOimgea2iOmZpFxyXG5cdCAqL1xyXG5cdGNhbEVsaW5pbWF0ZSgpe1xyXG5cdFx0bGV0IGZ1bGxXaWR0aCA9IHRoaXMuYmxvY2tXaWR0aCxcclxuXHRcdFx0ZWxpbWluYXRlQXJyID0gW107XHQvLyByb3dOdW0gdG8gYmUgZWxpbWluYXRlZFxyXG5cclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmJsb2NrSGVpZ2h0OyBpKyspe1xyXG5cdFx0XHRsZXQgY3VycmVudFJvdyA9IHRoaXMuaW5hY3RpdmVCbG9ja3NbaV07XHJcblx0XHRcdGlmKGN1cnJlbnRSb3cubGVuZ3RoID49IGZ1bGxXaWR0aCl7XHQvLyDor6XooYzlt7Lmu6HpnIDopoHmtojpmaRcclxuXHRcdFx0XHR0aGlzLmJlZm9yZUVsaW5pbWF0ZVJvdyhpKTtcdC8vIOaPkOekuueUqOaIt+ivpeihjOWNs+Wwhua2iOmZpFxyXG5cdFx0XHRcdGVsaW1pbmF0ZUFyci5wdXNoKGkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRsZXQgbGVuID0gZWxpbWluYXRlQXJyLmxlbmd0aDtcclxuXHRcdGlmKGxlbil7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdGZvcihsZXQgaSA9IDA7IGkgPCBsZW47IGkrKylcclxuXHRcdFx0XHRcdHRoaXMuZWxpbmltYXRlUm93KGVsaW1pbmF0ZUFycltpXSk7XHJcblx0XHRcdH0sMTAwKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gbGVuID4gMDtcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5raI6Zmk6KGM5LmL5YmN6Zeq54OBXHJcblx0ICogQHBhcmFtICB7bnVtYmVyfSByb3dOdW0g5a+55bqU55qE6KGM77yM5LuO5LiK5b6A5LiL5LuOMOihjOW8gOWni1xyXG5cdCAqL1xyXG5cdGJlZm9yZUVsaW5pbWF0ZVJvdyhyb3dOdW0pe1xyXG5cdFx0bGV0IGZ1bGxXaWR0aCA9IHRoaXMuYmxvY2tXaWR0aDtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmdWxsV2lkdGg7IGkrKyl7XHJcblx0XHRcdHRoaXMuaW5hY3RpdmVCbG9ja3Nbcm93TnVtXVtpXS5jbGFzc05hbWUgPSAnYmxvY2sgYmxvY2stZWxpbWluYXRlJztcclxuXHRcdH1cclxuXHR9XHJcblx0LyoqXHJcblx0ICog5raI6Zmk6KGMXHJcblx0ICogQHBhcmFtICB7bnVtYmVyfSByb3dOdW0g5a+55bqU55qE6KGM77yM5LuO5LiK5b6A5LiL5LuOMOihjOW8gOWni1xyXG5cdCAqL1xyXG5cdGVsaW5pbWF0ZVJvdyhyb3dOdW0pe1xyXG5cdFx0bGV0IGZ1bGxXaWR0aCA9IHRoaXMuYmxvY2tXaWR0aDtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCBmdWxsV2lkdGg7IGkrKyl7XHJcblx0XHRcdHRoaXMuZGl2LnJlbW92ZUNoaWxkKHRoaXMuaW5hY3RpdmVCbG9ja3Nbcm93TnVtXVtpXSk7XHQvL+enu+mZpOaJgOacieWFg+e0oFxyXG5cdFx0fVxyXG5cdFx0Zm9yKGxldCBpID0gcm93TnVtIC0gMTsgaSA+IDA7IGktLSl7XHQvLyDkuIrmlrnmiYDmnInooYzkuIvnp7vvvIzlubbmm7TmlrB0aGlzLmluYWN0aXZlQmxvY2tzXHJcblx0XHRcdGxldCBjdXJyZW50Um93ID0gdGhpcy5pbmFjdGl2ZUJsb2Nrc1tpXTtcclxuXHRcdFx0Zm9yKGxldCBqID0gMDsgaiA8IGN1cnJlbnRSb3cubGVuZ3RoOyBqKyspe1xyXG5cdFx0XHRcdGN1cnJlbnRSb3dbal0uc3R5bGUudG9wID0gKHBhcnNlSW50KGN1cnJlbnRSb3dbal0uc3R5bGUudG9wKSArIEJMT0NLU0laRSApKyAncHgnO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuaW5hY3RpdmVCbG9ja3NbaSArIDFdID0gY3VycmVudFJvdztcclxuXHRcdH1cclxuXHRcdHRoaXMuaW5hY3RpdmVCbG9ja3NbMF0gPSBbXTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRldHJpc0FyZWE7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL3RldHJpc0FyZWEuanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0eWxlL25vcm1hbGl6ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZS90ZXRyaXMuY3NzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yNyAwOTo1MDozNlxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTA6MDQ6MTFcclxuKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHtCTE9DS1NJWkUsIFNURVBMRU5HVEh9IGZyb20gJy4vY29uZmlnLmpzJztcclxuLyoqXHJcbiAqIEJMT0NL57G777yM5q+P5LiqQkxPQ0vkuK3ljIXlkKvlpJrkuKrlsI/mlrnlnZdcclxuICovXHJcbmNsYXNzIEJsb2Nre1xyXG5cdGNvbnN0cnVjdG9yKHBhcmFtcyl7XHJcblx0XHR0aGlzLmFyciA9IHBhcmFtcy5hcnI7XHQvLyBCbG9ja+aVsOe7hO+8jOihqOekuuivpeaWueWdl+eahOW9oueKtlxyXG5cdFx0dGhpcy5wYXJlbnQgPSBwYXJhbXMucGFyZW50O1x0Ly8g54i25a+56LGhXHJcblx0XHR0aGlzLmhlaWdodCA9IHRoaXMuYXJyLmxlbmd0aCAqIEJMT0NLU0laRTtcclxuXHRcdHRoaXMud2lkdGggPSB0aGlzLmFyclswXS5sZW5ndGggKiBCTE9DS1NJWkU7XHJcblx0XHR0aGlzLmJsb2NrQXJyID0gW107XHJcblx0XHQvLyDmtoLmlrnlnZdcclxuXHRcdHRoaXMuX2RyYXcoMCwgMCk7XHRcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5qC55o2uYXJy55S75Ye66K+l5pa55Z2X77yMW1sxLDBdLFsxLDFd6KGo56S65LiA5LiqMioy5pa55Z2X77yM5L2G5piv56ys5LiA6KGM56ys5LqM5Liq5Li656m6XHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IG9yaWdpblRvcCDmlrnlnZfnmoTotbflp4vngrlcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gb3JpZ2luTGVmdCDmlrnlnZfnmoTotbflp4vngrlcclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3JpZ2luQ2xhc3Mg5piv5ZCm5piv6YeN57uY5peL6L2s5pa55Z2X77yM5aaC5p6c5piv77yM5L+d5oyBY2xhc3NOYW1l5LiN5Y+YXHJcblx0ICovXHJcblx0X2RyYXcob3JpZ2luVG9wLCBvcmlnaW5MZWZ0LCBvcmlnaW5DbGFzcyl7XHJcblx0XHRsZXQgaGVpZ2h0ID0gdGhpcy5hcnIubGVuZ3RoLFxyXG5cdFx0ICAgIHdpZHRoID0gdGhpcy5hcnJbMF0ubGVuZ3RoLFxyXG5cdFx0ICAgIHRtcENsYXNzTmFtZSA9IG9yaWdpbkNsYXNzID8gb3JpZ2luQ2xhc3MgOiAnYmxvY2sgYmxvY2stYWN0aXZlLScgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNSk7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspXHJcblx0XHRcdGZvcihsZXQgaiA9IDA7IGogPCB3aWR0aDsgaisrKXtcclxuXHRcdFx0XHRpZih0aGlzLmFycltpXVtqXSA9PSAxKXtcclxuXHRcdFx0XHRcdGxldCBzdWJCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdFx0c3ViQmxvY2suY2xhc3NOYW1lID0gdG1wQ2xhc3NOYW1lO1xyXG5cdFx0XHRcdFx0c3ViQmxvY2suc3R5bGUubGVmdCA9IChqICogQkxPQ0tTSVpFICsgb3JpZ2luTGVmdCkgKyAncHgnO1xyXG5cdFx0XHRcdFx0c3ViQmxvY2suc3R5bGUudG9wID0gKGkgKiBCTE9DS1NJWkUgKyBvcmlnaW5Ub3ApICsgJ3B4JztcclxuXHRcdFx0XHRcdHRoaXMuYmxvY2tBcnIucHVzaChzdWJCbG9jayk7XHJcblx0XHRcdFx0XHR0aGlzLnBhcmVudC5kaXYuYXBwZW5kQ2hpbGQoc3ViQmxvY2spO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmlrnlnZfov5vooYzml4vovaxcclxuXHQgKiDkv53mjIHmlbTkvZPlt6bkuIrop5LkuI3lj5hcclxuXHQgKi9cclxuXHRfcm90YXRlKCl7XHJcblx0XHRpZih0aGlzLmJsb2NrQXJyLmxlbmd0aCA8PSAwKXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Ly8g5peL6L2s5pe25bem5LiK6KeS55qE5L2N572uXHJcblx0XHRsZXQgbGVmdCA9IHBhcnNlSW50KHRoaXMuYmxvY2tBcnJbMF0uc3R5bGUubGVmdCk7XHJcblx0XHRsZXQgdG9wID0gcGFyc2VJbnQodGhpcy5ibG9ja0FyclswXS5zdHlsZS50b3ApO1xyXG5cdFx0bGV0IG9yaWdpbkNsYXNzID0gdGhpcy5ibG9ja0FyclswXS5jbGFzc05hbWU7XHJcblx0XHQvLyDnp7vpmaTljp/mnaXnmoTmiYDmnInlsI/mlrnmoLxcclxuXHRcdGZvcihsZXQgaSA9IDAsIGxlbiA9IHRoaXMuYmxvY2tBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG5cdFx0XHR0aGlzLnBhcmVudC5kaXYucmVtb3ZlQ2hpbGQodGhpcy5ibG9ja0FycltpXSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLmJsb2NrQXJyLmxlbmd0aCA9IDA7XHJcblxyXG5cdFx0dGhpcy5hcnIgPSB0aGlzLl9yb3RhdGVBcnIodGhpcy5hcnIpOy8vIOaXi+i9rFxyXG5cdFx0dGhpcy5fZHJhdyh0b3AsIGxlZnQsIG9yaWdpbkNsYXNzKTsvLyDph43mlrDnu5jliLZcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5pWw57uE6L+b6KGM6aG65pe26ZKI5peL6L2sXHJcblx0ICovXHJcblx0X3JvdGF0ZUFycigpe1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0bGV0IGhlaWdodCA9IHRoaXMuYXJyLmxlbmd0aCxcclxuXHRcdCAgICB3aWR0aCA9IHRoaXMuYXJyWzBdLmxlbmd0aDtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKXtcclxuXHRcdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBqID0gaGVpZ2h0IC0gMTsgaiA+PSAwOyBqLS0pe1xyXG5cdFx0XHRcdHRlbXBBcnIucHVzaCh0aGlzLmFycltqXVtpXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXJyLnB1c2godGVtcEFycik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYXJyO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiDliKTmlq3ljZXkuKrlsI/mlrnlnZfmmK/lkKblj6/ku6XlkJHmn5DmlrnlkJHnp7vliqhcclxuXHQgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGl0ZW0g6K+l5bCP5pa55Z2X55qE5byV55SoXHJcblx0ICogQHBhcmFtICB7c3RyaW5nfSBkaXJlY3Rpb24g56e75Yqo5pa55ZCRXHJcblx0ICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgIOaYr+WQpuWPr+S7peenu+WKqFxyXG5cdCAqL1xyXG5cdF9jYW5TaW5nbGVNb3ZlKGl0ZW0sIGRpcmVjdGlvbil7XHJcblx0XHRsZXQgbGVmdEJsb2NrID0gcGFyc2VJbnQoaXRlbS5zdHlsZS5sZWZ0KSAvIEJMT0NLU0laRTtcdC8v6K+l5bCP5pa55Z2X5a+55bqU55qE5YiX5pWwXHJcblx0XHRsZXQgYm90dG9tID0gcGFyc2VJbnQoaXRlbS5zdHlsZS50b3ApICsgQkxPQ0tTSVpFO1x0Ly8g6K+l5bCP5pa55Z2X55qE5bqV6YOo5L2N572uXHJcblx0XHRzd2l0Y2goZGlyZWN0aW9uKXtcclxuXHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2sgLSAxXSAmJiAoYm90dG9tIDw9IHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2sgLSAxXSk7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayArIDFdICYmIChib3R0b20gPD0gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayArIDFdKTtcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2tdICYmICgoYm90dG9tICsgQkxPQ0tTSVpFKSA8PSB0aGlzLnBhcmVudC5ib3JkZXJbbGVmdEJsb2NrXSk7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDliKTmlq3mmK/lkKblj6/ku6Xml4vovaxcclxuXHQgKi9cclxuXHRfY2FuUm90YXRlKCl7XHJcblx0XHRsZXQgYWZ0ZXJBcnIgPSB0aGlzLl9yb3RhdGVBcnIodGhpcy5hcnIpO1xyXG5cdFx0bGV0IGxlZnRCbG9jayA9IHBhcnNlSW50KHRoaXMuYmxvY2tBcnJbMF0uc3R5bGUubGVmdCkgLyBCTE9DS1NJWkU7XHJcblx0XHRsZXQgdG9wQmxvY2sgPSBwYXJzZUludCh0aGlzLmJsb2NrQXJyWzBdLnN0eWxlLnRvcCkgLyBCTE9DS1NJWkU7XHJcblx0XHRmb3IobGV0IGkgPSAwLCBsZW4xID0gYWZ0ZXJBcnIubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKXtcdC8vIOmAkOS4quWIpOaWreaXi+i9rOS5i+WQjueahOS9jee9ruaYr+WQpui2hei/h+i+ueeVjFxyXG5cdFx0XHRsZXQgY3VycmVudFJvdyA9IGFmdGVyQXJyW2ldO1xyXG5cdFx0XHRmb3IobGV0IGogPSAwLCBsZW4yID0gY3VycmVudFJvdy5sZW5ndGg7IGogPCBsZW4yOyBqKyspe1xyXG5cdFx0XHRcdGxldCBjdXJyZW50TGVmdCA9IGxlZnRCbG9jayArIGosXHJcblx0XHRcdFx0ICAgIGN1cnJlbnRCb3R0b20gPSB0b3BCbG9jayArIGkgKyAxO1xyXG5cdFx0XHRcdGlmKGN1cnJlbnRMZWZ0IDwgMCB8fCBjdXJyZW50TGVmdCA+PSB0aGlzLnBhcmVudC5ibG9ja1dpZHRoKXtcdC8vIOi2heWHuuWuveW6plxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjdXJyZW50Qm90dG9tIDwgMSB8fCBjdXJyZW50Qm90dG9tID49IHRoaXMucGFyZW50LmJsb2NrSGVpZ2h0KXsgLy8g6LaF5Ye66auY5bqmXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGN1cnJlbnRCb3R0b20gPiAodGhpcy5wYXJlbnQuYm9yZGVyW2N1cnJlbnRMZWZ0XSAvIEJMT0NLU0laRSkpeyAvLyDotoXlh7rlj6/nlKjpq5jluqZcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiDliKTmlq3lvZPliY3mtLvliqjmlrnlnZfmmK/lkKblj6/ku6Xnp7vliqhcclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGRpcmVjdGlvbiDnp7vliqjmlrnlkJFcclxuXHQgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAg5piv5ZCm5Y+v5Lul56e75YqoXHJcblx0ICovXHJcblx0Y2FubW92ZShkaXJlY3Rpb24pe1xyXG5cdFx0aWYoZGlyZWN0aW9uID09PSAncm90YXRlJyl7XHQvLyDlpoLmnpzmmK/ml4vovaxcclxuXHRcdFx0cmV0dXJuIHRoaXMuX2NhblJvdGF0ZSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYmxvY2tBcnIuZXZlcnkoKGl0ZW0pID0+IHtcdC8vIOWIpOaWreWMheWQq+eahOavj+S4gOS4quWwj+aWueWdl+aYr+WQpuWPr+S7peenu+WKqFxyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9jYW5TaW5nbGVNb3ZlKGl0ZW0sIGRpcmVjdGlvbilcclxuXHRcdFx0fSk7XHJcblx0XHR9XHRcdFxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDov5vooYznp7vliqhcclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGRpcmVjdGlvbiDnp7vliqjmlrnlkJFcclxuXHQgKi9cclxuXHRtb3ZlKGRpcmVjdGlvbil7XHJcblx0XHRzd2l0Y2goZGlyZWN0aW9uKXtcclxuXHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0dGhpcy5ibG9ja0Fyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0XHRpdGVtLnN0eWxlLmxlZnQgPSAocGFyc2VJbnQoaXRlbS5zdHlsZS5sZWZ0KSAtIFNURVBMRU5HVEgpICsgJ3B4JztcclxuXHRcdFx0XHR9KTtcdFx0XHRcdFxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0dGhpcy5ibG9ja0Fyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0XHRpdGVtLnN0eWxlLmxlZnQgPSAocGFyc2VJbnQoaXRlbS5zdHlsZS5sZWZ0KSArIFNURVBMRU5HVEgpICsgJ3B4JztcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0dGhpcy5ibG9ja0Fyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0XHRpdGVtLnN0eWxlLnRvcCA9IChwYXJzZUludChpdGVtLnN0eWxlLnRvcCkgKyBTVEVQTEVOR1RIKSArICdweCc7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JvdGF0ZSc6XHJcblx0XHRcdFx0dGhpcy5fcm90YXRlKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCbG9jaztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvYmxvY2suanMiLCIvKlxyXG4qIEBBdXRob3I6IGxpdWppYWp1blxyXG4qIEBEYXRlOiAgIDIwMTctMDItMjEgMjI6MjI6NTJcclxuKiBATGFzdCBNb2RpZmllZCBieTogICBsaXVqaWFqdW5cclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTAyLTI3IDEwOjE0OjEyXHJcbiovXHJcblxyXG5pbXBvcnQgVGV0cmlzQXJlYSBmcm9tICcuL3RldHJpc0FyZWEnO1xyXG5yZXF1aXJlKCcuLi9zdHlsZS9ub3JtYWxpemUuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL3N0eWxlL3RldHJpcy5jc3MnKTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdGxldCB0ZXRyaXNBcmVhID0gbmV3IFRldHJpc0FyZWEoKTtcclxuXHR9LDEwMCk7XHJcblx0XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbWFpbi5qcyJdLCJzb3VyY2VSb290IjoiIn0=