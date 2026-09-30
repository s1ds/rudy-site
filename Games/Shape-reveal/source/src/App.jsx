import { useEffect, useMemo, useState } from 'react'
import './App.css'

const MODES = [
  {
    id: 'basic',
    label: 'Level 1',
    title: 'Basic Shapes',
    shapes: ['circle', 'triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon'],
  },
  {
    id: 'quadrilaterals',
    label: 'Level 2',
    title: 'Quadrilaterals',
    shapes: [
      'square',
      'rectangle',
      'parallelogram wide',
      'parallelogram steep',
      'parallelogram thin',
      'rhombus diamond',
      'rhombus flat',
      'rhombus tall',
      'kite classic',
      'kite narrow',
      'trapezium',
    ],
  },
  {
    id: 'mixed',
    label: 'Level 3',
    title: 'Regular & Irregular',
    shapes: [
      'circle',
      'ellipse',
      'equilateral triangle',
      'right triangle',
      'obtuse triangle',
      'square',
      'rectangle',
      'parallelogram wide',
      'parallelogram steep',
      'parallelogram thin',
      'rhombus diamond',
      'rhombus flat',
      'rhombus tall',
      'kite classic',
      'kite narrow',
      'irregular pentagon',
      'irregular hexagon',
      'octagon',
    ],
  },
]

const SHAPE_DETAILS = {
  circle: { color: '#b72ee8', viewBox: '0 0 160 160', element: <circle cx="80" cy="80" r="56" /> },
  triangle: { color: '#0d9944', viewBox: '0 0 160 160', element: <polygon points="80,26 136,130 24,130" /> },
  square: { color: '#1649e8', viewBox: '0 0 160 160', element: <rect x="40" y="40" width="80" height="80" /> },
  rectangle: { color: '#f4c217', viewBox: '0 0 160 160', element: <rect x="38" y="52" width="84" height="56" /> },
  pentagon: { color: '#ea1ad9', viewBox: '0 0 160 160', element: <polygon points="80,24 134,64 114,132 46,132 26,64" /> },
  hexagon: { color: '#1649e8', viewBox: '0 0 160 160', element: <polygon points="50,32 110,32 142,80 110,128 50,128 18,80" /> },
  octagon: { color: '#f20c1a', viewBox: '0 0 160 160', element: <polygon points="56,26 104,26 134,56 134,104 104,134 56,134 26,104 26,56" /> },
  'parallelogram wide': { color: '#f4c217', viewBox: '0 0 160 160', element: <polygon points="44,48 138,48 116,112 22,112" /> },
  'parallelogram steep': { color: '#ff8a1c', viewBox: '0 0 160 160', element: <polygon points="70,30 130,30 90,130 30,130" /> },
  'parallelogram thin': { color: '#19a8ff', viewBox: '0 0 160 160', element: <polygon points="28,64 132,64 118,98 14,98" /> },
  'rhombus diamond': { color: '#d623df', viewBox: '0 0 160 160', element: <polygon points="80,20 126,80 80,140 34,80" /> },
  'rhombus flat': { color: '#8847ff', viewBox: '0 0 160 160', element: <polygon points="80,44 142,80 80,116 18,80" /> },
  'rhombus tall': { color: '#18b566', viewBox: '0 0 160 160', element: <polygon points="80,14 112,80 80,146 48,80" /> },
  'kite classic': { color: '#138f34', viewBox: '0 0 160 160', element: <polygon points="80,18 124,72 80,142 36,72" /> },
  'kite narrow': { color: '#ec1aa5', viewBox: '0 0 160 160', element: <polygon points="80,18 110,62 80,144 50,62" /> },
  trapezium: { color: '#0f9b40', viewBox: '0 0 160 160', element: <polygon points="50,52 116,52 136,112 26,112" /> },
  ellipse: { color: '#b62fec', viewBox: '0 0 160 160', element: <ellipse cx="80" cy="80" rx="62" ry="38" /> },
  'equilateral triangle': { color: '#0d9944', viewBox: '0 0 160 160', element: <polygon points="80,24 136,128 24,128" /> },
  'right triangle': { color: '#e315c8', viewBox: '0 0 160 160', element: <polygon points="36,32 36,128 132,128" /> },
  'obtuse triangle': { color: '#f4c217', viewBox: '0 0 160 160', element: <polygon points="34,116 126,116 62,44" /> },
  'irregular pentagon': { color: '#ea1ad9', viewBox: '0 0 160 160', element: <polygon points="70,20 136,60 112,132 48,120 22,58" /> },
  'irregular hexagon': { color: '#1649e8', viewBox: '0 0 160 160', element: <polygon points="42,36 108,24 140,72 124,126 58,136 20,82" /> },
}

