"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface RaceIndicatorsProps {
  isRacing: boolean
}

export function RaceIndicators({ isRacing }: RaceIndicatorsProps) {
  const [lightSequence, setLightSequence] = useState<number>(0)
  const [pitExitStatus, setPitExitStatus] = useState<"closed" | "open">("closed")

  
  useEffect(() => {
    if (!isRacing) {
      setLightSequence(0)
      return
    }

    // Start countdown sequence
    const sequence = setInterval(() => {
      setLightSequence((prev) => {
        if (prev >= 5) return 5
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(sequence)
  }, [isRacing])

  useEffect(() => {
    if (!isRacing) {
      setPitExitStatus("closed")
      return
    }

    // Simulate pit exit status
    const pitExitInterval = setInterval(() => {
      setPitExitStatus((prev) => (prev === "closed" ? "open" : "closed"))
    }, 3000)

    return () => clearInterval(pitExitInterval)
  }, [isRacing])

  const LightButton = ({ active, color }: { active: boolean; color: string }) => {
    const colorClass = color === "red" ? "bg-red-600" : "bg-green-500"
    const glowClass = color === "red" ? "shadow-[0_0_20px_rgba(220,38,38,0.8)]" : "shadow-[0_0_20px_rgba(34,197,94,0.8)]"
    
    return (
      <div 
        className={`w-10 h-10 rounded-full transition-all duration-300 ${
          active ? `${colorClass} ${glowClass}` : "bg-gray-700"
        }`}
      />
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-accent/30">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Race Start Lights */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-mono text-muted-foreground mb-3">RACE START</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((light) => (
                <LightButton 
                  key={light} 
                  active={light <= lightSequence} 
                  color={lightSequence >= 5 ? "green" : "red"} 
                />
              ))}
            </div>
            <div className="mt-2 text-xs font-mono text-muted-foreground">
              {lightSequence >= 5 ? "GO!" : `${lightSequence}/5`}
            </div>
          </div>

          {/* Pit Exit Light */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-mono text-muted-foreground mb-3">PIT EXIT</div>
            <LightButton 
              active={pitExitStatus === "open"} 
              color={pitExitStatus === "open" ? "green" : "red"} 
            />
            <div className="mt-2 text-xs font-mono text-muted-foreground uppercase">
              {pitExitStatus}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

