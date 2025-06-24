// app/components/ProcessedResults.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Card } from './Card';
import { RecommendationCard } from './RecommendationCard';
import { AdsenseAd } from './AdsenseAd';
import { RecommendedProgram } from '@/app/api/recommend/route';
import programsData from "@/lib/data/programs.json";

const uniqueFields = ['الكل', ...new Set(programsData.map(p => p.field_ar))];
const uniqueCampuses = ['الكل', ...new Set(programsData.map(p => p.campus_ar))];

interface ProcessedResultsProps {
  recommendations: RecommendedProgram[];
}

export function ProcessedResults({ recommendations }: ProcessedResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('الكل');
  const [selectedCampus, setSelectedCampus] = useState('الكل');

  // useMemo will re-calculate the filtered list only when its dependencies change.
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        rec.major_ar.toLowerCase().includes(searchLower) ||
        rec.university_ar.toLowerCase().includes(searchLower) ||
        rec.code.includes(searchLower);
      const matchesField = selectedField === 'الكل' || rec.field_ar === selectedField;
      const matchesCampus = selectedCampus === 'الكل' || rec.campus_ar === selectedCampus;
      return matchesSearch && matchesField && matchesCampus;
    });
  }, [recommendations, searchQuery, selectedField, selectedCampus]);

  // --- THE KEY FIX: Ad Injection Logic ---
  const resultsWithAds = useMemo(() => {
    const elements: React.ReactNode[] = [];
    filteredRecommendations.forEach((rec, index) => {
      elements.push(<RecommendationCard key={rec.code} rec={rec} />);
      
      // Inject an ad after the 5th card, and every 6 cards thereafter
      if ((index + 1) % 6 === 0) {
        // Use a unique key for the ad based on its position
        elements.push(
          <div key={`ad-${index}`} className="w-full my-4">
            <Card className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700">
                <AdsenseAd 
                  publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID!}
                  slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID!}
                />
                {/* Fallback text for local dev */}
                {/* <span className="text-gray-400">Ad Placeholder</span> */}
            </Card>
          </div>
        );
      }
    });
    return elements;
  }, [filteredRecommendations]);


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white">النتائج المقترحة</h3>

      <Card className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="...ابحث (بالاسم، الجامعة، أو الرمز)" className="md:col-span-1 mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <select value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)} className="md:col-span-1 mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-right">{uniqueCampuses.map(campus => (<option key={campus} value={campus}>{campus}</option>))}</select>
          <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="md:col-span-1 mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-right">{uniqueFields.map(field => <option key={field} value={field}>{field}</option>)}</select>
        </div>
      </Card>

      {filteredRecommendations.length === 0 && (
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/50 border-yellow-500">
          <p className="font-bold text-yellow-800 dark:text-yellow-300">لا توجد نتائج</p>
          <p className="text-yellow-700 dark:text-yellow-400">لا توجد نتائج تطابق بحثك أو معايير التصفية التي اخترتها.</p>
        </Card>
      )}

      {/* --- NEW RENDER LOGIC --- */}
      {/* This grid will contain both cards AND full-width ad blocks */}
      <div className="w-full">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
            <Masonry gutter="2rem">
                {/* Render the pre-processed list of cards. Ads are NOT in here. */}
                {filteredRecommendations.map(rec => (
                    <RecommendationCard key={rec.code} rec={rec} />
                ))}
            </Masonry>
        </ResponsiveMasonry>

        {/* This is a simplified way to inject ads, but let's do it better.
            The best approach is to modify the mapping logic.
        */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {resultsWithAds.map((element, index) => (
                <div key={index} className="break-inside-avoid">
                    {element}
                </div>
            ))}
        </div>

      </div>
    </motion.div>
  );
}