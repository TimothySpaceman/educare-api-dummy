import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';

import { createDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = "SECRET-KEY";

const userDB = createDB("data/users.json");
const facultyDB = createDB("data/faculties.json");

app.use(express.json());

// app.use(cors({
//     origin: ['http://localhost', 'http://localhost:5173']
// }))

app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,PATCH,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
})

app.get("/", (req, res) => {
    res.json({message: "Hello from EduCare API"});
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await userDB.findOneBy({ email });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with isAdmin field
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

    res.status(200).json({ token });
});

app.post('/users', async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password,
        phone,
        faculty_id,
        role = 'ROLE_USER',
    } = req.body;

    // const { first_name, last_name, email, password, role = 'ROLE_USER' } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !phone || !faculty_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await userDB.findOneBy({ email });
    if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
    }

    // Check if faculty exists
    const faculty = await facultyDB.find(faculty_id);
    if (!faculty) {
        return res.status(409).json({ error: `Faculty with id ${faculty_id} does not exist` });
    }

    // Save the new user
    const newUser = { first_name, last_name, email, password, role, faculty_id, phone, online_status: false, last_seen: Date.now() };
    await userDB.save(newUser);

    // Return created user without password
    const { password: _, ...createdUser } = newUser;
    res.status(201).json(createdUser);
});

app.get('/users', async (req, res) => {
    res.status(201).json(userDB.findAll());
});

app.get('/test', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    // Check for token
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    // Verify token
    let decoded;
    try {
        decoded = jwt.verify(token, secretKey);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(200).json({tokenData: decoded, user: userDB.find(decoded.id)});
})

app.post('/faculties', async (req, res) => {
    const {
        title,
        code,
    } = req.body;

    // Validate required fields
    if (!title || !code) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Save the new faculty
    const newFaculty = { title, code };
    await facultyDB.save(newFaculty);

    // Return created faculty
    res.status(201).json(facultyDB.findOneBy({title, code}));
});

app.get('/faculties', async (req, res) => {
    res.status(200).json(facultyDB.findAll());
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: "Server error. Check logs for more details"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
