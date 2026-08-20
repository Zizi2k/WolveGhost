import {
    useEffect,
    useState
} from "react";

import api from "../../api/axios";

export default function AdminDashboard() {

    const [stats, setStats] = useState({
        hosts: 0,
        characters: 0,
        events: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {

            const [
                hostsResponse,
                charactersResponse,
                eventsResponse,
            ] = await Promise.all([
                api.get("/users/hosts"),
                api.get("/characters"),
                api.get("/events"),
            ]);

            setStats({
                hosts:
                    hostsResponse
                        .data
                        .hosts
                        .length,

                characters:
                    charactersResponse
                        .data
                        .characters
                        .length,

                events:
                    eventsResponse
                        .data
                        .events
                        .length,
            });

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Tổng quan</h1>
                    <p>
                        Quản lý hệ thống WolveGhost
                    </p>
                </div>
            </div>

            <div className="stats-grid">

                <div className="stat-card">
                    <span>Chủ phòng</span>
                    <strong>
                        {stats.hosts}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Nhân vật</span>
                    <strong>
                        {stats.characters}
                    </strong>
                </div>

                <div className="stat-card">
                    <span>Sự kiện</span>
                    <strong>
                        {stats.events}
                    </strong>
                </div>

            </div>

        </div>
    );
}