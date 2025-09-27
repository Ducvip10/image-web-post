import { auth } from './firebase_config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { isAdmin, adminEdit, adminDelete } from './admin.js';

const Api_Url = 'https://689fdcd36e38a02c58174262.mockapi.io/art_project';
// getting const
const ArtList = document.getElementById('Art-list');
const RandomUser = document.getElementById('productForm');
const APIimage = document.getElementById('image');
const ArtName = document.getElementById('name');
const APIuser = document.getElementById('user');
const Artform = document.getElementById('productForm');

let currentUser = null;

// Track current user
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    fetchArt_project(); // Fetch and render art list after auth state is known
});

//reading stuff
const fetchArt_project = async() => {
    try {
        const response = await fetch(Api_Url);
        if (!response.ok) throw new Error('Network response was not ok');
        const Art_project = await response.json();

        ArtList.innerHTML = ''; // Clear the list before rendering
        Art_project.forEach(art_project => {
            const artItem = document.createElement('div');
            artItem.className = 'art-item';
            artItem.innerHTML = `
                <a href="ArtPage.html?id=${art_project.id}"><img src="${art_project.image}" alt="${art_project.name}" class="art-image" /></a>
                <h3 class="art-name">${art_project.name}</h3>
                <p class="art-user">upload by ${art_project.user}</p>
            `;

            // Add edit and delete buttons if current user is the uploader or admin
            if (currentUser && (currentUser.displayName === art_project.user || currentUser.email === art_project.user || isAdmin())) {
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'edit-button';
                editButton.onclick = () => adminEdit(art_project.id, art_project.name);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.onclick = () => adminDelete(art_project.id);

                artItem.appendChild(editButton);
                artItem.appendChild(deleteButton);
            }

            ArtList.appendChild(artItem);
        })

    } catch (error) {
        console.error('Error fetching art_project:', error);
    }
}

// Make fetchArt_project global
window.fetchArt_project = fetchArt_project;

// Edit function
const editArt = async(id, currentName) => {
    const newName = prompt('Enter new art name:', currentName);
    if (newName && newName.trim() !== currentName) {
        try {
            const response = await fetch(`${Api_Url}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newName.trim() })
            });
            if (!response.ok) throw new Error('Failed to update art');
            fetchArt_project(); // Refresh list
        } catch (error) {
            console.error('Error updating art:', error);
            alert('Failed to update art. Please try again.');
        }
    }
};

// Delete function
const deleteArt = async(id) => {
    if (confirm('Are you sure you want to delete this art?')) {
        try {
            const response = await fetch(`${Api_Url}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete art');
            fetchArt_project(); // Refresh list
        } catch (error) {
            console.error('Error deleting art:', error);
            alert('Failed to delete art. Please try again.');
        }
    }
};