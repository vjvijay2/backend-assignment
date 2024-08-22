// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const User = require('./models/User');

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.static('public'));


// // Connect to MongoDB using the URI from .env
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log('MongoDB connection error:', err));

// // Register user
// app.post('/api/register', async (req, res) => {
//     try {
//         const { name, email, password, phone, profession } = req.body;

//         // Validate input fields
//         if (!name || !password || !email || !phone || !profession) {
//             return res.status(400).json({ msg: 'All fields are required' });
//         }

//         // Check if user already exists
//         let user = await User.findOne({ email });
//         if (user) return res.status(400).json({ msg: 'User already exists' });

//         // Encrypt the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         user = new User({ name, password: hashedPassword, email, phone, profession });
//         await user.save();
//         res.status(201).json({ msg: 'User registered successfully' });
//     } catch (err) {
//         console.error(err); // Log error to the console
//         res.status(500).json({ msg: 'Server error' });
//     }
// });

// // Login user
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

//         res.json({ msg: 'Login successful' });
//     } catch (err) {
//         res.status(500).json({ msg: 'Server error' });
//     }
// });

// // List all users
// app.get('/api/users', async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).json({ msg: 'Server error' });
//     }
// });

// // Update user
// app.put('/api/user/:id', async (req, res) => {
//     try {
//         const { name, phone } = req.body;
//         let user = await User.findById(req.params.id);
//         if (!user) return res.status(404).json({ msg: 'User not found' });

//         user.name = name;
//         user.phone = phone;
//         await user.save();

//         res.json({ msg: 'User updated successfully' });
//     } catch (err) {
//         res.status(500).json({ msg: 'Server error' });
//     }
// });

// // Delete user
// app.delete('/api/user/:id', async (req, res) => {
//     console.log('Received DELETE request for ID:', req.params.id); // Debugging
//     try {
//         const userId = req.params.id;

//         // Validate ID format
//         if (!mongoose.Types.ObjectId.isValid(userId)) {
//             console.log('Invalid ID format:', userId); // Debugging
//             return res.status(400).json({ msg: 'Invalid user ID' });
//         }

//         // Find and delete user
//         const user = await User.findByIdAndDelete(userId);
//         if (!user) {
//             console.log('User not found for ID:', userId); // Debugging
//             return res.status(404).json({ msg: 'User not found' });
//         }

//         console.log('User deleted successfully for ID:', userId); // Debugging
//         res.json({ msg: 'User deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting user:', err); // Detailed error logging
//         res.status(500).json({ msg: 'Server error' });
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();

// CORS Configuration
app.use(cors({
    origin: 'https://hello-steel-seven.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// API Endpoints
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, phone, profession } = req.body;

        if (!name || !password || !email || !phone || !profession) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, password: hashedPassword, email, phone, profession });
        await user.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        res.json({ msg: 'Login successful' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Handle all other routes (like /login and /home) by serving the index.html file
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
