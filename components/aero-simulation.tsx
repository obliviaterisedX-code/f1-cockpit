"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AeroSimulationProps {
  speed: number
  ers: number
  drs: boolean
}

export function AeroSimulation({ speed, ers, drs }: AeroSimulationProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.02)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // Calculate drag based on speed and DRS
  const dragMultiplier = drs ? 0.7 : 1.0
  const dragForce = Math.round(speed * speed * dragMultiplier * 0.01)
  const downforce = Math.round(speed * speed * 1.2)

  const speedFactor = speed / 300
  const ersIntensity = ers / 100

  const Streamline = ({ index, total }: { index: number; total: number }) => {
    const yPos = 15 + (index / total) * 70
    const flowSpeed = time * speedFactor * 150
    
    // Car boundaries
    const carStartX = 35
    const carEndX = 65
    
    // Calculate deflection based on car shape
    let pathPoints = []
    for (let x = 0; x <= 100; x += 2) {
      let y = yPos
      
      if (x >= carStartX && x <= carEndX) {
        const carProgress = (x - carStartX) / (carEndX - carStartX)
        
        // Different flow paths for different heights
        if (yPos < 35) {
          // Top flow - over the car
          y = yPos - Math.sin(carProgress * Math.PI) * (drs ? 15 : 22)
        } else if (yPos > 35 && yPos < 50) {
          // Mid-high flow
          y = yPos - Math.sin(carProgress * Math.PI) * (drs ? 8 : 12)
        } else if (yPos >= 50 && yPos < 65) {
          // Mid-low flow - through sidepods
          y = yPos + Math.sin(carProgress * Math.PI) * 3
        } else {
          // Bottom flow - under the car
          y = yPos + Math.sin(carProgress * Math.PI) * 18
        }
      }
      
      // Add turbulence in wake
      if (x > carEndX) {
        const wakeProgress = (x - carEndX) / (100 - carEndX)
        const turbulence = Math.sin(flowSpeed + index * 0.5) * (drs ? 2 : 4) * (1 - wakeProgress)
        y += turbulence
      }
      
      pathPoints.push(`${x},${y}`)
    }
    
    const pathData = `M ${pathPoints.join(' L ')}`
    
    // Color based on velocity (blue = fast, red = slow)
    const velocityColor = yPos < 40 || yPos > 60 ? 
      `hsl(${180 + (index * 2)}, 100%, ${50 + ersIntensity * 20}%)` : 
      `hsl(${60 - (index * 2)}, 100%, 50%)`
    
    return (
      <path
        d={pathData}
        stroke={velocityColor}
        strokeWidth="1.5"
        fill="none"
        opacity={0.6 + ersIntensity * 0.2}
        strokeDasharray="4 2"
        strokeDashoffset={-flowSpeed % 6}
        style={{
          filter: 'drop-shadow(0 0 2px currentColor)'
        }}
      />
    )
  }

  const CarWireframe = () => {
    return (
      <g transform="translate(0, 0)">
        {/* Front wing */}
        <path 
          d="M 36 52 L 38 48 L 38 56 L 36 52" 
          stroke="rgba(255, 255, 255, 0.8)" 
          strokeWidth="1.5" 
          fill="none"
        />
        <line x1="38" y1="46" x2="38" y2="58" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
        
        {/* Nose */}
        <path 
          d="M 38 50 Q 42 49, 45 50" 
          stroke="rgba(255, 255, 255, 0.8)" 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Cockpit */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="4" 
          ry="6" 
          stroke="rgba(0, 255, 255, 0.9)" 
          strokeWidth="2" 
          fill="rgba(0, 100, 150, 0.3)"
        />
        <line x1="48" y1="48" x2="52" y2="48" stroke="rgba(0, 255, 255, 0.9)" strokeWidth="1" />
        
        {/* Sidepods */}
        <path 
          d="M 45 54 Q 52 56, 58 55" 
          stroke="rgba(255, 255, 255, 0.7)" 
          strokeWidth="2" 
          fill="none"
        />
        <path 
          d="M 45 46 Q 52 44, 58 45" 
          stroke="rgba(255, 255, 255, 0.7)" 
          strokeWidth="2" 
          fill="none"
        />
        
        {/* Engine cover */}
        <path 
          d="M 52 48 L 60 47 L 62 50 L 60 53 L 52 52 Z" 
          stroke="rgba(255, 255, 255, 0.8)" 
          strokeWidth="1.5" 
          fill="rgba(150, 150, 150, 0.2)"
        />
        
        {/* Rear wing */}
        {drs ? (
          // DRS open - flatter wing
          <g>
            <line x1="64" y1="49" x2="68" y2="49" stroke="rgba(0, 255, 100, 0.9)" strokeWidth="2" strokeDasharray="2 1" />
            <line x1="64" y1="42" x2="64" y2="58" stroke="rgba(0, 255, 100, 0.7)" strokeWidth="1.5" />
          </g>
        ) : (
          // DRS closed - multi-element wing
          <g>
            <line x1="64" y1="45" x2="68" y2="43" stroke="rgba(255, 50, 50, 0.9)" strokeWidth="2" />
            <line x1="64" y1="50" x2="68" y2="50" stroke="rgba(255, 50, 50, 0.9)" strokeWidth="2" />
            <line x1="64" y1="55" x2="68" y2="57" stroke="rgba(255, 50, 50, 0.9)" strokeWidth="2" />
            <line x1="64" y1="40" x2="64" y2="60" stroke="rgba(255, 50, 50, 0.7)" strokeWidth="1.5" />
          </g>
        )}
        
        {/* Wheels */}
        <circle cx="44" cy="58" r="3" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" fill="rgba(50, 50, 50, 0.8)" />
        <circle cx="60" cy="58" r="3" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="2" fill="rgba(50, 50, 50, 0.8)" />
        
        {/* Undertray */}
        <path 
          d="M 42 58 L 62 58" 
          stroke="rgba(255, 255, 255, 0.5)" 
          strokeWidth="1" 
          strokeDasharray="2 2"
        />
      </g>
    )
  }

  const VortexIndicator = ({ x, y, rotation }: { x: number; y: number; rotation: number }) => {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        <circle cx="0" cy="0" r="4" stroke="rgba(255, 100, 100, 0.4)" strokeWidth="1" fill="none" />
        <circle cx="0" cy="0" r="2" stroke="rgba(255, 150, 100, 0.6)" strokeWidth="1" fill="none" />
      </g>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-accent/30">
      <CardHeader>
        <CardTitle className="font-mono text-primary">AERODYNAMICS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg overflow-hidden border border-cyan-500/20">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0, 255, 255, 0.05)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            
            {/* Pressure zones */}
            <ellipse cx="38" cy="50" rx="6" ry="12" fill="rgba(255, 50, 50, 0.15)" />
            <ellipse cx="68" cy="50" rx="10" ry="18" fill="rgba(50, 150, 255, 0.15)" />
            
            {/* Streamlines */}
            {Array.from({ length: 30 }, (_, i) => (
              <Streamline key={i} index={i} total={30} />
            ))}
            
            {/* Vortices in wake */}
            {speed > 100 && (
              <>
                <VortexIndicator x={70} y={40} rotation={time * 200} />
                <VortexIndicator x={70} y={60} rotation={-time * 200} />
                <VortexIndicator x={75} y={45} rotation={time * 150} />
                <VortexIndicator x={75} y={55} rotation={-time * 150} />
              </>
            )}
            
            {/* Car wireframe */}
            <CarWireframe />
          </svg>

          {/* DRS Status */}
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded border border-cyan-500/40">
            <div className={`w-2.5 h-2.5 rounded-full ${drs ? 'bg-green-500 shadow-lg shadow-green-500/50' : 'bg-red-500'}`} />
            <span className="text-xs font-mono font-bold tracking-wider">
              {drs ? 'DRS OPEN' : 'DRS CLOSED'}
            </span>
          </div>
          
          {/* Speed */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded border border-cyan-500/40">
            <span className="text-2xl font-mono font-bold text-cyan-400">{Math.round(speed)}</span>
            <span className="text-xs font-mono text-cyan-400/60 ml-1">km/h</span>
          </div>

          {/* ERS */}
          {ers > 0 && (
            <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded border border-yellow-500/40">
              <span className="text-xs font-mono font-bold text-yellow-400">ERS {Math.round(ers)}%</span>
            </div>
          )}
        </div>

        {/* Performance metrics */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <div className="text-xs font-mono text-muted-foreground mb-1">DRAG FORCE</div>
            <div className="text-2xl font-bold font-mono text-red-500">
              {dragForce.toLocaleString()} N
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-red-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, (dragForce / 5000) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-xs font-mono text-muted-foreground mb-1">DOWNFORCE</div>
            <div className="text-2xl font-bold font-mono text-cyan-500">
              {downforce.toLocaleString()} N
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-cyan-500 transition-all duration-300" 
                style={{ width: `${Math.min(100, (downforce / 7000) * 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}