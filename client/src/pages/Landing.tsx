import { Link } from "wouter";
import { Cat, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-foreground/80 tracking-wide">Productivity made playful</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight text-foreground">
            Get things done, <br />
            <span className="text-primary relative inline-block">
              right meow.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
            The simplest, cutest way to manage your daily tasks. No clutter, just focus and feline vibes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/home" className="group">
              <button className="
                w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg
                bg-primary text-primary-foreground 
                shadow-xl shadow-primary/30 
                hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 hover:scale-105
                active:scale-95
                transition-all duration-300 ease-out
                flex items-center justify-center gap-3
              ">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-border/50">
            {['Free forever', 'No login needed', 'Purrfectly simple'].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm font-semibold text-foreground/70">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 bg-gradient-to-br from-white to-white/50 backdrop-blur-2xl p-8 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60">
            {/* Mock UI Card */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary rounded-2xl">
                  <Cat className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="h-2 w-24 bg-foreground/10 rounded-full mb-1" />
                  <div className="h-2 w-16 bg-foreground/5 rounded-full" />
                </div>
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-400/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
                <div className="w-3 h-3 rounded-full bg-green-400/20" />
              </div>
            </div>

            <div className="space-y-4">
              {[
                { text: "Buy cat food", done: true },
                { text: "Pet the cat", done: true },
                { text: "Take a nap", done: false },
                { text: "Chase the laser", done: false },
              ].map((item, i) => (
                <div key={i} className={`
                  flex items-center gap-4 p-4 rounded-xl border
                  ${item.done ? 'bg-secondary/30 border-transparent opacity-60' : 'bg-white border-border/40 shadow-sm'}
                `}>
                  <div className={`
                    w-6 h-6 rounded-lg flex items-center justify-center
                    ${item.done ? 'bg-green-500' : 'bg-secondary'}
                  `}>
                    {item.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`h-2.5 w-32 rounded-full ${item.done ? 'bg-foreground/10' : 'bg-foreground/80'}`} />
                </div>
              ))}
            </div>

            {/* Floating Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">All done!</p>
                <p className="text-xs text-muted-foreground">Great job</p>
              </div>
            </motion.div>
          </div>
          
          {/* Decorative Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl -z-10 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
}
