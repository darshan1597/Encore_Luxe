import express from "express"
import isAuth from "../../middlewares/admin/isAuth.js"
import { addCategory, addDesigner, addProduct, changeAdminPassword, deleteAdmin, deleteCategory, deleteDesigner, deleteImage, deleteProduct, editCategory, getAdminProfile, getAllAdmins, getCurrentAdmin, getSingleOrder, getSingleProduct, getSingleUserOrder, setPrimaryImage, updateGuestOrderStatus, updateGuestPaymentStatus, updateProduct, updateUserOrderStatus, updateUserPaymentStatus, uploadSellerAgreementPdf } from "../../controllers/admin/admin.controller.js"
import { uploadAgreementFiles, uploadProductImages } from "../../middlewares/multer.js"

const adminRouter = express.Router()
const categoryRouter = express.Router()
const designerRouter = express.Router()
const productRouter = express.Router()
const guestOrderRouter = express.Router()
const userOrderRouter = express.Router()

adminRouter.get("/current-admin", isAuth, getCurrentAdmin)
adminRouter.get("/all-admins", getAllAdmins);
adminRouter.delete("/delete-admin/:id", deleteAdmin);
adminRouter.get("/profile/:id", getAdminProfile);
adminRouter.put("/change-password/:id", changeAdminPassword);

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
guestOrderRouter.put("/update-status/:id", updateGuestOrderStatus)
guestOrderRouter.put("/update-payment-status/:id", updateGuestPaymentStatus)

userOrderRouter.get("/fetch-user-order/:id", getSingleUserOrder)
userOrderRouter.put("/update-status/:id", updateUserOrderStatus)
userOrderRouter.put("/update-payment-status/:id", updateUserPaymentStatus)

export {adminRouter, categoryRouter, designerRouter, productRouter, guestOrderRouter, userOrderRouter}
