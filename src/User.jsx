import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "./api/axiosClient.js";

const User = ({ user }) => {
    if (!user) {
        return <div>Đang tải...</div>;
    }
    console.log(user);
    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 absolute top-0 right-1/2">
            <h1 className="text-2xl font-bold mb-4 text-center">Thông tin sinh viên</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Họ và tên:</strong> {user.name}</p>
            <p><strong>Ngành học:</strong> {user.major.name}</p>
            {user.tuition && (
                <p>
                    <strong>Số tiền còn nợ trong học kì này:</strong> <span>{user.tuition.totalActual - user.tuition.totalPaid}Đ</span>
                </p>
            )}
            {!user.tuition &&
            <p>
                <strong>Không có thông tin học phí</strong>
            </p>
            }
        </div>
    );
};

export default User;
