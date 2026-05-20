import React from 'react'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductPage from '../pages/ProductPage'
import Checkout from '../pages/Checkout'
import CartPage from '../pages/CartPage'
import MyOrders from '../pages/MyOrders'
import TermsAndConditions from '../pages/TermsAndConditions'
import SignIn from '../pages/SignIn'
import ForgotPassword from '../pages/ForgotPassword'
import SignUp from '../pages/SignUp'
import SellWithUs from '../pages/SellWithUs'
import ScrollToTop from '../pages/components/ScrollToTop'
import Wishlist from '../pages/Wishlist'
import Profile from '../pages/Profile'
import WhatsAppButton from '../pages/components/WhatsAppButton'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import ReturnRefundPolicy from '../pages/ReturnRefundPolicy'
import ShippingPolicy from '../pages/ShippingPolicy'
import AboutUs from '../pages/AboutUs'
import HowItWorks from '../pages/HowItWorks'
import ScrollToHash from '../pages/components/ScrollToHash'
import TrackOrder from '../pages/TrackOrder'

function UserRoutes() {
    useGetCurrentUser()
    const {userData} = useSelector(state=>state.user)
    return (
        <>
            <ScrollToTop />
            <ScrollToHash />
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/products' element={<Products/>} />
                <Route path='/product/:id' element={<ProductPage/>} />
                <Route path='/checkout' element={<Checkout/>} />
                <Route path='/cart' element={<CartPage/>} />
                <Route path='/my-orders' element={<MyOrders/>} />
                <Route path='/wishlist' element={<Wishlist/>} />
                <Route path='/sell-with-us' element={<SellWithUs/>} />
                <Route path='/terms-and-condition' element={<TermsAndConditions/>} />
                <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
                <Route path='/returns-and-refund' element={<ReturnRefundPolicy/>} />
                <Route path='/shipping-policy' element={<ShippingPolicy/>} />
                <Route path='/about-us' element={<AboutUs/>} />
                <Route path='/how-it-works' element={<HowItWorks/>} />
                {/* User */}
                <Route path='/signin' element={!userData? <SignIn/>: <Navigate to={"/"} replace />}/>
                <Route path='/signup' element={!userData? <SignUp/>: <Navigate to={"/"} replace />}/>
                <Route path='/forgot-password' element={!userData? <ForgotPassword/>: <Navigate to={"/"} replace />}/>
                <Route path='/profile' element={userData ? <Profile /> : <Navigate to="/signin" replace />} />
                <Route path="/track-order" element={<TrackOrder />} />
            </Routes>
            <WhatsAppButton />
        </>
    )
}

export default UserRoutes
