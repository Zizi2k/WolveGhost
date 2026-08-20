import {
    useState
} from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import {
    Moon,
    User,
    Lock,
    LogIn
} from "lucide-react";

import {
    useAuth
} from "../contexts/AuthContext";

export default function LoginPage() {

    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");
            setLoading(true);

            try {

                const user =
                    await login(
                        username,
                        password
                    );

                if (
                    user.role === "ADMIN"
                ) {
                    navigate(
                        "/admin"
                    );
                } else if (
                    user.role === "HOST"
                ) {
                    navigate(
                        "/host"
                    );
                }

            } catch (error) {

                setError(
                    error.response?.data
                        ?.message ||
                    "Đăng nhập thất bại"
                );

            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="logo-circle">
                    <Moon size={34} />
                </div>

                <h1>
                    WolveGhost
                </h1>

                <p className="subtitle">
                    Quản lý trò chơi Ma Sói
                </p>

                {error && (
                    <div className="error-box">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <label>
                        Tên đăng nhập
                    </label>

                    <div className="input-group">

                        <User size={19} />

                        <input
                            type="text"
                            placeholder="admin hoặc host01"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <label>
                        Mật khẩu
                    </label>

                    <div className="input-group">

                        <Lock size={19} />

                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >

                        <LogIn size={19} />

                        {loading
                            ? "Đang đăng nhập..."
                            : "Đăng nhập"}

                    </button>

                </form>

                <div className="player-login-link">

                    Bạn là người chơi?

                    <Link
                        to="/player-login"
                    >
                        Đăng nhập Player
                    </Link>

                </div>

            </div>

        </div>
    );
}