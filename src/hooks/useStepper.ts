// hooks/useStepper.ts
import { useState } from "react"

export type StepId = 1 | 2 | 3 | 4 // 4 = success

export interface StepConfig {
    label: string
    description: string
}

export const STEPS: StepConfig[] = [
    { label: "Correo", description: "Solicitar código" },
    { label: "Código", description: "Verificar código" },
    { label: "Contraseña", description: "Nueva contraseña" },
]

export interface UseStepperReturn {
    step: StepId
    isFirst: boolean
    isLast: boolean
    isDone: boolean
    next: () => void
    prev: () => void
    goTo: (s: StepId) => void
    reset: () => void
}

export function useStepper(initial: StepId = 1): UseStepperReturn {
    const [step, setStep] = useState<StepId>(initial)

    const totalSteps = STEPS.length as StepId // 3

    return {
        step,
        isFirst: step === 1,
        isLast: step === totalSteps,
        isDone: step > totalSteps,
        next: () => setStep((s) => Math.min(s + 1, totalSteps + 1) as StepId),
        prev: () => setStep((s) => Math.max(s - 1, 1) as StepId),
        goTo: (s) => setStep(s),
        reset: () => setStep(initial),
    }
}