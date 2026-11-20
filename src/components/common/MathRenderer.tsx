import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      let cleanMath = math.trim();
      if (cleanMath.startsWith('$$') && cleanMath.endsWith('$$')) {
        cleanMath = cleanMath.slice(2, -2).trim();
      } else if (cleanMath.startsWith('$') && cleanMath.endsWith('$')) {
        cleanMath = cleanMath.slice(1, -1).trim();
      }

      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        strict: false
      });
    } catch {
      return `<span class="katex-fallback font-mono text-xs text-blue-600">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block ${block ? 'my-2 block text-center overflow-x-auto py-1' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface FormattedMathTextProps {
  text: string;
  className?: string;
}

export const FormattedMathText: React.FC<FormattedMathTextProps> = ({ text, className = '' }) => {
  const content = useMemo(() => {
    if (!text) return null;

    const trimmed = text.trim();
    if (
      trimmed.startsWith('\\text{') ||
      trimmed.startsWith('N = \\sum') ||
      trimmed.startsWith('Y = \\sum') ||
      trimmed.startsWith('Value = ') ||
      trimmed.startsWith('S_i \\equiv') ||
      trimmed.startsWith('xPSR = ') ||
      (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.indexOf('$', 1) === trimmed.length - 1)
    ) {
      return <MathFormula math={trimmed} block={false} />;
    }

    // Split text by $$ ... $$ or $ ... $
    const tokens = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g);

    return tokens.map((token, i) => {
      if (token.startsWith('$$') && token.endsWith('$$')) {
        return <MathFormula key={i} math={token.slice(2, -2)} block={true} />;
      }
      if (token.startsWith('$') && token.endsWith('$')) {
        return <MathFormula key={i} math={token.slice(1, -1)} block={false} />;
      }

      // If token contains un-delimited LaTeX backslashes:
      if (/\\(sum|cdot|le|ge|oplus|cup|times|equiv|forall|lambda|delta|land|bar|frac|quad|text)/.test(token)) {
        // Regex to extract formula sections: e.g. "N = \sum_{i=-m}^{n-1} d_i \cdot r^i" or "0 \le d_i < r"
        const subTokens = token.split(/([A-Za-z0-9_]+\s*=\s*\\(?:sum|cdot|frac|text)[^\,\.\;]+|0\s*\\le\s*[A-Za-z0-9_]+\s*<\s*[A-Za-z0-9_]+|\b[a-zA-Z0-9_]+\s*\\(?:oplus|cup|equiv)\s*[a-zA-Z0-9_]+|\\[a-zA-Z]+(?:\{[^\}]*\})*(?:\^[^\s\,\.\;]+)?(?:_[^\s\,\.\;]+)?)/g);

        return (
          <span key={i}>
            {subTokens.map((st, j) => {
              if (/\\(sum|cdot|le|ge|oplus|cup|times|equiv|forall|lambda|delta|land|bar|frac|quad|text)/.test(st) || /=\s*\\/.test(st)) {
                return <MathFormula key={j} math={st} block={false} />;
              }
              return <span key={j}>{st}</span>;
            })}
          </span>
        );
      }
      return <span key={i}>{token}</span>;
    });
  }, [text]);

  return <span className={className}>{content}</span>;
};
