import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";
import FileManager from "../pages/FileManagePage";
import LoginPage from "../pages/LoginPage";

const Paths = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SiteLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/file-manager" element={<SiteLayout />}>
                    <Route index element={<FileManager />} />
                </Route>
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;