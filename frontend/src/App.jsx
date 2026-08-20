import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

// AUTH
import LoginPage from "./pages/LoginPage.jsx";
import PlayerLoginPage from "./pages/PlayerLoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ADMIN
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import HostManagement from "./pages/admin/HostManagement.jsx";
import CharacterManagement from "./pages/admin/CharacterManagement.jsx";
import EventManagement from "./pages/admin/EventManagement.jsx";

// HOST
import HostLayout from "./layouts/HostLayout.jsx";
import HostDashboard from "./pages/host/HostDashboard.jsx";
import RoomManagement from "./pages/host/RoomManagement.jsx";
import RoomDetail from "./pages/host/RoomDetail.jsx";

// PLAYER
import PlayerRolePage from "./pages/player/PlayerRolePage.jsx";

function App() {
    return (
        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/player-login"
                element={<PlayerLoginPage />}
            />

            {/* ================= ADMIN ================= */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    index
                    element={<AdminDashboard />}
                />

                <Route
                    path="hosts"
                    element={<HostManagement />}
                />

                <Route
                    path="characters"
                    element={<CharacterManagement />}
                />

                <Route
                    path="events"
                    element={<EventManagement />}
                />
            </Route>

            {/* ================= HOST ================= */}

            <Route
                path="/host"
                element={
                    <ProtectedRoute allowedRoles={["HOST"]}>
                        <HostLayout />
                    </ProtectedRoute>
                }
            >
                <Route
                    index
                    element={<HostDashboard />}
                />

                <Route
                    path="rooms"
                    element={<RoomManagement />}
                />

                <Route
                    path="rooms/:id"
                    element={<RoomDetail />}
                />
            </Route>

            {/* ================= PLAYER ================= */}

            <Route
                path="/player/role"
                element={<PlayerRolePage />}
            />

            {/* ================= 404 ================= */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>
    );
}

export default App;