import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/NotFound";

const Paths = () => {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SiteLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
     );
}
 
export default Paths;