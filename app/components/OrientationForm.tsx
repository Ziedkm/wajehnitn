'use client';

import React, { useState, useMemo } from 'react';
import { bacTypes, subjects, SubjectId } from '@/lib/data/bac-types';
import { RecommendedProgram } from '@/app/api/recommend/route';
import programsData from "@/lib/data/programs.json";
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { RecommendationCard } from './RecommendationCard';
import { AdsenseAd } from './AdsenseAd';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const uniqueFields = ['الكل', ...new Set(programsData.map(p => p.field_ar))];
const uniqueCampuses = ['الكل', ...new Set(programsData.map(p => p.campus_ar))];
const optionalLanguages: SubjectId[] = ['all', 'it', 'esp'];

export default function OrientationForm() {
  const [selectedBacId, setSelectedBacId] = useState<string>('');
  const [scores, setScores] = useState<Partial<Record<SubjectId, number>>>({});
  const [addedOptionalSubjects, setAddedOptionalSubjects] = useState<SubjectId[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedProgram[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('الكل');
  const [selectedCampus, setSelectedCampus] = useState<string>('الكل');

  const handleBacTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBacId(e.target.value);
    setScores({});
    setAddedOptionalSubjects([]);
    setRecommendations([]);
    setError(null);
  };

  const handleScoreChange = (subjectId: SubjectId, value: string) => {
    setScores(prev => ({ ...prev, [subjectId]: parseFloat(value) || 0 }));
  };

  const addOptionalSubject = (subjectId: SubjectId) => {
    if (subjectId && !addedOptionalSubjects.includes(subjectId)) {
      setAddedOptionalSubjects(prev => [...prev, subjectId]);
    }
  };

  const removeOptionalSubject = (subjectIdToRemove: SubjectId) => {
    setAddedOptionalSubjects(prev => prev.filter(id => id !== subjectIdToRemove));
    setScores(prev => {
      const newScores = { ...prev };
      delete newScores[subjectIdToRemove];
      return newScores;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bacType: selectedBacId, scores }),
      });
      if (!response.ok) throw new Error('حدث خطأ أثناء جلب النتائج. يرجى التأكد من إدخال جميع المعدلات بشكل صحيح.');
      const data: RecommendedProgram[] = await response.json();
      setRecommendations(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBac = bacTypes.find(b => b.id === selectedBacId);
  
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(rec => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        rec.major_ar.toLowerCase().includes(searchLower) ||
        rec.university_ar.toLowerCase().includes(searchLower) ||
        rec.campus_ar.toLowerCase().includes(searchLower) ||
        rec.code.includes(searchLower);
      const matchesField = selectedField === 'الكل' || rec.field_ar === selectedField;
      const matchesCampus = selectedCampus === 'الكل' || rec.campus_ar === selectedCampus;
      return matchesSearch && matchesField && matchesCampus;
    });
  }, [recommendations, searchQuery, selectedField, selectedCampus]);

  const resultsWithAds = useMemo(() => {
    const adFrequency = 6;
    const adElement = (
        <div className="w-full h-auto bg-gray-200 dark:bg-gray-700/50 rounded-2xl overflow-hidden flex items-center justify-center p-4">
            <AdsenseAd 
                publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID!}
                slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID!}
            />
        </div>
    );

    const items: React.ReactNode[] = filteredRecommendations.map(rec => (
        <RecommendationCard key={rec.code} rec={rec} />
    ));

    // Inject ads into the items array
    for (let i = adFrequency; i < items.length; i += (adFrequency + 1)) {
        items.splice(i, 0, <div key={`ad-${i}`}>{adElement}</div>);
    }
    return items;
  }, [filteredRecommendations]);
  
  const availableOptionalLanguages = optionalLanguages.filter(lang => !addedOptionalSubjects.includes(lang));

  return (
    <div className="w-full">
      <Card>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">أدخل معلوماتك</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="bacType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right mb-2">شعبة البكالوريا</label>
              <select id="bacType" value={selectedBacId} onChange={handleBacTypeChange} required className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl text-right">
                <option value="" disabled>-- اختر شعبتك --</option>
                {bacTypes.map(bac => <option key={bac.id} value={bac.id}>{bac.name_ar}</option>)}
              </select>
            </div>
            {/* Field of interest moved to the filter bar below */}
          </div>
          <AnimatePresence>
            {selectedBac && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-5">
                  {selectedBac.required_subjects.map(subjectId => (
                    <div key={subjectId}>
                      <label htmlFor={subjectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right">{subjects[subjectId]?.name_ar}</label>
                      <input type="number" id={subjectId} name={subjectId} min="0" max="20" step="0.01" required onChange={(e) => handleScoreChange(subjectId, e.target.value)} className="mt-2 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center" placeholder="0.00" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <AnimatePresence>{addedOptionalSubjects.map(subjectId => (<motion.div key={subjectId} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="flex items-end space-x-2 space-x-reverse"><div className="flex-grow"><label htmlFor={subjectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-right">{subjects[subjectId]?.name_ar}</label><input type="number" id={subjectId} name={subjectId} min="0" max="20" step="0.01" required onChange={(e) => handleScoreChange(subjectId, e.target.value)} className="mt-2 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center" placeholder="0.00" /></div><button type="button" onClick={() => removeOptionalSubject(subjectId)} className="p-2 h-10 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button></motion.div>))}</AnimatePresence>
                  {availableOptionalLanguages.length > 0 && (<select onChange={(e) => addOptionalSubject(e.target.value as SubjectId)} value="" className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl text-right"><option value="" disabled>-- إضافة لغة اختيارية --</option>{availableOptionalLanguages.map(langId => <option key={langId} value={langId}>{subjects[langId].name_ar}</option>)}</select>)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="pt-4">
            <Button type="submit" disabled={isLoading || !selectedBacId}>
              {isLoading ? '...جاري البحث' : 'ابحث عن توجيهك'}
            </Button>
          </div>
        </form>
      </Card>
      
      <div className="mt-16 w-full">
        {error && <p className="text-center text-red-500">{error}</p>}
        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white">النتائج المقترحة</h3>
              
              <Card className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث (بالاسم، الجامعة، أو الرمز)" className="md:col-span-1 mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <select value={selectedCampus} onChange={(e) => setSelectedCampus(e.target.value)} className="md:col-span-1 mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-right">{uniqueCampuses.map(campus => (<option key={campus} value={campus}>{campus}</option>))}</select>
                  <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="md:col-span-1 mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-right">{uniqueFields.map(field => <option key={field} value={field}>{field}</option>)}</select>
                </div>
              </Card>

              {filteredRecommendations.length === 0 && recommendations.length > 0 && (
                <Card className="text-center bg-yellow-50 dark:bg-yellow-900/50 border-yellow-500">
                  <p className="font-bold text-yellow-800 dark:text-yellow-300">لا توجد نتائج</p>
                  <p className="text-yellow-700 dark:text-yellow-400">لا توجد نتائج تطابق بحثك أو معايير التصفية التي اخترتها.</p>
                </Card>
              )}
              
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                <Masonry gutter="2rem">
                  {resultsWithAds}
                </Masonry>
              </ResponsiveMasonry>
              
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}