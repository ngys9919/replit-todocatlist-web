import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.todos.list.path, async (_req, res) => {
    const todos = await storage.getTodos();
    res.json(todos);
  });

  app.post(api.todos.create.path, async (req, res) => {
    try {
      const input = api.todos.create.input.parse(req.body);
      const todo = await storage.createTodo(input);
      res.status(201).json(todo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.todos.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.todos.update.input.parse(req.body);
      const todo = await storage.updateTodo(id, input);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }
      res.json(todo);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.todos.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteTodo(id);
    res.status(204).send();
  });

  // seed
  const existingTodos = await storage.getTodos();
  if (existingTodos.length === 0) {
    await storage.createTodo({ text: "Buy milk", completed: false });
    await storage.createTodo({ text: "Feed the cat", completed: true });
    await storage.createTodo({ text: "Build a cool app", completed: false });
  }

  return httpServer;
}
