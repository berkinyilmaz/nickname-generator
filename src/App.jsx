import { useState, useEffect, useCallback, useMemo } from 'react'
import './styles.css'

const THEMES = [
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    icon: '◆',
    words: [
      'neon', 'void', 'glitch', 'cipher', 'neural', 'pulse', 'shadow', 'vector',
      'ghost', 'static', 'circuit', 'binary', 'cobalt', 'echo', 'helix', 'krypto',
      'matrix', 'nexus', 'omega', 'photon', 'quantum', 'radius', 'specter', 'titan',
      'vortex', 'wraith', 'zero', 'nova', 'pyre', 'flux',
    ],
  },
  {
    id: 'mythic',
    label: 'Mythic',
    icon: '✦',
    words: [
      'odin', 'thor', 'loki', 'freya', 'hera', 'ares', 'apollo', 'atlas',
      'phoenix', 'griffin', 'orion', 'titan', 'sage', 'oracle', 'rune', 'fable',
      'mythos', 'valor', 'kairos', 'aether', 'helios', 'selene', 'eos', 'nyx',
      'morrigan', 'cernos', 'kelpie', 'sphinx', 'kraken', 'draco',
    ],
  },
  {
    id: 'cosmic',
    label: 'Cosmic',
    icon: '✷',
    words: [
      'nebula', 'comet', 'polaris', 'andromeda', 'lyra', 'cassio', 'vega', 'orbit',
      'solstice', 'eclipse', 'zenith', 'aurora', 'helio', 'lunar', 'astral', 'celest',
      'stellar', 'cosmos', 'galaxy', 'meteor', 'pulsar', 'quasar', 'rigel', 'sirius',
      'titan', 'umbra', 'venus', 'altair', 'apex', 'horizon',
    ],
  },
  {
    id: 'nature',
    label: 'Nature',
    icon: '❋',
    words: [
      'forest', 'river', 'ember', 'moss', 'sage', 'pine', 'oak', 'dawn',
      'dusk', 'aspen', 'birch', 'cedar', 'fern', 'glade', 'haven', 'ivy',
      'juniper', 'kelp', 'lake', 'meadow', 'north', 'orchid', 'petal', 'quill',
      'reed', 'stone', 'thorn', 'vale', 'willow', 'yarrow',
    ],
  },
  {
    id: 'vintage',
    label: 'Vintage',
    icon: '✺',
    words: [
      'oscar', 'edith', 'frank', 'lillian', 'arthur', 'mabel', 'walter', 'pearl',
      'henry', 'ruth', 'george', 'agnes', 'james', 'rose', 'eugene', 'beatrice',
      'leonard', 'iris', 'felix', 'hazel', 'milo', 'opal', 'rupert', 'sylvia',
      'theo', 'vera', 'wendell', 'cora', 'ezra', 'june',
    ],
  },
  {
    id: 'gamer',
    label: 'Gamer',
    icon: '◉',
    words: [
      'ace', 'apex', 'blitz', 'clutch', 'duel', 'edge', 'frost', 'gambit',
      'havoc', 'ion', 'jolt', 'krono', 'lance', 'mirage', 'nitro', 'onyx',
      'prism', 'quasar', 'rebel', 'storm', 'turbo', 'ultra', 'vex', 'warp',
      'xeno', 'yield', 'zen', 'flare', 'spike', 'rogue',
    ],
  },
  {
    id: 'aesthetic',
    label: 'Aesthetic',
    icon: '✿',
    words: [
      'cloud', 'lumen', 'soft', 'midnight', 'velvet', 'silk', 'mauve', 'cream',
      'honey', 'lush', 'mist', 'dune', 'haze', 'glow', 'pastel', 'linen',
      'satin', 'cocoa', 'pebble', 'rouge', 'sienna', 'taupe', 'umber', 'wisp',
      'amber', 'blush', 'coral', 'dove', 'ember', 'frost',
    ],
  },
  {
    id: 'minimal',
    label: 'Minimal',
    icon: '○',
    words: [
      'orb', 'kai', 'iko', 'nim', 'lux', 'rai', 'vee', 'zee',
      'mio', 'odo', 'pax', 'qin', 'ren', 'sai', 'tio', 'uno',
      'vio', 'wyn', 'xen', 'yui', 'zoa', 'arc', 'bel', 'cee',
      'dox', 'elo', 'fix', 'gem', 'hex', 'ino',
    ],
  },
]