const shapeTitle = (shape) => shape.replace(/\b\w/g, (letter) => letter.toUpperCase())

function pickNextShape(shapes, previous) {
  if (shapes.length === 1) return shapes[0]
  let candidate = shapes[Math.floor(Math.random() * shapes.length)]
  while (candidate === previous) candidate = shapes[Math.floor(Math.random() * shapes.length)]
  return candidate
}

function ShapeSvg({ shape, className = '' }) {
  const details = SHAPE_DETAILS[shape]

  return (
    <svg className={`shape-svg ${className}`} viewBox={details.viewBox} role="img" aria-label={shapeTitle(shape)}>
      <g fill={details.color} stroke="#ffffff" strokeWidth="7" strokeLinejoin="round">
        {details.element}
      </g>
    </svg>
  )
}

function ModeCard({ mode, onSelect }) {
  return (
    <button className="mode-card" type="button" onClick={() => onSelect(mode.id)}>
      <div className="shape-sampler" aria-hidden="true">
        {mode.shapes.slice(0, 6).map((shape) => (
          <ShapeSvg key={shape} shape={shape} />
        ))}
      </div>
      <strong>{mode.label}</strong>
      <span>{mode.title}</span>
    </button>
  )
}

function App() {
  const [selectedMode, setSelectedMode] = useState(null)
  const [currentShape, setCurrentShape] = useState('circle')
  const [reveal, setReveal] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const mode = useMemo(() => MODES.find((item) => item.id === selectedMode), [selectedMode])

  useEffect(() => {
    if (!mode || !isRunning || showAnswer) return undefined

    const timer = window.setInterval(() => {
      setReveal((value) => {
        if (value >= 100) {
          setIsRunning(false)
          return 100
        }
        return Math.min(value + 1.2, 100)
      })
    }, 110)

    return () => window.clearInterval(timer)
  }, [isRunning, mode, showAnswer])

  function startMode(modeId) {
    const nextMode = MODES.find((item) => item.id === modeId)
    setSelectedMode(modeId)
    setCurrentShape(pickNextShape(nextMode.shapes))
    setReveal(0)
    setIsRunning(true)
    setShowAnswer(false)
  }

  function nextShape() {
    const next = pickNextShape(mode.shapes, currentShape)
    setCurrentShape(next)
    setReveal(0)
    setIsRunning(true)
    setShowAnswer(false)
  }

  function resetShape() {
    setReveal(0)
    setShowAnswer(false)
    setIsRunning(true)
  }

  const answerVisible = showAnswer || reveal >= 100
  const visibleReveal = answerVisible ? 100 : reveal

  if (!mode) {
    return (
      <main className="app-shell menu-screen">
        <section className="game-board menu-board">
          <header className="game-title">
            <h1>2D Shape Reveal</h1>
            <p>Names and properties of 2D shapes</p>
          </header>

          <div className="mode-grid" aria-label="Choose a level">
            {MODES.map((item) => (
              <ModeCard key={item.id} mode={item} onSelect={startMode} />
            ))}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="game-board play-board">
        <header className="top-bar">
          <button className="icon-button" type="button" onClick={() => setSelectedMode(null)} aria-label="Choose another level">
            <span aria-hidden="true">×</span>
          </button>
          <div className="game-title">
            <h1>2D Shape Reveal</h1>
            <p>{mode.title}</p>
          </div>
        </header>

        <div className="reveal-stage" aria-live="polite">
          <div className="answer-badge">{answerVisible ? shapeTitle(currentShape) : 'Can you name the shape?'}</div>
          <div className="shape-window">
            <ShapeSvg shape={currentShape} className="target-shape" />
            <div className="cover-grid" style={{ '--reveal': `${visibleReveal}%` }} aria-hidden="true">
              {Array.from({ length: 36 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className="progress-track" aria-label={`Shape is ${Math.round(visibleReveal)} percent revealed`}>
          <span style={{ width: `${visibleReveal}%` }} />
        </div>

        <div className="controls">
          <button type="button" onClick={() => setIsRunning((value) => !value)} disabled={reveal >= 100 || showAnswer}>
            {isRunning ? 'Pause' : 'Reveal'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAnswer(true)
              setIsRunning(false)
            }}
          >
            Show Answer
          </button>
          <button type="button" onClick={resetShape}>
            Reset
          </button>
          <button type="button" onClick={nextShape}>
            Next Shape
          </button>
        </div>
      </section>
    </main>
  )
}

export default App
