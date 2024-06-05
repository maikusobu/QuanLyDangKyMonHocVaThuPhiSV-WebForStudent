import React, { useState } from "react";
import uitLogo from "./assets/uitLogo.svg";
import axiosClient from "./api/axiosClient";
import { useNavigate } from "react-router-dom";

function LoginComponent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axiosClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      if (!response.data) {
        throw new Error("Login failed");
      }
      const data = response.data;
      localStorage.setItem("token", data.access_token);
      navigate("/");
      setAuthError(false);
    } catch (error) {
      setAuthError(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setAuthError(false); // Clear the error message when any input changes
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen gap-[30px]">
      <h1 className="text-[22px] font-bold mb-8 uppercase text-center flex flex-col">
        <span>Cổng thông tin </span>
        <span>cho sinh viên</span>
      </h1>
      <div className="card border shadow-xl w-[512px] h-[420px]">
        <div className="card-body flex flex-col items-center">
          <div className="w-full flex justify-center">
            <img src={uitLogo} alt="UIT Logo" className="w-[200px] h-[200px]" />
          </div>
          <form onSubmit={login} className="card-body flex flex-col gap-[13px]  w-full ">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="input input-bordered input-md w-full max-w-xs  mx-auto"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              className="input input-bordered input-md w-full max-w-xs mx-auto"
            />

            <button
              type="submit"
              className="btn btn-wide bg-secondary-400 text-base-white hover:bg-light-font-color p-4 w-1/2 mx-auto rounded-lg"
            >
              Đăng nhập
            </button>
          </form>
          { authError && (
              <div className="text-[15px] font-light text-error-color -my-[5px]">
                Thông tin đăng nhập không hợp lệ, vui lòng thử lại:
              </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default LoginComponent;
