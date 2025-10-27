# Struttura Componenti - Atomic Design

## 📐 Gerarchia

```
ATOMS (Atomi)
  ↓ compongono
MOLECULES (Molecole)
  ↓ compongono
ORGANISMS (Organismi)
  ↓ compongono
# Struttura componenti — Atomic Design

Questo file descrive i componenti principali del progetto seguendo il pattern Atomic Design (atoms → molecules → organisms → pages).
```

## Gerarchia

```
ATOMS → MOLECULES → ORGANISMS → PAGES
```

---

## Atomi (atoms)

Breve elenco dei componenti atomici più importanti:

- `components/atoms/Avatar.tsx` — Avatar semplice che mostra immagine o iniziale.
- `components/atoms/Icon.tsx` — Wrapper per icone (lucide-react).
- `components/atoms/Input.tsx` — Campo input con gestione errori.
- `components/atoms/TextArea.tsx` — Area di testo riutilizzabile.
- `components/atoms/Timestamp.tsx` — Formattazione e visualizzazione date.
- `components/atoms/CommentItem.tsx` — singolo commento (utente, testo, azioni).

Ogni atomo è progettato per essere indipendente, tipizzato e facilmente testabile.

---

## Molecole (molecules)

- `components/molecules/PostHeader.tsx` — Avatar + username (link a `/user/[username]`) + timestamp.
- `components/molecules/PostContent.tsx` — renderer Markdown (`react-markdown`, `remark-gfm`). Nota: il componente converte singoli `\n` in hard line breaks per rendere visibili gli Enter dell'utente.
- `components/molecules/PostActions.tsx` — like / comment / share buttons.
- `components/molecules/PostForm.tsx` — textarea + validazione + submit (usa `useAuth` e POST a `/api/posts` quando non viene passato `onSubmit`).
- `components/molecules/CommentForm.tsx` — form per inserire commenti.
- `components/molecules/CommentSection.tsx` — gestisce lista commenti e form; supporta `fullHeight` per la pagina singolo post.

---

## Organismi (organisms)

- `components/organisms/PostCard.tsx` — composizione: `PostHeader` + `PostContent` + `PostActions` (+ dialog per edit inline). Accetta `onUpdated` callback per aggiornare i dati parent dopo PATCH.
- `components/organisms/Feed.tsx` — lista di `PostCard`, fetch e gestione loading/errore.
- `components/organisms/Sidebar.tsx` — sidebar generale con overlay mobile.
- `components/organisms/AuthenticatedSidebar.tsx` — versione per utenti autenticati (mostra username, link a `/post`).
- `components/organisms/Navbar.tsx` — bottom/desktop nav responsiva.

---

## Pagine (pages)

- `app/page.tsx` — Home (feed).
- `app/post/page.tsx` — New Post (contiene `PostForm`).
- `app/post/[id]/page.tsx` — Pagina singolo post (usa `PostCard` e `CommentSection fullHeight`).
- `app/user/[username]/page.tsx` — Profilo pubblico.

---

## Best practices (rapido promemoria)

- Atomi: nessuna logica di business, solo presentazione.
- Molecole: compongono atomi e gestiscono interazioni leggere.
- Organismi: autonome, possono mantenere stato locale.
- Import: usare alias `@/` per percorsi assoluti.

---

## Flusso dati tipico

```
API (/api/posts) → Feed → PostCard → PostHeader + PostContent + PostActions
```

Per dettagli di utilizzo vedi i singoli file sotto `components/`.
