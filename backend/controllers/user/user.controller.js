import User from "../../models/user.model.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        if(!userId){
            return res.status(400).json({message: "User id not found"})
        }
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message: "User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `Error while finding current user ${error}`})
    }
}

export const saveAddress = async (req, res) => {
    const { id } = req.params;
    const { fullAddress, apt, pincode, city, state, country } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!Array.isArray(user.address)) {
            user.address = [];
        }

        const isDuplicate = user.address.some(addr =>
            addr.fullAddress?.toLowerCase().trim() === fullAddress.toLowerCase().trim() &&
            addr.pincode === pincode &&
            addr.city?.toLowerCase().trim() === city.toLowerCase().trim() &&
            addr.state?.toLowerCase().trim() === state.toLowerCase().trim()
        );

        if (isDuplicate) {
            return res.status(400).json({ success: false, message: "Address already exists" });
        }

        if (user.address.length >= 3) {
            return res.status(400).json({ success: false, message: "You can only save up to 3 addresses" });
        }
        
        user.address.push({ fullAddress, apt, pincode, city, state, country });
        await user.save();

        res.json({ success: true, message: "Address saved successfully", user });
    } catch (error) {
        return res.status(500).json({message: `Error while saving address ${error}`})
    }
};

export const getSavedAddress = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, addresses: user.address || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const fetchUser = async (req, res) => {
    try {
        const id = req.params.userId
        if(!id){
            return res.status(400).json({message: "User id not found"})
        }
        const user = await User.findById(id)
        if(!user){
            return res.status(400).json({message: "User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `Error while fetching user details ${error}`})
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const before = user.address.length;
        user.address = user.address.filter(
            (addr) => addr._id.toString() !== addressId
        );

        if (user.address.length === before) {
            // Address wasn’t found in the list
            return res.json({ success: false, message: "Address not found" });
        }

        await user.save();

        return res.json({
            success: true,
            message: "Address deleted",
            addresses: user.address,
        });
    } catch (error) {
        console.error("Delete address error:", error);
        return res.json({
            success: false, // <-- this is the missing part
            message: `Error while deleting user address: ${error.message}`,
        });
    }
};