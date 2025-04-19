import { useState, useCallback } from 'react';

export default function useSnackBar() {
  const [color, setColor] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const getColor = (type: string) => {
    if (type === 'error') {
      return 'red';
    }
    if (type === 'info') {
      return 'green';
    }
    return '#333333';
  };

  const setSnackBar = useCallback(
    (type: 'error' | 'info', messageText: string) => {
      const newColor = getColor(type);
      setColor(newColor);
      setMessage(messageText);
      setOpen(true);
    },
    []
  );

  return {
    color,
    open,
    message,
    setOpen,
    setSnackBar,
  };
}
