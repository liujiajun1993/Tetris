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
/******/ 	var hotCurrentHash = "cd5c9442683efe6d0a11"; // eslint-disable-line no-unused-vars
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
* @Last Modified time: 2017-02-27 10:04:04
*/






/**
 * 俄罗斯方块画板
 */
class TetrisArea {
	constructor() {
		this.activeBlock = null; //current dropping-down block

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
	}
	deleteActiveBlock() {
		this.activeBlock = null;
	}
	onkeydown(e) {
		e.stopPropagation();
		e.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2Q1Yzk0NDI2ODNlZmU2ZDBhMTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlL25vcm1hbGl6ZS5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlL3RldHJpcy5jc3MiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvanMvdGV0cmlzQXJlYS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGUvbm9ybWFsaXplLmNzcz82NTZjIiwid2VicGFjazovLy8uL3NyYy9zdHlsZS90ZXRyaXMuY3NzP2EzODEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2Jsb2NrLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tYWluLmpzIl0sIm5hbWVzIjpbIkJMT0NLU0laRSIsIlNURVBMRU5HVEgiLCJCTE9DS1RZUEUiLCJUZXRyaXNBcmVhIiwiY29uc3RydWN0b3IiLCJhY3RpdmVCbG9jayIsImRpdiIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiYm9keSIsImFwcGVuZCIsIndpbmRvdyIsIm9ua2V5ZG93biIsImJpbmQiLCJzdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJ3aWR0aCIsInBhcnNlSW50IiwiaGVpZ2h0IiwiYmxvY2tXaWR0aCIsImJsb2NrSGVpZ2h0IiwiYm9yZGVyIiwibGVuZ3RoIiwiZmlsbCIsImluYWN0aXZlQmxvY2tzIiwiaSIsInN0YXJ0R2FtZSIsIm5ld0FjdGl2ZUJsb2NrIiwidHlwZSIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImFyciIsInBhcmVudCIsImNhbm1vdmUiLCJhbGVydCIsImJsb2NrRHJvcCIsImRlbGV0ZUFjdGl2ZUJsb2NrIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0Iiwia2V5Iiwia2V5Q29kZSIsImRpcmVjdGlvbiIsIm1vdmUiLCJnZXRCb3JkZXIiLCJpbmFjdGl2ZUJsb2Nrc1NpbSIsImN1cnJlbnRSb3ciLCJqIiwiY3VycmVudEJsb2NrIiwicHVzaCIsImxlZnQiLCJ0b3AiLCJjb2x1bW5BcnIiLCJmaWx0ZXIiLCJpdGVtIiwic29ydCIsImEiLCJiIiwidGltZW91dCIsInRtRnVuY3Rpb24iLCJzZXRUaW1lb3V0IiwiYmxvY2tBdEJvdHRvbSIsImN1cnJlbnRCbG9ja3MiLCJibG9ja0FyciIsImNsYXNzTmFtZSIsInRvcEJsb2NrIiwiY2FsRWxpbmltYXRlIiwiZnVsbFdpZHRoIiwiZWxpbWluYXRlQ291bnQiLCJiZWZvcmVFbGluaW1hdGVSb3ciLCJlbGluaW1hdGVSb3ciLCJyb3dOdW0iLCJyZW1vdmVDaGlsZCIsIkJsb2NrIiwicGFyYW1zIiwiX2RyYXciLCJvcmlnaW5Ub3AiLCJvcmlnaW5MZWZ0Iiwib3JpZ2luQ2xhc3MiLCJ0bXBDbGFzc05hbWUiLCJzdWJCbG9jayIsImFwcGVuZENoaWxkIiwiX3JvdGF0ZSIsImxlbiIsIl9yb3RhdGVBcnIiLCJ0ZW1wQXJyIiwiX2NhblNpbmdsZU1vdmUiLCJsZWZ0QmxvY2siLCJib3R0b20iLCJfY2FuUm90YXRlIiwiYWZ0ZXJBcnIiLCJsZW4xIiwibGVuMiIsImN1cnJlbnRMZWZ0IiwiY3VycmVudEJvdHRvbSIsImV2ZXJ5IiwiZm9yRWFjaCIsInJlcXVpcmUiLCJvbmxvYWQiLCJ0ZXRyaXNBcmVhIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMENBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7OztBQUlBO0FBQ0Esc0RBQThDO0FBQzlDO0FBQ0EsbUNBQTJCO0FBQzNCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7O0FBRUEsOENBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUFpQiw4QkFBOEI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQSw0REFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQSxhQUFLO0FBQ0wsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUw7QUFDQTtBQUNEO0FBQ0M7QUFwQkY7QUFzQkE7QUE1SlM7O0FBK0pYLHdEQUFlVCxLQUFmLEM7Ozs7Ozs7O0FDM0tBO0FBQUE7Ozs7Ozs7QUFPQTtBQUNBLG1CQUFBd0IsQ0FBUSxDQUFSO0FBQ0EsbUJBQUFBLENBQVEsQ0FBUjs7QUFFQXZGLE9BQU93RixNQUFQLEdBQWdCLFlBQVU7QUFDekJ0QyxZQUFXLFlBQVU7QUFDcEIsTUFBSXVDLGFBQWEsSUFBSSw0REFBSixFQUFqQjtBQUNBLEVBRkQsRUFFRSxHQUZGO0FBSUEsQ0FMRCxDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSAxMDAwMDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiY2Q1Yzk0NDI2ODNlZmU2ZDBhMTFcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdE1haW5Nb2R1bGUgPSB0cnVlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdE1haW5Nb2R1bGUgPSBmYWxzZTtcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBcImVcIiwge1xyXG4gXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdHZhbHVlOiBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdE1haW5Nb2R1bGUsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90TWFpbk1vZHVsZSA9IHRydWU7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoKS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDkpKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGNkNWM5NDQyNjgzZWZlNmQwYTExIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLyohIG5vcm1hbGl6ZS5jc3MgdjMuMC4yIHwgTUlUIExpY2Vuc2UgfCBnaXQuaW8vbm9ybWFsaXplICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gU2V0IGRlZmF1bHQgZm9udCBmYW1pbHkgdG8gc2Fucy1zZXJpZi5cXHJcXG4gKiAyLiBQcmV2ZW50IGlPUyB0ZXh0IHNpemUgYWRqdXN0IGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZSwgd2l0aG91dCBkaXNhYmxpbmdcXHJcXG4gKiAgICB1c2VyIHpvb20uXFxyXFxuICovXFxyXFxuXFxyXFxuaHRtbCB7XFxyXFxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjsgLyogMSAqL1xcclxcbiAgLW1zLXRleHQtc2l6ZS1hZGp1c3Q6IDEwMCU7IC8qIDIgKi9cXHJcXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW1vdmUgZGVmYXVsdCBtYXJnaW4uXFxyXFxuICovXFxyXFxuXFxyXFxuYm9keSB7XFxyXFxuICBtYXJnaW46IDA7XFxyXFxufVxcclxcblxcclxcbi8qIEhUTUw1IGRpc3BsYXkgZGVmaW5pdGlvbnNcXHJcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcblxcclxcbi8qKlxcclxcbiAqIENvcnJlY3QgYGJsb2NrYCBkaXNwbGF5IG5vdCBkZWZpbmVkIGZvciBhbnkgSFRNTDUgZWxlbWVudCBpbiBJRSA4LzkuXFxyXFxuICogQ29ycmVjdCBgYmxvY2tgIGRpc3BsYXkgbm90IGRlZmluZWQgZm9yIGBkZXRhaWxzYCBvciBgc3VtbWFyeWAgaW4gSUUgMTAvMTFcXHJcXG4gKiBhbmQgRmlyZWZveC5cXHJcXG4gKiBDb3JyZWN0IGBibG9ja2AgZGlzcGxheSBub3QgZGVmaW5lZCBmb3IgYG1haW5gIGluIElFIDExLlxcclxcbiAqL1xcclxcblxcclxcbmFydGljbGUsXFxyXFxuYXNpZGUsXFxyXFxuZGV0YWlscyxcXHJcXG5maWdjYXB0aW9uLFxcclxcbmZpZ3VyZSxcXHJcXG5mb290ZXIsXFxyXFxuaGVhZGVyLFxcclxcbmhncm91cCxcXHJcXG5tYWluLFxcclxcbm1lbnUsXFxyXFxubmF2LFxcclxcbnNlY3Rpb24sXFxyXFxuc3VtbWFyeSB7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogMS4gQ29ycmVjdCBgaW5saW5lLWJsb2NrYCBkaXNwbGF5IG5vdCBkZWZpbmVkIGluIElFIDgvOS5cXHJcXG4gKiAyLiBOb3JtYWxpemUgdmVydGljYWwgYWxpZ25tZW50IG9mIGBwcm9ncmVzc2AgaW4gQ2hyb21lLCBGaXJlZm94LCBhbmQgT3BlcmEuXFxyXFxuICovXFxyXFxuXFxyXFxuYXVkaW8sXFxyXFxuY2FudmFzLFxcclxcbnByb2dyZXNzLFxcclxcbnZpZGVvIHtcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jazsgLyogMSAqL1xcclxcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lOyAvKiAyICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFByZXZlbnQgbW9kZXJuIGJyb3dzZXJzIGZyb20gZGlzcGxheWluZyBgYXVkaW9gIHdpdGhvdXQgY29udHJvbHMuXFxyXFxuICogUmVtb3ZlIGV4Y2VzcyBoZWlnaHQgaW4gaU9TIDUgZGV2aWNlcy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5hdWRpbzpub3QoW2NvbnRyb2xzXSkge1xcclxcbiAgZGlzcGxheTogbm9uZTtcXHJcXG4gIGhlaWdodDogMDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBgW2hpZGRlbl1gIHN0eWxpbmcgbm90IHByZXNlbnQgaW4gSUUgOC85LzEwLlxcclxcbiAqIEhpZGUgdGhlIGB0ZW1wbGF0ZWAgZWxlbWVudCBpbiBJRSA4LzkvMTEsIFNhZmFyaSwgYW5kIEZpcmVmb3ggPCAyMi5cXHJcXG4gKi9cXHJcXG5cXHJcXG5baGlkZGVuXSxcXHJcXG50ZW1wbGF0ZSB7XFxyXFxuICBkaXNwbGF5OiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBMaW5rc1xcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgY29sb3IgZnJvbSBhY3RpdmUgbGlua3MgaW4gSUUgMTAuXFxyXFxuICovXFxyXFxuXFxyXFxuYSB7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogSW1wcm92ZSByZWFkYWJpbGl0eSB3aGVuIGZvY3VzZWQgYW5kIGFsc28gbW91c2UgaG92ZXJlZCBpbiBhbGwgYnJvd3NlcnMuXFxyXFxuICovXFxyXFxuXFxyXFxuYTphY3RpdmUsXFxyXFxuYTpob3ZlciB7XFxyXFxuICBvdXRsaW5lOiAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBUZXh0LWxldmVsIHNlbWFudGljc1xcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBzdHlsaW5nIG5vdCBwcmVzZW50IGluIElFIDgvOS8xMC8xMSwgU2FmYXJpLCBhbmQgQ2hyb21lLlxcclxcbiAqL1xcclxcblxcclxcbmFiYnJbdGl0bGVdIHtcXHJcXG4gIGJvcmRlci1ib3R0b206IDFweCBkb3R0ZWQ7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3Mgc3R5bGUgc2V0IHRvIGBib2xkZXJgIGluIEZpcmVmb3ggNCssIFNhZmFyaSwgYW5kIENocm9tZS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5iLFxcclxcbnN0cm9uZyB7XFxyXFxuICBmb250LXdlaWdodDogYm9sZDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBzdHlsaW5nIG5vdCBwcmVzZW50IGluIFNhZmFyaSBhbmQgQ2hyb21lLlxcclxcbiAqL1xcclxcblxcclxcbmRmbiB7XFxyXFxuICBmb250LXN0eWxlOiBpdGFsaWM7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3MgdmFyaWFibGUgYGgxYCBmb250LXNpemUgYW5kIG1hcmdpbiB3aXRoaW4gYHNlY3Rpb25gIGFuZCBgYXJ0aWNsZWBcXHJcXG4gKiBjb250ZXh0cyBpbiBGaXJlZm94IDQrLCBTYWZhcmksIGFuZCBDaHJvbWUuXFxyXFxuICovXFxyXFxuXFxyXFxuaDEge1xcclxcbiAgZm9udC1zaXplOiAyZW07XFxyXFxuICBtYXJnaW46IDAuNjdlbSAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIHN0eWxpbmcgbm90IHByZXNlbnQgaW4gSUUgOC85LlxcclxcbiAqL1xcclxcblxcclxcbm1hcmsge1xcclxcbiAgYmFja2dyb3VuZDogI2ZmMDtcXHJcXG4gIGNvbG9yOiAjMDAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIGluY29uc2lzdGVudCBhbmQgdmFyaWFibGUgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5zbWFsbCB7XFxyXFxuICBmb250LXNpemU6IDgwJTtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgYWZmZWN0aW5nIGBsaW5lLWhlaWdodGAgaW4gYWxsIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbnN1YixcXHJcXG5zdXAge1xcclxcbiAgZm9udC1zaXplOiA3NSU7XFxyXFxuICBsaW5lLWhlaWdodDogMDtcXHJcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXHJcXG59XFxyXFxuXFxyXFxuc3VwIHtcXHJcXG4gIHRvcDogLTAuNWVtO1xcclxcbn1cXHJcXG5cXHJcXG5zdWIge1xcclxcbiAgYm90dG9tOiAtMC4yNWVtO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBFbWJlZGRlZCBjb250ZW50XFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW1vdmUgYm9yZGVyIHdoZW4gaW5zaWRlIGBhYCBlbGVtZW50IGluIElFIDgvOS8xMC5cXHJcXG4gKi9cXHJcXG5cXHJcXG5pbWcge1xcclxcbiAgYm9yZGVyOiAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBDb3JyZWN0IG92ZXJmbG93IG5vdCBoaWRkZW4gaW4gSUUgOS8xMC8xMS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5zdmc6bm90KDpyb290KSB7XFxyXFxuICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbn1cXHJcXG5cXHJcXG4vKiBHcm91cGluZyBjb250ZW50XFxyXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIG1hcmdpbiBub3QgcHJlc2VudCBpbiBJRSA4LzkgYW5kIFNhZmFyaS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5maWd1cmUge1xcclxcbiAgbWFyZ2luOiAxZW0gNDBweDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBkaWZmZXJlbmNlcyBiZXR3ZWVuIEZpcmVmb3ggYW5kIG90aGVyIGJyb3dzZXJzLlxcclxcbiAqL1xcclxcblxcclxcbmhyIHtcXHJcXG4gIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xcclxcbiAgaGVpZ2h0OiAwO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBDb250YWluIG92ZXJmbG93IGluIGFsbCBicm93c2Vycy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5wcmUge1xcclxcbiAgb3ZlcmZsb3c6IGF1dG87XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3Mgb2RkIGBlbWAtdW5pdCBmb250IHNpemUgcmVuZGVyaW5nIGluIGFsbCBicm93c2Vycy5cXHJcXG4gKi9cXHJcXG5cXHJcXG5jb2RlLFxcclxcbmtiZCxcXHJcXG5wcmUsXFxyXFxuc2FtcCB7XFxyXFxuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XFxyXFxuICBmb250LXNpemU6IDFlbTtcXHJcXG59XFxyXFxuXFxyXFxuLyogRm9ybXNcXHJcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcclxcblxcclxcbi8qKlxcclxcbiAqIEtub3duIGxpbWl0YXRpb246IGJ5IGRlZmF1bHQsIENocm9tZSBhbmQgU2FmYXJpIG9uIE9TIFggYWxsb3cgdmVyeSBsaW1pdGVkXFxyXFxuICogc3R5bGluZyBvZiBgc2VsZWN0YCwgdW5sZXNzIGEgYGJvcmRlcmAgcHJvcGVydHkgaXMgc2V0LlxcclxcbiAqL1xcclxcblxcclxcbi8qKlxcclxcbiAqIDEuIENvcnJlY3QgY29sb3Igbm90IGJlaW5nIGluaGVyaXRlZC5cXHJcXG4gKiAgICBLbm93biBpc3N1ZTogYWZmZWN0cyBjb2xvciBvZiBkaXNhYmxlZCBlbGVtZW50cy5cXHJcXG4gKiAyLiBDb3JyZWN0IGZvbnQgcHJvcGVydGllcyBub3QgYmVpbmcgaW5oZXJpdGVkLlxcclxcbiAqIDMuIEFkZHJlc3MgbWFyZ2lucyBzZXQgZGlmZmVyZW50bHkgaW4gRmlyZWZveCA0KywgU2FmYXJpLCBhbmQgQ2hyb21lLlxcclxcbiAqL1xcclxcblxcclxcbmJ1dHRvbixcXHJcXG5pbnB1dCxcXHJcXG5vcHRncm91cCxcXHJcXG5zZWxlY3QsXFxyXFxudGV4dGFyZWEge1xcclxcbiAgY29sb3I6IGluaGVyaXQ7IC8qIDEgKi9cXHJcXG4gIGZvbnQ6IGluaGVyaXQ7IC8qIDIgKi9cXHJcXG4gIG1hcmdpbjogMDsgLyogMyAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBBZGRyZXNzIGBvdmVyZmxvd2Agc2V0IHRvIGBoaWRkZW5gIGluIElFIDgvOS8xMC8xMS5cXHJcXG4gKi9cXHJcXG5cXHJcXG5idXR0b24ge1xcclxcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEFkZHJlc3MgaW5jb25zaXN0ZW50IGB0ZXh0LXRyYW5zZm9ybWAgaW5oZXJpdGFuY2UgZm9yIGBidXR0b25gIGFuZCBgc2VsZWN0YC5cXHJcXG4gKiBBbGwgb3RoZXIgZm9ybSBjb250cm9sIGVsZW1lbnRzIGRvIG5vdCBpbmhlcml0IGB0ZXh0LXRyYW5zZm9ybWAgdmFsdWVzLlxcclxcbiAqIENvcnJlY3QgYGJ1dHRvbmAgc3R5bGUgaW5oZXJpdGFuY2UgaW4gRmlyZWZveCwgSUUgOC85LzEwLzExLCBhbmQgT3BlcmEuXFxyXFxuICogQ29ycmVjdCBgc2VsZWN0YCBzdHlsZSBpbmhlcml0YW5jZSBpbiBGaXJlZm94LlxcclxcbiAqL1xcclxcblxcclxcbmJ1dHRvbixcXHJcXG5zZWxlY3Qge1xcclxcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIDEuIEF2b2lkIHRoZSBXZWJLaXQgYnVnIGluIEFuZHJvaWQgNC4wLiogd2hlcmUgKDIpIGRlc3Ryb3lzIG5hdGl2ZSBgYXVkaW9gXFxyXFxuICogICAgYW5kIGB2aWRlb2AgY29udHJvbHMuXFxyXFxuICogMi4gQ29ycmVjdCBpbmFiaWxpdHkgdG8gc3R5bGUgY2xpY2thYmxlIGBpbnB1dGAgdHlwZXMgaW4gaU9TLlxcclxcbiAqIDMuIEltcHJvdmUgdXNhYmlsaXR5IGFuZCBjb25zaXN0ZW5jeSBvZiBjdXJzb3Igc3R5bGUgYmV0d2VlbiBpbWFnZS10eXBlXFxyXFxuICogICAgYGlucHV0YCBhbmQgb3RoZXJzLlxcclxcbiAqL1xcclxcblxcclxcbmJ1dHRvbixcXHJcXG5odG1sIGlucHV0W3R5cGU9XFxcImJ1dHRvblxcXCJdLCAvKiAxICovXFxyXFxuaW5wdXRbdHlwZT1cXFwicmVzZXRcXFwiXSxcXHJcXG5pbnB1dFt0eXBlPVxcXCJzdWJtaXRcXFwiXSB7XFxyXFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMiAqL1xcclxcbiAgY3Vyc29yOiBwb2ludGVyOyAvKiAzICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFJlLXNldCBkZWZhdWx0IGN1cnNvciBmb3IgZGlzYWJsZWQgZWxlbWVudHMuXFxyXFxuICovXFxyXFxuXFxyXFxuYnV0dG9uW2Rpc2FibGVkXSxcXHJcXG5odG1sIGlucHV0W2Rpc2FibGVkXSB7XFxyXFxuICBjdXJzb3I6IGRlZmF1bHQ7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSBpbm5lciBwYWRkaW5nIGFuZCBib3JkZXIgaW4gRmlyZWZveCA0Ky5cXHJcXG4gKi9cXHJcXG5cXHJcXG5idXR0b246Oi1tb3otZm9jdXMtaW5uZXIsXFxyXFxuaW5wdXQ6Oi1tb3otZm9jdXMtaW5uZXIge1xcclxcbiAgYm9yZGVyOiAwO1xcclxcbiAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXFxyXFxuLyoqXFxyXFxuICogQWRkcmVzcyBGaXJlZm94IDQrIHNldHRpbmcgYGxpbmUtaGVpZ2h0YCBvbiBgaW5wdXRgIHVzaW5nIGAhaW1wb3J0YW50YCBpblxcclxcbiAqIHRoZSBVQSBzdHlsZXNoZWV0LlxcclxcbiAqL1xcclxcblxcclxcbmlucHV0IHtcXHJcXG4gIGxpbmUtaGVpZ2h0OiBub3JtYWw7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEl0J3MgcmVjb21tZW5kZWQgdGhhdCB5b3UgZG9uJ3QgYXR0ZW1wdCB0byBzdHlsZSB0aGVzZSBlbGVtZW50cy5cXHJcXG4gKiBGaXJlZm94J3MgaW1wbGVtZW50YXRpb24gZG9lc24ndCByZXNwZWN0IGJveC1zaXppbmcsIHBhZGRpbmcsIG9yIHdpZHRoLlxcclxcbiAqXFxyXFxuICogMS4gQWRkcmVzcyBib3ggc2l6aW5nIHNldCB0byBgY29udGVudC1ib3hgIGluIElFIDgvOS8xMC5cXHJcXG4gKiAyLiBSZW1vdmUgZXhjZXNzIHBhZGRpbmcgaW4gSUUgOC85LzEwLlxcclxcbiAqL1xcclxcblxcclxcbmlucHV0W3R5cGU9XFxcImNoZWNrYm94XFxcIl0sXFxyXFxuaW5wdXRbdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxyXFxuICBwYWRkaW5nOiAwOyAvKiAyICovXFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIEZpeCB0aGUgY3Vyc29yIHN0eWxlIGZvciBDaHJvbWUncyBpbmNyZW1lbnQvZGVjcmVtZW50IGJ1dHRvbnMuIEZvciBjZXJ0YWluXFxyXFxuICogYGZvbnQtc2l6ZWAgdmFsdWVzIG9mIHRoZSBgaW5wdXRgLCBpdCBjYXVzZXMgdGhlIGN1cnNvciBzdHlsZSBvZiB0aGVcXHJcXG4gKiBkZWNyZW1lbnQgYnV0dG9uIHRvIGNoYW5nZSBmcm9tIGBkZWZhdWx0YCB0byBgdGV4dGAuXFxyXFxuICovXFxyXFxuXFxyXFxuaW5wdXRbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxyXFxuaW5wdXRbdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xcclxcbiAgaGVpZ2h0OiBhdXRvO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiAxLiBBZGRyZXNzIGBhcHBlYXJhbmNlYCBzZXQgdG8gYHNlYXJjaGZpZWxkYCBpbiBTYWZhcmkgYW5kIENocm9tZS5cXHJcXG4gKiAyLiBBZGRyZXNzIGBib3gtc2l6aW5nYCBzZXQgdG8gYGJvcmRlci1ib3hgIGluIFNhZmFyaSBhbmQgQ2hyb21lXFxyXFxuICogICAgKGluY2x1ZGUgYC1tb3pgIHRvIGZ1dHVyZS1wcm9vZikuXFxyXFxuICovXFxyXFxuXFxyXFxuaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl0ge1xcclxcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7IC8qIDEgKi8gLyogMiAqL1xcclxcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIFJlbW92ZSBpbm5lciBwYWRkaW5nIGFuZCBzZWFyY2ggY2FuY2VsIGJ1dHRvbiBpbiBTYWZhcmkgYW5kIENocm9tZSBvbiBPUyBYLlxcclxcbiAqIFNhZmFyaSAoYnV0IG5vdCBDaHJvbWUpIGNsaXBzIHRoZSBjYW5jZWwgYnV0dG9uIHdoZW4gdGhlIHNlYXJjaCBpbnB1dCBoYXNcXHJcXG4gKiBwYWRkaW5nIChhbmQgYHRleHRmaWVsZGAgYXBwZWFyYW5jZSkuXFxyXFxuICovXFxyXFxuXFxyXFxuaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWNhbmNlbC1idXR0b24sXFxyXFxuaW5wdXRbdHlwZT1cXFwic2VhcmNoXFxcIl06Oi13ZWJraXQtc2VhcmNoLWRlY29yYXRpb24ge1xcclxcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBEZWZpbmUgY29uc2lzdGVudCBib3JkZXIsIG1hcmdpbiwgYW5kIHBhZGRpbmcuXFxyXFxuICovXFxyXFxuXFxyXFxuZmllbGRzZXQge1xcclxcbiAgYm9yZGVyOiAxcHggc29saWQgI2MwYzBjMDtcXHJcXG4gIG1hcmdpbjogMCAycHg7XFxyXFxuICBwYWRkaW5nOiAwLjM1ZW0gMC42MjVlbSAwLjc1ZW07XFxyXFxufVxcclxcblxcclxcbi8qKlxcclxcbiAqIDEuIENvcnJlY3QgYGNvbG9yYCBub3QgYmVpbmcgaW5oZXJpdGVkIGluIElFIDgvOS8xMC8xMS5cXHJcXG4gKiAyLiBSZW1vdmUgcGFkZGluZyBzbyBwZW9wbGUgYXJlbid0IGNhdWdodCBvdXQgaWYgdGhleSB6ZXJvIG91dCBmaWVsZHNldHMuXFxyXFxuICovXFxyXFxuXFxyXFxubGVnZW5kIHtcXHJcXG4gIGJvcmRlcjogMDsgLyogMSAqL1xcclxcbiAgcGFkZGluZzogMDsgLyogMiAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBSZW1vdmUgZGVmYXVsdCB2ZXJ0aWNhbCBzY3JvbGxiYXIgaW4gSUUgOC85LzEwLzExLlxcclxcbiAqL1xcclxcblxcclxcbnRleHRhcmVhIHtcXHJcXG4gIG92ZXJmbG93OiBhdXRvO1xcclxcbn1cXHJcXG5cXHJcXG4vKipcXHJcXG4gKiBEb24ndCBpbmhlcml0IHRoZSBgZm9udC13ZWlnaHRgIChhcHBsaWVkIGJ5IGEgcnVsZSBhYm92ZSkuXFxyXFxuICogTk9URTogdGhlIGRlZmF1bHQgY2Fubm90IHNhZmVseSBiZSBjaGFuZ2VkIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIE9TIFguXFxyXFxuICovXFxyXFxuXFxyXFxub3B0Z3JvdXAge1xcclxcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxufVxcclxcblxcclxcbi8qIFRhYmxlc1xcclxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxyXFxuXFxyXFxuLyoqXFxyXFxuICogUmVtb3ZlIG1vc3Qgc3BhY2luZyBiZXR3ZWVuIHRhYmxlIGNlbGxzLlxcclxcbiAqL1xcclxcblxcclxcbnRhYmxlIHtcXHJcXG4gIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxyXFxuICBib3JkZXItc3BhY2luZzogMDtcXHJcXG59XFxyXFxuXFxyXFxudGQsXFxyXFxudGgge1xcclxcbiAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyIS4vc3JjL3N0eWxlL25vcm1hbGl6ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSgpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLypcXHJcXG4qIEBBdXRob3I6IGxpdWppYWp1blxcclxcbiogQERhdGU6ICAgMjAxNy0wMi0yMSAyMTo1OTo0N1xcclxcbiogQExhc3QgTW9kaWZpZWQgYnk6ICAgbGl1amlhanVuXFxyXFxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTAyLTI2IDE3OjMxOjA2XFxyXFxuKi9cXHJcXG4jd3JhcHBlcntcXHJcXG5cXHR3aWR0aDogMzAwcHg7XFxyXFxuXFx0aGVpZ2h0OiA2MDBweDtcXHJcXG5cXHRtYXJnaW46IDEwcHggYXV0bztcXHJcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjMzMzO1xcclxcblxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG59XFxyXFxuLmJsb2Nre1xcclxcblxcdGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuXFx0cG9zaXRpb246IGFic29sdXRlO1xcclxcblxcdHdpZHRoOiAzMHB4O1xcclxcblxcdGhlaWdodDogMzBweDtcXHJcXG59XFxyXFxuLmJsb2NrLWFjdGl2ZS0we1xcclxcblxcdGJhY2tncm91bmQ6ICM5ZjVmOWY7XFxyXFxufVxcclxcbi5ibG9jay1hY3RpdmUtMntcXHJcXG5cXHRiYWNrZ3JvdW5kOiAjOTNkYjcwO1xcclxcbn1cXHJcXG4uYmxvY2stYWN0aXZlLTN7XFxyXFxuXFx0YmFja2dyb3VuZDogIzdmMDBmZjtcXHJcXG59XFxyXFxuLmJsb2NrLWFjdGl2ZS00e1xcclxcblxcdGJhY2tncm91bmQ6ICM4ZTZiMjM7XFxyXFxufVxcclxcbi5ibG9jay1hY3RpdmUtMXtcXHJcXG5cXHRiYWNrZ3JvdW5kOiAjMjM2YjhlO1xcclxcbn1cXHJcXG4uYmxvY2staW5hY3RpdmV7XFxyXFxuXFx0YmFja2dyb3VuZDogIzcwOTNkYjtcXHJcXG59XFxyXFxuLmJsb2NrLWVsaW1pbmF0ZXtcXHJcXG5cXHRiYWNrZ3JvdW5kOiAjZjAwO1xcclxcbn1cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL34vcG9zdGNzcy1sb2FkZXIhLi9zcmMvc3R5bGUvdGV0cmlzLmNzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG4qIEBBdXRob3I6IGxpdWppYWp1blxyXG4qIEBEYXRlOiAgIDIwMTctMDItMjcgMDk6NDk6MzdcclxuKiBATGFzdCBNb2RpZmllZCBieTogICBsaXVqaWFqdW5cclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTAyLTI3IDEwOjExOjU5XHJcbiovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcbmNvbnN0IEJMT0NLU0laRSAgPSAzMDtcdC8vIOaWueWdl+Wkp+Wwj1xyXG5jb25zdCBTVEVQTEVOR1RIID0gMzA7XHJcblxyXG4vKlxyXG4gKiDmnprkuL7miYDmnInnmoTliJ3lp4vlvaLnirZcclxuICovXHJcbmNvbnN0IEJMT0NLVFlQRSA9IFtcclxuXHRbWzEsMSwxXSxbMSwwLDBdXSxcclxuXHRbWzEsMV0sWzAsMV0sWzAsMV1dLFxyXG5cdFtbMCwwLDFdLFsxLDEsMV1dLFxyXG5cdFtbMSwwXSxbMSwwXSxbMSwxXV0sXHJcblx0W1sxLDEsMF0sIFswLDEsMV1dLFxyXG5cdFtbMCwxXSxbMSwxXSxbMSwwXV0sXHJcblx0W1sxLDEsMV0sIFswLDAsMV1dLFxyXG5cdFtbMCwxXSxbMCwxXSxbMSwxXV0sXHJcblx0W1sxLDAsMF0sWzEsMSwxXV0sXHJcblx0W1sxLDFdLFsxLDBdLFsxLDBdXSxcclxuXHRbWzEsMSwxLDFdXSxcclxuXHRbWzFdLFsxXSxbMV0sWzFdXSxcclxuXHRbWzEsMV0sWzEsMV1dLFxyXG5cdFtbMCwxLDBdLFsxLDEsMV1dLFxyXG5cdFtbMSwwXSxbMSwxXSxbMSwwXV0sXHJcblx0W1sxLDEsMV0sWzAsMSwwXV0sXHJcblx0W1swLDFdLFsxLDFdLCBbMCwxXV0sXHJcblx0W1swLDEsMV0sIFsxLDEsMF1dLFxyXG5cdFtbMSwwXSxbMSwxXSxbMCwxXV1cclxuXTtcclxuXHJcbmV4cG9ydCB7XHJcblx0QkxPQ0tUWVBFLFxyXG5cdEJMT0NLU0laRSxcclxuXHRTVEVQTEVOR1RIXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvY29uZmlnLmpzIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSB0aGlzW2ldO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXN1bHQucHVzaChpdGVtWzFdKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdC5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW87XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9O1xuXHR9LFxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gL21zaWUgWzYtOV1cXGIvLnRlc3Qoc2VsZi5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xuXHR9KSxcblx0Z2V0SGVhZEVsZW1lbnQgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XG5cdH0pLFxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2Vcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XG5cdHZhciBoZWFkID0gZ2V0SGVhZEVsZW1lbnQoKTtcblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGhlYWQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRoZWFkLmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XG5cdHJldHVybiBsaW5rRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG5cdFx0aWYobmV3T2JqKSB7XG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2Rlcztcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yNyAwOTo1MToyNVxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTA6MDQ6MDRcclxuKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBCbG9jayBmcm9tICcuL2Jsb2NrLmpzJztcclxuaW1wb3J0IHtCTE9DS1NJWkUsIEJMT0NLVFlQRX0gZnJvbSAnLi9jb25maWcnO1xyXG5cclxuLyoqXHJcbiAqIOS/hOe9l+aWr+aWueWdl+eUu+adv1xyXG4gKi9cclxuY2xhc3MgVGV0cmlzQXJlYXtcclxuXHRjb25zdHJ1Y3Rvcigpe1xyXG5cdFx0dGhpcy5hY3RpdmVCbG9jayA9IG51bGw7XHQvL2N1cnJlbnQgZHJvcHBpbmctZG93biBibG9ja1xyXG5cclxuXHRcdHRoaXMuZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHR0aGlzLmRpdi5pZCA9ICd3cmFwcGVyJztcclxuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kKHRoaXMuZGl2KTtcclxuXHJcblx0XHR3aW5kb3cub25rZXlkb3duID0gdGhpcy5vbmtleWRvd24uYmluZCh0aGlzKTtcclxuXHJcblx0XHRsZXQgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmRpdik7XHJcblx0XHR0aGlzLndpZHRoID0gcGFyc2VJbnQoc3R5bGUud2lkdGgpO1xyXG5cdFx0dGhpcy5oZWlnaHQgPSBwYXJzZUludChzdHlsZS5oZWlnaHQpO1xyXG5cdFx0dGhpcy5ibG9ja1dpZHRoID0gdGhpcy53aWR0aCAvIEJMT0NLU0laRTtcdC8v5Lul5pa55qC85Z2X5pWw5omA6K6h55qE5a695bqmXHJcblx0XHR0aGlzLmJsb2NrSGVpZ2h0ID0gdGhpcy5oZWlnaHQgLyBCTE9DS1NJWkU7XHJcblxyXG5cdFx0Ly8gdGhpcy5ib3JkZXLooajnpLrmr4/kuIDliJfnmoTmnIDlpKflj6/nlKjpq5jluqbvvIzmlrnlnZfop6bliLDkuYvlkI7lsLHooajnpLrlt7Lnu4/op6blupVcclxuXHRcdC8vIOavj+asoeaWueWdl+inpuW6le+8jOivpeWxnuaAp+mDvemcgOimgemAmui/h3RoaXMuZ2V0Qm9yZGVy5pu05pawXHJcblx0XHR0aGlzLmJvcmRlciA9IFtdO1xyXG5cdFx0dGhpcy5ib3JkZXIubGVuZ3RoID0gdGhpcy5ibG9ja1dpZHRoO1xyXG5cdFx0dGhpcy5ib3JkZXIuZmlsbCh0aGlzLmhlaWdodCk7XHJcblxyXG5cdFx0Ly8gdGhpcy5pbmFjdGl2ZUJsb2Nrc+iusOW9leaOieWIsOW6lemDqOeahOaWueWdl1xyXG5cdFx0Ly8g5YWx5YyF5ZCrdGhpcy5ibG9ja0hlaWdodOS4quaVsOe7hO+8jOavj+S4quaVsOe7hOihqOekuuivpeihjOeahOaJgOacieWwj+aWueWdl1xyXG5cdFx0Ly8g5b2T5p+Q6KGM5omA5oul5pyJ55qE5bCP5pa55Z2X5Liq5pWw562J5LqOdGhpcy5ibG9ja1dpZHRo5pe277yM5raI6Zmk6K+l6KGMXHJcblx0XHR0aGlzLmluYWN0aXZlQmxvY2tzID0gW107XHJcblx0XHQvLyB0aGlzLmluYWN0aXZlQmxvY2tzLmZpbGwoW10pO1x0Ly8g6K+l5pa55rOV6ZSZ6K+v77yM5Zug5Li65piv55So5ZCM5LiA5LiqW13loavlhYXvvIzkuZ/lsLHmmK/or7TmiYDmnInnmoTlrZBpdGVt6YO95piv5oyH5ZCR5ZCM5LiA5Liq56m65pWw57uEXHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja0hlaWdodDsgaSsrKXtcclxuXHRcdFx0dGhpcy5pbmFjdGl2ZUJsb2Nrc1tpXSA9IFtdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuc3RhcnRHYW1lKCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOS6p+eUn+S4i+S4gOS4quaWueagvFxyXG5cdCAqL1xyXG5cdG5ld0FjdGl2ZUJsb2NrKCl7XHJcblx0XHRsZXQgdHlwZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIEJMT0NLVFlQRS5sZW5ndGgpO1xyXG5cdFx0dGhpcy5hY3RpdmVCbG9jayA9IG5ldyBCbG9jayh7XHJcblx0XHRcdGFycjogQkxPQ0tUWVBFW3R5cGVdLFxyXG5cdFx0XHRwYXJlbnQ6IHRoaXNcclxuXHRcdH0pO1xyXG5cdFx0aWYoIXRoaXMuYWN0aXZlQmxvY2suY2FubW92ZSgnZG93bicpKXtcclxuXHRcdFx0YWxlcnQoJ0dhbWUgT3ZlcicpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHR0aGlzLmJsb2NrRHJvcCgpO1x0Ly8g5paw5bu65rS75Yqo5pa55Z2X5LmL5ZCO77yM5rS75Yqo5pa55Z2X5byA5aeL5LiL5Z2gXHJcblx0fVxyXG5cdGRlbGV0ZUFjdGl2ZUJsb2NrKCl7XHJcblx0XHR0aGlzLmFjdGl2ZUJsb2NrID0gbnVsbDtcclxuXHR9XHJcblx0b25rZXlkb3duKGUpe1xyXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdGxldCBrZXkgPSBlLmtleUNvZGU7XHJcblx0XHRsZXQgZGlyZWN0aW9uO1xyXG5cdFx0c3dpdGNoKGtleSl7XHJcblx0XHRcdGNhc2UgMzc6XHJcblx0XHRcdFx0ZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDM4OiAvLyB1cCBrZXlcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAncm90YXRlJztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAzOTpcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAncmlnaHQnO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIDQwOlxyXG5cdFx0XHRcdGRpcmVjdGlvbiA9ICdkb3duJztcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAnbGVmdCc7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0XHR0aGlzLmFjdGl2ZUJsb2NrICYmIHRoaXMuYWN0aXZlQmxvY2suY2FubW92ZShkaXJlY3Rpb24pICYmIHRoaXMuYWN0aXZlQmxvY2subW92ZShkaXJlY3Rpb24pO1xyXG5cdH1cclxuXHRzdGFydEdhbWUoKXtcclxuXHRcdHRoaXMubmV3QWN0aXZlQmxvY2soKTtcclxuXHR9XHJcblx0LyoqXHJcblx0ICog6L+U5Zue5bey57uP6KKr5Y2g6aKG55qE5L2N572uXHJcblx0ICog6K+l6L+U5Zue57uT5p6c5Li65LiA5Liq5pWw57uE77yM6ZW/5bqm5Li6dGhpcy5ibG9ja1dpZHRoLCDmr4/kuKppdGVt6KGo56S65YW25a+55bqU55qE5YiX5Y+v55So55qE5pyA5aSn6auY5bqmXHJcblx0ICogQHJldHVybiB7QXJyYXl9XHJcblx0ICovXHJcblx0Z2V0Qm9yZGVyKCl7XHJcblx0XHR0aGlzLmJvcmRlci5maWxsKHRoaXMuaGVpZ2h0KTtcclxuXHRcdGxldCBpbmFjdGl2ZUJsb2Nrc1NpbSA9IFtdO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaTwgdGhpcy5ibG9ja0hlaWdodDsgaSsrKXtcclxuXHRcdFx0bGV0IGN1cnJlbnRSb3cgPSB0aGlzLmluYWN0aXZlQmxvY2tzW2ldO1xyXG5cdFx0XHRmb3IobGV0IGogPSAwOyBqIDwgY3VycmVudFJvdy5sZW5ndGg7IGorKyl7XHJcblx0XHRcdFx0bGV0IGN1cnJlbnRCbG9jayA9IGN1cnJlbnRSb3dbal07XHJcblx0XHRcdFx0aW5hY3RpdmVCbG9ja3NTaW0ucHVzaCh7XHQvLyDpgY3ljoblubbmoLzlvI/ljJblkI7liqDlhaVpbmFjdGl2ZUJsb2Nrc1NpbeaVsOe7hFxyXG5cdFx0XHRcdFx0bGVmdDogcGFyc2VJbnQoY3VycmVudEJsb2NrLnN0eWxlLmxlZnQpLFxyXG5cdFx0XHRcdFx0dG9wOiBwYXJzZUludChjdXJyZW50QmxvY2suc3R5bGUudG9wKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMuYmxvY2tXaWR0aDsgaSsrKXtcdFx0XHRcclxuXHRcdFx0bGV0IGNvbHVtbkFyciA9IGluYWN0aXZlQmxvY2tzU2ltLmZpbHRlcigoaXRlbSkgPT4ge1x0Ly8g5om+5Ye656ysaeWIl+eahOaJgOacieWFg+e0oFxyXG5cdFx0XHRcdHJldHVybiBpdGVtLmxlZnQgLyBCTE9DS1NJWkUgPT09IGk7XHJcblx0XHRcdH0pXHJcblx0XHRcdGlmKGNvbHVtbkFyci5sZW5ndGggPD0gMCl7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0Y29sdW1uQXJyLnNvcnQoKGEsYikgPT4ge1x0Ly8g5oyJdG9w5LuO5bCP5Yiw5aSn5o6S5bqPXHJcblx0XHRcdFx0cmV0dXJuIGEudG9wIC0gYi50b3A7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjb2x1bW5BcnJbMF0gJiYgKHRoaXMuYm9yZGVyW2ldID0gY29sdW1uQXJyWzBdLnRvcCk7XHQvLyDlpoLmnpzor6XliJfmnInlhYPntKDvvIzmm7TmlrDlj6/nlKjpq5jluqZcclxuXHRcdH1cclxuXHR9XHJcblx0LyoqXHJcblx0ICog5pa55Z2X5LiL5Z2gXHJcblx0ICovXHJcblx0YmxvY2tEcm9wKCl7XHJcblx0XHRsZXQgdGltZW91dDtcclxuXHRcdGxldCB0bUZ1bmN0aW9uID0gKCkgPT4ge1xyXG5cdFx0XHRpZih0aGlzLmFjdGl2ZUJsb2NrICYmIHRoaXMuYWN0aXZlQmxvY2suY2FubW92ZSgnZG93bicpKXtcclxuXHRcdFx0XHR0aGlzLmFjdGl2ZUJsb2NrLm1vdmUoJ2Rvd24nKTtcclxuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dCh0bUZ1bmN0aW9uLCA1MDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2V7XHJcblx0XHRcdFx0dGhpcy5ibG9ja0F0Qm90dG9tKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KHRtRnVuY3Rpb24sIDUwMCk7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOaWueWdl+WIsOi+vuW6lemDqOeahOWkhOeQhuWHveaVsFxyXG5cdCAqL1xyXG5cdGJsb2NrQXRCb3R0b20oKXtcclxuXHRcdGxldCBjdXJyZW50QmxvY2tzID0gdGhpcy5hY3RpdmVCbG9jay5ibG9ja0FycjtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGk8IGN1cnJlbnRCbG9ja3MubGVuZ3RoOyBpKyspe1x0Ly8g5Yiw6L6+5bqV6YOo5ZCO77yM5bCG5b2T5YmN5rS75Yqo5pa55Z2X5YWo6YOo5Yqg5YWlaW5hY3RpdmVCbG9ja3NcclxuXHRcdFx0bGV0IGl0ZW0gPSBjdXJyZW50QmxvY2tzW2ldO1xyXG5cdFx0XHRpdGVtLmNsYXNzTmFtZSA9ICdibG9jayBibG9jay1pbmFjdGl2ZSc7XHJcblx0XHRcdGxldCB0b3BCbG9jayA9IHBhcnNlSW50KGl0ZW0uc3R5bGUudG9wKSAvIEJMT0NLU0laRTtcclxuXHRcdFx0dGhpcy5pbmFjdGl2ZUJsb2Nrc1t0b3BCbG9ja10ucHVzaChpdGVtKTtcclxuXHRcdH1cclxuXHRcdGlmKHRoaXMuY2FsRWxpbmltYXRlKCkpe1x0Ly8g5aaC5p6c5pyJ6KaB5raI6Zmk55qE6KGM77yM562J5b6FMzAwbXPlkI7miafooYzvvIznlZnlh7ozMDBtc+aPkOekuueUqOaIt+acieihjOato+WcqOa2iOmZpFxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHR0aGlzLmdldEJvcmRlcigpO1xyXG5cdFx0XHRcdHRoaXMubmV3QWN0aXZlQmxvY2soKTtcclxuXHRcdFx0fSwgMTAwMCk7XHJcblx0XHR9XHJcblx0XHRlbHNle1xyXG5cdFx0XHR0aGlzLmdldEJvcmRlcigpO1xyXG5cdFx0XHR0aGlzLm5ld0FjdGl2ZUJsb2NrKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOiuoeeul+aYr+WQpuacieaVtOihjOmcgOimgea2iOmZpFxyXG5cdCAqIOW9k+a0u+WKqOaWueWdl+WIsOi+vuW6lemDqOaXtui/kOihjFxyXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59IOaYr+WQpuacieihjOmcgOimgea2iOmZpFxyXG5cdCAqL1xyXG5cdGNhbEVsaW5pbWF0ZSgpe1xyXG5cdFx0bGV0IGZ1bGxXaWR0aCA9IHRoaXMuYmxvY2tXaWR0aCxcclxuXHRcdFx0ZWxpbWluYXRlQ291bnQgPSAwO1xyXG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMuYmxvY2tIZWlnaHQ7IGkrKyl7XHJcblx0XHRcdGxldCBjdXJyZW50Um93ID0gdGhpcy5pbmFjdGl2ZUJsb2Nrc1tpXTtcclxuXHRcdFx0aWYoY3VycmVudFJvdy5sZW5ndGggPT09IGZ1bGxXaWR0aCl7XHQvLyDor6XooYzlt7Lmu6HpnIDopoHmtojpmaRcclxuXHRcdFx0XHR0aGlzLmJlZm9yZUVsaW5pbWF0ZVJvdyhpKTtcdC8vIOaPkOekuueUqOaIt+ivpeihjOWNs+Wwhua2iOmZpFxyXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5lbGluaW1hdGVSb3coaSk7XHJcblx0XHRcdFx0fSwxMDApO1xyXG5cdFx0XHRcdGVsaW1pbmF0ZUNvdW50Kys7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBlbGltaW5hdGVDb3VudCA+IDA7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOa2iOmZpOihjOS5i+WJjemXqueDgVxyXG5cdCAqIEBwYXJhbSAge251bWJlcn0gcm93TnVtIOWvueW6lOeahOihjO+8jOS7juS4iuW+gOS4i+S7jjDooYzlvIDlp4tcclxuXHQgKi9cclxuXHRiZWZvcmVFbGluaW1hdGVSb3cocm93TnVtKXtcclxuXHRcdGxldCBmdWxsV2lkdGggPSB0aGlzLmJsb2NrV2lkdGg7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZnVsbFdpZHRoOyBpKyspe1xyXG5cdFx0XHR0aGlzLmluYWN0aXZlQmxvY2tzW3Jvd051bV1baV0uY2xhc3NOYW1lID0gJ2Jsb2NrIGJsb2NrLWVsaW1pbmF0ZSc7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIOa2iOmZpOihjFxyXG5cdCAqIEBwYXJhbSAge251bWJlcn0gcm93TnVtIOWvueW6lOeahOihjO+8jOS7juS4iuW+gOS4i+S7jjDooYzlvIDlp4tcclxuXHQgKi9cclxuXHRlbGluaW1hdGVSb3cocm93TnVtKXtcclxuXHRcdGxldCBmdWxsV2lkdGggPSB0aGlzLmJsb2NrV2lkdGg7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgZnVsbFdpZHRoOyBpKyspe1xyXG5cdFx0XHR0aGlzLmRpdi5yZW1vdmVDaGlsZCh0aGlzLmluYWN0aXZlQmxvY2tzW3Jvd051bV1baV0pO1x0Ly/np7vpmaTmiYDmnInlhYPntKBcclxuXHRcdH1cclxuXHRcdGZvcihsZXQgaSA9IHJvd051bSAtIDE7IGkgPiAwOyBpLS0pe1x0Ly8g5LiK5pa55omA5pyJ6KGM5LiL56e777yM5bm25pu05pawdGhpcy5pbmFjdGl2ZUJsb2Nrc1xyXG5cdFx0XHRsZXQgY3VycmVudFJvdyA9IHRoaXMuaW5hY3RpdmVCbG9ja3NbaV07XHJcblx0XHRcdGZvcihsZXQgaiA9IDA7IGogPCBjdXJyZW50Um93Lmxlbmd0aDsgaisrKXtcclxuXHRcdFx0XHRjdXJyZW50Um93W2pdLnN0eWxlLnRvcCA9IChwYXJzZUludChjdXJyZW50Um93W2pdLnN0eWxlLnRvcCkgKyBCTE9DS1NJWkUgKSsgJ3B4JztcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLmluYWN0aXZlQmxvY2tzW2kgKyAxXSA9IGN1cnJlbnRSb3c7XHJcblx0XHR9XHJcblx0XHR0aGlzLmluYWN0aXZlQmxvY2tzWzBdID0gW107XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUZXRyaXNBcmVhO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9qcy90ZXRyaXNBcmVhLmpzIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9pbmRleC5qcyEuL25vcm1hbGl6ZS5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIHt9KTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vbm9ybWFsaXplLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vbm9ybWFsaXplLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3R5bGUvbm9ybWFsaXplLmNzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2luZGV4LmpzIS4vdGV0cmlzLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwge30pO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi90ZXRyaXMuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvaW5kZXguanMhLi90ZXRyaXMuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdHlsZS90ZXRyaXMuY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXHJcbiogQEF1dGhvcjogbGl1amlhanVuXHJcbiogQERhdGU6ICAgMjAxNy0wMi0yNyAwOTo1MDozNlxyXG4qIEBMYXN0IE1vZGlmaWVkIGJ5OiAgIGxpdWppYWp1blxyXG4qIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDItMjcgMTA6MDQ6MTFcclxuKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuaW1wb3J0IHtCTE9DS1NJWkUsIFNURVBMRU5HVEh9IGZyb20gJy4vY29uZmlnLmpzJztcclxuLyoqXHJcbiAqIEJMT0NL57G777yM5q+P5LiqQkxPQ0vkuK3ljIXlkKvlpJrkuKrlsI/mlrnlnZdcclxuICovXHJcbmNsYXNzIEJsb2Nre1xyXG5cdGNvbnN0cnVjdG9yKHBhcmFtcyl7XHJcblx0XHR0aGlzLmFyciA9IHBhcmFtcy5hcnI7XHQvLyBCbG9ja+aVsOe7hO+8jOihqOekuuivpeaWueWdl+eahOW9oueKtlxyXG5cdFx0dGhpcy5wYXJlbnQgPSBwYXJhbXMucGFyZW50O1x0Ly8g54i25a+56LGhXHJcblx0XHR0aGlzLmhlaWdodCA9IHRoaXMuYXJyLmxlbmd0aCAqIEJMT0NLU0laRTtcclxuXHRcdHRoaXMud2lkdGggPSB0aGlzLmFyclswXS5sZW5ndGggKiBCTE9DS1NJWkU7XHJcblx0XHR0aGlzLmJsb2NrQXJyID0gW107XHJcblx0XHQvLyDmtoLmlrnlnZdcclxuXHRcdHRoaXMuX2RyYXcoMCwgMCk7XHRcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5qC55o2uYXJy55S75Ye66K+l5pa55Z2X77yMW1sxLDBdLFsxLDFd6KGo56S65LiA5LiqMioy5pa55Z2X77yM5L2G5piv56ys5LiA6KGM56ys5LqM5Liq5Li656m6XHJcblx0ICogQHBhcmFtIHtudW1iZXJ9IG9yaWdpblRvcCDmlrnlnZfnmoTotbflp4vngrlcclxuXHQgKiBAcGFyYW0ge251bWJlcn0gb3JpZ2luTGVmdCDmlrnlnZfnmoTotbflp4vngrlcclxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3JpZ2luQ2xhc3Mg5piv5ZCm5piv6YeN57uY5peL6L2s5pa55Z2X77yM5aaC5p6c5piv77yM5L+d5oyBY2xhc3NOYW1l5LiN5Y+YXHJcblx0ICovXHJcblx0X2RyYXcob3JpZ2luVG9wLCBvcmlnaW5MZWZ0LCBvcmlnaW5DbGFzcyl7XHJcblx0XHRsZXQgaGVpZ2h0ID0gdGhpcy5hcnIubGVuZ3RoLFxyXG5cdFx0ICAgIHdpZHRoID0gdGhpcy5hcnJbMF0ubGVuZ3RoLFxyXG5cdFx0ICAgIHRtcENsYXNzTmFtZSA9IG9yaWdpbkNsYXNzID8gb3JpZ2luQ2xhc3MgOiAnYmxvY2sgYmxvY2stYWN0aXZlLScgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNSk7XHJcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgaGVpZ2h0OyBpKyspXHJcblx0XHRcdGZvcihsZXQgaiA9IDA7IGogPCB3aWR0aDsgaisrKXtcclxuXHRcdFx0XHRpZih0aGlzLmFycltpXVtqXSA9PSAxKXtcclxuXHRcdFx0XHRcdGxldCBzdWJCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0XHRcdFx0c3ViQmxvY2suY2xhc3NOYW1lID0gdG1wQ2xhc3NOYW1lO1xyXG5cdFx0XHRcdFx0c3ViQmxvY2suc3R5bGUubGVmdCA9IChqICogQkxPQ0tTSVpFICsgb3JpZ2luTGVmdCkgKyAncHgnO1xyXG5cdFx0XHRcdFx0c3ViQmxvY2suc3R5bGUudG9wID0gKGkgKiBCTE9DS1NJWkUgKyBvcmlnaW5Ub3ApICsgJ3B4JztcclxuXHRcdFx0XHRcdHRoaXMuYmxvY2tBcnIucHVzaChzdWJCbG9jayk7XHJcblx0XHRcdFx0XHR0aGlzLnBhcmVudC5kaXYuYXBwZW5kQ2hpbGQoc3ViQmxvY2spO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDmlrnlnZfov5vooYzml4vovaxcclxuXHQgKiDkv53mjIHmlbTkvZPlt6bkuIrop5LkuI3lj5hcclxuXHQgKi9cclxuXHRfcm90YXRlKCl7XHJcblx0XHRpZih0aGlzLmJsb2NrQXJyLmxlbmd0aCA8PSAwKXtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Ly8g5peL6L2s5pe25bem5LiK6KeS55qE5L2N572uXHJcblx0XHRsZXQgbGVmdCA9IHBhcnNlSW50KHRoaXMuYmxvY2tBcnJbMF0uc3R5bGUubGVmdCk7XHJcblx0XHRsZXQgdG9wID0gcGFyc2VJbnQodGhpcy5ibG9ja0FyclswXS5zdHlsZS50b3ApO1xyXG5cdFx0bGV0IG9yaWdpbkNsYXNzID0gdGhpcy5ibG9ja0FyclswXS5jbGFzc05hbWU7XHJcblx0XHQvLyDnp7vpmaTljp/mnaXnmoTmiYDmnInlsI/mlrnmoLxcclxuXHRcdGZvcihsZXQgaSA9IDAsIGxlbiA9IHRoaXMuYmxvY2tBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG5cdFx0XHR0aGlzLnBhcmVudC5kaXYucmVtb3ZlQ2hpbGQodGhpcy5ibG9ja0FycltpXSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLmJsb2NrQXJyLmxlbmd0aCA9IDA7XHJcblxyXG5cdFx0dGhpcy5hcnIgPSB0aGlzLl9yb3RhdGVBcnIodGhpcy5hcnIpOy8vIOaXi+i9rFxyXG5cdFx0dGhpcy5fZHJhdyh0b3AsIGxlZnQsIG9yaWdpbkNsYXNzKTsvLyDph43mlrDnu5jliLZcclxuXHR9XHJcblx0LyoqXHJcblx0ICog5pWw57uE6L+b6KGM6aG65pe26ZKI5peL6L2sXHJcblx0ICovXHJcblx0X3JvdGF0ZUFycigpe1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0bGV0IGhlaWdodCA9IHRoaXMuYXJyLmxlbmd0aCxcclxuXHRcdCAgICB3aWR0aCA9IHRoaXMuYXJyWzBdLmxlbmd0aDtcclxuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB3aWR0aDsgaSsrKXtcclxuXHRcdFx0bGV0IHRlbXBBcnIgPSBbXTtcclxuXHRcdFx0Zm9yKGxldCBqID0gaGVpZ2h0IC0gMTsgaiA+PSAwOyBqLS0pe1xyXG5cdFx0XHRcdHRlbXBBcnIucHVzaCh0aGlzLmFycltqXVtpXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YXJyLnB1c2godGVtcEFycik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYXJyO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiDliKTmlq3ljZXkuKrlsI/mlrnlnZfmmK/lkKblj6/ku6XlkJHmn5DmlrnlkJHnp7vliqhcclxuXHQgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGl0ZW0g6K+l5bCP5pa55Z2X55qE5byV55SoXHJcblx0ICogQHBhcmFtICB7c3RyaW5nfSBkaXJlY3Rpb24g56e75Yqo5pa55ZCRXHJcblx0ICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgIOaYr+WQpuWPr+S7peenu+WKqFxyXG5cdCAqL1xyXG5cdF9jYW5TaW5nbGVNb3ZlKGl0ZW0sIGRpcmVjdGlvbil7XHJcblx0XHRsZXQgbGVmdEJsb2NrID0gcGFyc2VJbnQoaXRlbS5zdHlsZS5sZWZ0KSAvIEJMT0NLU0laRTtcdC8v6K+l5bCP5pa55Z2X5a+55bqU55qE5YiX5pWwXHJcblx0XHRsZXQgYm90dG9tID0gcGFyc2VJbnQoaXRlbS5zdHlsZS50b3ApICsgQkxPQ0tTSVpFO1x0Ly8g6K+l5bCP5pa55Z2X55qE5bqV6YOo5L2N572uXHJcblx0XHRzd2l0Y2goZGlyZWN0aW9uKXtcclxuXHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2sgLSAxXSAmJiAoYm90dG9tIDw9IHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2sgLSAxXSk7XHJcblx0XHRcdGNhc2UgJ3JpZ2h0JzpcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayArIDFdICYmIChib3R0b20gPD0gdGhpcy5wYXJlbnQuYm9yZGVyW2xlZnRCbG9jayArIDFdKTtcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucGFyZW50LmJvcmRlcltsZWZ0QmxvY2tdICYmICgoYm90dG9tICsgQkxPQ0tTSVpFKSA8PSB0aGlzLnBhcmVudC5ib3JkZXJbbGVmdEJsb2NrXSk7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDliKTmlq3mmK/lkKblj6/ku6Xml4vovaxcclxuXHQgKi9cclxuXHRfY2FuUm90YXRlKCl7XHJcblx0XHRsZXQgYWZ0ZXJBcnIgPSB0aGlzLl9yb3RhdGVBcnIodGhpcy5hcnIpO1xyXG5cdFx0bGV0IGxlZnRCbG9jayA9IHBhcnNlSW50KHRoaXMuYmxvY2tBcnJbMF0uc3R5bGUubGVmdCkgLyBCTE9DS1NJWkU7XHJcblx0XHRsZXQgdG9wQmxvY2sgPSBwYXJzZUludCh0aGlzLmJsb2NrQXJyWzBdLnN0eWxlLnRvcCkgLyBCTE9DS1NJWkU7XHJcblx0XHRmb3IobGV0IGkgPSAwLCBsZW4xID0gYWZ0ZXJBcnIubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKXtcdC8vIOmAkOS4quWIpOaWreaXi+i9rOS5i+WQjueahOS9jee9ruaYr+WQpui2hei/h+i+ueeVjFxyXG5cdFx0XHRsZXQgY3VycmVudFJvdyA9IGFmdGVyQXJyW2ldO1xyXG5cdFx0XHRmb3IobGV0IGogPSAwLCBsZW4yID0gY3VycmVudFJvdy5sZW5ndGg7IGogPCBsZW4yOyBqKyspe1xyXG5cdFx0XHRcdGxldCBjdXJyZW50TGVmdCA9IGxlZnRCbG9jayArIGosXHJcblx0XHRcdFx0ICAgIGN1cnJlbnRCb3R0b20gPSB0b3BCbG9jayArIGkgKyAxO1xyXG5cdFx0XHRcdGlmKGN1cnJlbnRMZWZ0IDwgMCB8fCBjdXJyZW50TGVmdCA+PSB0aGlzLnBhcmVudC5ibG9ja1dpZHRoKXtcdC8vIOi2heWHuuWuveW6plxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihjdXJyZW50Qm90dG9tIDwgMSB8fCBjdXJyZW50Qm90dG9tID49IHRoaXMucGFyZW50LmJsb2NrSGVpZ2h0KXsgLy8g6LaF5Ye66auY5bqmXHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKGN1cnJlbnRCb3R0b20gPiAodGhpcy5wYXJlbnQuYm9yZGVyW2N1cnJlbnRMZWZ0XSAvIEJMT0NLU0laRSkpeyAvLyDotoXlh7rlj6/nlKjpq5jluqZcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHQvKipcclxuXHQgKiDliKTmlq3lvZPliY3mtLvliqjmlrnlnZfmmK/lkKblj6/ku6Xnp7vliqhcclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGRpcmVjdGlvbiDnp7vliqjmlrnlkJFcclxuXHQgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAg5piv5ZCm5Y+v5Lul56e75YqoXHJcblx0ICovXHJcblx0Y2FubW92ZShkaXJlY3Rpb24pe1xyXG5cdFx0aWYoZGlyZWN0aW9uID09PSAncm90YXRlJyl7XHQvLyDlpoLmnpzmmK/ml4vovaxcclxuXHRcdFx0cmV0dXJuIHRoaXMuX2NhblJvdGF0ZSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHRoaXMuYmxvY2tBcnIuZXZlcnkoKGl0ZW0pID0+IHtcdC8vIOWIpOaWreWMheWQq+eahOavj+S4gOS4quWwj+aWueWdl+aYr+WQpuWPr+S7peenu+WKqFxyXG5cdFx0XHRcdHJldHVybiB0aGlzLl9jYW5TaW5nbGVNb3ZlKGl0ZW0sIGRpcmVjdGlvbilcclxuXHRcdFx0fSk7XHJcblx0XHR9XHRcdFxyXG5cdH1cclxuXHQvKipcclxuXHQgKiDov5vooYznp7vliqhcclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGRpcmVjdGlvbiDnp7vliqjmlrnlkJFcclxuXHQgKi9cclxuXHRtb3ZlKGRpcmVjdGlvbil7XHJcblx0XHRzd2l0Y2goZGlyZWN0aW9uKXtcclxuXHRcdFx0Y2FzZSAnbGVmdCc6XHJcblx0XHRcdFx0dGhpcy5ibG9ja0Fyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0XHRpdGVtLnN0eWxlLmxlZnQgPSAocGFyc2VJbnQoaXRlbS5zdHlsZS5sZWZ0KSAtIFNURVBMRU5HVEgpICsgJ3B4JztcclxuXHRcdFx0XHR9KTtcdFx0XHRcdFxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdyaWdodCc6XHJcblx0XHRcdFx0dGhpcy5ibG9ja0Fyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0XHRpdGVtLnN0eWxlLmxlZnQgPSAocGFyc2VJbnQoaXRlbS5zdHlsZS5sZWZ0KSArIFNURVBMRU5HVEgpICsgJ3B4JztcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZG93bic6XHJcblx0XHRcdFx0dGhpcy5ibG9ja0Fyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdFx0XHRpdGVtLnN0eWxlLnRvcCA9IChwYXJzZUludChpdGVtLnN0eWxlLnRvcCkgKyBTVEVQTEVOR1RIKSArICdweCc7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3JvdGF0ZSc6XHJcblx0XHRcdFx0dGhpcy5fcm90YXRlKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBCbG9jaztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvYmxvY2suanMiLCIvKlxyXG4qIEBBdXRob3I6IGxpdWppYWp1blxyXG4qIEBEYXRlOiAgIDIwMTctMDItMjEgMjI6MjI6NTJcclxuKiBATGFzdCBNb2RpZmllZCBieTogICBsaXVqaWFqdW5cclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTAyLTI3IDEwOjE0OjEyXHJcbiovXHJcblxyXG5pbXBvcnQgVGV0cmlzQXJlYSBmcm9tICcuL3RldHJpc0FyZWEnO1xyXG5yZXF1aXJlKCcuLi9zdHlsZS9ub3JtYWxpemUuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL3N0eWxlL3RldHJpcy5jc3MnKTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdGxldCB0ZXRyaXNBcmVhID0gbmV3IFRldHJpc0FyZWEoKTtcclxuXHR9LDEwMCk7XHJcblx0XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvanMvbWFpbi5qcyJdLCJzb3VyY2VSb290IjoiIn0=