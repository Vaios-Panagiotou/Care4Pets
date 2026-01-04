# Quick Database Reference - Pet Health App

## Collections Overview

### 1. users
```json
{
  "id": "string",
  "fullname": "string",
  "email": "string",
  "password": "string",
  "afm": "string",
  "role": "owner" | "vet"
}
```

### 2. pets
```json
{
  "id": "string",
  "ownerId": "string",
  "name": "string",
  "type": "dog" | "cat" | "other",
  "breed": "string",
  "gender": "male" | "female",
  "age": "string",
  "weight": "string",
  "color": "string",
  "microchip": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "image": "url"
}
```

### 3. appointments
```json
{
  "id": "string",
  "ownerId": "string",
  "ownerName": "string",
  "vetId": "number",
  "vetName": "string",
  "petName": "string",
  "time": "HH:MM",
  "date": "string (Greek date format)",
  "status": "confirmed" | "pending" | "cancelled" | "completed",
  "type": "Visit" | "Surgery" | "Emergency" | "Vaccine"
}
```

### 4. healthRecords
```json
{
  "id": "string",
  "petId": "string",
  "petName": "string",
  "ownerId": "string",
  "vetId": "string",
  "vetName": "string",
  "date": "YYYY-MM-DD",
  "type": "string",
  "diagnosis": "string",
  "treatment": "string",
  "notes": "string",
  "nextVisit": "YYYY-MM-DD"
}
```

### 5. vaccines
```json
{
  "id": "string",
  "petId": "string",
  "petName": "string",
  "name": "string",
  "date": "YYYY-MM-DD",
  "nextDate": "YYYY-MM-DD",
  "status": "Ενεργό" | "Λήγει Σύντομα" | "Έληξε",
  "vetName": "string",
  "batchNumber": "string"
}
```

### 6. prescriptions
```json
{
  "id": "string",
  "petId": "string",
  "petName": "string",
  "ownerId": "string",
  "ownerName": "string",
  "vetId": "string",
  "vetName": "string",
  "date": "YYYY-MM-DD",
  "medicine": "string",
  "dosage": "string",
  "duration": "string",
  "notes": "string",
  "diagnosis": "string"
}
```

### 7. reviews
```json
{
  "id": "string",
  "ownerId": "string",
  "ownerName": "string",
  "vetId": "string",
  "vetName": "string",
  "clinic": "string",
  "appointmentId": "string",
  "service": "string",
  "rating": 1-5,
  "comment": "string",
  "date": "YYYY-MM-DD"
}
```

### 8. vets
```json
{
  "id": number,
  "userId": "string" (optional),
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "specialty": "string",
  "rating": number (0-5),
  "views": number,
  "likes": number,
  "price": number,
  "image": "url",
  "availability": "string",
  "services": ["string"],
  "workingHours": {
    "Δευτέρα": "string",
    "Τρίτη": "string",
    ...
  }
}
```

### 9. vetClinics
```json
{
  "id": "string",
  "vetId": "string",
  "name": "string",
  "description": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "emergency": boolean,
  "workingHours": {...},
  "services": [
    {
      "id": number,
      "name": "string",
      "price": number,
      "category": "string"
    }
  ],
  "stats": {
    "totalPatients": number,
    "thisMonth": number,
    "upcomingAppointments": number,
    "completedToday": number
  }
}
```

### 10. news
```json
{
  "id": number,
  "title": "string",
  "date": "string",
  "readTime": "string",
  "category": "Υγεία" | "Διατροφή" | "Κοινότητα" | "Ιστορίες" | "Εκπαίδευση",
  "image": "url",
  "author": "string",
  "likes": number,
  "content": "string (excerpt)",
  "fullContent": "string"
}
```

### 11. lostPets
```json
{
  "id": "string",
  "name": "string",
  "type": "string",
  "breed": "string",
  "gender": "string",
  "age": "string",
  "color": "string",
  "date": "string",
  "location": "string",
  "img": "url",
  "reward": number | null,
  "views": number,
  "urgent": boolean,
  "description": "string",
  "phone": "string",
  "ownerId": "string" | null,
  "lat": number,
  "lng": number
}
```

## API Endpoints (json-server)

Base URL: `http://localhost:3001`

### Users
- GET `/users` - Get all users
- GET `/users?email={email}` - Get user by email
- POST `/users` - Create user
- PUT `/users/{id}` - Update user

### Pets
- GET `/pets` - Get all pets
- GET `/pets?ownerId={ownerId}` - Get pets by owner
- GET `/pets/{id}` - Get pet by ID
- POST `/pets` - Create pet
- PUT `/pets/{id}` - Update pet
- DELETE `/pets/{id}` - Delete pet

### Appointments
- GET `/appointments` - Get all appointments
- GET `/appointments?ownerId={ownerId}` - Get by owner
- POST `/appointments` - Create appointment
- PUT `/appointments/{id}` - Update appointment
- DELETE `/appointments/{id}` - Delete appointment

### Health Records
- GET `/healthRecords` - Get all records
- GET `/healthRecords?petId={petId}` - Get by pet
- POST `/healthRecords` - Create record
- PUT `/healthRecords/{id}` - Update record
- DELETE `/healthRecords/{id}` - Delete record

### Vaccines
- GET `/vaccines` - Get all vaccines
- GET `/vaccines?petId={petId}` - Get by pet
- POST `/vaccines` - Create vaccine record
- PUT `/vaccines/{id}` - Update vaccine
- DELETE `/vaccines/{id}` - Delete vaccine

### Prescriptions
- GET `/prescriptions` - Get all prescriptions
- GET `/prescriptions?petId={petId}` - Get by pet
- GET `/prescriptions?ownerId={ownerId}` - Get by owner
- POST `/prescriptions` - Create prescription
- PUT `/prescriptions/{id}` - Update prescription
- DELETE `/prescriptions/{id}` - Delete prescription

### Reviews
- GET `/reviews` - Get all reviews
- GET `/reviews?ownerId={ownerId}` - Get by owner
- GET `/reviews?vetId={vetId}` - Get by vet
- POST `/reviews` - Create review
- PUT `/reviews/{id}` - Update review
- DELETE `/reviews/{id}` - Delete review

### Vets
- GET `/vets` - Get all vets
- GET `/vets/{id}` - Get vet by ID

### Vet Clinics
- GET `/vetClinics` - Get all clinics
- GET `/vetClinics?vetId={vetId}` - Get by vet
- PUT `/vetClinics/{id}` - Update clinic

### News
- GET `/news` - Get all news
- GET `/news/{id}` - Get news by ID
- GET `/news?category={category}` - Get by category

### Lost Pets
- GET `/lostPets` - Get all lost pet ads
- POST `/lostPets` - Create lost pet ad
- DELETE `/lostPets/{id}` - Delete ad

## Sample Data IDs

### Test Users:
- **Owner 1:** `1765141425145` (vaios@gmail.com / vaios123)
- **Vet 1:** `1765143289475` (ktiniatros@gmail.com / 123456)
- **Owner 2:** `1766231574654` (makamaam / 123)

### Test Pets:
- **Kouvelaj:** `1767550000001` (Golden Retriever, Owner: vaios)
- **Pantiana:** `1767550000002` (Persian Cat, Owner: vaios)
- **Max:** `1767550000003` (Labrador, Owner: George)

### Test Vets:
- **Dr. Ioannis Smyrnis:** ID `1`
- **Dr. Eleni Karra:** ID `2`
- **Dr. Giorgos Papadopoulos:** ID `3`
- **Dr. Maria Dimitriou:** ID `4`
- **Dr. Kostas Nikolaou:** ID `5`
