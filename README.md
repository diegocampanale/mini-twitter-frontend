# MiniTwitter Frontend

Un'applicazione social in stile Twitter/Bluesky costruita con Next.js, React, Tailwind CSS e ShadCN UI.

## 🏗️ Struttura del Progetto

Il progetto segue il pattern **Atomic Design** per organizzare i componenti:

```
components/
├── atoms/           # Componenti base indivisibili
│   ├── Avatar.tsx
│   ├── Icon.tsx
│   ├── Input.tsx
│   ├── TextArea.tsx
│   └── Timestamp.tsx
│
├── molecules/       # Composizioni di atomi
│   ├── PostHeader.tsx      (Avatar + Username + Timestamp)
│   ├── PostContent.tsx     (Markdown rendering)
│   ├── PostActions.tsx     (Like, Comment, Share buttons)
│   └── PostForm.tsx        (TextArea + Submit button)
│
├── organisms/       # Componenti complessi
│   ├── PostCard.tsx        (Header + Content + Actions)
│   ├── Feed.tsx            (Lista di PostCard + loading states)
│   └── Navbar.tsx          (Navigazione principale)
│
└── ui/             # Primitive ShadCN UI
    └── button.tsx
```

## 🚀 Avvio Rapido

```bash
# Installa le dipendenze
npm install

# Avvia il dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Tecnologie

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **ShadCN UI** (componenti)
- **next-themes** (dark mode)
- **react-markdown** (rendering Markdown)
- **lucide-react** (icone)
- **Inter Variable** (font)

## 🎨 Pattern Atomic Design

### Atoms (Atomi)
Componenti indivisibili e riutilizzabili:
- `Avatar`: mostra l'avatar o l'iniziale dell'utente
- `Icon`: wrapper per le icone di lucide-react
- `Input`: campo input con gestione errori
- `TextArea`: area di testo con gestione errori
- `Timestamp`: formattazione data/ora

### Molecules (Molecole)
Combinazioni di atomi con una funzione specifica:
- `PostHeader`: avatar + nome utente + timestamp
- `PostContent`: rendering Markdown del contenuto
- `PostActions`: pulsanti like/comment/share
- `PostForm`: form per creare un nuovo post

### Organisms (Organismi)
Componenti complessi e autonomi:
- `PostCard`: card completa di un post
- `Feed`: lista di post con caricamento e gestione errori
- `Navbar`: barra di navigazione dell'app

## 🔧 Aggiungere Componenti ShadCN

Puoi aggiungere nuovi componenti UI usando il CLI di ShadCN:

```bash
# Esempio: aggiungere il componente Input
npx shadcn@latest add input

# Aggiungere Card
npx shadcn@latest add card

# Aggiungere Dialog
npx shadcn@latest add dialog
```

## 📁 Route Principali

- `/` - Home feed con tutti i post
- `/post` - Crea un nuovo post
- `/login` - Login (TODO)
- `/signup` - Registrazione (TODO)
- `/profile` - Profilo utente (TODO)
- `/user/[username]` - Profilo pubblico (TODO)

## 🔌 API Routes

### GET `/api/posts`
Ritorna la lista di tutti i post.

**Risposta:**
```json
[
  {
    "id": "1",
    "author": { "username": "francesco" },
    "content": "Ciao a tutti! 🎉",
    "createdAt": "2025-10-25T10:00:00Z"
  }
]
```

### POST `/api/posts`
Crea un nuovo post.

**Body:**
```json
{
  "content": "Il mio nuovo post",
  "author": { "username": "you" }
}
```

## 🎯 Prossimi Passi

- [ ] Implementare autenticazione (JWT + localStorage)
- [ ] Pagine login/signup
- [ ] Profilo utente modificabile
- [ ] Sistema di commenti
- [ ] Upload immagini
- [ ] Integrazione backend (Supabase o Express + PostgreSQL)
- [ ] Test unitari (Vitest + React Testing Library)

## 📝 Note di Sviluppo

- **TypeScript**: tutti i componenti sono tipizzati
- **Path Alias**: usa `@/` per importare da root (es. `@/components/atoms/Avatar`)
- **Tailwind**: configurato con tema custom e variabili CSS
- **Dark Mode**: gestita con `next-themes`, supporto light/dark/system
- **Tema Bluesky**: colori e layout ispirati a Bluesky social
- **Font Inter**: font system identico a Bluesky

## 🐛 Troubleshooting

### Errore "Unexpected token '<'"
Se vedi questo errore, verifica che:
1. Il dev server sia in esecuzione (`npm run dev`)
2. La route API esista in `app/api/posts/route.ts`
3. Il fetch punti all'URL corretto (`/api/posts`)

### Componenti non stilizzati
Assicurati che:
1. `tailwind.config.js` includa i path corretti
2. `app/globals.css` importi le direttive Tailwind
3. Il dev server sia riavviato dopo modifiche alla config

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

