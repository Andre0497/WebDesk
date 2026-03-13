import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateStr = time.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })

  return (
    <div className="flex flex-col items-end text-white text-sm leading-tight">
      <span className="font-semibold">{timeStr}</span>
      <span className="text-xs text-white/70">{dateStr}</span>
    </div>
  )
}

