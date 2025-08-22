
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
console.log(axios.defaults.baseURL);

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    
    const setAxiosToken = () => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }

   
    const setAxiosSellerToken = () => {
        const sellerToken = localStorage.getItem("sellerToken");
        if (sellerToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${sellerToken}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    //fetch seller status
    const fetchSeller = async ()=>{
        try {
            setAxiosSellerToken();
            const {data} = await axios.get('/api/seller/is-auth');
            console.log("fetchSeller response:", data);
            if(data.success){
                setIsSeller(true)
            }else{
                setIsSeller(false)
                
                localStorage.removeItem("sellerToken");
            }
        } catch (error) {
            console.log("fetchSeller error:", error);
            setIsSeller(false)
            localStorage.removeItem("sellerToken");
        }
    }

    // fetch user auth status, user data and cart data
    const fetchUser = async ()=>{
        try {
            setAxiosToken();
            const {data} = await axios.get('/api/user/is-auth');
            console.log("fetchUser response:", data);
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems || {})
            }
        } catch (error) {
            console.log("fetchUser error:", error);
            setUser(null)
           
            localStorage.removeItem("token");
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    // fetch all products
    const fetchProducts = async ()=>{
      try {
        const { data } = await axios.get('/api/product/list')
        if(data.success){
            setProducts(data.products)
        }else{
            toast.error(data.message)
        }
      } catch (error) {
            toast.error(error.message)
        
      }
    }

    // add product to cart
    const addToCart = (itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to cart")
    }

    // update cart item quantity
    const updateCartItem = (itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("Cart Updated")
    }

    //Remove product from cart
    const removeFromCart = (itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] == 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from Cart")
        setCartItems(cartData)
    }

    // to get cart item count
    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    // to get cart total amount
    const getCartAmount = ()=>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100)/100;
    }

   
    useEffect(()=>{
        setAxiosToken();
        fetchSeller()
        fetchProducts()
        fetchUser()
    },[])
  
    // update database cart items
    useEffect(()=>{
     const updateCart =async () => {
        try {
            setAxiosToken();
            const {data} = await axios.post('/api/cart/update', {cartItems})
            if(!data.success){
                toast.error(data.message)
            }
        } catch (error) {
                toast.error(error.message)
            
        }
     }
     if(user){
        updateCart()
     }
    },[cartItems])

    const value = { 
        navigate, 
        user, 
        setUser, 
        setIsSeller, 
        isSeller, 
        showUserLogin, 
        setShowUserLogin, 
        products, 
        currency, 
        addToCart, 
        removeFromCart, 
        cartItems, 
        searchQuery, 
        setSearchQuery, 
        getCartAmount, 
        getCartCount, 
        updateCartItem, 
        axios, 
        fetchProducts, 
        setCartItems,
        setAxiosToken, 
        setAxiosSellerToken,
        fetchSeller
    }

    return (<AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

export const useAppContext = () =>{
    return useContext(AppContext)
}
