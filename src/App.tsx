import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Twitter,
  CheckCircle2,
  AlertCircle,
  Wallet,
  ExternalLink,
  Copy,
  Trophy,
  UserPlus
} from "lucide-react";
import { DevilCharacter, FilmGrain, SmokeBackground } from "./components/VintageEffects";

type Step = "loading" | "raid";

export default function App() {
  const [step, setStep] = useState<Step>("loading");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showEnterButton, setShowEnterButton] = useState(false);

  // Form State
  const [followed, setFollowed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [quoteLink, setQuoteLink] = useState("");
  const [raidLink, setRaidLink] = useState("");
  const [wallet, setWallet] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referrer, setReferrer] = useState("");
  const [leaderboard, setLeaderboard] = useState<{ wallet: string; points: number }[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState("");

  const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzTJTWytAwPyBA6qD__No-T-xmxb8grAVdlw1-LVV_rY6EOj4hQzGwog4FU3412J3cc/exec";

  useEffect(() => {
    // Handle Referral Link
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && /^0x[a-fA-F0-9]{40}$/.test(ref)) {
      setReferrer(ref);
    }

    // Fetch Leaderboard
    fetch(GOOGLE_SHEETS_URL)
      .then(res => res.json())
      .then(data => {
        console.log("Leaderboard data received:", data);
        if (Array.isArray(data)) setLeaderboard(data);
      })
      .catch(err => console.error("Failed to fetch leaderboard:", err));
  }, []);

  useEffect(() => {
    if (step === "loading") {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setShowEnterButton(true), 500);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleEnterRaid = () => {
    setStep("raid");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const twitterRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/.*\/status\/\d+/;
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    const megaRegex = /^[a-zA-Z0-9-]+\.mega$/;

    if (!followed) newErrors.followed = "The devil sees missing tasks.";
    if (!liked) newErrors.liked = "The devil sees missing tasks.";
    if (!twitterHandle) newErrors.twitterHandle = "Your identity is hidden from the devil.";

    if (!quoteLink || !twitterRegex.test(quoteLink)) {
      newErrors.quoteLink = quoteLink ? "This is not a valid Quote Tweet link, Megahop." : "Don't lie to the devil.";
    }

    if (!raidLink || !twitterRegex.test(raidLink)) {
      newErrors.raidLink = raidLink ? "That link smells like fear." : "Send the real raid link.";
    }

    if (!wallet) {
      newErrors.wallet = "Invalid EVM address or .mega domain.";
    } else if (!evmRegex.test(wallet) && !megaRegex.test(wallet)) {
      newErrors.wallet = "This address looks cursed or invalid.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        let finalWallet = wallet;

        // Resolve .mega domain if detected
        if (wallet.toLowerCase().endsWith(".mega")) {
          setSubmitError("Resolving .mega domain...");
          try {
            const resolveRes = await fetch(`https://api.dotmega.domains/resolve?name=${wallet.toLowerCase()}`);
            const resolveData = await resolveRes.json();

            if (resolveData && resolveData.address && resolveData.address !== "0x0000000000000000000000000000000000000000") {
              finalWallet = resolveData.address;
              setSubmitError(null);
            } else {
              setSubmitError("Could not resolve .mega domain.");
              setIsSubmitting(false);
              return;
            }
          } catch (err) {
            console.error("Resolution error:", err);
            setSubmitError("Failed to reach .mega domains API.");
            setIsSubmitting(false);
            return;
          }
        }

        const payload = {
          followed,
          liked,
          twitterHandle,
          quoteLink,
          raidLink,
          wallet: finalWallet,
          referrer: referrer
        };

        console.log("Submitting to Google Sheets...", payload);

        // Send to Google Sheets
        const response = await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify(payload),
        });

        console.log("Request sent. (Note: no-cors prevents reading response body)");

        // With no-cors, we can't read the response body, so we assume success 
        // if the request doesn't throw an error.
        setSubmitted(true);
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitError("Connection to the underworld lost. Try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSubmitError("Fix the errors in your pact first.");
      const errorField = document.querySelector('.text-accent');
      if (errorField) {
        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white custom-cursor-pitchfork">
      <FilmGrain />
      <SmokeBackground />

      <AnimatePresence mode="wait">
        {step === "loading" ? (
          <motion.main
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <DevilCharacter className="mb-8 scale-75 md:scale-100" />

            <motion.h1
              className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 text-distressed px-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Summoning the Raid Demons...
            </motion.h1>

            <div className="w-full max-w-xs md:max-w-md bg-white/10 h-3 md:h-4 rounded-full overflow-hidden border-2 border-white mb-12">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
              />
            </div>

            <AnimatePresence>
              {showEnterButton && (
                <motion.button
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  whileHover={{ scale: 1.1, rotate: 2, boxShadow: "0 0 20px #8b0000" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleEnterRaid}
                  className="px-8 md:px-12 py-4 md:py-6 bg-white text-black font-black text-xl md:text-2xl uppercase rounded-full border-4 border-black hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 group"
                >
                  Enter the Raid
                </motion.button>
              )}
            </AnimatePresence>
          </motion.main>
        ) : (
          <motion.main
            key="raid"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto px-4 py-12 flex flex-col items-center"
          >
            <header className="text-center mb-12 px-4">
              <motion.h1
                className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-2 text-distressed"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Claim Your WL
              </motion.h1>
              <p className="text-lg md:text-xl text-white/60 italic">"Prove your loyalty, Megahop."</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLeaderboard(true)}
                className="mt-4 px-6 py-2 bg-accent/20 border-2 border-accent text-accent font-bold rounded-full hover:bg-accent hover:text-white transition-all flex items-center gap-2 mx-auto"
              >
                <Trophy size={18} />
                Leaderboard
              </motion.button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl px-2">
              {/* Left Column: Stats & Character */}
              <div className="lg:col-span-1 flex flex-col gap-6 order-2 lg:order-1">
                <div className="bg-white/5 border-2 border-white/20 p-6 md:p-8 rounded-2xl backdrop-blur-sm flex flex-col items-center text-center">
                  <DevilCharacter intensity={1.5} className="scale-50 md:scale-75 mb-4" />
                  <div className="space-y-2">
                    <p className="text-xs md:text-sm uppercase tracking-widest text-white/40">Megahop Summoned</p>
                    <p className="text-4xl md:text-5xl font-black text-accent">3,333</p>
                  </div>
                  <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10 w-full">
                    <motion.div
                      className="relative inline-block px-6 py-3 bg-accent text-white font-black uppercase tracking-tighter rounded-sm transform -rotate-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] wobble"
                      whileHover={{ scale: 1.1, rotate: 0 }}
                    >
                      <span className="text-distressed text-lg md:text-xl">Freemint Collection</span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Main Form Column */}
              <form
                onSubmit={handleSubmit}
                className="lg:col-span-2 bg-white text-black p-6 md:p-12 rounded-2xl md:rounded-3xl border-4 md:border-8 border-black shadow-[6px_6px_0px_0px_rgba(139,0,0,1)] md:shadow-[12px_12px_0px_0px_rgba(139,0,0,1)] order-1 lg:order-2"
              >
                <div className="space-y-6 md:space-y-8">
                  {/* Task 1: Follow */}
                  <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm md:text-base">1</div>
                        <h3 className="text-lg md:text-xl font-black uppercase">Follow @MegahopNFT</h3>
                      </div>
                      <a
                        href="https://x.com/intent/follow?screen_name=MegahopNFT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-accent transition-colors text-sm md:text-base"
                      >
                        <Twitter size={16} />
                        Follow
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={followed}
                        onChange={(e) => setFollowed(e.target.checked)}
                        className="w-5 h-5 md:w-6 md:h-6 border-2 md:border-4 border-black rounded-sm checked:bg-accent appearance-none transition-all cursor-pointer"
                      />
                      <span className="font-bold uppercase text-sm md:text-base group-hover:text-accent transition-colors">I have followed</span>
                    </label>
                  </section>

                  {/* Task 2: Like & Retweet */}
                  <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm md:text-base">2</div>
                        <h3 className="text-lg md:text-xl font-black uppercase">Like & Retweet</h3>
                      </div>
                      <a
                        href="https://x.com/MegahopNFT"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-accent transition-colors text-sm md:text-base"
                      >
                        <Twitter size={16} />
                        Raid Post
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={liked}
                        onChange={(e) => setLiked(e.target.checked)}
                        className="w-5 h-5 md:w-6 md:h-6 border-2 md:border-4 border-black rounded-sm checked:bg-accent appearance-none transition-all cursor-pointer"
                      />
                      <span className="font-bold uppercase text-sm md:text-base group-hover:text-accent transition-colors">I have liked & retweeted</span>
                    </label>
                  </section>

                  {/* Task 2.5: Twitter Handle */}
                  <section className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm md:text-base">@</div>
                      <h3 className="text-lg md:text-xl font-black uppercase">Your Twitter @Handle</h3>
                    </div>
                    <input
                      type="text"
                      placeholder="@username"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      className="w-full p-3 md:p-4 border-2 md:border-4 border-black rounded-xl font-bold focus:ring-4 focus:ring-accent outline-none transition-all text-sm md:text-base"
                    />
                    {errors.twitterHandle && (
                      <p className="flex items-center gap-2 text-accent font-black text-xs md:text-sm uppercase italic">
                        <AlertCircle size={14} /> {errors.twitterHandle}
                      </p>
                    )}
                  </section>

                  {/* Task 3: Quote Tweet Validation */}
                  <section className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm md:text-base">3</div>
                      <h3 className="text-lg md:text-xl font-black uppercase">Quote Tweet Link</h3>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Your Quote Tweet Link"
                      value={quoteLink}
                      onChange={(e) => setQuoteLink(e.target.value)}
                      className="w-full p-3 md:p-4 border-2 md:border-4 border-black rounded-xl font-bold focus:ring-4 focus:ring-accent outline-none transition-all text-sm md:text-base"
                    />
                    {errors.quoteLink && (
                      <p className="flex items-center gap-2 text-accent font-black text-xs md:text-sm uppercase italic">
                        <AlertCircle size={14} /> {errors.quoteLink}
                      </p>
                    )}
                    {quoteLink && !errors.quoteLink && (
                      <p className="flex items-center gap-2 text-green-700 font-black text-xs md:text-sm uppercase italic">
                        <CheckCircle2 size={14} /> Quote verified. Mischief approved.
                      </p>
                    )}
                  </section>

                  {/* Task 4: Raid Tweet Validation */}
                  <section className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm md:text-base">4</div>
                      <h3 className="text-lg md:text-xl font-black uppercase">RAID Tweet Link</h3>
                    </div>
                    <input
                      type="text"
                      placeholder="Paste Your RAID Tweet Link"
                      value={raidLink}
                      onChange={(e) => setRaidLink(e.target.value)}
                      className="w-full p-3 md:p-4 border-2 md:border-4 border-black rounded-xl font-bold focus:ring-4 focus:ring-accent outline-none transition-all text-sm md:text-base"
                    />
                    {errors.raidLink && (
                      <p className="flex items-center gap-2 text-accent font-black text-xs md:text-sm uppercase italic">
                        <AlertCircle size={14} /> {errors.raidLink}
                      </p>
                    )}
                    {raidLink && !errors.raidLink && (
                      <p className="flex items-center gap-2 text-green-700 font-black text-xs md:text-sm uppercase italic">
                        <CheckCircle2 size={14} /> Raid energy detected.
                      </p>
                    )}
                  </section>

                  {/* Task 5: Wallet Validation */}
                  <section className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-sm md:text-base">5</div>
                      <h3 className="text-lg md:text-xl font-black uppercase">EVM Wallet Address</h3>
                    </div>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 w-4 h-4 md:w-5 md:h-5" />
                      <input
                        type="text"
                        placeholder="0x..."
                        value={wallet}
                        onChange={(e) => setWallet(e.target.value)}
                        className="w-full p-3 md:p-4 pl-10 md:pl-12 border-2 md:border-4 border-black rounded-xl font-bold focus:ring-4 focus:ring-accent outline-none transition-all text-sm md:text-base"
                      />
                    </div>
                    {errors.wallet && (
                      <p className="flex items-center gap-2 text-accent font-black text-xs md:text-sm uppercase italic">
                        <AlertCircle size={14} /> {errors.wallet}
                      </p>
                    )}
                    {wallet && !errors.wallet && (
                      <p className="flex items-center gap-2 text-green-700 font-black text-xs md:text-sm uppercase italic">
                        <CheckCircle2 size={14} /> Wallet accepted. May the chain bless you.
                      </p>
                    )}
                  </section>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, rotate: 1, boxShadow: "0 0 30px #8b0000" }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 md:py-6 bg-black text-white font-black text-xl md:text-3xl uppercase rounded-xl md:rounded-2xl border-2 md:border-4 border-black hover:bg-accent transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? "Sealing the Pact..." : "Seal the Pact"}
                  </motion.button>
                  {submitError && (
                    <p className="text-center text-accent font-black uppercase text-sm mt-4 animate-pulse">
                      {submitError}
                    </p>
                  )}
                </div>
              </form>
            </div>

            <footer className="mt-16 text-center space-y-4">
              <p className="text-white/40 font-bold uppercase tracking-widest text-sm">
                Powered by HopStudios
              </p>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white text-black p-8 md:p-12 rounded-2xl md:rounded-3xl border-4 md:border-8 border-black text-center max-w-lg w-full relative overflow-y-auto max-h-[90vh]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
              <DevilCharacter intensity={2} className="mx-auto mb-6 scale-50 md:scale-75" />
              <h2 className="text-3xl md:text-5xl font-black uppercase mb-4 tracking-tighter">Welcome to the Cult.</h2>
              <p className="text-lg md:text-xl font-bold italic mb-6">"Rewards will be summoned soon."</p>

              <div className="bg-black/5 border-2 border-black/10 p-4 rounded-xl mb-8 text-left">
                <p className="text-xs uppercase font-black text-black/40 mb-2">Your Summoning Link (Referral)</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`${window.location.origin}${window.location.pathname}?ref=${wallet}`}
                    className="flex-1 bg-white border-2 border-black p-2 text-xs font-mono rounded overflow-hidden text-ellipsis"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?ref=${wallet}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-black text-white p-2 rounded hover:bg-accent transition-colors flex items-center gap-2"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="text-[10px] mt-2 font-bold text-accent uppercase animate-pulse">
                  Invite other Megahops to climb the leaderboard!
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="px-6 md:px-8 py-3 md:py-4 bg-black text-white font-black uppercase rounded-xl hover:bg-accent transition-colors text-sm md:text-base"
              >
                Mischief Managed
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white text-black p-6 md:p-10 rounded-2xl md:rounded-3xl border-4 md:border-8 border-black w-full max-w-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Trophy className="text-accent" size={32} />
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Leaderboard</h2>
                </div>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black hover:bg-accent transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => (
                    <div
                      key={item.wallet}
                      className={`flex items-center justify-between p-4 border-2 border-black rounded-xl ${index === 0 ? 'bg-accent/10 border-accent' : 'bg-black/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black ${index < 3 ? 'bg-accent text-white' : 'bg-black text-white'}`}>
                          {index + 1}
                        </span>
                        <div className="flex flex-col">
                          <span className="font-black text-sm md:text-base text-accent">@{item.twitterHandle || "Unknown"}</span>
                          <span className="font-mono text-[10px] opacity-40">
                            {item.wallet.slice(0, 6)}...{item.wallet.slice(-4)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl md:text-2xl font-black">{item.points}</span>
                        <span className="text-[10px] md:text-xs font-black uppercase text-black/40">Demons</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 opacity-40 italic">
                    <UserPlus size={48} className="mx-auto mb-4" />
                    No demons summoned yet...
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-black/10 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-black/40">
                  Invite friends to earn points and climb the ranks
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
