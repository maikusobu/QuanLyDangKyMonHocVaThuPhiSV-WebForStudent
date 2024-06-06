import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const useAuth = () => {
    const [id, setId] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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
    const handleLoaded = (isLoaded) => {
        setIsLoaded(isLoaded);
    }
    return {id, isLoaded ,handleLoaded};
};

export default useAuth;
