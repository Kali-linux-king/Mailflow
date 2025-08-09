import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, Shield, AlertTriangle } from "lucide-react";
import { toast } from 'react-toastify';

export function JWTDecoder() {
  const [jwtToken, setJwtToken] = useState('');
  const [decodedToken, setDecodedToken] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const decodeJWT = () => {
    try {
      if (!jwtToken.trim()) {
        setError('Please enter a JWT token');
        return;
      }

      const parts = jwtToken.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format. JWT must have 3 parts separated by dots.');
        return;
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      setDecodedToken({
        header,
        payload,
        signature: parts[2]
      });
      setError('');
      toast.success('JWT token decoded successfully!');
    } catch (err) {
      setError('Invalid JWT token format');
      setDecodedToken(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isTokenExpired = (exp: number) => {
    return exp < Date.now() / 1000;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JWT Token Decoder</h1>
        <p className="text-gray-600">Decode and analyze JSON Web Tokens (JWT) with header, payload inspection and signature validation.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Enter JWT Token
          </CardTitle>
          <CardDescription>
            Paste your JWT token below to decode and analyze its contents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
          />
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <Button onClick={decodeJWT} className="w-full">
            Decode JWT Token
          </Button>
        </CardContent>
      </Card>

      {decodedToken && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Header
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(decodedToken.header, null, 2))}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(decodedToken.header, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Payload
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(decodedToken.payload, null, 2))}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(decodedToken.payload, null, 2)}
              </pre>
              
              {decodedToken.payload.exp && (
                <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2">
                    {isTokenExpired(decodedToken.payload.exp) ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-red-700 font-medium">Token Expired</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-green-700 font-medium">Token Valid</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Expires: {new Date(decodedToken.payload.exp * 1000).toLocaleString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}