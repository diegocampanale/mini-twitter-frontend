-- UUID
create extension if not exists pgcrypto;

-- USERS
create table public.users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  email         text not null unique,
  password_hash text not null,
  bio           text,
);

create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);
create index on public.posts(user_id, created_at desc);

-- COMMENTI
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);
create index on public.comments(post_id, created_at);

create table public.likes (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id) -- niente doppi like sullo stesso post
);

create index on public.likes(post_id);






POPOLAZIONE DB
-- === USERS ===
insert into public.users (username, email, password_hash, bio)
values
  ('francesco', 'francesco@example.com', 'password_hash', 'Ciao, sono Francesco'),
  ('simona',     'simona@example.com', 'password_hash', 'Appassionata di viaggi')
on conflict (username) do nothing;

-- === POSTS ===
-- Post di Francesco
select u.id, 'Ciao a tutti! 🎉'
from public.users u
where u.username = 'francesco'
  and not exists (
    select 1 from public.posts p
    where p.user_id = u.id and p.content = 'Ciao a tutti! 🎉'
-- Post di Simona
# Creazione DB (schema e popolazione)

Questo file contiene uno schema SQL di esempio per lo sviluppo locale (Postgres) e istruzioni per popolare il database con alcuni record di prova.

## Schema (Postgres)

```sql
-- Abilita estensione per generare UUID
create extension if not exists pgcrypto;

-- USERS
create table public.users (
  id            uuid primary key default gen_random_uuid(),
  username      text not null unique,
  email         text not null unique,
  password_hash text not null,
  bio           text,
  created_at    timestamptz not null default now()
);

-- POSTS
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);
create index on public.posts(user_id, created_at desc);

-- COMMENTS
create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now()
);
create index on public.comments(post_id, created_at desc);

-- LIKES
create table public.likes (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id) -- evita doppi like
);
create index on public.likes(post_id);
create index on public.likes(user_id);
```

## Popolazione di esempio

```sql
-- USERS
insert into public.users (username, email, password_hash, bio)
values
  ('francesco', 'francesco@example.com', 'password_hash', 'Ciao, sono Francesco'),
  ('simona',     'simona@example.com', 'password_hash', 'Appassionata di viaggi')
on conflict (username) do nothing;

-- POSTS di esempio
insert into public.posts (user_id, content)
select u.id, 'Ciao a tutti! 🎉'
from public.users u
where u.username = 'francesco'
  and not exists (
    select 1 from public.posts p
    where p.user_id = u.id and p.content = 'Ciao a tutti! 🎉'
  );

insert into public.posts (user_id, content)
select u.id, 'Primo post di Simona :)'
from public.users u
where u.username = 'simona'
  and not exists (
    select 1 from public.posts p
    where p.user_id = u.id and p.content = 'Primo post di Simona :)'
  );

-- COMMENTI di esempio
insert into public.comments (post_id, user_id, content)
select p.id, u2.id, 'Bel post!'
from public.posts p
join public.users u1 on u1.id = p.user_id and u1.username = 'francesco'
join public.users u2 on u2.username = 'simona'
where p.content = 'Ciao a tutti! 🎉'
  and not exists (
    select 1 from public.comments c
    where c.post_id = p.id and c.user_id = u2.id and c.content = 'Bel post!'
  );

insert into public.comments (post_id, user_id, content)
select p.id, u2.id, 'Benvenuta!'
from public.posts p
join public.users u1 on u1.id = p.user_id and u1.username = 'simona'
join public.users u2 on u2.username = 'francesco'
where p.content = 'Primo post di Simona :)'
  and not exists (
    select 1 from public.comments c
    where c.post_id = p.id and c.user_id = u2.id and c.content = 'Benvenuta!'
  );

-- LIKES di esempio
insert into public.likes (post_id, user_id)
select p.id, u2.id
from public.posts p
join public.users u1 on u1.id = p.user_id and u1.username = 'francesco'
join public.users u2 on u2.username = 'simona'
where p.content = 'Ciao a tutti! 🎉'
  and not exists (
    select 1 from public.likes l
    where l.post_id = p.id and l.user_id = u2.id
  );

insert into public.likes (post_id, user_id)
select p.id, u2.id
from public.posts p
join public.users u1 on u1.id = p.user_id and u1.username = 'simona'
join public.users u2 on u2.username = 'francesco'
where p.content = 'Primo post di Simona :)'
  and not exists (
    select 1 from public.likes l
    where l.post_id = p.id and l.user_id = u2.id
  );
```

---

## Postman collection (esempio)

Di seguito è fornito un estratto della collection Postman utile per testare le API (creazione utenti, post, commenti, like). Per comodità la collection completa è in formato JSON nel repository.

```json
{
  "info": { "name": "MiniTwitter API - Esempio" },
  "item": [
    { "name": "Create User", "request": { "method": "POST", "body": { "raw": "{ \"username\": \"francesco\" }" } } }
  ]
}
```

---

Se vuoi, posso: aggiungere uno script SQL per teardown, generare una dump più completa, oppure esportare la Postman collection completa in `postman_collection.json`.
              "script": {
                "exec": [
                  "pm.test('Status 201', () => pm.response.to.have.status(201));",
                  "const json = pm.response.json();",
                  "pm.environment.set('userId2', json.id);"
                ],
                "type": "text/javascript"
              }
            }
          ]
        },
        {
          "name": "List Users",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/users?limit=10&offset=0", "host": ["{{baseUrl}}"], "path": ["users"], "query": [{ "key": "limit", "value": "10" }, { "key": "offset", "value": "0" }] }
          },
          "response": []
        },
        {
          "name": "Get User by ID ({{userId}})",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/users/{{userId}}", "host": ["{{baseUrl}}"], "path": ["users", "{{userId}}"] }
          },
          "response": []
        },
        {
          "name": "Update User ({{userId}})",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/users/{{userId}}", "host": ["{{baseUrl}}"], "path": ["users", "{{userId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"bio\": \"Bio aggiornata\"\n}" }
          },
          "response": []
        },
        {
          "name": "Delete User ({{userId2}}) (facoltativo)",
          "request": {
            "method": "DELETE",
            "url": { "raw": "{{baseUrl}}/users/{{userId2}}", "host": ["{{baseUrl}}"], "path": ["users", "{{userId2}}"] }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Posts",
      "item": [
        {
          "name": "Create Post (by {{userId}})",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/posts", "host": ["{{baseUrl}}"], "path": ["posts"] },
            "body": { "mode": "raw", "raw": "{\n  \"user_id\": \"{{userId}}\",\n  \"content\": \"Ciao a tutti! 🎉\"\n}" }
          },
          "response": [],
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status 201', () => pm.response.to.have.status(201));",
                  "const json = pm.response.json();",
                  "pm.environment.set('postId', json.id);"
                ],
                "type": "text/javascript"
              }
            }
          ]
        },
        {
          "name": "List Posts",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/posts?limit=10&offset=0", "host": ["{{baseUrl}}"], "path": ["posts"], "query": [{ "key": "limit", "value": "10" }, { "key": "offset", "value": "0" }] }
          },
          "response": []
        },
        {
          "name": "List Posts by User ({{userId}})",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/posts?user_id={{userId}}&limit=10&offset=0", "host": ["{{baseUrl}}"], "path": ["posts"], "query": [{ "key": "user_id", "value": "{{userId}}" }, { "key": "limit", "value": "10" }, { "key": "offset", "value": "0" }] }
          },
          "response": []
        },
        {
          "name": "Get Post ({{postId}})",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/posts/{{postId}}", "host": ["{{baseUrl}}"], "path": ["posts", "{{postId}}"] }
          },
          "response": []
        },
        {
          "name": "Update Post ({{postId}})",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/posts/{{postId}}", "host": ["{{baseUrl}}"], "path": ["posts", "{{postId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"content\": \"Post aggiornato\"\n}" }
          },
          "response": []
        },
        {
          "name": "Delete Post ({{postId}}) (facoltativo)",
          "request": {
            "method": "DELETE",
            "url": { "raw": "{{baseUrl}}/posts/{{postId}}", "host": ["{{baseUrl}}"], "path": ["posts", "{{postId}}"] }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Comments",
      "item": [
        {
          "name": "Create Comment (by {{userId2}} on {{postId}})",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/comments", "host": ["{{baseUrl}}"], "path": ["comments"] },
            "body": { "mode": "raw", "raw": "{\n  \"post_id\": \"{{postId}}\",\n  \"user_id\": \"{{userId2}}\",\n  \"content\": \"Bel post!\"\n}" }
          },
          "response": [],
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status 201', () => pm.response.to.have.status(201));",
                  "const json = pm.response.json();",
                  "pm.environment.set('commentId', json.id);"
                ],
                "type": "text/javascript"
              }
            }
          ]
        },
        {
          "name": "List Comments (by post {{postId}})",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/comments?post_id={{postId}}", "host": ["{{baseUrl}}"], "path": ["comments"], "query": [{ "key": "post_id", "value": "{{postId}}" }] }
          },
          "response": []
        },
        {
          "name": "Get Comment ({{commentId}})",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/comments/{{commentId}}", "host": ["{{baseUrl}}"], "path": ["comments", "{{commentId}}"] }
          },
          "response": []
        },
        {
          "name": "Update Comment ({{commentId}})",
          "request": {
            "method": "PATCH",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/comments/{{commentId}}", "host": ["{{baseUrl}}"], "path": ["comments", "{{commentId}}"] },
            "body": { "mode": "raw", "raw": "{\n  \"content\": \"Commento aggiornato\"\n}" }
          },
          "response": []
        },
        {
          "name": "Delete Comment ({{commentId}}) (facoltativo)",
          "request": {
            "method": "DELETE",
            "url": { "raw": "{{baseUrl}}/comments/{{commentId}}", "host": ["{{baseUrl}}"], "path": ["comments", "{{commentId}}"] }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Likes",
      "item": [
        {
          "name": "Like Post ({{postId}}, by {{userId2}})",
          "request": {
            "method": "POST",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/likes", "host": ["{{baseUrl}}"], "path": ["likes"] },
            "body": { "mode": "raw", "raw": "{\n  \"post_id\": \"{{postId}}\",\n  \"user_id\": \"{{userId2}}\"\n}" }
          },
          "response": []
        },
        {
          "name": "Unlike Post ({{postId}}, by {{userId2}})",
          "request": {
            "method": "DELETE",
            "header": [{ "key": "Content-Type", "value": "application/json" }],
            "url": { "raw": "{{baseUrl}}/likes", "host": ["{{baseUrl}}"], "path": ["likes"] },
            "body": { "mode": "raw", "raw": "{\n  \"post_id\": \"{{postId}}\",\n  \"user_id\": \"{{userId2}}\"\n}" }
          },
          "response": []
        },
        {
          "name": "List Likes (by post {{postId}})",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/likes?post_id={{postId}}", "host": ["{{baseUrl}}"], "path": ["likes"], "query": [{ "key": "post_id", "value": "{{postId}}" }] }
          },
          "response": []
        },
        {
          "name": "Count Likes ({{postId}})",
          "request": {
            "method": "GET",
            "url": { "raw": "{{baseUrl}}/likes?post_id={{postId}}&count=true", "host": ["{{baseUrl}}"], "path": ["likes"], "query": [{ "key": "post_id", "value": "{{postId}}" }, { "key": "count", "value": "true" }] }
          },
          "response": []
        }
      ]
    }
  ],
  "variable": [
    { "key": "baseUrl", "value": "http://localhost:4000/api" }
  ]
}


