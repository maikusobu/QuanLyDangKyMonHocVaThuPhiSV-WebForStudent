import React, { useState } from 'react';
import uitLogo from '../../assets/images/uitLogo.svg';
import axiosClient from '../../api/axiosClient'; // Assuming axiosClient is properly imported
import { useHistory } from 'react-router-dom';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);
    const history = useHistory();

    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosClient.post('/auth/login', {
                email,
                password,
            });
            if (!response.data) {
                throw new Error('Login failed');
            }
            const data = response.data;
            window.electron.store.set('token', data.access_token);
            history.push('/');
            console.log('Login successful', data);
            setAuthError(false);
        } catch (error) {
            setAuthError(true);
        }
    };

    return (
        <main className="flex flex-col justify-center items-center h-screen w-screen gap-[30px]">
            <h1 className="text-[22px] font-bold mb-8 uppercase text-center flex flex-col">
                <span>Hệ thống quản lý học phí và</span>
                <span>đăng ký học phần</span>
            </h1>
            <div className="card border shadow-xl w-[512px] h-[420px]">
                <div className="card-body flex flex-col items-center">
                    <div className="w-full flex justify-center">
                        <img src={uitLogo} alt="UIT Logo" className="w-[100px] h-[100px]" />
                    </div>
                    <form onSubmit={login} className="card-body flex flex-col gap-[13px]">
                        <input
                            type="text"
                            placeholder="Email"
                            className="input input-bordered input-md w-full max-w-xs"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered input-md w-full max-w-xs"
                        />
                        {authError && (
                            <div className="text-[9px] font-light text-red-600 -my-[5px]">
                                Thông tin đăng nhập không hợp lệ, vui lòng thử lại:
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn btn-wide bg-secondary-400 text-base-white hover:bg-secondary-300"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default LoginComponent;
