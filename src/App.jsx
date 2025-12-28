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
  "You've Witnessed Peak Coexistence Discourse!",
  "Your Neighborhood is Officially Gaslighting You!",
  "Congratulations, Your Grief Has Been Dismissed!",
  "You May Now Say 'I Told You So' at Town Hall!",
  "The Coyotes Send Their Regards!"
];

const LOCATIONS = [
  "Nextdoor Thread", "City Council Meeting", "School Bus Stop", "HOA Meeting",
  "Facebook Group", "Neighborhood Walk", "Town Hall", "PTA Meeting"
];

const COMICS = [
  { id: 'coyote-cops', path: '/comics/coyote-cops.png', name: 'Coyote Cops' },
  { id: 'binder-shuffle', path: '/comics/binder-shuffle.jpg', name: 'Binder Shuffle' },
  { id: 'land-rights', path: '/comics/land-rights.jpg', name: 'Land Rights' },
  { id: 'protect-serve', path: '/comics/protect-and-serve.jpg', name: 'Protect and Serve' },
  { id: 'trickle-down', path: '/comics/trickle-down-ecology.png', name: 'Trickle-Down Ecology' },
  { id: 'mystery', path: '/comics/mystery-comic.png', name: 'Mystery Comic' }
];

// CMYK Bingo Colors - one for each column
const COLUMN_COLORS = [
  '#00B8D4', // B - Cyan
  '#E91E63', // I - Magenta
  '#FFC107', // N - Yellow
  '#4CAF50', // G - Green
  '#FF5722', // O - Orange
];

