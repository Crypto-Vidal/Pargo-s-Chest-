'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { Sparkles, PlusCircle, FolderTree } from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    icon: Sparkles,
    title: 'Welcome to Video Vault',
    description:
      'Your personal video library, organized beautifully. Save any video, add notes, and find everything instantly.',
  },
  {
    icon: PlusCircle,
    title: 'Save Videos Instantly',
    description:
      "Paste any video URL and we'll grab the details for you. YouTube, Vimeo, or any other platform - just paste and go.",
  },
  {
    icon: FolderTree,
    title: 'Stay Organized',
    description:
      'Use categories, tags, and notes to organize your videos. Track watch status and find anything in seconds with powerful search.',
  },
]

export default function OnboardingModal() {
  const { isOnboardingComplete, completeOnboarding } = useStore()
  const [currentStep, setCurrentStep] = useState(0)

  if (isOnboardingComplete) return null

  const currentStepData = ONBOARDING_STEPS[currentStep]
  const Icon = currentStepData.icon
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  return (
    <Modal
      isOpen={!isOnboardingComplete}
      onClose={handleSkip}
      showCloseButton={false}
    >
      <div className="text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
            <Icon size={64} className="text-primary-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">{currentStepData.title}</h2>
          <p className="text-base text-white/70 leading-relaxed max-w-md mx-auto">
            {currentStepData.description}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2">
          {ONBOARDING_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-primary-500'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {isLastStep ? 'Start Using Video Vault' : 'Next'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
