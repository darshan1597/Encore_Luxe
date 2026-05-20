import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminSignIn from '../pages/admin/AdminSignIn'
import useGetCurrentAdmin from '../hooks/useGetCurrentAdmin'
import { useSelector } from 'react-redux'
import AdminPanel from '../pages/admin/AdminPanel'
import ViewForms from '../pages/admin/ViewForms'
import ManageCategories from '../pages/admin/ManageCategories'
import AddCategories from '../pages/admin/AddCategories'
import EditCategories from '../pages/admin/EditCategories'
import DeleteCategories from '../pages/admin/DeleteCategories'
import AddProduct from '../pages/admin/AddProduct'
import ViewProducts from '../pages/admin/ViewProducts'
import EditProduct from '../pages/admin/EditProduct'
import ScrollToTop from '../pages/components/ScrollToTop'
import ViewOrders from '../pages/admin/ViewOrders'
import ViewSingleOrder from '../pages/admin/ViewSingleOrder'
import AddDesigners from '../pages/admin/AddDesigners'
import AddAdmins from '../pages/admin/AddAdmins'
import DeleteAdmins from '../pages/admin/DeleteAdmins'
import AdminProfile from '../pages/admin/AdminProfile'
import AddEditDiscount from '../pages/admin/AddEditDiscount'
import ViewDiscount from '../pages/admin/ViewDiscount'
import ViewUserOrders from '../pages/admin/ViewUserOrders'
import ViewGuestOrders from '../pages/admin/ViewGuestOrders'

function AdminRoutes() {
    useGetCurrentAdmin()
    const {adminData} = useSelector(state=>state.admin)
    return (
        <>
            <ScrollToTop />
            <Routes>    
                <Route path="/admin-signin" element={!adminData ? <AdminSignIn /> : <Navigate to="/admin/admin-panel" replace />} />
                <Route path='/admin-panel' element={adminData? <AdminPanel/>: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/view-forms' element={adminData? <ViewForms/>: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/manage-categories' element={adminData? <ManageCategories/>: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/add-categories' element={adminData? <AddCategories/>: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/edit-categories' element={adminData? <EditCategories />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/delete-categories' element={adminData? <DeleteCategories />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/add-designers' element={adminData? <AddDesigners />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/add-products' element={adminData? <AddProduct />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/view-products' element={adminData? <ViewProducts />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/edit-product/:id' element={adminData? <EditProduct />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/view-user-orders' element={adminData? <ViewUserOrders />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/view-guest-orders' element={adminData? <ViewGuestOrders />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/view-orders' element={adminData? <ViewOrders />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/view-order/:id' element={adminData? <ViewSingleOrder />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/add-admins' element={adminData? <AddAdmins />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/delete-admins' element={adminData? <DeleteAdmins />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/admin-profile' element={adminData? <AdminProfile />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/add-discount-codes' element={adminData? <AddEditDiscount />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/view-discount-codes' element={adminData? <ViewDiscount />: <Navigate to="/admin/admin-signin" replace />} />
                <Route path='/edit-discount-code/:id' element={adminData? <AddEditDiscount />: <Navigate to="/admin/admin-signin" replace />} />
            </Routes>
        </>
    )
}

export default AdminRoutes
