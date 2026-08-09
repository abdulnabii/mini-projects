import { ReviewResult } from '@/types';

export const CODE_REVIEW_SYSTEM_PROMPT = `
You are Senior Code Reviewer AI, a principal staff engineer performing automated code reviews for production pull requests.

YOUR MANDATE:
1. Conduct static code analysis for Security, Logic Bugs, Performance, Code Quality, and Language Best Practices.
2. Calculate a Code Quality Score from 0 to 100 based on severity and count of issues detected.
   - 90-100: Excellent production code
   - 70-89: Minor improvements needed
   - 45-69: Major concerns / refactoring required
   - 0-44: Critical security vulnerabilities / blocking bugs
3. Provide actionable line-by-line feedback.
4. Provide a complete refactored and clean version of the code ("fixedCode").

JSON OUTPUT SCHEMA (STRICT):
Return ONLY valid JSON matching this exact structure:
{
  "score": 45,
  "language": "python",
  "summary": "High-level summary of code quality and security risks.",
  "criticalCount": 1,
  "majorCount": 2,
  "minorCount": 1,
  "infoCount": 0,
  "issues": [
    {
      "id": "issue_1",
      "line": 3,
      "severity": "CRITICAL" | "MAJOR" | "MINOR" | "INFO",
      "category": "Security" | "Bugs & Errors" | "Performance" | "Code Quality" | "Best Practices",
      "title": "Short title",
      "description": "Clear explanation of why this is problematic.",
      "fix": "Actionable fix recommendation."
    }
  ],
  "fixedCode": "Full corrected and refactored code snippet here",
  "refactoringTips": [
    "Tip 1 for overall architecture",
    "Tip 2"
  ]
}
`;

