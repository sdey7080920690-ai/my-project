import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), '/src/database/todo.json');

// Helper to read todos
const readTodos = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch {
        return [];
    }
};

// Helper to write todos
const writeTodos = async (todos) => {
    await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
};

export const createTodo = async (req, res) => {
    try {
        const { title, description, userEmail } = req.body;
        if (!title || !userEmail) {
            return res.status(400).json({
                success: false,
                message: "Title and userEmail are required"
            });
        }

        const todos = await readTodos();
        const newTodo = {
            id: Date.now().toString(),
            title,
            description: description || '',
            completed: false,
            userEmail
        };
        todos.push(newTodo);
        await writeTodos(todos);

        return res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo: newTodo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: `Error in createTodo: ${error.message}`
        });
    }
};

export const getTodos = async (req, res) => {
    try {
        const { userEmail } = req.query;
        const todos = await readTodos();
        const userTodos = userEmail ? todos.filter(todo => todo.userEmail === userEmail) : todos;

        return res.status(200).json({
            success: true,
            todos: userTodos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: `Error in getTodos: ${error.message}`
        });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const todos = await readTodos();
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        if (title !== undefined) todos[todoIndex].title = title;
        if (description !== undefined) todos[todoIndex].description = description;
        if (completed !== undefined) todos[todoIndex].completed = completed;

        await writeTodos(todos);

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo: todos[todoIndex]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: `Error in updateTodo: ${error.message}`
        });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todos = await readTodos();
        const filteredTodos = todos.filter(todo => todo.id !== id);

        if (filteredTodos.length === todos.length) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        await writeTodos(filteredTodos);

        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: `Error in deleteTodo: ${error.message}`
        });
    }
};