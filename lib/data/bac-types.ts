// lib/data/bac-types.ts

// This type definition is correct and includes all possible subjects.
export type SubjectId =
  | "mg" | "math" | "sp" | "svt" | "ph" | "hg" | "a" | "f" | "ang"
  | "ec" | "ge" | "te" | "info" | "algo" | "sti" | "sb" | "ep"
  | "sp_sport" | "all" | "it" | "esp" | "edph" | "edar";

// The Subject interface is correct.
export interface Subject {
  id: SubjectId;
  name_ar: string;
  name_fr: string;
}

// The subjects constant (dictionary) is correct.
export const subjects: Record<SubjectId, Subject> = {
  mg: { id: "mg", name_ar: "المعدل النهائي", name_fr: "Moyenne Générale" },
  math: { id: "math", name_ar: "رياضيات", name_fr: "Mathématiques" },
  sp: { id: "sp", name_ar: "علوم فيزيائية", name_fr: "Sciences Physiques" },
  svt: { id: "svt", name_ar: "علوم الحياة واألرض", name_fr: "SVT" },
  ph: { id: "ph", name_ar: "فلسفة", name_fr: "Philosophie" },
  hg: { id: "hg", name_ar: "تاريخ وجغرافيا", name_fr: "Histoire-Géo" },
  a: { id: "a", name_ar: "عربية", name_fr: "Arabe" },
  f: { id: "f", name_ar: "فرنسية", name_fr: "Français" },
  ang: { id: "ang", name_ar: "إنقليزية", name_fr: "Anglais" },
  ec: { id: "ec", name_ar: "اقتصاد", name_fr: "Economie" },
  ge: { id: "ge", name_ar: "تصرف", name_fr: "Gestion" },
  te: { id: "te", name_ar: "تكنولوجيا", name_fr: "Technique" },
  info: { id: "info", name_ar: "إعالمية", name_fr: "Informatique" },
  algo: { id: "algo", name_ar: "خوارزميات وبرمجة", name_fr: "Algorithmique" },
  sti: { id: "sti", name_ar: "أنظمة وتكنولوجيات المعلوماتية", name_fr: "STI" },
  sb: { id: "sb", name_ar: "العلوم البيولوجية", name_fr: "Sc. Biologiques" },
  ep: { id: "ep", name_ar: "تربية بدنية", name_fr: "Educ. Physique" },
  edph: { id: "edph", name_ar: "EdPh", name_fr: "EdPh" },
  edar: { id: "edar", name_ar: "EdAr", name_fr: "EdAr" },
  sp_sport: { id: "sp_sport", name_ar: "اختصاص رياضي", name_fr: "Spé. Sportive" },
  all: { id: "all", name_ar: "ألمانية", name_fr: "Allemand" },
  it: { id: "it", name_ar: "إيطالية", name_fr: "Italien" },
  esp: { id: "esp", name_ar: "اسبانية", name_fr: "Espagnol" },
};

// The Baccalaureate interface is correct.
export interface Baccalaureate {
  id: string;
  name_ar: string;
  name_fr: string;
  required_subjects: SubjectId[];
  fg_formula: Partial<Record<SubjectId, number>>;
}

// --- THIS IS THE CORRECTED AND FINAL VERSION OF BACCALAUREATE DATA ---
export const bacTypes: Baccalaureate[] = [
  {
    id: "lettres",
    name_ar: "آداب",
    name_fr: "Lettres",
    required_subjects: ["mg", "a", "f", "ang", "ph", "hg", "info"],
    fg_formula: { mg: 4, a: 1.5, ph: 1.5, hg: 1, f: 1, ang: 1 },
  },
  {
    id: "math",
    name_ar: "رياضيات",
    name_fr: "Mathématiques",
    required_subjects: ["mg", "math", "sp", "f", "ang", "ph", "info", "svt","a"],
    fg_formula: { mg: 4, math: 2, sp: 1.5, svt: 0.5, f: 1, ang: 1 },
  },
  {
    id: "sciences_exp",
    name_ar: "علوم تجريبية",
    name_fr: "Sciences Expérimentales",
    required_subjects: ["mg", "svt", "sp", "math", "f", "ang", "ph", "info","a"],
    fg_formula: { mg: 4, math: 1, sp: 1.5, svt: 1.5, f: 1, ang: 1 },
  },
  {
    id: "eco",
    name_ar: "اقتصاد وتصرف",
    name_fr: "Économie et Gestion",
    required_subjects: ["mg", "ec", "ge", "math", "f", "ang", "hg", "ph", "info","a"],
    fg_formula: { mg: 4, ec: 1.5, ge: 1.5, math: 0.5, hg: 0.5, f: 1, ang: 1 },
  },
  {
    id: "sciences_tech",
    name_ar: "علوم تقنية",
    name_fr: "Sciences Techniques",
    required_subjects: ["mg", "te", "math", "sp", "f", "ang", "ph", "info","a"],
    fg_formula: { mg: 4, te: 1.5, math: 1.5, sp: 1, f: 1, ang: 1 },
  },
  {
    id: "info",
    name_ar: "علوم إعلامية",
    name_fr: "Sciences de l'Informatique",
    // This is the key fix you pointed out. We now show Algo and STI.
    required_subjects: ["mg", "algo", "sti", "math", "f", "ang", "ph", "sp","a"],
    fg_formula: { mg: 4, math: 1.5, algo: 1.5, sp: 0.5, sti: 0.5, f: 1, ang: 1 },
  },
  {
    id: "sports",
    name_ar: "رياضة",
    name_fr: "Sport",
    required_subjects: ["mg", "sp_sport", "sb", "ep", "sp", "ph", "f", "ang", "edph", "edar"],
    fg_formula: { mg: 4, sb: 1.5, sp_sport: 1, ep: 0.5, sp: 0.5, ph: 0.5, f: 1, ang: 1 },
  },
];