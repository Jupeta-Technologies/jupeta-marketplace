// components/hero-custom-content/CountdownTimer.tsx
'use client';
import React, { useState, useEffect, JSX } from 'react';

interface CountdownTimerProps {
  endTime: string; // ISO string for the end time
  message?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endTime, message = 'Sale ends in:' }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if ((timeLeft as any)[interval]) {
      timerComponents.push(
        <span key={interval} className="mx-1 font-mono text-2xl">
          {(timeLeft as any)[interval]} {interval}{" "}
        </span>
      );
    }
  });

  return (
    <div className="mt-4 text-center bg-black bg-opacity-50 text-white p-3 rounded-lg">
      <p className="text-lg">{message}</p>
      {timerComponents.length ? (
        <div>{timerComponents}</div>
      ) : (
        <p className="font-bold text-xl">Time's Up!</p>
      )}
    </div>
  );
};

export default CountdownTimer;