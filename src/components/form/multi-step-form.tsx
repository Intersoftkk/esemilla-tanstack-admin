'use client'

import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react'

import type {ComponentType, ReactNode} from 'react'

export interface MultiStepFormStep {
    key: string
    label: string
    icon?: ComponentType<{ className?: string }>
    children: ReactNode
}

export interface MultiStepFormRef {
    handleNext: () => void
    handleBack: () => void
    goToStep: (key: string) => void
    activeKey: string
    activeIndex: number
    isFirst: boolean
    isLast: boolean
    progress: number
}

export interface MultiStepFormProps {
    steps: MultiStepFormStep[]
    initialKey?: string
    onStepChange?: (key: string, index: number) => void
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

export const MultiStepForm = forwardRef<MultiStepFormRef, MultiStepFormProps>(
    ({steps, initialKey, onStepChange}, ref) => {
        const [activeKey, setActiveKey] = useState(
            initialKey ?? steps[0]?.key ?? '',
        )

        const activeIndex = Math.max(
            0,
            steps.findIndex((s) => s.key === activeKey),
        )

        const isFirst = activeIndex === 0
        const isLast = activeIndex === steps.length - 1

        const progress =
            steps.length > 1
                ? Math.round((activeIndex / (steps.length - 1)) * 100)
                : 100

        const navigateTo = (index: number) => {
            const clamped = clamp(index, 0, steps.length - 1)
            const nextKey = steps[clamped].key

            setActiveKey(nextKey)
            onStepChange?.(nextKey, clamped)
        }

        useEffect(() => {
            if (!steps.length) return

            const exists = steps.some((s) => s.key === activeKey)
            if (!exists) setActiveKey(steps[0].key)
        }, [steps, activeKey])

        useImperativeHandle(ref, () => ({
            handleNext: () => navigateTo(activeIndex + 1),
            handleBack: () => navigateTo(activeIndex - 1),
            goToStep: (key) => {
                const idx = steps.findIndex((s) => s.key === key)
                if (idx !== -1) navigateTo(idx)
            },
            activeKey,
            activeIndex,
            isFirst,
            isLast,
            progress,
        }))

        return (
            <>
                {steps.map((step, index) =>
                    index === activeIndex ? (
                        <div key={step.key}>{step.children}</div>
                    ) : null,
                )}
            </>
        )
    },
)

MultiStepForm.displayName = 'MultiStepForm'