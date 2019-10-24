import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const REGULARCELL = '#fff'
const WINCELL = '#bcd439'

function Square(props) {
return (
    <button className="square" style={{backgroundColor: props.color}} onClick={ props.onClick }>
        {props.value}
    </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
      return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                color={this.props.winline !== null ? 
                    this.props.winline.includes(i) ? 
                        WINCELL :
                        REGULARCELL
                    : REGULARCELL} 
            />
        );
    }
  
    render() {
      const rows = [0, 1, 2]
      let count = 0
      return (
        <div>
          {
            rows.map(i => { 
                return <div className="board-row">{
                    rows.map(j => this.renderSquare(count++))
                }
                </div> 
            })
          }

        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: null,
                winline: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            winline: null,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let winner = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: this.getColRow(i),
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
        
        winner = calculateWinner(squares);
        if (winner) {
            this.setWinline(winner[1])
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    getColRow(i) {
        return [i % 3, Math.floor(i / 3)]
    }

    setWinline(line) {
        this.setState({winline: line})
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      let winner = calculateWinner(current.squares);
        
      const moves = history.map((step, move) => {
          const desc = move ? 
            'Go to move #' + move + `(${history[move].location[0]}:${history[move].location[1]})`:
            'Go to game start';
          return (
              <li key={move}>
                  <button 
                    style={
                        move === this.state.stepNumber ? 
                        {backgroundColor: '#000', color:'#fff'} : 
                        null} 
                    onClick={() => this.jumpTo(move)}
                  >
                  {desc}
                  </button>
              </li>
          )
      })

      let status;
      if (winner) {
          status = 'Winner: ' + winner[0];
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
            squares = {current.squares}
            winline = {this.state.winline}
            onClick={i => this.handleClick(i)}
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
  
function calculateWinner(squares) {
    const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for(let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return [squares[a], lines[i]];
      }
  }
  return null;
}

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  