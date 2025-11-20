
# Mini Twitter — MVP

## Obiettivo

Costruire una versione semplificata di Twitter, con login/registrazione, post testuali e feed pubblico.

## Pagine principali

Principali route dell'app:

- `/login` → pagina di accesso
- `/signup` → pagina di registrazione
- `/` → homepage con i post più recenti
- `/post` → form per scrivere un nuovo post (supporta Markdown base)
- `/post/[id]` → pagina di dettaglio di un singolo post (testo grande, commenti)
- `/user/[username]` → pagina pubblica di un utente (bio, post)
- `/profile` → area personale per modificare dati e impostazioni

Estensioni opzionali (se avanza tempo): like, commenti, immagini.

---

## Frontend

Stack suggerito: Next.js + React + Tailwind CSS + ShadCN UI

Struttura e stile:

- Layout principale con navbar (login/logout, link a home e profilo).
- Routing gestito da Next.js (file-system routing).
- Stile con Tailwind + componenti ShadCN (bottoni, card, modali).

Pagine e comportamento:

- `/login` — form con email/password, submit via API.
- `/signup` — form di registrazione (username, email, password).
- `/` — lista dei post (feed), caricati via API (GET /posts).
- `/post` — form per nuovo post con editor Markdown (POST /posts).
- `/post/[id]` — dettaglio post (GET /posts/:id) con commenti.
- `/user/[username]` — profilo pubblico: info utente + lista post (GET /users/:username).
- `/profile` — form per modificare bio, immagine, ecc. (PATCH /me).

Stato e API:

- Usare le API routes di Next.js o chiamare un backend separato.
- Gestire l'autenticazione con JWT.

---

## Backend

Stack suggerito: Express.js + PostgreSQL (opzionalmente Supabase o Neon per facilità)

Credenziali di esempio (solo per sviluppo):

```
password: database1234
```

Autenticazione e sicurezza:

- JWT per i token di accesso.
- Hashing password con bcrypt.

Schema di database (Postgres):

- users (id, username, email, password_hash, bio, created_at)
- posts (id, user_id, content, created_at)
- comments (id, post_id, user_id, content, created_at)
- likes (id, post_id, user_id) — opzionale

---

## API principali

Auth

- `POST /signup` → crea un nuovo utente
- `POST /login` → autentica e genera un token JWT
- `GET /me` → ottiene le informazioni dell'utente loggato

Posts

- `GET /posts` → feed dei post più recenti
- `POST /posts` → crea un nuovo post (supporto Markdown)
- `GET /posts/:id` → dettaglio di un singolo post con autore e commenti

Users

- `GET /users/:username` → informazioni pubbliche dell'utente + suoi post
- `PATCH /me` → aggiorna il profilo dell'utente autenticato

Extra (opzionali)

- `POST /posts/:id/like` → aggiunge/rimuove like
- `POST /posts/:id/comment` → aggiunge un commento

---

## Mobile (opzionale)

Stack suggerito: React Native + Expo + Tailwind/NativeWind

Struttura app mobile:

- Stack navigator: (login/signup → home/feed → profilo)
- UI minimale: card per i post, pulsante flottante per creare un post
- Chiamate API tramite fetch

Schermate principali:

- Login/Signup — form base, salvataggio token
- Home — lista post (GET /posts), scroll verticale
- Nuovo post — editor semplice, invio via API
- Post dettaglio — mostra contenuto, commenti, pulsante like
- Profilo utente — info e lista dei suoi post
- Profilo personale — modifiche per l'utente loggato

---

## Note e next steps

- Implementare prima il backend (auth + CRUD post), poi collegare il frontend.
- Aggiungere test minimi per API (auth, create post, get posts).
- Se c'è tempo: aggiungere like, commenti, upload immagini.
