/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, height = 6, width = 7) { // constructor for game board with height, width, and amount of players
    this.players = [p1, p2]; // both players in this array
    this.height = height; // height of the game board
    this.width = width; // width of the game board
    this.currPlayer = p1; // current player is player 1
    this.makeBoard(); 
    this.makeHtmlBoard(); // making the game board
    this.gameOver = false;
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */
  makeBoard() { // function to create board
    this.board = []; // empty array for return
    for (let y = 0; y < this.height; y++) { // for of loop to create the height of the board up until the limit
      this.board.push(Array.from({ length: this.width })); // push the empty array from whatever length it was at, to the needed width
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops.  */

  makeHtmlBoard() { // function to create board
    const board = document.getElementById('board'); // getting the element by 'board' ID
    board.innerHTML = '';

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr'); // table row  created for the column
    top.setAttribute('id', 'column-top'); // column-top attribute created

    // store a reference to the handleClick bound function 
    // so that we can remove the event listener correctly later
    this.handleGameClick = this.handleClick.bind(this); // handleClick bind saved for later
    
    top.addEventListener("click", this.handleGameClick); // after a click, handleGameClick will run

    for (let x = 0; x < this.width; x++) { // for loop to set the width of the board up to it's limit
      const headCell = document.createElement('td'); // table-data cell created
      headCell.setAttribute('id', x); // headCell is attributed with and ID of x
      top.append(headCell); // append that headCell to the top
    }

    board.append(top); // append the board and top together

    // make main part of board
    for (let y = 0; y < this.height; y++) { // for loop to set height of board
      const row = document.createElement('tr'); // table row created
    
      for (let x = 0; x < this.width; x++) { // for loop to set width of board
        const cell = document.createElement('td'); // cell created to hold td (table-data)
        cell.setAttribute('id', `${y}-${x}`); // this represents the coordinate on the board (x, y)
        row.append(cell); // append the row to the cell
      }
    
      board.append(row); // append each row to the board
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) { // function to find the spot in column, if it's filled/empty
    for (let y = this.height - 1; y >= 0; y--) { // the piece will drop DOWN this many times
      if (!this.board[y][x]) { // if it CANNOT drop anymore...
        return y; // ... return the Y coordinate above
      }
    }
    return null; // if it CANNOT drop at all... return null
} 

  /** placeInTable: update DOM to place piece into HTML board */

  placeInTable(y, x) { // function to place piece in table
    const piece = document.createElement('div'); // piece is represented by a div
    piece.classList.add('piece'); //  class of "piece" is added
    piece.style.backgroundColor = this.currPlayer.color; // the background color changes to the current player color
    piece.style.top = -50 * (y + 2); // ???

    const spot = document.getElementById(`${y}-${x}`); // a variable to get the element coordinate (x, y)
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) { // function for endgame (win/loss)
    alert(msg); // alert pop up
    const top = document.querySelector("#column-top"); // on the top column...
    top.removeEventListener("click", this.handleGameClick); // remove the click event listener
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer; // place a piece in this coordinate for the current player
    this.placeInTable(y, x);

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) { // if every spot is filled up...
      return this.endGame('Tie!'); //... return this
    }

    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`The ${this.currPlayer.color} player won!`);
    }

    // switch players
    this.currPlayer =
      this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() { // function to check for win
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer // ???
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // horizontal win
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // vertical win
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // diagonal right win
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // diagonal left win

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player { 
  constructor(color) { 
    this.color = color; // this is the color of the player
  }
}

document.getElementById('start-game').addEventListener('click', () => { // start the game with a click
  let p1 = new Player(document.getElementById('p1-color').value); // player one is this color
  let p2 = new Player(document.getElementById('p2-color').value); // player two is this color
  new Game(p1, p2); // start a new game with both players
});