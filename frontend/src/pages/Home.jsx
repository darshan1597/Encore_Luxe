import React, { useState, useEffect, useRef } from 'react';
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsFillBagCheckFill } from "react-icons/bs";
import { GiLargeDress } from "react-icons/gi";
import bag from '../assets/accessories.png';
import mens from '../assets/mens.png';
import womens from '../assets/womens.png';
import kids from '../assets/kids.png';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { IoMdCart } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { MdSell } from "react-icons/md";
import { serverUrl } from "../App";
import { useSelector } from 'react-redux';
import Toast from './components/Toast';

export const values = [
    {
        icon: <GiLargeDress className='text-3xl' />,
        title: "FOR EVERYONE",
        desc: "Trendy collections for men, women, and kids, fashion made for all.",
    },
    {
        icon: <BsFillBagCheckFill className='text-3xl' />,
        title: "ACCESSORIES THAT DEFINES YOU",
        desc: "From chic bags to stylish add-ons, complete your look effortlessly.",
    },
    {
        icon: <LiaShippingFastSolid className='text-3xl' />,
        title: "FREE & FAST SHIPPING",
        desc: "Enjoy free, quick, and reliable delivery on all your orders.",
    },
];

export const exploreItems = [
    { id: 1, title: "WOMENSWEAR", image: womens, category: "Womens" },
    { id: 2, title: "MENSWEAR", image: mens, category: "Mens" },
    { id: 3, title: "KIDSWEAR", image: kids, category: "Kids" },
    { id: 4, title: "ACCESSORIES", image: bag, category: "Accessories" },
];

