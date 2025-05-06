import { useState } from "react";
import "./Auth.css"
import NavBar from "./navbar";
import { useNavigate } from "react-router-dom";

export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("Rtoken")
    const headers = {
        "Content-Type": "application/json"}
    const options = {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers,
    };
    try{
        const response = await fetch("http://4.237.58.241:3000/user/refresh", options)
        if (response.status === 401) {
            alert("JWT token has expired, please log in again")
            localStorage.clear()
            throw new Error("JWT token has expired");
        }
        const data = await response.json();
        localStorage.setItem("Btoken", data.bearerToken.token)
        localStorage.setItem("Rtoken", data.refreshToken.token)
        return
    }
    catch(error){
        throw new Error("Failed to refresh token: " + error.message);
    }
}

export const APIcall = async (url, method = "GET", body = null, customHeaders = {}) => {
    try {
        const headers = {
            "Content-Type": "application/json",
            ...customHeaders}
        const options = {
            method,
            headers,
        };
        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        if (response.status === 401) {
            const errorData = await response.json(); 
            if (errorData.message && errorData.message.toLowerCase().includes("expired")) {
                console.log("Token expired, refreshing...1");

                const refreshtoken = await refreshToken();
                console.log("Token expired, refreshing...2");

                const newToken = localStorage.getItem("Btoken"); 
                const JSONresponse = await APIcall(url, method, body, { ...customHeaders, Authorization: `Bearer ${newToken}` });
                console.log("Token expired, refreshing...3");
                console.log("Token expired, refreshing...done");
                return JSONresponse;
            } else {
                alert("PLEASE LOG IN!!!!!!!!")
                throw new Error(`Unauthorized: ${errorData.message}`);
            }
        }

        else if (response.status !=200) {
            error = await response.json();
            throw new Error(`API call failed with status ${response.status}: ${error.message}`);
        }

        return await response.json();
    }
    catch (error) {
        throw error; 
    }
}


export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [state, setState] = useState("Login")
    const [submitted, setSubmitted] = useState(false); 
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitted(false);
        
        if (state === "Register" && password !== confirmpassword) {
            setSubmitted(true)
            alert("Passwords do not match");
            return;
        }


        try {
            const data = await APIcall(`http://4.237.58.241:3000/user/${state.toLowerCase()}`,"POST", {email, password})

            if (state === "Login") {
                localStorage.setItem("Btoken", data.bearerToken.token); 
                localStorage.setItem("Rtoken", data.refreshToken.token)
                console.log(data)
                alert("Login successful!");
                navigate("/")
            } else {
                alert("Registration successful! Please log in.");
                setState("Login");
                setSubmitted(false)
                navigate("/auth")
            }
        } catch (error) {
            if (error.message.includes("User already exists")){
                setSubmitted(true)
                alert("User already exists");
                return;
            }
            if (error.message.includes("Incorrect email or password")){
                setSubmitted(true)
                alert("Incorrect email or password");
                return;
            }
        }
    };

    return (
        <>
        <NavBar></NavBar>
        <div id="loginform" >
            <h1>{state}</h1>
            <form onSubmit={handleLogin}>
                <div className="userprompt" id="email" >
                    <label htmlFor="email" >
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={submitted ? "invalid" : ""}
                        required
                    />
                </div>
                <div className="userprompt" id="password">
                    <label htmlFor="password">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={submitted ? "invalid" : ""}
                        required

                    />
                </div>
                {state === "Login" ? null:
                (<div className="userprompt" id="confirmpassword">
                    <label htmlFor="confirmpassword">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="confirmpassword"
                        value={confirmpassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Enter your password again"
                        className={submitted ? "invalid" : ""}
                        required
                    />
                </div>)}
                <div style={{ marginTop: "15px" }}>
                    {state === "Login" ? (
                        <p>
                            No account?{" "}
                            <span
                                style={{ color: "blue", cursor: "pointer" }}
                                onClick={() => setState("Register")}
                            >
                                Register here
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <span
                                style={{ color: "blue", cursor: "pointer" }}
                                onClick={() => setState("Login")}
                            >
                                Login here
                            </span>
                        </p>
                    )}
                </div>
                <button id="loginbutton" type="submit"> {state}</button>
            </form>
        </div>
        </>
    );
}