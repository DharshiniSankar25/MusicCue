import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
const handleSubmit=async()=>{
    console.log("Button clicked");
    try{
        const response= await axios.post("https://musiccue.onrender.com/login",{
            email,
            password

        });
        console.log("Received response:", response.data);   
        localStorage.setItem("token",response.data.token);
        console.log(response.data);
        console.log(response.data.token);
        navigate("/Map");
        console.log("Navigating to Map page...");
}
    catch(error){
        console.error(error);
        alert("Login Failed");
    }
}
return (
      <><h1 style={{color: 'black'}}>Music Cue</h1>
      <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
          <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
              <button onClick={handleSubmit}>
              Login
          </button></>
  );
}

export default Login;