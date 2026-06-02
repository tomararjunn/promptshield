// src/core/v11/UnicodeNormalizer.ts

const LOOKALIKES: Record<string, string> = {
  'а': 'a', 'е': 'e', 'о': 'o', 'р': 'r', 'с': 'c', 'х': 'x', 'у': 'y', 'і': 'i',
  'А': 'A', 'Е': 'E', 'О': 'O', 'Р': 'R', 'С': 'C', 'Х': 'X', 'І': 'I',
  'ο': 'o', 'α': 'a', 'ε': 'e', 'ι': 'i', 'ρ': 'r', 'τ': 't', 'υ': 'y'
};

export class UnicodeNormalizer {
  normalize(text: string): string {
    // NFKC normalization (handles many Unicode issues)
    let out = text.normalize('NFKC');

    // Remove zero-width and invisible characters
    out = out.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060\u180E]/g, '');

    // Map homoglyphs to Latin equivalents
    out = out.split('').map(c => LOOKALIKES[c] ?? c).join('');

    return out;
  }
}
