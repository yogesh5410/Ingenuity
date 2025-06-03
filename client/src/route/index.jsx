import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx"
import PotdPage from "../pages/Potd.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import PotdAdmin from "../pages/PotdAdmin.jsx";
import Roadmap from "../pages/Roadmap.jsx";
import Resources from "../pages/Resources.jsx";
import EventCalendar from "../pages/Calender.jsx";
import About from "../pages/About.jsx";
import CPSheet from "../pages/Sheet.jsx";
import Contact from "../pages/Contact.jsx";
import EventUser from "../pages/EventUser.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>, 
        children: [
            {
                path: "",
                element: <PotdPage />
            },
            {
                path: "/potd-admin", 
                element: <PotdAdmin/>   
            },
            {
                path: "/register",
                element: <Register/>
            },
            { 
                path: "/login",
                element: <Login/>
            }, 
            {
                path: "/forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "/roadmap",
                element: <Roadmap />
            }, 
            {
                path: "/resources",
                element: <Resources />
            }, 
            {
                path: "/contests",
                element: <EventCalendar />
            }, 
            {
                path: "/about", 
                element: <About/>
            }, 
            {
                path: "/cp-sheet",
                element: <CPSheet/>
            }, 
            {
                path: "/contact",
                element: <Contact/>
            },
            {
                path: "/events",
                element: <EventUser/>
            }
        ]
    }
])

export default router