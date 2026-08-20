import {
    LayoutDashboard,
    DoorOpen,
    LogOut
} from "lucide-react";

import {
    NavLink,
    Outlet,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../contexts/AuthContext";

export default function HostLayout() {

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
                        <span>Host Panel</span>
                    </div>
                </div>

                <nav className="admin-menu">

                    <NavLink
                        to="/host"
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
                        to="/host/rooms"
                        className={({ isActive }) =>
                            isActive
                                ? "menu-item active"
                                : "menu-item"
                        }
                    >
                        <DoorOpen size={20} />
                        Phòng chơi
                    </NavLink>

                </nav>

                <div className="admin-user-box">

                    <div>
                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            HOST
                        </span>
                    </div>

                    <button
                        onClick={
                            handleLogout
                        }
                    >
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