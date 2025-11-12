import React, { useEffect, useState } from "react";
import { IoMdCart } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Navbar from "./components/Navbar";
import axios from "axios";
import { serverUrl } from "../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaLongArrowAltRight } from "react-icons/fa";
import Footer from "./components/Footer";

function Products() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRange, setSelectedRange] = useState(null);
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const category = queryParams.get("category");
    const decodedCategory = category ? atob(category) : null;
    const subcategory = queryParams.get("subcategory")
    const decodedSubcategory = subcategory ? atob(subcategory) : null;
    const navigate = useNavigate();
    const [product, setProduct] = useState(null)
    const [images, setImages] = useState([])
    const [selectedImage, setSelectedImage] = useState("")
    const {id} = useParams()
    const [currentPage, setCurrentPage] = useState(1);
    const { userData: currentUser } = useSelector((state) => state.user);

    const priceRanges = [
        { label: "Below ₹500", min: 0, max: 500 },
        { label: "₹500 - ₹1000", min: 500, max: 1000 },
        { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
        { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
        { label: "Above ₹5000", min: 5000, max: 999999 },
    ];

    const handleRangeClick = (range) => {
        if (selectedRange?.label === range.label) {
            setSelectedRange(null);
            setMinPrice("");
            setMaxPrice("");
        } else {
            setSelectedRange(range);
            setMinPrice("") 
            setMaxPrice("");
        }
    };

    const handleSizeClick = (size) => {
        setSelectedSizes((prevSizes) => {
            if (prevSizes.includes(size)) {
                return prevSizes.filter((s) => s !== size);
            } else {
                return [...prevSizes, size];
            }
        });
    };

    const handleWishlist = async (productId) => {
        if (!currentUser) {
            alert("Please login to add to wishlist");
            return;
        }

        try {
            await axios.post(`${serverUrl}/api/wishlist/toggle`, {
                userId: currentUser._id,
                productId,
            });
            alert("Wishlist updated!");
        } catch (err) {
            console.error(err);
        }
    };

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

    useEffect(() => {
        fetchProduct();
    }, [id])

    useEffect(() => {
        fetchProducts();
        setTimeout(() => setLoaded(true), 150);
    }, [decodedCategory, decodedSubcategory]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/getProducts/get-products`);
            let allProducts = res.data;

            if (decodedCategory) {
                allProducts = allProducts.filter(p => p.category === decodedCategory);
            }
            if (decodedSubcategory) {
                allProducts = allProducts.filter(p => p.subcategory === decodedSubcategory);
            }

            allProducts = allProducts.filter(p => {
                const isVisible = p.status === "onsite display" || p.onSiteDisplay === true;

                const stockCheck = p.stock > 0 || (p.stock === 0 && p.displaySold === true);

                return isVisible && stockCheck;
            })

            setProducts(allProducts)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        let result = [...products]

        if (search) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (minPrice || maxPrice) {
            const min = Number(minPrice) || 0;
            const max = Number(maxPrice) || Infinity;
            result = result.filter(
                (p) => p.discountedPrice >= min && p.discountedPrice <= max
            );
        }

        else if (selectedRange) {
            const { min, max } = selectedRange;
            result = result.filter(
                (p) => p.discountedPrice >= min && p.discountedPrice <= max
            );
        }

        if (selectedSizes.length > 0) {
            result = result.filter((p) =>
                selectedSizes.some(
                    (s) => p.size?.toLowerCase() === s.toLowerCase()
                )
            );
        }

        if (sort === "lowToHigh") result.sort((a, b) => a.discountedPrice - b.discountedPrice);
        if (sort === "highToLow") result.sort((a, b) => b.discountedPrice - a.discountedPrice);
        if (sort === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        result.sort((a, b) => {
            if ((a.stock === 0) === (b.stock === 0)) return 0;
            return a.stock === 0 ? 1 : -1;
        });

        setFilteredProducts(result);

        setCurrentPage(1);
    }, [products, search, selectedRange, minPrice, maxPrice, sort, selectedSizes]);

    const productsPerPage = 48;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleAddToCart = async (product) => {
        const newItem = {
            _id: product._id,
            name: product.name,
            discountedPrice: product.discountedPrice,
            mrp: product.mrp,
            image: `${product.images?.[0]?.name}`,
            size: product.size,
            quantity: 1, 
        };

        if (!currentUser) {
            const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

            const existingItem = existingCart.find((item) => item._id === newItem._id);
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
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
        console.error("Cart add failed", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className={`min-h-screen w-full transition-opacity duration-1000 bg-white ${loaded ? "opacity-100" : "opacity-0"}`}>
            <section className="relative flex flex-col justify-between z-10">
                <Navbar />
            </section>
            
            <div className="bg-white mt-42 px-4 sm:px-8 md:px-16 lg:px-20">
                <main className="flex-1">
                    <div className="flex flex-wrap justify-between items-center gap-4 text-gray-600 text-sm mb-8 sm:mb-10">
                        <span className="items-center">
                            {products.length} PRODUCTS</span>
                            <div>
                                {(category || subcategory) && (
                                    <div className="text-gray-700 flex gap-3">
                                        <span className="font-semibold"></span>{" "}
                                        {category && <span>{decodedCategory}</span>}
                                        <FaLongArrowAltRight className="mt-1" />
                                        {subcategory && <span> {decodedSubcategory}</span>}
                                    </div>
                                )}
                            </div>
                        <div className="flex items-center">
                            <button onClick={() => setIsFilterOpen(true)} className="text-sm font-semibold cursor-pointer hover:text-black">
                                FILTERS
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid gap-8 sm:gap-10 md:gap-14 lg:gap-16 transition-all duration-500 ease-in-out grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" >
                        
                        {currentProducts.length > 0 ?
                            (
                                currentProducts.map((p) => {
                                    const primaryImage = p.images?.find(img => img.isPrimary)?.name;
                                    const imageUrl = `${serverUrl}/productImages/${primaryImage}`;
                                    const discount = Math.round((p.mrp - p.discountedPrice) / p.mrp * 100);

                                    return (
                                        <div key={p._id} className="group overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer pb-10 sm:pb-16" >
                                            <div className="relative overflow-hidden">
                                                <img src={imageUrl} alt="Product" className={`w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 lg:h-[450px] md:h-[380px] sm:h-[max]`} onClick={() => navigate(`/product/${p._id}`)} />

                                                {/* Top left label */}
                                                <div className="absolute top-2 left-2 bg-black text-white text-xs font-semibold px-3 py-1 rounded-sm">
                                                    {p.condition}
                                                </div>

                                                {/* Discount */}
                                                {p?.discountedPrice != 0 &&  
                                                    <div className="absolute top-8 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-sm">
                                                        Save {discount}%
                                                    </div>
                                                }

                                                {p.stock === 0 && (
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                        <span className="text-white font-semibold text-lg tracking-wide">
                                                            SOLD OUT
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                                                    {p.stock === 0 ? 
                                                        (
                                                            <div className="bg-black text-white px-3 py-1 text-xs font-semibold rounded">
                                                                SOLD OUT
                                                            </div>
                                                        ):(
                                                            <>
                                                                <div className="relative group/heart">
                                                                    {currentUser &&
                                                                        <>
                                                                            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer" onClick={() => handleWishlist(p._id)}>
                                                                                <FaHeart className="text-gray-700 hover:text-red-600" />
                                                                            </button>
                                                                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/heart:opacity-100 transition-all duration-300 whitespace-nowrap">
                                                                                Add to Wishlist
                                                                            </span>
                                                                        </>
                                                                    }
                                                                    
                                                                </div>
                                                                <div className="relative group/heart">
                                                                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
                                                                        <IoMdCart className="text-gray-700 hover:text-black"  onClick={() => handleAddToCart(p)}/>
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
                                            <div className="p-3">
                                                <h3 className="text-gray-800 font-medium text-sm md:text-base hover:text-black transition-colors capitalize">
                                                    {p.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm first-letter:uppercase">{p.shortDescription}</p>
                                                <div className='flex gap-4 mt-2'>
                                                    {p?.discountedPrice != 0 && 
                                                        <>
                                                            <p className="text-gray-600 text-sm font-bold">₹{p?.discountedPrice}</p>
                                                            <p className="text-red-600 line-through text-sm font-bold">₹{p?.mrp}</p>
                                                        </>
                                                    }
                                                    {p?.discountedPrice === 0 && 
                                                        <>
                                                            <p className="text-gray-600 text-sm font-bold">₹{p.mrp}</p>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div>
                                    <span colSpan="7" className="text-center py-6 text-gray-500">
                                        No products found
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </main>
            </div>

            {/* Pagination Controls */}
            {filteredProducts.length > productsPerPage && (
                <div className="flex justify-center items-center gap-3 mt-10 mb-20">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-md border ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-black hover:text-white"}`} >
                        Prev
                    </button>

                    {Array.from({length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`px-4 py-2 rounded-md border ${currentPage === i + 1 ? "bg-black text-white" : "hover:bg-black hover:text-white"}`} >
                            {i + 1}
                        </button>
                    ))}

                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)} className={`px-4 py-2 rounded-md border ${currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? "opacity-50 cursor-not-allowed" : "hover:bg-black hover:text-white"}`} >
                        Next
                    </button>
                </div>
            )}


            {/* Filter Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-xl transform transition-transform duration-500 ease-in-out ${ isFilterOpen ? "translate-x-0" : "translate-x-full" }`} >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-black text-lg font-bold cursor-pointer" >
                        <IoMdClose className="text-2xl" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 overflow-y-auto h-[calc(100vh-130px)] space-y-8">
                    {/* Sort By */}
                    <div>
                        <h3 className="font-semibold mb-3">Sort By</h3>
                        <div className="flex flex-col gap-2 text-sm">
                            <label>
                                <input type="radio" name="sort" className="mr-2 accent-black" onChange={() => setSort("highToLow")} />
                                {" "}
                                Price: High to Low
                            </label>
                            <label>
                                <input type="radio" name="sort" className="mr-2 accent-black" onChange={() => setSort("lowToHigh")} />
                                {" "}
                                Price: Low to High
                            </label>
                            <label>
                                <input type="radio" name="sort" className="mr-2 accent-black" onChange={() => setSort("newest")} />
                                {" "}
                                New Arrivals
                            </label>
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-800">Price Range</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {priceRanges.map((range, index) => (
                                <button key={index} onClick={() => handleRangeClick(range)} className={`border rounded-lg py-2 hover:bg-black hover:text-white transition cursor-pointer ${ selectedRange?.label === range.label ? "bg-black text-white" : "bg-white" }`} >
                                    {range.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="Min" className="w-1/2 border p-2 rounded text-sm" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                            <span>-</span>
                            <input type="number" placeholder="Max" className="w-1/2 border p-2 rounded text-sm" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4 text-gray-700">Size</h3>
                        <div className="flex flex-wrap gap-2">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                            <button key={size} onClick={() => handleSizeClick(size)} className={`border rounded-lg px-4 py-2 text-sm transition cursor-pointer ${ selectedSizes.includes(size) ? "bg-black text-white border-black" : "bg-white text-gray-800 hover:bg-black hover:text-white" }`} >
                                {size}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay (when filter open) */}
            {isFilterOpen && (
                <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 z-20 transition-opacity" ></div>
            )}

            <Footer />
        </div>
    );
}

export default Products;
