const view = {
	displayMessage: function (msg) {
		let messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function (location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function (location) {
		const cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};

let model;
model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,

	ships: [{locations: ["0", "0", "0"], hits: ["", "", ""]},
			{locations: ["0", "0", "0"], hits: ["", "", ""]},
			{locations: ["0", "0", "0"], hits: ["", "", ""]}],

	fire: function (guess) {
		for (let i = 0; i < this.numShips; i++) {
			const ship = this.ships[i];

			const index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");
				if (this.isSunk(ship)) {
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed");
		return true;



	},

	isSunk: function (ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function () {
		let locations;
		for (let i = 0; i < this.numShips; i++){
			do {
				locations = this.generateShip();
			}while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},
	generateShip: function () {
		const direction = Math.floor(Math.random() * 2);
		let row, col;


		if (direction === 1){
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));

		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}
		const newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++){
				if (direction ===1){
					newShipLocations.push(row + "" + (col + i));
				} else {
					newShipLocations.push((row + i) + "" + col);
				}
			}

				return newShipLocations;
	},
	collision: function (locations) {
		for (let i= 0; i < this.numShips; i++){
			const ship = model.ships[i];
			for (let j= 0; j < locations.length; j++){
				if (ship.locations.indexOf(locations[j]) >= 0){
					return true;
				}

			}
		}
	}
};

const controller = {
	guesses: 0,
	processGuess: function (guess) {
		const location = parseGuess(guess);
		if (location) {
			this.guesses++;
			const hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("You sank all my battleship, in " +
					this.guesses + " guesses");
			}
		}
	}
};

function parseGuess(guess) {

	const alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	let firstChar;
	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");

	} else {
		firstChar = guess.charAt(0);
		const row = alphabet.indexOf(firstChar);
		const column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
			column < 0 || column > +model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
		return null;

}

function init() {
	const fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	const guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleFireButton() {
	const guessInput = document.getElementById("guessInput");
	const guess = guessInput.value;
	controller.processGuess(guess);

	guessInput.value = "";
}

window.onload = init;

function handleKeyPress(e) {
	const fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13){
		fireButton.click();
		return false;
	}
}
