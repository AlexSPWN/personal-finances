import { useNavigate } from "react-router";

export const NotFoundPage = () => {

    const navigate = useNavigate();

    const goBack = () => {
        navigate("/")    
    }

    return (
    <div>
        Go back
        <button className="bg-blue-400 rounded p-2 text-amber-50 font-bold" onClick={goBack}>Back</button>
    </div>);
}