// src/core/v12/ScoreAggregator.ts

export interface AggregatedScore {
  finalScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  components: {
    patternScore: number;
    obfuscationScore: number;
    riskScore: number;
  };
}

export class ScoreAggregator {

  aggregate(
    patternConfidence: number,
    obfuscationConfidence: number,
    riskScore: number
  ): AggregatedScore {
    // Weighted combination
    let finalScore = (patternConfidence * 0.5) + (obfuscationConfidence * 0.3) + (riskScore / 100 * 0.2);

    // Boost if multiple signals present
    let signalCount = 0;
    if (patternConfidence > 0.3) signalCount++;
    if (obfuscationConfidence > 0.3) signalCount++;
    if (riskScore > 20) signalCount++;

    if (signalCount >= 2) {
      finalScore = Math.min(0.95, finalScore + 0.1);
    }

    finalScore = Math.max(0, Math.min(1, finalScore));

    let riskLevel: AggregatedScore['riskLevel'] = 'Low';
    if (finalScore >= 0.8) riskLevel = 'Critical';
    else if (finalScore >= 0.6) riskLevel = 'High';
    else if (finalScore >= 0.35) riskLevel = 'Medium';

    return {
      finalScore,
      riskLevel,
      components: {
        patternScore: patternConfidence,
        obfuscationScore: obfuscationConfidence,
        riskScore
      }
    };
  }
}
