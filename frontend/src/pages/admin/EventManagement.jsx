import {
    useEffect,
    useState
} from "react";

import {
    Plus,
    Trash2
} from "lucide-react";

import api from "../../api/axios";

export default function EventManagement() {

    const [events, setEvents] =
        useState([]);

    const [form, setForm] =
        useState({
            name: "",
            description: "",
            imageUrl: "",
            probability: 1,
        });

    const loadEvents =
        async () => {

            const response =
                await api.get(
                    "/events"
                );

            setEvents(
                response.data.events
            );
        };

    useEffect(() => {
        loadEvents();
    }, []);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const createEvent =
        async (e) => {

            e.preventDefault();

            try {

                await api.post(
                    "/events",
                    form
                );

                setForm({
                    name: "",
                    description: "",
                    imageUrl: "",
                    probability: 1,
                });

                loadEvents();

            } catch (error) {

                alert(
                    error.response
                        ?.data
                        ?.message ||
                    "Không thể tạo sự kiện"
                );
            }
        };

    const deleteEvent =
        async (id) => {

            if (
                !window.confirm(
                    "Xóa sự kiện này?"
                )
            ) {
                return;
            }

            try {

                await api.delete(
                    `/events/${id}`
                );

                loadEvents();

            } catch (error) {

                alert(
                    "Không thể xóa sự kiện"
                );
            }
        };

    return (
        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>
                        Sự kiện
                    </h1>

                    <p>
                        Quản lý dữ liệu cho vòng quay sự kiện
                    </p>
                </div>

            </div>

            <div className="content-grid">

                <div className="panel">

                    <h2>
                        <Plus size={20} />
                        Thêm sự kiện
                    </h2>

                    <form
                        className="admin-form"
                        onSubmit={
                            createEvent
                        }
                    >

                        <label>
                            Tên sự kiện
                        </label>

                        <input
                            name="name"
                            value={
                                form.name
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <label>
                            Mô tả
                        </label>

                        <textarea
                            name="description"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <label>
                            URL ảnh
                        </label>

                        <input
                            name="imageUrl"
                            value={
                                form.imageUrl
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <label>
                            Trọng số xuất hiện
                        </label>

                        <input
                            type="number"
                            min="1"
                            name="probability"
                            value={
                                form.probability
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <button
                            className="primary-button"
                        >
                            Thêm sự kiện
                        </button>

                    </form>

                </div>

                <div className="panel">

                    <h2>
                        Danh sách sự kiện
                    </h2>

                    <div className="event-list">

                        {events.map(
                            (event) => (

                                <div
                                    className="event-item"
                                    key={
                                        event.id
                                    }
                                >

                                    <div>
                                        <h3>
                                            {
                                                event.name
                                            }
                                        </h3>

                                        <p>
                                            {
                                                event.description
                                            }
                                        </p>

                                        <span>
                                            Trọng số:
                                            {" "}
                                            {
                                                event.probability
                                            }
                                        </span>
                                    </div>

                                    <button
                                        className="icon-danger"
                                        onClick={() =>
                                            deleteEvent(
                                                event.id
                                            )
                                        }
                                    >
                                        <Trash2
                                            size={
                                                18
                                            }
                                        />
                                    </button>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}