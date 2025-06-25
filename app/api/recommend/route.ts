// app/api/recommend/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Baccalaureate, bacTypes, SubjectId } from "@/lib/data/bac-types";
// Ensure your programs.json type is inferred or defined if needed
import programsData from "@/lib/data/programs.json";

// Define a type for your program data that includes the optional notes
interface ProgramData {
  code: string;
  major_ar: string;
  university_ar: string;
  campus_ar: string;
  field_ar: string;
  notes_ar?: string[]; // <-- This is the key field
  requirements: {
    bac_type: string;
    formula_modifier: any;
    min_score_2024: number | null;
  }[];
}

interface RequestData {
  bacType: string;
  scores: Partial<Record<SubjectId, number>>;
}

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

// ==============================================================================
// --- NEW, ROBUST PARSING AND SCORING ENGINE ---
// ==============================================================================

/**
 * NEW HELPER: Normalizes the scores object.
 * This is the MOST IMPORTANT part of the fix. It ensures that 'info' and 'algo' scores
 * are treated correctly for Bac Info students, and handles other potential aliases.
 */
const normalizeScores = (bacType: string, originalScores: Partial<Record<SubjectId, number>>): Partial<Record<SubjectId, number>> => {
  const normalized = { ...originalScores };

  // Rule 1: For 'Bac Info' students, the 'algo' score is the primary computer science grade.
  // If a formula needs 'info', it should use the 'algo' score.
  if (bacType === 'info' && normalized.algo) {
    normalized.info = normalized.info || normalized.algo;
  }
  
  // Rule 2: For 'Bac Eco' students, the 'ge' score is for 'Gestion'.
  // This is just an example of how we could add more rules if needed.
  // For now, the 'info' rule is the most critical one we've identified.

  return normalized;
};


/**
 * NEW, MORE POWERFUL PARSER for formula modifier keys.
 * This function can handle keys like:
 * "a"
 * "m+sp"
 * "(m+info)"
 * "2a+ang+f"
 */
const calculateModifierValue = (modifierKey: string, scores: Partial<Record<SubjectId, number>>): number => {
  let value = 0;
  // Standardize the key by removing parentheses and making it lowercase
  const keyToParse = modifierKey.toLowerCase().replace(/[()]/g, '');

  const parts = keyToParse.split('+');
  
  parts.forEach(part => {
    // Regex to find an optional coefficient and the subject ID
    const match = part.match(/^(\d*\.?\d*)?([a-z_]+)$/);
    
    if (match) {
        const coefficient = match[1] ? parseFloat(match[1]) : 1;
        const subjectId = match[2] as SubjectId;
        
        // Use the score if it exists, otherwise default to 0
        const score = scores[subjectId] || 0;
        value += score * coefficient;
    }
  });

  return value;
};


// ==============================================================================
// --- MAIN API HANDLER ---
// ==============================================================================

export async function POST(req: NextRequest) {
  try {
    const body: RequestData = await req.json();
    let { bacType, scores } = body;

    // Convert all incoming score keys to lowercase for consistency
    const lowercasedScores: Partial<Record<SubjectId, number>> = {};
    for (const key in scores) {
      lowercasedScores[key.toLowerCase() as SubjectId] = scores[key as SubjectId];
    }
    
    // --- APPLY THE NEW NORMALIZATION STEP ---
    const finalScores = normalizeScores(bacType, lowercasedScores);

    if (!bacType || !finalScores) {
      return NextResponse.json({ error: "Missing bacType or scores" }, { status: 400 });
    }

    const studentBac = bacTypes.find(b => b.id === bacType);
    if (!studentBac) {
      return NextResponse.json({ error: "Invalid bacType provided" }, { status: 400 });
    }

    // --- Calculate Formule Générale (FG) using the final, normalized scores ---
    let fgScore = 0;
    for (const subjectKey in studentBac.fg_formula) {
      const subjectId = subjectKey as SubjectId;
      const coefficient = studentBac.fg_formula[subjectId]!;
      const studentGrade = finalScores[subjectId] || 0;
      fgScore += studentGrade * coefficient;
    }

    const recommendations: RecommendedProgram[] = [];
    const typedProgramsData: ProgramData[] = programsData;

    typedProgramsData.forEach(program => {
      const requirement = program.requirements.find(r => r.bac_type === bacType);

      if (requirement && requirement.min_score_2024 !== null) {
        let totalScore = fgScore;
        
        // This loop now uses the more robust parser and the normalized scores
        for (const modifierKey in requirement.formula_modifier) {
          const coefficient = (requirement.formula_modifier as any)[modifierKey];
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
    // It's helpful to log the actual error on the server
    console.error("An error occurred in the recommendation engine:", error);
    return NextResponse.json({ error: "An internal server error occurred. Please check server logs." }, { status: 500 });
  }
}