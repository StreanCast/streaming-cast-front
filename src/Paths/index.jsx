import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import NotFound from "../pages/NotFound";
import FileManager from "../pages/FileManagePage";
import LoginPage from "../pages/LoginPage";
import RegisterUserPage from "../pages/RegisterUserPage";
import RegisterStationPage from "../pages/RegisterStationPage";
import AutoDj from "../pages/AutoDjPage";
import AccountConfigPage from "../pages/AccountConfigPage";
import LiveTransmissionPage from "../pages/LiveTransmissionPage";
import PlaylistsPage from "../pages/PlaylistsPage";
import StationConfigPage from "../pages/StationConfigPage";
import ListenersPage from "../pages/ListenersPage";
import Dashboard from "../pages/Dashboard";

const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SiteLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/auto-dj" element={<AutoDj />} />
                    <Route path="/playlists" element={<PlaylistsPage />} />
                    <Route path="/file-manager" element={<FileManager />} />
                    <Route path="/live-transmission" element={<LiveTransmissionPage />} />
                    <Route path="/station-config" element={<StationConfigPage />} />
                    <Route path="/account-config" element={<AccountConfigPage />} />
                </Route>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register-user" element={<RegisterUserPage />} />
                <Route path="/register-station" element={<RegisterStationPage />} />
                <Route path="/:stationId/listeners" element={<ListenersPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;