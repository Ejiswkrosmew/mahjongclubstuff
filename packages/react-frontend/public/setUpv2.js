function Canvas(num) {
	var thisObj = this;
	//Image Editing/ImageData to Image conversion Canvas
	var imgCanvas = document.createElement("CANVAS");
	var imgCtx = imgCanvas.getContext("2d");
	imgCtx.save();
	//Canvas/Context Definition
	this.canvas = document.getElementsByTagName("CANVAS")[num];
	this.ctx = this.canvas.getContext("2d");
	//Request Animation Frame for updating
	this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	//A timer that will keep track of how many frames have passed.
	this.timer = 0;
	this.startTime = Date.now();
	this.maximumRender = 60; //Limits how many renders a single frame can preform
	//Where images are stored (spritesheets and regular) *DO NOT GIVER A SPRITESHEET THE SAME EXACT NAME AS A LOADED IMAGE
	this.spritesheets = {};
	this.loadedImages = {};
	//All of the sprites that have are currently existing
	this.sprites = {};
	this.spriteLoadOrder = [];
	//Stuff that holds waitForFrames() and repeatFrames();
	this.frameEvents = [];
	this.currentFrameEventID = 0;
	//preloadImage Array (true = not complete, false = complete)
	this.preloadImageArray = {
		result: false,
		update: function () {
			var start = true;
			Object.keys(this).forEach(function (key) {
				var value = this[key]
				if (key != "result" && key != "update" && value) {
					this.result = true;
					start = false;
				}
				return;
			}, this)
			if (start) this.result = false;
		}
	};
	this.backgroundColor = "transparent";
	this.imageSmoothing = true;
	//Default Background
	this.ctx.fillStyle = thisObj.backgroundColor
	this.ctx.fillRect(0, 0, thisObj.canvas.width, thisObj.canvas.height);

	this.getImageData = function (name) {
		var image = thisObj.loadedImages[name];
		imgCanvas.width = image.width;
		imgCanvas.height = image.height;
		imgCtx.drawImage(image, 0, 0);
		var imageData = new ImageData(imgCtx.getImageData(0, 0, imgCanvas.width, imgCanvas.height).data, imgCanvas.width, imgCanvas.height);
		imgCtx.restore();
		imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
		return imageData;
	}.bind(this)

	this.getSpritesheetImageData = function (name) {
		var image = thisObj.spritesheets[name].img;
		imgCanvas.width = image.width;
		imgCanvas.height = image.height;
		imgCtx.drawImage(image, 0, 0);
		var imageData = new ImageData(imgCtx.getImageData(0, 0, imgCanvas.width, imgCanvas.height).data, imgCanvas.width, imgCanvas.height);
		imgCtx.restore();
		imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
		return imageData;
	}

	//Loads an image to loadedImages
	this.loadImage = function (src, name) {
		thisObj.loadedImages[name] = new Image();
		thisObj.loadedImages[name].src = src;
		this.preloadImage(name)
	}

	this.loadImageData = function (imageData, name) {
		imgCanvas.width = imageData.width;
		imgCanvas.height = imageData.height;
		imgCtx.putImageData(imageData, 0, 0);
		thisObj.loadedImages[name] = new Image();
		thisObj.loadedImages[name].src = imgCanvas.toDataURL();
		imgCtx.restore();
		imgCtx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
		this.preloadImage(name)
	}

	//Creates an image (regular sprite)
	this.createImage = function (x, y, srcName, id, width, height, attributes) {
		//If the name isn't valid, abort (you can't name it undefined)
		if (typeof id != "string") {
			console.log("Error: \"" + id + "\" is not a valid name");
			return;
		}
		//Get image for the sprite
		var img = thisObj.loadedImages[srcName];
		//If the image is loaded, get the width and height values
		if (img.complete) {
			//If neither are provided, use the default height and width
			if (!width && !height) {
				width = img.naturalWidth;
				height = img.naturalHeight;
			}
			//If one is provided, scale the other to the original image.
			else if (!width != !height) {
				if (!height) height = width / (img.naturalWidth / img.naturalHeight);
				if (!width) width = height / (img.naturalHeight / img.naturalWidth);
			}
		} else {
			//If this comes up, something went wrong
			console.log("something broke")
		}
		attributes = attributes || {};
		//return statement that allows the user to edit the sprite via a variable
		return function () {
			//Create the sprite object inside the sprite array
			thisObj.sprites[id] = new function () {
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.srcName = srcName;
				this.img = img;
				this.velocityX = attributes.velocityX || 0;
				this.velocityY = attributes.velocityY || 0;
				this.alpha = attributes.alpha || 1;
				this.degrees = attributes.degrees || 0;
				this.smoothing = attributes.smoothing;
				this.imageType = "sprite"
				this.id = id;
				this.onclick = function () { }
				this.onmousedown = function () { }
				this.onmouseup = function () { }
				this.moveToTop = function () {
					if (thisObj.spriteLoadOrder.indexOf(id) < 0) return;
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1);
					thisObj.spriteLoadOrder.push(id)
				}
				this.kill = function () {
					if (!thisObj.sprites[id]) return;
					delete thisObj.sprites[id];
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1);
					this.kill = function () { };
				}
				this.updateSprite = function () {
					if (!this.img.complete) return;
					var _this = this;
					this.x += this.velocityX / 60;
					this.y += this.velocityY / 60;
					thisObj.ctx.globalAlpha = this.alpha;
					thisObj.ctx.globalAlpha = 1;
				}
				this.switchTextures = function (srcName) {
					var widthScale = this.width / this.img.naturalWidth;
					var heightScale = this.height / this.img.naturalHeight;
					this.srcName = srcName;
					this.img = thisObj.loadedImages[srcName];
					this.width = this.img.naturalWidth * widthScale;
					this.height = this.img.naturalHeight * heightScale;
				}
			}
			if (thisObj.spriteLoadOrder.find(sprite => sprite == id)) {
				var e = new Error("Sprite is being loaded twice");
				console.log(e);
			}
			//Make the sprite be the last one to be created so that it's on top
			thisObj.spriteLoadOrder.push(id);
			//Return the sprite object inside the array to be able to edit the object with a variable
			return thisObj.sprites[id];
		}()
	}

	this.loadSpritesheet = function (width, height, src, name) {
		thisObj.spritesheets[name] = { width: width, height: height, img: new Image() };
		thisObj.spritesheets[name].img.src = src;
		this.preloadImage(name)
	}

	this.loadSpritesheetImageData = function (width, height, imageData, name) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = imageData.width;
		canvas.height = imageData.height;
		ctx.putImageData(imageData, 0, 0);
		thisObj.spritesheets[name] = { width: width, height: height, img: new Image() };
		thisObj.spritesheets[name].img.src = canvas.toDataURL();
		thisObj.spritesheets[name].framesX = Math.floor(imageData.width / thisObj.spritesheets[name].width);
		thisObj.spritesheets[name].framesY = Math.floor(imageData.height / thisObj.spritesheets[name].height);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.preloadImage(name)
	}

	this.createSpritesheetImage = function (x, y, srcName, id, frame, width, height, attributes) {
		//If the name isn't valid, abort (you can't name it undefined)
		if (typeof id != "string") {
			console.log("Error: '" + id + "' is not a valid name");
			return;
		}
		//If the frame isn't defined, set it to 0
		frame = frame || 0;
		//Get the spritesheet which contains the image and the width and height of one sprite
		var spritesheet = thisObj.spritesheets[srcName];
		//If the spritesheet is loaded, get how many frames there are horizontally and vertically
		if (spritesheet.img.complete) {
			if (!spritesheet.framesX || !spritesheet.framesY) {
				thisObj.spritesheets[srcName].framesX = Math.floor(thisObj.spritesheets[srcName].img.naturalWidth / thisObj.spritesheets[srcName].width);
				thisObj.spritesheets[srcName].framesY = Math.floor(thisObj.spritesheets[srcName].img.naturalHeight / thisObj.spritesheets[srcName].height);
			}
			//Get the width and height values
			//If neither are provided, make the values the default values
			if (!width && !height) {
				width = spritesheet.width;
				height = spritesheet.height;
			}
			//If one is provided, set the other one to scale using the one provided
			else if (!width != !height) {
				if (!height) height = width / (thisObj.spritesheets[srcName].width / thisObj.spritesheets[srcName].height);
				if (!width) width = height / (thisObj.spritesheets[srcName].height / thisObj.spritesheets[srcName].width);
			}
		}
		attributes = attributes || {};
		//return statement that allows the user to edit the sprite object via a variable.
		return function () {
			thisObj.sprites[id] = new function () {
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.id = id;
				this.srcName = srcName;
				this.spritesheet = spritesheet;
				this.velocityX = attributes.velocityX || 0;
				this.velocityY = attributes.velocityY || 0;
				this.alpha = attributes.alpha || 1;
				this.degrees = attributes.degrees || 0;
				this.smoothing = attributes.smoothing;
				this.imageType = "spritesheet";
				this.frame = frame;
				this.animations = {};
				this.animationPause = false;
				this.onclick = function () { }
				this.onmousedown = function () { }
				this.onmouseup = function () { }
				this.moveToTop = function () {
					if (thisObj.spriteLoadOrder.indexOf(id) < 0) return;
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1)
					thisObj.spriteLoadOrder.push(id)
				}
				this.kill = function () {
					if (!thisObj.sprites[id]) return;
					if (thisObj.sprites[id].stopAnimation) thisObj.sprites[id].stopAnimation();
					delete thisObj.sprites[id];
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1)
					this.kill = function () { };
				}
				this.updateSprite = function () {
					if (!this.spritesheet.img.complete) return;
					this.x += this.velocityX / 60;
					this.y += this.velocityY / 60;
				}
				this.switchTextures = function (srcName) {
					var widthScale = this.width / this.spritesheet.width;
					var heightScale = this.height / this.spritesheet.height;
					this.srcName = srcName;
					this.spritesheet = thisObj.spritesheets[srcName];
					this.width = this.spritesheet.width * widthScale;
					this.height = this.spritesheet.height * heightScale;
					this.framesX = Math.floor(this.spritesheet.img.naturalWidth / this.spritesheet.width)
					this.framesY = Math.floor(this.spritesheet.img.naturalHeight / this.spritesheet.height)
				}
				this.createAnimation = function (name, frames, fps, repeat) {
					this.animations[name] = { frames: frames, fps: fps, repeat: repeat };
				}
				this.animate = function (name) {
					var _this = this;
					if (!this.spritesheet.img.complete) {
						var tempFunction = this.spritesheet.img.onload || function () { };
						this.spritesheet.img.onload = function () {
							tempFunction();
							runAnimation();
						};
					}
					else runAnimation();

					function runAnimation() {
						var animation = _this.animations[name]
						_this.animationIndex = 1;
						_this.animationRunning = true;

						if (!_this.animations[name]) return;
						_this.frame = animation.frames[0];
						var startTime = thisObj.timer;
						var pauseTime;
						_this.animation = function () {
							if (_this.animationPause) return;
							while (thisObj.timer - startTime >= _this.animationIndex * 60 / animation.fps) {
								if (_this.animationIndex >= animation.frames.length) {
									if (!animation.repeat) {
										_this.animationRunning = false;
										return;
									}
									_this.animationIndex -= animation.frames.length;
									startTime = thisObj.timer;
								};
								_this.frame = animation.frames[_this.animationIndex]
								_this.animationIndex++;
							}
							thisObj.waitForFrames(_this.animation, 0);
						}
						_this.pauseAnimation = function () {
							_this.animationPause = true;
							pauseTime = thisObj.timer - startTime + 1;
						}
						_this.resumeAnimation = function () {
							startTime = thisObj.timer - (pauseTime || 0);
							_this.animationPause = false;
							_this.animation();
						}
						_this.stopAnimation = function () {
							_this.animation = function () { };
							_this.animationPause = false;
							_this.animationRunning = false;
						}
						_this.skipAnimationFrames = function (num) {
							startTime -= num * 60 / animation.fps;
							pauseTime += num * 60 / animation.fps;
							_this.animationIndex += num;
						}
						thisObj.waitForFrames(_this.animation, 0);
					}
				}
			}
			if (thisObj.spriteLoadOrder.find(sprite => sprite == id)) {
				var e = new Error("Sprite is being loaded twice");
				console.log(e);
			}
			thisObj.spriteLoadOrder.push(id)
			return thisObj.sprites[id];
		}();
	}

	this.createRect = function (x, y, id, width, height, attributes) {
		attributes = attributes || {};
		return (function () {
			thisObj.sprites[id] = new function () {
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.strokeWidth = attributes.strokeWidth || 2;
				this.strokeColor = attributes.strokeColor || "#000";
				this.fillColor = attributes.fillColor || "transparent";
				this.id = id;
				this.velocityX = attributes.velocityX || 0;
				this.velocityY = attributes.velocityY || 0;
				this.alpha = attributes.alpha || 1;
				this.degrees = attributes.degrees || 0;
				this.imageType = "rect";
				this.onclick = function () { };
				this.onmousedown = function () { }
				this.onmouseup = function () { }
				this.moveToTop = function () {
					if (thisObj.spriteLoadOrder.indexOf(id) < 0) return;
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1)
					thisObj.spriteLoadOrder.push(id)
				};
				this.kill = function () {
					delete thisObj.sprites[id];
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1)
					this.kill = function () { };
				};
				this.draw = function () {
					var width = Math.abs(this.width);
					var height = Math.abs(this.height);
					thisObj.ctx.lineWidth = this.strokeWidth || 1;
					thisObj.ctx.strokeStyle = this.strokeColor || "#000";
					thisObj.ctx.strokeRect(-width / 2, -height / 2, width, height);
					thisObj.ctx.fillStyle = this.fillColor;
					var offset = this.strokeWidth / 2
					thisObj.ctx.fillRect(-width / 2 + offset, -height / 2 + offset, width - this.strokeWidth, height - this.strokeWidth);
				};
			};
			thisObj.spriteLoadOrder.push(id);
			return thisObj.sprites[id];
		})();
	}

	this.createText = function (x, y, id, text, attributes) {
		attributes = attributes || {};
		return (function () {
			thisObj.sprites[id] = new function () {
				this.x = x;
				this.y = y;
				this.text = text;
				this.font = attributes.font || "24px Arial";
				this.color = attributes.color || "black";
				this.textAlign = attributes.align || "initial";
				this.baseline = attributes.baseline || "alphabetic";
				this.id = id;
				this.velocityX = 0;
				this.velocityY = 0;
				this.alpha = 1;
				this.degrees = attributes.degrees || 0;
				this.imageType = "text";
				this.onclick = function () { };
				this.onmousedown = function () { }
				this.onmouseup = function () { }
				this.moveToTop = function () {
					if (thisObj.spriteLoadOrder.indexOf(id) < 0) return;
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1)
					thisObj.spriteLoadOrder.push(id)
				};
				this.kill = function () {
					delete thisObj.sprites[id];
					thisObj.spriteLoadOrder.splice(thisObj.spriteLoadOrder.indexOf(id), 1)
					this.kill = function () { };
				};
				this.draw = function () {
					thisObj.ctx.font = this.font;
					thisObj.ctx.fillStyle = this.color;
					thisObj.ctx.textAlign = this.textAlign;
					thisObj.ctx.textBaseline = this.baseline;
					var textLength = thisObj.ctx.measureText(this.text);
					thisObj.ctx.fillText(this.text, 0, 0);
				};
			};
			thisObj.spriteLoadOrder.push(id);
			return thisObj.sprites[id];
		})();
	}

	//Update function declared to solve errors
	this.update = function () { }

	//Render function which renders all of the sprites into the canvas
	this.render = function () {
		var eventsToKill = [];
		var tempFrameEvents = [].concat(thisObj.frameEvents);
		tempFrameEvents.forEach(function (frameEventObj) {
			if (frameEventObj.pause) return;
			var repeatValue = frameEventObj.repeatValue;
			if (frameEventObj.endCondition && eval(frameEventObj.endCondition)) {
				frameEventObj.endFunction();
				eventsToKill.push(frameEventObj)
			} else {
				if (frameEventObj.currentFrame >= frameEventObj.frames) {
					frameEventObj.callback();
					frameEventObj.currentFrame = 0;
					if (!frameEventObj.repeat) {
						eventsToKill.push(frameEventObj)
					}
					else frameEventObj.repeatValue++;
				}
				else {
					frameEventObj.currentFrame++;
				}
			}
		})
		eventsToKill.forEach(function (frameEventObj) {
			if (frameEventObj) frameEventObj.killEvent();
		})
		thisObj.update();
		// Store the current transformation matrix
		thisObj.ctx.save();

		// Use the identity matrix while clearing the canvas
		thisObj.ctx.setTransform(1, 0, 0, 1, 0, 0);
		thisObj.ctx.clearRect(0, 0, thisObj.canvas.width, thisObj.canvas.height);

		// Restore the transform
		thisObj.ctx.restore();
		thisObj.ctx.fillStyle = thisObj.backgroundColor
		thisObj.ctx.fillRect(0, 0, thisObj.canvas.width, thisObj.canvas.height);
		thisObj.spriteLoadOrder.forEach(function (key) {
			(() => {
				if (!thisObj.sprites[key]) console.log("Error: Sprite " + key + " does not exist but is being loaded", thisObj.spriteLoadOrder);
				return thisObj.sprites[key].updateSprite || function () { };
			})();
		})
		//Plan to do collisions here (currently don't work)
		thisObj.spriteLoadOrder.forEach(function (key) {
			var sprite = thisObj.sprites[key];
			var width = sprite.width || 0;
			var height = sprite.height || 0;
			thisObj.ctx.globalAlpha = sprite.alpha;
			sprite.x += sprite.velocityX / 60;
			sprite.y += sprite.velocityY / 60;
			thisObj.ctx.save();
			thisObj.ctx.scale(width < 0 ? -1 : 1, height < 0 ? -1 : 1);
			thisObj.ctx.translate(width < 0 ? -sprite.x - width / 2 : sprite.x + width / 2, height < 0 ? -sprite.y - height / 2 : sprite.y + height / 2);
			thisObj.ctx.imageSmoothingEnabled = sprite.smoothing ?? thisObj.imageSmoothing ?? true;
			width = Math.abs(width);
			height = Math.abs(height);
			if (sprite.degrees % 360 != 0) {
				thisObj.ctx.rotate(sprite.degrees * Math.PI / 180);
			}
			switch (sprite.imageType) {
				case "spritesheet":
					var spritesheet = sprite.spritesheet;
					thisObj.ctx.drawImage(spritesheet.img, spritesheet.width * (sprite.frame % spritesheet.framesX), spritesheet.height * Math.floor(sprite.frame / spritesheet.framesX), spritesheet.width, spritesheet.height, -width / 2, -height / 2, width, height);
					break;
				case "sprite":
					// if (!sprite.img.complete) return;
					thisObj.ctx.drawImage(sprite.img, -width / 2, -height / 2, width, height);
					break;
				default:
					sprite.draw();
			}
			thisObj.ctx.restore();
			thisObj.ctx.globalAlpha = 1;
		})
		thisObj.timer++;
	}

	//Preloads images so that they can later be used as sprites
	this.preloadImage = function (imageNames) {
		imageNames = typeof imageNames === "object" ? imageNames : [imageNames];
		imageNames.forEach(function (imageName) {
			var key = imageName + "WaitLoad";
			thisObj.preloadImageArray[key] = true;
		})
	}

	this.checkpreloadImage = function () {
		if (function () {
			var result = true;
			for (var i = 0, keys = Object.keys(thisObj.preloadImageArray); i < keys.length; i++) {
				if (keys[i] == "result" || keys[i] == "update") continue;
				var key = keys[i].substring(0, keys[i].length - 8);
				var image = thisObj.spritesheets[key] ? thisObj.spritesheets[key].img : thisObj.loadedImages[key];
				if (image.complete) {
					thisObj.preloadImageArray[key + "WaitLoad"] = false;
					if (thisObj.spritesheets[key]) {
						thisObj.spritesheets[key].framesX = Math.floor(thisObj.spritesheets[key].img.naturalWidth / thisObj.spritesheets[key].width);
						thisObj.spritesheets[key].framesY = Math.floor(thisObj.spritesheets[key].img.naturalHeight / thisObj.spritesheets[key].height);
					}
				}
				else result = false;
			}
			return result;
		}()) {
			if (thisObj.preloadImageData) {
				thisObj.preloadImageData();
				thisObj.preloadImageData = undefined;
				requestAnimationFrame(thisObj.checkpreloadImage);
			} else {
				thisObj.create();
				requestAnimationFrame(thisObj.render)
			}
		}
		else {
			requestAnimationFrame(thisObj.checkpreloadImage);
		}
	}

	this.preload = function () { requestAnimationFrame(thisObj.preload); return true; }

	requestAnimationFrame(this.preload)

	var preloadInt = setInterval(function () {
		if (!thisObj.preload()) {
			requestAnimationFrame(thisObj.checkpreloadImage);
			clearInterval(preloadInt)
		}
	}, 50 / 3)

	this.create = function () { };

	this.waitForFrames = function (callback, frames, priority) {
		var event = {
			callback: callback,
			frames: frames,
			id: thisObj.currentFrameEventID,
			currentFrame: 0,
			repeat: false,
			killEvent: function () { if ((pos = thisObj.frameEvents.indexOf(thisObj.frameEvents.find(obj => obj.id === this.id))) >= 0) { thisObj.frameEvents.splice(pos, 1); }; }
		}
		if (!priority) thisObj.frameEvents.push(event);
		else thisObj.frameEvents.splice(0, 0, event);
		thisObj.currentFrameEventID++;
		return thisObj.frameEvents.find(obj => obj.id === thisObj.currentFrameEventID - 1);
	}

	this.repeatFrames = function (callback, frames, endCondition, endFunction, priority) {
		var event = {
			callback: callback,
			frames: frames,
			id: thisObj.currentFrameEventID,
			endCondition: endCondition,
			endFunction: endFunction || function () { },
			currentFrame: 0,
			repeatValue: 0,
			pause: false,
			repeat: true,
			killEvent: function () { if ((pos = thisObj.frameEvents.indexOf(thisObj.frameEvents.find(obj => obj.id === this.id))) >= 0) { thisObj.frameEvents.splice(pos, 1); }; }
		}
		if (!priority) thisObj.frameEvents.push(event); else thisObj.frameEvents.splice(0, 0, event);
		thisObj.currentFrameEventID++;
		return thisObj.frameEvents.find(obj => obj.id === thisObj.currentFrameEventID - 1);
	}

	this.keys = {
		keys: {
			"BACKSPACE": 8,
			"TAB": 9,
			"ENTER": 13,
			"SHIFT": 16,
			"CTRL": 17,
			"ALT": 18,
			"CAPS LOCK": 20,
			"ESCAPE": 27,
			"SPACE": 32,
			" ": 32,
			"PAGE UP": 33,
			"PAGE DOWN": 34,
			"END": 35,
			"HOME": 36,
			"LEFT ARROW": 37,
			"UP ARROW": 38,
			"RIGHT ARROW": 39,
			"DOWN ARROW": 40,
			"INSERT": 45,
			"DELETE": 46,
			"0": 48,
			"1": 49,
			"2": 50,
			"3": 51,
			"4": 52,
			"5": 53,
			"6": 54,
			"7": 55,
			"8": 56,
			"9": 57,
			"A": 65,
			"B": 66,
			"C": 67,
			"D": 68,
			"E": 69,
			"F": 70,
			"G": 71,
			"H": 72,
			"I": 73,
			"J": 74,
			"K": 75,
			"L": 76,
			"M": 77,
			"N": 78,
			"O": 79,
			"P": 80,
			"Q": 81,
			"R": 82,
			"S": 83,
			"T": 84,
			"U": 85,
			"V": 86,
			"W": 87,
			"X": 88,
			"Y": 89,
			"Z": 90,
			"LEFT WINDOW": 91,
			"RIGHT WINDOW": 92,
			"SELECT": 93,
			"NUMPAD 0": 96,
			"NUMPAD 1": 97,
			"NUMPAD 2": 98,
			"NUMPAD 3": 99,
			"NUMPAD 4": 100,
			"NUMPAD 5": 101,
			"NUMPAD 6": 102,
			"NUMPAD 7": 103,
			"NUMPAD 8": 104,
			"NUMPAD 9": 105,
			"MULTIPLY": 106,
			"ADD": 107,
			"SUBTRACT": 109,
			"DECIMAL POINT": 110,
			"DIVIDE": 111,
			"F1": 112,
			"F2": 113,
			"F3": 114,
			"F4": 115,
			"F5": 116,
			"F6": 117,
			"F7": 118,
			"F8": 119,
			"F9": 120,
			"F10": 121,
			"F11": 122,
			"F12": 123,
			"NUM LOCK": 144,
			"SCROLL LOCK": 145,
			"SEMICOLIN": 186,
			";": 186,
			"EQUAL": 187,
			"=": 187,
			"COMMA": 188,
			",": 188,
			"DASH": 189,
			"-": 189,
			"PERIOD": 190,
			".": 190,
			"FOWARD SLASH": 191,
			"/": 191,
			"GRAVE ACCENT": 192,
			"`": 192,
			"OPEN BRACKET": 219,
			"[": 219,
			"BACK SLASH": 220,
			"\\": 220,
			"CLOSE BRACKET": 221,
			"]": 221,
			"SINGLE QUOTE": 222,
			"'": 222,
		},
		keysDown: {},
		keyDownEvents: {},
		keyUpEvents: {},
		keyIsDown: function (key) {
			return this.keysDown[this.keys[key]] === true;
		},
		onKeyDown: function (event, key, name, priority) {
			this.keyDownEvents[thisObj.keys.keys[key]] = this.keyDownEvents[thisObj.keys.keys[key]] || {};
			this.keyDownEvents[thisObj.keys.keys[key]][name] = [event, priority];
		},
		removeKeyDownEvent: function (key, name) {
			if (this.keyDownEvents[keys.keys[key]] && this.keyDownEvents[keys.keys[key]][name])
				delete this.keyDownEvents[keys.keys[key]][name]
		},
		onKeyUp: function (event, key, name, priority) {
			this.keyUpEvents[thisObj.keys.keys[key]] = this.keyUpEvents[thisObj.keys.keys[key]] || {}
			this.keyUpEvents[thisObj.keys.keys[key]][name] = [event, priority];
		},
		removeKeyUpEvent: function (key, name) {
			if (this.keyUpEvents[keys.keys[key]] && this.keyUpEvents[keys.keys[key]][name])
				delete this.keyUpEvents[keys.keys[key]][name]
		}
	}

	this.keyDown = function (keyCode) {
		if (thisObj.keys.keysDown[keyCode]) return;
		thisObj.keys.keysDown[keyCode] = true;
		if (!thisObj.keys.keyDownEvents[keyCode]) return;
		Object.values(thisObj.keys.keyDownEvents[keyCode]).forEach(function (event) {
			thisObj.waitForFrames(event[0], 0, event[1]);
		});
	}

	document.addEventListener("keydown", function (event) {
		thisObj.keyDown(event.keyCode);
	})

	this.keyUp = function (keyCode) {
		if (!thisObj.keys.keysDown[keyCode]) return;
		thisObj.keys.keysDown[keyCode] = false;
		if (!thisObj.keys.keyUpEvents[keyCode]) return;
		Object.values(thisObj.keys.keyUpEvents[keyCode]).forEach(function (event) {
			thisObj.waitForFrames(event[0], 0, event[1]);
		})
	}

	document.addEventListener("keyup", function (event) {
		thisObj.keyUp(event.keyCode);
	})

	thisObj.canvas.addEventListener("blur", function () {
		Object.keys(keys.keysDown).forEach(function (key) {
			if (keys.keysDown[key]) {
				if (!keys.keyUpEvents[key]) return
				Object.values(keys.keyUpEvents[key]).forEach(function (event) {
					event[0]();
				})
			}
			keys.keysDown[key] = false;
		})
	})

	// function checkOverlap(sprite1, sprite2) {
	//     return sprite1.x + sprite1.width + sprite1.velocityX / 60 > sprite2.x + sprite2.velocityX / 60 && sprite1.x + sprite1.velocityX / 60 < sprite2.x + sprite2.width + sprite2.velocityX / 60 && sprite1.y + sprite1.height + sprite1.velocityY / 60 > sprite2.y + sprite2.velocityY / 60 && sprite1.y + sprite1.velocityY / 60 < sprite2.y + sprite2.height + sprite2.velocityY / 60;
	// }

	thisObj.canvas.addEventListener("click", function (event) {
		var mouseX = event.clientX - thisObj.canvas.getBoundingClientRect().left;
		var mouseY = event.clientY - thisObj.canvas.getBoundingClientRect().top;
		for (var i = thisObj.spriteLoadOrder.length - 1; i >= 0; i--) {
			var sprite = thisObj.sprites[thisObj.spriteLoadOrder[i]]
			console.log(mouseX > sprite.x, mouseX < sprite.x + sprite.width, mouseY < sprite.y + sprite.height, mouseY > sprite.y);
			if (mouseX > sprite.x && mouseX < sprite.x + sprite.width && mouseY < sprite.y + sprite.height && mouseY > sprite.y) {
				sprite.onclick();
			}
		}
	})

	thisObj.canvas.addEventListener("mousedown", function (event) {
		var mouseX = event.clientX - thisObj.canvas.getBoundingClientRect().left;
		var mouseY = event.clientY - thisObj.canvas.getBoundingClientRect().top;
		for (var i = thisObj.spriteLoadOrder.length - 1; i >= 0; i--) {
			var sprite = thisObj.sprites[thisObj.spriteLoadOrder[i]]
			if (mouseX > sprite.x && mouseX < sprite.x + sprite.width && mouseY < sprite.y + sprite.height && mouseY > sprite.y) {
				sprite.onmousedown();
			}
		}
	})

	thisObj.canvas.addEventListener("mouseup", function (event) {
		var mouseX = event.clientX - thisObj.canvas.getBoundingClientRect().left;
		var mouseY = event.clientY - thisObj.canvas.getBoundingClientRect().top;
		for (var i = thisObj.spriteLoadOrder.length - 1; i >= 0; i--) {
			var sprite = thisObj.sprites[thisObj.spriteLoadOrder[i]]
			if (mouseX > sprite.x && mouseX < sprite.x + sprite.width && mouseY < sprite.y + sprite.height && mouseY > sprite.y) {
				sprite.onmouseup();
			}
		}
	})

	//Starting from here would be some code that I didn't really code and found online

	//https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
	this.copyTextToClipboard = function (text) {
		var textArea = document.createElement("textarea");

		//
		// *** This styling is an extra step which is likely not required. ***
		//
		// Why is it here? To ensure:
		// 1. the element is able to have focus and selection.
		// 2. if element was to flash render it has minimal visual impact.
		// 3. less flakyness with selection and copying which **might** occur if
		//    the textarea element is not visible.
		//
		// The likelihood is the element won't even render, not even a
		// flash, so some of these are just precautions. However in
		// Internet Explorer the element is visible whilst the popup
		// box asking the user for permission for the web page to
		// copy to the clipboard.
		//

		// Place in top-left corner of screen regardless of scroll position.
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;

		// Ensure it has a small width and height. Setting to 1px / 1em
		// doesn't work as this gives a negative w/h on some browsers.
		textArea.style.width = '2em';
		textArea.style.height = '2em';

		// We don't need padding, reducing the size if it does flash render.
		textArea.style.padding = 0;

		// Clean up any borders.
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';

		// Avoid flash of white box if rendered for any reason.
		textArea.style.background = 'transparent';


		textArea.value = text;

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying text command was ' + msg);
		} catch (err) {
			console.log('Oops, unable to copy');
		}

		document.body.removeChild(textArea);
	}
}