// app/components/AdsenseAd.tsx
'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdsenseAdProps {
  publisherId: string;
  slotId: string;
  className?: string;
}

export function AdsenseAd({ publisherId, slotId, className = '' }: AdsenseAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err: unknown) {
      console.error("AdSense error:", err);
    }
  }, []);

  // Important: AdSense needs an empty `ins` tag to render the ad.
  // The key is set to the path to force re-renders on page change if needed.
  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '280px' }} // Example size, adjust as needed
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}