import { auth } from './firebase_config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailElement = document.getElementById("user-email");
const previewForm = document.getElementById("preview");

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.isAdmin = (user.email === 'hcmc2026013@horizon.edu.vn'); // Set admin status
        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (userEmailElement) userEmailElement.textContent = user.email;
        if (previewForm) previewForm.style.display = "block";
    } else {
        window.isAdmin = false;
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (signupBtn) signupBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (userEmailElement) userEmailElement.textContent = "";
        if (previewForm) previewForm.style.display = "none";
    }
});

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener("click", async() => {
        try {
            await signOut(auth);
            window.location.reload();
        } catch (error) {
            alert("Logout failed: " + error.message);
        }
    });
}