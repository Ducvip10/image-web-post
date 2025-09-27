import { auth } from './firebase_config.js';
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const googleLoginBtn = document.getElementById("LoginGoogleButton");

googleLoginBtn.addEventListener("click", async() => {
    googleLoginBtn.disabled = true;

    const provider = new GoogleAuthProvider();
    try {
        const rs = await signInWithPopup(auth, provider);
        const user = rs.user;

        // Store user info in localStorage for logout page
        localStorage.setItem('userName', user.displayName || user.email);
        localStorage.setItem('isLoggedIn', 'true');

        alert("Login complete: " + user.displayName || user.email);
        window.location.href = "mainpage.html"; // Redirect to the home page after login
    } catch (error) {
        alert("login fail: " + error.message);
    }
});