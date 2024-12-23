'use client'

import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Smile } from 'lucide-react'
import { Button } from '@/components/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/Dialog'
import { useToast } from '@/hooks/use-toast'
import { useVariable, useVariableValue } from '@devcycle/react-client-sdk'

export function RandomJoke() {
  const [joke, setJoke] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // DevCycle feature flag for enabling/disabling the joke feature
  const isJokeFeatureEnabled = useVariableValue('joke-feature', false)

  // DevCycle variable for customizing the button text
  const buttonText = useVariableValue('joke-button-text', 'Tell me a joke!')

  // DevCycle variable for confetti settings
  const confettiConfig = useVariable('confetti-config', {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  })

  const fetchJoke = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch joke')
      }

      const data = await response.json()
      setJoke(data.joke)

      // Trigger confetti with DevCycle config
      confetti(confettiConfig.value)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch a joke. Please try again!",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render the component if the feature is disabled
  if (!isJokeFeatureEnabled) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={fetchJoke}
          disabled={isLoading}
          className="gap-2"
        >
          <Smile className="h-4 w-4" />
          {isLoading ? 'Loading...' : buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dad Joke Time! 😄</DialogTitle>
          <DialogDescription className="text-lg pt-4">
            {joke || 'Click the button to get a new joke!'}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
