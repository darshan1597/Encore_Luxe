import jwt from "jsonwebtoken"

const genToken = async (adminId) => {
    try {
        const token = await jwt.sign({adminId}, process.env.JWT_SECRET, {expiresIn: "7d"})
        return token
    } catch (error) {
        console.log(error)
    }
}

export default genToken
