"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TireVisualizationProps {
  tireFrontLeft: number
  tireFrontRight: number
  tireRearLeft: number
  tireRearRight: number
}

export function TireVisualization({
  tireFrontLeft,
  tireFrontRight,
  tireRearLeft,
  tireRearRight,
}: TireVisualizationProps) {
  const [temps, setTemps] = useState<number[]>([null, null, null, null])
  const [deltas, setDeltas] = useState<string[]>(["", "", "", ""])

  useEffect(() => {
    const computeTemp = (wear: number, baseTemp = 85) =>
      Math.round(baseTemp + (100 - wear) * 0.3 + Math.random() * 10)

    const computeDelta = (wear: number) => {
      const delta = (100 - wear) * 0.02 + (Math.random() - 0.5) * 0.5
      return delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)
    }

    setTemps([
      computeTemp(tireFrontLeft),
      computeTemp(tireFrontRight),
      computeTemp(tireRearLeft),
      computeTemp(tireRearRight),
    ])

    setDeltas([
      computeDelta(tireFrontLeft),
      computeDelta(tireFrontRight),
      computeDelta(tireRearLeft),
      computeDelta(tireRearRight),
    ])
  }, [tireFrontLeft, tireFrontRight, tireRearLeft, tireRearRight])

  const getWearColor = (wear: number) => {
    if (wear > 70) return "text-green-500"
    if (wear > 40) return "text-yellow-500"
    if (wear > 20) return "text-orange-500"
    return "text-red-500"
  }

  const getWearIndicatorColor = (wear: number) => {
    if (wear > 70) return "bg-green-500"
    if (wear > 40) return "bg-yellow-500"
    if (wear > 20) return "bg-orange-500"
    return "bg-red-500"
  }

  const TireIcon = ({
    wear,
    label,
    temp,
    delta,
  }: {
    wear: number
    label: string
    temp: number | null
    delta: string
  }) => {
    const wearAngle = (wear / 100) * 360
    const wearConicGradient = `conic-gradient(from 0deg, ${getWearIndicatorColor(wear)} 0deg ${wearAngle}deg, rgba(255,255,255,0.1) ${wearAngle}deg 360deg)`

    return (
      <div className="relative">
        <div className="text-xs font-mono text-muted-foreground mb-2 text-center">{label}</div>
        <div className="relative w-24 h-24 mx-auto">
          <div
            className={`absolute inset-0 rounded-full ${getWearIndicatorColor(wear).replace("bg-", "")}`}
            style={{ filter: "blur(4px)", opacity: 0.3 }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: wearConicGradient,
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className={`text-2xl font-bold font-mono ${getWearColor(wear)}`}>{wear.toFixed(0)}%</div>
          </div>

          {/* Side labels */}
          <div className="absolute -left-20 top-0 bottom-0 flex flex-col justify-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-muted-foreground">{temp !== null ? `${temp}°C` : "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className={delta.startsWith("+") ? "text-green-500" : "text-red-500"}>{delta}s</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-around">
            <div className="w-1 h-1 rounded-full bg-black/50" />
            <div className="w-1 h-1 rounded-full bg-black/50" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-accent/30">
      <CardHeader>
        <CardTitle className="font-mono text-primary">TIRE STATUS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          <TireIcon wear={tireFrontLeft} label="FL" temp={temps[0]} delta={deltas[0]} />
          <TireIcon wear={tireFrontRight} label="FR" temp={temps[1]} delta={deltas[1]} />
          <TireIcon wear={tireRearLeft} label="RL" temp={temps[2]} delta={deltas[2]} />
          <TireIcon wear={tireRearRight} label="RR" temp={temps[3]} delta={deltas[3]} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Temperature</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <span>Δ Time</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
