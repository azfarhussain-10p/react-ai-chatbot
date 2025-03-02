// src/hooks/useRateLimiter.ts
import { useState, useEffect } from "react";

type RateLimiterConfig = {
  maxRequests: number;
  interval?: number;
};

export function useRateLimiter(config: RateLimiterConfig) {
  const { maxRequests, interval = 60000 } = config;
  const [requests, setRequests] = useState<number[]>([]);

  const currentCount = requests.filter(t => t > Date.now() - interval).length;
  const isLimited = currentCount >= maxRequests;

  const checkLimit = () => {
    setRequests(prev => [...prev, Date.now()]);
  };

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setRequests(prev => prev.filter(t => t > Date.now() - interval));
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, [interval]);

  return { 
    isLimited, 
    checkLimit, 
    currentCount, 
    maxRequests,
    remaining: maxRequests - currentCount,
    resetIn: Math.ceil((requests[0] + interval - Date.now()) / 1000)
  };
}