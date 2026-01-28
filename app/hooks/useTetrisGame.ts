import { useState, useCallback, useRef } from 'react';

import type { GameState, Tetromino } from '@/app/types/tetris';
import {
  createEmptyBoard,
  createTetromino,
  checkCollision,
  mergePieceToBoard,
  clearLines,
  rotatePiece,
  calculateScore,
} from '@/app/utils/tetris';

export function useTetrisGame() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: createTetromino(),
    nextPiece: createTetromino(),
    score: 0,
    isGameOver: false,
    isPaused: false,
  }));

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const movePiece = useCallback(
    (deltaX: number, deltaY: number): boolean => {
      if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) {
        return false;
      }

      const collision = checkCollision(
        gameState.board,
        gameState.currentPiece,
        deltaX,
        deltaY
      );

      if (!collision) {
        setGameState((prev) => ({
          ...prev,
          currentPiece: prev.currentPiece
            ? {
                ...prev.currentPiece,
                position: {
                  x: prev.currentPiece.position.x + deltaX,
                  y: prev.currentPiece.position.y + deltaY,
                },
              }
            : null,
        }));
        return true;
      }

      return false;
    },
    [gameState.isGameOver, gameState.isPaused, gameState.currentPiece, gameState.board]
  );

  const rotate = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) {
      return;
    }

    const rotatedPiece = rotatePiece(gameState.currentPiece);
    const collision = checkCollision(gameState.board, rotatedPiece);

    if (!collision) {
      setGameState((prev) => ({
        ...prev,
        currentPiece: rotatedPiece,
      }));
    }
  }, [gameState.isGameOver, gameState.isPaused, gameState.currentPiece, gameState.board]);

  const hardDrop = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) {
      return;
    }

    let dropDistance = 0;
    while (
      !checkCollision(
        gameState.board,
        gameState.currentPiece,
        0,
        dropDistance + 1
      )
    ) {
      dropDistance++;
    }

    setGameState((prev) => ({
      ...prev,
      currentPiece: prev.currentPiece
        ? {
            ...prev.currentPiece,
            position: {
              x: prev.currentPiece.position.x,
              y: prev.currentPiece.position.y + dropDistance,
            },
          }
        : null,
    }));

    // Trigger immediate lock
    setTimeout(() => lockPiece(), 0);
  }, [gameState.isGameOver, gameState.isPaused, gameState.currentPiece, gameState.board]);

  const lockPiece = useCallback(() => {
    if (!gameState.currentPiece) return;

    // Merge piece to board
    let newBoard = mergePieceToBoard(gameState.board, gameState.currentPiece);

    // Clear lines
    const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
    const newScore = calculateScore(linesCleared, gameState.score);

    // Spawn next piece
    const nextPiece = gameState.nextPiece || createTetromino();
    const newNextPiece = createTetromino();

    // Check game over
    const isGameOver = checkCollision(clearedBoard, nextPiece);

    setGameState({
      board: clearedBoard,
      currentPiece: isGameOver ? null : nextPiece,
      nextPiece: newNextPiece,
      score: newScore,
      isGameOver,
      isPaused: false,
    });
  }, [gameState]);

  const tick = useCallback(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      return;
    }

    const moved = movePiece(0, 1);
    if (!moved) {
      lockPiece();
    }
  }, [gameState.isGameOver, gameState.isPaused, movePiece, lockPiece]);

  const startGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: createTetromino(),
      nextPiece: createTetromino(),
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  const togglePause = useCallback(() => {
    if (!gameState.isGameOver) {
      setGameState((prev) => ({
        ...prev,
        isPaused: !prev.isPaused,
      }));
    }
  }, [gameState.isGameOver]);

  return {
    gameState,
    movePiece,
    rotate,
    hardDrop,
    tick,
    startGame,
    togglePause,
    gameLoopRef,
  };
}
