// Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyDB90lm9yKDm32o2IidFbP2pOMMVGJK2P0",
    authDomain: "game-store-9db7d.firebaseapp.com",
    projectId: "game-store-9db7d",
    storageBucket: "game-store-9db7d.firebasestorage.app",
    messagingSenderId: "851197484672",
    appId: "1:851197484672:web:96ad306d39fd2297865065",
    measurementId: "G-GZB1ZFL9RM"
};
// firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const registerFormInput = document.getElementById("signin-form");
const registerEmailInput = document.getElementById("signin-email");
const registerPasswordInput = document.getElementById("signin-pass");
const confirmPasswordInput = document.getElementById("confir-pass");

registerFormInput.addEventListener("submit", async(e) => {
    e.preventDefault();

    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (passwordValidation !== "Password is valid.") {
        alert(passwordValidation);
        return;
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation !== "Email is valid.") {
        alert(emailValidation);
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user info in localStorage for logout page
        localStorage.setItem('userName', user.email);
        localStorage.setItem('isLoggedIn', 'true');

        alert("Registration successful! Welcome, " + user.email);
        location.href = "login.html"; // Redirect to login page after successful registration
    } catch (error) {
        alert("Error: " + error.message);
    }
});

function validatePassword(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) {
        return "Password must be at least " + minLength + " characters long.";
    }
    if (!hasUppercase) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowercase) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
        return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
        return "Password must contain at least one special character.";
    }
    return "Password is valid.";
}

function validateEmail(email) {
    const hasAChar = /[@]/.test(email);
    if (!hasAChar) {
        return "Email must contain '@' character.";
    }
    return "Email is valid.";
}