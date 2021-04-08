import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - probLightOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, probLightOn = .8 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    return Array.from({ length: nrows }, r => (
      Array.from({ length: ncols }, v => Math.random() <= probLightOn ? true : false))
    )
  }

  function hasWon(board) {
    // check the board in state to determine whether the player has won.
    return !board.some(r => r.some(val => val));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      let oldBoardCopy = oldBoard.map((r) => [...r]);

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, oldBoardCopy);
      flipCell(y + 1, x, oldBoardCopy);
      flipCell(y, x - 1, oldBoardCopy);
      flipCell(y - 1, x, oldBoardCopy);
      flipCell(y, x + 1, oldBoardCopy);

      // return the copy
      return oldBoardCopy;
    });
  }

  return (
    <table>
      {hasWon(board)
        ? <p style={{ color: "white" }}>Winner!</p>
        : board.map((row, rowNum) => (
          <tr>
            {row.map((val, colNum) => (
              <Cell flipCellsAroundMe={() => flipCellsAround(`${rowNum}-${colNum}`)}
                isLit={val} />
            ))}
          </tr>
        ))}
    </table>
  );
}

export default Board;
