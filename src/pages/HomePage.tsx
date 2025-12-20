import { Link } from "react-router";

export const HomePage = () => {
    return (
        <>
        <h1>Main page</h1>
        <Link to="/login">Login</Link>
        </>
    );
}