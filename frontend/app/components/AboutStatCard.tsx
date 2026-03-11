'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

import {cn} from './lib/cn'

type AboutStatCardProps = {
  value?: string | null
  label?: string | null
  variant?: 'dark' | 'blue' | 'outline' | null
}

type ParsedCountValue = {
  prefix: string
  digits: number | null
  suffix: string
  raw: string
}

function parseCountValue(value: string): ParsedCountValue {
  const trimmed = value.trim()
  const match = trimmed.match(/^([^0-9]*)([0-9][0-9,]*)(.*)$/)

  if (!match) {
    return {
      prefix: '',
      digits: null,
      suffix: '',
      raw: trimmed,
    }
  }

  return {
    prefix: match[1] || '',
    digits: Number(match[2].replace(/,/g, '')),
    suffix: match[3] || '',
    raw: trimmed,
  }
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US', {maximumFractionDigits: 0}).format(value)
}

export default function AboutStatCard({value, label, variant}: AboutStatCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [displayValue, setDisplayValue] = useState(0)
  const parsedValue = useMemo(() => parseCountValue(value || ''), [value])

  useEffect(() => {
    const node = cardRef.current
    if (!node || parsedValue.digits == null) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {threshold: 0.35},
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [parsedValue.digits])

  useEffect(() => {
    if (!isVisible || parsedValue.digits == null) {
      return
    }

    const duration = 1400
    const start = performance.now()
    let frameId = 0

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round((parsedValue.digits || 0) * eased))

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [isVisible, parsedValue.digits])

  const cardClassName =
    variant === 'blue'
      ? 'about-stat-card about-stat-card-blue'
      : variant === 'outline'
        ? 'about-stat-card about-stat-card-outline'
        : 'about-stat-card about-stat-card-dark'

  const labelClassName =
    variant === 'blue' ? 'type-about-stat-label about-stat-card-label-dark' : 'type-about-stat-label about-stat-card-label-accent'

  const renderedValue =
    parsedValue.digits == null
      ? parsedValue.raw
      : `${parsedValue.prefix}${formatCount(isVisible ? displayValue : 0)}${parsedValue.suffix}`

  return (
    <div ref={cardRef} className={cn(cardClassName)}>
      <p className="type-about-stat-value">{renderedValue}</p>
      <p className={labelClassName}>{label || ''}</p>
    </div>
  )
}
