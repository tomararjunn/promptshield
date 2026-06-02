// src/core/v11/ObfuscationDetector.ts

export interface ObfuscationResult {
  hasObfuscation: boolean;
  confidence: number;
  types: string[];
  normalizedText: string;
}

export class ObfuscationDetector {
  detect(text: string): ObfuscationResult {
    const types: string[] = [];
    let confidence = 0;
    let normalized = text;

    // Check for zero-width characters
    if (/[\u200B-\u200D\uFEFF\u00AD\u2060\u180E]/.test(normalized)) {
      types.push('Zero-width characters');
      confidence += 0.4;
      normalized = normalized.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060\u180E]/g, '');
    }

    // Check for Cyrillic lookalike substitution
    if (/[аеорсухіАЕОРСУХІ]/.test(normalized)) {
      types.push('Cyrillic homoglyphs');
      confidence += 0.35;
    }

    // Check for Greek lookalike substitution
    if (/[οαειρτυΟΑΕΙΡΤΥ]/.test(normalized)) {
      types.push('Greek homoglyphs');
      confidence += 0.3;
    }

    // Check for whitespace injection (i g n o r e)
    if (/(\w\s){5,}/.test(normalized)) {
      types.push('Whitespace injection');
      confidence += 0.25;
      normalized = normalized.replace(/\s+/g, '');
    }

    // Check for HTML entity encoding
    if (/&#\d+;|&[a-z]+;/.test(normalized)) {
      types.push('HTML entity encoding');
      confidence += 0.3;
    }

    // Check for mixed script obfuscation
    const hasLatin = /[a-zA-Z]/.test(normalized);
    const hasCyrillic = /[а-яА-Я]/.test(normalized);
    if (hasLatin && hasCyrillic) {
      types.push('Mixed script (Latin+Cyrillic)');
      confidence += 0.35;
    }

    return {
      hasObfuscation: types.length > 0,
      confidence: Math.min(1, confidence),
      types,
      normalizedText: normalized
    };
  }
}