const LENGTHS = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
]

const CASES = [
  { id: 'lower', label: 'lower' },
  { id: 'capitalize', label: 'Aa' },
  { id: 'pascal', label: 'PascalCase' },
  { id: 'snake', label: 'snake_case' },
]

const COUNT = 8
const STORAGE_KEY = 'nickname-generator-favs-v1'

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function applyCase(parts, mode) {
  switch (mode) {
    case 'lower':
      return parts.join('')
    case 'capitalize': {
      const joined = parts.join('')
      return joined.charAt(0).toUpperCase() + joined.slice(1)
    }
    case 'pascal':
      return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
    case 'snake':
      return parts.join('_')
    default:
      return parts.join('')
  }
}

function generateOne(words, length, caseMode, withNumbers) {
  let parts
  if (length === 'short') {
    parts = [pick(words)]
  } else if (length === 'medium') {
    let a = pick(words)
    let b = pick(words)
    let guard = 0
    while (b === a && guard++ < 6) b = pick(words)
    parts = [a, b]
  } else {
    let a = pick(words)
    let b = pick(words)
    let guard = 0
    while (b === a && guard++ < 6) b = pick(words)
    parts = [a, b]
  }
  let nick = applyCase(parts, caseMode)
  const shouldAddNumber = withNumbers || length === 'long'
  if (shouldAddNumber) {
    const n = Math.floor(Math.random() * 99) + 1
    nick = caseMode === 'snake' ? `${nick}_${n}` : `${nick}${n}`
  }
  return nick
}

function generateBatch(words, length, caseMode, withNumbers) {
  const out = new Set()
  let guard = 0
  while (out.size < COUNT && guard++ < 80) {
    out.add(generateOne(words, length, caseMode, withNumbers))
  }
  return Array.from(out)
}

