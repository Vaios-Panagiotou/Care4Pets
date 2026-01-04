const API_URL = 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

function toId() {
  return Date.now().toString();
}

export const usersAPI = {
  getAll: () => request('users'),
  getByEmail: async (email) => request(`users?email=${encodeURIComponent(email)}`),
  create: (user) => request('users', { method: 'POST', body: JSON.stringify({ id: toId(), ...user }) }),
};

export const petsAPI = {
  getAll: () => request('pets'),
  getByOwnerId: (ownerId) => request(`pets?ownerId=${encodeURIComponent(ownerId)}`),
  create: (pet) => request('pets', { method: 'POST', body: JSON.stringify({ id: toId(), ...pet }) }),
  update: (id, pet) => request(`pets/${id}`, { method: 'PUT', body: JSON.stringify(pet) }),
  delete: (id) => request(`pets/${id}`, { method: 'DELETE' }),
};

export const lostPetsAPI = {
  getAll: () => request('lostPets'),
  create: (ad) => request('lostPets', { method: 'POST', body: JSON.stringify({ id: toId(), ...ad }) }),
  delete: (id) => request(`lostPets/${id}`, { method: 'DELETE' }),
};

export const appointmentsAPI = {
  getAll: () => request('appointments'),
  getByOwnerId: (ownerId) => request(`appointments?ownerId=${encodeURIComponent(ownerId)}`),
  create: (appt) => request('appointments', { method: 'POST', body: JSON.stringify({ id: toId(), ...appt }) }),
  update: (id, appt) => request(`appointments/${id}`, { method: 'PUT', body: JSON.stringify(appt) }),
  delete: (id) => request(`appointments/${id}`, { method: 'DELETE' }),
};

export const vetsAPI = {
  getAll: () => request('vets'),
};
