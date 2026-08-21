import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import {
    ArrowLeft,
    Plus,
    Trash2,
    Copy,
    Users,
    Minus,
    Play,
    RotateCcw
    ,KeyRound,
    Skull,
    UserRound
} from "lucide-react";

import api from "../../api/axios";

export default function RoomDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [room, setRoom] =
        useState(null);

    const [characters, setCharacters] =
        useState([]);

    const [selectedCharacters, setSelectedCharacters] =
        useState({});

    const [displayName, setDisplayName] =
        useState("");

    const [credentials, setCredentials] =
        useState(null);

    const [error, setError] =
        useState("");

    const [gameMessage, setGameMessage] =
        useState("");

    const [loadingGame, setLoadingGame] =
        useState(false);

    const [deadPlayerIds, setDeadPlayerIds] =
        useState([]);

    const [selectedNight, setSelectedNight] =
        useState(1);

    const [nightDeaths, setNightDeaths] =
        useState({});

    const [nightEvents, setNightEvents] =
        useState({});

    const [loadingEvent, setLoadingEvent] =
        useState(false);

    const [loadingFinish, setLoadingFinish] =
        useState(false);

    const getDeathsThroughNight = (
        deaths,
        night
    ) => {
        return [
            ...new Set(
                Object.entries(deaths)
                    .filter(([deathNight]) =>
                        Number(deathNight) <= night
                    )
                    .flatMap(([, playerIds]) => playerIds)
            ),
        ];
    };

    const loadRoom = async () => {
        try {
            const response =
                await api.get(
                    `/rooms/${id}`
                );

            const loadedRoom = response.data.room;

            setRoom(loadedRoom);

            const activeGame = loadedRoom.games?.[0];

            const loadedNightDeaths = {};
            const loadedNightEvents = {};
            activeGame?.gameNights?.forEach((death) => {
                loadedNightDeaths[death.night] = [
                    ...(loadedNightDeaths[death.night] || []),
                    death.playerId,
                ];
            });
            activeGame?.gameEvents?.forEach((gameEvent) => {
                loadedNightEvents[gameEvent.round] = gameEvent.event;
            });

            setNightDeaths(loadedNightDeaths);
            setNightEvents(loadedNightEvents);
            setDeadPlayerIds(
                getDeathsThroughNight(
                    loadedNightDeaths,
                    selectedNight
                )
            );

        } catch (error) {
            setError(
                error.response
                    ?.data
                    ?.message ||
                "Không thể tải phòng"
            );
        }
    };

    const loadCharacters = async () => {
        try {
            const response =
                await api.get(
                    "/characters"
                );

            setCharacters(
                response.data.characters
                    .filter(
                        (character) =>
                            character.isActive
                    )
            );

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadRoom();
        loadCharacters();
    }, [id]);

    const totalCards =
        useMemo(() => {
            return Object.values(
                selectedCharacters
            ).reduce(
                (sum, quantity) =>
                    sum + quantity,
                0
            );
        }, [selectedCharacters]);

    const playerCount =
        room?.players?.length || 0;

    const changeQuantity = (
        characterId,
        change
    ) => {

        setSelectedCharacters(
            (current) => {

                const oldQuantity =
                    current[
                        characterId
                    ] || 0;

                const newQuantity =
                    Math.max(
                        0,
                        oldQuantity + change
                    );

                return {
                    ...current,
                    [characterId]:
                        newQuantity,
                };
            }
        );
    };

    const addPlayer =
        async (e) => {

            e.preventDefault();

            setError("");
            setCredentials(null);

            try {

                const response =
                    await api.post(
    `/rooms/${id}/players`,
    {
        displayName,
        password:
            playerPassword.trim()
                ? playerPassword
                : undefined,
    }
);

                setCredentials(
                    response
                        .data
                        .credentials
                );

                setDisplayName("");
                setPlayerPassword("");
                
                loadRoom();

            } catch (error) {

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Không thể thêm người chơi"
                );
            }
        };
        const [playerPassword, setPlayerPassword] =
    useState("");

    const deletePlayer =
        async (playerId) => {

            if (
                !window.confirm(
                    "Xóa người chơi này?"
                )
            ) {
                return;
            }

            try {

                await api.delete(
                    `/rooms/${id}/players/${playerId}`
                );

                loadRoom();

            } catch (error) {

                alert(
                    error.response
                        ?.data
                        ?.message ||
                    "Không thể xóa người chơi"
                );
            }
        };

    const resetPassword =
        async (playerId) => {

            try {

                const response =
                    await api.post(
                        `/rooms/${id}/players/${playerId}/reset-password`
                    );

                setCredentials(
                    response
                        .data
                        .credentials
                );

            } catch (error) {

                alert(
                    error.response
                        ?.data
                        ?.message ||
                    "Không thể reset mật khẩu"
                );
            }
        };
        const changePlayerPassword = async (
    playerId,
    playerName
) => {

    const newPassword = window.prompt(
        `Nhập mật khẩu mới cho ${playerName}:`
    );

    if (newPassword === null) {
        return;
    }

    if (newPassword.trim().length < 4) {
        alert(
            "Mật khẩu phải có ít nhất 4 ký tự"
        );
        return;
    }

    try {

        await api.put(
            `/rooms/${id}/players/${playerId}/password`,
            {
                password:
                    newPassword.trim(),
            }
        );

        alert(
            `Đổi mật khẩu cho ${playerName} thành công`
        );

    } catch (error) {

        alert(
            error.response
                ?.data
                ?.message ||
            "Không thể đổi mật khẩu"
        );
    }
};

    const changePlayerUsername = async (
        playerId,
        currentUsername
    ) => {
        const newUsername = window.prompt(
            "Nhập username mới:",
            currentUsername
        );

        if (newUsername === null) {
            return;
        }

        try {
            await api.put(
                `/rooms/${id}/players/${playerId}/username`,
                {
                    username: newUsername.trim(),
                }
            );

            await loadRoom();
            alert("Đổi username thành công");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Không thể đổi username"
            );
        }
    };

    const copyText =
        async (text) => {

            await navigator
                .clipboard
                .writeText(text);
        };

    const createAndDealGame =
        async () => {

            setGameMessage("");
            setLoadingGame(true);

            try {

                const characterPayload =
                    Object.entries(
                        selectedCharacters
                    )
                        .filter(
                            ([, quantity]) =>
                                quantity > 0
                        )
                        .map(
                            ([
                                characterId,
                                quantity
                            ]) => ({
                                characterId:
                                    Number(
                                        characterId
                                    ),
                                quantity,
                            })
                        );

                const createGameResponse =
                    await api.post(
                        `/rooms/${id}/games`,
                        {
                            characters:
                                characterPayload,
                        }
                    );

                const gameId =
                    createGameResponse
                        .data
                        .game
                        .id;

                await api.post(
                    `/games/${gameId}/deal`
                );

                setGameMessage(
                    "🎴 Đã phát thẻ thành công!"
                );

                loadRoom();

            } catch (error) {

                setGameMessage(
                    error.response
                        ?.data
                        ?.message ||
                    "Không thể phát bài"
                );

            } finally {
                setLoadingGame(false);
            }
        };

        const drawNightEvent = async () => {
            const currentGame = room.games?.[0];

            if (!currentGame) {
                return;
            }

            setLoadingEvent(true);
            setGameMessage("");

            try {
                const response = await api.post(
                    `/games/${currentGame.id}/events/random`,
                    {
                        night: selectedNight,
                    }
                );

                setNightEvents((current) => ({
                    ...current,
                    [selectedNight]: response.data.event,
                }));
            } catch (error) {
                setGameMessage(
                    error.response?.data?.message ||
                    "Không thể bốc sự kiện"
                );
            } finally {
                setLoadingEvent(false);
            }
        };

        const toggleDeadPlayer = async (playerId) => {
            const currentGame = room.games?.[0];
            const previousNightDeaths = nightDeaths;
            const currentNightDeaths = nightDeaths[selectedNight] || [];
            let nextDeadPlayerIds;

            if (currentNightDeaths.includes(playerId)) {
                nextDeadPlayerIds = currentNightDeaths.filter(
                    (id) => id !== playerId
                );
            } else {
                nextDeadPlayerIds = [
                    ...currentNightDeaths,
                    playerId,
                ];
            }

            setDeadPlayerIds(
                getDeathsThroughNight(
                    {
                        ...nightDeaths,
                        [selectedNight]: nextDeadPlayerIds,
                    },
                    selectedNight
                )
            );
            setNightDeaths((current) => ({
                ...current,
                [selectedNight]: nextDeadPlayerIds,
            }));

            try {
                await api.put(
                    `/games/${currentGame.id}/deaths`,
                    {
                        deadPlayerIds: nextDeadPlayerIds,
                        night: selectedNight,
                    }
                );
            } catch (error) {
                setDeadPlayerIds(
                    getDeathsThroughNight(
                        previousNightDeaths,
                        selectedNight
                    )
                );
                setNightDeaths(previousNightDeaths);
                setGameMessage(
                    error.response?.data?.message ||
                    "Không thể cập nhật trạng thái thẻ"
                );
            }
        };

        const finishCurrentGame = async () => {
            const currentGame = room.games?.[0];

            if (!currentGame) {
                return;
            }

            if (!window.confirm("Kết thúc ván đấu và lưu các thẻ đã chết?")) {
                return;
            }

            setLoadingFinish(true);
            setGameMessage("");

            try {
                await api.post(
                    `/games/${currentGame.id}/finish`,
                    {
                        deadPlayerIds: [
                            ...new Set(
                                Object.values(nightDeaths).flat()
                            ),
                        ],
                    }
                );

                setGameMessage("Đã kết thúc ván đấu và lưu thẻ đã chết.");
                setSelectedCharacters({});
                await loadRoom();
            } catch (error) {
                setGameMessage(
                    error.response?.data?.message ||
                    "Không thể kết thúc ván chơi"
                );
            } finally {
                setLoadingFinish(false);
            }
        };

    if (error && !room) {
        return (
            <div className="page-container">
                {error}
            </div>
        );
    }

    if (!room) {
        return (
            <div className="page-container">
                Đang tải phòng...
            </div>
        );
    }

    return (
        <div className="page-container">

            <button
                className="back-button"
                onClick={() =>
                    navigate(
                        "/host/rooms"
                    )
                }
            >
                <ArrowLeft size={18} />
                Quay lại
            </button>

            <div className="page-header">

                <div>
                    <h1>
                        {room.name}
                    </h1>

                    <p>
                        Mã phòng:
                        {" "}
                        <strong>
                            {room.roomCode}
                        </strong>
                    </p>
                </div>

                <span
                    className={`status ${room.status.toLowerCase()}`}
                >
                    {room.status}
                </span>

            </div>

            <div className="room-detail-grid">

                <div className="panel">

                    <h2>
                        <Plus size={20} />
                        Thêm người chơi
                    </h2>

                    <form
                        className="admin-form"
                        onSubmit={
                            addPlayer
                        }
                    >

                        <label>
                            Tên người chơi
                        </label>
<label>
    Mật khẩu Player
</label>

<input
    type="text"
    value={playerPassword}
    onChange={(e) =>
        setPlayerPassword(
            e.target.value
        )
    }
    placeholder="Nhập mật khẩu hoặc để trống để random"
/>

<small
    style={{
        color: "#7f8798",
    }}
>
    Để trống nếu muốn hệ thống tạo tự động.
</small>
                        <input
                            value={
                                displayName
                            }
                            onChange={(e) =>
                                setDisplayName(
                                    e.target.value
                                )
                            }
                            placeholder="Ví dụ: Duy"
                        />

                        <button
                            className="primary-button"
                            disabled={
                                room.status !==
                                    "WAITING" &&
                                room.status !==
                                    "FINISHED" ||
                                room.players
                                    .length >=
                                    room.maxPlayers
                            }
                        >
                            Thêm Player
                        </button>

                    </form>

                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}

                    {credentials && (

                        <div className="credential-box">

                            <h3>
                                Tài khoản Player
                            </h3>

                            <div className="credential-row">

                                <div>
                                    <span>
                                        Username
                                    </span>

                                    <strong>
                                        {
                                            credentials.username
                                        }
                                    </strong>
                                </div>

                                <button
                                    onClick={() =>
                                        copyText(
                                            credentials.username
                                        )
                                    }
                                >
                                    <Copy size={17} />
                                </button>

                            </div>

                            <div className="credential-row">

                                <div>
                                    <span>
                                        Password
                                    </span>

                                    <strong>
                                        {
                                            credentials.password
                                        }
                                    </strong>
                                </div>

                                <button
                                    onClick={() =>
                                        copyText(
                                            credentials.password
                                        )
                                    }
                                >
                                    <Copy size={17} />
                                </button>

                            </div>

                        </div>
                    )}

                </div>

                <div className="panel">

                    <h2>
                        <Users size={20} />

                        Người chơi

                        {" "}

                        {playerCount}

                        /

                        {room.maxPlayers}
                    </h2>

                    <div className="player-list">

                        {room.players.map(
                            (
                                player,
                                index
                            ) => (

                                <div
                                    className={`player-row${
                                        deadPlayerIds.includes(player.id)
                                            ? " dead"
                                            : ""
                                    }`}
                                    key={
                                        player.id
                                    }
                                >

                                    <div className="player-number">
                                        {
                                            index + 1
                                        }
                                    </div>

                                    <div className="player-info">

                                        <strong>
                                            {
                                                player.displayName
                                            }
                                        </strong>

                                        <span>
                                            {
                                                player.username
                                            }
                                        </span>

                                    </div>

                                   <button
    className="password-button"
    onClick={() =>
        changePlayerPassword(
            player.id,
            player.displayName
        )
    }
>
    <KeyRound size={15} />
    Đổi MK
</button>

<button
    className="small-button"
    onClick={() =>
        changePlayerUsername(
            player.id,
            player.username
        )
    }
>
    <UserRound size={15} />
    Đổi username
</button>

<button
    className="small-button"
    onClick={() =>
        resetPassword(
            player.id
        )
    }
>
    <RotateCcw size={15} />
    Reset
</button>

<button
    className="icon-danger"
    onClick={() =>
        deletePlayer(
            player.id
        )
    }
>
    <Trash2 size={17} />
</button>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </div>

            <div className="panel deck-panel">

                <div className="deck-header">

                    <div>
                        <h2>
                            🎴 Bộ bài cho ván này
                        </h2>

                        <p>
                            Chọn số lượng từng nhân vật
                        </p>
                    </div>

                    <div className="deck-counter">

                        <strong>
                            {totalCards}
                        </strong>

                        /

                        <strong>
                            {playerCount}
                        </strong>

                        lá

                    </div>

                </div>

                <div className="deck-grid">

                    {characters.map(
                        (character) => {

                            const quantity =
                                selectedCharacters[
                                    character.id
                                ] || 0;

                            return (

                                <div
                                    className="deck-character-card"
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

                                        <div className="deck-character-placeholder">
                                            🐺
                                        </div>

                                    )}

                                    <div className="deck-character-content">

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

                                        <div className="quantity-control">

                                            <button
                                                onClick={() =>
                                                    changeQuantity(
                                                        character.id,
                                                        -1
                                                    )
                                                }
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <strong>
                                                {
                                                    quantity
                                                }
                                            </strong>

                                            <button
                                                onClick={() =>
                                                    changeQuantity(
                                                        character.id,
                                                        1
                                                    )
                                                }
                                            >
                                                <Plus size={16} />
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

                <div className="deal-section">

                    <div>

                        {totalCards <
                            playerCount && (
                            <span className="deal-warning">
                                Thiếu{" "}
                                {
                                    playerCount -
                                    totalCards
                                }{" "}
                                lá
                            </span>
                        )}

                        {totalCards >
                            playerCount && (
                            <span className="deal-warning">
                                Dư{" "}
                                {
                                    totalCards -
                                    playerCount
                                }{" "}
                                lá
                            </span>
                        )}

                        {totalCards ===
                            playerCount &&
                            playerCount >=
                                4 && (
                            <span className="deal-success">
                                ✓ Bộ bài hợp lệ
                            </span>
                        )}

                    </div>

                    <button
                        className="deal-button"
                        onClick={
                            createAndDealGame
                        }
                        disabled={
                            loadingGame ||
                            totalCards !==
                                playerCount ||
                            playerCount <
                                4 ||
                            (
                                room.status !==
                                    "WAITING" &&
                                room.status !==
                                    "FINISHED"
                            )
                        }
                    >
                        <Play size={20} />

                        {loadingGame
                            ? "Đang phát thẻ..."
                            : "Tạo ván & Phát thẻ"}
                    </button>

                </div>

                {gameMessage && (
                    <div className="game-message">
                        {gameMessage}
                    </div>
                )}

            </div>

            {room.games?.[0]?.isActive &&
                room.games[0].gamePlayers?.length > 0 && (
                <div className="panel alive-panel">

                    <div className="deck-header">
                        <div>
                            <h2>
                                <Skull size={20} />
                                Thẻ bài trong ván
                            </h2>

                            <p>
                                Chọn những thẻ đã chết trước khi kết thúc ván
                            </p>
                        </div>

                        <strong>
                            {deadPlayerIds.length} thẻ đã chết
                        </strong>
                    </div>

                    <div className="dead-card-list">
                        {room.games[0].gamePlayers.map((gamePlayer) => {
                            const isDead = deadPlayerIds.includes(
                                gamePlayer.playerId
                            );
                            const diedEarlier = Object.entries(nightDeaths)
                                .some(([night, playerIds]) =>
                                    Number(night) < selectedNight &&
                                    playerIds.includes(gamePlayer.playerId)
                                );

                            return (
                                <label
                                    className={`dead-card-option${
                                        isDead ? " selected" : ""
                                    }`}
                                    key={gamePlayer.id}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isDead}
                                        disabled={diedEarlier}
                                        onChange={() =>
                                            toggleDeadPlayer(
                                                gamePlayer.playerId
                                            )
                                        }
                                    />

                                    <span>
                                        <strong>
                                            {gamePlayer.character.name}
                                        </strong>
                                        <small>
                                            {gamePlayer.player.displayName}
                                        </small>
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    <div className="night-list" aria-label="Chọn đêm">
                        {Array.from({ length: 10 }, (_, index) => index + 1).map(
                            (night) => (
                                <button
                                    className={`night-button${selectedNight === night ? " active" : ""}`}
                                    key={night}
                                    onClick={() => {
                                        setSelectedNight(night);
                                        setDeadPlayerIds(
                                            getDeathsThroughNight(
                                                nightDeaths,
                                                night
                                            )
                                        );
                                    }}
                                >
                                    Đêm {night}
                                    {(nightDeaths[night]?.length || 0) > 0 && (
                                        <small>{nightDeaths[night].length} chết</small>
                                    )}
                                </button>
                            )
                        )}
                    </div>

                    <div className="night-event-box">
                        <div>
                            <strong>Sự kiện đêm {selectedNight}</strong>
                            {nightEvents[selectedNight] ? (
                                <>
                                    <h3>{nightEvents[selectedNight].name}</h3>
                                    <p>{nightEvents[selectedNight].description}</p>
                                </>
                            ) : (
                                <p>Chưa bốc sự kiện cho đêm này.</p>
                            )}
                        </div>

                        <button
                            className="small-button"
                            onClick={drawNightEvent}
                            disabled={loadingEvent || Boolean(nightEvents[selectedNight])}
                        >
                            {loadingEvent
                                ? "Đang bốc..."
                                : nightEvents[selectedNight]
                                ? "Đã bốc"
                                : "Bốc sự kiện"}
                        </button>
                    </div>

                    <button
                        className="finish-button"
                        onClick={finishCurrentGame}
                        disabled={loadingFinish}
                    >
                        <Skull size={18} />
                        {loadingFinish
                            ? "Đang kết thúc..."
                            : "Kết thúc ván đấu"}
                    </button>
                </div>
            )}

        </div>
    );
}