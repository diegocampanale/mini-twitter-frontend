import { Router } from 'express';
import healthRouter from './health.js';
import usersRouter from './users.js';
import postsRouter from './posts.js';
import commentsRouter from './comments.js';
import likesRouter from './likes.js';
import authRouter from './auth.js';

const api = Router();
api.use(healthRouter);
api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/posts', postsRouter);
api.use('/comments', commentsRouter);
api.use('/likes', likesRouter);

export default api;

