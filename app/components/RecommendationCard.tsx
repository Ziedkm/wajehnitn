'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RecommendedProgram } from '@/app/api/recommend/route';

interface RecommendationCardProps {
  rec: RecommendedProgram;
}

const formatScore = (score: number) => score.toFixed(2);

const getRecommendationStatus = (studentScore: number, minScore: number | null) => {
  if (minScore === null) {
    return { status: 'Possible', label: 'خيار ممكن', colorClasses: 'from-blue-500 to-cyan-500', textColor: 'text-blue-100', borderColor: 'border-blue-500/50' };
  }
  const difference = studentScore - minScore;
  if (difference >= -2) {
    return { status: 'Highly Recommended', label: 'موصى به بشدة', colorClasses: 'from-yellow-400 to-orange-500', textColor: 'text-yellow-900', borderColor: 'border-yellow-500/50' };
  } else if (difference < -10) {
    return { status: 'Not Recommended', label: 'غير موصى به', colorClasses: 'from-red-500 to-rose-500', textColor: 'text-red-100', borderColor: 'border-red-500/50' };
  } else {
    return { status: 'Possible', label: 'خيار ممكن', colorClasses: 'from-blue-500 to-cyan-500', textColor: 'text-blue-100', borderColor: 'border-blue-500/50' };
  }
};

export function RecommendationCard({ rec }: RecommendationCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { label, colorClasses, textColor, borderColor } = getRecommendationStatus(rec.student_score, rec.min_score_2024);
  const scoreDifference = rec.student_score - (rec.min_score_2024 || 0);
  const geographicBonusScore = rec.student_score * 1.07;
  const differenceColor = scoreDifference >= 0 ? 'text-green-400' : 'text-red-400';
  const differenceSign = scoreDifference >= 0 ? '+' : '';

  return (
    <div className="w-full mt-3 [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative w-full [transform-style:preserve-3d] transition-transform duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* --- Card Front --- */}
        <div className={`[backface-visibility:hidden] w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-2 ${borderColor} flex flex-col text-right cursor-pointer`}>
          <div className={`absolute -top-3 left-6 px-3 py-1 text-sm font-bold ${textColor} bg-gradient-to-r ${colorClasses} rounded-full shadow-md`}>
            {label}
          </div>
          

          
          <div className="flex-grow pt-4">
            <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">{rec.major_ar}</h4>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-base leading-relaxed">{rec.university_ar}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{rec.campus_ar}</p>
          </div>
          
          <div className="flex items-center space-x-2 mb-0">
            <span className="text-xl font-bold text-gray-800 dark:text-gray-200">الرمز : {rec.code} </span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">مجموع نقاطك</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatScore(rec.student_score)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">آخر مجموع (2024)</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rec.min_score_2024 ?? 'N/A'}</p>
            </div>
            
          </div>
          <div>
            
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">المجال</p>
                <p className="text-lg font-semibold text-blue-500 dark:text-blue-300">{rec.field_ar}</p>
            </div>
            <div className="mt-2">
                <p className="text-sm font-small text-gray-500 dark:text-grey-200">انقر على البطاقة لمزيد من التفاصيل</p>
            </div>
        </div>

        {/* --- Card Back --- */}
        <div className={`absolute top-0 left-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br ${colorClasses} p-6 rounded-2xl shadow-lg flex flex-col justify-between text-white cursor-pointer`}>
          <div>
            <h4 className="text-xl font-bold text-center">تفاصيل إضافية</h4>
            <div className="mt-4 w-full space-y-3 text-center">
              <div className="flex justify-between items-center bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                <p className={`font-bold text-2xl ${differenceColor}`} dir="ltr">{differenceSign}{formatScore(scoreDifference)}</p>
                <p className="text-sm font-medium">الفارق مع آخر مجموع</p>
              </div>
              <div className="flex justify-between items-center bg-black/30 backdrop-blur-sm p-3 rounded-lg">
                <p className="font-bold text-2xl text-cyan-300">{formatScore(geographicBonusScore)}</p>
                <p className="text-sm font-medium">مجموعك بالتنفيل الجغرافي (7%)</p>
              </div>
            </div>
          </div>
          
          {/* --- NEW: SPECIAL REQUIREMENTS SECTION --- */}
           
            <div className="w-full mt-4 bg-black/40 p-3 rounded-lg text-right">
              <div className="flex items-start space-x-2 space-x-reverse">
                <div className="flex-shrink-0 pt-1">
                  <svg className="w-7 h-7 text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l4.594 8.751c.636 1.21-.242 2.65-1.503 2.65H5.166c-1.261 0-2.139-1.44-1.503-2.65l4.594-8.751zM10 1.5a1.5 1.5 0 01.75.259l4.594 8.751c1.272 2.42-1.015 5.24-3.753 5.24H5.166c-2.738 0-5.025-2.82-3.753-5.24L5.507 1.759A1.5 1.5 0 0110 1.5z" clipRule="evenodd" />
                    <path d="M10 6a1 1 0 011 1v2a1 1 0 11-2 0V7a1 1 0 011-1zm1 6a1 1 0 10-2 0 1 1 0 002 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-yellow-300">متطلبات خاصة</h5>
                  <ul className="list-disc list-inside text-sm text-yellow-200/90 mt-1">
                    {Array.isArray(rec.notes_ar) && rec.notes_ar.length > 0 ? (
                      rec.notes_ar.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))
                    ) : (
                      <li>{"لا توجد متطلبات خاصة"}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          
          
          <p className="text-xs text-gray-300 text-center mt-2">انقر للعودة</p>
        </div>
      </motion.div>
    </div>
  );
}