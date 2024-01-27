import { processServerResponse } from "./utils";

export const baseUrl = "http://localhost:3001";

export function request(url, options) {
  return fetch(url, options).then(processServerResponse);
}

export function getItems() {
  return fetch(`${baseUrl}/items`, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${localStorage.getItem("")}
    },
  }).then(processServerResponse);
}

// POST https://localhost:3001/items

export function postItems(values, token) {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  }).then(processServerResponse);
}

// DELETE https://localhost:3001/items/:id

export function deleteItems(id, token) {
  return fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(processServerResponse);
}

// PUT
export function likeCard(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(processServerResponse)
    .catch((error) => {
      console.error("Error adding like:", error);
      throw error; // Re-throw the error for further handling
    });
}

export function likeRemove(id, token) {
  return fetch(`${baseUrl}/items/${id}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(processServerResponse)
    .catch((error) => {
      console.error("Error removing like:", error);
      throw error; // Re-throw the error for further handling
    });
}

export function editProfile(name, avatar, token) {
  return fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatar }),
  })
    .then(processServerResponse)
    .catch((error) => {
      console.log("Error updating Profile:", error);
      throw error;
    });
}

// 3. Add the editing profile logic
// Add the EditProfileModal component for editing user data. The modal windows should be opened when
// the user clicks the “Edit profile” button on the profile page.

// The current user’s data should be filled in the form. Make an API call that sends new user name and the avatar URL to the server.

// start db.json with this > json-server --watch db.json --id _id --port 3001
