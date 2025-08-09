import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Send, Zap, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from 'react-toastify';

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
}

export function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendRequest = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError('');
    const startTime = Date.now();

    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }

      const options: RequestInit = {
        method,
        headers: parsedHeaders,
      };

      if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const responseTime = Date.now() - startTime;
      
      let responseData;
      const contentType = res.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data: responseData,
        responseTime
      });

      toast.success(`Request completed in ${responseTime}ms`);
    } catch (err: any) {
      setError(err.message || 'Request failed');
      toast.error('Request failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Testing Tool</h1>
        <p className="text-gray-600">Test REST APIs with GET, POST, PUT, DELETE requests, custom headers, and response analysis.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Request Configuration
          </CardTitle>
          <CardDescription>
            Configure your API request with method, URL, headers, and body
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="https://api.example.com/endpoint"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
          </div>

          <Tabs defaultValue="headers" className="w-full">
            <TabsList>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
            </TabsList>
            <TabsContent value="headers">
              <Textarea
                placeholder="Enter headers as JSON"
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </TabsContent>
            <TabsContent value="body">
              <Textarea
                placeholder="Enter request body (JSON, text, etc.)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
                disabled={method === 'GET' || method === 'HEAD'}
              />
            </TabsContent>
          </Tabs>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button onClick={sendRequest} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Request
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {response.status >= 200 && response.status < 300 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                Response
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={`font-bold ${getStatusColor(response.status)}`}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-gray-500">
                  {response.responseTime}ms
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="response" className="w-full">
              <TabsList>
                <TabsTrigger value="response">Response Body</TabsTrigger>
                <TabsTrigger value="headers">Response Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="response">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2))}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="headers">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => copyToClipboard(JSON.stringify(response.headers, null, 2))}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}