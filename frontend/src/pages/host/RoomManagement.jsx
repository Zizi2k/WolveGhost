import {
    useEffect,
    useState
} from "react";

import {
    Plus,
    DoorOpen,
    Users
} from "lucide-react";

import {
    useNavigate
} from "react-router-dom";

import api from "../../api/axios";

export default function RoomManagement() {

    const navigate =
        useNavigate();

    const [rooms, setRooms] =
        useState([]);

    const [name, setName] =
        useState("");

    const [maxPlayers, setMaxPlayers] =
        useState(8);

    const [message, setMessage] =
        useState("");

    const loadRooms = async () => {

        try {

            const response =
                await api.get(
                    "/rooms"
                );

            setRooms(
                response.data.rooms
            );

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const createRoom =
        async (e) => {

            e.preventDefault();

            setMessage("");

            try {

                await api.post(
                    "/rooms",
                    {
                        name,
                        maxPlayers:
                            Number(
                                maxPlayers
                            ),
                    }
                );

                setName("");
                setMaxPlayers(8);

                setMessage(
                    "Tạo phòng thành công"
                );

                loadRooms();

            } catch (error) {

                setMessage(
                    error.response
                        ?.data
                        ?.message ||
                    "Không thể tạo phòng"
                );
            }
        };

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        Phòng chơi
                    </h1>

                    <p>
                        Tạo và quản lý phòng Ma Sói
                    </p>
                </div>

            </div>

            <div className="content-grid">

                <div className="panel">

                    <h2>
                        <Plus size={20} />
                        Tạo phòng mới
                    </h2>

                    <form
                        className="admin-form"
                        onSubmit={
                            createRoom
                        }
                    >

                        <label>
                            Tên phòng
                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="Ví dụ: Ván tối thứ 7"
                        />

                        <label>
                            Số người tối đa
                        </label>

                        <input
                            type="number"
                            min="4"
                            max="30"
                            value={
                                maxPlayers
                            }
                            onChange={(e) =>
                                setMaxPlayers(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            className="primary-button"
                        >
                            Tạo phòng
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
                        <DoorOpen size={20} />
                        Phòng của tôi
                    </h2>

                    <div className="room-grid">

                        {rooms.map(
                            (room) => (

                                <div
                                    className="room-card"
                                    key={
                                        room.id
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/host/rooms/${room.id}`
                                        )
                                    }
                                >

                                    <div className="room-card-top">

                                        <div>
                                            <h3>
                                                {
                                                    room.name
                                                }
                                            </h3>

                                            <span className="room-code">
                                                {
                                                    room.roomCode
                                                }
                                            </span>
                                        </div>

                                        <span
                                            className={
                                                room.status ===
                                                "WAITING"
                                                    ? "status waiting"
                                                    : room.status ===
                                                      "PLAYING"
                                                    ? "status playing"
                                                    : "status finished"
                                            }
                                        >
                                            {
                                                room.status
                                            }
                                        </span>

                                    </div>

                                    <div className="room-info">

                                        <Users
                                            size={
                                                18
                                            }
                                        />

                                        {
                                            room._count
                                                ?.players ||
                                            0
                                        }

                                        /

                                        {
                                            room.maxPlayers
                                        }

                                        người

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}