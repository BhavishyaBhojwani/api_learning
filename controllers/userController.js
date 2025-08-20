import User from "../models/userModel.js";
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "Users fetched successfully", users: users })
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            res.status(500).json({ error: "Name and email is required" });
        }
        const user = new User({ name, email });
        await user.save();
        res.status(201).json({ message: "User created successfully", user: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {

    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

//GET /api/users?page=1&limit=5

// GET users with pagination + search
exports.getUsersPagination = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "" } = req.query; 
        page = parseInt(page);
        limit = parseInt(limit);

        // Search filter (case-insensitive for name or email)
        const query = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };

        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);

        res.json({
            page,
            limit,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
