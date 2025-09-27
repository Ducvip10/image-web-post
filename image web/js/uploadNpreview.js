//preview
const input = document.getElementById('file-input');
const image = document.getElementById('img-preview');

input.addEventListener('change', (e) => {
    if (e.target.files.length) {
        const src = URL.createObjectURL(e.target.files[0]);
        image.src = src;
    }
});

// Firebase imports
import { auth } from './firebase_config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById("file-input");
const artNameInput = document.getElementById("art-name");
const artDescriptionInput = document.getElementById("art-description");
const form = document.getElementById('preview');
const apiUrl = 'https://689fdcd36e38a02c58174262.mockapi.io/art_project';

// Kiểm tra trạng thái đăng nhập khi trang tải
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user.displayName || user.email);
    } else {
        console.log('User is signed out');
    }
});

// Removed fileToDataUrl function as we'll upload the file directly

// Xử lý sự kiện khi form được submit
form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("Login so you can see stuff.");
        return;
    }

    const file = fileInput.files[0];
    const artName = artNameInput.value.trim();
    if (!file || !artName) {
        alert('Pick a image and name it.');
        return;
    }

    // Validate file size (max 32MB for ImgBB)
    if (file.size > 32 * 1024 * 1024) {
        alert('image too big only max 32MB.');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Pick a image.');
        return;
    }

    // Get username from Firebase
    const username = user.displayName || user.email || 'Anonymous';

    uploadButton.disabled = true;
    uploadButton.textContent = 'Uploading...';

    try {
        // Upload to ImgBB
        const imgbbFormData = new FormData();
        imgbbFormData.append('image', file);

        const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=28341cc5d4a8fa660bd6fb53755f9bbe', {
            method: 'POST',
            body: imgbbFormData
        });

        if (!imgbbResponse.ok) throw new Error('ImgBB upload failed');

        const imgbbData = await imgbbResponse.json();
        if (!imgbbData.success) throw new Error('ImgBB upload error: ' + imgbbData.error.message);

        const imageUrl = imgbbData.data.display_url;

        // Save to MockAPI
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: artName,
                image: imageUrl,
                user: username,
                Dis: artDescriptionInput.value.trim(),
                date_uploaded: new Date().toISOString()
            })
        });

        if (!response.ok) throw new Error('MockAPI save failed');

        alert('Upload complete!');
        form.reset();
        // Refresh the art list
        if (window.fetchArt_project) window.fetchArt_project();
    } catch (error) {
        console.error('issue when uploading:', error);
        if (error.message.includes('ImgBB')) {
            alert('image issue.');
        } else if (error.message.includes('MockAPI')) {
            alert('Too much bit.');
        } else {
            alert('issue happen, try again.');
        }
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Tải lên';
    }
});