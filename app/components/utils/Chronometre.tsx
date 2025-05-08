import React, { useEffect, useState } from 'react';
import ThemedText from './ThemedText';

interface ChronometreProps {
  startTime: string;
}

function formatTime(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  if (hours > 0) {
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}m${seconds.toString().padStart(2, '0')}`;
  }
}

const Chronometre: React.FC<ChronometreProps> = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const update = () => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <ThemedText>{formatTime(elapsed)}</ThemedText>;
};

export default Chronometre; 