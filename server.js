import express from 'express';
import connectToDatabase from './db.js';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors({ origin: "https://todo-app-frontend-hi8m.onrender.com" }));

let db;

app.listen(port, async () => {
    console.log(`my todo app is running at port ${port}`);
    db = await connectToDatabase('todo-project-db');
});

// API section
app.get('/test', (req, res) => res.send("API is UP"));

// 1.. Create Todo
app.post('/create-todo', async (req, res) => {
    try {
        await db.collection('todo').insertOne(req.body);
        res.status(201).json({ msg: "todo inserted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "internal server error" });
    }
});

// 2.. Read All Todos
app.get('/read-todos', async (req, res) => {
    try {
        const todolist = await db.collection('todo').find().toArray();
        res.status(200).json(todolist);
    } catch (error) {
        res.status(500).json({ msg: "internal server error" });
    }
});

// 3.. Read Single Todo
app.get('/read-todo', async (req, res) => {
    try {
        const todo = await db.collection('todo').findOne({ 'todoid': req.query.todoid });
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ msg: "internal server error", error: error.message });
    }
});

// 4.. Update Todo
app.patch('/update-todo', async (req, res) => {
    try {
        const result = await db.collection('todo').updateOne({ "todoId": req.query.todoId }, { $set: req.body });
        if (result.matchedCount === 0) {
            res.status(404).json({ msg: 'todo not found' });
        } else {
            res.status(201).json({ msg: 'todo updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ msg: "internal server error", error: error.message });
    }
});

// 5.. Delete Todo ✅
app.delete('/delete-todo', async (req, res) => {
    try {
        const result = await db.collection('todo').deleteOne({ 'todoId': req.query.todoId });
        if (result.deletedCount === 0) {
            res.status(404).json({ msg: 'todo not found' });
        } else {
            res.status(200).json({ msg: 'todo deleted' });
        }
    } catch (error) {
        res.status(500).json({ msg: "internal server error", error: error.message });
    }
});
