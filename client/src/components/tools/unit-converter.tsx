import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, Thermometer, Weight, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UnitConverter() {
  const [value, setValue] = useState('1');
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('foot');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const conversions = {
    length: {
      meter: { name: 'Meter (m)', factor: 1 },
      kilometer: { name: 'Kilometer (km)', factor: 0.001 },
      centimeter: { name: 'Centimeter (cm)', factor: 100 },
      millimeter: { name: 'Millimeter (mm)', factor: 1000 },
      inch: { name: 'Inch (in)', factor: 39.3701 },
      foot: { name: 'Foot (ft)', factor: 3.28084 },
      yard: { name: 'Yard (yd)', factor: 1.09361 },
      mile: { name: 'Mile (mi)', factor: 0.000621371 },
      nauticalMile: { name: 'Nautical Mile (nmi)', factor: 0.000539957 }
    },
    weight: {
      kilogram: { name: 'Kilogram (kg)', factor: 1 },
      gram: { name: 'Gram (g)', factor: 1000 },
      pound: { name: 'Pound (lb)', factor: 2.20462 },
      ounce: { name: 'Ounce (oz)', factor: 35.274 },
      ton: { name: 'Metric Ton (t)', factor: 0.001 },
      stone: { name: 'Stone (st)', factor: 0.157473 }
    },
    temperature: {
      celsius: { name: 'Celsius (°C)', factor: 1 },
      fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
      kelvin: { name: 'Kelvin (K)', factor: 1 },
      rankine: { name: 'Rankine (°R)', factor: 1 }
    },
    area: {
      squareMeter: { name: 'Square Meter (m²)', factor: 1 },
      squareKilometer: { name: 'Square Kilometer (km²)', factor: 0.000001 },
      squareCentimeter: { name: 'Square Centimeter (cm²)', factor: 10000 },
      squareInch: { name: 'Square Inch (in²)', factor: 1550 },
      squareFoot: { name: 'Square Foot (ft²)', factor: 10.7639 },
      acre: { name: 'Acre', factor: 0.000247105 },
      hectare: { name: 'Hectare (ha)', factor: 0.0001 }
    },
    volume: {
      liter: { name: 'Liter (L)', factor: 1 },
      milliliter: { name: 'Milliliter (mL)', factor: 1000 },
      gallon: { name: 'Gallon (gal)', factor: 0.264172 },
      quart: { name: 'Quart (qt)', factor: 1.05669 },
      pint: { name: 'Pint (pt)', factor: 2.11338 },
      cup: { name: 'Cup', factor: 4.22675 },
      fluidOunce: { name: 'Fluid Ounce (fl oz)', factor: 33.814 }
    },
    time: {
      second: { name: 'Second (s)', factor: 1 },
      minute: { name: 'Minute (min)', factor: 1/60 },
      hour: { name: 'Hour (hr)', factor: 1/3600 },
      day: { name: 'Day', factor: 1/86400 },
      week: { name: 'Week', factor: 1/604800 },
      month: { name: 'Month', factor: 1/2629746 },
      year: { name: 'Year', factor: 1/31556952 }
    }
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case 'celsius': celsius = value; break;
      case 'fahrenheit': celsius = (value - 32) * 5/9; break;
      case 'kelvin': celsius = value - 273.15; break;
      case 'rankine': celsius = (value - 491.67) * 5/9; break;
      default: celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case 'celsius': return celsius;
      case 'fahrenheit': return celsius * 9/5 + 32;
      case 'kelvin': return celsius + 273.15;
      case 'rankine': return celsius * 9/5 + 491.67;
      default: return celsius;
    }
  };

  const convert = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      toast({ title: "Error", description: "Please enter a valid number", variant: "destructive" });
      return;
    }

    let convertedValue: number;

    if (category === 'temperature') {
      convertedValue = convertTemperature(numValue, fromUnit, toUnit);
    } else {
      const categoryData = conversions[category as keyof typeof conversions];
      if (!categoryData) return;

      const fromFactor = categoryData[fromUnit as keyof typeof categoryData]?.factor || 1;
      const toFactor = categoryData[toUnit as keyof typeof categoryData]?.factor || 1;

      // Convert to base unit, then to target unit
      const baseValue = numValue / fromFactor;
      convertedValue = baseValue * toFactor;
    }

    setResult(convertedValue.toString());
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setValue(result);
      setResult(value);
    }
  };

  const clearAll = () => {
    setValue('');
    setResult('');
  };

  const getUnitsForCategory = (cat: string) => {
    return conversions[cat as keyof typeof conversions] || {};
  };

  const categoryIcons = {
    length: Ruler,
    weight: Weight,
    temperature: Thermometer,
    area: Ruler,
    volume: Ruler,
    time: Clock
  };

  const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons] || Ruler;

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={category} onValueChange={setCategory} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="length" data-testid="length-tab">Length</TabsTrigger>
          <TabsTrigger value="weight" data-testid="weight-tab">Weight</TabsTrigger>
          <TabsTrigger value="temperature" data-testid="temperature-tab">Temperature</TabsTrigger>
          <TabsTrigger value="area" data-testid="area-tab">Area</TabsTrigger>
          <TabsTrigger value="volume" data-testid="volume-tab">Volume</TabsTrigger>
          <TabsTrigger value="time" data-testid="time-tab">Time</TabsTrigger>
        </TabsList>

        {Object.keys(conversions).map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <CategoryIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold capitalize">{cat} Converter</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* From Unit */}
              <div>
                <Label htmlFor="from-value" className="block text-sm font-medium text-slate-700 mb-2">
                  From
                </Label>
                <Input
                  id="from-value"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="mb-2"
                  placeholder="Enter value"
                  data-testid="input-value"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger data-testid="from-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(getUnitsForCategory(cat)).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Convert Button */}
              <div className="flex flex-col space-y-2">
                <Button onClick={convert} className="w-full" data-testid="convert-button">
                  Convert
                </Button>
                <Button 
                  variant="outline" 
                  onClick={swapUnits} 
                  className="w-full"
                  data-testid="swap-button"
                >
                  ⇄ Swap
                </Button>
              </div>

              {/* To Unit */}
              <div>
                <Label htmlFor="to-value" className="block text-sm font-medium text-slate-700 mb-2">
                  To
                </Label>
                <Input
                  id="to-value"
                  type="text"
                  value={result}
                  readOnly
                  className="mb-2 bg-slate-50"
                  placeholder="Result"
                  data-testid="result-value"
                />
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger data-testid="to-unit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(getUnitsForCategory(cat)).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <div className="text-green-800 font-medium">
                  {value} {getUnitsForCategory(cat)[fromUnit as keyof typeof getUnitsForCategory]?.name} = {result} {getUnitsForCategory(cat)[toUnit as keyof typeof getUnitsForCategory]?.name}
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex space-x-4 mb-8">
        <Button variant="outline" onClick={clearAll} data-testid="clear-button">
          Clear
        </Button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Conversion Information:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• All conversions use standard international units as reference</p>
          <p>• Temperature conversions account for different scales (Celsius, Fahrenheit, Kelvin, Rankine)</p>
          <p>• Results are rounded to maintain precision while being readable</p>
          <p>• Use the swap button (⇄) to quickly reverse the conversion direction</p>
        </div>
      </div>
    </div>
  );
}
