'use client';

import { useEffect } from 'react';

import { useTetrisGame } from '@/app/hooks/useTetrisGame';
import { useKeyboardControls } from '@/app/hooks/useKeyboardControls';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/app/types/tetris';

export default function TetrisPage() {
  const {
    gameState,
    movePiece,
    rotate,
    hardDrop,
    tick,
    startGame,
    togglePause,
    gameLoopRef,
  } = useTetrisGame();

  // Keyboard controls
  useKeyboardControls({
    onMoveLeft: () => movePiece(-1, 0),
    onMoveRight: () => movePiece(1, 0),
    onMoveDown: () => movePiece(0, 1),
    onRotate: rotate,
    onHardDrop: hardDrop,
    onPause: togglePause,
    enabled: !gameState.isGameOver,
  });

  // Game loop
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, tick, gameLoopRef]);

  // Render the board with current piece
  const renderBoard = () => {
    const displayBoard = gameState.board.map((row) => [...row]);

    // Overlay current piece on the board
    if (gameState.currentPiece) {
      const { shape, position, color } = gameState.currentPiece;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  // Render next piece preview
  const renderNextPiece = () => {
    if (!gameState.nextPiece) return null;

    const { shape, color } = gameState.nextPiece;
    const size = shape.length;

    return (
      <div
        className="grid gap-[2px] bg-slate-800 p-4 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {shape.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`next-${y}-${x}`}
              className="w-6 h-6 rounded-sm border border-slate-700"
              style={{
                backgroundColor: cell ? color : 'transparent',
              }}
            />
          ))
        )}
      </div>
    );
  };

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Tetris
        </h1>

        <div className="flex gap-8 items-start justify-center">
          {/* Main Game Board */}
          <div className="bg-slate-800/50 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
            <div
              className="grid gap-[2px] bg-slate-900 p-2 rounded-lg"
              style={{
                gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              }}
            >
              {displayBoard.map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${y}-${x}`}
                    className="w-8 h-8 rounded-sm border transition-colors"
                    style={{
                      backgroundColor: cell || '#1e293b',
                      borderColor: cell ? 'rgba(255, 255, 255, 0.3)' : '#334155',
                    }}
                  />
                ))
              )}
            </div>

            {/* Game Over Overlay */}
            {gameState.isGameOver && (
              <div className="mt-4 text-center">
                <div className="bg-red-600/90 text-white px-6 py-3 rounded-lg font-bold text-xl">
                  GAME OVER
                </div>
              </div>
            )}

            {/* Pause Overlay */}
            {gameState.isPaused && !gameState.isGameOver && (
              <div className="mt-4 text-center">
                <div className="bg-yellow-600/90 text-white px-6 py-3 rounded-lg font-bold text-xl">
                  PAUSED
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-slate-800/50 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-2 text-slate-300">Score</h2>
              <div className="text-4xl font-bold text-blue-400">{gameState.score}</div>
            </div>

            {/* Next Piece */}
            <div className="bg-slate-800/50 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 text-slate-300">Next</h2>
              {renderNextPiece()}
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 rounded-2xl shadow-xl p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold mb-4 text-slate-300">Controls</h2>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex justify-between">
                  <span>Move:</span>
                  <span className="text-slate-200">← →</span>
                </div>
                <div className="flex justify-between">
                  <span>Rotate:</span>
                  <span className="text-slate-200">↑</span>
                </div>
                <div className="flex justify-between">
                  <span>Soft Drop:</span>
                  <span className="text-slate-200">↓</span>
                </div>
                <div className="flex justify-between">
                  <span>Hard Drop:</span>
                  <span className="text-slate-200">Space</span>
                </div>
                <div className="flex justify-between">
                  <span>Pause:</span>
                  <span className="text-slate-200">Esc</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={startGame}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                aria-label="Start new game"
              >
                {gameState.isGameOver ? 'Restart Game' : 'New Game'}
              </button>
              {!gameState.isGameOver && (
                <button
                  onClick={togglePause}
                  className="w-full px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-semibold"
                  aria-label={gameState.isPaused ? 'Resume game' : 'Pause game'}
                >
                  {gameState.isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
