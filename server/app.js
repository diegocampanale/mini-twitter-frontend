import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import apiRouter from './api/index.js';
import './auth/passport.js';

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());

    // Configurazione della sessione
    app.use(session({
        secret: process.env.SESSION_SECRET || 'P2yT7xQ4mR9sV6bN3cF1hL5gD0aWzX8j',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' }
    }));

    // Inizializzazione di Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // === (A) Elenco delle specifiche che vuoi esporre ===
    // name = slug nell'URL; displayName = etichetta nel menu di Swagger UI; file = percorso della YAML
    const docs = [
        { name: 'auth', displayName: 'Auth API', file: path.resolve('./openapi/auth.yaml') },
        { name: 'users', displayName: 'Users API', file: path.resolve('./openapi/users.yaml') },
        { name: 'posts', displayName: 'Posts API', file: path.resolve('./openapi/posts.yaml') },
        { name: 'likes', displayName: 'Likes API', file: path.resolve('./openapi/likes.yaml') },
        { name: 'comments', displayName: 'Comments API', file: path.resolve('./openapi/comments.yaml') }
    ];

    // === Endpoint che restituisce il singolo Swagger UI ===
    app.get('/api/docs/specs/:name.json', (req, res) => {
        const doc = docs.find(d => d.name === req.params.name);
        if (!doc) return res.status(404).json({ error: 'Spec not found' });

        try {
            const yamlText = fs.readFileSync(doc.file, 'utf8');
            const jsonSpec = YAML.parse(yamlText);
            res.json(jsonSpec);
        } catch (err) {
            console.error('OpenAPI load error:', err);
            res.status(500).json({ error: 'Failed to load spec' });
        }
    });

    // === Swagger UI che mostra il menu a tendina con più spec ===
    app.use(
        '/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(null, {
            explorer: true, // abilita casella di ricerca
            swaggerOptions: {
                urls: docs.map(doc => ({
                    url: `/api/docs/specs/${doc.name}.json`,
                    name: doc.displayName
                })),
                docExpansion: 'list'
            }
        })
    );

    app.use('/api', apiRouter);

    console.log('SUPABASE_URL ->', process.env.SUPABASE_URL || '(non impostata)');

    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    });

    // 404
    app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

    // error handler
    app.use((err, _req, res, _next) => {
        console.error(err);
        const status = err.status || 500;
        res.status(status).json({ error: err.message || 'Internal Server Error' });
    });

    return app;
}
