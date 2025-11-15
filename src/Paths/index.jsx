import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import FileManager from "../pages/FileManagePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AutoDj from "../pages/AutoDjPage";
import AccountConfigPage from "../pages/AccountConfigPage";
import LiveTransmissionPage from "../pages/LiveTransmissionPage";
import PlaylistsPage from "../pages/PlaylistsPage";
import StationConfigPage from "../pages/StationConfigPage";

const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SiteLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/auto-dj" element={<SiteLayout />}>
                    <Route index element={<AutoDj />} />
                </Route>
                <Route path="/playlists" element={<SiteLayout />}>
                    <Route index element={<PlaylistsPage />} />
                </Route>
                <Route path="/file-manager" element={<SiteLayout />}>
                    <Route index element={<FileManager />} />
                </Route>
                <Route path="/live-transmission" element={<SiteLayout />}>
                    <Route index element={<LiveTransmissionPage />} />
                </Route>
                <Route path="/account-config" element={<SiteLayout />}>
                    <Route index element={<AccountConfigPage />} />
                </Route>
                <Route path="/station-config" element={<SiteLayout />}>
                    <Route index element={<StationConfigPage />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;