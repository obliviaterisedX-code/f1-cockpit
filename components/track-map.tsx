"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TrackMapProps {
  circuit: string
  isRacing: boolean
}

const circuitData: Record<string, { 
  name: string; 
  length: string; 
  turns: number; 
  lapRecord: string;
  trackPath: string;
  viewBox: string;
  startPosition: { x: number; y: number };
}> = {
  monaco: { 
    name: "Monaco", 
    length: "3.337 km", 
    turns: 19, 
    lapRecord: "1:12.909",
    trackPath: "M 150 30 L 170 30 Q 180 30 180 40 L 180 70 Q 180 90 160 100 L 140 110 L 120 120 L 110 140 L 100 160 L 85 180 L 65 185 L 45 180 L 25 170 L 15 150 L 20 130 L 30 110 L 50 100 L 70 90 L 90 80 L 110 70 L 120 60 L 130 50 L 145 35 L 150 30",
    viewBox: "0 0 200 200",
    startPosition: { x: 150, y: 30 },
  },
  silverstone: { 
    name: "Silverstone", 
    length: "5.891 km", 
    turns: 18, 
    lapRecord: "1:27.097",
    // Silverstone is fast and flowing
    trackPath: "M 60 50 L 80 45 Q 100 40 120 45 L 140 50 Q 155 60 155 80 Q 150 100 130 110 Q 110 120 90 115 Q 70 110 60 130 Q 55 150 65 170 Q 75 180 50 175 Q 30 170 25 150 Q 30 130 45 110 Q 60 90 70 75 Q 55 60 60 50",
    viewBox: "0 0 200 200",
    startPosition: { x: 60, y: 50 }
  },
  spa: { 
    name: "Spa-Francorchamps", 
    length: "7.004 km", 
    turns: 19, 
    lapRecord: "1:46.286",
    // Spa is famous for Eau Rouge and long straights
    trackPath: "M 100 25 L 140 50 L 165 85 L 165 120 L 145 155 L 95 170 L 55 165 L 35 140 L 25 115 L 40 85 L 60 65 L 80 50 L 95 35 L 100 25",
    viewBox: "0 0 200 200",
    startPosition: { x: 100, y: 25 }
  },




  
  monza: { 
    name: "Monza", 
    length: "5.793 km", 
    turns: 11, 
    lapRecord: "1:21.046",
    trackPath: "M 60 60 L 140 55 L 155 70 L 155 100 L 140 130 L 100 140 L 60 130 L 45 100 L 50 70 L 65 62 L 60 60",
    viewBox: "0 0 200 200",
    startPosition: { x: 60, y: 60 }
  },



  suzuka: { 
    name: "Suzuka", 
    length: "5.807 km", 
    turns: 18, 
    lapRecord: "1:30.983",
    // Suzuka is a figure-8 track
    trackPath: "M 90 50 C 110 45 140 50 155 70 C 165 90 160 115 140 130 C 115 145 85 140 70 115 C 60 95 70 75 90 65 C 105 55 90 55 90 50 M 100 100 Q 80 100 70 100 Q 60 105 60 115 Q 65 125 75 135 Q 95 140 110 135 Q 125 130 125 115 Q 120 105 110 105 Q 100 100 100 100",
    viewBox: "0 0 200 200",
    startPosition: { x: 90, y: 50 }
  },
  interlagos: { 
    name: "Interlagos", 
    length: "4.309 km", 
    turns: 15, 
    lapRecord: "1:10.540",
    // Interlagos is hilly and technical
    trackPath: "M 80 60 Q 100 55 125 65 Q 150 80 145 105 Q 135 130 110 140 Q 85 145 60 130 Q 45 110 55 85 Q 70 65 80 60 M 90 110 Q 85 115 75 115 Q 70 115 70 120 Q 75 125 85 125 Q 95 120 90 110",
    viewBox: "0 0 200 200",
    startPosition: { x: 80, y: 60 }
  },
}

