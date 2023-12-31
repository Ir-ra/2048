'use strict';

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const gameScore = document.querySelector('.game-score');

const size = 4;
let score = 0;
const gameBoard = [];

const COMMAND = {
  UP: 'up',
  DOWN: 'down',
  RIGHT: 'right',
  LEFT: 'left'
};

const ArrowCOMMAND = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft'
};


function initGame() {
  for (let r = 0; r < size; r++) {
    gameBoard[r] = [];

    for (let c = 0; c < size; c++) {
      gameBoard[r][c] = 0;
    }
  }
}

function generate() {
  const emptyCells = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gameBoard[r][c] === 0) {
        emptyCells.push({
          r,
          c,
        });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    gameBoard[randCell.r][randCell.c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function refreshBoard() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cellValue = gameBoard[r][c];
      const cellIndex = r * size + c;
      const cellElement = cells[cellIndex];

      cellElement.textContent = cellValue || '';
      cellElement.className = 'field-cell';

      if (cellValue) {
        cellElement.classList.add(`field-cell--${cellValue}`);
      }
    }
  }
}

function updateScore(newScore) {
  score = newScore;
  gameScore.textContent = score;
}

function ifWinner() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gameBoard[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
};

function ifLooser() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (gameBoard[r][c] === 0) {
        return false;
      }

      if (c !== size - 1
        && gameBoard[r][c] === gameBoard[r][c + 1]) {
        return false;
      }

      if (r !== size - 1
        && gameBoard[r][c] === gameBoard[r + 1][c]) {
        return false;
      }
    }
  }

  return true;
};

function moveCommands(command) {
  let moved = false;

  function move(r, c, rCoord, cCoord) {
    let rCopy = r;
    let cCopy = c;
    const cellValue = gameBoard[rCopy][cCopy];

    if (cellValue) {
      let newRow = rCopy + rCoord;
      let newCol = cCopy + cCoord;

      while (
        newRow >= 0
        && newRow < size
        && newCol >= 0
        && newCol < size
      ) {
        const nextCellValue = gameBoard[newRow][newCol];

        if (!nextCellValue) {
          gameBoard[newRow][newCol] = cellValue;
          gameBoard[rCopy][cCopy] = 0;
          rCopy = newRow;
          cCopy = newCol;
          newRow += rCoord;
          newCol += cCoord;
          moved = true;
        } else
        if (nextCellValue === cellValue) {
          gameBoard[newRow][newCol] = cellValue * 2;
          gameBoard[rCopy][cCopy] = 0;
          updateScore(score + cellValue * 2);
          moved = true;

          if (gameBoard[newRow][newCol] === 2048) {
            winMessage.classList.remove('hidden');
          }
          break;
        } else {
          break;
        }
      }
    }
  }

  function moveHorizontal(start, end, step, moveFunction) {
    for (let row = 0; row < size; row++) {
      for (let i = start; i !== end; i += step) {
        moveFunction(row, i);
      }
    }
  }

  function moveLeft() {
    moveHorizontal(1, size, 1, (row, col) => move(row, col, 0, -1));
  }

  function moveRight() {
    moveHorizontal(size - 2, -1, -1, (row, col) => move(row, col, 0, 1));
  }

  function moveVertical(start, end, step, moveFunction) {
    for (let col = 0; col < size; col++) {
      for (let i = start; i !== end; i += step) {
        moveFunction(i, col);
      }
    }
  }

  function moveUp() {
    moveVertical(1, size, 1, (row, col) => move(row, col, -1, 0));
  }

  function moveDown() {
    moveVertical(size - 2, -1, -1, (row, col) => move(row, col, 1, 0));
  }

  switch (command) {
    case COMMAND.UP:
      moveUp();
      break;
    case COMMAND.DOWN:
      moveDown();
      break;
    case COMMAND.LEFT:
      moveLeft();
      break;
    case COMMAND.RIGHT:
      moveRight();
      break;
  }

  if (moved) {
    generate();
    refreshBoard();

    if (ifLooser()) {
      loseMessage.classList.remove('hidden');
      startButton.classList.replace('restart', 'start');
      startButton.innerHTML = 'Restart';
    }

    if (ifWinner()) {
      winMessage.classList.remove('hidden');
    }
  }
}

startButton.addEventListener('click', (e) => {
  initGame();
  generate();
  generate();
  refreshBoard();
  updateScore(0);

  startButton.classList.replace('start', 'restart');
  startButton.innerHTML = 'Restart';
  startMessage.classList.add('hidden');
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case ArrowCOMMAND.UP:
      moveCommands(COMMAND.UP);
      break;
    case ArrowCOMMAND.DOWN:
      moveCommands(COMMAND.DOWN);
      break;
    case ArrowCOMMAND.LEFT:
      moveCommands(COMMAND.LEFT);
      break;
    case ArrowCOMMAND.RIGHT:
      moveCommands(COMMAND.RIGHT);
      break;
    default:
      break;
  }
});
