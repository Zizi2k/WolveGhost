import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../api/axios";

export default function PlayerLoginPage() {

    const navigate =
        useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            setError("");
            setLoading(true);

            try {

                const response =
                    await api.post(
                        "/player-auth/login",
                        {
                            username,
                            password,
                        }
                    );

                localStorage.setItem(
                    "playerToken",
                    response.data.token
                );

                localStorage.setItem(
                    "player",
                    JSON.stringify(
                        response.data.player
                    )
                );

                navigate(
                    "/player/role"
                );

            } catch (error) {

                setError(
                    error.response
                        ?.data?.message ||
                    "Đăng nhập thất bại"
                );

            } finally {

                setLoading(false);

            }
        };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>
                    🎴 Người chơi
                </h1>

                <p className="subtitle">
                    Đăng nhập để nhận thẻ
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
                        Username
                    </label>

                    <div className="input-group">

                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            placeholder="WG-..."
                        />

                    </div>

                    <label>
                        Password
                    </label>

                    <div className="input-group">

                        <input
                            type="password"
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
                        disabled={loading}
                    >
                        {loading
                            ? "Đang vào phòng..."
                            : "Đăng nhập"}
                    </button>

                </form>

                <div className="player-login-link">

                    <Link to="/login">
                        Quay lại
                    </Link>

                </div>

            </div>

        </div>
    );
}
