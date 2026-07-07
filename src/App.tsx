import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, EyeOff, Play, Settings2, SkipForward, Plus, Minus, Globe } from 'lucide-react';
import { MOCK_WORDS } from './data/mockDatabase';

type GameState = 'SETUP' | 'PASS_PHONE' | 'GAMEPLAY' | 'VOTING';
type Language = 'malayalam' | 'english';

interface Player {
  id: number;
  name: string;
  role: 'CITIZEN' | 'IMPOSTER';
  word?: string;
  hint?: string;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [playerNames, setPlayerNames] = useState<string[]>(['Alwin', 'Rahul', 'Anu', '']);
  const [imposterCount, setImposterCount] = useState(1);
  const [language, setLanguage] = useState<Language>('malayalam');
  
  // Gameplay State
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  // Setup Screen Actions
  const addPlayer = () => setPlayerNames([...playerNames, '']);
  const removePlayer = (index: number) => {
    if (playerNames.length > 3) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };
  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const startGame = () => {
    const validNames = playerNames.filter(n => n.trim() !== '');
    if (validNames.length < 3) {
      alert(language === 'english' ? 'Minimum 3 players required!' : 'കുറഞ്ഞത് 3 കളിക്കാർ വേണം!');
      return;
    }

    // Select random word
    const randomWord = MOCK_WORDS[Math.floor(Math.random() * MOCK_WORDS.length)];
    
    // Assign roles
    const newPlayers: Player[] = validNames.map((name, i) => ({
      id: i,
      name: name.trim(),
      role: 'CITIZEN',
      word: language === 'english' ? randomWord.wordEng : randomWord.wordMal,
      hint: '', // Citizens don't need a vague hint
    }));

    // Assign imposters randomly
    let impostersAssigned = 0;
    const actualImposterCount = Math.min(imposterCount, Math.floor(validNames.length / 2) || 1);
    
    while (impostersAssigned < actualImposterCount) {
      const randIdx = Math.floor(Math.random() * validNames.length);
      if (newPlayers[randIdx].role === 'CITIZEN') {
        newPlayers[randIdx].role = 'IMPOSTER';
        newPlayers[randIdx].word = language === 'english' ? 'YOU ARE THE IMPOSTER!' : 'നിങ്ങൾ ഇമ്പോസ്റ്റർ ആണ്!'; 
        newPlayers[randIdx].hint = language === 'english' ? randomWord.vagueHintEng : randomWord.vagueHintMal;
        impostersAssigned++;
      }
    }

    setPlayers(newPlayers);
    setGameState('PASS_PHONE');
    setCurrentPlayerIndex(0);
    setIsCardFlipped(false);
    setHasViewed(false);
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setIsCardFlipped(false);
      setHasViewed(false);
      // Small timeout to allow flip animation to hide before changing content
      setTimeout(() => {
        setCurrentPlayerIndex(prev => prev + 1);
      }, 300);
    } else {
      setGameState('GAMEPLAY');
    }
  };

  const handleCardFlip = () => {
    setIsCardFlipped(!isCardFlipped);
    if (!isCardFlipped) setHasViewed(true);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white overflow-hidden p-6 relative flex flex-col items-center font-sans">
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-keralaRed opacity-20 blur-[100px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-keralaGold opacity-20 blur-[100px] rounded-full z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mt-8">
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
              <h1 className="text-4xl font-bold text-keralaGold mb-2 text-center">
                മലയാളം ഇമ്പോസ്റ്റർ
              </h1>
              <p className="text-sm text-gray-300 mb-6 tracking-widest uppercase">Malayalam Imposter</p>

              {/* Language Toggle */}
              <div className="w-full flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
                <button 
                  onClick={() => setLanguage('malayalam')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${language === 'malayalam' ? 'bg-keralaGold text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  <Globe size={16}/> മലയാളം
                </button>
                <button 
                  onClick={() => setLanguage('english')}
                  className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${language === 'english' ? 'bg-keralaGold text-black' : 'text-gray-400 hover:text-white'}`}
                >
                  <Globe size={16}/> English
                </button>
              </div>

              <div className="w-full space-y-6">
                
                {/* Players List */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Users size={16}/> {language === 'english' ? 'Players' : 'കളിക്കാർ'}
                    </label>
                    <button onClick={addPlayer} className="p-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {playerNames.map((name, i) => (
                      <div key={i} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder={`${language === 'english' ? 'Player' : 'കളിക്കാരൻ'} ${i + 1}`}
                          value={name}
                          onChange={(e) => updatePlayerName(i, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-keralaGold transition-colors"
                        />
                        {playerNames.length > 3 && (
                          <button onClick={() => removePlayer(i)} className="p-2 text-keralaRed hover:bg-white/5 rounded-lg transition-colors">
                            <Minus size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Imposter Count */}
                <div>
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span className="flex items-center gap-2"><Settings2 size={16}/> {language === 'english' ? 'Imposters' : 'ഇമ്പോസ്റ്റർമാർ'}</span>
                    <span className="text-keralaRed font-bold">{imposterCount}</span>
                  </label>
                  <input 
                    type="range" min="1" max={Math.max(1, Math.floor(playerNames.filter(n => n).length / 2))} 
                    value={imposterCount}
                    onChange={(e) => setImposterCount(Number(e.target.value))}
                    className="w-full accent-keralaRed"
                  />
                </div>

                <button 
                  onClick={startGame}
                  className="w-full py-4 mt-8 bg-gradient-to-r from-keralaRed to-orange-500 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/50 transition-all flex justify-center items-center gap-2"
                >
                  <Play size={20} /> {language === 'english' ? 'START GAME' : 'തുടങ്ങുക'}
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
              className="flex flex-col items-center w-full mt-10"
            >
              <h2 className="text-2xl font-bold mb-8 text-center">
                {language === 'english' ? 'Pass phone to' : 'ഫോൺ കൈമാറുക:'} <br/>
                <span className="text-keralaGold text-4xl mt-2 block">{players[currentPlayerIndex].name}</span>
              </h2>

              {/* FLIP CARD */}
              <div 
                className="w-full aspect-[3/4] perspective-1000"
                onClick={handleCardFlip}
              >
                <motion.div
                  className="w-full h-full relative preserve-3d cursor-pointer"
                  animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden glass rounded-3xl flex flex-col items-center justify-center p-8 border-2 border-keralaGold/30 hover:border-keralaGold/60 transition-colors">
                    <Eye size={48} className="text-keralaGold mb-4 opacity-50" />
                    <p className="text-xl font-medium text-center">
                      {language === 'english' ? 'Tap to view your secret role' : 'നിങ്ങളുടെ റോൾ കാണാൻ ടാപ്പ് ചെയ്യുക'}
                    </p>
                    <p className="text-sm text-gray-400 mt-4 text-center">
                      ({language === 'english' ? 'Make sure no one else is looking' : 'മറ്റാരും കാണുന്നില്ല എന്ന് ഉറപ്പാക്കുക'})
                    </p>
                  </div>

                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden glass rounded-3xl flex flex-col items-center justify-center p-8 border-2 border-keralaRed/30" style={{ transform: 'rotateY(180deg)' }}>
                    {players[currentPlayerIndex].role === 'IMPOSTER' ? (
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-keralaRed mb-6 uppercase tracking-widest leading-relaxed">
                          {players[currentPlayerIndex].word}
                        </h3>
                        <div className="bg-black/30 p-4 rounded-xl border border-keralaRed/20">
                          <p className="text-sm text-gray-400 mb-1">{language === 'english' ? 'Vague Hint:' : 'സൂചന:'}</p>
                          <p className="text-lg font-medium text-keralaGold">{players[currentPlayerIndex].hint}</p>
                        </div>
                        <p className="text-sm opacity-80 mt-6">{language === 'english' ? 'Try to blend in!' : 'കണ്ടുപിടിക്കപ്പെടാതെ അഭിനയിക്കുക!'}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h3 className="text-xl font-medium text-gray-300 mb-2">
                          {language === 'english' ? 'The Secret Word is:' : 'രഹസ്യ വാക്ക്:'}
                        </h3>
                        <p className="text-4xl font-bold text-keralaGold my-6 leading-relaxed">
                          {players[currentPlayerIndex].word}
                        </p>
                      </div>
                    )}
                    
                    <button 
                      className="mt-12 px-6 py-3 bg-white/10 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCardFlipped(false);
                      }}
                    >
                      <EyeOff size={18} /> {language === 'english' ? 'Hide' : 'മറയ്ക്കുക'}
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* NEXT BUTTON */}
              <div className="mt-12 flex justify-between w-full items-center">
                <span className="text-sm text-gray-400 font-medium">
                  {language === 'english' ? 'Player' : 'കളിക്കാരൻ'} {currentPlayerIndex + 1} / {players.length}
                </span>
                
                <AnimatePresence>
                  {hasViewed && !isCardFlipped && (
                    <motion.button 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={nextPlayer}
                      className="px-6 py-3 bg-keralaGold text-black font-bold rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors shadow-lg shadow-keralaGold/20"
                    >
                      {language === 'english' ? 'Next' : 'അടുത്തത്'} <SkipForward size={18} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* GAMEPLAY SCREEN */}
          {gameState === 'GAMEPLAY' && (
            <motion.div 
              key="gameplay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 flex flex-col items-center text-center mt-20"
            >
              <h2 className="text-3xl font-bold text-keralaGold mb-4">
                {language === 'english' ? 'Time to Discuss!' : 'ചർച്ച ചെയ്യാം!'}
              </h2>
              <p className="text-lg text-gray-300 mb-10">
                {language === 'english' ? 'Take turns saying one word related to the secret word.' : 'രഹസ്യ വാക്കുമായി ബന്ധപ്പെട്ട ഒരു വാക്ക് ഊഴം വച്ച് പറയുക.'}
              </p>
              
              <div className="w-48 h-48 rounded-full border-4 border-keralaRed flex flex-col items-center justify-center mb-10 shadow-[0_0_30px_rgba(225,42,42,0.3)]">
                <span className="text-sm text-keralaRed font-bold mb-1 uppercase tracking-widest">Timer</span>
                <span className="text-5xl font-bold">5:00</span>
              </div>

              <button 
                onClick={() => setGameState('VOTING')}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 rounded-xl font-bold text-lg shadow-lg hover:shadow-red-500/50 transition-all tracking-widest"
              >
                {language === 'english' ? 'VOTE NOW' : 'വോട്ട് ചെയ്യുക'}
              </button>
            </motion.div>
          )}

          {/* VOTING SCREEN */}
          {gameState === 'VOTING' && (
            <motion.div 
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-8 flex flex-col items-center w-full mt-10"
            >
              <h2 className="text-2xl font-bold mb-6">
                {language === 'english' ? 'Who is the Imposter?' : 'ആരാണ് ഇമ്പോസ്റ്റർ?'}
              </h2>
              
              <div className="w-full space-y-3 mb-8">
                {players.map((p, i) => (
                  <button key={i} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 transition-colors flex justify-between items-center group">
                    <span className="font-medium text-lg">{p.name}</span>
                    {p.role === 'IMPOSTER' && <span className="text-xs text-keralaRed opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded">Spoilers: Imposter</span>}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setGameState('SETUP')}
                className="w-full py-4 bg-keralaGold text-black rounded-xl font-bold text-lg shadow-lg hover:shadow-keralaGold/50 transition-all"
              >
                {language === 'english' ? 'PLAY AGAIN' : 'വീണ്ടും കളിക്കുക'}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
