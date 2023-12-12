function player(name) {
  const setName = () => {
    name = prompt('Enter your name.');
  };

  const getName = () => name;

  return {
    setName,
    getName
  }
}

function gameBoard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(cell());
    }
  }

  const getBoard = () => board;

  const setMark = (row, column, player) => {
    board[row][column].addMark(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
    console.table(boardWithCellValues);
  };

  const resetBoard = () => {
    board.map(row => row.map(cell => cell.addMark('')));
  }

  return {
    getBoard,
    setMark,
    printBoard,
    resetBoard
  }
};

function cell() {
  let value = '';

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addMark,
    getValue
  };
}

const game = (function () {
  let board = gameBoard();

  const player1 = player('Player 1');
  const player2 = player('Player 2');
  player1.mark = 'x';
  player2.mark = 'o';

  const players = [player1, player2];

  let activePlayer = players[0];
  let succeed;
  let turnCount = 0;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().getName()}'s turn.`);
  };

  const isSpaceNotFree = (row, column) => {
    const value = board.getBoard()[row][column].getValue();
    return value !== '';
  };

  const isPlayerSucceed = (player) => {
    if (board.getBoard()[0][0].getValue() == player.mark
      && board.getBoard()[0][1].getValue() == player.mark
      && board.getBoard()[0][2].getValue() == player.mark
      || board.getBoard()[1][0].getValue() == player.mark
      && board.getBoard()[1][1].getValue() == player.mark
      && board.getBoard()[1][2].getValue() == player.mark
      || board.getBoard()[2][0].getValue() == player.mark
      && board.getBoard()[2][1].getValue() == player.mark
      && board.getBoard()[2][2].getValue() == player.mark) {
      return true;
    } else if (board.getBoard()[0][0].getValue() == player.mark
      && board.getBoard()[1][0].getValue() == player.mark
      && board.getBoard()[2][0].getValue() == player.mark
      || board.getBoard()[0][1].getValue() == player.mark
      && board.getBoard()[1][1].getValue() == player.mark
      && board.getBoard()[2][1].getValue() == player.mark
      || board.getBoard()[0][2].getValue() == player.mark
      && board.getBoard()[1][2].getValue() == player.mark
      && board.getBoard()[2][2].getValue() == player.mark) {
      return true;
    } else if (board.getBoard()[0][0].getValue() == player.mark
      && board.getBoard()[1][1].getValue() == player.mark
      && board.getBoard()[2][2].getValue() == player.mark
      || board.getBoard()[0][2].getValue() == player.mark
      && board.getBoard()[1][1].getValue() == player.mark
      && board.getBoard()[2][0].getValue() == player.mark) {
      return true;
    }
    return false;
  };

  const playRound = (row, column) => {
    if (succeed || turnCount == 9) {
      console.log('Game Over');
      return;
    };
    if (isSpaceNotFree(row, column)) {
      printNewRound();
      return;
    }

    board.setMark(row, column, getActivePlayer().mark);

    succeed = isPlayerSucceed(getActivePlayer());
    if (succeed) return;

    turnCount++;
    switchPlayerTurn();
    printNewRound();
  };

  const getWinner = () => {
    if (succeed) return `${getActivePlayer().getName()} WINS`;
    if (turnCount == 9) return 'A Tie!';
  };

  const resetBoard = () => {
    board.resetBoard();
    turnCount = 0;
    activePlayer = players[0];
    succeed = null;
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    getWinner,
    resetBoard
  }
})();

const screen = (function () {
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const resetButton = document.querySelector('.reset');

  const updateScreen = () => {
    boardDiv.textContent = '';


    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = game.getWinner()||`${activePlayer.getName()}'s turn...`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');

        cellButton.dataset.index = '' + rowIndex + cellIndex;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    });
  };

  function clickHandlerBoard(e) {
    const selectedCell = e.target.dataset.index;

    if (!selectedCell) return;

    const row = selectedCell[0];
    const column = selectedCell[1];

    game.playRound(row, column);
    updateScreen();
  }

  function clickHandlerReset() {
    game.resetBoard();
    updateScreen();
  }

  boardDiv.addEventListener('click', clickHandlerBoard);
  resetButton.addEventListener('click', clickHandlerReset);

  updateScreen();
})();