import React, { useRef, useState } from "react";
import { TfiClose } from "react-icons/tfi";
import { IoMdCart } from "react-icons/io";
import { FaHeart, FaRegStar } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { FaTruckFast } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useSelector } from "react-redux";
import Toast from "./components/Toast";

const ProductPage = () => {
    const [showShipping, setShowShipping] = useState(false);
    const [open, setOpen] = useState(false);
    const {id} = useParams()
    const [product, setProduct] = useState(null)
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState("")
    const [relatedSub, setRelatedSub] = useState([]);
    const [relatedHierarchy, setRelatedHierarchy] = useState([]);
    const imgRef = useRef(null);
    const lensRef = useRef(null);
    const zoomRef = useRef(null);
    const [showZoom, setShowZoom] = useState(false);
    const [imgWidth, setImgWidth] = useState(0);
    const [imgHeight, setImgHeight] = useState(0);
    const lensSize = 100;
    const zoomLevel = 4;
    const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
    const currentUser = useSelector(state=>state.user)
    const navigate = useNavigate()
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
    if (imgRef.current) {
        setImgWidth(imgRef.current.offsetWidth);
        setImgHeight(imgRef.current.offsetHeight);
    }
    }, [selectedImage]);

    useEffect(() => {
        const img = new Image();
        img.src = selectedImage.replace(/\\/g, "/");
        img.onload = () => {
            setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
        };
    }, [selectedImage]);

    const handleMouseMove = (e) => {
        const bounds = imgRef.current.getBoundingClientRect();

        let x = e.clientX - bounds.left - lensSize / 2;
        let y = e.clientY - bounds.top - lensSize / 2;

        // Prevent lens from going out
        x = Math.max(0, Math.min(x, imgWidth - lensSize));
        y = Math.max(0, Math.min(y, imgHeight - lensSize));

        setLensPos({ x, y });

        // Zoom positioning
        setZoomPos({
            x: -(x * zoomLevel),
            y: -(y * zoomLevel),
        });
    };

    const clampStyle = {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        WebkitLineClamp: 2,
    };

    const fetchRelated = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/getProducts/get-products`);
            const all = res.data;

            const sameSub = all
                .filter(p => 
                    p?.subcategory?.toLowerCase() === product?.subcategory?.toLowerCase() && 
                    p._id !== product._id
                )
                .slice(0, 4);

            const sameHierarchy = all
                .filter(p => 
                    p?.hierarchy?.toLowerCase() === product?.hierarchy?.toLowerCase() && 
                    p._id !== product._id
                )
                .slice(0, 4);

            setRelatedSub(sameSub);
            setRelatedHierarchy(sameHierarchy);
        } catch (err) {
            console.log("Error fetching related products", err);
        }
    }

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/products/get-single-product/${id}`);
            setProduct(res.data.product);
            setImages(res.data.product.images);
            setSelectedImage(`${serverUrl}/productImages/${res.data.product.images?.find(i => i.isPrimary)?.name}`);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const handleAddToCart = async () => {
        const newItem = {
            _id: product._id,
            name: product.name,
            sku: product.sku,
            discountedPrice: product.discountedPrice,
            mrp: product.mrp,
            image: `${product.images?.[0]?.name}`,
            quantity: 1,
        };

        if (!currentUser.userData) {
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
                userId: currentUser?.userData?._id,
                productId: product?._id,
                quantity: 1,
            });

            window.dispatchEvent(new Event("cartUpdated"));

            window.dispatchEvent(new Event("openCart"));
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    const handleAddToCartLike = async (product) => {
        const newItem = {
            _id: product._id,
            name: product.name,
            sku: product.sku,
            discountedPrice: product.discountedPrice,
            mrp: product.mrp,
            image: `${product.images?.[0]?.name}`,
            quantity: 1,
        };

        if (!currentUser.userData) {
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
                userId: currentUser?.userData?._id,
                productId: product?._id,
                quantity: 1,
            });

            window.dispatchEvent(new Event("cartUpdated"));

            window.dispatchEvent(new Event("openCart"));
        } catch (error) {
            alert("Something went wrong!");
        }
    };

    const checkWishlistStatus = async () => {
        if (!currentUser.userData){
            setToast({ message: "Please login", type: "error" });
            return;
        }

        try {
            const res = await axios.get(`${serverUrl}/api/wishlist/${currentUser?.userData?._id}`);
            const wishlist = res?.data || [];

            const exists = wishlist.some(w => w._id === product?._id);
            setIsWishlisted(exists);
        } catch (err) {
            console.log("Wishlist check failed:", err);
        }
    };

    useEffect(() => {
        if (product && currentUser.userData) {
            checkWishlistStatus();
        }
    }, [product, currentUser]);

    const handleWishlist = async (productId) => {
        if (!currentUser.userData) {
            setToast({ message: "Please login", type: "error" });
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/api/wishlist/toggle`, {
                userId: currentUser?.userData?._id,
                productId,
            });

            const msg = res.data.message;

            setToast({
                message: msg,
                type: msg.includes("Added") ? "success" : "error",
            });

            setIsWishlisted(msg.includes("Added"));
        } catch (err) {
            setToast({ message: "Error occurred", type: "error" });
        }
    };

    const handleBuyNow = async () => {
        const newItem = {
            _id: product._id,
            name: product.name,
            discountedPrice: product.discountedPrice,
            image: `${product.images?.[0]?.name}`,
            quantity: 1,
        };

        try {
            if (!currentUser.userData) {
                const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingItem = existingCart.find((item) => item._id === newItem._id);

                if (existingItem) existingItem.quantity += 0;
                else existingCart.push(newItem);

                localStorage.setItem("cart", JSON.stringify(existingCart));
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                await axios.post(`${serverUrl}/api/cart/add-to-cart`, {
                    userId: currentUser.userData._id,
                    productId: product._id,
                    quantity: 1,
                });
                window.dispatchEvent(new Event("cartUpdated"));
            }

            navigate("/checkout");
        } catch (error) {
            console.log("Buy Now failed", error);
            alert("Something went wrong while processing your order.");
        }
    };

    useEffect(() => {
        fetchRelated()
    }, [product])

    useEffect(() => {
        fetchProduct();
    }, [id])

    return (
        <div className="min-h-screen w-full bg-white overflow-x-hidden">
            <section className="relative flex flex-col justify-between z-10">
                <Navbar isFixed={false} />
            </section>
            <div className="bg-white flex flex-col md:flex-row py-6 md:py-10">
                <div className="flex flex-col lg:flex-row md:pl-40 items-center md:items-start">
                    {/* LEFT IMAGE SECTION */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full lg:w-max">
                        <div className="flex flex-row md:flex-col gap-3 justify-center md:justify-start overflow-y-hidden overflow-x-auto md:overflow-y-auto md:overflow-x-hidden w-full md:w-auto max-h-[120px] md:max-h-[500px] custom-scrollbar scroll-smooth snap-x md:snap-y" >
                            {images.map((img, index) => (
                                <img key={index} src={`${serverUrl}/productImages/${img.name}`} alt={`Thumbnail ${index + 1}`} className={`w-24 h-24 md:w-28 md:h-28 object-cover rounded-md flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 border ${ selectedImage === `${serverUrl}/productImages/${img.name}` ? "border-black" : "border-gray-300" } snap-start`} onClick={() => setSelectedImage(`${serverUrl}/productImages/${img.name}`)} />
                            ))}
                        </div>
                        <div className="relative w-full max-w-[400px] md:max-w-[550px] flex flex-col items-center gap-4">
                            <div className="relative flex items-start gap-6">
                                {/* LEFT: Main Image */}
                                <div className="relative w-[450px] h-[600px]" onMouseMove={handleMouseMove} onMouseEnter={() => setShowZoom(true)} onMouseLeave={() => setShowZoom(false)} >
                                    <img src={selectedImage} className="w-full h-full object-cover" alt="" ref={imgRef} />

                                    {/* Lens */}
                                    {showZoom && (
                                        <div ref={lensRef} className="absolute border border-gray-300 bg-white/20 pointer-events-none" style={{ width: lensSize, height: lensSize, left: lensPos.x, top: lensPos.y, transform: "translateZ(0)", }} />
                                    )}
                                </div>

                                {/* RIGHT: Zoom Result */}
                                <div className="absolute top-0 z-999"
                                    style={{
                                        left: "calc(100% + 24px)",
                                        width: "450px",
                                        height: "600px",
                                        pointerEvents: "none",
                                        overflow: "hidden",
                                        borderRadius: "8px",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                                        border: "1px solid rgba(0,0,0,0.06)",
                                        background: "#fff",
                                        transition: "opacity 180ms ease",
                                        opacity: showZoom ? 1 : 0,
                                    }}
                                >
                                    {showZoom && (
                                        <div ref={zoomRef} className="w-full h-full bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(${selectedImage})`,
                                                backgroundSize: `${naturalSize.w * (zoomLevel / 2)}px ${naturalSize.h * (zoomLevel / 2)}px`,
                                                backgroundPosition: `${zoomPos.x}px ${zoomPos.y}px`,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="w-full max-w-[400px] aspect-[9/16] lg:flex items-center justify-center bg-white border border-gray-200 rounded-md overflow-hidden hidden">
                                {images[1] && (
                                    <img src={`${serverUrl}/productImages/${images[1].name}`} alt="Secondary Product" className="w-full h-full object-cover" />
                                )}
                            </div>
                            
                        </div>
                    </div>

                    {/* RIGHT DETAILS SECTION */}
                    <div className="lg:w-1/2 w-full flex flex-col md:px-10 px-4 py-8 space-y-4">
                        <h1 className="text-lg tracking-wide mb-2 uppercase flex gap-5">
                            <span className="pt-2">{product?.name}</span>
                            <div className="relative group/heart">
                                {currentUser.userData && 
                                    <>
                                        <button className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer ${isWishlisted ? "shadow-red-500" : "shadow-gray-500"}`} onClick={() => handleWishlist(product._id)}>
                                            <FaHeart size={25} className={isWishlisted ? "text-red-500" : "text-gray-700"} />
                                        </button>
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                            {isWishlisted ? 
                                                "Remove from Wishlist" : "Add to Wishlist"
                                            }
                                        </span>
                                    </>
                                }
                            </div>
                        </h1>
                        <div className='flex gap-4 font-bold'>
                            {product?.discountedPrice != 0 && 
                                <>
                                    <p className="text-gray-700 font-medium">₹{product?.discountedPrice}</p>
                                    <p className="text-red-700 font-medium line-through">₹{product?.mrp}</p>
                                </>
                            }
                            {product?.discountedPrice === 0 && 
                                <>
                                    <p className="text-gray-700 font-medium">₹{product.mrp}</p>
                                </>
                            }
                        </div>
                        <p className="text-gray-400 text-xs">MRP INCL. OF ALL TAXES</p>

                        <hr className="border-gray-300" />


                        {/* Description */}
                        <div className="w-full max-w-2xl">
                            <h2 className="tracking-widest font-semibold mb-3">DESCRIPTION</h2>
                            <div className="text-gray-700 text-sm leading-relaxed transition-all duration-300" style={open ? undefined : clampStyle} aria-expanded={open} >
                                <p className="whitespace-pre-line leading-relaxed">{product?.productDescription}</p>
                            </div>

                            <button onClick={() => setOpen((s) => !s)} className="text-sm font-medium text-black hover:underline focus:outline-none cursor-pointer" >
                                {open ? "Show less" : "...Know more"}
                            </button>
                        </div>
                        {product?.condition?.toLowerCase() != "new" &&
                            <div className="flex flex-col mb-6">
                                <h2 className="text-lg tracking-widest font-semibold">CONDITION</h2>

                                <div className="relative w-80 mt-8 mx-auto">
                                    <div className="absolute top-[4px] left-[20px] right-[40px] h-[2px] bg-gray-500 z-0" />

                                    <div className="flex justify-between items-center relative z-1">
                                        {["GOOD", "VERY GOOD", "EXCELLENT"].map((cond) => {
                                            const isActive = product?.condition?.toLowerCase() === cond.toLowerCase();
                                            return (
                                                <div key={cond} className="flex flex-col items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full border border-black flex items-center justify-center ${ isActive ? "bg-black" : "bg-white" }`} />

                                                    <span className={`text-sm font-medium ${ isActive ? "bg-black px-1 text-white" : "text-gray-700" }`} >
                                                        {cond}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        }
                        
                        {product?.stock === 0 ? 
                            (
                                <button className="bg-black text-white w-full sm:w-auto px-6 py-3 rounded-md text-sm font-semibold hover:bg-white hover:border border border-black hocer:border-black hover:text-black transition-colors cursor-pointer">
                                    <span className="relative z-10">SOLD OUT</span>
                                </button>
                            ):(
                                <>
                                    <button className="bg-black text-white w-full sm:w-auto px-6 py-3 rounded-md text-sm font-semibold hover:bg-white hover:border border border-black hocer:border-black hover:text-black transition-colors cursor-pointer" onClick={handleAddToCart}>
                                        <span className="relative z-10">Add to Cart</span>
                                    </button>

                                    {/* Buy Now */}
                                    <button className="bg-white text-black w-full sm:w-auto px-6 py-3 rounded-md text-sm font-semibold hover:bg-black border border-black hover:text-white hover:border hover:border-black transition-colors cursor-pointer" onClick={handleBuyNow}>
                                        <span className="relative z-10">Buy Now</span>
                                    </button>
                                </>
                             )
                        }
                        {/* Add to Cart */}
                        

                        {/* Trust badges */}
                        <div className="flex justify-center items-center gap-12 mb-6 bg-white text-gray-800">
                            <div className="flex flex-col items-center">
                                <FaRegStar className="h-10 w-10 mb-2" />
                                <span className="text-sm font-medium">HIGH QUALITY</span>
                            </div>

                            {/* Authenticated / Secure */}
                            <div className="flex flex-col items-center">
                                <MdLock className="h-10 w-10 mb-2" />
                                <span className="text-sm font-medium">AUTHENTICATED</span>
                            </div>

                            {/* Free Shipping */}
                            <div className="flex flex-col items-center">
                                <FaTruckFast className="h-10 w-10 mb-2" />
                                <span className="text-sm font-medium">FREE SHIPPING</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white px-4 sm:px-8 lg:px-20">
                <h2 className="text-3xl font-bold mb-10">You May Also Like</h2>
        
                {relatedSub.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mb-5">More in {product.subcategory}</h3>
                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 transition-all duration-500 ease-in-out" >
                            {relatedSub.map((p) => (
                                <div key={p._id} className="group overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer pb-20" >
                                    <div className="relative overflow-hidden">
                                        <img src={`${serverUrl}/productImages/${p.images?.find(i => i.isPrimary)?.name}`} alt="Product" className={`w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 h-[300px] sm:h-[380px] md:h-[420px]`} onClick={() => navigate(`/product/${p._id}`)} />

                                        {/* Top left label */}
                                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-sm">
                                            {p.condition}
                                        </div>
                
                                        {/* Discount */}
                                        {p.discountedPrice != 0 &&
                                            <div className="absolute top-8 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-sm">
                                                Save {Math.round(((p.mrp - p.discountedPrice)/ p.mrp)*100)}%
                                            </div>
                                        }
                                        
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                            <div className="relative group/heart">
                                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                                    <IoMdCart className="text-gray-700 hover:text-black" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            handleAddToCartLike(p); 
                                                        }}
                                                    />
                                                </button>
                                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                                    Add to Cart
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-gray-800 font-medium text-sm md:text-base hover:text-black transition-colors capitalize">
                                            {p.name} sadsds
                                        </h3>
                                        {p.discountedPrice != 0 &&
                                            <div className="flex gap-4 font-bold">
                                                <p className="text-gray-600 text-sm">₹ {p.discountedPrice}</p>
                                                <p className="text-red-600 text-sm line-through">₹ {p.mrp}</p>
                                            </div>
                                        }
                                        {p.discountedPrice === 0 &&
                                            <div className="flex gap-4 font-bold">
                                                <p className="text-gray-600 text-sm">₹ {p.mrp}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {relatedHierarchy.length > 0 && (
                    <>
                        <h3 className="text-xl font-semibold mb-5">More in {product.hierarchy}</h3>
                        {/* Product Grid */}
                        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 transition-all duration-500 ease-in-out`} >
                            {relatedHierarchy.map((p) => (
                                <div key={p._id} className="group overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer pb-20" >
                                    <div className="relative overflow-hidden">
                                        <img src={`${serverUrl}/productImages/${p.images?.find(i => i.isPrimary)?.name}`} alt="Product" className="w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 h-[300px] sm:h-[380px] md:h-[420px]" onClick={() => navigate(`/product/${p._id}`)} />
                
                                        {/* Top left label */}
                                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-sm">
                                            {p.condition}
                                        </div>
                                        
                                        {/* Discount */}
                                        {p.discountedPrice != 0 &&
                                            <div className="absolute top-8 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-sm">
                                                Save {Math.round(((p.mrp - p.discountedPrice)/ p.mrp)*100)}%
                                            </div>
                                        }
                                        
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                            <div className="relative group/heart">
                                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                                    <IoMdCart className="text-gray-700 hover:text-black" 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            handleAddToCartLike(p); 
                                                        }}
                                                    />
                                                </button>
                                                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                                    Add to Cart
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-gray-800 font-medium text-sm md:text-base hover:text-black transition-colors capitalize">
                                        {p.name}
                                        </h3>
                                        {p.discountedPrice != 0 &&
                                            <div className="flex gap-4 font-bold">
                                                <p className="text-gray-600 text-sm">₹ {p.discountedPrice}</p>
                                                <p className="text-red-600 text-sm line-through">₹ {p.mrp}</p>
                                            </div>
                                        }
                                        {p.discountedPrice === 0 &&
                                            <div className="flex gap-4 font-bold">
                                                <p className="text-gray-600 text-sm">₹ {p.mrp}</p>
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Overlay + Right Slide Panel for Shipping */}
            {showShipping && (
                <div className="fixed inset-0" onClick={() => setShowShipping(false)} ></div>
            )}

            <div className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${ showShipping ? "translate-x-0" : "translate-x-full" }`} onClick={(e) => e.stopPropagation()} >
                <div className="p-6 overflow-y-auto h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Shipping, Exchanges and Returns</h2>
                        <TfiClose className="text-2xl cursor-pointer hover:text-gray-600 transition-all" onClick={() => setShowShipping(false)} />
                    </div>

                    {/* Shipping Details */}
                    <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
                        <p><span className="font-medium">Material:</span> 100% Cotton</p>
                        <p><span className="font-medium">Lining:</span> 100% Polyester</p>
                        <p><span className="font-medium">Care Instructions:</span></p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>Machine wash cold with similar colors</li>
                            <li>Do not bleach</li>
                            <li>Iron on low heat</li>
                            <li>Do not tumble dry</li>
                            <li>Dry clean optional</li>
                        </ul>
                        <p><span className="font-medium">Origin:</span> Made in India</p>
                    </div>
                </div>
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <Footer />
        </div>
    );
};

export default ProductPage;
