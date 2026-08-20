import {
    useEffect,
    useState
} from "react";

import {
    DoorOpen,
    Users,
    Gamepad2
} from "lucide-react";

import api from "../../api/axios";

export default function HostDashboard() {

    const [rooms, setRooms] =
        useState([]);

    useEffect(() => {
        loadRooms();
    }, []);

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

    const totalPlayers =
        rooms.reduce(
            (sum, room) =>
                sum +
                (
                    room._count
                        ?.players || 0
                ),
            0
        );

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        Tổng quan Host
                    </h1>

                    <p>
                        Quản lý các phòng và ván chơi
                    </p>
                </div>

            </div>

            <div className="stats-grid">

                <div className="stat-card">

                    <DoorOpen size={24} />

                    <span>
                        Phòng của tôi
                    </span>

                    <strong>
                        {rooms.length}
                    </strong>

                </div>

                <div className="stat-card">

                    <Users size={24} />

                    <span>
                        Người chơi
                    </span>

                    <strong>
                        {totalPlayers}
                    </strong>

                </div>

                <div className="stat-card">

                    <Gamepad2 size={24} />

                    <span>
                        Ván đã tạo
                    </span>

                    <strong>
                        {
                            rooms.reduce(
                                (
                                    total,
                                    room
                                ) =>
                                    total +
                                    (
                                        room
                                            ._count
                                            ?.games ||
                                        0
                                    ),
                                0
                            )
                        }
                    </strong>

                </div>

            </div>

        </div>
    );
}