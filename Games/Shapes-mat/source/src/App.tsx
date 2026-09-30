import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Grid3X3, Maximize2, Puzzle, RotateCcw, Shapes, Sparkles, Volume2, VolumeX, WandSparkles } from 'lucide-react'
import { resolveBuildLayout, type BuildMode, type Target } from './game/layouts'
import { PIECES, SHAPE_PATHS, TILE_PATH, type FoamPiece } from './game/pieces'

type Point = { x: number; y: number }
type PiecePositions = Record<string, { base: Point; shape: Point; tile: Point }>
type DragKind = 'base' | 'shape' | 'tile'
type ActiveDrag = { id: string; kind: DragKind; pointerId: number; dx: number; dy: number }
type Burst = { id: number; x: number; y: number; big: boolean }
type Activity = 'match' | 'pair' | 'mat' | 'make'

const INITIAL_POSITIONS = Object.fromEntries(
  PIECES.map((piece) => [
    piece.id,
    {
      base: { x: piece.baseStart.x, y: piece.baseStart.y },
      shape: { x: piece.shapeStart.x, y: piece.shapeStart.y },
      tile: { x: piece.baseStart.x, y: piece.baseStart.y },
    },
  ]),
) as PiecePositions

const BUILD_STARTS: Point[] = [
  { x: 8, y: 10 }, { x: 8, y: 26 }, { x: 8, y: 42 }, { x: 8, y: 58 }, { x: 8, y: 74 }, { x: 8, y: 90 },
  { x: 92, y: 10 }, { x: 92, y: 26 }, { x: 92, y: 42 }, { x: 92, y: 58 }, { x: 92, y: 74 }, { x: 92, y: 90 },
]

const PAIR_POSITIONS = Object.fromEntries(
  PIECES.map((piece) => [piece.id, {
    base: { x: 30, y: 51 },
    shape: { x: 70, y: 51 },
    tile: { x: 30, y: 51 },
  }]),
) as PiecePositions

function readInitialRoute(): { activity: Activity; phase: 'match' | 'build'; mode: BuildMode } {
  const params = new URLSearchParams(window.location.search)
  const requestedActivity = params.get('activity')
  const requestedMode = params.get('mode')
  if (requestedActivity === 'pair') return { activity: 'pair', phase: 'match', mode: 'mat' }
  if (requestedActivity === 'mat') return { activity: 'mat', phase: 'build', mode: 'mat' }
  if (requestedActivity === 'make') {
    const mode: BuildMode = requestedMode === 'castle' || requestedMode === 'bridge' ? requestedMode : 'house'
    return { activity: 'make', phase: 'build', mode }
  }
  return { activity: 'match', phase: 'match', mode: 'mat' }
}

const INITIAL_ROUTE = readInitialRoute()

function buildStartingPositions() {
  const positions = structuredClone(INITIAL_POSITIONS)
  PIECES.forEach((piece, index) => {
    positions[piece.id].tile = BUILD_STARTS[index]
  })
  return positions
}

const MODE_LABELS: Record<BuildMode, string> = {
  mat: 'Build a mat',
  house: 'House',
  castle: 'Castle',
  bridge: 'Bridge',
}

