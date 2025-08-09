import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitCompare, Copy, RotateCcw } from "lucide-react";
import { toast } from 'react-toastify';

interface DiffResult {
  type: 'equal' | 'insert' | 'delete' | 'replace';
  oldText?: string;
  newText?: string;
  text?: string;
}

export function TextDiffChecker() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);
  const [stats, setStats] = useState<any>(null);

  const calculateDiff = () => {
    if (!text1.trim() && !text2.trim()) {
      toast.error('Please enter text in both fields');
      return;
    }

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    const diff = computeDiff(lines1, lines2);
    setDiffResults(diff);
    
    // Calculate statistics
    const additions = diff.filter(d => d.type === 'insert').length;
    const deletions = diff.filter(d => d.type === 'delete').length;
    const modifications = diff.filter(d => d.type === 'replace').length;
    const unchanged = diff.filter(d => d.type === 'equal').length;
    
    setStats({
      additions,
      deletions,
      modifications,
      unchanged,
      totalLines1: lines1.length,
      totalLines2: lines2.length,
      similarity: calculateSimilarity(text1, text2)
    });

    toast.success('Text comparison completed!');
  };

  const computeDiff = (lines1: string[], lines2: string[]): DiffResult[] => {
    const result: DiffResult[] = [];
    const maxLen = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];
      
      if (line1 === undefined) {
        result.push({ type: 'insert', newText: line2 });
      } else if (line2 === undefined) {
        result.push({ type: 'delete', oldText: line1 });
      } else if (line1 === line2) {
        result.push({ type: 'equal', text: line1 });
      } else {
        result.push({ type: 'replace', oldText: line1, newText: line2 });
      }
    }
    
    return result;
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return Math.round(((longer.length - editDistance) / longer.length) * 100);
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const copyDiff = () => {
    const diffText = diffResults.map(diff => {
      switch (diff.type) {
        case 'insert':
          return `+ ${diff.newText}`;
        case 'delete':
          return `- ${diff.oldText}`;
        case 'replace':
          return `- ${diff.oldText}\n+ ${diff.newText}`;
        case 'equal':
          return `  ${diff.text}`;
        default:
          return '';
      }
    }).join('\n');
    
    navigator.clipboard.writeText(diffText);
    toast.success('Diff copied to clipboard!');
  };

  const reset = () => {
    setText1('');
    setText2('');
    setDiffResults([]);
    setStats(null);
  };

  const renderSideBySide = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2 text-red-600">Original Text</h3>
        <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-auto">
          {diffResults.map((diff, index) => (
            <div key={index} className={`${
              diff.type === 'delete' ? 'bg-red-100 text-red-800' :
              diff.type === 'replace' ? 'bg-red-100 text-red-800' :
              diff.type === 'equal' ? '' : 'opacity-30'
            } px-1`}>
              {diff.type === 'delete' && `- ${diff.oldText}`}
              {diff.type === 'replace' && `- ${diff.oldText}`}
              {diff.type === 'equal' && `  ${diff.text}`}
              {diff.type === 'insert' && ''}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-green-600">Modified Text</h3>
        <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-auto">
          {diffResults.map((diff, index) => (
            <div key={index} className={`${
              diff.type === 'insert' ? 'bg-green-100 text-green-800' :
              diff.type === 'replace' ? 'bg-green-100 text-green-800' :
              diff.type === 'equal' ? '' : 'opacity-30'
            } px-1`}>
              {diff.type === 'insert' && `+ ${diff.newText}`}
              {diff.type === 'replace' && `+ ${diff.newText}`}
              {diff.type === 'equal' && `  ${diff.text}`}
              {diff.type === 'delete' && ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUnified = () => (
    <div className="bg-gray-50 p-4 rounded border max-h-96 overflow-auto font-mono text-sm">
      {diffResults.map((diff, index) => (
        <div key={index} className={`${
          diff.type === 'insert' ? 'bg-green-100 text-green-800' :
          diff.type === 'delete' ? 'bg-red-100 text-red-800' :
          diff.type === 'replace' ? '' : ''
        } px-1`}>
          {diff.type === 'insert' && `+ ${diff.newText}`}
          {diff.type === 'delete' && `- ${diff.oldText}`}
          {diff.type === 'replace' && (
            <>
              <div className="bg-red-100 text-red-800">- {diff.oldText}</div>
              <div className="bg-green-100 text-green-800">+ {diff.newText}</div>
            </>
          )}
          {diff.type === 'equal' && `  ${diff.text}`}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Text Difference Checker</h1>
        <p className="text-gray-600">Compare two texts and highlight differences, additions, and deletions with side-by-side or unified diff views.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>Enter the original text to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter original text here..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modified Text</CardTitle>
            <CardDescription>Enter the modified text to compare</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter modified text here..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={calculateDiff} className="flex-1">
          <GitCompare className="w-4 h-4 mr-2" />
          Compare Texts
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded">
                <div className="text-2xl font-bold text-green-600">{stats.additions}</div>
                <div className="text-sm text-green-700">Additions</div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="text-2xl font-bold text-red-600">{stats.deletions}</div>
                <div className="text-sm text-red-700">Deletions</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <div className="text-2xl font-bold text-yellow-600">{stats.modifications}</div>
                <div className="text-sm text-yellow-700">Modifications</div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-2xl font-bold text-blue-600">{stats.similarity}%</div>
                <div className="text-sm text-blue-700">Similarity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {diffResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Difference View
              <Button variant="outline" onClick={copyDiff}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Diff
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="side-by-side" className="w-full">
              <TabsList>
                <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
                <TabsTrigger value="unified">Unified View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="side-by-side">
                {renderSideBySide()}
              </TabsContent>
              
              <TabsContent value="unified">
                {renderUnified()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}