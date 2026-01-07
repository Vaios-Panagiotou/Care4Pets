# Care4Pets — Pet Health App

Μικρή εφαρμογή για διαχείριση κατοικιδίων, ραντεβού με κτηνίατρο και δηλώσεις χαμένων ζώων. Φτιαγμένη με React + Material UI και τοπικό JSON Server για δοκιμή δεδομένων.

## Γρήγορη Εκκίνηση

1. Εγκατάσταση εξαρτήσεων

```bash
npm install
```

2. Εκκίνηση εφαρμογής (frontend)

```bash
npm start
```

Ανοίγει στο http://localhost:3000.

3. Εκκίνηση τοπικού API (JSON Server)

```bash
npx json-server db.json --port 3001
```

Το API σε http://localhost:3001 (π.χ. /appointments, /reviews).

## Χρήσιμες Σελίδες

- Ιδιοκτήτης: Ιστορικό επισκέψεων — /owner/history
- Κτηνίατρος: Κριτικές πελατών — /vet/history
- Χαμένα Κατοικίδια — /lost-pets
- Επικοινωνία — /contact
- Πολιτικές: Απορρήτου, Όροι, Cookies, GDPR

## Τεχνολογίες

- React 18, React Router
- Material UI
- JSON Server (mock API)

## Δομή

- src/pages: Όλες οι σελίδες εφαρμογής
- src/components: Κοινά components (Navbar, Sidebar, Footer)
- src/context: `AuthContext` για σύνδεση/ρόλους
- db.json: Δείγμα δεδομένων

## Σημειώσεις

- Τα δεδομένα είναι demo.Για παραγωγή απαιτείται πραγματικό backend.
- Αν κάτι δεν φορτώνει,ελέγξτε ότι τρέχει ο JSON Server στο 3001.