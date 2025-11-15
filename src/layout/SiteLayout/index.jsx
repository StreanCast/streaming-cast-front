import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Menu from "../../components/Menu";

const SiteLayout = () => {
    return (
        <>
            <Header />
            <div className="flex w-full">
                <Menu />
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default SiteLayout;