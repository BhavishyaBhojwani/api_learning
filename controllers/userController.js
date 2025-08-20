import User from "../models/userModel.js";
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({message: "Users fetched successfully", users:users})
    } catch (error) {
        res.status(500).json({error:err.message});
    }
}

export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            res.status(500).json({ error: "Name and email is required" });
        }
        const user = new User({name, email});
        await user.save();
        res.status(201).json({ message: "User created successfully", user: user });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
