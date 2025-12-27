import { useState, useEffect } from 'react';

const BINGO_SQUARES = [
  "THEY WERE HERE FIRST",
  "WAS IT AN OUTDOOR CAT?",
  "SOMEONE MUST BE FEEDING THEM",
  "COYOTES ARE MORE SCARED OF YOU",
  "THIS IS JUST NATURE",
  "WHAT TIME OF DAY WAS THIS?",
  "THEY'RE NATURAL; YOU'RE UNNATURAL",
  "20 YEARS HERE, NEVER HAD A PROBLEM",
  "HAVE YOU TRIED HAZING?",
  "COMPARES CAT TO INVASIVE SPECIES",
  "STATISTICALLY, ATTACKS ARE RARE",
  "DON'T LET KIDS PLAY AT DUSK",
  "FREE_SPACE",
  "YOU MOVED INTO THEIR HOME",
  "POSTS COYOTE ❤️ SAME WEEK AS ATTACK",
  "MY CAT IS FINE (HAS INDOOR CAT)",
  "THIS IS WHY I DON'T HAVE PETS",
  "THEY EAT RATS TOO, YOU KNOW",
  "HAPPENS EVERY YEAR",
  "LEARN TO COEXIST",
  "ARE YOU SURE IT WASN'T A DOG?",
  "PROJECT COYOTE SAYS CO-EXIST",
  "CALLS YOU THE REAL PREDATOR",
  "EMOTIONAL REACTIONS DON'T HELP",
  "REPORTS YOUR POST AS MISINFO"
];

const WINNING_LINES = [
  [0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14], [15,16,17,18,19], [20,21,22,23,24],
  [0,5,10,15,20], [1,6,11,16,21], [2,7,12,17,22], [3,8,13,18,23], [4,9,14,19,24],
  [0,6,12,18,24], [4,8,12,16,20]
];

const VICTORY_MESSAGES = [
  "YOU'VE WITNESSED PEAK COEXISTENCE DISCOURSE!",
  "YOUR NEIGHBORHOOD IS OFFICIALLY GASLIGHTING YOU!",
  "CONGRATULATIONS, YOUR GRIEF HAS BEEN DISMISSED!",
  "YOU MAY NOW SAY 'I TOLD YOU SO' AT TOWN HALL!",
  "THE COYOTES SEND THEIR REGARDS!"
];

const LOCATIONS = [
  "NEXTDOOR THREAD", "CITY COUNCIL MEETING", "SCHOOL BUS STOP", "HOA MEETING",
  "FACEBOOK GROUP", "NEIGHBORHOOD WALK", "TOWN HALL", "PTA MEETING"
];

// Comic color palette with Ben-Day dot combos
const COMIC_COLORS = [
  { bg: '#FFD700', dot: '#FFA500' }, // Yellow with orange dots
  { bg: '#FF3333', dot: '#CC0000' }, // Red with dark red dots
  { bg: '#00BFFF', dot: '#0080FF' }, // Cyan with blue dots
  { bg: '#FFD700', dot: '#FFA500' }, // Yellow
  { bg: '#FF3333', dot: '#CC0000' }, // Red
];

