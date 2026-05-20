import bcrypt from "bcryptjs"
import Admin from "../../models/admin.model.js"
import genToken from "../../utils/admin/token.js"

export const addAdmin = async (req, res) => {
    try {
        const {fullName, email, mobile, password} = req.body
        let admin = await Admin.findOne({email})
        if(admin){
            return res.status(400).json({message: "Admin Already exist."})
        }
        if(!fullName){
            return res.status(400).json({message: "Please Enter Full Name."})
        }
        if(!email){
            return res.status(400).json({message: "Please Enter Email."})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters."})
        }
        if(mobile.length != 10){
            return res.status(400).json({message: "Enter a valid number."})
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        admin = await Admin.create({
            fullName,
            email,
            mobile,
            password: hashedPassword
        })

        return res.status(201).json({admin})
    } catch (error) {
        return res.status(500).json(`Add Admin error ${error}`)
    }
}

export const adminSignIn = async (req, res) => {
    try {
        const {email, password} = req.body
        const admin = await Admin.findOne({email})
        if(!admin){
            return res.status(400).json({message: "Admin does not exist."})
        }

        const passwordMatch = await bcrypt.compare(password, admin.password)

        if(!passwordMatch){
            return res.status(400).json({message: "Incorrect password"})
        }

        const token = await genToken(admin)
        res.cookie("token", token,{
            secure: true,
            sameSite: "lax",
            maxAge: 1*24*60*60*1000,
            httpOnly: true
        })

        return res.status(200).json(admin)
    } catch (error) {
        return res.status(500).json(`Sign In error ${error}`)
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({message: "Logged out Successfully"})
    } catch (error) {
        return res.status(500).json({message: `Sign out Error ${error}`})
    }
}
