import {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    ArrowLeft
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

export default function PlayerRolePage() {

    const navigate = useNavigate();

    const [role, setRole] =
        useState(null);

    const [error, setError] =
        useState("");

    const [revealed, setRevealed] =
        useState(false);

    useEffect(() => {

        loadRole();

        const refreshTimer = window.setInterval(
            loadRole,
            3000
        );

        return () => {
            window.clearInterval(refreshTimer);
        };

    }, []);

    const loadRole =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "playerToken"
                    );

                if (!token) {
                    setError(
                        "Bạn chưa đăng nhập"
                    );
                    return;
                }

                const response =
                    await axios.get(
                        `${
                            import.meta.env
                                .VITE_API_URL
                        }/player-auth/my-role`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                setRole(
                    response.data
                );

            } catch (error) {

                setError(
                    error.response
                        ?.data?.message ||
                    "Không thể tải thẻ"
                );
            }
        };

    if (error) {
        return (
            <div
                className="login-page"
            >
                <div
                    className="login-card"
                >
                    {error}
                    <button
                        className="player-return-button"
                        onClick={navigateToLogin}
                    >
                        <ArrowLeft size={17} />
                        Quay lại đăng nhập
                    </button>
                </div>
            </div>
        );
    }

    if (!role) {
        return (
            <div
                className="login-page"
            >
                Đang nhận thẻ...
            </div>
        );
    }

    return (
        <div className="role-page">

            <button
                className="player-return-button role-return-button"
                onClick={navigateToLogin}
            >
                <ArrowLeft size={17} />
                Quay lại đăng nhập
            </button>

            {!revealed ? (

                <div
                    className="role-card role-back"
                    onClick={() =>
                        setRevealed(true)
                    }
                >
                    <div className="wolf-icon">
                        🐺
                    </div>

                    <h2>
                        WOLVEGHOST
                    </h2>

                    <p>
                        Nhấn để lật thẻ
                    </p>
                </div>

            ) : (

                <div
                    className="role-card role-front"
                >

                    {role.role.imageUrl && (
                        <img
                            src={
                                role.role
                                    .imageUrl
                            }
                            alt={
                                role.role.name
                            }
                        />
                    )}

                    <h1>
                        {role.role.name}
                    </h1>

                    <span
                        className="faction"
                    >
                        {role.role.faction}
                    </span>

                    <p>
                        {
                            role.role
                                .description
                        }
                    </p>

                    <div
                        className="ability"
                    >
                        <strong>
                            Chức năng
                        </strong>

                        <p>
                            {
                                role.role
                                    .ability
                            }
                        </p>

                    </div>

                    <p>
                        Trạng thái:
                        {" "}
                        {
                            role.isAlive
                                ? "🟢 Còn sống"
                                : "💀 Đã chết"
                        }
                    </p>

                </div>

            )}

        </div>
    );

    function navigateToLogin() {
        localStorage.removeItem("playerToken");
        localStorage.removeItem("player");
        navigate("/player-login");
    }
}