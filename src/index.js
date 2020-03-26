import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// １つのマス目（ボタン）を生成している関数
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// マス目を９つ合体して盤面を生成しているクラス
class Board extends React.Component {

  // マス目に何を表示するか（null,X,O）を渡して描画している関数
  renderSquare(col, row) {
    return (
      <Square
        value={this.props.squares[col][row]}
        onClick={() => this.props.onClick(col, row)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
        </div>
      </div>
    );
  }
}

// ゲーム全体の画面を管理しているクラス（mainクラス？）
class Game extends React.Component {
  // 初期化
  constructor(props) {
    // おまじない
    super(props);
    // 盤面の初期化の準備
    var squares = new Array(3);
    for (let y = 0; y < 3; y++) {
      squares[y] = new Array(3).fill(null);
    }
    this.state = {
      // history : 履歴を含めたゲームの全盤面データ
      history: [{
        // squares : 盤面の状態データ（２次元配列）、全部nullで初期化
        squares: squares,
        // coordinate : そのタイミングでどこのマス目をクリックしたかのデータ
        coordinate: {
          col: null,
          row: null,
        }
      }],
      // stepNumber : いま何手目かを管理するstate
      stepNumber: 0,
      // xIsNext : 次の手が"X"かを管理するstate
      xIsNext: true,
    }
  }

  // マス目がクリックされた時の処理（マス目のonClickに渡している）
  handleClick(col, row) {
    // historyを複製（戻って修正した場合、古い未来のデータは捨てる）
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // historyの最新（現在）の盤面をcurrentに代入
    const current = history[history.length - 1];
    // currentのsquares(盤面状態)を複製
    // const squares = current.squares.slice();
    const squares = current.squares.map(ary => ary.slice());
    // 勝者が決まっているか、すでに埋まっているマスの場合何もしない
    if (calculateWinner(squares) || squares[col][row]) {
      return;
    }
    // クリックされたマスに現在の打ち手の記号を入れる
    squares[col][row] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      // historyの最後に更新後の盤面と配置した座標のデータを追加する
      history: this.state.history.concat({
        squares: squares,
        coordinate: {
          col: col,
          row: row,
        }
      }),
      // 現在の手順を更新する
      stepNumber: history.length,
      // ターンを変更する
      xIsNext: !this.state.xIsNext,
    });
  }

  // 履歴がクリックされたときの処理
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
    // console.log(this.state.stepNumber)
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + step.coordinate.col + ',' + step.coordinate.row + ')' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        stepNumber:{this.state.stepNumber}
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(col, row) => this.handleClick(col, row)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// よーわからんけど多分おまじない
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// 勝者がいるかどうかを判断する関数
// 勝者がいる場合は勝者のマーク(X,O)を返す、いない場合はnullを返す
function calculateWinner(squares) {
  for (let x = 0; x < 3; x++) {
    if (squares[x][0] && squares[x][0] === squares[x][1] && squares[x][0] === squares[x][2]) {
      return squares[x][0];
    }
  }
  for (let y = 0; y < 3; y++) {
    if (squares[0][y] && squares[0][y] === squares[1][y] && squares[0][y] === squares[2][y]) {
      return squares[0][y];
    }
  }
  if (squares[0][0] && squares[0][0] === squares[1][1] && squares[0][0] === squares[2][2]) {
    return squares[0][0];
  }
  if (squares[0][2] && squares[0][2] === squares[1][1] && squares[0][2] === squares[2][0]) {
    return squares[0][2];
  }
  return null;
}