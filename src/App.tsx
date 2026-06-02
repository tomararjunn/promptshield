// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { PromptInjectionDetectorV12 } from './core';

const detector = new PromptInjectionDetectorV12();

// Feedback Popup Component
const FeedbackPopup: React.FC<{
  isOpen: boolean;
  submitted: boolean;
  rating: number | null;
  onRate: (rating: number) => void;
  onClose: () => void;
  isDark: boolean;
}> = ({ isOpen, submitted, rating, onRate, onClose, isDark }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        zIndex: 1000,
        background: isDark ? 'rgba(20, 20, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '20px',
        padding: '20px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        minWidth: '260px',
        textAlign: 'center',
        animation: 'fadeInUp 0.3s ease',
      }}
    >
      {submitted ? (
        <div>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
          <div style={{ fontWeight: 600 }}>Thanks for your feedback!</div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '8px', fontSize: '14px', opacity: 0.8 }}>
            ✓ Copied successfully!
          </div>
          <div style={{ marginBottom: '12px', fontWeight: 600, fontSize: '13px' }}>
            How was your experience?
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onRate(star)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '28px',
                  padding: '4px',
                  transition: 'transform 0.1s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span style={{ color: rating !== null && star <= rating ? '#f5a623' : '#ccc' }}>
                  ★
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '11px',
              opacity: 0.5,
              cursor: 'pointer',
            }}
          >
            Not now
          </button>
        </>
      )}
    </div>
  );
};

