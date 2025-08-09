import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Gift, Heart } from "lucide-react";

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();
    
    if (birth > today) {
      return;
    }

    // Calculate exact age
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total time lived
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Fun facts
    const heartBeats = Math.floor(totalMinutes * 70); // Average 70 beats per minute
    const breaths = Math.floor(totalMinutes * 15); // Average 15 breaths per minute

    setResults({
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      daysUntilBirthday,
      nextBirthday,
      heartBeats,
      breaths,
      zodiacSign: getZodiacSign(birth),
      dayOfWeek: birth.toLocaleDateString('en-US', { weekday: 'long' })
    });
  };

  const getZodiacSign = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const signs = [
      { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
      { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
      { sign: 'Pisces', start: [2, 19], end: [3, 20] },
      { sign: 'Aries', start: [3, 21], end: [4, 19] },
      { sign: 'Taurus', start: [4, 20], end: [5, 20] },
      { sign: 'Gemini', start: [5, 21], end: [6, 20] },
      { sign: 'Cancer', start: [6, 21], end: [7, 22] },
      { sign: 'Leo', start: [7, 23], end: [8, 22] },
      { sign: 'Virgo', start: [8, 23], end: [9, 22] },
      { sign: 'Libra', start: [9, 23], end: [10, 22] },
      { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
    ];

    for (const zodiac of signs) {
      const [startMonth, startDay] = zodiac.start;
      const [endMonth, endDay] = zodiac.end;
      
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return zodiac.sign;
      }
    }
    
    return 'Capricorn';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Age Calculator & Counter</h1>
        <p className="text-gray-600">Calculate exact age in years, months, days, hours, and minutes with birthday countdown and life statistics.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Enter Your Birth Date
          </CardTitle>
          <CardDescription>
            Select your birth date to calculate your exact age and life statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
          
          <Button onClick={calculateAge} disabled={!birthDate} className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Calculate Age
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Exact Age
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {results.years}
                </div>
                <div className="text-sm text-gray-600">Years</div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-blue-500">{results.months}</div>
                  <div className="text-xs text-gray-500">Months</div>
                </div>
                <div>
                  <div className="text-xl font-semibold text-blue-500">{results.days}</div>
                  <div className="text-xs text-gray-500">Days</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Time Lived
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Days:</span>
                  <span className="font-semibold">{formatNumber(results.totalDays)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-semibold">{formatNumber(results.totalHours)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Minutes:</span>
                  <span className="font-semibold">{formatNumber(results.totalMinutes)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Seconds:</span>
                  <span className="font-semibold">{formatNumber(results.totalSeconds)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-purple-500" />
                Next Birthday
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {results.daysUntilBirthday}
              </div>
              <div className="text-sm text-gray-600">Days to go</div>
              <div className="text-xs text-gray-500">
                {results.nextBirthday.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Life Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Heartbeats:</span>
                  <span className="font-semibold text-red-500">{formatNumber(results.heartBeats)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Breaths:</span>
                  <span className="font-semibold text-blue-500">{formatNumber(results.breaths)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Birth Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Day of Week:</span>
                  <span className="font-semibold">{results.dayOfWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zodiac Sign:</span>
                  <span className="font-semibold">{results.zodiacSign}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fun Facts</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="text-gray-600">
                You've been alive for approximately {Math.floor(results.totalDays / 365.25)} years, 
                which is about {Math.floor(results.totalDays / 365.25 / 4)} Olympic cycles!
              </div>
              {results.daysUntilBirthday === 0 && (
                <div className="text-center p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                  🎉 Happy Birthday! 🎂
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}