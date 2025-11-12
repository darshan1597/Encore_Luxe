import React, { useState, useEffect, useRef } from 'react';
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsFillBagCheckFill } from "react-icons/bs";
import { GiLargeDress } from "react-icons/gi";
import { MdSell } from "react-icons/md";
import bag from '../assets/accessories.png';
import mens from '../assets/mens.png';
import womens from '../assets/womens.png';
import kids from '../assets/kids.png';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import axios from "axios";
import { serverUrl } from "../App";

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
    { id: 1, title: "WOMENSWEAR", image: womens },
    { id: 2, title: "MENSWEAR", image: mens },
    { id: 3, title: "KIDSWEAR", image: kids },
    { id: 4, title: "ACCESSORIES", image: bag },
];

function Home() {
    const [loaded, setLoaded] = useState(false);
    const featureRef = useRef(null);
    const exploreRef = useRef(null);
    const latestRef = useRef(null);
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/getProducts/get-products`);
            const allProducts = res.data;

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

    useEffect(() => {
        fetchProducts();
        setTimeout(() => setLoaded(true), 150);
    }, []);


    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>
            {/* Latest Collection */}
            <section className="pb-20 px-20 pt-5 relative bg-white flex flex-col items-center mt-40">
                <h2 className="text-4xl font-semibold text-center mb-12">Latest Collection</h2>
                <div className="relative w-full">
                    {/* Carousel buttons */}
                    <button onClick={() => scrollPrev(latestRef)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltLeft />
                    </button>

                    <button onClick={() => scrollNext(latestRef)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltRight />
                    </button>

                    <div ref={latestRef} className="flex gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 scrollbar-hide" >
                        {latestProducts.length > 0 ? 
                            (
                                latestProducts.map((product) => (
                                    <div key={product._id} className="flex-shrink-0 overflow-hidden relative group" >
                                        <div className={`overflow-hidden rounded mb-5`} onClick={() => navigate(`/product/${product._id}`)}>
                                            <img src={`${serverUrl}/productImages/${product.images?.find(i => i.isPrimary)?.name}`} alt={product.name} className="w-full h-100 transition-transform duration-700 ease-in-out hover:scale-110 cursor-pointer" />
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
            <section className="pb-20 px-20 pt-5 relative bg-gray-50 flex flex-col items-center">
                <h2 className="text-4xl font-semibold text-center mb-12">Featured Collection</h2>
                <div className="relative w-full">
                    {/* Carousel buttons */}
                    <button onClick={() => scrollPrev(featureRef)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltLeft />
                    </button>

                    <button onClick={() => scrollNext(featureRef)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer z-1 hidden md:block" >
                        <FaLongArrowAltRight />
                    </button>

                    <div ref={featureRef} className="flex gap-12 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 scrollbar-hide" >
                        {featuredProducts.length > 0 ? 
                            (
                                featuredProducts.map((product) => (
                                    <div key={product._id} className="flex-shrink-0 overflow-hidden relative group" >
                                        <div className={`overflow-hidden rounded mb-5`} onClick={() => navigate(`/product/${product._id}`)}>
                                            <img src={`${serverUrl}/productImages/${product.images?.find(i => i.isPrimary)?.name}`} alt={product.name} className="w-full h-100 transition-transform duration-700 ease-in-out hover:scale-110 cursor-pointer" />
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
            {/* <section className="bg-black py-12 px-4 flex flex-col items-center text-center w-[100]">
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
            </section> */}

            {/* Explore */}
            <section className="py-20 px-10 relative bg-gray-50 flex flex-col items-center">
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
                    <div ref={exploreRef} className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 scrollbar-hide" >
                        {exploreItems.map((item) => (
                            <div key={item.id} className="min-w-[30%] flex-shrink-0 rounded-xl overflow-hidden relative cursor-pointer group" >
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

            {/* Footer */}
            <Footer />
            
        </div>
    );
}

export default Home;
