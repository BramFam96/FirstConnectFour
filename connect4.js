//global vars:
const WIDTH = 7
const HEIGHT = 6

let currPlayer = 1 // active player: 1 or 2
let board = [] // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoardStructure = () => {
	for (let y = 0; y < HEIGHT; y++) {
		board.push(Array.from({ length: WIDTH }))
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
	const board = document.getElementById('board')

	// make column tops (clickable area for adding a piece to that column)
	//start by making a new top row;
	const top = document.createElement('tr')
	top.setAttribute('id', 'column-top')
	top.addEventListener('click', handleClick)
	//iterate across the new row, and append cells;
	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td')

		/////
		headCell.setAttribute('id', x)
		///

		top.append(headCell)
	}
	//append the new row to our board;
	board.append(top)

	// make a row for each column defined in height;
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr')
		//make a cell for each new row;
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td')
			//confused by ${y}-${x} -> don't understand how ids are unique with this set up
			cell.setAttribute('id', `${y}-${x}`)

			//append the cells to each row;
			row.append(cell)
		}
		//apend each row to the board (after our column toppers)
		board.append(row)
	}
}

/** findTheRighSpot: given column x, return top empty y (null if filled) */

const findTheRightSpot = (x) => {
	//starts at bottom and iterates up;
	for (let y = HEIGHT - 1; y >= 0; y--) {
		//returns the first cell where y is unoccupied;
		if (!board[y][x]) {
			return y
		}
	}
	return null
}

/** placeInTable: update DOM to place piece into HTML table*/

const placeInTable = (y, x) => {
	//first we structure game pieces
	const piece = document.createElement('div')
	piece.classList.add('piece')
	piece.classList.add(`p${currPlayer}`)

	//Then we select the place to append:

	const spot = document.getElementById(`${y}-${x}`)
	spot.append(piece)
}

/** endGame: announce game end */

const endGame = (msg) => {
	alert(msg)
	//clear the board data
	for (let rows of board) {
		for (let cell of rows) {
			cell = undefined
		}
	}
	//delete the dots
	document.querySelectorAll('.piece').forEach((el) => el.remove())
	//Error, checkForWin still returns true and prevents the match from restarting
	//checkForWin() = false;
}

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
	// get x from ID of clicked cell
	const x = +evt.target.id

	// get next spot in column (if none, ignore click)
	const y = findTheRightSpot(x)
	//if row is occupied or spot is invalid we should return nothing;
	if (y === null) {
		return
	}

	// place piece in board and add to HTML table
	board[y][x] = currPlayer
	placeInTable(y, x)

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`)
	}

	// check for tie
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie!')
	}

	// switch players
	currPlayer = currPlayer === 1 ? 2 : 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
	let _win = (cells) => {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([y, x]) =>
				y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer
		)
	}
	//start at the top iterate from left to right:
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			// get "check list" of 4 cells (starting here) for each of the different
			// ways to win
			const horiz = [
				[y, x],
				[y, x + 1],
				[y, x + 2],
				[y, x + 3],
			]
			const vert = [
				[y, x],
				[y + 1, x],
				[y + 2, x],
				[y + 3, x],
			]
			const diagDR = [
				[y, x],
				[y + 1, x + 1],
				[y + 2, x + 2],
				[y + 3, x + 3],
			]
			const diagDL = [
				[y, x],
				[y + 1, x - 1],
				[y + 2, x - 2],
				[y + 3, x - 3],
			]

			// find winner (only checking each win-possibility as needed)
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true
			}
		}
	}
}

makeBoardStructure()
makeHtmlBoard()
