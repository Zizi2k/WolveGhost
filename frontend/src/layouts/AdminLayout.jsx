import {
    Users,
    Shield,
    Sparkles,
    LogOut,
    LayoutDashboard
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../contexts/AuthContext";

export default function AdminLayout() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-shell">

            <aside className="admin-sidebar">

                <div className="admin-brand">
                    <div className="brand-icon">
                        🐺
                    </div>

                    <div>
                        <h2>WolveGhost</h2>
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="admin-menu">

                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        <LayoutDashboard size={20} />
                        Tổng quan
                    </NavLink>

                    <NavLink
                        to="/admin/hosts"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        <Users size={20} />
                        Chủ phòng
                    </NavLink>

                    <NavLink
                        to="/admin/characters"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        <Shield size={20} />
                        Nhân vật
                    </NavLink>

                    <NavLink
                        to="/admin/events"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        <Sparkles size={20} />
                        Sự kiện
                    </NavLink>

                </nav>

                <div className="admin-user-box">

                    <div>
                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            {user?.role}
                        </span>
                    </div>

                    <button onClick={handleLogout}>
                        <LogOut size={18} />
                    </button>

                </div>

            </aside>

            <main className="admin-main">
                <Outlet />
            </main>

        </div>
    );
}