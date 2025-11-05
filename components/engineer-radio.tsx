"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Radio, Volume2 } from "lucide-react"

interface EngineerRadioProps {
  isRacing: boolean
}

const radioMessages = [
  // Formation lap and start
  { time: 2, from: "GP", message: "Okay Sherry, formation lap. Box, box, box at the end of the lap. Remember procedure." },
  { time: 10, from: "Max", message: "Copy, box at the end. Starting procedure." },
  { time: 17, from: "GP", message: "Lights out and away we go! Good start, good start!" },

  // Early race
  { time: 22, from: "Max", message: "Tires are not ready yet. I'm just sliding around." },
  { time: 27, from: "GP", message: "Copy Sherry. Push now, push now. We need to build gap." },
  { time: 34, from: "Max", message: "Understood. Pushing. Car feels better now." },

  // First pit window
  { time: 45, from: "GP", message: "So Sherry, box this lap, box this lap. Confirm." },
  { time: 50, from: "Max", message: "Are we sure? Tires still feel okay." },
  { time: 55, from: "Max", message: "Stop inventing!" },
  { time: 58, from: "GP", message: "Yes, positive. Undercut is strong. Box, box." },
  { time: 62, from: "Max", message: "Okay, coming in." },

  // Pit stop
  { time: 65, from: "GP", message: "2.1 second stop! Good job guys. Out in P2, 3.2 seconds behind Leclerc." },
  { time: 70, from: "Max", message: "Copy. Push now to catch him?" },
  { time: 74, from: "GP", message: "Affirmative. Push hard. He's on older tires." },

  // Chase mode
  { time: 78, from: "Max", message: "How's the gap? I'm pushing like hell here." },
  { time: 83, from: "GP", message: "Gap is 1.8 seconds. You're gaining three tenths per lap." },
  { time: 88, from: "Max", message: "Copy. Car is on rails now. Feeling good." },
  { time: 93, from: "Max", message: "This is unbelievable driving." },

  // DRS battle
  { time: 97, from: "GP", message: "DRS available next lap. You're within one second." },
  { time: 103, from: "Max", message: "I see him. Going for the move into turn 1." },
  { time: 109, from: "GP", message: "Clean overtake! P1! P1 Sherry! Great job!" },
  { time: 114, from: "Max", message: "Copy. What's the gap behind?" },

  // Managing the race
  { time: 120, from: "GP", message: "Gap to P2 is 2.8 seconds. Managing pace. Your tires need to last 25 more laps." },
  { time: 128, from: "Max", message: "Understood. These tires are holding on well." },
  { time: 140, from: "GP", message: "Watch for Hamilton behind. He's on newer tires and pushing." },
  { time: 145, from: "Max", message: "Copy. I can see him in the mirrors. No issues." },

  // Strategy update
  { time: 160, from: "GP", message: "Okay Sherry, slight change of plan. We're going to two-stop. Box in 5 laps." },
  { time: 165, from: "Max", message: "Two-stop? Are you sure? I can manage these to the end." },
  { time: 170, from: "Max", message: "We know what we're doing." },
  { time: 174, from: "GP", message: "Positive. Safety car window. Fresh tires will give us safety margin." },
  { time: 180, from: "Max", message: "Okay, understood. Preparing for box." },

  // Final stint
  { time: 186, from: "GP", message: "Out in P1! 15 laps to go. Push to build gap, then we manage." },
  { time: 195, from: "Max", message: "Gap is 5 seconds. Conserving tires now." },
  { time: 199, from: "Max", message: "We need to box, these tires are dead." },
  { time: 205, from: "GP", message: "Copy. Managing pace is good. Keep 2.5 second gap." },

  // Final laps
  { time: 220, from: "GP", message: "5 laps to go Shahryar. You're doing great job." },
  { time: 230, from: "Max", message: "How's everything looking? Fuel, tires?" },
  { time: 235, from: "Max", message: "I can't keep the car on track." },
  { time: 239, from: "GP", message: "All good. Fuel is positive, tires have margin. Just bring it home." },
  { time: 246, from: "Max", message: "What a joke!" },
  { time: 249, from: "GP", message: "Final lap Shahryar! Great drive." },
  { time: 255, from: "Max", message: "Copy. Thank you guys. Great strategy." },

  // Cool down
  { time: 262, from: "GP", message: "P1 Sherry! P1! Incredible drive. Box for parc ferme. Yayyy" },
  { time: 270, from: "Max", message: "Yesss! Great job everyone! Amazing work." }
]

