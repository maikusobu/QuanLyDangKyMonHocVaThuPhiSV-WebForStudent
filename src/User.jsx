import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "./api/axiosClient.js";

const User = ({ id }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    console.log(id);
    console.log(user);
    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {

            try {
                const response = await axiosClient.get(`/student/${id}`);
                if (isMounted) {
                    setUser(response.data);
                }
            } catch (error) {
              navigate("/login")
            }
        };
        fetchUser().then(r => console.log("done"));
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6  absolute top-0 right-1/2">
            <h1 className="text-2xl font-bold mb-4 text-center">Thông tin sinh viên</h1>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Họ và tên:</strong> {user.name}</p>
            <p><strong>Ngành học:</strong> {user.major.name}</p>
            <p><strong>Số tiền còn học:</strong> <span> 0đ</span></p>
        </div>
    );
};

export default User;
