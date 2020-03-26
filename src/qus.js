import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        var squares = new Array(3);
        for (let y = 0; y < 3; y++) {
            squares[y] = new Array(3).fill(null);
        }
        this.state = {
            history: [{
                squares: squares,
                coordinate: {
                    col: null,
                    row: null,
                }
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(col, row) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        // const squares = current.squares.slice();
        const squares = current.squares.map(ary => ary.slice());
        if (calculateWinner(squares) || squares[col][row]) {
            return;
        }
        squares[col][row] = this.state.xIsNext ? 'X' : 'O';

        console.log("history:", history)

        this.setState({
            history: history.concat({
                squares: squares,
                coordinate: {
                    col: col,
                    row: row,
                }
            }),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
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
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
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