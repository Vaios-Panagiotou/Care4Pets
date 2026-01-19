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

// Βοηθητικό visits: καταγράφει ολοκληρωμένο ραντεβού ως επίσκεψη στο κατοικίδιο και στον κτηνίατρο
export const visitsAPI = {
  recordVisit: async (appt) => {
    if (!appt) return null;
    try {
      // Εύρεση κατοικιδίου
      const pets = Array.isArray(await petsAPI.getAll()) ? await petsAPI.getAll() : [];
      let pet = null;
      if (appt.petId) pet = pets.find(p => String(p.id) === String(appt.petId));
      if (!pet) {
        pet = pets.find(p => String(p.ownerId) === String(appt.ownerId) && ((p.name || '').toLowerCase() === String(appt.petName || '').toLowerCase()));
      }
      if (!pet) return null;

      const visit = {
        appointmentId: appt.id,
        vetUserId: appt.vetUserId || null,
        vetId: appt.vetId || null,
        date: appt.completedAt || appt.updatedAt || new Date().toISOString(),
        type: appt.type || 'Visit',
        status: appt.status || 'completed',
        reason: appt.reason || '',
        note: appt.note || ''
      };

      const prev = Array.isArray(pet.visits) ? pet.visits : [];
      const updatedPet = { ...pet, visits: [...prev, visit] };
      await petsAPI.update(pet.id, updatedPet);

      // Ενημέρωση visitedPets για τον χρήστη-κτηνίατρο
      const users = Array.isArray(await usersAPI.getAll()) ? await usersAPI.getAll() : [];
      let vetUser = null;
      if (appt.vetUserId) vetUser = users.find(u => String(u.id) === String(appt.vetUserId));
      if (!vetUser) {
        vetUser = users.find(u => (appt.vetEmail && u.email && u.email.toLowerCase() === appt.vetEmail?.toLowerCase()) || (appt.vetName && ((u.fullname || u.name || '').toLowerCase() === appt.vetName?.toLowerCase())));
      }
      if (vetUser) {
        const set = new Set(Array.isArray(vetUser.visitedPets) ? vetUser.visitedPets : []);
        set.add(String(pet.id));
        const updatedUser = { ...vetUser, visitedPets: Array.from(set) };
        await usersAPI.update(vetUser.id, updatedUser);
      }

      return { petId: pet.id, vetUserId: vetUser?.id || null };
    } catch (err) {
      console.error('[visitsAPI.recordVisit] failed', err);
      return null;
    }
  }
};
