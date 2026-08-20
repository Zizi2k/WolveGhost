import {
    useEffect,
    useState
} from "react";

import {
    Plus,
    Trash2,
    Pencil
} from "lucide-react";

import api from "../../api/axios";

export default function CharacterManagement() {

    const [characters, setCharacters] =
        useState([]);

     const [editingCharacter, setEditingCharacter] =
    useState(null);
    const [form, setForm] =
        useState({
            name: "",
            faction: "VILLAGER",
            imageUrl: "",
            description: "",
            ability: "",
            wakeOrder: 0,
        });

    const loadCharacters =
        async () => {

            const response =
                await api.get(
                    "/characters"
                );

            setCharacters(
                response
                    .data
                    .characters
            );
        };

    useEffect(() => {
        loadCharacters();
    }, []);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        if (editingCharacter) {

            await api.put(
                `/characters/${editingCharacter.id}`,
                form
            );

            alert(
                "Cập nhật nhân vật thành công"
            );

        } else {

            await api.post(
                "/characters",
                form
            );

            alert(
                "Thêm nhân vật thành công"
            );
        }

        setForm({
            name: "",
            faction: "VILLAGER",
            imageUrl: "",
            description: "",
            ability: "",
            wakeOrder: 0,
        });

        setEditingCharacter(null);

        loadCharacters();

    } catch (error) {

        alert(
            error.response
                ?.data
                ?.message ||
            "Không thể lưu nhân vật"
        );
    }
};

    const deleteCharacter =
        async (id) => {

            if (
                !window.confirm(
                    "Xóa nhân vật này?"
                )
            ) {
                return;
            }

            try {

                await api.delete(
                    `/characters/${id}`
                );

                loadCharacters();

            } catch (error) {

                alert(
                    error.response
                        ?.data
                        ?.message ||
                    "Không thể xóa nhân vật"
                );
            }
        };
        const startEdit = (character) => {

    setEditingCharacter(character);

    setForm({
        name:
            character.name || "",

        faction:
            character.faction || "VILLAGER",

        imageUrl:
            character.imageUrl || "",

        description:
            character.description || "",

        ability:
            character.ability || "",

        wakeOrder:
            character.wakeOrder || 0,
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>
                        Nhân vật
                    </h1>

                    <p>
                        Quản lý toàn bộ lá bài Ma Sói
                    </p>
                </div>
            </div>

            <div className="content-grid">

                <div className="panel">

                   <h2>

    {editingCharacter
        ? (
            <>
                <Pencil size={20} />
                Sửa nhân vật
            </>
        )
        : (
            <>
                <Plus size={20} />
                Thêm nhân vật
            </>
        )}

</h2>

                    <form
                        className="admin-form"
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <label>
                            Tên nhân vật
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
                            Phe
                        </label>

                        <select
                            name="faction"
                            value={
                                form.faction
                            }
                            onChange={
                                handleChange
                            }
                        >
                            <option value="VILLAGER">
                                Dân làng
                            </option>

                            <option value="WEREWOLF">
                                Ma Sói
                            </option>

                            <option value="NEUTRAL">
                                Trung lập
                            </option>
                        </select>

                        <label>
                            URL hình ảnh
                        </label>

                        <input
                            name="imageUrl"
                            value={
                                form.imageUrl
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://..."
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
                            Chức năng
                        </label>

                        <textarea
                            name="ability"
                            value={
                                form.ability
                            }
                            onChange={
                                handleChange
                            }
                        />

                        <label>
                            Thứ tự thức dậy
                        </label>

                        <input
                            type="number"
                            name="wakeOrder"
                            value={
                                form.wakeOrder
                            }
                            onChange={
                                handleChange
                            }
                        />
<button
    className="primary-button"
>
    {editingCharacter
        ? "Cập nhật nhân vật"
        : "Thêm nhân vật"}
</button>
{editingCharacter && (

    <button
        type="button"
        className="cancel-button"
        onClick={() => {

            setEditingCharacter(null);

            setForm({
                name: "",
                faction: "VILLAGER",
                imageUrl: "",
                description: "",
                ability: "",
                wakeOrder: 0,
            });

        }}
    >
        Hủy chỉnh sửa
    </button>

)}

                    </form>

                </div>

                <div className="panel">

                    <h2>
                        Danh sách nhân vật
                    </h2>

                    <div className="character-grid">

                        {characters.map(
                            (character) => (

                                <div
                                    className="character-admin-card"
                                    key={
                                        character.id
                                    }
                                >

                                    {character.imageUrl ? (

                                        <img
                                            src={
                                                character.imageUrl
                                            }
                                            alt={
                                                character.name
                                            }
                                        />

                                    ) : (

                                        <div className="character-placeholder">
                                            🐺
                                        </div>

                                    )}

                                    <div className="character-card-body">

                                        <h3>
                                            {
                                                character.name
                                            }
                                        </h3>

                                        <span className="badge">
                                            {
                                                character.faction
                                            }
                                        </span>

                                        <p>
                                            {
                                                character.description
                                            }
                                        </p>

                                        <strong>
                                            Kỹ năng
                                        </strong>

                                        <p>
                                            {
                                                character.ability
                                            }
                                        </p>

                                        <div className="character-actions">

    <button
        className="edit-button"
        onClick={() =>
            startEdit(
                character
            )
        }
    >
        <Pencil size={17} />
        Sửa
    </button>

    <button
        className="danger-button"
        onClick={() =>
            deleteCharacter(
                character.id
            )
        }
    >
        <Trash2 size={17} />
        Xóa
    </button>

</div>

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