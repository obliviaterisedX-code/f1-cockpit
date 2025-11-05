"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { RaceIndicators } from "@/components/race-indicators"
import { TireVisualization } from "@/components/tire-visualization"
import { AeroSimulation } from "@/components/aero-simulation"

interface TelemetryDashboardProps {
  isRacing: boolean
  onRacingChange: (racing: boolean) => void
}

export function TelemetryDashboard({ isRacing, onRacingChange }: TelemetryDashboardProps) {
  const [speed, setSpeed] = useState(0)
  const [rpm, setRpm] = useState(0)
  const [gear, setGear] = useState(1)
  const [fuel, setFuel] = useState(100)
  const [tireFrontLeft, setTireFrontLeft] = useState(100)
  const [tireFrontRight, setTireFrontRight] = useState(100)
  const [tireRearLeft, setTireRearLeft] = useState(100)
  const [tireRearRight, setTireRearRight] = useState(100)
  const [drs, setDrs] = useState(false)
  const [ers, setErs] = useState(100)
  const [temperature, setTemperature] = useState<number | null>(null)

  useEffect(() => {
    setTemperature(Math.round(80 + Math.random() * 20)) // client-only temperature

    if (!isRacing) return

    const interval = setInterval(() => {
      setSpeed((prev) => {
        const target = 200 + Math.random() * 150
        return prev + (target - prev) * 0.1
      })

      setRpm((prev) => {
        const target = 8000 + Math.random() * 7000
        return prev + (target - prev) * 0.15
      })

      setGear((prev) => {
        const newGear = Math.floor(speed / 50) + 1
        return Math.min(8, Math.max(1, newGear))
      })

      setFuel((prev) => Math.max(0, prev - 0.02))
      setTireFrontLeft((prev) => Math.max(0, prev - 0.015))
      setTireFrontRight((prev) => Math.max(0, prev - 0.015))
      setTireRearLeft((prev) => Math.max(0, prev - 0.02))
      setTireRearRight((prev) => Math.max(0, prev - 0.02))
      setErs((prev) => Math.min(100, prev + 0.5))
      setDrs(Math.random() > 0.7)
    }, 100)

    return () => clearInterval(interval)
  }, [isRacing, speed])

  return (
    <div className="space-y-4">
      {/* Main Speed Display */}
      <Card className="border-glow-red bg-card/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-8xl font-bold font-mono glow-red tabular-nums">{Math.round(speed)}</div>
              <div className="text-2xl text-muted-foreground font-mono">KM/H</div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <div className="text-6xl font-bold font-mono glow-yellow">{gear}</div>
                <div className="text-sm text-muted-foreground font-mono">GEAR</div>
              </div>

              <Button
                size="lg"
                variant={isRacing ? "destructive" : "default"}
                onClick={() => onRacingChange(!isRacing)}
                className="gap-2"
              >
                {isRacing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isRacing ? "STOP" : "START"}
              </Button>
            </div>

            <div className="flex-1 flex justify-end">
              <div className="text-center">
                <div className="text-5xl font-bold font-mono glow-cyan tabular-nums">{Math.round(rpm)}</div>
                <div className="text-sm text-muted-foreground font-mono">RPM</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Telemetry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground">FUEL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-secondary">{fuel.toFixed(1)}%</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-secondary transition-all duration-300" style={{ width: `${fuel}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground">ERS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-accent">{Math.round(ers)}%</div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-300" style={{ width: `${ers}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground">DRS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold font-mono ${drs ? "text-primary glow-red" : "text-muted-foreground"}`}>
              {drs ? "OPEN" : "CLOSED"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-mono text-muted-foreground">TEMP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono text-foreground">
              {temperature !== null ? `${temperature}°C` : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Race Indicators */}
      <RaceIndicators isRacing={isRacing} />

      {/* Tire Visualization */}
      <TireVisualization
        tireFrontLeft={tireFrontLeft}
        tireFrontRight={tireFrontRight}
        tireRearLeft={tireRearLeft}
        tireRearRight={tireRearRight}
      />

      {/* Aerodynamics Simulation */}
      <AeroSimulation speed={speed} ers={ers} drs={drs} />
    </div>
  )
}
