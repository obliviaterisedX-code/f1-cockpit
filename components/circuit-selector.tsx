"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CircuitSelectorProps {
  selectedCircuit: string
  onCircuitChange: (circuit: string) => void
}

const circuits = [
  { id: "monaco", name: "Monaco", country: "🇲🇨" },
  { id: "silverstone", name: "Silverstone", country: "🇬🇧" },
  { id: "spa", name: "Spa-Francorchamps", country: "🇧🇪" },
  { id: "monza", name: "Monza", country: "🇮🇹" },
  { id: "suzuka", name: "Suzuka", country: "🇯🇵" },
  { id: "interlagos", name: "Interlagos", country: "🇧🇷" },
]

export function CircuitSelector({ selectedCircuit, onCircuitChange }: CircuitSelectorProps) {
  return (
    <Select value={selectedCircuit} onValueChange={onCircuitChange}>
      <SelectTrigger className="w-[240px] bg-card/50 backdrop-blur border-accent/30 font-mono">
        <SelectValue placeholder="Select Circuit" />
      </SelectTrigger>
      <SelectContent>
        {circuits.map((circuit) => (
          <SelectItem key={circuit.id} value={circuit.id} className="font-mono">
            {circuit.country} {circuit.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
