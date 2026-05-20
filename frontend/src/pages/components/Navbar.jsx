import React, { useEffect, useState } from 'react';
import { MdAccountCircle, MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { HiMiniShoppingBag } from "react-icons/hi2";
import red_garbha from '../../assets/red_garbha.png';
import bag from '../../assets/accessories.png';
import mens from '../../assets/mens.png';
import womens from '../../assets/womens.png';
import kids from '../../assets/kids.png';
import logo from '../../assets/logo.png';
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import CartSlider from './CartSlider';
import { IoReceiptSharp } from "react-icons/io5";
import { IoMdHeart } from "react-icons/io";
import { RiLogoutBoxFill } from "react-icons/ri";
import axios from "axios";
import { serverUrl } from '../../App';
import { setUserData } from '../../redux/userSlice';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

function Navbar({ isFixed = true }) {
    const {userData} = useSelector(state=>state.user)
    const navigate = useNavigate();
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState("main");
    const [accountLoginMenuOpen, setAccountLoginMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch()
    const [openBranchIndex, setOpenBranchIndex] = useState(null)
    const [cartCount, setCartCount] = useState(0);
    const [designers, setDesigners] = useState([]);

    const fetchDesigners = async () => {
        try {
            const { data } = await axios.get(`${serverUrl}/api/getDesigners/get-designers`);
            const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
            setDesigners(sorted);
        } catch (error) {
            console.error("Error fetching designers:", error);
        }
    };

    useEffect(() => {
        fetchDesigners();
    }, []);

    const toggleBranch = (index) => {
        setOpenBranchIndex(openBranchIndex === index ? null : index)
    }

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`${serverUrl}/api/getCategories/get-categories`);
            setCategories(data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDesignerClick = (designer) => {
        window.location.href = `/products?designer=${designer}`;
    };

    const handleSubcategoryClick = (category, subcategory) => {
        window.location.href = `/products?category=${category}&subcategory=${subcategory}`;
    };

    const positionClass = isFixed ? "fixed" : "";

    useEffect(() => {
        const updateCartCount = async () => {
            try {
                if (userData?._id) {
                    const res = await axios.get(`${serverUrl}/api/cart/get-cart/${userData._id}`);
                    const totalItems = res.data?.cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
                    setCartCount(totalItems);
                } else {
                    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
                    const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
                    setCartCount(totalItems);
                }
            } catch (error) {
                console.error("Error updating cart count:", error);
            }
        };

        updateCartCount();
        window.addEventListener("cartUpdated", updateCartCount);

        setTimeout(() => {
            window.dispatchEvent(new Event("cartUpdated"));
        }, 100);

        window.addEventListener("openCart", () => setIsCartOpen(true));

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
            window.removeEventListener("openCart", () => setIsCartOpen(true));
        }
    }, [userData]);

    const handleLogout = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, {withCredentials: true})
            dispatch(setUserData(null))
            navigate("/signin")
        } catch (error) {
            console.log(error)
        }
    }

    const phoneNumber = "919274717330";
    const message = "Hello! I'd like to know more about your Encore Luxe.";

    const handleContact = () => {
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    };

    return (
        <div>
            <nav className={`w-full top-0 flex justify-between items-center px-6 md:px-16 py-5 bg-white ${positionClass}`}>
                {/* Left (Menu button mobile) */}
                <div className="flex items-center justify-between w-full xl:w-max">
                    <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl xl:hidden">
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className="w-full flex justify-center z-20 xl:ml-0 ml-15">
                        <img src={logo} alt="Encore Luxe" className="cursor-pointer rounded-full w-[100px] sm:w-[120px] md:w-[130px] flex justify-center shadow-2xl transition-all duration-300 ease-in-out hover:scale-108" onClick={()=>navigate("/")} />
                    </div>
                </div>

                <div>
                    <ul className='hidden xl:flex gap-5 items-center font-semibold'>
                        <button className={`cursor-pointer p-2 px-3 rounded-2xl hover:bg-black hover:text-white`} onClick={()=>navigate("/")}>Home</button>
                        <li className={`cursor-pointer p-2 px-3 rounded-2xl hover:bg-black hover:text-white`} onClick={() => navigate("/about-us")}>About</li>
                        <li className="relative group p-2 px-3 cursor-pointer rounded-2xl hover:underline transition-all duration-300">
                            Designers
                            <div className="fixed left-0 top-[75px] hidden group-hover:flex w-screen h-[50%] bg-white text-black shadow-lg p-12 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 z-10" >
                                <div className="flex w-full justify-between gap-10 max-w-[1400px] mx-auto">
                                    
                                    <div className="w-[50%] pl-30">
                                        <img src={red_garbha} alt="Designers" className="w-80 h-full object-cover" />
                                    </div>

                                    <div className="w-[50%] flex justify-around pr-50">
                                        
                                        <div>
                                            <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest">
                                                Indian/ International Designers
                                            </h3>

                                            <input type="text" placeholder="Search designers..." className="mb-4 p-2 pr-30 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                                            <ul className="space-y-3 text-gray-700 overflow-y-auto h-[200px] pr-2 custom-scrollbar">
                                                {designers.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((d) => (
                                                    <li key={d._id} className="hover:text-black cursor-pointer" onClick={() => handleDesignerClick(d.name)}> {d.name} </li>
                                                ))}

                                                {designers.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                                    <li className="text-gray-400">No designer found.</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        {categories.slice(0, 3).map((cat) => (
                            <li key={cat._id} className="relative group p-2 px-3 cursor-pointer rounded-2xl hover:underline transition-all duration-300">
                                {cat.name}
                                <div className="fixed left-0 top-[75px] hidden group-hover:flex w-screen h-[50%] bg-white text-black shadow-lg p-12 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 z-1" >
                                    <div className="flex w-full mx-auto gap-30">
                                        {/* LEFT IMAGE */}
                                        <div className="pl-30">
                                            <img
                                                src={
                                                    cat.name.toLowerCase() === "mens"
                                                    ? mens
                                                    : cat.name.toLowerCase() === "womens"
                                                    ? womens
                                                    : cat.name.toLowerCase() === "kids"
                                                    ? kids
                                                    : bag
                                                }
                                                alt={cat.name}
                                                className="w-80 h-full object-cover"
                                            />
                                        </div>

                                        {/* RIGHT SIDE CONTENT */}
                                        <div className="flex justify-around pr-50 mt-10 gap-10">
                                            {cat.branches.map((branch, i) => (
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-6 uppercase tracking-widest">
                                                        {branch.hierarchy[0]}
                                                    </h3>

                                                    <ul className="space-y-3 text-gray-700 overflow-y-auto h-[500px] pr-2 custom-scrollbar">
                                                        {branch.subcategories.map((sub, j) => (
                                                            <li key={j} className="hover:text-black cursor-pointer" onClick={() => handleSubcategoryClick(cat.name, sub)}> {sub} </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        <li className={`cursor-pointer p-2 px-3 rounded-2xl hover:bg-black hover:text-white`} onClick={handleContact}>Contact</li>
                        {/* <li className={`cursor-pointer p-2 px-3 rounded-2xl hover:bg-black hover:text-white`} onClick={()=>navigate("/sell-with-us")}>Sell With Us</li> */}
                    </ul>

                    <ul className="flex justify-end mt-2 md:mt-4 items-center gap-2">
                        {!userData && (
                            <>
                                <li className='hidden xl:block md:mt-1 px-3 py-1 font-bold cursor-pointer text-lg hover:bg-black hover:text-white rounded-2xl z-20' onClick={()=>navigate("/signup")}>Sign Up</li>
                                <li className='hidden xl:block md:mt-1 px-3 py-1 font-bold cursor-pointer text-lg hover:bg-black hover:text-white rounded-2xl z-20' onClick={()=>navigate("/signin")}>Login</li>
                                <li className='ml-2 text-center cursor-pointer md:text-lg font-semibold xl:hidden text-sm relative bg-black rounded-lg text-white py-1 px-2 z-20' onClick={() => setAccountMenuOpen((prev) => !prev)}>
                                    Login/ SignUp
                                </li>
                            </>
                        )}
                        {userData && (
                            <>
                                <li className='lg:pt-2 cursor-pointer z-20' onClick={()=>navigate("/wishlist")}><IoMdHeart size={35} /></li>
                                <li className='lg:pt-2 px-1 cursor-pointer relative z-20' onClick={() => setAccountLoginMenuOpen((prev) => !prev)}>
                                    <MdAccountCircle size={35} />
                                    <div className={`absolute right-0 mt-2 w-max px-1 font-bold bg-white border border-gray-200 rounded-lg shadow-2xl py-2 z-[999] transform transition-all duration-300 ease-out origin-top cursor-pointer ${ accountLoginMenuOpen ? "opacity-100 scale-100 -translate-x-5 translate-y-0" : "opacity-0 scale-0 translate-x-15 translate-y-0 pointer-events-none" }`}>
                                        <p className="px-4 py-2 text-black text-lg border-b cursor-default" >
                                            Welcome {userData.fullName.split(" ")[0]}
                                        </p>
                                        <p className="px-4 py-2 text-gray-700 text-lg hover:text-black flex items-center group gap-2" onClick={() =>  { navigate("/profile"); setAccountLoginMenuOpen(false); }} >
                                            <span className='bg-gray-700 text-white py-[2px] px-[10px] rounded-full group-hover:bg-black'> {userData.fullName.slice(0,1)} </span> 
                                            Profile
                                        </p>
                                        <p className="px-4 py-2 text-gray-700 text-lg hover:text-black flex items-center gap-2" onClick={() => { navigate("/my-orders"); setAccountLoginMenuOpen(false); }} >
                                            <IoReceiptSharp size={25} /> 
                                            Order History
                                        </p>
                                        <button className="px-4 py-2 text-lg text-red-500 hover:text-red-600 flex items-center gap-2 cursor-pointer" onClick={handleLogout} >
                                            <RiLogoutBoxFill size={28} />
                                            Logout
                                        </button>
                                    </div>
                                </li>
                            </>
                        )}
                        <li className='relative lg:pt-1 px-1 cursor-pointer z-20' onClick={() => setIsCartOpen(true)}>
                            <HiMiniShoppingBag size={33} />
                            <span className="absolute -top-[5px] -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        </li>

                        {/* Account Slider (logged in) */}
                        {accountLoginMenuOpen && (
                            <div className="fixed inset-0" onClick={() => setAccountLoginMenuOpen(false)} ></div>
                        )}
                    </ul>
                </div>
            </nav>
            {/* Menu Overlay + Right Slide Panel */}
            {menuOpen && (
                <div className="fixed inset-0" onClick={() => setMenuOpen(false)} ></div>
            )}

            <div className={`fixed top-0 left-0 h-full bg-white z-50 transform transition-transform duration-500 ease-in-out overflow-x-hidden ${menuOpen ? "translate-x-0" : "-translate-x-full" } w-[95%] shadow-2xl overflow-scroll`}>
                    <FaTimes className="text-2xl ml-5 cursor-pointer mt-15" onClick={() => {setMenuOpen(false); setCurrentMenu("main")}}  />
                <div className="flex flex-col px-5 py-4 h-full">
                    {/* Main Menu */}
                    {currentMenu === "main" && (
                        <ul className="flex flex-col gap-4 w-full ml-5 text-xl">
                            <li className="hover:bg-black hover:text-white py-2 cursor-pointer border-b mr-15" onClick={() => navigate("/")}>Home</li>
                            <li className="hover:bg-black hover:text-white py-2 cursor-pointer border-b mr-15" onClick={() => navigate("/about-us")}>About</li>
                            <li className="hover:bg-black hover:text-white py-2 cursor-pointer flex justify-between border-b mr-15" onClick={() => setCurrentMenu("designers")}>
                                <span>Designers</span>
                                <span><MdOutlineKeyboardArrowRight className='text-2xl'/></span>
                            </li>
                            {categories.map((cat) => (
                                <li key={cat._id} className="hover:bg-black hover:text-white py-2 cursor-pointer flex justify-between border-b mr-15" onClick={() => setCurrentMenu(cat.name.toLowerCase())}>
                                    <span>{cat.name}</span>
                                    <span><MdOutlineKeyboardArrowRight className='text-2xl'/></span>
                                </li>
                            ))}
                            <li className="hover:bg-black hover:text-white py-2 cursor-pointer border-b mr-15" onClick={handleContact}>Contact</li>
                            {/* <li className="hover:bg-black hover:text-white py-2 cursor-pointer border-b mr-15">Sell With Us</li> */}
                        </ul>
                    )}
                    {/* Designers Menu */}
                    <div className={`absolute left-0 w-full h-full transition-transform duration-500 ease-in-out text-xl ml-5 ${currentMenu === "designers" ? "translate-x-0" : "translate-x-full"}`} >
                        {/* Go Back */}
                        <button className="flex items-center gap-2 text-left text-black hover:text-gray-700 mb-5" onClick={() => setCurrentMenu("main")} >
                            <MdOutlineKeyboardArrowLeft className='text-2xl'/> Menu
                        </button>

                        {/* Designers list */}
                        <ul className="flex flex-col gap-3 ml-5">
                            {designers.map((d) => (
                                <li key={d._id} className="hover:text-black cursor-pointer">
                                    {d.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {categories.map((cate) => (
                        <div key={cate._id} className={`absolute left-0 w-full h-full transition-transform duration-500 ease-in-out text-xl ml-5 ${currentMenu === cate.name.toLowerCase() ? "translate-x-0" : "translate-x-full"}`} >
                            {/* Go Back */}
                            <button className="flex items-center gap-2 text-left text-black hover:text-gray-700 mb-5" onClick={() => setCurrentMenu("main")} >
                                <MdOutlineKeyboardArrowLeft className='text-2xl'/> Menu
                            </button>

                            <ul className="flex flex-col gap-3 ml-5">
                                {cate.branches.map((branch, i) => (
                                    <div key={i} className="w-full">
                                        <button type="button" onClick={() => toggleBranch(i)} className="flex justify-between items-center w-full py-2 border-b border-gray-300 text-lg font-semibold uppercase tracking-widest">
                                            <div className='flex'>
                                                <>
                                                    {branch.hierarchy[0]} 
                                                </>
                                                <>
                                                    <MdOutlineKeyboardArrowDown size={25} />
                                                </>
                                            </div>
                                            {openBranchIndex === i ? 
                                                (
                                                    <MdOutlineKeyboardArrowUp size={25} />
                                                ) : (
                                                    <MdOutlineKeyboardArrowDown size={25} />
                                                )
                                            }
                                        </button>

                                        <div className={`transition-all duration-500 overflow-hidden ${ openBranchIndex === i ? "max-h-[300px] mt-2" : "max-h-0" }`} >
                                            <ul className="pl-3 space-y-2 text-gray-700">
                                                {branch.subcategories.map((sub, j) => (
                                                    <li key={j} className="hover:text-black cursor-pointer transition-all" 
                                                        onClick={() => {
                                                            handleSubcategoryClick(cate.name, sub);
                                                            setMenuOpen(false);
                                                            setCurrentMenu("main");
                                                        }}
                                                    >
                                                        {sub}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cart Slider */}
            <CartSlider isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
            {isCartOpen && (
                <div className="fixed inset-0" onClick={() => setIsCartOpen(false)} ></div>
            )}

            {/* Login/Sign Up slider */}
            {accountMenuOpen && (
                <div className="fixed inset-0" onClick={() => setAccountMenuOpen(false)} ></div>
            )}
            <div className={`absolute right-0 mt-2 w-max font-bold bg-white border border-gray-200 rounded-lg shadow-2xl py-2 z-[999] transform transition-all duration-300 ease-out origin-top ${ accountMenuOpen ? "opacity-100 scale-100 -translate-x-32 translate-y-26" : "opacity-0 scale-0 -translate-x-10 translate-y-30 pointer-events-none" }`}>
                <p className="px-4 py-2 text-gray-700 text-lg hover:text-black cursor-pointer" onClick={() =>  { navigate("/signin"); setAccountMenuOpen(false); }} >
                    Login
                </p>
                <p className="px-4 py-2 text-gray-700 text-lg hover:text-black cursor-pointer" onClick={() => { navigate("/signup"); setAccountMenuOpen(false); }} >
                    Sign Up
                </p>
            </div>
        </div>
    )
}

export default Navbar
