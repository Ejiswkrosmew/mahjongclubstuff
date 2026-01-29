var main = new Canvas(0);

main.preload = function() {
	this.loadSpritesheet(600, 800, "assets/tiles.png", "tiles");
	this.loadSpritesheet(201, 92, "assets/buttons.png", "buttons");
}.bind(main);

main.create = function() {
	this.hand = [];
	this.tileText = [];
	this.tileSprites = [];
	this.buttonSprites = [];

	this.settings = {
		tileWidth: 240,
		tileY: 320,
		tileTextY: 120,
		buttonWidth: 600,
		buttonY: 720,
		meldPadding: 120,
		canvasMult: 1/4,
	}

	this.consts = {
		suits: ["m", "p", "s", "z"],
		honors: ["", "E", "S", "W", "N", "Wh", "G", "R"],
		buttons: ["c", "p", "k", "t", "r", "R", "K"],
	}

	this.canvas.height = 250 / this.settings.canvasMult;
	this.canvas.style.height = "250px";
}.bind(main);

main.getTile = function(index) {
	if (this.tileSprites.length <= index) {
		this.tileSprites.push(this.createSpritesheetImage(0, this.settings.tileY, "tiles", "tile" + index, 0, this.settings.tileWidth));
		this.tileText.push(this.createText(0, this.settings.tileTextY, "tileText" + index, "", {font: 24 / this.settings.canvasMult + "px Arial", align: "center"}));
	}

	return this.tileSprites[index];
}.bind(main);

main.update = function() {
	let i;
	let turnTile = 0;
	let doubleTile = 0;
	let closedTile = 0;
	let tileIndex = 0;
	let buttonIndex = 0;
	let currentX = 0;

	// Iterate through the hand
	for (i = 0; i < this.hand.length; i++) {
		let token = this.hand[i];
		if (!isNaN(parseInt(token[0]))) {
			// Tile

			// Initialize the tile
			let tile = this.getTile(tileIndex);
			tile.alpha = 1;
			tile.degrees = 0;
			tile.y = this.settings.tileY;
			
			// Set the tile correctly
			tile.frame = this.consts.suits.indexOf(token[1]) * 10 + parseInt(token[0]);
			tile.x = currentX;
			
			// Set up the tile text
			let tileText = this.tileText[tileIndex];
			tileText.x = currentX + this.settings.tileWidth / 2;
			tileText.color = "black";
			tileText.text = token[0];

			if (token[1] == "z") {
				// Honors case
				tileText.text = this.consts.honors[parseInt(token[0])];
			} else if (token[0] == "0") {
				// Red 5 edge case
				tileText.color = "red";
				tileText.text = "5";
			}

			// Check if tile should be closed
			if (closedTile == 4 || closedTile == 1) {
				tile.frame = 30;
			}
			// Update closed tile timer
			closedTile--;

			// Check for special tile positions due to calls
			if (turnTile == 1) {
				// Update currentX and label text
				currentX += this.settings.tileWidth / 3;
				tileText.x += this.settings.tileWidth / 6;

				// Set the tile
				tile.degrees = 90;
				tile.x += this.settings.tileWidth / 6;
				tile.y += this.settings.tileWidth / 6;

				// Doubled up if needed
				if (doubleTile == 1) {
					tileIndex++;
					let tile2 = this.getTile(tileIndex);
					tile2.alpha = 1;
					tile2.degrees = 90;
					tile2.frame = tile.frame;
					tile2.x = tile.x;
					tile2.y = tile.y - this.settings.tileWidth;

					// Skip this tile's label text
					this.tileText[tileIndex].text = "";
				}
			}
			// Update tile turning timers
			turnTile--;
			doubleTile--;
			
			
			// Update variables
			tileIndex++;
			currentX += this.settings.tileWidth;
		} else {
			// Button

			// Number used to determine tile formation
			let formation = parseInt(token[1]);

			// Add a button sprite if one doesn't exist
			if (this.buttonSprites.length <= buttonIndex) {
				this.buttonSprites.push(this.createSpritesheetImage(0, this.settings.buttonY, "buttons", "button" + buttonIndex, 0, this.settings.buttonWidth));
			}

			// Initialize the button
			let button = this.buttonSprites[buttonIndex];
			button.alpha = 1;

			// Add meld padding
			currentX += this.settings.meldPadding;

			// Calculate meld width
			let width = this.settings.tileWidth * 10/3;
			switch(token[0]) {
				case "c":
					turnTile = 1;
					break;
				case "p":
					turnTile = formation + 1;
					break;
				case "k":
					if (formation >= 7) {
						width = this.settings.tileWidth * 4;
						closedTile = 4;
						break;
					} else if (formation < 4) {
						width = this.settings.tileWidth * 13/3;
					}
					turnTile = formation % 4 + 1;
					doubleTile = Math.max(0, formation - 3);
					break;
				case "t":
				case "r":
					width = this.settings.tileWidth;
					break;
				case "K":
					width = this.settings.tileWidth * (formation + 1);
					break;
				case "R":
					currentX -= this.settings.meldPadding;
					break;
			}

			// Set the button correctly
			button.frame = this.consts.buttons.indexOf(token[0]);
			if (token[0] == "R") {
				button.x = (currentX - this.settings.buttonWidth) / 2;
			} else {
				button.x = currentX + (width - this.settings.buttonWidth) / 2;
			}

			if (token[0] == "K") {
				for (let k = 0; k <= formation; k++) {
					let kita = this.getTile(tileIndex);
					kita.alpha = 1;
					kita.degrees = 0;
					kita.y = this.settings.tileY;
					
					kita.frame = 34;
					kita.x = currentX;
					tileIndex++;
					currentX += this.settings.tileWidth;
				}
			}

			// Update variables
			buttonIndex++;
		}
	}

	this.canvas.width = Math.max(this.tileSprites[tileIndex - 1]?.x + this.settings.tileWidth * 4 / 3 || 0, this.buttonSprites[buttonIndex - 1]?.x + this.settings.buttonWidth || 0);
	this.canvas.style.width = this.canvas.width * this.settings.canvasMult + "px";

	// Make unused sprites invisible
	for (; tileIndex < this.tileSprites.length; tileIndex++) {
		this.tileSprites[tileIndex].alpha = 0;
		this.tileText[tileIndex].text = "";
	}

	for (; buttonIndex < this.buttonSprites.length; buttonIndex++) {
		this.buttonSprites[buttonIndex].alpha = 0;
	}
}.bind(main);