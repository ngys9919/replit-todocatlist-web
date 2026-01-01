import { useTodos, useToggleTodo, useDeleteTodo } from "@/hooks/use-todos";
import { Check, Trash2, Cat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export function TodoList() {
  const { data: todos, isLoading } = useTodos();
  const { mutate: toggle } = useToggleTodo();
  const { mutate: remove } = useDeleteTodo();

  const handleToggle = (id: number, currentStatus: boolean) => {
    if (!currentStatus) {
      // Trigger confetti on completion!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a78bfa', '#fb923c', '#f472b6']
      });
    }
    toggle({ id, completed: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!todos?.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-muted-foreground text-center"
      >
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Cat className="w-12 h-12 text-secondary-foreground" />
        </div>
        <p className="text-xl font-display font-medium text-foreground/80">All caught up!</p>
        <p className="text-sm mt-2">Time for a cat nap... or add a new task?</p>
      </motion.div>
    );
  }

  // Sort: pending first, then completed
  const sortedTodos = [...todos].sort((a, b) => 
    Number(a.completed) - Number(b.completed) || b.id - a.id
  );

  return (
    <div className="space-y-3 mt-8">
      <AnimatePresence mode="popLayout">
        {sortedTodos.map((todo) => (
          <motion.div
            key={todo.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`
              group flex items-center gap-3 p-4 rounded-2xl border
              transition-all duration-300
              ${todo.completed 
                ? "bg-secondary/30 border-transparent" 
                : "bg-white border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5"
              }
            `}
          >
            <button
              onClick={() => handleToggle(todo.id, todo.completed)}
              className={`
                w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300
                ${todo.completed
                  ? "bg-green-500 text-white shadow-green-200 shadow-lg scale-100"
                  : "bg-secondary hover:bg-green-100 text-transparent hover:text-green-400 scale-95 hover:scale-100"
                }
              `}
            >
              <Check className="w-5 h-5 stroke-[3]" />
            </button>

            <span 
              className={`
                flex-1 text-lg font-medium transition-all duration-300
                ${todo.completed ? "text-muted-foreground line-through decoration-2 decoration-border" : "text-foreground"}
              `}
            >
              {todo.text}
            </span>

            <button
              onClick={() => remove(todo.id)}
              className="
                p-2 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100
                hover:bg-red-50 hover:text-red-500
                transition-all duration-200
              "
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