function App() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const [phase, setPhase] = useState<'match' | 'build'>(INITIAL_ROUTE.phase)
  const [activity, setActivity] = useState<Activity>(INITIAL_ROUTE.activity)
  const [positions, setPositions] = useState<PiecePositions>(() => INITIAL_ROUTE.activity === 'pair' ? structuredClone(PAIR_POSITIONS) : INITIAL_ROUTE.phase === 'build' ? buildStartingPositions() : structuredClone(INITIAL_POSITIONS))
  const [paired, setPaired] = useState<Set<string>>(() => new Set())
  const [activeDrag, setActiveDrag] = useState<ActiveDrag | null>(null)
  const [soundOn, setSoundOn] = useState(true)
  const [bursts, setBursts] = useState<Burst[]>([])
  const [buildMode, setBuildMode] = useState<BuildMode>(INITIAL_ROUTE.mode)
  const [placed, setPlaced] = useState<Record<string, number>>({})
  const [showBuildChoice, setShowBuildChoice] = useState(false)
  const [showMakeChoice, setShowMakeChoice] = useState(false)
  const [pairIndex, setPairIndex] = useState(0)
  const [showPairComplete, setShowPairComplete] = useState(false)
  const [canvasMetrics, setCanvasMetrics] = useState({ width: 1200, height: 600, tileSize: 100 })

  const pairedCount = paired.size
  const placedCount = Object.keys(placed).length
  const allPaired = pairedCount === PIECES.length
  const buildComplete = placedCount === PIECES.length
  const buildTargets = useMemo(
    () => resolveBuildLayout(buildMode, canvasMetrics.width, canvasMetrics.height, canvasMetrics.tileSize),
    [buildMode, canvasMetrics],
  )

  useLayoutEffect(() => {
    if (phase !== 'build' || !canvasRef.current) return
    const canvas = canvasRef.current
    const measure = () => {
      const canvasRect = canvas.getBoundingClientRect()
      const tileRect = canvas.querySelector<HTMLElement>('.completed-object')?.getBoundingClientRect()
      if (!canvasRect.width || !canvasRect.height) return
      const next = {
        width: canvasRect.width,
        height: canvasRect.height,
        tileSize: tileRect?.width || canvasMetrics.tileSize,
      }
      setCanvasMetrics((current) => current.width === next.width && current.height === next.height && current.tileSize === next.tileSize ? current : next)
    }
    measure()
    if (!window.ResizeObserver) return
    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [buildMode, phase, canvasMetrics.tileSize])

  useLayoutEffect(() => {
    if (phase !== 'build' || !Object.keys(placed).length) return
    setPositions((current) => {
      const next = { ...current }
      Object.entries(placed).forEach(([id, targetIndex]) => {
        const target = buildTargets[targetIndex]
        next[id] = { ...next[id], tile: { x: target.x, y: target.y } }
      })
      return next
    })
  }, [buildTargets, phase, placed])

  const pointFromEvent = useCallback((event: React.PointerEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    }
  }, [])

  const addBurst = useCallback((point: Point, big = false) => {
    const id = Date.now() + Math.random()
    setBursts((current) => [...current, { id, x: point.x, y: point.y, big }])
    window.setTimeout(() => setBursts((current) => current.filter((burst) => burst.id !== id)), big ? 1800 : 1050)
  }, [])

  const playNotes = useCallback((complete = false) => {
    if (!soundOn) return
    const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
    if (!AudioContextClass) return
    const context = audioRef.current ?? new AudioContextClass()
    audioRef.current = context
    void context.resume()
    const now = context.currentTime
    const notes = complete ? [523.25, 659.25, 783.99, 1046.5] : [659.25, 880]
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = index % 2 ? 'triangle' : 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, now + index * 0.09)
      gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.09 + 0.025)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.09 + 0.32)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(now + index * 0.09)
      oscillator.stop(now + index * 0.09 + 0.34)
    })
  }, [soundOn])

  const celebrate = useCallback((point: Point, complete = false) => {
    addBurst(point, complete)
    playNotes(complete)
    navigator.vibrate?.(complete ? [50, 40, 90] : 45)
  }, [addBurst, playNotes])

  const getPosition = useCallback((id: string, kind: DragKind): Point => {
    if (kind === 'tile') return positions[id].tile
    return positions[id][kind]
  }, [positions])

  const beginDrag = useCallback((event: React.PointerEvent, id: string, kind: DragKind) => {
    if (event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const pointer = pointFromEvent(event)
    const origin = getPosition(id, kind)
    setActiveDrag({ id, kind, pointerId: event.pointerId, dx: pointer.x - origin.x, dy: pointer.y - origin.y })
  }, [getPosition, pointFromEvent])

  const moveDrag = useCallback((event: React.PointerEvent) => {
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return
    const pointer = pointFromEvent(event)
    const next = {
      x: Math.max(5, Math.min(95, pointer.x - activeDrag.dx)),
      y: Math.max(7, Math.min(93, pointer.y - activeDrag.dy)),
    }
    setPositions((current) => ({
      ...current,
      [activeDrag.id]: { ...current[activeDrag.id], [activeDrag.kind]: next },
    }))
  }, [activeDrag, pointFromEvent])

  const finishMatchDrag = useCallback((drag: ActiveDrag) => {
    const current = positions[drag.id]
    const first = drag.kind === 'base' ? current.base : current.shape
    const second = drag.kind === 'base' ? current.shape : current.base
    const distance = Math.hypot(first.x - second.x, first.y - second.y)
    if (distance > 12) return

    const tilePoint = drag.kind === 'base' ? current.shape : current.base
    const nextCount = pairedCount + 1
    setPositions((all) => ({ ...all, [drag.id]: { ...all[drag.id], tile: tilePoint } }))
    setPaired((currentPaired) => new Set(currentPaired).add(drag.id))
    celebrate(tilePoint, nextCount === PIECES.length)
    if (activity === 'pair') {
      if (nextCount === PIECES.length) {
        window.setTimeout(() => setShowPairComplete(true), 900)
      } else {
        window.setTimeout(() => setPairIndex((current) => current + 1), 650)
      }
    } else if (nextCount === PIECES.length) {
      window.setTimeout(() => setShowBuildChoice(true), 900)
    }
  }, [activity, celebrate, pairedCount, positions])

  const finishBuildDrag = useCallback((drag: ActiveDrag) => {
    const point = positions[drag.id].tile
    const previousTargetIndex = placed[drag.id]
    const occupied = new Set(Object.entries(placed).filter(([id]) => id !== drag.id).map(([, index]) => index))
    let nearest = -1
    let nearestDistance = Number.POSITIVE_INFINITY
    buildTargets.forEach((target, index) => {
      if (occupied.has(index)) return
      const distance = Math.hypot(point.x - target.x, point.y - target.y)
      if (distance < nearestDistance) {
        nearest = index
        nearestDistance = distance
      }
    })
    if (nearest < 0 || nearestDistance > 13) {
      if (previousTargetIndex !== undefined) {
        const previousTarget = buildTargets[previousTargetIndex]
        setPositions((all) => ({
          ...all,
          [drag.id]: { ...all[drag.id], tile: { x: previousTarget.x, y: previousTarget.y } },
        }))
      }
      return
    }

    const target = buildTargets[nearest]
    const nextPlaced = { ...placed, [drag.id]: nearest }
    setPlaced(nextPlaced)
    setPositions((all) => ({ ...all, [drag.id]: { ...all[drag.id], tile: { x: target.x, y: target.y } } }))
    celebrate(target, Object.keys(nextPlaced).length === PIECES.length)
  }, [buildTargets, celebrate, placed, positions])

  const endDrag = useCallback((event: React.PointerEvent) => {
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return
    if (phase === 'match' && activeDrag.kind !== 'tile') finishMatchDrag(activeDrag)
    if (phase === 'build' && activeDrag.kind === 'tile') finishBuildDrag(activeDrag)
    setActiveDrag(null)
  }, [activeDrag, finishBuildDrag, finishMatchDrag, phase])

  const enterBuild = useCallback((mode: BuildMode) => {
    setBuildMode(mode)
    setPhase('build')
    setActivity(mode === 'mat' ? 'mat' : 'make')
    setShowBuildChoice(false)
    setShowMakeChoice(false)
    setPlaced({})
    setPositions((current) => {
      const next = { ...current }
      PIECES.forEach((piece, index) => {
        next[piece.id] = { ...next[piece.id], tile: BUILD_STARTS[index] }
      })
      return next
    })
  }, [])

  const switchBuildMode = useCallback((mode: BuildMode) => {
    setBuildMode(mode)
    setActivity(mode === 'mat' ? 'mat' : 'make')
    setPlaced({})
    setPositions((current) => {
      const next = { ...current }
      PIECES.forEach((piece, index) => {
        next[piece.id] = { ...next[piece.id], tile: BUILD_STARTS[index] }
      })
      return next
    })
  }, [])

  const reset = useCallback(() => {
    if (phase === 'match') {
      setPositions(activity === 'pair' ? PAIR_POSITIONS : INITIAL_POSITIONS)
      setPaired(new Set())
      setPairIndex(0)
      setShowPairComplete(false)
      setShowBuildChoice(false)
    } else {
      switchBuildMode(buildMode)
    }
  }, [activity, buildMode, phase, switchBuildMode])

  const startOver = useCallback(() => {
    setPhase('match')
    setActivity('match')
    setPositions(INITIAL_POSITIONS)
    setPaired(new Set())
    setPlaced({})
    setShowBuildChoice(false)
    setShowMakeChoice(false)
    setShowPairComplete(false)
    setPairIndex(0)
  }, [])

  const selectActivity = useCallback((nextActivity: Activity) => {
    setActiveDrag(null)
    setPlaced({})
    setShowBuildChoice(false)
    setShowMakeChoice(false)
    setShowPairComplete(false)

    if (nextActivity === 'match') {
      setActivity('match')
      setPhase('match')
      setPaired(new Set())
      setPairIndex(0)
      setPositions(INITIAL_POSITIONS)
      return
    }

    if (nextActivity === 'pair') {
      setActivity('pair')
      setPhase('match')
      setPaired(new Set())
      setPairIndex(0)
      setPositions(PAIR_POSITIONS)
      return
    }

    if (nextActivity === 'mat') {
      enterBuild('mat')
      return
    }

    setShowMakeChoice(true)
  }, [enterBuild])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }, [])

  const title = showMakeChoice ? 'Make something' : activity === 'match' ? 'Match the pieces' : activity === 'pair' ? 'Pair' : activity === 'mat' ? 'Build a mat' : MODE_LABELS[buildMode]
  const progress = phase === 'match' ? `${pairedCount} / ${PIECES.length}` : `${placedCount} / ${PIECES.length}`

  return (
    <main className="app-shell">
      <header className="game-header">
        <div className="brand-block">
          <div className="logo-bubble"><Sparkles aria-hidden="true" /></div>
          <div>
            <p className="game-name">Rudy's Shape Mat</p>
            <h1>{title}</h1>
          </div>
        </div>
        <div className="progress" aria-live="polite" aria-label={`${phase === 'match' ? 'Pairs' : 'Tiles'} completed ${progress}`}>
          <span>{progress}</span>
          <small>{phase === 'match' ? 'PAIRS' : 'PLACED'}</small>
        </div>
        <nav className="header-actions" aria-label="Game controls">
          <button className="round-button sound" onClick={() => setSoundOn((value) => !value)} aria-label={soundOn ? 'Mute sound' : 'Turn sound on'}>
            {soundOn ? <Volume2 /> : <VolumeX />}
          </button>
          <button className="round-button" onClick={reset} aria-label="Reset this activity"><RotateCcw /></button>
          <button className="round-button fullscreen" onClick={toggleFullscreen} aria-label="Full screen"><Maximize2 /></button>
        </nav>
      </header>

      <ActivitySwitcher activity={showMakeChoice ? 'make' : activity} onSelect={selectActivity} />

      <section
        ref={canvasRef}
        className={`play-canvas ${phase} ${activity} ${activeDrag ? 'is-dragging' : ''}`}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={() => setActiveDrag(null)}
        aria-label={showMakeChoice ? 'Choose something to make' : activity === 'match' ? 'Match each loose shape with its foam base' : activity === 'pair' ? `Pair ${PIECES[pairIndex].name}` : `Build a ${buildMode} with completed foam tiles`}
      >
        {phase === 'build' ? <BuildGuide mode={buildMode} placed={placed} targets={buildTargets} /> : null}

        {PIECES.map((piece, index) => {
          if (activity === 'pair' && index !== pairIndex) return null
          if (phase === 'match' && !paired.has(piece.id)) {
            return (
              <MatchPieces
                key={piece.id}
                piece={piece}
                position={positions[piece.id]}
                activeDrag={activeDrag}
                onPointerDown={beginDrag}
              />
            )
          }
          if (phase === 'match' || phase === 'build') {
            const position = positions[piece.id].tile
            const targetIndex = placed[piece.id]
            const targetRotation = targetIndex === undefined ? 0 : buildTargets[targetIndex].rotate ?? 0
            return (
              <DraggableTile
                key={piece.id}
                piece={piece}
                index={index}
                position={position}
                rotation={phase === 'build' ? targetRotation : 0}
                active={activeDrag?.id === piece.id}
                onPointerDown={phase === 'build' ? beginDrag : undefined}
              />
            )
          }
          return null
        })}

        {bursts.map((burst) => <CelebrationBurst key={burst.id} burst={burst} />)}

        {allPaired && phase === 'match' && !showBuildChoice ? (
          <button className="next-button" onClick={() => setShowBuildChoice(true)}>Let's build!</button>
        ) : null}

        {showBuildChoice ? <BuildChooser onChoose={enterBuild} /> : null}
        {showMakeChoice ? <MakeChooser onChoose={enterBuild} onClose={() => setShowMakeChoice(false)} /> : null}
        {showPairComplete ? <PairCompletionCard onAgain={() => selectActivity('pair')} onNext={() => selectActivity('mat')} /> : null}
        {buildComplete ? <CompletionCard mode={buildMode} onAgain={() => switchBuildMode(buildMode)} onStartOver={startOver} /> : null}
      </section>

      <p className="play-hint">
        {showMakeChoice ? 'Choose a picture to build.' : activity === 'match' ? 'Find every matching base and shape.' : activity === 'pair' ? `Pair ${pairIndex + 1} of ${PIECES.length}: pull the two pieces together.` : activity === 'mat' ? 'Connect all twelve completed tiles into the 4 × 3 mat.' : `Place the completed tiles to make a ${buildMode}.`}
      </p>
    </main>
  )
}

