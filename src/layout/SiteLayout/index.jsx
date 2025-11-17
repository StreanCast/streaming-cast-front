import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Menu from "../../components/Menu";

const SiteLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Menu />
            <main className="flex-1 overflow-y-auto">
                <Header />
                <Outlet />
                <Footer />
            </main>
        </div>
    );
}

export default SiteLayout;