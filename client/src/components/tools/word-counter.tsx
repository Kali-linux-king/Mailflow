import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, FileText, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function WordCounter() {
  const [text, setText] = useState('Enter your text here and watch the statistics update in real-time. This tool will count words, characters, paragraphs, sentences, and estimate reading time.');
  const { toast } = useToast();

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    // Reading time calculations (average reading speeds)
    const readingTimeMinutes = Math.ceil(words / 200); // 200 words per minute average
    const speakingTimeMinutes = Math.ceil(words / 150); // 150 words per minute average speaking
    
    // Most common words analysis
    const wordFrequency: Record<string, number> = {};
    if (text.trim()) {
      const cleanWords = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2); // Filter out small words
      
      cleanWords.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
    }
    
    const topWords = Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Average word and sentence length
    const averageWordsPerSentence = sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0;
    const averageCharsPerWord = words > 0 ? Math.round((charactersNoSpaces / words) * 10) / 10 : 0;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      topWords,
      averageWordsPerSentence,
      averageCharsPerWord
    };
  }, [text]);

  const copyStats = async () => {
    const statsText = `
Text Statistics:
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Reading time: ${stats.readingTimeMinutes} min
Speaking time: ${stats.speakingTimeMinutes} min
Average words per sentence: ${stats.averageWordsPerSentence}
Average characters per word: ${stats.averageCharsPerWord}
    `.trim();

    await navigator.clipboard.writeText(statsText);
    toast({ title: "Copied!", description: "Text statistics copied to clipboard" });
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Text copied to clipboard" });
  };

  const clearText = () => {
    setText('');
  };

  const insertSampleText = () => {
    const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`;
    
    setText(sampleText);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2">
          <Label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-2">
            Text Input
          </Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-96 text-sm resize-none"
            placeholder="Enter or paste your text here..."
            data-testid="text-input"
          />
          <div className="flex space-x-2 mt-4">
            <Button onClick={copyText} variant="outline" data-testid="copy-text">
              <Copy className="w-4 h-4 mr-2" />
              Copy Text
            </Button>
            <Button onClick={clearText} variant="outline" data-testid="clear-text">
              Clear
            </Button>
            <Button onClick={insertSampleText} variant="outline" data-testid="sample-text">
              Sample Text
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          {/* Basic Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Basic Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Characters:</span>
                <span className="font-medium" data-testid="char-count">{stats.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Characters (no spaces):</span>
                <span className="font-medium" data-testid="char-no-spaces-count">{stats.charactersNoSpaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Words:</span>
                <span className="font-medium" data-testid="word-count">{stats.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Sentences:</span>
                <span className="font-medium" data-testid="sentence-count">{stats.sentences.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Paragraphs:</span>
                <span className="font-medium" data-testid="paragraph-count">{stats.paragraphs.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reading Time */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Reading Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600 flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Reading:
                </span>
                <span className="font-medium" data-testid="reading-time">
                  {stats.readingTimeMinutes} min
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 flex items-center">
                  <i className="fas fa-microphone w-4 h-4 mr-1"></i>
                  Speaking:
                </span>
                <span className="font-medium" data-testid="speaking-time">
                  {stats.speakingTimeMinutes} min
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Based on average reading (200 wpm) and speaking (150 wpm) speeds
              </div>
            </CardContent>
          </Card>

          {/* Advanced Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Advanced Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Avg words/sentence:</span>
                <span className="font-medium" data-testid="avg-words-sentence">{stats.averageWordsPerSentence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Avg chars/word:</span>
                <span className="font-medium" data-testid="avg-chars-word">{stats.averageCharsPerWord}</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Words */}
          {stats.topWords.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Most Common Words</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topWords.map(([word, count], index) => (
                    <div key={word} className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {index + 1}. {word}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Copy Stats Button */}
          <Button onClick={copyStats} className="w-full" data-testid="copy-stats">
            <Copy className="w-4 h-4 mr-2" />
            Copy Statistics
          </Button>
        </div>
      </div>

      <div className="mt-8 bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Usage Tips:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Perfect for writers, students, and content creators</li>
          <li>• Reading time estimates help plan content length</li>
          <li>• Use word frequency analysis to avoid repetition</li>
          <li>• All counting happens in real-time as you type</li>
          <li>• Statistics are calculated locally - your text never leaves your browser</li>
        </ul>
      </div>
    </div>
  );
}
