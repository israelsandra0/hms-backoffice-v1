import { Button } from "@/components/ui/button"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, RequireAuth } from "./Auth";
// import { Link } from "react-router-dom"
// import { Profile } from "./LoginPage"

export default function Dashboard(){

    // const navigate = useNavigate();
    // const auth = useContext(AuthContext)

    // function handleSubmit() {
    //     window.localStorage.clear();
    //     console.log("All data cleared from localStorage.");
    //     navigate("/");
    // }

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}