import {
    Navigate
} from "react-router-dom";

import {
    useAuth
} from "../contexts/AuthContext";

export default function ProtectedRoute({
    children,
    allowedRoles,
}) {

    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    padding: 40,
                }}
            >
                Đang kiểm tra đăng nhập...
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(
            user.role
        )
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return children;
}