function Home() {
    const [loaded, setLoaded] = useState(false);
    const featureRef = useRef(null);
    const exploreRef = useRef(null);
    const latestRef = useRef(null);
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);
    const { userData: currentUser } = useSelector((state) => state.user);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [toast, setToast] = useState(null);
    // changesite add below 3
    const [searchQuery, setSearchQuery] = useState("");
    const [allProducts, setAllProducts] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/getProducts/get-products`);
            const allProducts = res.data;

            // changesite add below
            setAllProducts(allProducts);

            const onSite = allProducts.filter((p) => p.onSiteDisplay === true || p.displaySold === true);

            const featured = onSite.filter((p) => p.featured);
            const latest = onSite.filter((p) => p.latest);

            setFeaturedProducts(featured);
            setLatestProducts(latest);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const scrollNext = (ref) => {
        if(ref.current){
            ref.current.scrollBy({ left: 500, behavior: "smooth" });
        }
    }

    const scrollPrev = (ref) => {
        if(ref.current){
            ref.current.scrollBy({ left: -500, behavior: "smooth" });
        }
    }

    const fetchWishlist = async () => {
        if (!currentUser) return;

        try {
            const res = await axios.get(`${serverUrl}/api/wishlist/${currentUser?._id}`);
            setWishlistItems(res.data.map(p => p._id)); // store ONLY product IDs
        } catch (err) {
            console.log("Wishlist fetch failed:", err);
        }
    };

    const handleWishlist = async (productId) => {
        if (!currentUser) {
            setToast({ message: "Please login", type: "error" });
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/api/wishlist/toggle`, {
                userId: currentUser?._id,
                productId,
            });

            const msg = res.data.message;

            setToast({
                message: msg,
                type: msg.includes("Added") ? "success" : "error",
            });

            if (msg.includes("Added")) {
                setWishlistItems(prev => [...prev, productId]);
            } else {
                setWishlistItems(prev => prev.filter(id => id !== productId));
            }
        } catch (err) {
            setToast({ message: "Error occurred", type: "error" });
        }
    };

    const handleAddToCart = async (product) => {
        const newItem = {
            _id: product._id,
            name: product.name,
            sku: product.sku,
            discountedPrice: product.discountedPrice,
            mrp: product.mrp,
            image: `${product.images?.[0]?.name}`,
            quantity: 1,
        };

        if (!currentUser) {
            const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

            const existingItem = existingCart.find((item) => item._id === newItem._id);
            if (existingItem) {
                existingItem.quantity += 0;
            } else {
                existingCart.push(newItem);
            }

            localStorage.setItem("cart", JSON.stringify(existingCart));
            window.dispatchEvent(new Event("cartUpdated"));
            window.dispatchEvent(new Event("openCart"));

            return
        } 

        try {
            await axios.post(`${serverUrl}/api/cart/add-to-cart`, {
                userId: currentUser?._id,
                productId: product?._id,
                quantity: 1,
            });

            window.dispatchEvent(new Event("cartUpdated"));

            window.dispatchEvent(new Event("openCart"));
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    useEffect(() => {
        fetchProducts();
        if (currentUser) fetchWishlist();
        setTimeout(() => setLoaded(true), 150);
    }, [currentUser]);

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>

            {/* changesite add below div */}
            <div className="px-8 lg:px-20 mt-43 flex justify-center">
                <div className="flex w-full max-w-2xl gap-2">
                    <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none" />
                    <button className="px-5 py-2 bg-black text-white rounded-lg cursor-pointer" onClick={() => navigate(`/products?search=${(searchQuery)}`)}>
                        Search
                    </button>
                </div>
            </div>

            {/* Latest Collection */}
            <section className="pb-20 px-8 lg:px-20 pt-5 relative bg-white flex flex-col items-center mt-5">
                <h2 className="text-4xl font-semibold text-center mb-12">Latest Collection</h2>
                <div className="relative w-full">
                    {/* Carousel buttons */}
                    <button onClick={() => scrollPrev(latestRef)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltLeft />
                    </button>

                    <button onClick={() => scrollNext(latestRef)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltRight />
                    </button>

                    <div ref={latestRef} className="flex px-1 gap-5 lg:gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory lg:px-6 scrollbar-hide" >
                        {latestProducts.length > 0 ? 
                            (
                                latestProducts.map((product) => (
                                    <div key={product._id} className="flex-shrink-0 lg:w-[300px] w-[250px] overflow-hidden relative group" >
                                        <div className="relative overflow-hidden" onClick={() => navigate(`/product/${product._id}`)}>
                                            <img src={`${serverUrl}/productImages/${product.images?.find(i => i.isPrimary)?.name}`} alt={product.name} className="lg:w-full w-[250px] h-120 object-cover transition-transform duration-700 ease-in-out hover:scale-110 cursor-pointer" />

                                            {product?.condition === "New" &&  
                                                <div className="absolute top-2 left-2 bg-black text-lg font-bold shadow-xl text-white px-5 py-2 rounded-sm">
                                                    New 
                                                </div>
                                            }

                                            {product?.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                                                    <span className="text-white font-semibold text-lg tracking-wide">
                                                        SOLD OUT
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                                {product?.stock === 0 ? 
                                                    (
                                                        <div className="bg-black text-white px-3 py-1 text-xs font-semibold rounded">
                                                            SOLD OUT
                                                        </div>
                                                    ):(
                                                        <>
                                                            <div className="relative group/heart">
                                                                {currentUser &&
                                                                    <>
                                                                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer" 
                                                                            onClick={(e) => { 
                                                                                e.stopPropagation(); 
                                                                                handleWishlist(product._id); 
                                                                            }}
                                                                        >
                                                                            <FaHeart className={`transition-colors duration-300 ${wishlistItems.includes(product._id) ? "text-red-600" : "text-gray-700"} `} />
                                                                        </button>
                                                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                                                            {wishlistItems ? 
                                                                                "Remove from Wishlist" : "Add to Wishlist"
                                                                            }
                                                                        </span>
                                                                    </>
                                                                }
                                                            </div>
                                                            <div className="relative group/heart">
                                                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                                                    <IoMdCart className="text-gray-700 hover:text-black" 
                                                                        onClick={(e) => { 
                                                                            e.stopPropagation(); 
                                                                            handleAddToCart(product); 
                                                                        }}
                                                                    />
                                                                </button>
                                                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                                                    Add to Cart
                                                                </span>
                                                            </div>
                                                        </>
                                                    )
                                                } 
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-sm text-gray-500 capitalize">{product.designer?.name}</h3>
                                        <p className="text-md font-semibold mb-2 capitalize">{product.name}</p>
                                        <div className='flex gap-4'>
                                            {product.discountedPrice != 0 && 
                                                <>
                                                    <p className="text-gray-700 font-medium">₹{product.discountedPrice}</p>
                                                    <p className="text-red-700 font-medium line-through">₹{product.mrp}</p>
                                                </>
                                            }
                                            {product.discountedPrice === 0 && 
                                                <>
                                                    <p className="text-gray-700 font-medium">₹{product.mrp}</p>
                                                </>
                                            }
                                        </div>
                                    </div>
                                ))
                            ):(
                                <div>
                                    <span colSpan="7" className="text-center py-6 text-gray-500">
                                        No products found
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="pb-20 px-8 lg:px-20 pt-5 relative bg-white flex flex-col items-center">
                <h2 className="text-4xl font-semibold text-center mb-12">Featured Collection</h2>
                <div className="relative w-full">
                    {/* Carousel buttons */}
                    <button onClick={() => scrollPrev(featureRef)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltLeft />
                    </button>

                    <button onClick={() => scrollNext(featureRef)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltRight />
                    </button>

                    <div ref={featureRef} className="flex px-1 gap-5 lg:gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory lg:px-6 scrollbar-hide" >
                        {featuredProducts.length > 0 ? 
                            (
                                featuredProducts.map((product) => (
                                    <div key={product._id} className="flex-shrink-0 lg:w-[300px] w-[250px] overflow-hidden relative group" >
                                        <div className="relative overflow-hidden" onClick={() => navigate(`/product/${product._id}`)}>
                                            <img src={`${serverUrl}/productImages/${product.images?.find(i => i.isPrimary)?.name}`} alt={product.name} className="lg:w-full w-[250px] h-120 object-cover transition-transform duration-700 ease-in-out hover:scale-110 cursor-pointer" />
                                            
                                            {product?.condition === "New" &&  
                                                <div className="absolute top-2 left-2 bg-black text-lg font-bold shadow-xl text-white px-5 py-2 rounded-sm">
                                                    New 
                                                </div>
                                            }

                                            {product?.stock === 0 && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                                                    <span className="text-white font-semibold text-lg tracking-wide">
                                                        SOLD OUT
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                                {product?.stock === 0 ? 
                                                    (
                                                        <div className="bg-black text-white px-3 py-1 text-xs font-semibold rounded">
                                                            SOLD OUT
                                                        </div>
                                                    ):(
                                                        <>
                                                            <div className="relative group/heart">
                                                                {currentUser &&
                                                                    <>
                                                                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer" 
                                                                            onClick={(e) => { 
                                                                                e.stopPropagation(); 
                                                                                handleWishlist(product._id); 
                                                                            }}
                                                                        >
                                                                            <FaHeart className={`transition-colors duration-300 ${wishlistItems.includes(product._id) ? "text-red-600" : "text-gray-700"} `} />
                                                                        </button>
                                                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                                                            {wishlistItems ? 
                                                                                "Remove from Wishlist" : "Add to Wishlist"
                                                                            }
                                                                        </span>
                                                                    </>
                                                                }
                                                            </div>
                                                            <div className="relative group/heart">
                                                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                                                    <IoMdCart className="text-gray-700 hover:text-black" 
                                                                        onClick={(e) => { 
                                                                            e.stopPropagation(); 
                                                                            handleAddToCart(product); 
                                                                        }}
                                                                    />
                                                                </button>
                                                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                                                    Add to Cart
                                                                </span>
                                                            </div>
                                                        </>
                                                    )
                                                } 
                                            </div>
                                        </div>
                                        <h3 className="text-sm text-gray-500 capitalize">{product.designer?.name}</h3>
                                        <p className="text-md font-semibold mb-2 capitalize">{product.name}</p>
                                        <div className='flex gap-4'>
                                            {product.discountedPrice != 0 && 
                                                <>
                                                    <p className="text-gray-700 font-medium">₹{product.discountedPrice}</p>
                                                    <p className="text-red-700 font-medium line-through">₹{product.mrp}</p>
                                                </>
                                            }
                                            {product.discountedPrice === 0 && 
                                                <>
                                                    <p className="text-gray-700 font-medium">₹{product.mrp}</p>
                                                </>
                                            }
                                        </div>
                                    </div>
                                ))
                            ):(
                                <div>
                                    <span colSpan="7" className="text-center py-6 text-gray-500">
                                        No products found
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </section>

            {/* Brand Promise */}
            <section className="pt-10 pb-20 bg-white flex flex-col items-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center max-w-6xl">
                    {values.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                        {item.icon}
                        <h4 className="text-sm font-semibold tracking-widest text-gray-900 mb-2">
                            {item.title}
                        </h4>
                        <p className="text-gray-600 text-sm max-w-xs">{item.desc}</p>
                    </div>
                    ))}
                </div>
            </section>

            {/* Sell With Us */}
            <section className="bg-black py-12 px-4 flex flex-col items-center text-center w-[100]">
                <h2 className="text-2xl font-semibold mb-4 text-white">Sell With Us</h2>
                <p className="text-white mb-8 max-w-xl">
                    Maximize the value of your luxury items with Encore Luxe
                </p>
                <button type="submit" className="relative overflow-hidden px-6 py-3 rounded-lg text-white bg-[#1C1C1C] group cursor-pointer hover:text-black" onClick={()=>navigate("/sell-with-us")}>
                    <span className="relative z-1 flex items-center gap-2">
                        SELL NOW <MdSell />
                    </span>
                    <span className="absolute top-0 left-0 w-0 h-full bg-white text-black transition-all duration-300 ease-out group-hover:w-full"></span>
                    <span className="absolute top-0 left-0 w-full h-full text-black"></span>
                </button>
            </section>

            {/* Explore */}
            <section className="py-20 px-3 lg:px-15 relative bg-gray-50 flex flex-col items-center" id="explore">
                <h2 className="text-4xl font-semibold text-center mb-12">Explore</h2>

                <div className="relative w-full">
                    {/* Carousel buttons */}
                    <button onClick={() => scrollPrev(exploreRef)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md z-1 hover:scale-110 transition-transform cursor-pointer hidden md:block" >
                        <FaLongArrowAltLeft />
                    </button>

                    <button onClick={() => scrollNext(exploreRef)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md z-1 hover:scale-110 transition-transform cursor-pointer hidden md:block" >
                        <FaLongArrowAltRight />
                    </button>

                    {/* Scrollable cards */}
                    <div ref={exploreRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 scrollbar-hide">
                        {exploreItems.map((item) => (
                            <div key={item.id} className="min-w-[30%] flex-shrink-0 rounded-xl overflow-hidden relative cursor-pointer group" onClick={() =>navigate(`/products?category=${btoa(item.category)}`) } >
                                <img src={item.image} alt={item.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                                </div>
                                <h3 className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                                    {item.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            {/* Footer */}
            <Footer />
            
        </div>
    );
}

export default Home;
