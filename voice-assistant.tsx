"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Volume2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VoiceAssistantProps {
  activeTab: string
}

export function VoiceAssistant({ activeTab }: VoiceAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentInstruction, setCurrentInstruction] = useState("")

  const instructions: Record<string, string[]> = {
    find: [
      "Welcome to AgriMandi! Let me help you find the best mandi prices.",
      "First, select your state from the State dropdown.",
      "Next, choose your district from the District dropdown.",
      "Then, select the crop you want to sell from the Crop dropdown.",
      "Finally, click the Search Prices button to see all available mandi prices.",
      "The results will show you the best price, trust scores, and distance from your location.",
    ],
    map: [
      "The Map View shows all mandis in your selected region.",
      "Click on any mandi marker to see detailed information.",
      "You can see the crop prices, market status, and operating hours.",
      "Click the Get Directions button to navigate to the selected mandi using Google Maps.",
      "The map also shows your current location with a blue marker.",
    ],
    trends: [
      "The Trends section shows historical price analysis for your selected crop.",
      "Select a district and crop from the dropdowns at the top.",
      "The line chart shows price trends over the last 30 days.",
      "The area chart displays the price range with minimum and maximum values.",
      "Volume analysis shows the quantity of crops traded each day.",
      "AI predictions provide forecasts for the next 7 days with confidence intervals.",
    ],
    alerts: [
      "The Alerts section helps you monitor unusual price changes.",
      "Select your district and crop to set up price monitoring.",
      "You will see alerts for unusual price increases or decreases.",
      "The anomaly detection system identifies potentially fake or manipulated prices.",
      "You can set custom price alerts to get notified when prices reach your target.",
    ],
    compare: [
      "Use the Compare tool to evaluate multiple mandis side by side.",
      "Select your state, district, and crop first.",
      "Choose up to 4 mandis you want to compare.",
      "The comparison shows prices, trust scores, distances, and demand levels.",
      "Charts help you visualize the differences between mandis.",
    ],
    report: [
      "Use Report Price to contribute real market data.",
      "Select the district where you sold your crop.",
      "Choose the mandi name from the dropdown.",
      "Select the crop you sold.",
      "Enter the price per quintal you received.",
      "Enter the quantity you sold in quintals.",
      "Select the transaction date.",
      "Optionally, upload a receipt or bill as proof.",
      "Click Submit Report to send your data for admin verification.",
    ],
    reports: [
      "My Reports shows all your submitted price reports.",
      "You can see the status of each report: Pending, Approved, or Rejected.",
      "Download your reports as CSV or Excel files for record keeping.",
      "Reports help improve price accuracy for all farmers in the platform.",
    ],
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      utterance.lang = "en-IN"

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const startInstructions = () => {
    const instructionList = instructions[activeTab] || instructions.find
    let index = 0

    const speakNext = () => {
      if (index < instructionList.length && isOpen) {
        setCurrentInstruction(instructionList[index])
        speak(instructionList[index])
        index++
        setTimeout(speakNext, 5000) // Wait 5 seconds between instructions
      }
    }

    speakNext()
  }

  useEffect(() => {
    if (isOpen && !isListening) {
      stopSpeaking()
      startInstructions()
    } else {
      stopSpeaking()
    }

    return () => stopSpeaking()
  }, [isOpen, activeTab])

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
      >
        <Mic className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-80 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">Voice Assistant</CardTitle>
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <Badge variant="secondary" className="gap-1">
              <Volume2 className="h-3 w-3" />
              Speaking
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false)
              stopSpeaking()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm leading-relaxed">{currentInstruction || "Getting instructions ready..."}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isSpeaking ? "destructive" : "default"}
            size="sm"
            className="flex-1"
            onClick={() => (isSpeaking ? stopSpeaking() : startInstructions())}
          >
            {isSpeaking ? (
              <>
                <MicOff className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Restart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