export default function App() {
  const [themeId, setThemeId] = useState('cyberpunk')
  const [length, setLength] = useState('medium')
  const [caseMode, setCaseMode] = useState('capitalize')
  const [withNumbers, setWithNumbers] = useState(false)
  const [nicknames, setNicknames] = useState([])
  const [favorites, setFavorites] = useState([])
  const [copiedKey, setCopiedKey] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)

  const theme = useMemo(() => THEMES.find(t => t.id === themeId), [themeId])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setFavorites(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const generate = useCallback(() => {
    setNicknames(generateBatch(theme.words, length, caseMode, withNumbers))
  }, [theme, length, caseMode, withNumbers])

  useEffect(() => {
    generate()
  }, [generate])

  const copyValue = useCallback((key, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1400)
    })
  }, [])

  const toggleFavorite = useCallback((nick) => {
    setFavorites(prev =>
      prev.includes(nick) ? prev.filter(n => n !== nick) : [nick, ...prev]
    )
  }, [])

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  const favSet = useMemo(() => new Set(favorites), [favorites])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <div>
              <h1 className="header-title">Nickname Generator</h1>
              <p className="header-sub">Pick a theme. Get clean, usable nicknames.</p>
            </div>
          </div>
          <div className="header-right">
            <button
              className={`btn-ghost${showFavorites ? ' active' : ''}`}
              onClick={() => setShowFavorites(s => !s)}
              aria-label="Toggle favorites panel"
            >
              <IconHeart filled={favorites.length > 0} />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="count-pill">{favorites.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">

        {/* Themes */}
        <section className="control-block">
          <div className="section-label">
            <span>Theme</span>
          </div>
          <div className="theme-grid">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`theme-chip${themeId === t.id ? ' active' : ''}`}
                onClick={() => setThemeId(t.id)}
                aria-pressed={themeId === t.id}
                aria-label={`Select ${t.label} theme`}
              >
                <span className="theme-icon">{t.icon}</span>
                <span className="theme-label">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Options */}
        <section className="control-block">
          <div className="options-row">
            <div className="option-group">
              <span className="option-label">Length</span>
              <div className="segmented">
                {LENGTHS.map(l => (
                  <button
                    key={l.id}
                    className={`seg${length === l.id ? ' active' : ''}`}
                    onClick={() => setLength(l.id)}
                    aria-pressed={length === l.id}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <span className="option-label">Case</span>
              <div className="segmented">
                {CASES.map(c => (
                  <button
                    key={c.id}
                    className={`seg${caseMode === c.id ? ' active' : ''}`}
                    onClick={() => setCaseMode(c.id)}
                    aria-pressed={caseMode === c.id}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <span className="option-label">Numbers</span>
              <button
                className={`toggle${withNumbers ? ' on' : ''}`}
                onClick={() => setWithNumbers(v => !v)}
                role="switch"
                aria-checked={withNumbers}
                aria-label="Append numbers to nicknames"
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>
        </section>

        {/* Generate */}
        <div className="generate-row">
          <button
            className="btn-primary"
            onClick={generate}
            aria-label="Generate new nicknames"
          >
            <IconRefresh />
            <span>Generate</span>
          </button>
          <span className="hint">{COUNT} nicknames · {theme.label}</span>
        </div>

        {/* Results */}
        <div className="nick-grid">
          {nicknames.map((nick, i) => {
            const key = `nick-${i}-${nick}`
            const isCopied = copiedKey === key
            const isFav = favSet.has(nick)
            return (
              <div key={key} className={`nick-card${isFav ? ' favorited' : ''}`}>
                <span className="nick-value">{nick}</span>
                <div className="nick-actions">
                  <button
                    className={`icon-btn${isFav ? ' active' : ''}`}
                    onClick={() => toggleFavorite(nick)}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <IconHeart filled={isFav} />
                  </button>
                  <button
                    className={`icon-btn${isCopied ? ' copied' : ''}`}
                    onClick={() => copyValue(key, nick)}
                    aria-label={`Copy ${nick}`}
                    title="Copy"
                  >
                    {isCopied ? <IconCheck /> : <IconCopy />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Favorites */}
        {showFavorites && (
          <section className="favorites-panel">
            <div className="favorites-head">
              <div className="section-label" style={{ margin: 0 }}>
                <span>Saved favorites</span>
              </div>
              {favorites.length > 0 && (
                <button
                  className="btn-link"
                  onClick={clearFavorites}
                  aria-label="Clear all favorites"
                >
                  Clear all
                </button>
              )}
            </div>
            {favorites.length === 0 ? (
              <p className="empty">
                Tap the heart on any nickname to save it here.
              </p>
            ) : (
              <div className="fav-grid">
                {favorites.map((nick, i) => {
                  const key = `fav-${i}-${nick}`
                  const isCopied = copiedKey === key
                  return (
                    <div key={key} className="nick-card favorited">
                      <span className="nick-value">{nick}</span>
                      <div className="nick-actions">
                        <button
                          className="icon-btn active"
                          onClick={() => toggleFavorite(nick)}
                          aria-label="Remove from favorites"
                          title="Remove from favorites"
                        >
                          <IconHeart filled />
                        </button>
                        <button
                          className={`icon-btn${isCopied ? ' copied' : ''}`}
                          onClick={() => copyValue(key, nick)}
                          aria-label={`Copy ${nick}`}
                          title="Copy"
                        >
                          {isCopied ? <IconCheck /> : <IconCopy />}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="credit">
        Coded by{' '}
        <a href="https://instagram.com/berkindev" target="_blank" rel="noopener noreferrer" className="credit-link">
          berkindev
        </a>
      </footer>
    </div>
  )
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9" />
      <path d="M13.5 2.5V5h-2.5" />
    </svg>
  )
}

function IconHeart({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13.5s-5-3.2-5-7a3 3 0 0 1 5-2.3A3 3 0 0 1 13 6.5c0 3.8-5 7-5 7z" />
    </svg>
  )
}

function IconCopy() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="4" y="4" width="8" height="8" rx="1.5" />
      <path d="M10 4V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l4 4 6-6" />
    </svg>
  )
}
