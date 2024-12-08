import NavbarUser from "../components/NavbarUser"
import UserBookedslot from "../components/UserBookedslots";
import Allcentres from "../components/Allcentres";
import "./Userdashboard.css";

export default function Userdashboard() {
    return (
        <div className="userdashboard">
            <NavbarUser/>
            <div>
            <UserBookedslot/>
            <Allcentres/>   
            </div>
        </div>
    );
};