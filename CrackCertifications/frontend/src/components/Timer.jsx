import { useState, useEffect, useRef } from 'react';
import '../styles/Timer.css';

export default function Timer({ duration, onTimeUp }) {
  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [duration, onTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining < 300;

  return (
    <span className={`timer ${isLow ? 'timer-warning' : ''}`}>
      ⏱ {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
}

