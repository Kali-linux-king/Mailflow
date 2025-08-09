import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function RegexTester() {
  const [pattern, setPattern] = useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [testString, setTestString] = useState('Contact us at hello@example.com or support@test.org for more information.');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false
  });
  const { toast } = useToast();

  const regexResult = useMemo(() => {
    try {
      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';

      const regex = new RegExp(pattern, flagString);
      const matches = Array.from(testString.matchAll(regex));
      
      return {
        isValid: true,
        matches: matches.map(match => ({
          match: match[0],
          index: match.index || 0,
          groups: match.slice(1)
        })),
        regex: regex
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid regex',
        matches: [],
        regex: null
      };
    }
  }, [pattern, testString, flags]);

  const highlightMatches = (text: string, matches: Array<{match: string, index: number}>) => {
    if (matches.length === 0) return text;

    let highlighted = '';
    let lastIndex = 0;

    matches.forEach((match, i) => {
      highlighted += text.slice(lastIndex, match.index);
      highlighted += `<mark class="bg-yellow-200 px-1 rounded">${match.match}</mark>`;
      lastIndex = match.index + match.match.length;
    });

    highlighted += text.slice(lastIndex);
    return highlighted;
  };

  const copyRegex = async () => {
    let flagString = '';
    if (flags.global) flagString += 'g';
    if (flags.ignoreCase) flagString += 'i';
    if (flags.multiline) flagString += 'm';

    const regexString = `/${pattern}/${flagString}`;
    await navigator.clipboard.writeText(regexString);
    toast({ title: "Copied!", description: "Regex pattern copied to clipboard" });
  };

  const testCommonPatterns = (patternType: string) => {
    const patterns: Record<string, string> = {
      email: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      url: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      phone: '\\b\\d{3}-\\d{3}-\\d{4}\\b',
      ipv4: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
      date: '\\b\\d{1,2}\\/\\d{1,2}\\/\\d{4}\\b',
      time: '\\b([01]?[0-9]|2[0-3]):[0-5][0-9]\\b'
    };

    if (patterns[patternType]) {
      setPattern(patterns[patternType]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="regex-pattern" className="block text-sm font-medium text-slate-700 mb-2">
            Regular Expression Pattern
          </Label>
          <div className="flex space-x-2">
            <span className="flex items-center text-slate-500">/</span>
            <Input
              id="regex-pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 font-mono"
              placeholder="Enter regex pattern..."
              data-testid="regex-pattern"
            />
            <span className="flex items-center text-slate-500">/</span>
            <div className="flex space-x-1">
              {flags.global && <span className="text-primary">g</span>}
              {flags.ignoreCase && <span className="text-primary">i</span>}
              {flags.multiline && <span className="text-primary">m</span>}
            </div>
            <Button variant="ghost" size="sm" onClick={copyRegex} data-testid="copy-regex">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="global"
                checked={flags.global}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, global: !!checked }))}
                data-testid="global-flag"
              />
              <Label htmlFor="global" className="text-sm">Global (g)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ignoreCase"
                checked={flags.ignoreCase}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, ignoreCase: !!checked }))}
                data-testid="ignore-case-flag"
              />
              <Label htmlFor="ignoreCase" className="text-sm">Ignore Case (i)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiline"
                checked={flags.multiline}
                onCheckedChange={(checked) => setFlags(prev => ({ ...prev, multiline: !!checked }))}
                data-testid="multiline-flag"
              />
              <Label htmlFor="multiline" className="text-sm">Multiline (m)</Label>
            </div>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Common Patterns
          </Label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Email', value: 'email' },
              { label: 'URL', value: 'url' },
              { label: 'Phone', value: 'phone' },
              { label: 'IPv4', value: 'ipv4' },
              { label: 'Date', value: 'date' },
              { label: 'Time', value: 'time' }
            ].map(({ label, value }) => (
              <Button
                key={value}
                variant="outline"
                size="sm"
                onClick={() => testCommonPatterns(value)}
                data-testid={`pattern-${value}`}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="test-string" className="block text-sm font-medium text-slate-700 mb-2">
          Test String
        </Label>
        <Textarea
          id="test-string"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="w-full h-32 font-mono text-sm"
          placeholder="Enter text to test against your regex..."
          data-testid="test-string"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Highlighted Matches
          </Label>
          <div className="w-full min-h-[200px] p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm">
            {regexResult.isValid ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: highlightMatches(testString, regexResult.matches) 
                }}
              />
            ) : (
              <div className="text-red-600">{regexResult.error}</div>
            )}
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Match Details ({regexResult.matches.length} matches)
          </Label>
          <div className="w-full min-h-[200px] p-4 bg-slate-50 border border-slate-300 rounded-lg text-sm overflow-auto">
            {regexResult.isValid ? (
              regexResult.matches.length > 0 ? (
                <div className="space-y-3">
                  {regexResult.matches.map((match, index) => (
                    <div key={index} className="border-b border-slate-200 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary">Match {index + 1}</Badge>
                        <span className="text-xs text-slate-500">Position: {match.index}</span>
                      </div>
                      <div className="font-mono bg-white p-2 rounded border">
                        "{match.match}"
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-1 text-xs text-slate-600">
                          Groups: {match.groups.map((group, i) => `$${i + 1}: "${group}"`).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 text-center py-8">No matches found</div>
              )
            ) : (
              <div className="text-red-600">{regexResult.error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
