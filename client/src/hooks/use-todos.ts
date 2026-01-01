import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type TodoInput } from "@shared/routes";

export function useTodos() {
  return useQuery({
    queryKey: [api.todos.list.path],
    queryFn: async () => {
      const res = await fetch(api.todos.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch todos");
      return api.todos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TodoInput) => {
      const validated = api.todos.create.input.parse(data);
      const res = await fetch(api.todos.create.path, {
        method: api.todos.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.todos.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create todo");
      }
      return api.todos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.todos.list.path] }),
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const url = buildUrl(api.todos.update.path, { id });
      const res = await fetch(url, {
        method: api.todos.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update todo");
      return api.todos.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.todos.list.path] }),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.todos.delete.path, { id });
      const res = await fetch(url, { 
        method: api.todos.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete todo");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.todos.list.path] }),
  });
}
