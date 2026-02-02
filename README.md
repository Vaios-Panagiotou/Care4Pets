# Care4Pets — Pet Health App 🐾

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Material UI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)](https://mui.com/)
[![JSON Server](https://img.shields.io/badge/JSON%20Server-Local%20API-8A2BE2)](https://github.com/typicode/json-server)

**Web εφαρμογή διαχείρισης κατοικιδίων και κτηνιατρικών υπηρεσιών** για ιδιοκτήτες και κτηνιάτρους, με έμφαση στην οργάνωση, την ασφάλεια και την ευχρηστία.

🔗 **Repo:** https://github.com/Vaios-Panagiotou/EAM3  
🎥 **Explain Video:** https://youtu.be/vPa2aQSbE4Y

---

## ✨ Highlights
- Ρόλοι χρηστών: **Ιδιοκτήτης** / **Κτηνίατρος** με προστατευμένες σελίδες
- **Ραντεβού** με κτηνίατρο & διαχείριση προγράμματος
- **Ηλεκτρονικό βιβλιάριο υγείας** και ιατρικές εγγραφές
- **Χαμένα & Ευρεθέντα** κατοικίδια
- Νέα, ανακοινώσεις & σελίδες πολιτικών (GDPR/Privacy/Cookies)

---

## 🚀 Quick Start

```bash
npm install
npm start
```

Σε δεύτερο terminal:

```bash
npx json-server db.json --port 3001
```

Frontend: http://localhost:3000  
API: http://localhost:3001

---

## 🔐 Demo Accounts

```
username                password
vaios@gmail.com         vaios123  (Owner)
ktiniatros@gmail.com    123456    (Vet)
```

---

## 🧭 Περιήγηση — Κύριες Σελίδες
- **Ιδιοκτήτης:** /owner/history
- **Κτηνίατρος:** /vet/history
- **Χαμένα Κατοικίδια:** /lost-pets
- **Επικοινωνία:** /contact

---

## 🧩 Architecture Overview
- **Frontend:** React 18 + React Router
- **UI:** Material UI (MUI)
- **Local API:** JSON Server (db.json)
- **Auth:** Context-based (`AuthContext`)

---

## 📁 Δομή φακέλων (σύνοψη)

<details>
  <summary>src/components</summary>

- `DashboardSidebar.js` — Πλευρικό μενού
- `Navbar.js` — Κύρια πλοήγηση
- `Footer.js` — Footer
- `RequireAuth.js` — Protected routes
- `RoleHelpHint.js` — Context hints ανά ρόλο
</details>

<details>
  <summary>src/context</summary>

- `AuthContext.js` — Διαχείριση session/role
</details>

<details>
  <summary>src/hooks</summary>

- `useAuth.js` — Access helper για `AuthContext`
</details>

<details>
  <summary>src/pages</summary>

- `OwnerDashboard.js`, `VetDashboard.js` — Dashboards
- `History.js`, `VetHistory.js` — Ιστορικό
- `VetSearch.js`, `VetSchedule.js` — Αναζήτηση/πρόγραμμα ραντεβού
- `PetHealthBook.js`, `VetRecords.js` — Ιατρικές εγγραφές
- `lostpets.js`, `FoundPets.js` — Χαμένα/ευρεθέντα
- `Profile.js`, `VetClinic.js` — Προφίλ χρήστη/κλινικής
- `News.js`, `NewsDetail.js`, `contact.js` — Περιεχόμενο/επικοινωνία
</details>

<details>
  <summary>src/service</summary>

- `api.js` — Service layer για JSON Server (GET/POST/PUT/DELETE)
</details>

---

## 🧠 Συντομή Περιγραφή Πλατφόρμας
Η Care4Pets είναι web εφαρμογή διαχείρισης κατοικιδίων και κτηνιατρικών υπηρεσιών, σχεδιασμένη για ιδιοκτήτες και κτηνιάτρους. Περιλαμβάνει ραντεβού, ιστορικό, βιβλιάριο υγείας, αναζήτηση κλινικών, ενημερωτικό περιεχόμενο και συμμόρφωση με GDPR/Privacy.

---

## 🧪 Παραδοχές & Σημειώσεις
- Υπάρχουν mock δεδομένα ώστε να μην είναι άδεια η εφαρμογή.
- Τα δείγματα **Pantiana** και **Kouvelaj** δείχνουν την εμφάνιση χωρίς να κάνετε ενέργειες.
- Το `db.json` πρέπει να βρίσκεται **μέσα** στον φάκελο `pet-health-app`.
- Το explain video είναι *private* και ο σύνδεσμος βρίσκεται πιο πάνω.

---

## 👥 Συντελεστές
**Γεώργιος Σκούρας** — ΑΜ 1115202100172  
**Βάιος Παναγιώτου** — ΑΜ 1115202100133

---

## ❗ Σημείωση για το Video
Το βίντεο έχει διάρκεια ~16 λεπτά (αντί για 10). Ζητούμε συγγνώμη για την υπέρβαση· το περιεχόμενο παρουσιάζει αναλυτικά όλες τις λειτουργίες.

