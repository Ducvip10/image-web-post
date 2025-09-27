import { auth } from './firebase_config.js';

export function isAdmin() {
    return window.isAdmin || false;
}

const Api_Url = 'https://689fdcd36e38a02c58174262.mockapi.io/art_project';

export const adminEdit = async(id, currentName) => {
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
            window.fetchArt_project(); // Refresh list
        } catch (error) {
            console.error('Error updating art:', error);
            alert('Failed to update art. Please try again.');
        }
    }
};

export const adminDelete = async(id) => {
    if (confirm('Are you sure you want to delete this art?')) {
        try {
            const response = await fetch(`${Api_Url}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete art');
            window.fetchArt_project(); // Refresh list
        } catch (error) {
            console.error('Error deleting art:', error);
            alert('Failed to delete art. Please try again.');
        }
    }
};
