"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LiveLeaderboardProps {
  isRacing: boolean
}

interface Driver {
  position: number
  name: string
  team: string
  lapTime: number
  gap: number
  isPlayer: boolean
}

export function LiveLeaderboard({ isRacing }: LiveLeaderboardProps) {
  const [drivers, setDrivers] = useState<Driver[]>([
    { position: 1, name: "VERSTAPPEN", team: "Red Bull", lapTime: 0, gap: 0, isPlayer: true },
    { position: 2, name: "HAMILTON", team: "Ferrari", lapTime: 0, gap: 0, isPlayer: false },
    { position: 3, name: "NORRIS", team: "McLaren", lapTime: 0, gap: 0, isPlayer: false },
    { position: 4, name: "LECLERC", team: "Ferrari", lapTime: 0, gap: 0, isPlayer: false },
    { position: 5, name: "RUSSELL", team: "Mercedes", lapTime: 0, gap: 0, isPlayer: false },
    { position: 6, name: "PIASTRI", team: "McLaren", lapTime: 0, gap: 0, isPlayer: false },
    { position: 7, name: "HULKENBERG", team: "Sauber", lapTime: 0, gap: 0, isPlayer: false },


  ])

  const [raceDistance, setRaceDistance] = useState<number | null>(null)
  const [showIndicator, setShowIndicator] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(3)
    return `${mins}:${secs.padStart(6, "0")}`
  }

  const formatGap = (gap: number) => {
    if (gap === 0) return "---"
    if (gap < 1) return `+${gap.toFixed(3)}`
    return `+${gap.toFixed(1)}`
  }

  useEffect(() => {
    setRaceDistance(Math.floor(Math.random() * 30))
    setShowIndicator(Math.random() > 0.8)
  }, [])

  useEffect(() => {
    if (!isRacing) return

    const interval = setInterval(() => {
      setDrivers((prev) => {
        return prev.map((driver, index) => {
          const baseLapTime = driver.lapTime || 80 + Math.random() * 20
          const timeVariation = (Math.random() - 0.5) * 0.5
          const newLapTime = baseLapTime + timeVariation

          const leaderTime = prev[0].lapTime || newLapTime
          const gap = newLapTime - leaderTime

          return {
            ...driver,
            lapTime: newLapTime,
            gap: gap,
            position: index + 1,
          }
        })
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isRacing])

  return (
    <Card className="bg-card/50 backdrop-blur border-accent/30">
      <CardHeader>
        <CardTitle className="font-mono text-primary">LIVE CLASSIFICATION</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {drivers.map((driver, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                driver.isPlayer
                  ? "bg-primary/10 border-primary/50 glow-red"
                  : "bg-muted/30 border-border/50 hover:bg-muted/50"
              }`}
            >
              <div className={`text-xl font-bold font-mono w-8 ${
                driver.position === 1 ? 'text-yellow-500' : 
                driver.position <= 3 ? 'text-secondary' : 'text-muted-foreground'
              }`}>
                {driver.position}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`font-mono font-bold text-sm truncate ${
                  driver.isPlayer ? 'text-primary' : 'text-foreground'
                }`}>
                  {driver.name}
                </div>
                <div className="text-xs font-mono text-muted-foreground truncate">
                  {driver.team}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-sm font-mono font-bold">
                  {formatTime(driver.lapTime)}
                </div>
                <div className={`text-xs font-mono ${
                  driver.isPlayer ? 'text-primary' : 
                  driver.position <= 3 ? 'text-secondary' : 'text-muted-foreground'
                }`}>
                  {formatGap(driver.gap)}
                </div>
              </div>

              {showIndicator && isRacing && (
                <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Race Distance: {raceDistance !== null ? `${raceDistance} / 58 laps` : "—"}</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              LIVE
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
