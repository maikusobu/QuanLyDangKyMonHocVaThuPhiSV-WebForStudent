import { useLayoutEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const useAuth = () => {
    const [id, setId] = useState('');
    const navigate = useNavigate();

    useLayoutEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const decodedToken = jwtDecode(token);
            setId(decodedToken.id);
        } catch (error) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    return id;
};

export default useAuth;