export function TrackMap({ circuit, isRacing }: TrackMapProps) {
  const [position, setPosition] = useState(0)
  const [currentLap, setCurrentLap] = useState(1)
  const [lapTime, setLapTime] = useState(0)
  const [bestLap, setBestLap] = useState<number | null>(null)

  const trackInfo = circuitData[circuit] || circuitData.monaco

  useEffect(() => {
    if (!isRacing) return

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPos = (prev + 2) % 360
        if (newPos < prev) {
          // Lap completed
          setCurrentLap((lap) => lap + 1)
          if (bestLap === null || lapTime < bestLap) {
            setBestLap(lapTime)
          }
          setLapTime(0)
        }
        return newPos
      })
      setLapTime((prev) => prev + 0.1)
    }, 100)

    return () => clearInterval(interval)
  }, [isRacing, lapTime, bestLap])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(3)
    return `${mins}:${secs.padStart(6, "0")}`
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-accent/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono text-primary">TRACK MAP</CardTitle>
          <Badge variant="secondary" className="font-mono">
            LAP {currentLap}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Track Visualization */}
        <div className="relative aspect-square bg-muted/20 rounded-lg border border-accent/20 overflow-hidden">
          <svg viewBox={trackInfo.viewBox} className="w-full h-full">
            {/* Track outline */}
            <path
              id="trackPath"
              d={trackInfo.trackPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/30"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Track centerline for extra detail */}
            <path
              d={trackInfo.trackPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent/20"
              strokeDasharray="5,5"
              strokeLinecap="round"
            />

            {/* Start/Finish line */}
            <circle
              cx={trackInfo.startPosition.x}
              cy={trackInfo.startPosition.y}
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-secondary"
            />
            <circle
              cx={trackInfo.startPosition.x}
              cy={trackInfo.startPosition.y}
              r="5"
              fill="currentColor"
              className="text-secondary"
            />

            {/* Car position - animated along track using rotate around center */}
            {isRacing && (
              <g transform={`rotate(${position} 100 100)`}>
                <circle
                  cx={trackInfo.startPosition.x}
                  cy={trackInfo.startPosition.y}
                  r="8"
                  fill="currentColor"
                  className="text-primary"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.5;1"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={trackInfo.startPosition.x}
                  cy={trackInfo.startPosition.y}
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary opacity-30"
                >
                  <animate
                    attributeName="r"
                    values="15;20;15"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.1;0.3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}
          </svg>

          {/* Position indicator */}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur px-3 py-1 rounded-md">
            <div className="text-xs font-mono text-muted-foreground">POSITION</div>
            <div className="text-2xl font-bold font-mono text-primary">P1</div>
          </div>
        </div>

        {/* Track Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/20 rounded-lg p-3 border border-accent/10">
            <div className="text-xs font-mono text-muted-foreground mb-1">CIRCUIT</div>
            <div className="text-sm font-bold font-mono">{trackInfo.name}</div>
          </div>
          <div className="bg-muted/20 rounded-lg p-3 border border-accent/10">
            <div className="text-xs font-mono text-muted-foreground mb-1">LENGTH</div>
            <div className="text-sm font-bold font-mono">{trackInfo.length}</div>
          </div>
          <div className="bg-muted/20 rounded-lg p-3 border border-accent/10">
            <div className="text-xs font-mono text-muted-foreground mb-1">TURNS</div>
            <div className="text-sm font-bold font-mono">{trackInfo.turns}</div>
          </div>
          <div className="bg-muted/20 rounded-lg p-3 border border-accent/10">
            <div className="text-xs font-mono text-muted-foreground mb-1">RECORD</div>
            <div className="text-sm font-bold font-mono text-accent">{trackInfo.lapRecord}</div>
          </div>
        </div>

        {/* Lap Times */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-muted-foreground">CURRENT LAP</span>
            <span className="text-lg font-bold font-mono text-foreground">{formatTime(lapTime)}</span>
          </div>
          {bestLap !== null && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-muted-foreground">BEST LAP</span>
              <span className="text-lg font-bold font-mono text-accent glow-cyan">{formatTime(bestLap)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