export default function CoyoteBingo() {
  const [marked, setMarked] = useState(new Set([12]));
  const [hasBingo, setHasBingo] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [victoryMessage, setVictoryMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [copied, setCopied] = useState(false);
  const [unlockedComics, setUnlockedComics] = useState([]);
  const [currentComic, setCurrentComic] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [animatingSquare, setAnimatingSquare] = useState(null);

  // Load unlocked comics from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('coyoteBingoComics');
    if (stored) {
      setUnlockedComics(JSON.parse(stored));
    }
  }, []);

  // Save unlocked comics to localStorage
  useEffect(() => {
    if (unlockedComics.length > 0) {
      localStorage.setItem('coyoteBingoComics', JSON.stringify(unlockedComics));
    }
  }, [unlockedComics]);

  // Check for bingo
  useEffect(() => {
    for (const line of WINNING_LINES) {
      if (line.every(idx => marked.has(idx))) {
        if (!hasBingo) {
          setHasBingo(true);
          setWinningLine(new Set(line));
          setVictoryMessage(VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)]);
          
          // Select a random comic that hasn't been unlocked yet
          const lockedComics = COMICS.filter(c => !unlockedComics.includes(c.id));
          if (lockedComics.length > 0) {
            const newComic = lockedComics[Math.floor(Math.random() * lockedComics.length)];
            setCurrentComic(newComic);
            setUnlockedComics(prev => [...prev, newComic.id]);
          } else {
            // All comics unlocked, show a random one
            const randomComic = COMICS[Math.floor(Math.random() * COMICS.length)];
            setCurrentComic(randomComic);
          }
        }
        return;
      }
    }
  }, [marked, hasBingo, unlockedComics]);

  const toggleSquare = (idx) => {
    if (idx === 12) return; // Free space
    const newMarked = new Set(marked);
    if (newMarked.has(idx)) {
      newMarked.delete(idx);
    } else {
      newMarked.add(idx);
      // Trigger animation
      setAnimatingSquare(idx);
      setTimeout(() => setAnimatingSquare(null), 400);
    }
    setMarked(newMarked);
  };

  const resetGame = () => {
    setMarked(new Set([12]));
    setHasBingo(false);
    setWinningLine(null);
    setSelectedLocation('');
    setCopied(false);
    setCurrentComic(null);
  };

  const shareResult = () => {
    const comicText = currentComic ? ` and unlocked "${currentComic.name}"` : '';
    const locationText = selectedLocation ? ` at a ${selectedLocation}` : '';
    const text = `🎉 I got COYOTE APOLOGIST BINGO${comicText}${locationText}!\n\nThe gaslighting is REAL.\n\n#CoyoteBingo`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getColumnColor = (idx) => {
    const col = idx % 5;
    return COLUMN_COLORS[col];
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          
          @keyframes dauberPop {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.1); opacity: 0.9; }
            100% { transform: scale(1); opacity: 0.75; }
          }
          
          @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.6); }
            50% { box-shadow: 0 0 30px rgba(76, 175, 80, 0.9); }
          }
          
          .square-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
          }
          
          .comic-thumbnail {
            cursor: pointer;
            transition: transform 0.2s;
          }
          
          .comic-thumbnail:hover {
            transform: scale(1.05);
          }
        `}
      </style>

      <header style={styles.header}>
        <h1 style={styles.title}>Coyote Apologist Bingo</h1>
        <p style={styles.subtitle}>Tap squares as you hear them • Get 5 in a row to win</p>
        <button 
          style={styles.galleryButton}
          onClick={() => setShowGallery(true)}
        >
          🎨 View Comics ({unlockedComics.length}/{COMICS.length})
        </button>
      </header>

      <div style={styles.gridContainer}>
        <div style={styles.bingoLabels}>
          {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
            <div 
              key={letter} 
              style={{
                ...styles.bingoLetter,
                color: COLUMN_COLORS[i]
              }}
            >
              {letter}
            </div>
          ))}
        </div>
        
        <div style={styles.grid}>
          {BINGO_SQUARES.map((text, idx) => {
            const isMarked = marked.has(idx);
            const isWinning = winningLine?.has(idx);
            const isFreeSpace = idx === 12;
            const columnColor = getColumnColor(idx);
            
            return (
              <button
                key={idx}
                onClick={() => toggleSquare(idx)}
                className="square-button"
                style={{
                  ...styles.square,
                  borderColor: columnColor,
                  ...(isWinning && styles.winningSquare)
                }}
              >
                <span style={styles.squareText}>{isFreeSpace ? 'FREE SPACE' : text}</span>
                
                {isMarked && (
                  <div 
                    style={{
                      ...styles.dauber,
                      backgroundColor: columnColor,
                      animation: animatingSquare === idx ? 'dauberPop 0.4s ease-out' : 'none'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          A Public Service of the <strong>Dept. of Wildlife Gaslighting</strong>
        </p>
        <p style={styles.disclaimer}>Your grief is valid • The coyotes are real</p>
        <button style={styles.resetButton} onClick={resetGame}>
          Reset Card ({marked.size - 1}/24 marked)
        </button>
      </footer>

      {/* Bingo Victory Modal */}
      {hasBingo && (
        <div style={styles.modalOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setHasBingo(false);
            resetGame();
          }
        }}>
          <div style={styles.modal}>
            <h2 style={styles.bingoTitle}>🎉 BINGO! 🎉</h2>
            <p style={styles.victoryText}>{victoryMessage}</p>
            
            {currentComic && (
              <div style={styles.comicDisplay}>
                <h3 style={styles.comicUnlockedText}>You unlocked:</h3>
                <img 
                  src={currentComic.path} 
                  alt={currentComic.name}
                  style={styles.comicImage}
                />
                <p style={styles.comicName}>{currentComic.name}</p>
              </div>
            )}
            
            <select 
              style={styles.select}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">— Where did this happen? —</option>
              {LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            
            <button style={styles.shareButton} onClick={shareResult}>
              {copied ? '✓ Copied!' : '📢 Share Your Bingo'}
            </button>
            
            <button style={styles.playAgainButton} onClick={resetGame}>
              ↻ Play Again
            </button>
          </div>
        </div>
      )}

      {/* Comic Gallery Modal */}
      {showGallery && (
        <div style={styles.modalOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) setShowGallery(false);
        }}>
          <div style={{...styles.modal, maxWidth: '600px'}}>
            <h2 style={styles.galleryTitle}>Comic Collection</h2>
            <p style={styles.gallerySubtitle}>
              {unlockedComics.length}/{COMICS.length} Comics Unlocked
            </p>
            
            <div style={styles.comicGrid}>
              {COMICS.map(comic => {
                const isUnlocked = unlockedComics.includes(comic.id);
                return (
                  <div 
                    key={comic.id} 
                    style={styles.comicThumbnailContainer}
                    className="comic-thumbnail"
                  >
                    {isUnlocked ? (
                      <>
                        <img 
                          src={comic.path} 
                          alt={comic.name}
                          style={styles.comicThumbnail}
                        />
                        <p style={styles.comicThumbnailName}>{comic.name}</p>
                      </>
                    ) : (
                      <>
                        <div style={styles.lockedComic}>
                          <span style={styles.lockIcon}>🔒</span>
                        </div>
                        <p style={styles.comicThumbnailName}>Locked</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            
            <button 
              style={styles.closeButton} 
              onClick={() => setShowGallery(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: 'clamp(32px, 6vw, 56px)',
    fontWeight: '800',
    color: '#2c3e50',
    margin: '0 0 10px 0',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: 'clamp(14px, 2vw, 18px)',
    color: '#546e7a',
    margin: '0 0 20px 0',
    fontWeight: '500',
  },
  galleryButton: {
    padding: '10px 24px',
    fontSize: '16px',
    fontWeight: '600',
    background: '#fff',
    color: '#2c3e50',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  gridContainer: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  bingoLabels: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
    marginBottom: '8px',
  },
  bingoLetter: {
    fontSize: '32px',
    fontWeight: '800',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
  square: {
    aspectRatio: '1',
    background: '#fff',
    border: '3px solid',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  squareText: {
    fontSize: 'clamp(8px, 1.5vw, 12px)',
    lineHeight: 1.3,
    textAlign: 'center',
    color: '#2c3e50',
    fontWeight: '600',
    zIndex: 1,
    position: 'relative',
  },
  dauber: {
    position: 'absolute',
    inset: '8px',
    borderRadius: '50%',
    opacity: 0.75,
    pointerEvents: 'none',
  },
  winningSquare: {
    animation: 'pulseGlow 1s infinite',
    borderColor: '#4CAF50 !important',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    color: '#546e7a',
  },
  footerText: {
    fontSize: '14px',
    margin: '0 0 8px 0',
  },
  disclaimer: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '8px 0 20px 0',
  },
  resetButton: {
    padding: '10px 20px',
    fontSize: '14px',
    background: 'transparent',
    color: '#546e7a',
    border: '2px solid #546e7a',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  bingoTitle: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#4CAF50',
    margin: '0 0 16px 0',
    textAlign: 'center',
  },
  victoryText: {
    fontSize: '18px',
    color: '#2c3e50',
    marginBottom: '24px',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 1.5,
  },
  comicDisplay: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  comicUnlockedText: {
    fontSize: '16px',
    color: '#546e7a',
    marginBottom: '12px',
    fontWeight: '600',
  },
  comicImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '3px solid #e0e0e0',
    marginBottom: '12px',
  },
  comicName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#2c3e50',
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    marginBottom: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: 'inherit',
  },
  shareButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '700',
    background: '#00B8D4',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(0, 184, 212, 0.3)',
  },
  playAgainButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '700',
    background: '#fff',
    color: '#2c3e50',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  galleryTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#2c3e50',
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  gallerySubtitle: {
    fontSize: '16px',
    color: '#546e7a',
    marginBottom: '24px',
    textAlign: 'center',
    fontWeight: '600',
  },
  comicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  comicThumbnailContainer: {
    textAlign: 'center',
  },
  comicThumbnail: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '3px solid #e0e0e0',
    marginBottom: '8px',
  },
  lockedComic: {
    width: '100%',
    height: '150px',
    background: '#f5f5f5',
    borderRadius: '8px',
    border: '3px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
  },
  lockIcon: {
    fontSize: '48px',
    opacity: 0.3,
  },
  comicThumbnailName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },
  closeButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '700',
    background: '#2c3e50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
