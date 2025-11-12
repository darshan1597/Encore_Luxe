import mongoose from "mongoose";

const orderCounterSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    value: { 
        type: Number, 
        default: 100001 

    },
});

const OrderCounter = mongoose.model("OrderCounter", orderCounterSchema)

export default OrderCounter
