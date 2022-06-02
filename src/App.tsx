import React, { useEffect, useState } from 'react';
import './App.css';

type Players = "X" | "O";

export default () => {

  const [turn, setTurn] = useState<Players>("O"); //ARMAZENAR DE QUEM É A VEZ
  const [winner, setWinner] = useState<Players | null>(null); //ARMAZENAR O GANHADOR
  const [draw, setDraw] = useState<boolean | null>(null); //ARMAZENAR EMPATE
  const [marks, setMarks] = useState<{ [key: string]: Players }>({}); //ARMAZENAR AS POSIÇÕES EM OBJETO
  const [resetButton, setResetButton] = useState<boolean>(false); //BOTÃO DE RESETAR
  const [count, setCount] = useState<number>(10); //CONTADOR PARA REINICIAR
  const gameOver = !!winner || !!draw;

  const getSquares = () => {
    return new Array(9).fill(true);
  }

  const play = (index: number) => {
    if(marks[index] || gameOver){
      return;
    }

    setMarks(prev => ({ ...prev, [index]: turn }));
    setTurn(prev => prev === "O" ? "X" : "O");
  }

  const getCellPlayer = (index: number) => {
    // if(!marks[index]){
    //   return;
    // }

    if(marks[index]){
      return marks[index];
    }
  }

  const getWinner = () => {
    const victoryLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8]
    ]

    for(const line of victoryLines){
      const [a, b, c] = line;

      if(marks[a] === marks[a] && marks[a] === marks[b] && marks[a] === marks[c]){
        return marks[a];
      }
    }
  }

  const countDown = () => {
    let value = 10;

    const myInterval = setInterval(() => {
      
      if(value !== 0){
        value -= 1;
      } else{
        clearInterval(myInterval);
        reset();
        value = 10;
      }

      setCount(value);

    }, 1000);
  }

  useEffect(() => {

    const winner = getWinner();

    if(Object.keys(marks).length !== 0){
      setResetButton(true);
    }

    if(winner){
      setWinner(winner);
      setResetButton(false);
      countDown();
    } else{
      if(Object.keys(marks).length === 9){
        setDraw(true);
        setResetButton(false);
        countDown();
      }
    }

  }, [marks]);

  const reset = () => {
    setTurn(marks[0] === "O" ? "X" : "O");
    setMarks({});
    setWinner(null);
    setDraw(null);
    setResetButton(false);
  }

  return (
    <div className="container">
      {winner && <h1>{winner} ganhou</h1>}
      {draw && <h1>Empate</h1>}
      {gameOver && <button onClick={reset}>Jogar novamente</button>}
      {resetButton && <button onClick={reset}>Resetar</button>}
      {gameOver && <p>A partida irá reiniciar em {count} segundos</p>}
      {!gameOver && <p>É a vez de {turn}</p>}

      <div className={`box ${gameOver ? "gameOver" : null}`}>
        {getSquares().map((_, key) => (
          <div
            className={`cell ${getCellPlayer(key)}`} 
            onClick={() => play(key)}
            key={key}
          >
            {marks[key]}
          </div>
        ))}
      </div>
    </div>
  );
}