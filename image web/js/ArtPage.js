import { auth } from './firebase_config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { isAdmin } from './admin.js';

const Api_Url = 'https://689fdcd36e38a02c58174262.mockapi.io/art_project';

let currentUser = null;
let artData = null;

// Get art ID from URL
const urlParams = new URLSearchParams(window.location.search);
const artId = urlParams.get('id');

if (!artId) {
    alert('No art ID provided');
    window.location.href = 'mainpage.html';
}

// Track current user
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    fetchArtDetails();
});

// Fetch art details
const fetchArtDetails = async() => {
    try {
        const response = await fetch(`${Api_Url}/${artId}`);
        if (!response.ok) throw new Error('Art not found');
        artData = await response.json();

        displayArt();
    } catch (error) {
        console.error('Error fetching art:', error);
        alert('Art not found');
        window.location.href = 'mainpage.html';
    }
};

// Display art details
const displayArt = () => {
    const theArt = document.getElementById('the_art');
    const theArtName = document.getElementById('the_art_name');
    const theUploader = document.getElementById('the_uploader');
    const description = document.getElementById('description');

    theArt.innerHTML = `<img src="${artData.image}" alt="${artData.name}" class="full-art-image" />`;
    theArtName.innerHTML = `<h3>${artData.name}</h3>`;
    theUploader.innerHTML = `<p>Uploaded by ${artData.user}</p>`;
    description.innerHTML = `<p>Description: ${artData.Dis || 'No description'}</p>`;

    // Add edit and delete buttons if current user is the uploader or admin
    if (currentUser && (currentUser.displayName === artData.user || currentUser.email === artData.user || isAdmin())) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit Description';
        editButton.className = 'edit-button';
        editButton.onclick = () => editDescription();

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Post';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteArt();

        description.appendChild(editButton);
        description.appendChild(deleteButton);
    }
};

// Edit description
const editDescription = async() => {
    const newDis = prompt('Enter new description:', artData.Dis || '');
    if (newDis !== null && newDis.trim() !== artData.Dis) {
        try {
            const response = await fetch(`${Api_Url}/${artId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Dis: newDis.trim() })
            });
            if (!response.ok) throw new Error('Failed to update description');
            artData.Dis = newDis.trim();
            displayArt(); // Refresh display
        } catch (error) {
            console.error('Error updating description:', error);
            alert('Failed to update description. Please try again.');
        }
    }
};

// Delete art
const deleteArt = async() => {
    if (confirm('Are you sure you want to delete this art?')) {
        try {
            const response = await fetch(`${Api_Url}/${artId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete art');
            alert('Art deleted successfully');
            window.location.href = 'mainpage.html';
        } catch (error) {
            console.error('Error deleting art:', error);
            alert('Failed to delete art. Please try again.');
        }
    }
};
