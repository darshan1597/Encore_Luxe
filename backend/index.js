import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userAuthRouter from "./routes/user/auth.routes.js"
import adminAuthRouter from "./routes/admin/auth.routes.js"
import {adminRouter, categoryRouter, designerRouter, guestOrderRouter, productRouter, userOrderRouter} from "./routes/admin/admin.routes.js"
import userRouter from "./routes/user/user.routes.js"
import sellerRouter from "./routes/seller/seller.routes.js"
import getCategoryRouter from "./routes/category.routes.js"
import getProductRouter from "./routes/product.routes.js"
import guestRouter from "./routes/guestOrder.routes.js"
import cartRouter from "./routes/user/cart.routes.js"
import orderRouter from "./routes/user/order.routes.js"
import wishlistRoutes from "./routes/user/wishlish.routes.js"
import approveSellerProcutrouter from "./routes/admin/approveSeller.routes.js"
import getDesignerRouter from "./routes/designer.routes.js"
import { startRefundRetryJob } from "./jobs/retryRefunds.js"
import agreementRouter from "./routes/agreement.routes.js"
import discountRouter from "./routes/admin/discount.routes.js"
import applyDiscountRouter from "./routes/applyDiscount.routes.js"
import trackOrderRouter from "./routes/trackOrder.routes.js"

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// user
app.use("/api/auth", userAuthRouter)
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)
app.use("/api/wishlist", wishlistRoutes);

// admin
app.use("/api/auth/admin", adminAuthRouter)
app.use("/api/admin", adminRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/designers", designerRouter)
app.use("/api/products", productRouter)
app.use("/api/guest-order", guestOrderRouter)
app.use("/api/user-order", userOrderRouter)
app.use("/api/admin", approveSellerProcutrouter)
app.use("/api/discounts", discountRouter)

app.use("/sellerAgreements", express.static("public/sellerAgreements"));
app.use("/api/agreements", agreementRouter);

// seller
app.use("/api/seller", sellerRouter)
app.use("/sellerProductImages", express.static("public/sellerProductImages"));

// category
app.use("/api/getCategories", getCategoryRouter)

// designer
app.use("/api/getDesigners", getDesignerRouter)

// product
app.use("/api/getProducts", getProductRouter)
app.use("/productImages", express.static("public/productImages"));

// guest orders
app.use("/api/guest-orders", guestRouter);

// discount
app.use("/api/applyDiscount", applyDiscountRouter)

// track
app.use("/api/track", trackOrderRouter)

startRefundRetryJob();

app.listen(port, ()=>{
    connectDb()
    console.log(`Server started at ${port}`)
})