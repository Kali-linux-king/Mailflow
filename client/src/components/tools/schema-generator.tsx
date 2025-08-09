import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Code, Star, Package, Calendar, User } from "lucide-react";
import { toast } from 'react-toastify';

interface SchemaField {
  name: string;
  value: string;
}

export function SchemaGenerator() {
  const [schemaType, setSchemaType] = useState('article');
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    { name: 'name', value: '' },
    { name: 'description', value: '' }
  ]);
  const [generatedSchema, setGeneratedSchema] = useState('');

  const schemaTemplates = {
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '',
      description: '',
      author: {
        '@type': 'Person',
        name: ''
      },
      datePublished: '',
      image: '',
      url: ''
    },
    product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: '',
      description: '',
      brand: {
        '@type': 'Brand',
        name: ''
      },
      offers: {
        '@type': 'Offer',
        price: '',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      image: '',
      sku: ''
    },
    review: {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Product',
        name: ''
      },
      author: {
        '@type': 'Person',
        name: ''
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '',
        bestRating: '5'
      },
      reviewBody: '',
      datePublished: ''
    },
    event: {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      location: {
        '@type': 'Place',
        name: '',
        address: ''
      },
      organizer: {
        '@type': 'Organization',
        name: ''
      }
    },
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '',
      description: '',
      url: '',
      logo: '',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '',
        contactType: 'customer service'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '',
        addressLocality: '',
        addressRegion: '',
        postalCode: '',
        addressCountry: ''
      }
    },
    recipe: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: '',
      description: '',
      image: '',
      author: {
        '@type': 'Person',
        name: ''
      },
      prepTime: '',
      cookTime: '',
      totalTime: '',
      recipeYield: '',
      recipeIngredient: [],
      recipeInstructions: []
    }
  };

  const getSchemaFields = (type: string) => {
    const fieldMappings = {
      article: [
        { name: 'headline', label: 'Article Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'author.name', label: 'Author Name', type: 'text', required: true },
        { name: 'datePublished', label: 'Published Date', type: 'date', required: true },
        { name: 'image', label: 'Image URL', type: 'url', required: false },
        { name: 'url', label: 'Article URL', type: 'url', required: false }
      ],
      product: [
        { name: 'name', label: 'Product Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'brand.name', label: 'Brand Name', type: 'text', required: true },
        { name: 'offers.price', label: 'Price', type: 'number', required: true },
        { name: 'offers.priceCurrency', label: 'Currency', type: 'text', required: true },
        { name: 'image', label: 'Image URL', type: 'url', required: false },
        { name: 'sku', label: 'SKU', type: 'text', required: false }
      ],
      review: [
        { name: 'itemReviewed.name', label: 'Product/Service Name', type: 'text', required: true },
        { name: 'author.name', label: 'Reviewer Name', type: 'text', required: true },
        { name: 'reviewRating.ratingValue', label: 'Rating (1-5)', type: 'number', required: true },
        { name: 'reviewBody', label: 'Review Text', type: 'textarea', required: true },
        { name: 'datePublished', label: 'Review Date', type: 'date', required: true }
      ],
      event: [
        { name: 'name', label: 'Event Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'startDate', label: 'Start Date', type: 'datetime-local', required: true },
        { name: 'endDate', label: 'End Date', type: 'datetime-local', required: false },
        { name: 'location.name', label: 'Venue Name', type: 'text', required: true },
        { name: 'location.address', label: 'Address', type: 'text', required: true },
        { name: 'organizer.name', label: 'Organizer', type: 'text', required: true }
      ],
      organization: [
        { name: 'name', label: 'Organization Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'url', label: 'Website URL', type: 'url', required: true },
        { name: 'logo', label: 'Logo URL', type: 'url', required: false },
        { name: 'contactPoint.telephone', label: 'Phone', type: 'tel', required: false },
        { name: 'address.streetAddress', label: 'Street Address', type: 'text', required: false },
        { name: 'address.addressLocality', label: 'City', type: 'text', required: false },
        { name: 'address.addressRegion', label: 'State/Region', type: 'text', required: false },
        { name: 'address.postalCode', label: 'Postal Code', type: 'text', required: false },
        { name: 'address.addressCountry', label: 'Country', type: 'text', required: false }
      ],
      recipe: [
        { name: 'name', label: 'Recipe Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'author.name', label: 'Author Name', type: 'text', required: true },
        { name: 'prepTime', label: 'Prep Time (PT15M)', type: 'text', required: false },
        { name: 'cookTime', label: 'Cook Time (PT30M)', type: 'text', required: false },
        { name: 'recipeYield', label: 'Servings', type: 'text', required: false },
        { name: 'image', label: 'Image URL', type: 'url', required: false }
      ]
    };
    return fieldMappings[type as keyof typeof fieldMappings] || [];
  };

  const generateSchema = () => {
    const template = { ...schemaTemplates[schemaType as keyof typeof schemaTemplates] };
    const fields = getSchemaFields(schemaType);
    
    // Build the schema object
    const schema = JSON.parse(JSON.stringify(template));
    
    fields.forEach(field => {
      const value = (document.getElementById(field.name) as HTMLInputElement)?.value;
      if (value) {
        setNestedProperty(schema, field.name, value);
      }
    });

    const formatted = JSON.stringify(schema, null, 2);
    setGeneratedSchema(formatted);
    toast.success('Schema markup generated successfully!');
  };

  const setNestedProperty = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const last = keys.pop()!;
    const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
    target[last] = value;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSchema);
    toast.success('Schema copied to clipboard!');
  };

  const getSchemaIcon = (type: string) => {
    const icons = {
      article: <Code className="w-5 h-5" />,
      product: <Package className="w-5 h-5" />,
      review: <Star className="w-5 h-5" />,
      event: <Calendar className="w-5 h-5" />,
      organization: <User className="w-5 h-5" />,
      recipe: <Package className="w-5 h-5" />
    };
    return icons[type as keyof typeof icons] || <Code className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Schema Markup Generator</h1>
        <p className="text-gray-600">Generate JSON-LD structured data for articles, products, reviews, and events to enhance search engine rich snippets.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getSchemaIcon(schemaType)}
            Schema Type
          </CardTitle>
          <CardDescription>
            Choose the type of structured data you want to create
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={schemaType} onValueChange={setSchemaType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="recipe">Recipe</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schema Properties</CardTitle>
          <CardDescription>
            Fill in the details for your {schemaType} schema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {getSchemaFields(schemaType).map((field, index) => (
            <div key={index}>
              <label htmlFor={field.name} className="block text-sm font-medium mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.name}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  className="min-h-[80px]"
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}
          
          <Button onClick={generateSchema} className="w-full">
            <Code className="w-4 h-4 mr-2" />
            Generate Schema Markup
          </Button>
        </CardContent>
      </Card>

      {generatedSchema && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Schema Markup
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="json" className="w-full">
              <TabsList>
                <TabsTrigger value="json">JSON-LD</TabsTrigger>
                <TabsTrigger value="html">HTML Implementation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="json">
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 border">
                  {generatedSchema}
                </pre>
              </TabsContent>
              
              <TabsContent value="html">
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto max-h-96 border">
{`<script type="application/ld+json">
${generatedSchema}
</script>`}
                </pre>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Implementation:</strong> Copy the above code and paste it in the &lt;head&gt; section of your HTML document.
                    This will help search engines understand your content better and may result in rich snippets in search results.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}