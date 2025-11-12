import mongoose from "mongoose";

const DesignerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true 
    },
});

const Designer = mongoose.model("Designer", DesignerSchema)

export default Designer
