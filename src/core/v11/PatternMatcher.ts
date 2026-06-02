// src/core/v11/PatternMatcher.ts

import {
  SYSTEM_PROMPT_PATTERNS,
  COMPLIANCE_PATTERNS,
  END_MARKER_PATTERNS,
  INSTRUCTION_OVERRIDE_PATTERNS,
  RISK_PATTERNS
} from '../v12/patterns';

export interface PatternMatchResult {
  confidence: number;
  matchedPatterns: string[];
  matchedRegexes: RegExp[];
  riskScore: number;
}

export class PatternMatcher {
  private allPatterns = [
    ...SYSTEM_PROMPT_PATTERNS.map(p => ({ pattern: p, name: 'system_prompt', weight: 0.3 })),
    ...COMPLIANCE_PATTERNS.map(p => ({ pattern: p, name: 'compliance', weight: 0.25 })),
    ...END_MARKER_PATTERNS.map(p => ({ pattern: p, name: 'end_marker', weight: 0.2 })),
    ...INSTRUCTION_OVERRIDE_PATTERNS.map(p => ({ pattern: p, name: 'instruction_override', weight: 0.35 })),
  ];

  match(text: string): PatternMatchResult {
    const matchedPatterns: string[] = [];
    const matchedRegexes: RegExp[] = [];
    let maxWeight = 0;
    let totalWeight = 0;

    for (const { pattern, name, weight } of this.allPatterns) {
      if (pattern.test(text)) {
        matchedPatterns.push(name);
        matchedRegexes.push(pattern);
        totalWeight += weight;
        maxWeight = Math.max(maxWeight, weight);
      }
    }

    // Calculate risk score from patterns
    let riskScore = 0;
    for (const { p, w } of RISK_PATTERNS) {
      if (p.test(text)) riskScore += w;
    }
    riskScore = Math.min(100, riskScore);

    // Confidence based on weight and count
    let confidence = maxWeight;
    if (matchedPatterns.length > 1) {
      confidence = Math.min(0.95, confidence + (matchedPatterns.length * 0.05));
    }

    return { confidence, matchedPatterns, matchedRegexes, riskScore };
  }
}