export default function CoyoteBingo() {
  const [marked, setMarked] = useState(new Set([12]));
  const [hasBingo, setHasBingo] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [victoryMessage, setVictoryMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [copied, setCopied] = useState(false);
  const [powSquare, setPowSquare] = useState(null);

  useEffect(() => {
    for (const line of WINNING_LINES) {
      if (line.every(idx => marked.has(idx))) {
        if (!hasBingo) {
          setHasBingo(true);
          setWinningLine(new Set(line));
          setVictoryMessage(VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)]);
        }
        return;
      }
    }
  }, [marked, hasBingo]);

  // Inject keyframes for POW animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes popIn {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        50% { transform: scale(1.3) rotate(10deg); opacity: 1; }
        100% { transform: scale(1) rotate(-5deg); opacity: 0; }
      }
      @keyframes blink {
        0%, 90%, 100% { opacity: 0.8; }
        95% { opacity: 0; }
      }
      [data-pos="top-left"] { top: 12%; left: 3%; }
      [data-pos="top-right"] { top: 8%; right: 12%; }
      [data-pos="bottom-left"] { bottom: 25%; left: 4%; }
      [data-pos="bottom-right"] { bottom: 15%; right: 3%; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const toggleSquare = (idx) => {
    if (idx === 12) return;
    const newMarked = new Set(marked);
    if (newMarked.has(idx)) {
      newMarked.delete(idx);
    } else {
      newMarked.add(idx);
      // Trigger POW animation
      setPowSquare(idx);
      setTimeout(() => setPowSquare(null), 400);
    }
    setMarked(newMarked);
  };

  const resetGame = () => {
    setMarked(new Set([12]));
    setHasBingo(false);
    setWinningLine(null);
    setSelectedLocation('');
    setCopied(false);
  };

  const shareResult = () => {
    const text = `💥 WHAM! I got COYOTE APOLOGIST BINGO${selectedLocation ? ` at a ${selectedLocation}` : ''}!\n\nThe gaslighting is REAL.\n\n#CoyoteBingo #Coexistence`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getBenDayPattern = (idx, isMarked, isWinning, isFreeSpace) => {
    if (isWinning) return 'repeating-radial-gradient(circle at 3px 3px, #000 0px, #000 1.5px, #00FF00 1.5px, #00FF00 6px)';
    if (isMarked) return 'repeating-radial-gradient(circle at 3px 3px, #000 0px, #000 1.5px, #FFFF00 1.5px, #FFFF00 6px)';
    if (isFreeSpace) return 'repeating-radial-gradient(circle at 3px 3px, #660000 0px, #660000 1.5px, #FF3333 1.5px, #FF3333 6px)';
    
    const patterns = [
      'repeating-radial-gradient(circle at 3px 3px, #CC9900 0px, #CC9900 1.5px, #FFD700 1.5px, #FFD700 6px)',
      'repeating-radial-gradient(circle at 3px 3px, #990000 0px, #990000 1.5px, #FF3333 1.5px, #FF3333 6px)',
      'repeating-radial-gradient(circle at 3px 3px, #006699 0px, #006699 1.5px, #00BFFF 1.5px, #00BFFF 6px)',
    ];
    return patterns[idx % patterns.length];
  };

  return (
    <div style={styles.container}>
      {/* Paper texture overlay */}
      <div style={styles.paperTexture} />
      
      {/* Coyote eyes in the darkness */}
      <div style={styles.coyoteEyes}>
        <div style={{...styles.eyePair, top: '8%', left: '3%'}}><span style={styles.eye}>👁</span><span style={styles.eye}>👁</span></div>
        <div style={{...styles.eyePair, top: '25%', right: '2%'}}><span style={styles.eye}>👁</span><span style={styles.eye}>👁</span></div>
        <div style={{...styles.eyePair, bottom: '30%', left: '1%'}}><span style={styles.eye}>👁</span><span style={styles.eye}>👁</span></div>
        <div style={{...styles.eyePair, bottom: '15%', right: '4%'}}><span style={styles.eye}>👁</span><span style={styles.eye}>👁</span></div>
        <div style={{...styles.eyePair, top: '60%', left: '2%'}}><span style={styles.eye}>👁</span><span style={styles.eye}>👁</span></div>
      </div>
      
      {/* Action lines background */}
      <div style={styles.actionLines} />

      {/* Coyote eyes watching from the darkness */}
      <div style={styles.eyePair} data-pos="top-left">
        <div style={styles.eye} /><div style={styles.eye} />
      </div>
      <div style={styles.eyePair} data-pos="top-right">
        <div style={styles.eye} /><div style={styles.eye} />
      </div>
      <div style={styles.eyePair} data-pos="bottom-left">
        <div style={styles.eye} /><div style={styles.eye} />
      </div>
      <div style={styles.eyePair} data-pos="bottom-right">
        <div style={styles.eye} /><div style={styles.eye} />
      </div>

      {/* WHAM! burst */}
      <div style={styles.whamBurst}>
        <span style={styles.whamText}>WHAM!</span>
      </div>

      <header style={styles.header}>
        {/* Speech bubble */}
        <div style={styles.speechBubble}>
          <span style={styles.speechText}>🐺 THE OFFICIAL</span>
          <div style={styles.speechTail} />
        </div>
        
        <h1 style={styles.title}>COYOTE APOLOGIST</h1>
        <h2 style={styles.subtitle}>BINGO!</h2>
        <p style={styles.tagline}>★ TAP SQUARES AS YOU HEAR THEM ★ GET 5 IN A ROW TO WIN ★</p>
      </header>

      <div style={styles.gridContainer}>
        {/* Comic panel border */}
        <div style={styles.panelBorder}>
          <div style={styles.grid}>
            {BINGO_SQUARES.map((text, idx) => {
              const isMarked = marked.has(idx);
              const isWinning = winningLine?.has(idx);
              const isFreeSpace = idx === 12;
              
              return (
                <button
                  key={idx}
                  onClick={() => toggleSquare(idx)}
                  style={{
                    ...styles.square,
                    background: getBenDayPattern(idx, isMarked, isWinning, isFreeSpace),
                    transform: isMarked 
                      ? `rotate(${idx % 2 === 0 ? -2 : 2}deg) scale(0.97)` 
                      : `rotate(${idx % 2 === 0 ? -1 : 1}deg) scale(1)`,
                    borderRadius: `${3 + (idx % 3)}px ${6 - (idx % 4)}px ${4 + (idx % 2)}px ${2 + (idx % 5)}px`,
                  }}
                >
                  {isFreeSpace ? (
                    <div style={styles.freeSquare}>
                      <div style={styles.badgeOuter}>
                        <div style={styles.badgeInner}>
                          <span style={styles.badgeFree}>FREE</span>
                          <span style={styles.badgeText}>COYOTES HAVE RIGHTS TOO</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={styles.squareInner}>
                      <span style={styles.squareText}>{text}</span>
                      {idx % 4 === 0 && (
                        <div style={{...styles.speechTail, ...styles.speechTailLeft}} />
                      )}
                      {idx % 4 === 2 && (
                        <div style={{...styles.speechTail, ...styles.speechTailRight}} />
                      )}
                    </div>
                  )}
                  
                  {isMarked && !isFreeSpace && (
                    <div style={styles.kapowContainer}>
                      <div style={styles.kapowBurst}>
                        <span style={styles.kapowX}>✗</span>
                      </div>
                    </div>
                  )}
                  
                  {powSquare === idx && (
                    <div style={styles.powAnimation}>
                      <span style={styles.powText}>POW!</span>
                    </div>
                  )}
                  
                  {/* Speech bubble tail on select squares */}
                  {[1, 4, 7, 11, 14, 18, 21, 24].includes(idx) && !isFreeSpace && (
                    <div style={{
                      position: 'absolute',
                      width: 0,
                      height: 0,
                      borderTop: '8px solid transparent',
                      borderBottom: '8px solid transparent',
                      ...(idx % 2 === 0 
                        ? { left: '-10px', borderRight: '10px solid #000' }
                        : { right: '-10px', borderLeft: '10px solid #000' }
                      ),
                      bottom: `${15 + (idx % 3) * 10}%`,
                      zIndex: 1,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {hasBingo && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Starburst behind BINGO */}
            <div style={styles.starburst}>
              <div style={styles.starburstInner}>
                <span style={styles.bingoText}>BINGO!</span>
              </div>
            </div>
            
            <p style={styles.victoryText}>{victoryMessage}</p>
            
            <select 
              style={styles.select}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">— WHERE DID THIS HAPPEN? —</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            
            <button style={styles.shareButton} onClick={shareResult}>
              {copied ? '✓ COPIED!' : '📢 SHARE YOUR BINGO!'}
            </button>
            
            <button style={styles.resetButton} onClick={resetGame}>
              ↻ PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          ★ A PUBLIC SERVICE OF THE <strong>DEPT. OF WILDLIFE GASLIGHTING</strong> ★
        </p>
        <p style={styles.disclaimer}>YOUR GRIEF IS VALID • THE COYOTES ARE REAL</p>
        <button style={styles.resetSmall} onClick={resetGame}>
          RESET CARD ({marked.size - 1}/24)
        </button>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#1a1a2e',
    padding: '16px',
    fontFamily: '"Bangers", "Impact", "Comic Sans MS", cursive',
    position: 'relative',
    overflow: 'hidden',
  },
  paperTexture: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `radial-gradient(circle, #ffffff30 1.5px, transparent 1.5px)`,
    backgroundSize: '12px 12px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  coyoteEyes: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  eyePair: {
    position: 'absolute',
    display: 'flex',
    gap: '8px',
    opacity: 0.6,
    filter: 'drop-shadow(0 0 8px #FFD700)',
  },
  eye: {
    fontSize: '16px',
    filter: 'hue-rotate(40deg) saturate(3) brightness(1.5)',
  },
  actionLines: {
    display: 'none',
  },
  eyePair: {
    position: 'fixed',
    display: 'flex',
    gap: '12px',
    zIndex: 2,
    opacity: 0.8,
    animation: 'blink 4s infinite',
  },
  eye: {
    width: '10px',
    height: '6px',
    background: '#FFD700',
    borderRadius: '50%',
    boxShadow: '0 0 10px #FFD700, 0 0 20px #FFA500',
  },
  whamBurst: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '80px',
    height: '80px',
    background: '#FF3333',
    border: '5px solid #000',
    borderRadius: '50% 20% 50% 20% / 20% 50% 20% 50%',
    transform: 'rotate(15deg)',
    boxShadow: '4px 4px 0 #000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  whamText: {
    color: '#FFD700',
    fontSize: '18px',
    fontWeight: 'bold',
    textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
    transform: 'rotate(-15deg)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '12px',
    position: 'relative',
    zIndex: 5,
  },
  speechBubble: {
    display: 'inline-block',
    background: '#FFF',
    border: '5px solid #000',
    borderRadius: '30px',
    padding: '8px 20px',
    marginBottom: '4px',
    position: 'relative',
    boxShadow: '4px 4px 0 #000',
  },
  speechTail: {
    position: 'absolute',
    bottom: '-20px',
    left: '50%',
    marginLeft: '-10px',
    width: '0',
    height: '0',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderTop: '20px solid #000',
  },
  speechText: {
    fontSize: '16px',
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: '2px',
  },
  title: {
    fontSize: 'clamp(28px, 8vw, 56px)',
    fontWeight: 'bold',
    color: '#FFD700',
    margin: '16px 0 0 0',
    letterSpacing: '3px',
    textShadow: '5px 5px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 6px 0 #CC0000',
    WebkitTextStroke: '3px #000',
  },
  subtitle: {
    fontSize: 'clamp(48px, 14vw, 96px)',
    fontWeight: 'bold',
    color: '#FF3333',
    margin: '-8px 0 0 0',
    letterSpacing: '8px',
    textShadow: '6px 6px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 0 8px 0 #990000',
    WebkitTextStroke: '4px #000',
  },
  tagline: {
    fontSize: '12px',
    color: '#FFF',
    marginTop: '8px',
    letterSpacing: '3px',
    fontWeight: 'bold',
    fontFamily: '"Arial Black", Arial, sans-serif',
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 5,
  },
  panelBorder: {
    background: '#000',
    padding: '8px',
    borderRadius: '4px',
    boxShadow: '8px 8px 0 rgba(0,0,0,0.3)',
    maxWidth: '520px',
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '6px',
  },
  square: {
    aspectRatio: '1',
    border: '4px solid #000',
    borderRadius: '3px 8px 5px 6px',
    padding: '0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'transform 0.15s ease',
    boxShadow: '5px 5px 0 #000',
  },
  squareInner: {
    position: 'absolute',
    inset: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '2px',
    border: '2px solid #000',
  },
  squareText: {
    fontSize: 'clamp(5px, 1.4vw, 8px)',
    lineHeight: 1.15,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontFamily: '"Arial Black", "Helvetica", sans-serif',
    padding: '2px',
  },
  speechTail: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  speechTailLeft: {
    bottom: '-12px',
    left: '20%',
    borderWidth: '12px 10px 0 10px',
    borderColor: '#FFD700 transparent transparent transparent',
    filter: 'drop-shadow(2px 2px 0 #000)',
  },
  speechTailRight: {
    bottom: '-12px',
    right: '20%',
    borderWidth: '12px 10px 0 10px',
    borderColor: '#00BFFF transparent transparent transparent',
    filter: 'drop-shadow(2px 2px 0 #000)',
  },
  kapowContainer: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  kapowBurst: {
    width: '85%',
    height: '85%',
    background: '#FFD700',
    border: '4px solid #000',
    borderRadius: '50% 20% 50% 20% / 20% 50% 20% 50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(-8deg)',
    boxShadow: '3px 3px 0 #000',
  },
  kapowX: {
    fontSize: 'clamp(20px, 5vw, 32px)',
    color: '#FF0000',
    fontWeight: 'bold',
    textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
    fontFamily: '"Bangers", cursive',
  },
  freeSquare: {
    position: 'absolute',
    inset: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
  },
  badgeOuter: {
    width: '90%',
    height: '90%',
    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    filter: 'drop-shadow(3px 3px 0 #000)',
  },
  badgeInner: {
    width: '55%',
    height: '55%',
    background: '#000',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  },
  badgeFree: {
    fontSize: 'clamp(10px, 2.5vw, 16px)',
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: '"Bangers", cursive',
    letterSpacing: '2px',
  },
  badgeText: {
    fontSize: 'clamp(3px, 0.8vw, 5px)',
    lineHeight: 1.1,
    textAlign: 'center',
    color: '#FFD700',
    fontWeight: 'bold',
    fontFamily: '"Arial Black", "Helvetica", sans-serif',
    marginTop: '2px',
  },
  powAnimation: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FF3333',
    border: '4px solid #000',
    borderRadius: '50% 20% 50% 20% / 20% 50% 20% 50%',
    animation: 'popIn 0.4s ease-out forwards',
    zIndex: 20,
  },
  powText: {
    fontSize: 'clamp(16px, 4vw, 28px)',
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: '"Bangers", cursive',
    textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
    letterSpacing: '2px',
  },
  speechTailSquare: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '10px solid #000',
    zIndex: 1,
  },
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'repeating-radial-gradient(circle at 4px 4px, #000 0px, #000 2px, #222 2px, #222 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '20px',
  },
  modal: {
    background: '#FFF8DC',
    borderRadius: '8px',
    padding: '28px',
    maxWidth: '380px',
    width: '100%',
    textAlign: 'center',
    border: '8px solid #000',
    boxShadow: '12px 12px 0 #000',
    position: 'relative',
  },
  starburst: {
    width: '140px',
    height: '140px',
    background: '#FF3333',
    border: '6px solid #000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '6px 6px 0 #000',
    position: 'relative',
  },
  starburstInner: {
    width: '110px',
    height: '110px',
    background: '#FFD700',
    border: '4px solid #000',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bingoText: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#FF0000',
    textShadow: '3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
  },
  victoryText: {
    fontSize: '15px',
    color: '#000',
    marginBottom: '20px',
    fontWeight: 'bold',
    fontFamily: '"Arial Black", sans-serif',
    lineHeight: 1.4,
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '12px',
    borderRadius: '0',
    border: '4px solid #000',
    marginBottom: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: '"Arial Black", sans-serif',
    background: '#FFF',
    boxShadow: '4px 4px 0 #000',
  },
  shareButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    fontWeight: 'bold',
    background: '#00BFFF',
    color: '#000',
    border: '4px solid #000',
    borderRadius: '0',
    cursor: 'pointer',
    marginBottom: '10px',
    fontFamily: '"Bangers", cursive',
    letterSpacing: '2px',
    boxShadow: '5px 5px 0 #000',
    transition: 'transform 0.1s',
  },
  resetButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    background: '#FFD700',
    color: '#000',
    border: '4px solid #000',
    borderRadius: '0',
    cursor: 'pointer',
    fontFamily: '"Bangers", cursive',
    boxShadow: '5px 5px 0 #000',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    position: 'relative',
    zIndex: 5,
  },
  footerText: {
    fontSize: '14px',
    color: '#FFF',
    margin: 0,
    letterSpacing: '1px',
    fontFamily: '"Arial Black", Arial, sans-serif',
  },
  disclaimer: {
    fontSize: '18px',
    color: '#FFD700',
    fontWeight: 'bold',
    margin: '10px 0 14px 0',
    letterSpacing: '2px',
    fontFamily: '"Arial Black", Arial, sans-serif',
  },
  resetSmall: {
    padding: '10px 20px',
    fontSize: '14px',
    background: 'transparent',
    color: '#FFF',
    border: '3px solid #FFF',
    borderRadius: '0',
    cursor: 'pointer',
    fontFamily: '"Arial Black", Arial, sans-serif',
    boxShadow: '3px 3px 0 rgba(255,255,255,0.3)',
  },
};