function ActivitySwitcher({ activity, onSelect }: { activity: Activity; onSelect: (activity: Activity) => void }) {
  const activities: Array<{ id: Activity; label: string; icon: React.ReactNode }> = [
    { id: 'match', label: 'Match', icon: <Shapes aria-hidden="true" /> },
    { id: 'pair', label: 'Pair', icon: <Puzzle aria-hidden="true" /> },
    { id: 'mat', label: 'Build a mat', icon: <Grid3X3 aria-hidden="true" /> },
    { id: 'make', label: 'Make something', icon: <WandSparkles aria-hidden="true" /> },
  ]
  return (
    <nav className="activity-switcher" aria-label="Choose an activity">
      {activities.map((item) => (
        <button key={item.id} className={item.id === activity ? 'selected' : ''} aria-pressed={item.id === activity} onClick={() => onSelect(item.id)}>
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function MatchPieces({ piece, position, activeDrag, onPointerDown }: {
  piece: FoamPiece
  position: PiecePositions[string]
  activeDrag: ActiveDrag | null
  onPointerDown: (event: React.PointerEvent, id: string, kind: DragKind) => void
}) {
  const baseActive = activeDrag?.id === piece.id && activeDrag.kind === 'base'
  const shapeActive = activeDrag?.id === piece.id && activeDrag.kind === 'shape'
  return (
    <>
      <button
        className={`foam-object base-object ${baseActive ? 'active' : ''}`}
        style={{ left: `${position.base.x}%`, top: `${position.base.y}%`, '--rotate': `${baseActive ? 0 : piece.baseStart.rotate}deg`, '--tilt-x': `${piece.baseStart.tiltX}deg`, '--tilt-y': `${piece.baseStart.tiltY}deg` } as React.CSSProperties}
        onPointerDown={(event) => onPointerDown(event, piece.id, 'base')}
        aria-label={`${piece.name} base`}
      >
        <FoamBase piece={piece} />
      </button>
      <button
        className={`foam-object shape-object ${shapeActive ? 'active' : ''}`}
        style={{ left: `${position.shape.x}%`, top: `${position.shape.y}%`, '--rotate': `${shapeActive ? 0 : piece.shapeStart.rotate}deg`, '--tilt-x': `${piece.shapeStart.tiltX}deg`, '--tilt-y': `${piece.shapeStart.tiltY}deg` } as React.CSSProperties}
        onPointerDown={(event) => onPointerDown(event, piece.id, 'shape')}
        aria-label={`${piece.name} shape`}
      >
        <FoamShape piece={piece} />
      </button>
    </>
  )
}

function DraggableTile({ piece, index, position, rotation, active, onPointerDown }: {
  piece: FoamPiece
  index: number
  position: Point
  rotation: number
  active: boolean
  onPointerDown?: (event: React.PointerEvent, id: string, kind: DragKind) => void
}) {
  return (
    <button
      className={`foam-object completed-object ${active ? 'active' : ''} ${onPointerDown ? 'draggable' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%`, '--rotate': `${rotation || (index % 2 ? 2 : -2)}deg`, '--tilt-x': `${index % 3 - 1}deg`, '--tilt-y': `${(index + 1) % 3 - 1}deg` } as React.CSSProperties}
      onPointerDown={onPointerDown ? (event) => onPointerDown(event, piece.id, 'tile') : undefined}
      aria-label={`Completed ${piece.name} tile`}
    >
      <CompletedTile piece={piece} />
    </button>
  )
}

function FoamBase({ piece }: { piece: FoamPiece }) {
  const compoundPath = `${TILE_PATH} ${SHAPE_PATHS[piece.shape]}`
  const materialId = `base-${piece.id}`
  return (
    <svg viewBox="0 0 100 104" role="img" aria-hidden="true">
      <FoamDefs id={materialId} color={piece.baseColor} />
      <path className="foam-side" d={compoundPath} fillRule="evenodd" transform="translate(0 5.5)" style={{ fill: shade(piece.baseColor, -25) }} />
      <path className="foam-face" d={compoundPath} fillRule="evenodd" style={{ fill: `url(#${materialId}-gradient)` }} />
      <path className="foam-texture" d={compoundPath} fillRule="evenodd" style={{ fill: `url(#${materialId}-texture)` }} />
      <path className="foam-edge-highlight" d={TILE_PATH} />
      <path className="hole-depth" d={SHAPE_PATHS[piece.shape]} transform="translate(0 1.6)" />
      <path className="hole-highlight" d={SHAPE_PATHS[piece.shape]} transform="translate(0 -0.8)" />
    </svg>
  )
}

function FoamShape({ piece }: { piece: FoamPiece }) {
  const materialId = `shape-${piece.id}`
  return (
    <svg viewBox="0 0 100 104" role="img" aria-hidden="true">
      <FoamDefs id={materialId} color={piece.shapeColor} />
      <path className="foam-side" d={SHAPE_PATHS[piece.shape]} transform="translate(0 6)" style={{ fill: shade(piece.shapeColor, -26) }} />
      <path className="foam-face" d={SHAPE_PATHS[piece.shape]} style={{ fill: `url(#${materialId}-gradient)` }} />
      <path className="foam-texture" d={SHAPE_PATHS[piece.shape]} style={{ fill: `url(#${materialId}-texture)` }} />
      <path className="shape-edge-highlight" d={SHAPE_PATHS[piece.shape]} />
    </svg>
  )
}

function CompletedTile({ piece }: { piece: FoamPiece }) {
  const baseMaterialId = `tile-base-${piece.id}`
  const shapeMaterialId = `tile-shape-${piece.id}`
  return (
    <svg viewBox="0 0 100 104" role="img" aria-hidden="true">
      <FoamDefs id={baseMaterialId} color={piece.baseColor} />
      <FoamDefs id={shapeMaterialId} color={piece.shapeColor} />
      <path className="foam-side" d={TILE_PATH} transform="translate(0 5.5)" style={{ fill: shade(piece.baseColor, -25) }} />
      <path className="foam-face" d={TILE_PATH} style={{ fill: `url(#${baseMaterialId}-gradient)` }} />
      <path className="foam-texture" d={TILE_PATH} style={{ fill: `url(#${baseMaterialId}-texture)` }} />
      <path className="foam-edge-highlight" d={TILE_PATH} />
      <path className="insert-bed" d={SHAPE_PATHS[piece.shape]} transform="translate(0 1.4)" style={{ fill: shade(piece.shapeColor, -20) }} />
      <path className="foam-face insert" d={SHAPE_PATHS[piece.shape]} style={{ fill: `url(#${shapeMaterialId}-gradient)` }} />
      <path className="foam-texture insert-texture" d={SHAPE_PATHS[piece.shape]} style={{ fill: `url(#${shapeMaterialId}-texture)` }} />
      <path className="insert-seam" d={SHAPE_PATHS[piece.shape]} />
    </svg>
  )
}

function FoamDefs({ id, color }: { id: string; color: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-gradient`} x1="0" y1="0" x2="0.78" y2="1">
        <stop offset="0" stopColor={shade(color, 14)} />
        <stop offset="0.48" stopColor={color} />
        <stop offset="1" stopColor={shade(color, -12)} />
      </linearGradient>
      <pattern id={`${id}-texture`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
        <path d="M-1 1 L1 -1 M0 4 L4 0 M3 5 L5 3" stroke="#ffffff" strokeWidth="0.78" opacity="0.32" />
        <path d="M0 2 H4" stroke="#18202a" strokeWidth="0.52" opacity="0.16" />
        <circle cx="1.15" cy="1.1" r="0.45" fill="#ffffff" opacity="0.26" />
      </pattern>
    </defs>
  )
}

function BuildGuide({ mode, placed, targets }: { mode: BuildMode; placed: Record<string, number>; targets: Target[] }) {
  const occupied = new Set(Object.values(placed))
  return (
    <div className={`build-guide ${mode}`} aria-hidden="true">
      {targets.map((target, index) => (
        <div
          key={`${mode}-${index}`}
          className={`target-slot ${occupied.has(index) ? 'filled' : ''}`}
          style={{ left: `${target.x}%`, top: `${target.y}%`, '--target-rotate': `${target.rotate ?? 0}deg` } as React.CSSProperties}
        >
          <svg viewBox="0 0 100 100"><path d={TILE_PATH} /></svg>
        </div>
      ))}
    </div>
  )
}

function BuildChooser({ onChoose }: { onChoose: (mode: BuildMode) => void }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="build-title">
      <div className="chooser-card">
        <div className="chooser-stars">★ <span>★</span> ★</div>
        <h2 id="build-title">Great matching!</h2>
        <p>What should we make now?</p>
        <div className="build-options">
          {(Object.keys(MODE_LABELS) as BuildMode[]).map((mode) => (
            <button key={mode} onClick={() => onChoose(mode)}>
              <ModeIcon mode={mode} />
              <span>{MODE_LABELS[mode]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MakeChooser({ onChoose, onClose }: { onChoose: (mode: BuildMode) => void; onClose: () => void }) {
  const modes: Array<Exclude<BuildMode, 'mat'>> = ['house', 'castle', 'bridge']
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="make-title">
      <div className="chooser-card make-chooser-card">
        <div className="chooser-stars">★ <span>★</span> ★</div>
        <h2 id="make-title">Make something!</h2>
        <p>Pick a picture, then place the twelve completed tiles.</p>
        <div className="build-options make-options">
          {modes.map((mode) => (
            <button key={mode} onClick={() => onChoose(mode)}>
              <ModeIcon mode={mode} />
              <span>{MODE_LABELS[mode]}</span>
            </button>
          ))}
        </div>
        <button className="chooser-close" onClick={onClose}>Back to the game</button>
      </div>
    </div>
  )
}

function PairCompletionCard({ onAgain, onNext }: { onAgain: () => void; onNext: () => void }) {
  return (
    <div className="overlay completion-overlay" role="dialog" aria-modal="true" aria-labelledby="pair-complete-title">
      <div className="chooser-card completion-card">
        <div className="trophy">★</div>
        <h2 id="pair-complete-title">Perfect pairs!</h2>
        <p>Rudy paired all twelve shapes and bases.</p>
        <div className="completion-actions">
          <button className="primary" onClick={onNext}>Build the mat</button>
          <button onClick={onAgain}>Pair them again</button>
        </div>
      </div>
    </div>
  )
}

function CompletionCard({ mode, onAgain, onStartOver }: { mode: BuildMode; onAgain: () => void; onStartOver: () => void }) {
  return (
    <div className="overlay completion-overlay" role="dialog" aria-modal="true" aria-labelledby="complete-title">
      <div className="chooser-card completion-card">
        <div className="trophy">★</div>
        <h2 id="complete-title">Amazing, Rudy!</h2>
        <p>You built the {MODE_LABELS[mode].toLowerCase()}!</p>
        <div className="completion-actions">
          <button className="primary" onClick={onAgain}>Build it again</button>
          <button onClick={onStartOver}>Match from the start</button>
        </div>
      </div>
    </div>
  )
}

function ModeIcon({ mode }: { mode: BuildMode }) {
  if (mode === 'mat') return <span className="mode-glyph mat-glyph"><i /><i /><i /><i /></span>
  if (mode === 'house') return <span className="mode-glyph house-glyph"><i /></span>
  if (mode === 'castle') return <span className="mode-glyph castle-glyph"><i /><i /><i /></span>
  return <span className="mode-glyph bridge-glyph"><i /><i /></span>
}

function CelebrationBurst({ burst }: { burst: Burst }) {
  return (
    <div className={`celebration ${burst.big ? 'big' : ''}`} style={{ left: `${burst.x}%`, top: `${burst.y}%` }} aria-hidden="true">
      {Array.from({ length: burst.big ? 22 : 12 }, (_, index) => (
        <i key={index} style={{ '--i': index, '--count': burst.big ? 22 : 12 } as React.CSSProperties} />
      ))}
      <strong>{burst.big ? 'HOORAY!' : 'YAY!'}</strong>
    </div>
  )
}

function shade(hex: string, amount: number) {
  const value = Number.parseInt(hex.slice(1), 16)
  const red = Math.max(0, Math.min(255, (value >> 16) + amount))
  const green = Math.max(0, Math.min(255, ((value >> 8) & 0xff) + amount))
  const blue = Math.max(0, Math.min(255, (value & 0xff) + amount))
  return `#${(blue | (green << 8) | (red << 16)).toString(16).padStart(6, '0')}`
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

export default App
