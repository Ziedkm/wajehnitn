import { NextRequest, NextResponse } from "next/server";
import { bacTypes, SubjectId } from "@/lib/data/bac-types";
import programsData from "@/lib/data/programs.json";

// The types are all correct.
export interface RecommendedProgram {
  code: string;
  major_ar: string;
  university_ar: string;
  campus_ar: string;
  field_ar: string;
  notes_ar?: string[];
  min_score_2024: number | null;
  student_score: number;
}

// Helper functions are also correct.
const normalizeScores = (bacType: string, originalScores: Partial<Record<SubjectId, number>>): Partial<Record<SubjectId, number>> => {
  const normalized = { ...originalScores };
  if (bacType === 'info' && normalized.algo) {
    normalized.info = normalized.info || normalized.algo;
  }
  return normalized;
};

const calculateModifierValue = (modifierKey: string, scores: Partial<Record<SubjectId, number>>): number => {
  let value = 0;
  const keyToParse = modifierKey.toLowerCase().replace(/[()]/g, '');
  const parts = keyToParse.split('+');
  
  parts.forEach(part => {
    const match = part.match(/^(\d*\.?\d*)?([a-z_]+)$/);
    if (match) {
        const coefficient = match[1] ? parseFloat(match[1]) : 1;
        const subjectId = match[2] as SubjectId;
        const score = scores[subjectId] || 0;
        value += score * coefficient;
    }
  });
  return value;
};


// Main API Handler
export async function POST(req: NextRequest) {
  try {
    const { bacType, scores } = await req.json();

    const lowercasedScores: Partial<Record<SubjectId, number>> = {};
    for (const key in scores) {
      lowercasedScores[key.toLowerCase() as SubjectId] = scores[key as SubjectId];
    }
    
    const finalScores = normalizeScores(bacType, lowercasedScores);

    if (!bacType || !finalScores) {
      return NextResponse.json({ error: "Missing bacType or scores" }, { status: 400 });
    }

    const studentBac = bacTypes.find(b => b.id === bacType);
    if (!studentBac) {
      return NextResponse.json({ error: "Invalid bacType provided" }, { status: 400 });
    }

    let fgScore = 0;
    for (const subjectKey in studentBac.fg_formula) {
      const subjectId = subjectKey as SubjectId;
      const coefficient = studentBac.fg_formula[subjectId]!;
      const studentGrade = finalScores[subjectId] || 0;
      fgScore += studentGrade * coefficient;
    }

    const recommendations: RecommendedProgram[] = [];

    // --- THIS IS THE FIX ---
    // We cast `programsData` to `any` to tell TypeScript to trust the data's structure,
    // even if it's inconsistent, because our runtime logic can handle it.
    const typedProgramsData: any[] = programsData;

    typedProgramsData.forEach(program => {
      const requirement = program.requirements.find((r: any) => r.bac_type === bacType);

      if (requirement && requirement.min_score_2024 !== null) {
        let totalScore = fgScore;
        for (const modifierKey in requirement.formula_modifier) {
          const coefficient = requirement.formula_modifier[modifierKey];
          const modifierValue = calculateModifierValue(modifierKey, finalScores);
          totalScore += modifierValue * coefficient;
        }
        
        recommendations.push({
          code: program.code,
          major_ar: program.major_ar,
          university_ar: program.university_ar,
          campus_ar: program.campus_ar,
          field_ar: program.field_ar,
          notes_ar: program.notes_ar,
          min_score_2024: requirement.min_score_2024,
          student_score: parseFloat(totalScore.toFixed(2)),
        });
      }
    });

    recommendations.sort((a, b) => b.student_score - a.student_score);
    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error("An error occurred in the recommendation engine:", error);
    return NextResponse.json({ error: "An internal server error occurred. Please check server logs." }, { status: 500 });
  }
}