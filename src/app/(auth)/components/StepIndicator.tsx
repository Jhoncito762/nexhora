// components/StepIndicator.tsx
import { Check } from "lucide-react"
import { STEPS, type StepId } from "@/src/hooks/useStepper"

interface StepIndicatorProps {
    current: StepId
}

export function StepIndicator({ current }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-0 mb-10" role="list" aria-label="Pasos del proceso">
            {STEPS.map((s, i) => {
                const stepNum = (i + 1) as StepId
                const done = current > stepNum
                const active = current === stepNum

                return (
                    <div key={i} className="flex items-center" role="listitem">
                        <div className="flex flex-col items-center">
                            <div
                                className={[
                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                                    done ? "bg-accent text-white"
                                        : active ? "bg-primary text-white shadow-md shadow-primary/30"
                                            : "bg-border text-muted-foreground",
                                ].join(" ")}
                            >
                                {done ? (
                                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                                ) : (
                                    stepNum
                                )}
                            </div>

                            <span
                                className={[
                                    "text-[10px] mt-1.5 font-medium whitespace-nowrap",
                                    active ? "text-primary" : done ? "text-accent" : "text-muted-foreground",
                                ].join(" ")}
                            >
                                {s.label}
                            </span>
                        </div>

                        {i < STEPS.length - 1 && (
                            <div
                                className={[
                                    "h-px w-12 mx-1 mb-4 transition-all duration-500",
                                    done ? "bg-accent" : "bg-border",
                                ].join(" ")}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}