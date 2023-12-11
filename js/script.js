const player = function(name) {
  let succeed = false;
  const setName = () => {
    name = prompt('Enter your name');
  };
  const getName = () => {
    return name;
  }

  return {
    setName,
    getName,
    succeed
  }
}

const gameBoard = (function() {
  let board = new Array(9).fill(' ');

  const setMark = (mark, position) => {
    board[position] = mark;
  };
  const isPositionFree = (position) => {
    if (board[position] == ' ') {
      return true;
    } else {
      return false;
    }
  };
  const render = () => {
    console.log(board);
  };
  const getRows = () => {
    const horizontal = board.join('');
    const vertical = board[0] + board[3] + board[6] + board[1] + board[4] + board[7] + board[2] + board[5] + board[8];
    const diagonal = board[0] + board[4] + board[8] + board[2] + board[4] + board[6];

    return { horizontal, vertical, diagonal };
  };
  const reset = () => {
    board.fill(' ');
  };

  return {
    setMark,
    isPositionFree,
    getRows,
    render,
    reset
  }
})();

const game = (function() {
  let player1 = player('Player 1');
  let player2 = player('Player 2');
  let mark = 'x';
  let position;
  let turnCount = 0;

  const toggleMark = () => {
    if (mark == 'x') {
      mark = 'o';
    } else {
      mark = 'x';
    }
  };
  const isGameOver = () => {
    if (player1.succeed || player2.succeed) {
      return true;
    } else {
      return false;
    }
  };
  const checkWinner = () => {
    const rows = gameBoard.getRows();
    for (let row in rows) {
      if (rows[row].includes('xxx')) player1.succeed = true;
      if (rows[row].includes('ooo')) player2.succeed = true;
    }
  };
  const getResult = () => {
    if (player1.succeed && player2.succeed) {
      console.log('A Tie');
    } else if (player1.succeed) {
      console.log(`${player1.getName()} is a WINNER`);
    } else if (player2.succeed) {
      console.log(`${player2.getName()} is a WINNER`);
    }
  };
  const play = () => {
    if (!isGameOver()) {
      position = prompt('Place your mark');
      if (gameBoard.isPositionFree(position)) {
        gameBoard.setMark(mark, position);
        toggleMark();
        turnCount++;
        gameBoard.render();
        if (turnCount % 2 == 0) {
          checkWinner();
          getResult();
        }
      } else {
        alert('This space is already marked');
        play();
      }
    }
  };
  const reset = () => {
    player1.succeed = false;
    player2.succeed = false;
    turnCount = 0;
    mark = 'x';
    gameBoard.reset();
    gameBoard.render();
  };

  return {
    player1,
    player2,
    play,
    reset
  }
})();