export function generateMockReview(code: string, language: string): ReviewResult {
  const text = code.toLowerCase();

  // Python SQL Injection Mock
  if (text.includes('select') && (text.includes('+') || text.includes('%s') || text.includes('f"'))) {
    return {
      score: 32,
      language: language || 'python',
      summary: 'Critical security risk identified: String concatenation inside SQL query creates a direct SQL Injection flaw.',
      criticalCount: 1,
      majorCount: 2,
      minorCount: 1,
      infoCount: 1,
      issues: [
        {
          id: 'issue_1',
          line: 3,
          severity: 'CRITICAL',
          category: 'Security',
          title: 'SQL Injection Vulnerability (CWE-89)',
          description: 'Concatenating user input directly into an SQL string allows malicious attackers to execute arbitrary database queries and bypass authentication.',
          fix: 'Use parameterized queries or prepared statements: cursor.execute("SELECT * FROM users WHERE id = %s AND is_active = 1", (user_id,))',
        },
        {
          id: 'issue_2',
          line: 6,
          severity: 'MAJOR',
          category: 'Bugs & Errors',
          title: 'Unchecked Database Exception & Null Dereference',
          description: 'Executing queries without try-except blocks can cause unhandled exceptions during connection timeouts or invalid syntax.',
          fix: 'Wrap database execution in a try-except block and check if user is not None before indexing.',
        },
        {
          id: 'issue_3',
          line: 1,
          severity: 'MINOR',
          category: 'Best Practices',
          title: 'Missing Type Hinting & Docstring',
          description: 'Function signature lacks explicit type annotations for parameter user_id and return type.',
          fix: 'def get_user_profile(user_id: str) -> Optional[dict]:',
        },
      ],
      fixedCode: `from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Safe database retrieval using parameterized queries and exception handling."""
    query = "SELECT id, email, role FROM users WHERE id = %s AND is_active = 1"
    
    try:
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()
        
        if not user:
            logger.warning(f"User {user_id} not found.")
            return None

        return {
            "id": user[0],
            "email": user[1],
            "role": user[2]
        }
    except Exception as e:
        logger.error(f"Database query failed for user {user_id}: {e}")
        return None`,
      refactoringTips: [
        'Adopt an Object-Relational Mapper (ORM) such as SQLAlchemy or Prisma to eliminate raw string queries.',
        'Ensure database connections are handled using context managers (with cursor_context as cursor).',
      ],
    };
  }

  // React Memory Leak Mock
  if (text.includes('setinterval') || text.includes('useeffect')) {
    return {
      score: 54,
      language: language || 'javascript',
      summary: 'React component contains memory leak risks from un-cleared side-effect timers and inefficient O(n²) render loops.',
      criticalCount: 0,
      majorCount: 2,
      minorCount: 2,
      infoCount: 0,
      issues: [
        {
          id: 'issue_1',
          line: 8,
          severity: 'MAJOR',
          category: 'Performance',
          title: 'React Hook Memory Leak (Un-cleared Timer)',
          description: 'setInterval is registered inside useEffect without a cleanup function. On component unmount, the timer will continue running in memory.',
          fix: 'Return a cleanup function from useEffect: return () => clearInterval(intervalId);',
        },
        {
          id: 'issue_2',
          line: 14,
          severity: 'MAJOR',
          category: 'Performance',
          title: 'Quadratic O(n²) Nested Array Filtering',
          description: 'Using items.some inside items.filter creates quadratic execution time on every render.',
          fix: 'Memoize filtered results with useMemo and use a Set lookup for O(1) matching speed.',
        },
        {
          id: 'issue_3',
          line: 21,
          severity: 'MINOR',
          category: 'Best Practices',
          title: 'Missing Unique React Key Prop',
          description: 'Rendering list items without unique key props can cause DOM reconciliation bugs.',
          fix: '<div key={item.id}>{item.name}</div>',
        },
      ],
      fixedCode: `import React, { useState, useEffect, useMemo } from 'react';

export function UserList({ items = [] }) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Properly return interval cleanup handler to prevent memory leaks
    const intervalId = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Optimized O(n) filtering with Set lookup & useMemo
  const sortedItems = useMemo(() => {
    const validIds = new Set(items.filter(y => y.score > 50).map(y => y.id));
    return items.filter(x => validIds.has(x.id));
  }, [items]);

  return (
    <div className="p-4 bg-slate-900 text-white">
      <h3>Active Timer: {timer}s</h3>
      <div className="space-y-2 mt-4">
        {sortedItems.map(item => (
          <div key={item.id} className="p-2 border rounded border-slate-700">
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
      refactoringTips: [
        'Use custom hooks (e.g. useInterval) to isolate timer state.',
        'Extract list items into dedicated React sub-components to prevent unnecessary parent re-renders.',
      ],
    };
  }

  // Default General Mock Review
  return {
    score: 78,
    language: language || 'javascript',
    summary: 'Code structure is reasonable. Recommended adding input validation, error handling, and type safety.',
    criticalCount: 0,
    majorCount: 1,
    minorCount: 2,
    infoCount: 1,
    issues: [
      {
        id: 'issue_1',
        line: 4,
        severity: 'MAJOR',
        category: 'Bugs & Errors',
        title: 'Missing Null/Undefined Checks',
        description: 'Input arguments are referenced without checking for null or empty values.',
        fix: 'Add defensive null guard checks at the top of the function.',
      },
      {
        id: 'issue_2',
        line: 8,
        severity: 'MINOR',
        category: 'Code Quality',
        title: 'Variable Naming Consistency',
        description: 'Consider using camelCase or snake_case consistently according to language guidelines.',
        fix: 'Rename ambiguous variables to descriptive names.',
      },
    ],
    fixedCode: `// Refactored clean production code
export function processData(inputData) {
  if (!inputData) {
    throw new Error('Invalid input: inputData is required');
  }

  try {
    return Object.freeze({
      processedAt: new Date().toISOString(),
      payload: inputData,
      status: 'SUCCESS'
    });
  } catch (error) {
    console.error('Processing error:', error);
    return null;
  }
}`,
    refactoringTips: [
      'Enable strict linter rules (ESLint / Flake8).',
      'Add unit test coverage using Jest or pytest.',
    ],
  };
}
