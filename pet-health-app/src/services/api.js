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
  update: (id, user) => request(`users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
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

export const foundPetsAPI = {
  getAll: () => request('foundPets'),
  create: (ad) => request('foundPets', { method: 'POST', body: JSON.stringify({ id: toId(), ...ad }) }),
  delete: (id) => request(`foundPets/${id}`, { method: 'DELETE' }),
};

export const petTransfersAPI = {
  getAll: () => request('petTransfers'),
  create: (transfer) => request('petTransfers', { method: 'POST', body: JSON.stringify({ id: toId(), ...transfer }) }),
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
  getById: (id) => request(`vets/${id}`),
};

export const healthRecordsAPI = {
  getAll: () => request('healthRecords'),
  getByPetId: (petId) => request(`healthRecords?petId=${encodeURIComponent(petId)}`),
  create: (record) => request('healthRecords', { method: 'POST', body: JSON.stringify({ id: toId(), ...record }) }),
  update: (id, record) => request(`healthRecords/${id}`, { method: 'PUT', body: JSON.stringify(record) }),
  delete: (id) => request(`healthRecords/${id}`, { method: 'DELETE' }),
};

export const vaccinesAPI = {
  getAll: () => request('vaccines'),
  getByPetId: (petId) => request(`vaccines?petId=${encodeURIComponent(petId)}`),
  create: (vaccine) => request('vaccines', { method: 'POST', body: JSON.stringify({ id: toId(), ...vaccine }) }),
  update: (id, vaccine) => request(`vaccines/${id}`, { method: 'PUT', body: JSON.stringify(vaccine) }),
  delete: (id) => request(`vaccines/${id}`, { method: 'DELETE' }),
};

export const prescriptionsAPI = {
  getAll: () => request('prescriptions'),
  getByPetId: (petId) => request(`prescriptions?petId=${encodeURIComponent(petId)}`),
  getByOwnerId: (ownerId) => request(`prescriptions?ownerId=${encodeURIComponent(ownerId)}`),
  create: (prescription) => request('prescriptions', { method: 'POST', body: JSON.stringify({ id: toId(), ...prescription }) }),
  update: (id, prescription) => request(`prescriptions/${id}`, { method: 'PUT', body: JSON.stringify(prescription) }),
  delete: (id) => request(`prescriptions/${id}`, { method: 'DELETE' }),
};

export const reviewsAPI = {
  getAll: () => request('reviews'),
  getByOwnerId: (ownerId) => request(`reviews?ownerId=${encodeURIComponent(ownerId)}`),
  getByVetId: (vetId) => request(`reviews?vetId=${encodeURIComponent(vetId)}`),
  create: (review) => request('reviews', { method: 'POST', body: JSON.stringify({ id: toId(), ...review }) }),
  update: (id, review) => request(`reviews/${id}`, { method: 'PUT', body: JSON.stringify(review) }),
  delete: (id) => request(`reviews/${id}`, { method: 'DELETE' }),
};

export const newsAPI = {
  getAll: () => request('news'),
  getById: (id) => request(`news/${id}`),
  getByCategory: (category) => request(`news?category=${encodeURIComponent(category)}`),
};

export const vetClinicsAPI = {
  getAll: () => request('vetClinics'),
  getByVetId: (vetId) => request(`vetClinics?vetId=${encodeURIComponent(vetId)}`),
  update: (id, clinic) => request(`vetClinics/${id}`, { method: 'PUT', body: JSON.stringify(clinic) }),
};
