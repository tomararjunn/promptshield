// src/core/v12/SmartCleaner.ts

import {
  START_MARKERS,
  END_STRINGS,
  QUESTION_PATTERNS,
  OPTION_PATTERNS,
  SYSTEM_PROMPT_PATTERNS,
  COMPLIANCE_PATTERNS,
  END_MARKER_PATTERNS,
  INSTRUCTION_OVERRIDE_PATTERNS
} from './patterns';

export interface CleanResult {
  cleaned: string;
  blocksRemoved: number;
  linesRemoved: number;
  method: 'block' | 'line' | 'none';
}

export class SmartCleaner {

  clean(text: string): CleanResult {
    let out = text;
    let blocksRemoved = 0;
    let linesRemoved = 0;
    let changed = true;
    let iterations = 0;
    const MAX_ITERATIONS = 20;

    // Step 1: Block-level removal (multi-line injection blocks)
    while (changed && iterations < MAX_ITERATIONS) {
      iterations++;
      changed = false;

      // Find the first start marker
      let blockStart = -1;
      for (const m of START_MARKERS) {
        const idx = out.toLowerCase().indexOf(m.toLowerCase());
        if (idx !== -1 && (blockStart === -1 || idx < blockStart)) {
          blockStart = idx;
        }
      }

      if (blockStart === -1) break;

      // Find line start
      let lineStart = blockStart;
      while (lineStart > 0 && out[lineStart - 1] !== '\n') lineStart--;

      // Find matching end marker
      let blockEnd = -1;
      let endLen = 0;
      for (const m of END_STRINGS) {
        const idx = out.toLowerCase().indexOf(m.toLowerCase(), blockStart);
        if (idx !== -1 && idx > blockEnd) {
          blockEnd = idx;
          endLen = m.length;
        }
      }

      if (blockEnd !== -1) {
        let lineEnd = blockEnd + endLen;
        while (lineEnd < out.length && out[lineEnd] !== '\n') lineEnd++;
        out = out.slice(0, lineStart) + out.slice(lineEnd);
        blocksRemoved++;
        changed = true;
      } else {
        // No end marker, remove to next double newline
        const nextBlank = out.indexOf('\n\n', blockStart);
        out = out.slice(0, lineStart) + (nextBlank !== -1 ? out.slice(nextBlank) : '');
        blocksRemoved++;
        changed = true;
      }
    }

    // Step 2: Score each block to protect legitimate content
    const blocks = out.split(/\n\s*\n+/);
    const scoredBlocks = blocks.map(block => ({
      text: block,
      score: this.scoreBlock(block)
    }));

    // Keep blocks with positive score (legitimate content)
    const keptBlocks = scoredBlocks.filter(b => b.score > -10).map(b => b.text);
    out = keptBlocks.join('\n\n');

    // Step 3: Line-level removal (individual injection lines)
    const lines = out.split('\n');
    const allKillPatterns = [
      ...SYSTEM_PROMPT_PATTERNS,
      ...COMPLIANCE_PATTERNS,
      ...END_MARKER_PATTERNS,
      ...INSTRUCTION_OVERRIDE_PATTERNS
    ];

    const filteredLines = lines.filter(line => {
      const trimmed = line.trim();
      if (!trimmed) return true;

      // Always keep questions and options
      if (QUESTION_PATTERNS.some(p => p.test(trimmed))) return true;
      if (OPTION_PATTERNS.some(p => p.test(trimmed))) return true;

      // Remove lines that match any kill pattern
      return !allKillPatterns.some(p => p.test(trimmed));
    });

    const linesBefore = out.split('\n').length;
    out = filteredLines.join('\n');
    linesRemoved = linesBefore - out.split('\n').length;

    // Clean up excessive blank lines
    out = out.replace(/\n{3,}/g, '\n\n').trim();

    const method = blocksRemoved > 0 ? 'block' : linesRemoved > 0 ? 'line' : 'none';

    return {
      cleaned: out || '[No valid content found]',
      blocksRemoved,
      linesRemoved,
      method
    };
  }

  private scoreBlock(block: string): number {
    let score = 0;

    // Positive indicators (protect this content)
    if (QUESTION_PATTERNS.some(p => p.test(block))) score += 50;
    if (OPTION_PATTERNS.some(p => p.test(block))) score += 40;
    if (block.split('\n').filter(l => l.trim()).length <= 2 && score === 0) score += 10;

    // Negative indicators (injection content)
    if (SYSTEM_PROMPT_PATTERNS.some(p => p.test(block))) score -= 60;
    if (COMPLIANCE_PATTERNS.some(p => p.test(block))) score -= 40;
    if (END_MARKER_PATTERNS.some(p => p.test(block))) score -= 30;
    if (INSTRUCTION_OVERRIDE_PATTERNS.some(p => p.test(block))) score -= 50;

    return score;
  }
}
