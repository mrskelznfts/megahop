import { motion } from "motion/react";

export const DevilCharacter = ({ className = "", intensity = 1 }: { className?: string, intensity?: number }) => {
  return (
    <motion.div 
      className={`relative w-48 h-64 ${className}`}
      animate={{ 
        y: [0, -10 * intensity, 0],
        scaleY: [1, 0.95 * intensity, 1]
      }}
      transition={{ 
        duration: 1 / intensity, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      {/* Tail */}
      <motion.div 
        className="absolute bottom-4 left-1/2 w-16 h-16 border-r-4 border-b-4 border-white rounded-full origin-top-left -z-10"
        animate={{ rotate: [-10, 30] }}
        transition={{ duration: 1, repeat: Infinity, direction: "alternate" }}
      />

      {/* Head */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-black rounded-full border-4 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        {/* Horns */}
        <div className="absolute -top-6 -left-2 w-8 h-12 bg-black rounded-t-full -rotate-15 border-t-4 border-l-4 border-white" />
        <div className="absolute -top-6 -right-2 w-8 h-12 bg-black rounded-t-full rotate-15 border-t-4 border-r-4 border-white" />
        
        {/* Eyes */}
        <div className="absolute top-10 left-4 w-8 h-12 bg-white rounded-full overflow-hidden">
          <motion.div 
            className="w-4 h-4 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scaleX: [1, 0.1, 1], y: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 1] }}
          />
        </div>
        <div className="absolute top-10 right-4 w-8 h-12 bg-white rounded-full overflow-hidden">
          <motion.div 
            className="w-4 h-4 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ scaleX: [1, 0.1, 1], y: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.95, 1] }}
          />
        </div>

        {/* Sinister Grin with Teeth */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-20 h-10 border-b-4 border-white rounded-full overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 flex justify-around px-2">
            <div className="w-2 h-4 bg-white rounded-b-full" />
            <div className="w-2 h-4 bg-white rounded-b-full" />
            <div className="w-2 h-4 bg-white rounded-b-full" />
          </div>
        </div>
      </div>

      {/* Body - Rubber Hose Style */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-16 h-24 bg-black rounded-full border-4 border-white" />
      
      {/* Arms */}
      <motion.div 
        className="absolute top-36 left-0 w-12 h-4 bg-black rounded-full origin-right border-2 border-white"
        animate={{ rotate: [-20, 20] }}
        transition={{ duration: 0.5, repeat: Infinity, direction: "alternate" }}
      />
      <motion.div 
        className="absolute top-36 right-0 w-12 h-4 bg-black rounded-full origin-left border-2 border-white"
        animate={{ rotate: [20, -20] }}
        transition={{ duration: 0.5, repeat: Infinity, direction: "alternate" }}
      />
    </motion.div>
  );
};

export const FilmGrain = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay film-flicker" />
    <div className="absolute inset-0 bg-black/5" />
    {/* Scratches and dust simulation */}
    <motion.div 
      className="absolute top-0 left-1/4 w-px h-full bg-white/10"
      animate={{ x: [-100, 1000], opacity: [0, 0.5, 0] }}
      transition={{ duration: 0.1, repeat: Infinity, repeatType: "loop" }}
    />
    <motion.div 
      className="absolute top-0 left-2/3 w-px h-full bg-white/5"
      animate={{ x: [1000, -100], opacity: [0, 0.3, 0] }}
      transition={{ duration: 0.15, repeat: Infinity, repeatType: "loop" }}
    />
    <div className="absolute inset-0 bg-black/5" />
    <div className="absolute inset-0 border-[20px] border-black/20 blur-xl pointer-events-none" />
  </div>
);

export const SmokeBackground = () => (
  <div className="fixed inset-0 -z-10 bg-black overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-radial from-white/10 to-transparent blur-3xl smoke-drift"
        style={{
          width: `${100 + Math.random() * 100}%`,
          height: `${100 + Math.random() * 100}%`,
          top: `${Math.random() * 100 - 50}%`,
          left: `${Math.random() * 100 - 50}%`,
          animationDelay: `${i * 1.5}s`,
          animationDuration: `${15 + Math.random() * 10}s`,
        }}
      />
    ))}
    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />
  </div>
);