// Particle Background Component - Optimized for performance
const ParticleBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number; size: number; alpha: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;

    const initParticles = () => {
      const particleCount = Math.min(80, Math.floor(width * height / 10000));
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      frame++;
      const shouldConnect = frame % 30 === 0;
      
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark 
          ? `rgba(124, 92, 252, ${p.alpha})` 
          : `rgba(124, 92, 252, ${p.alpha * 0.4})`;
        ctx.fill();
      });

      if (shouldConnect) {
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const dx = particlesRef.current[i].x - particlesRef.current[j].x;
            const dy = particlesRef.current[i].y - particlesRef.current[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
              ctx.strokeStyle = isDark 
                ? `rgba(124, 92, 252, ${0.15 * (1 - dist / 100)})`
                : `rgba(124, 92, 252, ${0.05 * (1 - dist / 100)})`;
              ctx.stroke();
            }
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [showDiff, setShowDiff] = useState(false);
  const [history, setHistory] = useState<Array<{ original: string; cleaned: string }>>([]);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Feedback states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isDark = theme === 'dark';

  // Force body background to change with theme
  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#0c0c0f' : '#f5f4ef';
    document.body.style.transition = 'background-color 0.3s ease';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, [isDark]);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const r = detector.detect(input);
    setResult(r);
    setOutput(r.cleaned);
    setHistory((prev) => [{ original: input, cleaned: r.cleaned }, ...prev].slice(0, 10));
    setLoading(false);
  };

  // Show feedback popup after copy
  const triggerFeedback = () => {
    setShowFeedback(true);
  };

  // Handle star rating click
  const handleRating = (rating: number) => {
    setFeedbackRating(rating);
    setFeedbackSubmitted(true);
    
    // Save feedback to localStorage
    const feedbacks = JSON.parse(localStorage.getItem('promptshield_feedback') || '[]');
    feedbacks.push({
      rating,
      timestamp: Date.now(),
      textLength: input.length,
      cleanedLength: output.length,
    });
    localStorage.setItem('promptshield_feedback', JSON.stringify(feedbacks.slice(-100)));
    
    // Hide popup after 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
      setTimeout(() => {
        setFeedbackRating(null);
        setFeedbackSubmitted(false);
      }, 300);
    }, 2000);
  };

  // Close feedback popup
  const closeFeedback = () => {
    setShowFeedback(false);
    setTimeout(() => {
      setFeedbackRating(null);
      setFeedbackSubmitted(false);
    }, 300);
  };

  // Robust copy function with mobile fallbacks
  const copyOut = async () => {
    if (!output) return;

    // Visual feedback immediately
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    try {
      // Modern Clipboard API (works in secure contexts)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(output);
        triggerFeedback();
        return;
      }
      
      // Fallback for older browsers / non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = output;
      
      // Make textarea invisible but keep it in DOM
      textArea.style.position = 'fixed';
      textArea.style.top = '-9999px';
      textArea.style.left = '-9999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      
      document.body.appendChild(textArea);
      
      // Select and copy
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, output.length);
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (success) {
        triggerFeedback();
      } else {
        throw new Error('execCommand failed');
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      alert('Copy failed. Please select the text and copy manually.');
      setCopied(false);
    }
  };

  const pasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      alert('Unable to read clipboard');
    }
  };

  const reset = () => {
    setInput('');
    setOutput('');
    setResult(null);
    setShowDiff(false);
  };

  const undoLast = () => {
    if (history.length === 0) return;
    setInput(history[0].original);
    setOutput(history[0].cleaned);
    setHistory((prev) => prev.slice(1));
  };

  const diff = input && output ? buildDiff(input, output) : null;

  const sevColor = (s: string) => {
    if (s === 'Critical') return '#f04f58';
    if (s === 'High') return '#f5a623';
    if (s === 'Medium') return '#60a5fa';
    return '#3ecf8e';
  };

  const glassPanel = {
    background: isDark ? 'rgba(20, 20, 30, 0.65)' : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'}`,
    boxShadow: isDark 
      ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(124, 92, 252, 0.1)' 
      : '0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(124, 92, 252, 0.05)',
    transition: 'all 0.3s ease',
  };

  const styles = {
    container: {
      position: 'relative' as const,
      zIndex: 1,
      maxWidth: '1400px',
      margin: '0 auto',
      padding: isMobile ? '16px' : '24px',
      minHeight: '100vh',
      color: isDark ? '#e8e8f0' : '#1a1916',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    header: { textAlign: 'center' as const, marginBottom: isMobile ? '28px' : '40px' },
    title: {
      fontSize: isMobile ? '2rem' : '2.8rem',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #7c5cfc, #a78bfa, #7c5cfc)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      animation: 'gradient 3s ease infinite',
    },
    subtitle: { opacity: 0.85, marginTop: '8px', fontSize: isMobile ? '0.9rem' : '1rem', color: isDark ? '#c0c0e0' : '#2a2a3a' },
    themeBtn: {
      position: 'fixed' as const,
      top: isMobile ? '16px' : '24px',
      right: isMobile ? '16px' : '24px',
      width: isMobile ? '44px' : '48px',
      height: isMobile ? '44px' : '48px',
      borderRadius: '24px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}`,
      background: isDark ? 'rgba(30,30,40,0.8)' : 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(12px)',
      cursor: 'pointer',
      fontSize: isMobile ? '20px' : '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      transition: 'transform 0.2s, background 0.2s',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    buttonContainer: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, auto)',
      gap: '12px',
      marginBottom: '28px',
      justifyContent: isMobile ? 'stretch' : 'center',
    },
    button: {
      padding: isMobile ? '14px 0' : '12px 24px',
      minHeight: isMobile ? '48px' : '44px',
      borderRadius: '40px',
      border: 'none',
      background: 'linear-gradient(135deg, #7c5cfc, #5c3cfc)',
      color: 'white',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '14px',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 15px rgba(124, 92, 252, 0.3)',
    },
    buttonSecondary: {
      padding: isMobile ? '14px 0' : '12px 20px',
      minHeight: isMobile ? '48px' : '44px',
      borderRadius: '40px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}`,
      background: isDark ? 'rgba(30,30,40,0.5)' : 'rgba(255,255,255,0.5)',
      backdropFilter: 'blur(8px)',
      color: isDark ? '#e8e8f0' : '#1a1916',
      cursor: 'pointer',
      fontSize: isMobile ? '14px' : '14px',
      transition: 'all 0.2s ease',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '20px' : '28px',
      marginBottom: '28px',
    },
    panel: {
      ...glassPanel,
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    panelHeader: {
      padding: isMobile ? '14px 18px' : '18px 24px',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      fontWeight: 500,
      display: 'flex',
      justifyContent: 'space-between',
      letterSpacing: '0.5px',
    },
    textarea: {
      width: '100%',
      minHeight: isMobile ? '280px' : '400px',
      padding: '20px',
      background: isDark ? 'rgba(12, 12, 15, 0.4)' : 'rgba(250, 250, 247, 0.4)',
      color: isDark ? '#e8e8f0' : '#1a1916',
      border: 'none',
      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
      fontSize: isMobile ? '14px' : '13px',
      lineHeight: 1.7,
      resize: 'vertical' as const,
      outline: 'none',
    },
    outputArea: {
      padding: '20px',
      minHeight: isMobile ? '280px' : '400px',
      fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
      fontSize: isMobile ? '14px' : '13px',
      lineHeight: 1.7,
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-word' as const,
      color: '#3ecf8e',
      overflow: 'auto',
    },
    riskCard: {
      ...glassPanel,
      padding: isMobile ? '20px' : '24px',
      marginTop: '8px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: '16px',
      marginTop: '20px',
    },
    statBox: {
      textAlign: 'center' as const,
      padding: '18px 12px',
      background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
      borderRadius: '20px',
      transition: 'transform 0.2s, background 0.2s',
    },
    smallText: { fontSize: '11px', opacity: 0.6, marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '1px' },
    largeText: { fontSize: isMobile ? '22px' : '28px', fontWeight: 700 },
    mediumText: { fontSize: isMobile ? '18px' : '20px', fontWeight: 700 },
    tagContainer: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '10px',
      marginTop: '12px',
    },
    tag: {
      padding: '6px 14px',
      background: 'rgba(124, 92, 252, 0.15)',
      borderRadius: '40px',
      fontSize: '12px',
      fontWeight: 500,
      backdropFilter: 'blur(4px)',
    },
    metaRow: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      gap: '16px',
      marginTop: '20px',
      paddingTop: '16px',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}`,
      fontSize: '12px',
      opacity: 0.7,
    },
    validationBox: {
      marginTop: '16px',
      padding: '12px 16px',
      background: 'rgba(245,166,35,0.1)',
      borderRadius: '16px',
      fontSize: '12px',
      border: '1px solid rgba(245,166,35,0.2)',
    },
    footer: {
      textAlign: 'center' as const,
      marginTop: '40px',
      paddingTop: '20px',
      fontSize: '11px',
      color: isDark ? '#a0a0b0' : '#4a4a5a',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}`,
    },
  };

  return (
    <>
      <ParticleBackground isDark={isDark} />
      <div style={styles.container}>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          style={styles.themeBtn}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>🛡️ PromptShield</h1>
          <p style={styles.subtitle}>Hybrid Semantic Prompt Injection Detection System</p>
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={run}
            disabled={loading || !input.trim()}
            style={styles.button}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? '⏳' : '✨'} Clean
          </button>
          <button onClick={pasteClipboard} style={styles.buttonSecondary}>📋 Paste</button>
          <button
            onClick={copyOut}
            disabled={!output}
            style={{
              ...styles.buttonSecondary,
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
            }}
          >
            📄 {copied ? 'Copied!' : 'Copy'}
          </button>
          <button onClick={() => setShowDiff(!showDiff)} disabled={!diff} style={styles.buttonSecondary}>
            🔍 Diff
          </button>
          <button onClick={undoLast} disabled={history.length === 0} style={styles.buttonSecondary}>
            ↩️ Undo
          </button>
          <button onClick={reset} style={styles.buttonSecondary}>
            🗑 Clear
          </button>
        </div>

        <div style={styles.grid}>
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span>📝 INPUT</span>
              <span>{input.length.toLocaleString()} characters</span>
            </div>
            <textarea
              style={styles.textarea}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste suspicious text here..."
            />
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span>{showDiff ? '🔍 DIFF VIEW' : '✅ CLEANED OUTPUT'}</span>
              {output && <span>{output.length.toLocaleString()} characters</span>}
            </div>
            {showDiff && diff ? (
              <div style={styles.outputArea}>
                {diff.map((line, i) => (
                  <span
                    key={i}
                    style={{
                      color: line.removed ? '#f04f58' : isDark ? '#e8e8f0' : '#1a1916',
                      textDecoration: line.removed ? 'line-through' : 'none',
                      background: line.removed
                        ? isDark ? '#f04f5820' : '#f04f5810'
                        : 'transparent',
                      display: 'block',
                    }}
                  >
                    {line.text || ' '}
                  </span>
                ))}
              </div>
            ) : (
              <div style={styles.outputArea}>
                {output || 'Ready — click "Clean" to begin analysis'}
              </div>
            )}
          </div>
        </div>

        {result && (
          <div style={styles.riskCard}>
            <h3 style={{ fontSize: isMobile ? '1.2rem' : '1.3rem', marginBottom: '8px' }}>📊 Threat Analysis</h3>
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.smallText}>Status</div>
                <div
                  style={{
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 700,
                    color: result.detected ? '#f5a623' : '#3ecf8e',
                  }}
                >
                  {result.detected ? '⚠️ INJECTION' : '✓ CLEAN'}
                </div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.smallText}>Confidence</div>
                <div style={styles.largeText}>{(result.confidence * 100).toFixed(0)}%</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.smallText}>Risk Level</div>
                <div style={{ ...styles.mediumText, color: sevColor(result.severity) }}>
                  {result.severity}
                </div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.smallText}>Removed</div>
                <div style={{ ...styles.largeText, color: '#f04f58' }}>
                  {result.charsRemoved.toLocaleString()} chars
                </div>
              </div>
            </div>

            {result.injectionTypes?.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <strong style={{ fontSize: '13px' }}>🔍 DETECTED PATTERNS</strong>
                <div style={styles.tagContainer}>
                  {result.injectionTypes.map((t: string, i: number) => (
                    <span key={i} style={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.obfuscation?.hasObfuscation && (
              <div style={{ marginTop: '16px', padding: '10px 14px', background: 'rgba(245,166,35,0.08)', borderRadius: '12px', fontSize: '13px' }}>
                <span style={{ color: '#f5a623' }}>⚠️ OBFUSCATION DETECTED</span>
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                  {result.obfuscation.types?.join(', ') || 'Unicode obfuscation present'}
                </div>
              </div>
            )}

            <div style={styles.metaRow}>
              <span>🔹 Blocks removed: {result.blocksRemoved}</span>
              <span>🔹 Lines removed: {result.linesRemoved}</span>
              <span>🔹 Method: {result.cleanMethod}</span>
              <span>🔹 Validation: {result.validationPassed ? 'PASSED' : 'REVIEW'}</span>
            </div>

            {result.validationIssues?.length > 0 && (
              <div style={styles.validationBox}>
                <strong>⚠️ Validation Issues</strong>
                <div style={{ marginTop: '6px' }}>{result.validationIssues.join(' • ')}</div>
              </div>
            )}
          </div>
        )}

        <div style={styles.footer}>
          <div>PromptShield · 100% Offline · No data leaves your device</div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '11px' }}>
            <a href="/terms.html" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Use</a>
            <span>•</span>
            <a href="/privacy.html" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <span>•</span>
            <a href="/disclaimer.html" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>Disclaimer</a>
            <span>•</span>
            <a href="/responsible-use.html" target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>Responsible Use</a>
          </div>
          <div style={{ marginTop: '6px', fontSize: '10px', opacity: 0.85 }}>
            ⚠️ Experimental AI Security Research Tool — Results may contain false positives or false negatives
          </div>
          <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.7 }}>
            © 2026 PromptShield · Educational & Research Project
          </div>
        </div>

        <FeedbackPopup
          isOpen={showFeedback}
          submitted={feedbackSubmitted}
          rating={feedbackRating}
          onRate={handleRating}
          onClose={closeFeedback}
          isDark={isDark}
        />
      </div>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .glass-card {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

function buildDiff(original: string, cleaned: string) {
  const cleanSet = new Set(cleaned.split('\n').map((l) => l.trim()).filter(Boolean));
  return original.split('\n').map((line) => ({
    text: line,
    removed: line.trim().length > 0 && !cleanSet.has(line.trim()),
  }));
}