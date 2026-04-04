import { InputField } from "./inputField.component"

import { createUserWithEmailAndPassword, type Auth, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupModalProps {
    onClose: () => void,
    auth: Auth
}

export const SignupModal: React.FC<SignupModalProps> = ({
    onClose,
    auth
}) => {

    const navigate = useNavigate()

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const signup = async () => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password)

            await updateProfile(userCred.user, {
                displayName: name
            })

            console.log(userCred.user)

            const nav = "/gallery"
            navigate(nav)
        } 
        catch(err) {
            console.log(err)
        }
    }

    return (
        <div className='fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm transition-opacity duration-200 px-4'>
            <div className='w-full max-w-sm sm:max-w-lg rounded-2xl bg-purple-900 p-6 sm:p-8 shadow-2xl border border-slate-200'>
                <div className="max-h-[60vh] overflow-y-auto rounded-2xl bg-purple-800/30 backdrop-blur-sm border border-purple-500/50 p-6">
                    <div className="max-w-md mx-auto">
                        <div className="space-y-4">
                            
                            <div>
                                <InputField
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Display Name"
                                    required
                                />
                            </div>

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
                                    signup()
                                    console.log("Sign up", { email, password });
                                }}
                            >
                                Sign up
                            </button>
                            <div className='max-h-[60vh] space-y-2 space-x-40 text-right'>
                                <button
                                    className="text-xl px-4 py-2 text-white border-white/20 cursor-pointer rounded-xl border-2 transition-all hover:border-white/60"
                                    onClick={() => {
                                        onClose()
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}