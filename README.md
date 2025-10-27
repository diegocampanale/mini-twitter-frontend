# MiniTwitter Frontend

Un'applicazione social in stile Twitter/Bluesky costruita con Next.js, React, Tailwind CSS e ShadCN UI.

## 🏗️ Struttura del Progetto

Il progetto segue il pattern **Atomic Design** per organizzare i componenti:

```
components/
# MiniTwitter Frontend

Un'applicazione social in stile Twitter/Bluesky costruita con Next.js, React, Tailwind CSS e ShadCN UI.

## 🚀 Avvio rapido

```bash
# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev
```

Apri http://localhost:3000 nel browser per vedere l'app.

## 🏗️ Struttura del progetto (sintesi)

Il progetto segue il pattern Atomic Design. I componenti principali sono organizzati sotto `components/` in: `atoms`, `molecules`, `organisms` e primitive `ui` (ShadCN).

Esempio di cartelle:

```
components/
├── atoms/
├── molecules/
├── organisms/
└── ui/
```

## 📁 Route principali

- `/` - Home (feed)
- `/post` - Crea un nuovo post (contiene `PostForm`)
- `/post/[id]` - Pagina singolo post (mostra `PostCard` + commenti)
- `/user/[username]` - Profilo pubblico
- `/profile` - Profilo privato (autenticato)

## � API Routes (mock)

### GET `/api/posts`
Restituisce la lista di post (mock in-memory durante lo sviluppo).

### POST `/api/posts`
Crea un nuovo post. Body: `{ content: string, author: { username: string } }`.

### PATCH `/api/posts`
Supporta aggiornamento singolo post `{ id, content }` e rinomina bulk degli author `{ oldUsername, newUsername }`.

## 📦 Tecnologie

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- ShadCN UI
- next-themes (dark mode)
- react-markdown + remark-gfm
- lucide-react (icone)

## Note pratiche

- `PostContent` converte singoli `\n` in hard line breaks Markdown, in modo che premendo Invio nel textarea le interruzioni siano visibili nel rendering (senza installare dipendenze aggiuntive).
- La pagina singolo post passa `fullHeight` alla lista commenti così i commenti scorrono con la pagina (non in una area con altezza limitata).
- L'autenticazione è mockata via `contexts/AuthContext` e persiste in `localStorage`.

## Prossimi passi consigliati

- Integrare un backend reale (Supabase/Postgres) per persistenza
- Implementare autenticazione reale (sessioni/JWT)
- Aggiungere tests e CI

---
Per dettagli sui componenti vedi `COMPONENTS.md`.
# Esempio: aggiungere il componente Input
