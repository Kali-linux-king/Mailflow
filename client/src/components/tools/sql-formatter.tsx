import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Code, Database, Minimize2 } from "lucide-react";
import { toast } from 'react-toastify';

export function SQLFormatter() {
  const [sqlInput, setSqlInput] = useState('');
  const [formattedSQL, setFormattedSQL] = useState('');

  const formatSQL = () => {
    if (!sqlInput.trim()) {
      toast.error('Please enter SQL to format');
      return;
    }

    const formatted = formatSQLString(sqlInput);
    setFormattedSQL(formatted);
    toast.success('SQL formatted successfully!');
  };

  const formatSQLString = (sql: string): string => {
    // Remove extra whitespace and normalize
    let formatted = sql.replace(/\s+/g, ' ').trim();
    
    // SQL keywords to format
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN',
      'ON', 'GROUP BY', 'HAVING', 'ORDER BY', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
      'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION',
      'IF', 'ELSE', 'THEN', 'END', 'CASE', 'WHEN', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS',
      'BETWEEN', 'LIKE', 'IS', 'NULL', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'CONSTRAINT',
      'UNIQUE', 'DEFAULT', 'CHECK', 'AUTO_INCREMENT', 'IDENTITY'
    ];

    // Add line breaks before major keywords
    const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY', 'INSERT', 'UPDATE', 'DELETE'];
    majorKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    // Add line breaks for JOIN statements
    const joinKeywords = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'JOIN'];
    joinKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });

    // Format commas in SELECT statements
    formatted = formatted.replace(/,\s*(?![^()]*\))/g, ',\n    ');

    // Add proper indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Decrease indent for closing statements
      if (trimmed.toLowerCase().includes('end') || trimmed.includes(')')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const indented = '    '.repeat(indentLevel) + trimmed;

      // Increase indent for opening statements
      if (trimmed.toLowerCase().includes('case') || trimmed.toLowerCase().includes('begin') || trimmed.includes('(')) {
        indentLevel++;
      }

      return indented;
    });

    // Clean up and finalize
    formatted = indentedLines.join('\n');
    
    // Uppercase SQL keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, keyword.toUpperCase());
    });

    // Clean up extra line breaks
    formatted = formatted.replace(/\n\s*\n/g, '\n').trim();

    return formatted;
  };

  const minifySQL = () => {
    if (!sqlInput.trim()) {
      toast.error('Please enter SQL to minify');
      return;
    }

    const minified = sqlInput
      .replace(/\s+/g, ' ')
      .replace(/\s*([(),;])\s*/g, '$1')
      .trim();
    
    setFormattedSQL(minified);
    toast.success('SQL minified successfully!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedSQL);
    toast.success('Formatted SQL copied to clipboard!');
  };

  const validateSQL = () => {
    if (!sqlInput.trim()) {
      toast.error('Please enter SQL to validate');
      return;
    }

    // Basic SQL validation
    const sql = sqlInput.toLowerCase();
    const issues = [];

    // Check for common issues
    if (!sql.includes('select') && !sql.includes('insert') && !sql.includes('update') && !sql.includes('delete') && !sql.includes('create')) {
      issues.push('No valid SQL statement detected');
    }

    if (sql.includes('select') && !sql.includes('from') && !sql.includes('dual')) {
      issues.push('SELECT statement missing FROM clause');
    }

    // Check for unmatched parentheses
    const openParens = (sql.match(/\(/g) || []).length;
    const closeParens = (sql.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push('Unmatched parentheses');
    }

    if (issues.length === 0) {
      toast.success('SQL appears to be valid!');
    } else {
      toast.error(`SQL issues found: ${issues.join(', ')}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SQL Formatter & Validator</h1>
        <p className="text-gray-600">Format, minify, and validate SQL queries with proper indentation and keyword highlighting.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            SQL Input
          </CardTitle>
          <CardDescription>
            Paste your SQL query below to format and validate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT u.name, u.email, p.title FROM users u INNER JOIN posts p ON u.id = p.user_id WHERE u.active = 1 ORDER BY u.name;"
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
          />
          
          <div className="flex gap-2">
            <Button onClick={formatSQL} disabled={!sqlInput.trim()}>
              <Code className="w-4 h-4 mr-2" />
              Format SQL
            </Button>
            <Button variant="outline" onClick={minifySQL} disabled={!sqlInput.trim()}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify
            </Button>
            <Button variant="outline" onClick={validateSQL} disabled={!sqlInput.trim()}>
              Validate
            </Button>
          </div>
        </CardContent>
      </Card>

      {formattedSQL && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Formatted SQL
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto border font-mono whitespace-pre-wrap">
              {formattedSQL}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>SQL Formatting Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Formatting Features:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Proper keyword capitalization</li>
                <li>• Consistent indentation</li>
                <li>• Line breaks for readability</li>
                <li>• JOIN statement formatting</li>
                <li>• SELECT clause alignment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Validation Checks:</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Basic syntax validation</li>
                <li>• Parentheses matching</li>
                <li>• Required clause detection</li>
                <li>• Statement type recognition</li>
                <li>• Common error identification</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}