import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { SignupModal } from "../components/signupModal.component";
import { InputField } from "../components/inputField.component";

const APIKEY = import.meta.env.VITE_APIKEY
const AUTHDOMAIN = import.meta.env.VITE_AUTHDOMAIN
const PROJECTID = import.meta.env.VITE_PROJECTID
const STORAGEBUCKET = import.meta.env.VITE_STORAGEBUCKET
const MESSAGINGSENDERID = import.meta.env.VITE_MESSAGINGSENDERID
const APPID = import.meta.env.VITE_APPID
const MEASUREMENTID = import.meta.env.VITE_MEASUREMENTID

const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID
}

const firebase = initializeApp(firebaseConfig)
const auth = getAuth(firebase)

export const Login: React.FC = () => {

    const navigate = useNavigate()

    const [signup, setSignup] = useState<boolean>(false)

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const login = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password)
            console.log(userCred.user)

            const nav = "/gallery"
            navigate(nav)
        } 
        catch(err) {
            console.log(err)
        }
    
    }

    useEffect(() => {
        onAuthStateChanged(auth, (userCred) => {
            if (userCred) {
                navigate("/gallery")
            }
        })
    }, [])

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 title">
                            Login to your Brophie account:
                        </h1>
                    </header>
                </div>
                <div className="h-full justify-center items-center text-center my-5 lg:mx-40 md:mx-20 sm:mx-5 border-r-2">
                    <div className="max-h-[60vh] overflow-y-auto rounded-2xl bg-purple-800/30 backdrop-blur-sm border border-purple-500/50 p-6">
                        <div className="max-w-md mx-auto">
                            <div className="space-y-4">
                                
                                <div>
                                    <InputField
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <InputField
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                    />
                                </div>
                                
                                <button
                                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] mt-4"
                                    onClick={() => {
                                        login()
                                        console.log("Login", { email, password });
                                    }}
                                >
                                    Login
                                </button>
                                
                                <div className="text-center mt-4">
                                    <button
                                        onClick={() => setSignup(true)}
                                        className="text-purple-300 hover:text-white text-sm transition-colors"
                                    >
                                        Don't have an account? Sign up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {signup && (
                <SignupModal 
                    onClose={()=>{setSignup(false)}}
                    auth={auth}
                />
            )}
            
        </>
    )
}