import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, EyeOff, Play, Settings2, SkipForward } from 'lucide-react';
import { MOCK_WORDS } from './data/mockDatabase';

type GameState = 'SETUP' | 'PASS_PHONE' | 'GAMEPLAY' | 'VOTING';

interface Player {
  id: number;
  name: string;
  role: 'CITIZEN' | 'IMPOSTER';
  word?: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [playerCount, setPlayerCount] = useState(4);
  const [imposterCount, setImposterCount] = useState(1);

  // Setup Screen
  const startGame = () => {
    // Select random word
    const randomWord = MOCK_WORDS[Math.floor(Math.random() * MOCK_WORDS.length)];
    
    // Assign roles
    const newPlayers: Player[] = Array.from({ length: playerCount }).map((_, i) => ({
      id: i,
      name: `Player ${i + 1}`,
      role: 'CITIZEN',
      word: randomWord.word,
    }));

    // Assign imposters randomly
    let impostersAssigned = 0;
    while (impostersAssigned < imposterCount) {
      const randIdx = Math.floor(Math.random() * playerCount);
      if (newPlayers[randIdx].role === 'CITIZEN') {
        newPlayers[randIdx].role = 'IMPOSTER';
        newPlayers[randIdx].word = 'YOU ARE THE IMPOSTER!'; // No word for imposter
        impostersAssigned++;
      }
    }

    setPlayers(newPlayers);
    setGameState('PASS_PHONE');
    setCurrentPlayerIndex(0);
    setIsCardFlipped(false);
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
      setIsCardFlipped(false);
    } else {
      setGameState('GAMEPLAY');
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white overflow-hidden p-6 relative flex flex-col items-center justify-center font-sans">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-keralaRed opacity-20 blur-[100px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-keralaGold opacity-20 blur-[100px] rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          
          {/* SETUP SCREEN */}
          {gameState === 'SETUP' && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-3xl p-8 flex flex-col items-center"
            >
              <h1 className="text-4xl font-bold font-malayalam text-keralaGold mb-2 text-center">
                മലയാളം ഇമ്പോസ്റ്റർ
              </h1>
              <p className="text-sm text-gray-300 mb-8 tracking-widest uppercase">Malayalam Imposter</p>

              <div className="w-full space-y-6">
                <div>
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span className="flex items-center gap-2"><Users size={16}/> Players</span>
                    <span className="text-keralaGold font-bold">{playerCount}</span>
                  </label>
                  <input 
                    type="range" min="3" max="15" 
                    value={playerCount}
                    onChange={(e) => setPlayerCount(Number(e.target.value))}
                    className="w-full accent-keralaRed"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span className="flex items-center gap-2"><Settings2 size={16}/> Imposters</span>
                    <span className="text-keralaRed font-bold">{imposterCount}</span>
                  </label>
                  <input 
                    type="range" min="1" max={Math.floor(playerCount / 2) || 1} 
                    value={imposterCount}
                    onChange={(e) => setImposterCount(Number(e.target.value))}
                    className="w-full accent-keralaRed"
                  />
                </div>

                <button 
                  onClick={startGame}
                  className="w-full py-4 mt-8 bg-gradient-to-r from-keralaRed to-orange-500 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/50 transition-all flex justify-center items-center gap-2"
                >
                  <Play size={20} /> START GAME
                </button>
              </div>
            </motion.div>
          )}

          {/* PASS PHONE SCREEN */}
          {gameState === 'PASS_PHONE' && (
            <motion.div 
              key="pass_phone"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center w-full"
            >
              <h2 className="text-2xl font-bold mb-8">
                Pass phone to <span className="text-keralaGold">{players[currentPlayerIndex].name}</span>
              </h2>

              {/* FLIP CARD */}
              <div 
                className="w-full aspect-[3/4] perspective-1000"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d cursor-pointer"
                  animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden glass rounded-3xl flex flex-col items-center justify-center p-8 border-2 border-keralaGold/30">
                    <Eye size={48} className="text-keralaGold mb-4 opacity-50" />
                    <p className="text-xl font-medium text-center">Tap to view your secret role</p>
                    <p className="text-sm text-gray-400 mt-4">(Make sure no one else is looking)</p>
                  </div>

                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden glass rounded-3xl flex flex-col items-center justify-center p-8 border-2 border-keralaRed/30" style={{ transform: 'rotateY(180deg)' }}>
                    {players[currentPlayerIndex].role === 'IMPOSTER' ? (
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-keralaRed mb-4 uppercase tracking-widest">You are the Imposter</h3>
                        <p className="text-xl opacity-80">Try to blend in!</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h3 className="text-xl font-medium text-gray-300 mb-2">The Secret Word is:</h3>
                        <p className="text-4xl font-bold font-malayalam text-keralaGold my-6">{players[currentPlayerIndex].word}</p>
                        <p className="text-sm opacity-80">Category: Slang</p>
                      </div>
                    )}
                    
                    <button 
                      className="mt-12 px-6 py-3 bg-white/10 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCardFlipped(false);
                      }}
                    >
                      <EyeOff size={18} /> Hide
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="mt-8 flex justify-between w-full items-center">
                <span className="text-sm text-gray-400">Player {currentPlayerIndex + 1} of {players.length}</span>
                <button 
                  onClick={nextPlayer}
                  disabled={!isCardFlipped && currentPlayerIndex === 0} // just a quick hack to force them to look
                  className="px-6 py-3 bg-keralaGold text-black font-bold rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                >
                  Next <SkipForward size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* GAMEPLAY SCREEN */}
          {gameState === 'GAMEPLAY' && (
            <motion.div 
              key="gameplay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 flex flex-col items-center text-center"
            >
              <h2 className="text-3xl font-bold text-keralaGold mb-4">Time to Discuss!</h2>
              <p className="text-lg text-gray-300 mb-8">Take turns saying one word related to the secret word.</p>
              
              <div className="w-48 h-48 rounded-full border-4 border-keralaRed flex items-center justify-center mb-8">
                <span className="text-5xl font-bold">5:00</span>
              </div>

              <button 
                onClick={() => setGameState('VOTING')}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/50 transition-all"
              >
                VOTE NOW
              </button>
            </motion.div>
          )}

          {/* VOTING SCREEN */}
          {gameState === 'VOTING' && (
            <motion.div 
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 flex flex-col items-center w-full"
            >
              <h2 className="text-2xl font-bold mb-6">Who is the Imposter?</h2>
              
              <div className="w-full space-y-3 mb-8">
                {players.map((p, i) => (
                  <button key={i} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 transition-colors flex justify-between items-center">
                    <span>{p.name}</span>
                    {p.role === 'IMPOSTER' && <span className="text-xs text-keralaRed opacity-0 hover:opacity-100">(Spoilers: Imposter)</span>}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setGameState('SETUP')}
                className="w-full py-4 bg-keralaGold text-black rounded-xl font-bold text-lg"
              >
                PLAY AGAIN
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
