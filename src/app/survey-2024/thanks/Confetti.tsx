'use client';

import { useEffect, useState } from 'react';
import { default as ReactConfetti } from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

export default function Confetti() {
  const { width, height } = useWindowSize();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient &&
    width > 0 &&
    height > 0 &&
    width < Infinity &&
    height < Infinity ? (
    <ReactConfetti height={height} recycle={false} width={width} />
  ) : null;
}
