
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const SellerLogin = () => {

    const { isSeller, setIsSeller, navigate, axios, setAxiosSellerToken, fetchSeller } = useAppContext()
    const [state, setState] = useState("login")  // "login" ya "register"
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const payload = state === "register" 
                ? { name, email, password } 
                : { email, password }

            const { data } = await axios.post(`/api/seller/${state}`, payload)

            if (data.success) {
                if (data.sellerToken) {
                    localStorage.setItem("sellerToken", data.sellerToken);
                    setAxiosSellerToken();
                }
                setIsSeller(true)
                navigate('/seller')
                toast.success(state === 'login' ? 'Login successful!' : 'Account created successfully!')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Seller error:", error);
            toast.error(error.response?.data?.message || error.message || 'Something went wrong')
        }
    }

    useEffect(() => {
        if (isSeller) {
            navigate("/seller")
        }
    }, [isSeller])

    useEffect(() => {
        fetchSeller();
    }, []);

    return !isSeller && (
        <div className='min-h-screen flex items-center justify-center text-sm text-gray-600 bg-gray-50'>
            <div className='flex flex-col gap-5 items-start p-8 py-12 min-w-80 sm:min-w-96 rounded-lg shadow-xl border border-gray-200 bg-white'>
                <p className='text-2xl font-medium m-auto'>
                    <span className='text-primary'>Seller </span>
                    {state === "login" ? "Login" : "Register"}
                </p>

                <form onSubmit={onSubmitHandler} className='w-full flex flex-col gap-4'>
                    {/* Name field sirf register mein */}
                    {state === "register" && (
                        <div className='w-full'>
                            <p>Name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                type="text"
                                placeholder='Enter your name'
                                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                                required
                            />
                        </div>
                    )}
                    <div className='w-full'>
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder='Enter your email'
                            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                            required
                        />
                    </div>
                    <div className='w-full'>
                        <p>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder='Enter your password'
                            className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                            required
                        />
                    </div>

                    {/* Toggle between login/register */}
                    {state === "register" ? (
                        <p>Already have an account?{" "}
                            <span onClick={() => setState("login")} 
                                className='text-primary cursor-pointer hover:underline'>
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p>New seller?{" "}
                            <span onClick={() => setState("register")} 
                                className='text-primary cursor-pointer hover:underline'>
                                Create account
                            </span>
                        </p>
                    )}

                    <button className='bg-primary text-white w-full py-2 rounded-md cursor-pointer hover:bg-primary-dull transition'>
                        {state === "register" ? "Create Account" : "Login"}
                    </button>
                </form>

                <p className='text-xs text-gray-400 m-auto'>
                    <span onClick={() => navigate('/')} 
                        className='text-primary cursor-pointer hover:underline'>
                        Back to Home
                    </span>
                </p>
            </div>
        </div>
    )
}

export default SellerLogin