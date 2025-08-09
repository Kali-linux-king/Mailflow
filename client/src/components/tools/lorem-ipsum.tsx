import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LoremIpsum() {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState('3');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateWords = (num: number): string => {
    const words = [];
    for (let i = 0; i < num; i++) {
      words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ');
  };

  const generateSentence = (): string => {
    const length = Math.floor(Math.random() * 10) + 8; // 8-17 words
    const sentence = generateWords(length);
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  };

  const generateParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4-7 sentences
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const generate = () => {
    const num = parseInt(count);
    if (isNaN(num) || num <= 0) {
      toast({ title: "Error", description: "Please enter a valid number", variant: "destructive" });
      return;
    }

    let result = '';
    const startText = startWithLorem ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' : '';

    switch (type) {
      case 'words':
        result = startWithLorem ? `Lorem ipsum ${generateWords(Math.max(0, num - 2))}` : generateWords(num);
        break;
      case 'sentences':
        const sentences = [];
        if (startWithLorem) {
          sentences.push(startText);
        }
        for (let i = startWithLorem ? 1 : 0; i < num; i++) {
          sentences.push(generateSentence());
        }
        result = sentences.join(' ');
        break;
      case 'paragraphs':
        const paragraphs = [];
        if (startWithLorem) {
          paragraphs.push(startText + ' ' + generateParagraph().substring(startText.length));
        }
        for (let i = startWithLorem ? 1 : 0; i < num; i++) {
          paragraphs.push(generateParagraph());
        }
        result = paragraphs.join('\n\n');
        break;
    }

    setOutput(result);
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      toast({ title: "Copied!", description: "Lorem ipsum text copied to clipboard" });
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
            Generate
          </Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger data-testid="type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="words">Words</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="count" className="block text-sm font-medium text-slate-700 mb-2">
            Count
          </Label>
          <Input
            id="count"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            min="1"
            max="100"
            data-testid="count-input"
          />
        </div>

        <div className="flex items-end">
          <div className="flex items-center space-x-2 h-10">
            <input
              type="checkbox"
              id="start-lorem"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded"
              data-testid="start-lorem-checkbox"
            />
            <Label htmlFor="start-lorem" className="text-sm">
              Start with "Lorem ipsum..."
            </Label>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button onClick={generate} data-testid="generate-button">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Lorem Ipsum
        </Button>
        <Button variant="outline" onClick={clearOutput} data-testid="clear-button">
          Clear
        </Button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium text-slate-700">
              Generated Text ({output.split(' ').length} words)
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard}
              data-testid="copy-button"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
          <div className="w-full min-h-[200px] p-4 bg-slate-50 border border-slate-300 rounded-lg text-sm overflow-auto">
            <div className="whitespace-pre-wrap">{output}</div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">About Lorem Ipsum:</h4>
        <p className="text-sm text-blue-700">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's 
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled 
          it to make a type specimen book.
        </p>
      </div>
    </div>
  );
}
