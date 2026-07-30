import React, { useState } from 'react';
import { KONKANI_PHRASES } from '../data/konkaniData';
import { KonkaniPhrase } from '../types';
import { Volume2, Sparkles, BookOpen, Award, CheckCircle2, HelpCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const KonkaniPhrasebook: React.FC = () => {
  const [phrases] = useState<KonkaniPhrase[]>(KONKANI_PHRASES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);
  
  // Quiz mode state
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);

  const categories = ['All', 'Greetings', 'Dining & Food', 'Bargaining & Transport', 'Emergency'];

  const filteredPhrases = phrases.filter((p) =>
    selectedCategory === 'All' ? true : p.category === selectedCategory
  );

  const playAudio = (phrase: KonkaniPhrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.audioText);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.lang = 'hi-IN'; // Uses regional accent playback

      setIsPlayingId(phrase.id);
      utterance.onend = () => setIsPlayingId(null);
      utterance.onerror = () => setIsPlayingId(null);

      window.speechSynthesis.speak(utterance);
      toast.success(`Playing audio: "${phrase.konkani}"`);
    } else {
      toast.error('Browser TTS Audio playback is not supported on this device.');
    }
  };

  // Quiz Options generator
  const currentQuizPhrase = phrases[quizIndex % phrases.length];
  const quizOptions = React.useMemo(() => {
    const wrongOptions = phrases.filter((p) => p.id !== currentQuizPhrase.id).map((p) => p.english);
    const shuffled = [currentQuizPhrase.english, wrongOptions[0], wrongOptions[1]].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [quizIndex]);

  const handleQuizAnswer = (option: string) => {
    setQuizSelectedOption(option);
    if (option === currentQuizPhrase.english) {
      setQuizScore((s) => s + 1);
      toast.success('Correct answer! Dev Boren Korum!');
    } else {
      toast.error(`Incorrect. "${currentQuizPhrase.konkani}" means "${currentQuizPhrase.english}"`);
    }

    setTimeout(() => {
      setQuizSelectedOption(null);
      setQuizIndex((i) => i + 1);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white p-8 md:p-12 mb-10 shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Local Language Guide</span>
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Konkani Audio Phrasebook 🗣️
            </h1>
            <p className="text-teal-100 text-base md:text-lg mb-6">
              Connect deeper with Goan locals! Listen to native audio pronunciations, learn key travel phrases, and test your skills with the Konkani Quiz.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsQuizMode(!isQuizMode)}
                className="flex items-center space-x-2 bg-white text-teal-900 font-bold px-6 py-3 rounded-2xl shadow-lg hover:bg-teal-50 transition"
              >
                {isQuizMode ? <BookOpen className="w-4 h-4" /> : <Award className="w-4 h-4 text-amber-500" />}
                <span>{isQuizMode ? 'Switch to Phrasebook' : 'Start Konkani Quiz 🏆'}</span>
              </button>

              {!isQuizMode && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedCategory === c ? 'bg-black/40 text-white' : 'bg-white/10 hover:bg-white/20 text-teal-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mode switcher */}
        {isQuizMode ? (
          /* Quiz View */
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-6">
              <span>Question {quizIndex + 1}</span>
              <span className="text-emerald-500 font-extrabold text-sm">Score: {quizScore}</span>
            </div>

            <span className="text-xs uppercase tracking-widest text-teal-600 font-extrabold block mb-2">What does this mean in English?</span>
            
            <div className="flex items-center justify-center space-x-3 mb-6">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                "{currentQuizPhrase.konkani}"
              </h2>
              <button
                onClick={() => playAudio(currentQuizPhrase)}
                className="p-3 bg-teal-50 dark:bg-teal-950 text-teal-600 rounded-2xl hover:scale-105 transition"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <p className="text-xs text-slate-400 italic mb-8">
              Phonetic: [{currentQuizPhrase.phonetic}]
            </p>

            <div className="space-y-3">
              {quizOptions.map((opt, i) => (
                <button
                  key={i}
                  disabled={quizSelectedOption !== null}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm text-left transition border ${
                    quizSelectedOption === opt
                      ? opt === currentQuizPhrase.english
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-750'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Phrasebook Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhrases.map((phrase) => (
              <div
                key={phrase.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-3 py-1 rounded-xl">
                      {phrase.category}
                    </span>
                    <button
                      onClick={() => playAudio(phrase)}
                      className={`p-2.5 rounded-2xl transition ${
                        isPlayingId === phrase.id
                          ? 'bg-teal-600 text-white scale-110'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-600'
                      }`}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                    {phrase.konkani}
                  </h3>

                  <p className="text-xs text-slate-400 font-mono mb-3">
                    [{phrase.phonetic}]
                  </p>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400 block font-medium">English Translation</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      "{phrase.english}"
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => playAudio(phrase)}
                  className="w-full mt-4 flex items-center justify-center space-x-2 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 hover:text-white text-teal-700 dark:text-teal-300 font-bold py-2.5 rounded-2xl transition text-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Listen Pronunciation</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default KonkaniPhrasebook;
