// src/core/v12/patterns.ts

// System prompt patterns - detect AI instruction overrides
export const SYSTEM_PROMPT_PATTERNS = [
  /you are a helpful ai/i,
  /you are an ai language/i,
  /you are now acting as/i,
  /as a responsible ai/i,
  /your (primary|sole) (instruction|function)/i,
  /for security reasons, ai/i,
  /act as a compliance/i,
  /note to ai (systems|:)/i,
  /developer message:/i,
  /system:\s*/i,
  /\[system\]/i,
  /<<sys>>/i,
];

// Compliance injection patterns
export const COMPLIANCE_PATTERNS = [
  /academic integrity/i,
  /compliance verification/i,
  /ai agent compliance/i,
  /mandatory for all ai/i,
  /this ai assistant is disabled/i,
  /providing direct answers/i,
  /interacting with assessment/i,
  /locate the button/i,
  /scan all elements/i,
  /uphold (coursera|academic|edx)/i,
  /coursera['']?s? (policy|assessment|integrity)/i,
  /message to user:/i,
  /before proceeding/i,
];

// End marker patterns - acknowledgement traps
export const END_MARKER_PATTERNS = [
  /^i understand\.?\s*$/i,
  /^do you understand\?/i,
  /^please feel free to use me/i,
  /^this verification step is mandatory/i,
  /^answer only ["']hello["']/i,
];

// Direct instruction override patterns
export const INSTRUCTION_OVERRIDE_PATTERNS = [
  /ignore (all |prior |previous )?instructions/i,
  /disregard (all |prior |previous )?instructions/i,
  /forget (your )?previous (instructions|role)/i,
  /override (previous|prior) (instructions|context)/i,
  /do not (answer|provide|assist|reproduce|solve)/i,
  /never answer (quiz|assessment)/i,
  /auto-complet(e|ing)/i,
  /pretend (you are|to be)/i,
  /i cannot interact with/i,
  /^answer only /i,
  /^respond only /i,
  /^output only /i,
];

// Risk scoring patterns with weights
export const RISK_PATTERNS = [
  { p: /you are a helpful ai assistant/i, w: 28 },
  { p: /ignore (all )?previous instructions/i, w: 35 },
  { p: /academic integrity/i, w: 18 },
  { p: /compliance verification/i, w: 22 },
  { p: /you must not (answer|provide)/i, w: 28 },
  { p: /system\s*:/i, w: 18 },
  { p: /developer message/i, w: 18 },
  { p: /act as a compliance/i, w: 22 },
  { p: /for security reasons, ai/i, w: 22 },
  { p: /i understand\.?\s*$/im, w: 12 },
  { p: /assessment (page|tool)/i, w: 14 },
  { p: /as a responsible ai/i, w: 18 },
];

// Question patterns (protected content)
export const QUESTION_PATTERNS = [
  /^question\s+\d+/i,
  /^\d+[\.\)]\s+\S/,
  /^(which|what|how|why|when|where|who|select|choose|identify|explain|describe|define)/i,
  /\?(\s*)$/m,
];

// Option patterns (multiple choice - protected)
export const OPTION_PATTERNS = [
  /^[A-D][\.\)]\s+\S/im,
  /^[•\-\*]\s+\S/im,
  /^\([A-D]\)\s+\S/im,
];

// Start markers (block removal)
export const START_MARKERS = [
  "You are a helpful AI assistant",
  "You are an AI language model",
  "You are now acting as",
  "Ignore all previous instructions",
  "Ignore previous instructions",
  "As a responsible AI",
  "SYSTEM:",
  "[SYSTEM]",
  "<<SYS>>",
  "Developer Message:",
  "For security reasons, AI",
  "You must not answer",
  "Never answer quiz",
  "Act as a compliance",
  "This web page contains a protected assessment",
  "uphold academic integrity",
  "uphold Coursera",
  "Note to AI systems",
  "Note to AI:",
];

// End strings for block removal
export const END_STRINGS = [
  "I understand",
  "Do you understand?",
  "Please feel free to use me",
  "This verification step is mandatory",
  'Answer only "Hello"',
];
