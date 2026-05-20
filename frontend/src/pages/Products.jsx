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
import Toast from "./components/Toast";

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
    // changesite
    const category = queryParams.get("category");
    const subcategory = queryParams.get("subcategory")
    const designer = queryParams.get("designer")
    const searchQueryFromURL = queryParams.get("search");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const { userData: currentUser } = useSelector((state) => state.user);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [toast, setToast] = useState(null);

    const priceRanges = [
        { label: "Below ₹15000", min: 0, max: 15000 },
        { label: "₹15000 - ₹30000", min: 15000, max: 30000 },
        { label: "₹30000 - ₹50000", min: 30000, max: 50000 },
        { label: "Above ₹50000", min: 50000, max: 9999999 },
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

    const fetchWishlist = async () => {
        if (!currentUser) return;

        try {
            const res = await axios.get(`${serverUrl}/api/wishlist/${currentUser?._id}`);
            setWishlistItems(res.data.map(p => p._id)); // store ONLY product IDs
        } catch (error) {
            console.error("Wishlist fetch failed:", error);
        }
    };

    useEffect(() => {
        if (currentUser) fetchWishlist();
    }, [currentUser]);

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

    useEffect(() => {
        fetchProducts();
        if (searchQueryFromURL) {
            setSearch(searchQueryFromURL);
        }
        setTimeout(() => setLoaded(true), 150);
    }, [category, subcategory, searchQueryFromURL]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/getProducts/get-products`);
            let allProducts = res.data;

            if (category) {
                allProducts = allProducts.filter(p => p.category === category);
            }
            if (subcategory) {
                allProducts = allProducts.filter(p => p.subcategory === subcategory);
            }
            if (designer) {
                allProducts = allProducts.filter(p => p.designer === designer);
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
            const q = search.toLowerCase().trim();
            result = result.filter((p) => {
                return (
                    p.name.toLowerCase().includes(q) ||
                    p.shortDescription?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q) ||
                    p.subcategory?.toLowerCase().includes(q) ||
                    p.designer?.toLowerCase().includes(q)
                );
            });
        }

        if (minPrice || maxPrice) {
            const min = Number(minPrice) || 0;
            const max = Number(maxPrice) || Infinity;
            result = result.filter((p) => {
                const price = p.discountedPrice === 0 ? p.mrp : p.discountedPrice;
                return price >= min && price <= max;
            });
        }

        else if (selectedRange) {
            const { min, max } = selectedRange;
            result = result.filter((p) => {
                const price = p.discountedPrice === 0 ? p.mrp : p.discountedPrice;
                return price >= min && price <= max;
            });
        }

        if (selectedSizes.length > 0) {
            result = result.filter((p) =>
                selectedSizes.some(
                    (s) => p.size?.toLowerCase() === s.toLowerCase()
                )
            );
        }

        if (sort === "lowToHigh") 
            result.sort((a, b) => {
                const priceA = a.discountedPrice === 0 ? a.mrp : a.discountedPrice;
                const priceB = b.discountedPrice === 0 ? b.mrp : b.discountedPrice;
                return priceA - priceB;
            });

        if (sort === "highToLow")
            result.sort((a, b) => {
                const priceA = a.discountedPrice === 0 ? a.mrp : a.discountedPrice;
                const priceB = b.discountedPrice === 0 ? b.mrp : b.discountedPrice;
                return priceB - priceA;
            });
            
        if (sort === "newest") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        result.sort((a, b) => {
            if ((a.stock === 0) === (b.stock === 0)) return 0;
            return a.stock === 0 ? 1 : -1;
        });

        setFilteredProducts(result);

        setCurrentPage(1);
    }, [products, search, selectedRange, minPrice, maxPrice, sort, selectedSizes]);

    const productsPerPage = 42;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

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
                                    <div className="text-gray-700 flex gap-3 text-xl">
                                        {category && (
                                            <span className="font-semibold cursor-pointer hover:text-black" onClick={() =>navigate(`/products?category=${category}`) }
                                            >
                                                {category}
                                            </span>
                                        )}
                                        {subcategory && (
                                            <>
                                                <FaLongArrowAltRight className="mt-1" />
                                                <span className="cursor-default">{subcategory}</span>
                                            </>
                                        )}
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
                                        <div key={p._id} className="group overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer" >
                                            <div className="relative overflow-hidden">
                                                <img src={imageUrl} alt="Product" className="w-full h-[220px] sm:h-[360px] md:h-[320px] lg:h-[450px] object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" onClick={() => navigate(`/product/${p._id}`)} />

                                                {/* Top left label */}
                                                {p.condition === "New" &&
                                                    <div className="absolute top-2 left-2 bg-black text-lg font-bold shadow-xl text-white px-5 py-1.5 rounded-sm">
                                                        {p.condition}
                                                    </div>
                                                }

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

                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-in-out">
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
                                                                                <FaHeart className={`transition-colors duration-300 ${wishlistItems.includes(p._id) ? "text-red-600" : "text-gray-700"} `} />
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
                                                                        <IoMdCart className="text-gray-700 hover:text-black" onClick={() => handleAddToCart(p)}/>
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
                                <div className="flex items-center justify-center pt-10 pb-40">
                                    <span colSpan="7" className="text-center text-gray-500 text-xl">
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
                <div className="flex justify-center items-center gap-3 mb-20">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-2 rounded-md border cursor-pointer ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-black hover:text-white"}`} >
                        Prev
                    </button>

                    {(() => {
                        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
                        const pages = [];

                        const showPages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];

                        const uniquePages = [...new Set(showPages.filter(p => p >= 1 && p <= totalPages))];

                        let lastPage = 0;

                        uniquePages.forEach(p => {
                            if (p - lastPage > 1) {
                                pages.push(<span key={`dots-${p}`}>...</span>);
                            }

                            pages.push(
                                <button key={p} onClick={() => setCurrentPage(p)} className={`px-2 rounded-md border cursor-pointer ${currentPage === p ? "bg-black text-white" : "hover:bg-black hover:text-white"}`} >
                                    {p}
                                </button>
                            );

                            lastPage = p;
                        });

                        return pages;
                    })()}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProducts.length / productsPerPage)))}
                        disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                        className={`px-2 rounded-md border cursor-pointer ${
                            currentPage === Math.ceil(filteredProducts.length / productsPerPage)
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-black hover:text-white"
                        }`}
                    >
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
}

export default Products;
