import { useEffect } from 'react';

interface KeyboardControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  enabled: boolean;
}

export function useKeyboardControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onPause,
  enabled,
}: KeyboardControlsProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for game keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Escape'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
          onMoveLeft();
          break;
        case 'ArrowRight':
          onMoveRight();
          break;
        case 'ArrowDown':
          onMoveDown();
          break;
        case 'ArrowUp':
          onRotate();
          break;
        case ' ':
          onHardDrop();
          break;
        case 'Escape':
          onPause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop, onPause]);
}
