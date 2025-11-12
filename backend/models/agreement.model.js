import mongoose from "mongoose";

const AgreementSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    sellerName: { 
        type: String, required: true 
    },
    sellerEmail: { 
        type: String, 
        required: true 
    },
    sellerNumber: { 
        type: String, 
        required: true 
    },
    agreementFiles: [
        { 
            type: String 
        }
    ],
    agreementAccepted: { 
        type: Boolean, 
        default: false 
    },
}, { timestamps: true });

const Agreement = mongoose.model("Agreement", AgreementSchema)

export default Agreement
