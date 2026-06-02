# ✂️ PromptShield

**Hybrid Semantic Prompt Injection Detector**

PromptShield detects and removes prompt injection attacks from clipboard content — 100% offline, no data sent anywhere.

## Features

- 🔍 **30+ injection patterns** — system overrides, compliance injections, jailbreak attempts
- 🛡️ **Obfuscation detection** — zero-width chars, Cyrillic/Greek homoglyphs, whitespace injection, HTML entities
- 🧹 **Smart cleaning** — block-level and line-level removal, preserves legitimate content (questions, MCQ options)
- 📊 **Risk scoring** — confidence score, severity level (Low / Medium / High / Critical)
- 🔎 **Diff view** — see exactly what was removed
- 🌙 **Dark / Light theme**
- 📋 **Clipboard integration** — paste in, copy out

## Architecture

```
src/
├── core/
│   ├── v11/
│   │   ├── UnicodeNormalizer.ts    # NFKC + homoglyph mapping
│   │   ├── PatternMatcher.ts       # Regex pattern engine
│   │   └── ObfuscationDetector.ts  # Obfuscation heuristics
│   ├── v12/
│   │   ├── SmartCleaner.ts         # Block + line cleaning
│   │   ├── ScoreAggregator.ts      # Score fusion
│   │   ├── PromptInjectionDetector.ts  # Main pipeline
│   │   └── patterns.ts             # Pattern library (30+)
│   └── index.ts
└── App.tsx                         # React UI
```

## Getting Started

```bash
npm install
npm run dev
npm run dev -- --host
```

Then open http://localhost:5173

## Build

```bash
npm run build
```

## How It Works

1. **Unicode normalization** — NFKC + zero-width char removal + homoglyph mapping
2. **Obfuscation detection** — flags Cyrillic/Greek substitutions, whitespace injection, HTML entities
3. **Pattern matching** — 30+ regex patterns across 4 categories with weighted scoring
4. **Smart cleaning** — iterative block removal, then line-level filtering; protects questions & MCQ options
5. **Score aggregation** — weighted fusion of pattern confidence, obfuscation confidence, and risk score
6. **Validation** — post-clean check for survivors and content integrity

# Disclaimer

PromptShield is a research and educational project developed for studying prompt injection detection, prompt sanitization techniques, and AI security concepts.

This software is provided for demonstration, learning, academic, and portfolio purposes only.

The developers make no guarantees regarding the accuracy, completeness, effectiveness, or suitability of the detection results. Users should not rely solely on PromptShield for securing production AI systems.

Users are solely responsible for how they use this software. The developers are not responsible for any direct, indirect, incidental, or consequential damages arising from the use or misuse of this project.

By using this project, you agree to use it in compliance with applicable laws, regulations, and ethical guidelines.

# Acceptable Use Policy

Users may use PromptShield for:

* Academic research
* Educational purposes
* Security testing of systems they own or are authorized to test
* AI safety research
* Demonstrations and portfolio evaluation

Users must not use PromptShield for:

* Unauthorized access to computer systems
* Circumventing security controls
* Academic cheating or examination misconduct
* Generating harmful, illegal, or deceptive content
* Violating the terms of service of third-party platforms

The developers reserve the right to restrict access to users who violate these guidelines.

# Privacy Notice

PromptShield stores analytics and usage statistics locally within the user's browser using Local Storage.

No personal information is transmitted to external servers.

The stored information may include:

* Number of prompt cleanups performed
* Feedback ratings
* Processing statistics
* Local session metrics

Users can clear this data at any time using the Reset Analytics feature.

PromptShield does not sell, share, or transmit personal information to third parties.

#Academic Integrity Notice: PromptShield is intended for cybersecurity education, AI safety research, and prompt security experimentation. It is not designed to facilitate academic dishonesty, examination misconduct, plagiarism, or unauthorized assistance during assessments.