import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface FeatureCard {
  title: string
  description: string
  icon: string
  bg: string
  col: string
}

const featureCards: FeatureCard[] = [
  {
    title: "Daily Mali missions",
    description: "Complete micro-challenges like 'Save R5 today'. Mali cheers you on every step.",
    icon: "🎯",
    bg: "#E6F1FB",
    col: "#0C447C",
  },
  {
    title: "Goal-based quests",
    description: "Set savings goals like 'R200 for school shoes' and track progress with milestone celebrations.",
    icon: "�",
    bg: "#EAF3DE",
    col: "#27500A",
  },
  {
    title: "Glossary",
    description: "A comprehensive glossary of financial terms to help you understand the world of money.",
    icon: "📚",
    bg: "#EEEDFE",
    col: "#3C3489",
  },
  {
    title: "Mini-games & quizzes",
    description: "Learn budgeting through puzzles, trivia, and spending-vs-saving games in Mali's witty voice.",
    icon: "🎮",
    bg: "#FAEEDA",
    col: "#633806",
  },
  {
    title: "Peer competitions",
    description: "Challenge friends in weekly save-offs and climb the leaderboards with Mali as your host.",
    icon: "⚡",
    bg: "#FBEAF0",
    col: "#72243E",
  },
  {
    title: "Streaks & rewards",
    description: "Earn XP, badges, and real rewards like airtime by maintaining consistent saving habits.",
    icon: "🔥",
    bg: "#FCEBEB",
    col: "#791F1F",
  },
  {
    title: "USSD & SMS access",
    description: "No smartphone? No problem! Access MaliGo via USSD codes and SMS on any feature phone.",
    icon: "📱",
    bg: "#E1F5EE",
    col: "#085041",
  },
]

const N = featureCards.length
const REPS = 11        // repeat the deck 11× so the silent snap is always far from view
const TOTAL = N * REPS
const MID = Math.floor(REPS / 2)

