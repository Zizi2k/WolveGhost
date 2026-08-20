import {
    useEffect,
    useState
} from "react";

import {
    Plus,
    Trash2
} from "lucide-react";

import api from "../../api/axios";

export default function HostManagement() {

    const [hosts, setHosts] =
        useState([]);

    const [name, setName] =
        useState("");

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    useEffect(() => {
        loadHosts();
    }, []);

    const loadHosts = async () => {
        try {
            const response =
                await api.get(
                    "/users/hosts"
                );

            setHosts(
                response.data.hosts
            );

        } catch (error) {
            console.error(error);
        }
    };

    const createHost = async (e) => {

        e.preventDefault();

        setMessage("");

        try {

            await api.post(
                "/users/hosts",
                {
                    name,
                    username,
                    password,
                }
            );

            setName("");
            setUsername("");
            setPassword("");

            setMessage(
                "Tạo chủ phòng thành công"
            );

            loadHosts();

        } catch (error) {

            setMessage(
                error.response
                    ?.data
                    ?.message ||
                "Không thể tạo chủ phòng"
            );
        }
    };

    const deleteHost = async (id) => {

        const ok =
            window.confirm(
                "Bạn có chắc muốn xóa chủ phòng này?"
            );

        if (!ok) return;

        try {

            await api.delete(
                `/users/hosts/${id}`
            );

            loadHosts();

        } catch (error) {
            alert(
                error.response
                    ?.data
                    ?.message ||
                "Không thể xóa"
            );
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        Quản lý Chủ phòng
                    </h1>

                    <p>
                        Tạo và quản lý tài khoản HOST
                    </p>
                </div>

            </div>

            <div className="content-grid">

                <div className="panel">

                    <h2>
                        <Plus size={20} />
                        Tạo Host mới
                    </h2>

                    <form
                        className="admin-form"
                        onSubmit={createHost}
                    >

                        <label>
                            Tên chủ phòng
                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Ví dụ: Nguyễn Văn A"
                        />

                        <label>
                            Username
                        </label>

                        <input
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            placeholder="host02"
                        />

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Tối thiểu 6 ký tự"
                        />

                        <button
                            className="primary-button"
                        >
                            Tạo Host
                        </button>

                    </form>

                    {message && (
                        <p className="form-message">
                            {message}
                        </p>
                    )}

                </div>

                <div className="panel">

                    <h2>
                        Danh sách Host
                    </h2>

                    <div className="table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Username</th>
                                    <th>Quyền</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                {hosts.map(
                                    (host) => (
                                        <tr
                                            key={
                                                host.id
                                            }
                                        >
                                            <td>
                                                {
                                                    host.id
                                                }
                                            </td>

                                            <td>
                                                {
                                                    host.name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    host.username
                                                }
                                            </td>

                                            <td>
                                                {
                                                    host.role
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    className="icon-danger"
                                                    onClick={() =>
                                                        deleteHost(
                                                            host.id
                                                        )
                                                    }
                                                >
                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
}