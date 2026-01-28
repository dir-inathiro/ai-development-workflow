import type { Tetromino, TetrominoType } from '@/app/types/tetris';
import {
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '@/app/types/tetris';

export function createEmptyBoard(): (string | null)[][] {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

export function createTetromino(type?: TetrominoType): Tetromino {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const selectedType = type || types[Math.floor(Math.random() * types.length)];

  return {
    type: selectedType,
    shape: TETROMINO_SHAPES[selectedType],
    color: TETROMINO_COLORS[selectedType],
    position: {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINO_SHAPES[selectedType][0].length / 2),
      y: 0,
    },
  };
}

export function checkCollision(
  board: (string | null)[][],
  piece: Tetromino,
  offsetX = 0,
  offsetY = 0
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;

        // Check bounds
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        // Check if cell is occupied (but allow negative Y for spawning)
        if (newY >= 0 && board[newY][newX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

export function mergePieceToBoard(
  board: (string | null)[][],
  piece: Tetromino
): (string | null)[][] {
  const newBoard = board.map((row) => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: (string | null)[][]): {
  newBoard: (string | null)[][];
  linesCleared: number;
} {
  let linesCleared = 0;
  const newBoard = board.filter((row) => {
    if (row.every((cell) => cell !== null)) {
      linesCleared++;
      return false;
    }
    return true;
  });

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }

  return { newBoard, linesCleared };
}

export function rotatePiece(piece: Tetromino): Tetromino {
  // O piece doesn't rotate
  if (piece.type === 'O') {
    return piece;
  }

  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map((row) => row[index]).reverse()
  );

  return {
    ...piece,
    shape: newShape,
  };
}

export function calculateScore(linesCleared: number, currentScore: number): number {
  const points = [0, 100, 300, 500, 800];
  return currentScore + points[Math.min(linesCleared, 4)];
}
