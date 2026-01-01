import { useState } from "react";
import { useCreateTodo } from "@/hooks/use-todos";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export function CreateTodo() {
  const [text, setText] = useState("");
  const { mutate, isPending } = useCreateTodo();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    mutate(
      { text, completed: false },
      {
        onSuccess: () => {
          setText("");
          toast({
            title: "Added!",
            description: "New task added to your list.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add task.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-lg transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
      
      <div className="relative flex items-center gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-white/50 transition-all focus-within:ring-4 focus-within:ring-primary/10 focus-within:shadow-xl">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done, meow?"
          className="flex-1 bg-transparent px-4 py-3 text-lg placeholder:text-muted-foreground/60 outline-none text-foreground font-medium"
          disabled={isPending}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!text.trim() || isPending}
          className="
            p-3 rounded-xl bg-primary text-primary-foreground
            shadow-lg shadow-primary/25 
            hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            transition-all duration-200
          "
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Plus className="w-6 h-6" />
          )}
        </motion.button>
      </div>
    </form>
  );
}
