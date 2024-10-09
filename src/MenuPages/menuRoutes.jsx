import { Route } from "react-router-dom";
import MenuWrapper from "./menuWrapper";
import MainMenu from './pages/mainMenuPage';
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";

export const MenuRoutes = [
    <Route key="/" path="/" element={<MenuWrapper><MainMenu/></MenuWrapper>} />,
    <Route key="/login" path="/login" element={<MenuWrapper><LoginPage/></MenuWrapper>} />,
    <Route key="/register" path="/register" element={<MenuWrapper><SignupPage/></MenuWrapper>} />
]