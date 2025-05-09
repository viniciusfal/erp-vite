'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Spinner() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const colors = [
    'border-emeral-500',
    'border-secondary',
    'border-accent',
    'border-muted',
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <motion.div
        className={`h-16 w-16 rounded-full border-4 border-t-transparent ${colors[currentColorIndex]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}
