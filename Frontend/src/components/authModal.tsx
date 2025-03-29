import { useState } from "react";

import { AuthReqDto, OpenModal, UserDto } from "@/common/entity";
import { signIn, signUp } from "@/common/apis";

type AuthModalProps = {
    setUser: React.Dispatch<React.SetStateAction<UserDto | null>>
    setOpenModal: React.Dispatch<React.SetStateAction<OpenModal>>
};

export default function (props: AuthModalProps) {
    const { setUser, setOpenModal } = props

    const [formData, setFormData] = useState<AuthReqDto>({
        username: '',
        password: ''
    })

    const handleSubmit = async (type: string) => {
        let resUser: UserDto | null = null
        if(type === 'signin') resUser = await signIn(formData)
        if(type === 'signup') resUser = await signUp(formData)

        setUser(resUser)
        setFormData({ username: '', password: '' })
        setOpenModal(prev => ({ ...prev, authModal: false }))
    }

    return (
        <div className="text-black fixed inset-0 flex items-center justify-center">
            <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
                <button 
                    type="button"
                    onClick={() => setOpenModal(prev => ({ ...prev, authModal: false }))}
                    className="absolute top-2 right-2 text-xl cursor-pointer"
                >
                ✖
                </button>

                <h2 className="text-2xl font-bold text-center mb-4">Welcome</h2>

                {/* Username */}
                <input
                type="text"
                name="username"
                placeholder="Username"
                required
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full p-2 border rounded my-2"
                />

                {/* Password */}
                <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-2 border rounded my-2"
                />

                {/* Sign Up & Sign In */}
                <div className="flex items-center justify-between mt-4 w-3/4 mx-auto">
                <button
                    type='button'
                    onClick={() => handleSubmit('signin')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                >
                    Sign In
                </button>

                <span className="text-gray-500">or</span>

                <button
                    type='button'
                    onClick={() => handleSubmit('signup')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                >
                    Sign Up
                </button>
                </div>
            </div>
        </div>
    );
};

