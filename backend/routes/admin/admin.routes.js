import express from "express"
import isAuth from "../../middlewares/admin/isAuth.js"
import { addCategory, addDesigner, addProduct, deleteCategory, deleteDesigner, deleteImage, deleteProduct, editCategory, getCurrentAdmin, getSingleOrder, getSingleProduct, getSingleUserOrder, setPrimaryImage, updateOrderStatus, updateProduct, uploadSellerAgreementPdf } from "../../controllers/admin/admin.controller.js"
import { uploadAgreementFiles, uploadProductImages } from "../../middlewares/multer.js"

const adminRouter = express.Router()
const categoryRouter = express.Router()
const designerRouter = express.Router()
const productRouter = express.Router()
const guestOrderRouter = express.Router()
const userOrderRouter = express.Router()

adminRouter.get("/current-admin", isAuth, getCurrentAdmin)

categoryRouter.post("/add-category", addCategory)
categoryRouter.put("/edit-category/:id", editCategory)
categoryRouter.delete("/delete-category/:id", deleteCategory);

designerRouter.post("/add-designers", addDesigner);
designerRouter.delete("/delete-designer/:id", deleteDesigner);

productRouter.post("/add-product", uploadProductImages.array("images", 10), addProduct);
productRouter.get("/get-single-product/:id", getSingleProduct)
productRouter.put("/update-product/:id", uploadProductImages.array("images", 10), updateProduct);
productRouter.post("/upload-agreements/:id", uploadAgreementFiles.array("agreements", 3), uploadSellerAgreementPdf);
productRouter.put("/set-primary-image/:id", setPrimaryImage);
productRouter.delete("/delete-image/:id", deleteImage)
productRouter.delete("/delete-product/:id", deleteProduct);

guestOrderRouter.get("/fetch-order/:id", getSingleOrder)
guestOrderRouter.put("/update-status/:id", updateOrderStatus)


userOrderRouter.get("/fetch-user-order/:id", getSingleUserOrder)

export {adminRouter, categoryRouter, designerRouter, productRouter, guestOrderRouter, userOrderRouter}
