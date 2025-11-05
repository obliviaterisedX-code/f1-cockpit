"use client"

import { useState } from "react"
import { TelemetryDashboard } from "@/components/telemetry-dashboard"
import { TrackMap } from "@/components/track-map"
import { DriverProfile } from "@/components/driver-profile"
import { EngineerRadio } from "@/components/engineer-radio"
import { CircuitSelector } from "@/components/circuit-selector"
import { LiveLeaderboard } from "@/components/live-leaderboard"

export default function F1CockpitPage() {
  const [selectedCircuit, setSelectedCircuit] = useState("monaco")
  const [isRacing, setIsRacing] = useState(false)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">RB</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight glow-red">RED BULL RACING</h1>
              <p className="text-sm text-muted-foreground font-mono">F1 COCKPIT SIMULATOR</p>
            </div>
          </div>
        </div>
        <CircuitSelector selectedCircuit={selectedCircuit} onCircuitChange={setSelectedCircuit} />
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
 
        {/* Left Column - Telemetry */}
        <div className="lg:col-span-2 space-y-4">
          <TelemetryDashboard isRacing={isRacing} onRacingChange={setIsRacing} />
        </div>

        {/* Right Column - Track & Profile */}
        <div className="space-y-4">
          {/*Driver Profile*/}
          <DriverProfile />
          <LiveLeaderboard isRacing={isRacing} />
          <TrackMap circuit={selectedCircuit} isRacing={isRacing} />
          <EngineerRadio isRacing={isRacing} />
        </div>
      </div>

     
    </div>
  )
}
