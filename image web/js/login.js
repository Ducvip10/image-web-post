import { auth } from './firebase_config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginFormInput = document.getElementById("login-form");
const loginEmailInput = document.getElementById("login-email");
const loginPasswordInput = document.getElementById("login-pass");

// login input

loginFormInput.addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user info in localStorage for logout page
        localStorage.setItem('userName', user.email);
        localStorage.setItem('isLoggedIn', 'true');

        alert("Login successful! Welcome back, " + user.email);
        window.location.href = "mainpage.html"; // Redirect to the home page after login
    } catch (error) {
        alert("Error: " + error.message);
    }
});