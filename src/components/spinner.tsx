"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Spinner() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const colors = [
    "border-emeral-500",
    "border-secondary",
    "border-accent",
    "border-muted",
  ]

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="bg-background w-full min-h-screen flex items-center justify-center">
      <motion.div
        className={`w-16 h-16 border-4 border-t-transparent rounded-full ${colors[currentColorIndex]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}