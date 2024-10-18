// src/lib/fetchUtils.js
const API_URL = `${import.meta.env.VITE_APP_URL}/user`;

async function getUsers() {
  const res = await fetch(API_URL);
  return await res.json();
}

async function getUserById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

async function createUser(newUser) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });
  return await res.json();
}

async function updateUser(id, updatedUser) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedUser),
  });
  return await res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.status;
}

export { getUsers, getUserById, createUser, updateUser, deleteUser };
