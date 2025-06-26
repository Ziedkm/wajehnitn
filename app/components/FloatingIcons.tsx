// app/components/FloatingIcons.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

// SVG components for better reusability and control
const GraduationCap = () => (
  <svg className="w-20 h-20 text-gray-800 dark:text-blue-100/20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185"/>
</svg>

);

const Compass = () => (
  <svg className="w-20 h-20 text-gray-800 dark:text-blue-100/20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 7 2 2 4-4m-5-9v4h4V3h-4Z"/>
</svg>

);

const Book = () => (
    <svg className="w-20 h-20 text-gray-800 dark:text-blue-100/20" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fillRule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clipRule="evenodd"/>
</svg>

);


// The FloatingIcon component itself
interface FloatingIconProps {
  children: React.ReactNode;
  className?: string; // For positioning
  duration: number; // For animation speed
}

const FloatingIcon = ({ children, className, duration }: FloatingIconProps) => (
  <motion.div
    // Change -z-10 to z-0 or remove it, and control stacking from the parent page.
    className={`absolute text-blue-300/60 dark:text-cyan-400/30 ${className}`} 
    animate={{
      y: ["0%", "5%", "0%", "-5%", "0%"],
      x: ["0%", "-3%", "0%", "3%", "0%"],
      rotate: [0, 5, 0, -5, 0],
    }}
    transition={{
      duration: duration,
      ease: "easeInOut",
      repeat: Infinity,
    }}
  >
    {children}
  </motion.div>
);


export function FloatingIcons() {
  return (
    <>
      <FloatingIcon className="w-24 h-24 top-[10%] left-[5%]" duration={12}>
        <GraduationCap />
      </FloatingIcon>
      <FloatingIcon className="w-20 h-20 top-[15%] right-[10%]" duration={15}>
        <Compass />
      </FloatingIcon>
      <FloatingIcon className="w-28 h-28 bottom-[10%] right-[15%]" duration={18}>
        <Book />
      </FloatingIcon>
       <FloatingIcon className="w-16 h-16 bottom-[15%] left-[10%]" duration={10}>
        <Compass />
      </FloatingIcon>
    </>
  );
}