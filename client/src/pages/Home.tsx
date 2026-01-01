import { CreateTodo } from "@/components/CreateTodo";
import { TodoList } from "@/components/TodoList";
import { Cat, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-xl shadow-primary/10 mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
            <Cat className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-3 flex items-center justify-center gap-3">
            Task Master
            <Sparkles className="w-8 h-8 text-accent animate-pulse" />
          </h1>
          <p className="text-lg text-muted-foreground font-medium">
            Keep track of your tasks, one paw at a time.
          </p>
        </motion.header>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/40 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-primary/5 border border-white/60"
        >
          <CreateTodo />
          <TodoList />
        </motion.main>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground/60 font-medium">
          <p>© 2024 Purrfect Productivity Inc.</p>
        </footer>
      </div>
    </div>
  );
}