export default function FeatureCarousel() {
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [slideW, setSlideW] = useState(0)
  const [stageW, setStageW] = useState(0)
  const [pos, setPos] = useState(MID * N)
  const [realIdx, setRealIdx] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [animated, setAnimated] = useState(false)

  // Refs for values that are read inside event handlers (avoids stale closures)
  const busyRef = useRef(false)
  const posRef = useRef(MID * N)
  const realIdxRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragStartRef = useRef(0)
  const dragCurrentRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragOffsetRef = useRef<number | null>(null)

  // ── Measure ──────────────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (!stageRef.current) return
      const w = stageRef.current.offsetWidth
      setStageW(w)
      setSlideW(w * 0.72)
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────
  const getOffset = useCallback(
    (p: number) => -(p * slideW) + stageW / 2 - slideW / 2,
    [slideW, stageW]
  )

  // After each animated move, silently snap back to the middle repetition
  const recenter = useCallback(() => {
    const target = MID * N + realIdxRef.current
    if (posRef.current !== target) {
      posRef.current = target
      setPos(target)
      setAnimated(false)
    }
  }, [])

  const move = useCallback((dir: number) => {
    if (busyRef.current) return
    busyRef.current = true
    const newPos = posRef.current + dir
    const newReal = ((realIdxRef.current + dir) % N + N) % N
    posRef.current = newPos
    realIdxRef.current = newReal
    setPos(newPos)
    setRealIdx(newReal)
    setAnimated(true)
  }, [])

  const jumpTo = useCallback((idx: number) => {
    busyRef.current = false
    posRef.current = MID * N + idx
    realIdxRef.current = idx
    setPos(MID * N + idx)
    setRealIdx(idx)
    setAnimated(true)
  }, [])

  // ── Auto-play ─────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => move(1), 3000)
  }, [move])

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (playing) startTimer()
    else stopTimer()
    return stopTimer
  }, [playing, startTimer, stopTimer])

  // ── Keyboard navigation ───────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        move(-1)
      } else if (e.key === "ArrowRight") {
        move(1)
      } else if (e.key === " ") {
        e.preventDefault()
        setPlaying(p => !p)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [move])

  // ── Transition end → recenter ─────────────────────────────────────────────
  const handleTransitionEnd = useCallback(() => {
    recenter()
    busyRef.current = false
  }, [recenter])

  // ── Mouse drag ────────────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true
      dragStartRef.current = e.clientX
      dragCurrentRef.current = e.clientX
      dragOffsetRef.current = getOffset(posRef.current)
    },
    [getOffset]
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || dragOffsetRef.current === null) return
      dragCurrentRef.current = e.clientX
      const delta = e.clientX - dragStartRef.current
      if (trackRef.current) {
        trackRef.current.style.transition = "none"
        trackRef.current.style.transform = `translateX(${dragOffsetRef.current + delta}px)` 
      }
    }
    const onMouseUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      const delta = dragCurrentRef.current - dragStartRef.current
      if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1)
      else {
        setAnimated(true)
        setPos(posRef.current)
      }
      startTimer()
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [move, startTimer])

  // ── Touch drag ────────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      dragStartRef.current = e.touches[0].clientX
      dragCurrentRef.current = e.touches[0].clientX
      dragOffsetRef.current = getOffset(posRef.current)
    },
    [getOffset]
  )

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragOffsetRef.current === null) return
    dragCurrentRef.current = e.touches[0].clientX
    const delta = e.touches[0].clientX - dragStartRef.current
    if (trackRef.current) {
      trackRef.current.style.transition = "none"
      trackRef.current.style.transform = `translateX(${dragOffsetRef.current + delta}px)` 
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const delta = dragCurrentRef.current - dragStartRef.current
    if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1)
    else {
      setAnimated(true)
      setPos(posRef.current)
    }
    startTimer()
  }, [move, startTimer])

  // ── Derived values ────────────────────────────────────────────────
  const trackTransform = `translateX(${getOffset(pos)}px)` 
  const trackTransition = animated ? "transform 0.42s cubic-bezier(0.4,0,0.2,1)" : "none"

  return (
    <div className="w-full py-6 overflow-hidden">
      {/* Stage */}
      <div
        ref={stageRef}
        className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Track */}
        <div
          ref={trackRef}
          className="flex items-center"
          style={{
            width: slideW ? `${TOTAL * slideW}px` : "auto",
            transform: trackTransform,
            transition: trackTransition,
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {Array.from({ length: TOTAL }).map((_, i) => {
            const card = featureCards[i % N]
            const diff = Math.abs(i - pos)

            const cardClass =
              diff === 0
                ? "scale-100 opacity-100 shadow-lg border-gray-300"
                : diff === 1
                ? "scale-90 opacity-50 shadow-none border-transparent"
                : "scale-[0.82] opacity-0 shadow-none border-transparent"

            return (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center p-2"
                style={{ width: slideW ? `${slideW}px` : "auto" }}
                onClick={() => {
                  const d = i - pos
                  if (d === 1 || d === -1) move(d)
                }}
              >
                <div
                  className={`w-full flex flex-col items-center justify-center text-center rounded-2xl border bg-white transition-all duration-[420ms] ease-in-out px-6 py-8 select-none ${cardClass}`}
                  style={{ height: "210px" }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-xl mb-3 flex-shrink-0"
                    style={{ background: card.bg, color: card.col }}
                  >
                    {card.icon}
                  </div>
                  <p className="text-[15px] font-medium text-gray-800 mb-2 leading-snug">
                    {card.title}
                  </p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {featureCards.map((_, i) => (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            className={`h-[7px] rounded-full transition-all duration-300 border-none cursor-pointer ${
              i === realIdx
                ? "w-6 bg-gray-800"
                : "w-[7px] bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Play / Pause */}
      <div className="flex justify-center mt-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="text-xs text-gray-400 border border-gray-200 rounded-lg px-4 py-1 hover:bg-gray-50 hover:text-gray-600 transition-colors"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      {/* Instructions */}
      <div className="flex justify-center mt-2">
        <p className="text-xs text-gray-400">
          Use arrow keys to navigate: Previous (←), Next (→) • Space to play/pause
        </p>
      </div>
    </div>
  )
}
