import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

// __dirname ka aulternative process.cwd()
const filePath = path.join(process.cwd(), '/src/database/user.json');

export const postRegister = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: "Fill required fields"
            })
        }

        const data = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(data || '[]')

        if(users.find(user => user.email === email)) {
            return res.status(400).json({
                success: false,
                message: "User Already Exist"
            })
        }

        // Password encryption
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = {
            fullName,
            email,
            password: hashedPassword
        }

        users.push(user);

        await fs.writeFile(filePath, JSON.stringify(users, null, 2))

        return res.status(201).json({
            success: true,
            message: "Account created Successfully",
            user: users.find(user => user.email === email)
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: `Error in Register: ${error.message}`
        })
    }
}


export const postLogin = async (req,res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Fill required fields"
            })
        }

        const data = await fs.readFile(filePath, 'utf-8');
        const users = JSON.parse(data);

        const user = users.find(u => u.email === email);

        if(!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isPassMatch = await bcrypt.compare(password, user.password)

        if(!isPassMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            })
        }

        delete user.password;

        return res.status(200).json({
            success: true,
            message: "Login SuccessFully",
            user: user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: `Error in Login: ${error.message}`
        })
    }
}