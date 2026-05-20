import jwt from "jsonwebtoken"

const genToken = async (admin) => {
    try {
        const token = await jwt.sign({adminId: admin._id, role: admin.role}, process.env.JWT_SECRET, {expiresIn: "1d"})
        return token
    } catch (error) {
        console.log(error)
    }
}

export default genToken
