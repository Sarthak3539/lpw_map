import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

app.use(express.json());

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User ', userSchema); 

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post("/adduser", async (req, res) => {
    const { email, password } = req.body;

    const user = new User({
        email: email,
        password: password
    });

    try {
        await user.save();
        res.status(201).send("User  Added");
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send("Error adding user");
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json(users); 
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Error fetching users");
    }
});

app.put("/users", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email }, 
            { password }, 
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).send("User  not found");
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
});

app.delete("/users", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).send("User  not found");
        }
        res.status(200).send("User  deleted");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});