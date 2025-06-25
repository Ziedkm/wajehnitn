// app/components/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200/80 dark:border-gray-700/60 ${className}`}
    >
      {children}
    </div>
  );
}