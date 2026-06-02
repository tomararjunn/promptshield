// src/core/v12/PromptInjectionDetector.ts

import { UnicodeNormalizer } from '../v11/UnicodeNormalizer';
import { PatternMatcher } from '../v11/PatternMatcher';
import { ObfuscationDetector } from '../v11/ObfuscationDetector';
import { SmartCleaner } from './SmartCleaner';
import { ScoreAggregator } from './ScoreAggregator';

export interface DetectionResult {
  detected: boolean;
  confidence: number;
  riskScore: number;
  severity: string;
  cleaned: string;
  charsRemoved: number;
  blocksRemoved: number;
  linesRemoved: number;
  cleanMethod: string;
  injectionTypes: string[];
  matchedPatterns: string[];
  obfuscation: {
    hasObfuscation: boolean;
    confidence: number;
    types: string[];
  };
  validationPassed: boolean;
  validationIssues: string[];
}

export class PromptInjectionDetectorV12 {
  private unicode: UnicodeNormalizer;
  private patternMatcher: PatternMatcher;
  private obfuscationDetector: ObfuscationDetector;
  private cleaner: SmartCleaner;
  private scoreAggregator: ScoreAggregator;

  constructor() {
    this.unicode = new UnicodeNormalizer();
    this.patternMatcher = new PatternMatcher();
    this.obfuscationDetector = new ObfuscationDetector();
    this.cleaner = new SmartCleaner();
    this.scoreAggregator = new ScoreAggregator();
  }

  detect(text: string): DetectionResult {
    // Step 1: Normalize Unicode
    const normalized = this.unicode.normalize(text);

    // Step 2: Detect obfuscation
    const obfuscation = this.obfuscationDetector.detect(text);

    // Step 3: Pattern matching on normalized text
    const patternResult = this.patternMatcher.match(obfuscation.normalizedText);

    // Step 4: Clean the text (remove injections)
    const cleanResult = this.cleaner.clean(normalized);

    // Step 5: Aggregate scores
    const aggregated = this.scoreAggregator.aggregate(
      patternResult.confidence,
      obfuscation.confidence,
      patternResult.riskScore
    );

    // Step 6: Determine detection
    const detected = aggregated.finalScore > 0.25;

    // Step 7: Validation
    const validationIssues: string[] = [];
    const SURVIVOR_PATTERNS = [
      /you are a helpful ai/i, /ignore (all )?previous instructions/i,
      /you must not (answer|provide|assist)/i, /academic integrity/i, /act as a/i
    ];

    for (const p of SURVIVOR_PATTERNS) {
      if (p.test(cleanResult.cleaned)) {
        validationIssues.push(`Possible survivor: ${p.source}`);
      }
    }

    if (cleanResult.cleaned.length < 10) {
      validationIssues.push('Output suspiciously short');
    }

    const hasQuestion = /(which|what|how|why|when|where|who|\?)/i.test(cleanResult.cleaned);
    if (!hasQuestion && text.includes('?')) {
      validationIssues.push('No question detected in output');
    }

    const validationPassed = validationIssues.length === 0;

    // Step 8: Collect injection types
    const injectionTypes: string[] = [];
    if (patternResult.matchedPatterns.includes('system_prompt')) injectionTypes.push('System Override');
    if (patternResult.matchedPatterns.includes('compliance')) injectionTypes.push('Compliance Injection');
    if (patternResult.matchedPatterns.includes('end_marker')) injectionTypes.push('Acknowledgement Trap');
    if (patternResult.matchedPatterns.includes('instruction_override')) injectionTypes.push('Instruction Override');

    if (/ignore (all )?previous instructions/i.test(obfuscation.normalizedText)) {
      injectionTypes.push('Jailbreak Attempt');
    }

    const charsRemoved = Math.max(0, text.length - cleanResult.cleaned.length);

    return {
      detected,
      confidence: aggregated.finalScore,
      riskScore: patternResult.riskScore,
      severity: aggregated.riskLevel,
      cleaned: cleanResult.cleaned,
      charsRemoved,
      blocksRemoved: cleanResult.blocksRemoved,
      linesRemoved: cleanResult.linesRemoved,
      cleanMethod: cleanResult.method,
      injectionTypes,
      matchedPatterns: patternResult.matchedPatterns,
      obfuscation: {
        hasObfuscation: obfuscation.hasObfuscation,
        confidence: obfuscation.confidence,
        types: obfuscation.types
      },
      validationPassed,
      validationIssues
    };
  }
}
