# Struttura Componenti - Atomic Design

## 📐 Gerarchia

```
ATOMS (Atomi)
  ↓ compongono
MOLECULES (Molecole)
  ↓ compongono
ORGANISMS (Organismi)
  ↓ compongono
TEMPLATES/PAGES (Pagine)
```

---

## ⚛️ ATOMS (Atomi)

### Avatar
**Path:** `components/atoms/Avatar.tsx`

**Props:**
- `username?: string` - Nome utente per mostrare l'iniziale
- `src?: string` - URL immagine avatar
- `size?: "sm" | "md" | "lg"` - Dimensione (default: "md")
- `alt?: string` - Testo alternativo

**Uso:**
```tsx
<Avatar username="francesco" size="md" />
```

---

### Icon
**Path:** `components/atoms/Icon.tsx`

**Props:**
- `name: "heart" | "comment" | "share" | "more"` - Nome icona
- `size?: number` - Dimensione in pixel (default: 16)
- `className?: string` - Classi CSS aggiuntive

**Uso:**
```tsx
<Icon name="heart" size={20} className="text-red-500" />
```

---

### Timestamp
**Path:** `components/atoms/Timestamp.tsx`

**Props:**
- `date?: string` - Data ISO string
- `className?: string` - Classi CSS aggiuntive

**Uso:**
```tsx
<Timestamp date="2025-10-25T10:00:00Z" />
```

---

### Input
**Path:** `components/atoms/Input.tsx`

**Props:**
- Tutti i props di `HTMLInputElement`
- `error?: string` - Messaggio di errore da mostrare

**Uso:**
```tsx
<Input 
  type="email" 
  placeholder="Email" 
  error="Email non valida" 
/>
```

---

### TextArea
**Path:** `components/atoms/TextArea.tsx`

**Props:**
- Tutti i props di `HTMLTextAreaElement`
- `error?: string` - Messaggio di errore da mostrare

**Uso:**
```tsx
<TextArea 
  rows={6} 
  placeholder="Scrivi qualcosa..." 
  error="Campo obbligatorio" 
/>
```

---

### ThemeToggle
**Path:** `components/atoms/ThemeToggle.tsx`

**Props:** Nessuna

**Uso:**
```tsx
<ThemeToggle />
```

**Funzionalità:**
- Toggle tra light/dark mode
- Usa `next-themes` per gestire il tema
- Icone animate (Sun/Moon)
- Evita flash durante hydration

---

## 🧬 MOLECULES (Molecole)

### PostHeader
**Path:** `components/molecules/PostHeader.tsx`

**Composizione:** Avatar + Username + Timestamp

**Props:**
```ts
{
  author?: {
    username?: string;
    avatar?: string;
  };
  createdAt?: string;
}
```

**Uso:**
```tsx
<PostHeader 
  author={{ username: "francesco" }} 
  createdAt="2025-10-25T10:00:00Z" 
/>
```

---

### PostContent
**Path:** `components/molecules/PostContent.tsx`

**Composizione:** Markdown renderer con `react-markdown`

**Props:**
- `content: string` - Contenuto Markdown da renderizzare

**Uso:**
```tsx
<PostContent content="**Ciao** mondo!" />
```

---

### PostActions
**Path:** `components/molecules/PostActions.tsx`

**Composizione:** Like + Comment + Share buttons (usa Icon)

**Props:**
```ts
{
  postId: string;
  initialLikes?: number;
  initialComments?: number;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}
```

**Uso:**
```tsx
<PostActions 
  postId="123" 
  initialLikes={5}
  onLike={(id) => console.log('Liked', id)}
/>
```

---

### PostForm
**Path:** `components/molecules/PostForm.tsx`

**Composizione:** TextArea + Button + validazione

**Props:**
```ts
{
  onSubmit?: (content: string) => Promise<void>;
  placeholder?: string;
  submitLabel?: string;
}
```

**Uso:**
```tsx
<PostForm 
  placeholder="Cosa pensi?" 
  submitLabel="Pubblica"
  onSubmit={async (content) => { /* ... */ }}
/>
```

---

## 🏛️ ORGANISMS (Organismi)

### PostCard
**Path:** `components/organisms/PostCard.tsx`

**Composizione:** PostHeader + PostContent + PostActions

**Props:**
```ts
{
  post: {
    id: string;
    author?: { username?: string; avatar?: string };
    content: string;
    createdAt?: string;
    likes?: number;
    comments?: number;
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}
```

**Uso:**
```tsx
<PostCard 
  post={{
    id: "1",
    author: { username: "francesco" },
    content: "Ciao!",
    createdAt: "2025-10-25T10:00:00Z",
    likes: 5
  }}
/>
```

---

### Feed
**Path:** `components/organisms/Feed.tsx`

**Composizione:** Lista di PostCard + loading/error states

**Props:**
- `apiEndpoint?: string` - Endpoint API (default: "/api/posts")

**Uso:**
```tsx
<Feed apiEndpoint="/api/posts" />
```

**Funzionalità:**
- Fetch automatico dei post
- Loading state
- Error handling
- Lista di PostCard

---

### Navbar
**Path:** `components/organisms/Navbar.tsx`

**Composizione:** Links + Button (from ShadCN)

**Props:** Nessuna (componente statico)

**Uso:**
```tsx
<Navbar />
```

**Funzionalità:**
- Logo/brand
- Links di navigazione (Home, Esplora)
- Pulsanti azione (Nuovo Post, Login)
- Sticky top

---

## 📄 PAGES (Pagine)

### Home Page
**Path:** `app/page.tsx`

**Composizione:** Navbar + Feed

---

### New Post Page
**Path:** `app/post/page.tsx`

**Composizione:** Navbar + PostForm

---

## 🎨 Best Practices

1. **Atomi** devono essere:
   - Indipendenti e riutilizzabili
   - Senza logica di business
   - Altamente configurabili via props

2. **Molecole** devono:
   - Combinare 2+ atomi
   - Avere una funzione specifica
   - Gestire interazioni semplici

3. **Organismi** devono:
   - Essere autonomi e completi
   - Gestire stato locale se necessario
   - Coordinare molecole e atomi

4. **Import convention:**
   ```tsx
   // Sempre usare path alias @/
   import Avatar from "@/components/atoms/Avatar";
   import PostHeader from "@/components/molecules/PostHeader";
   import PostCard from "@/components/organisms/PostCard";
   ```

5. **Naming:**
   - PascalCase per componenti
   - File name = Component name
   - Props type: `ComponentNameProps`

---

## 🔄 Flusso Dati Tipico

```
API (/api/posts)
  ↓ fetch
Feed (organism)
  ↓ map
PostCard (organism)
  ↓ compone
PostHeader (molecule) + PostContent (molecule) + PostActions (molecule)
  ↓ usano
Avatar (atom) + Timestamp (atom) + Icon (atom)
```
