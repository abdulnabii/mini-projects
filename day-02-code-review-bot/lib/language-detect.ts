import { CodePreset } from '@/types';

export const SUPPORTED_LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'csharp', name: 'C#' },
  { id: 'sql', name: 'SQL' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
];

export function detectLanguage(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) return 'javascript';

  if (/def\s+\w+\s*\(|import\s+\w+|from\s+\w+\s+import|if\s+__name__\s*==|elif\s+/i.test(trimmed)) {
    return 'python';
  }
  if (/SELECT\s+.+FROM\s+|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE/i.test(trimmed)) {
    return 'sql';
  }
  if (/fn\s+\w+\s*\(|let\s+mut\s+|impl\s+\w+|use\s+std::/i.test(trimmed)) {
    return 'rust';
  }
  if (/package\s+main|func\s+\w+\s*\(|import\s+\(|go\s+func/i.test(trimmed)) {
    return 'go';
  }
  if (/#include\s+<\w+>|std::cout|int\s+main\s*\(|void\s+\w+\s*\(/i.test(trimmed)) {
    return 'cpp';
  }
  if (/public\s+class\s+\w+|System\.out\.println|private\s+\w+\s+\w+;/i.test(trimmed)) {
    return 'java';
  }
  if (/<html|<div|<script|<template/i.test(trimmed)) {
    return 'html';
  }
  if (/:interface\s+\w+|:\s*(string|number|boolean|any)\b|import\s+type\s+/i.test(trimmed)) {
    return 'typescript';
  }
  if (/const\s+\w+\s*=|let\s+\w+\s*=|function\s+\w+\s*\(|console\.log/i.test(trimmed)) {
    return 'javascript';
  }

  return 'javascript';
}

export const SAMPLE_PRESETS: CodePreset[] = [
  {
    id: 'sqli_python',
    title: 'Python SQL Injection & Unhandled DB Error',
    language: 'python',
    description: 'Vulnerable database query with string concatenation and missing exception handling.',
    code: `def get_user_profile(user_id):
    # Direct string formatting creates severe SQL Injection vulnerability
    query = "SELECT * FROM users WHERE id = '" + user_id + "' AND is_active = 1"
    
    # Missing database error handling & connection pooling
    cursor.execute(query)
    user = cursor.fetchone()
    
    # Risk of Null Dereference if user is None
    return {
        "id": user[0],
        "email": user[1],
        "role": user[2]
    }`,
  },
  {
    id: 'react_memory_leak',
    title: 'React O(n²) Re-render & Memory Leak',
    language: 'javascript',
    description: 'React component with un-cleared interval timer, inline object creation, and inefficient loop.',
    code: `import React, { useState, useEffect } from 'react';

export function UserList({ items }) {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Memory Leak: setInterval never cleared on component unmount
    setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
  }, []);

  // O(n²) nested quadratic loop recalculation on every render
  const sortedItems = items.filter(x => {
    return items.some(y => y.id === x.id && y.score > 50);
  });

  return (
    <div>
      <h3>Active Timer: {timer}s</h3>
      {sortedItems.map(item => (
        // Missing unique key prop
        <div>{item.name}</div>
      ))}
    </div>
  );
}`,
  },
  {
    id: 'cpp_buffer_overflow',
    title: 'C++ Buffer Overflow & Null Pointer Risk',
    language: 'cpp',
    description: 'Unsafe strcpy usage causing potential stack buffer overflow and unchecked raw pointers.',
    code: `#include <iostream>
#include <cstring>

void process_input(const char* input_str) {
    char buffer[16];
    
    // Danger: strcpy has no bounds checking - buffer overflow vulnerability!
    strcpy(buffer, input_str);
    
    int* ptr = nullptr;
    // Danger: Unchecked null pointer dereference will crash process
    *ptr = 42;

    std::cout << "Processed: " << buffer << std::endl;
}

int main() {
    process_input("This string is way too long for a 16 byte buffer!");
    return 0;
}`,
  },
];