const getMaleVoice = (preferredLanguage: string = 'en-US') => {
  const voices = speechSynthesis.getVoices()
  
  // First priority: Explicit male voices in preferred language
  let voice = voices.find(v => 
    v.lang.includes(preferredLanguage) && 
    v.name.toLowerCase().includes('male')
  )
  
  // Second priority: Any voice in preferred language that's not female
  if (!voice) {
    voice = voices.find(v => 
      v.lang.includes(preferredLanguage) && 
      !v.name.toLowerCase().includes('female')
    )
  }
  
  // Third priority: Any male voice
  if (!voice) {
    voice = voices.find(v => 
      v.name.toLowerCase().includes('male') && 
      !v.name.toLowerCase().includes('female')
    )
  }
  
  // Last resort: Any non-female voice
  if (!voice) {
    voice = voices.find(v => !v.name.toLowerCase().includes('female'))
  }
  
  // Final fallback: First available voice
  return voice || voices[0]
}

export function EngineerRadio({ isRacing }: EngineerRadioProps) {
  const [messages, setMessages] = useState<Array<{ time: number; from: string; message: string; id: number }>>([])
  const [raceTime, setRaceTime] = useState(0)
  const hasSpokenRef = useRef<Set<number>>(new Set())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isSpeakingRef = useRef<boolean>(false)

  // Load voices on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        speechSynthesis.getVoices()
      }
      loadVoices()
      speechSynthesis.onvoiceschanged = loadVoices
      
      return () => {
        speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isRacing) {
      setRaceTime(0)
      setMessages([])
      hasSpokenRef.current.clear()
      isSpeakingRef.current = false
      speechSynthesis.cancel() // Stop any ongoing speech
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setRaceTime((prev) => {
        const newTime = prev + 1

        // Check if there's a message to show at this time
        const messageToShow = radioMessages.find((msg) => msg.time === newTime)
        if (messageToShow && !hasSpokenRef.current.has(messageToShow.time)) {
          hasSpokenRef.current.add(messageToShow.time)
          const messageWithId = { ...messageToShow, id: Date.now() + Math.random() }
          setMessages((prevMessages) => [...prevMessages, messageWithId])

          // Use Web Speech API to speak the message
          if ('speechSynthesis' in window && !isSpeakingRef.current) {
            isSpeakingRef.current = true
            
            const utterance = new SpeechSynthesisUtterance(messageWithId.message)
            
            // Set voice properties based on who's speaking
            if (messageWithId.from === 'GP') {
              const gpVoice = getMaleVoice('en-US')
              if (gpVoice) utterance.voice = gpVoice
              utterance.rate = 1.3
              utterance.pitch = 0.9  // Lower pitch for male voice
            } else {
              const maxVoice = getMaleVoice('en-US')
              if (maxVoice) utterance.voice = maxVoice
              utterance.rate = 1.25
              utterance.pitch = 1.0  // Neutral pitch for younger male
            }

            utterance.volume = 0.8
            
            utterance.onend = () => {
              isSpeakingRef.current = false
            }
            
            utterance.onerror = () => {
              isSpeakingRef.current = false
            }

            speechSynthesis.speak(utterance)
          }
        }

        return newTime
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRacing])

  return (
    <Card className="bg-card/50 backdrop-blur border-accent/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono text-primary flex items-center gap-2">
            <Radio className="h-5 w-5" />
            TEAM RADIO
          </CardTitle>
          {isRacing && (
            <Badge variant="destructive" className="font-mono animate-pulse">
              <Volume2 className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground font-mono text-sm">
              {isRacing ? "Waiting for radio transmission..." : "Start race to hear team radio"}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg border ${
                  msg.from === "GP" ? "bg-accent/10 border-accent/30" : "bg-primary/10 border-primary/30"
                } animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={msg.from === "GP" ? "secondary" : "default"} className="font-mono text-xs">
                    {msg.from === "GP" ? "🎧 Gianpiero L." : "🏎️ MAX"}
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">
                    {Math.floor(msg.time / 60)}:{(msg.time % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <p className="text-sm font-mono">{msg.message}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}