"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap } from "lucide-react"

export function DriverProfile() {
  return (
    <Card className="bg-card/50 backdrop-blur border-primary/30">
      <CardHeader>
        <CardTitle className="font-mono text-primary flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            SAZ
          </div>
          DRIVER PROFILE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Driver Info */}
          <div className="space-y-3">
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-1">DRIVER</div>
              <div className="text-2xl font-bold">Shahryar Ali Zafar</div>
              
              <img src="/sherryredbull.png" alt="Shahryar Ali Zafar" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "8px" }} />

            </div>
            <div>
              <div className="text-sm font-mono text-muted-foreground mb-1">NUMBER</div>
              <div className="text-4xl font-bold font-mono text-primary glow-red">10</div>
              <img src="/sherryhelmet.png" alt="Sherry's Helmet" style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "8px" }} />

            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="font-mono">
                RED BULL RACING
              </Badge>
              <Badge variant="outline" className="font-mono">
                🇳🇱 NED
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-muted/20 rounded-lg p-3 border border-accent/10">
              <Trophy className="h-5 w-5 text-secondary" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">CHAMPIONSHIPS</div>
                <div className="text-2xl font-bold font-mono">4</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/20 rounded-lg p-3 border border-accent/10">
              <Target className="h-5 w-5 text-accent" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">RACE WINS</div>
                <div className="text-2xl font-bold font-mono">63</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-muted/20 rounded-lg p-3 border border-accent/10">
              <Zap className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs font-mono text-muted-foreground">POLE POSITIONS</div>
                <div className="text-2xl font-bold font-mono">40</div>
              </div>
            </div>
          </div>

          {/* Season Stats */}
          <div className="space-y-3">
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
              <div className="text-xs font-mono text-muted-foreground mb-2">2024 SEASON</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-mono">Points</span>
                  <span className="text-sm font-bold font-mono text-primary">575</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-mono">Wins</span>
                  <span className="text-sm font-bold font-mono text-secondary">19</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-mono">Podiums</span>
                  <span className="text-sm font-bold font-mono text-accent">22</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-mono">DNFs</span>
                  <span className="text-sm font-bold font-mono">1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
