import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response =
                await api.get("/auth/me");

            setUser(
                response.data.user
            );
        } catch (error) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (
        username,
        password
    ) => {
        const response =
            await api.post(
                "/auth/login",
                {
                    username,
                    password,
                }
            );

        const {
            token,
            user,
        } = response.data;

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        setUser(user);

        return user;
    };

    const logout = () => {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}