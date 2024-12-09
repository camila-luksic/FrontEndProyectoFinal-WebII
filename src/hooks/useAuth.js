import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useAuth = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/');
        } else {
            axios.get('http://localhost:3025/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(res => setUser(res.data))
            .catch(() => {
                localStorage.removeItem('token');
                navigate('/');
            });
        }
    }, [token, navigate]);

    return user;
};
