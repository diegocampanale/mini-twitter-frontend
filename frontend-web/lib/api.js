
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (res.status === 204 || res.status === 205) {
    return {}; 
  }
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Errore API');
    err.status = res.status;
    throw err;
  }
  return data;
}

// === AUTENTICAZIONE ===
export function login(username, password) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export function verifyOTP(tempToken, otpCode) {
  return apiFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ temp_token: tempToken, otp_token: otpCode })
  });
}

export function signup(username, email, password) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password })
  });
}

export function getOTPSetup(token) {
  return apiFetch('/auth/otp/setup', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getOTPStatus(token) {
  return apiFetch('/auth/otp/status', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

// === POSTS ===
export async function getPosts(options = {}) {
  const { limit = 20, offset = 0, user_id } = options;
  let url = `/posts?limit=${limit}&offset=${offset}`;
  if (user_id) url += `&user_id=${user_id}`;
  
  const response = await apiFetch(url);
  const items = response.items || [];
  
  return items.map(post => ({
    id: post.id,
    content: post.content,
    createdAt: post.created_at,
    author: post.users ? { username: post.users.username } : undefined,
    user_id: post.user_id
  }));
}

export async function getPost(id) {
  const post = await apiFetch(`/posts/${id}`);
  return {
    id: post.id,
    content: post.content,
    createdAt: post.created_at,
    author: post.users ? { username: post.users.username } : undefined,
    user_id: post.user_id
  };
}

export function createPost(postData, token) {
  return apiFetch('/posts', {
    method: 'POST',
    body: JSON.stringify({
      user_id: postData.user_id,
      content: postData.content
    }),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function updatePost(id, updates, token) {
  return apiFetch(`/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function deletePost(id, token) {
  return apiFetch(`/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

// === USERS ===
export function getUsers(options = {}) {
  const { limit = 20, offset = 0, q } = options;
  let url = `/users?limit=${limit}&offset=${offset}`;
  if (q) url += `&q=${encodeURIComponent(q)}`;
  return apiFetch(url);
}

export function getUser(id) {
  return apiFetch(`/users/${id}`);
}

export function getMe(token) {
  return apiFetch('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function updateUser(id, updates, token) {
  return apiFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function getUserByUsername(username) {
  try {
    const allUsers = await getUsers({ limit: 1000 });
    const user = allUsers.items?.find(u => u.username === username);
    
    if (!user) {
      throw new Error('Utente non trovato');
    }
    
    return await getUser(user.id);
  } catch (error) {
    console.error('Errore nel caricamento utente:', error);
    throw error;
  }
}

// === COMMENTS ===
export function getComments(postId = '', options = {}) {
  const { limit = 20, offset = 0 } = options;
  let url = '/comments';
  
  if (postId) {
    url += `?post_id=${postId}`;
  } else {
    url += '?';
  }
  
  url += `&limit=${limit}&offset=${offset}`;
  return apiFetch(url);
}

export function createComment(postId, userId, content) {
  const token = sessionStorage.getItem('authToken');
  return apiFetch('/comments', {
    method: 'POST',
    body: JSON.stringify({ post_id: postId, user_id: userId, content }),
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}

export function deleteComment(id, token) {
  return apiFetch(`/comments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export function getUserComments(userId, options = {}) {
  const { limit = 20, offset = 0 } = options;
  return apiFetch(`/comments?user_id=${userId}&limit=${limit}&offset=${offset}`);
}

// === STATISTICHE - SINGOLA DEFINIZIONE ===
export async function getUserStats(userId) {
  try {
    const [postsResponse, likesResponse] = await Promise.all([
      apiFetch(`/posts?user_id=${userId}&limit=1&count=true`),
      apiFetch(`/likes?user_id=${userId}&count=true`)
    ]);
    
    const allCommentsResponse = await getComments('');
    const userCommentsCount = (allCommentsResponse.items || []).filter(
      comment => comment.user_id === userId
    ).length;
    
    return {
      postsCount: postsResponse.count || 0,
      commentsCount: userCommentsCount,
      likesCount: likesResponse.count || 0
    };
  } catch (error) {
    console.error('Errore nel caricamento statistiche:', error);
    return {
      postsCount: 0,
      commentsCount: 0,
      likesCount: 0
    };
  }
}

// === LIKES ===
export function getLikes(postId, options = {}) {
  const { userId, count = false } = options;
  let url = `/likes?post_id=${postId}`;
  if (userId) url += `&user_id=${userId}`;
  if (count) url += `&count=true`;
  
  return apiFetch(url);
}

export function addLike(postId, userId) {
  const token = sessionStorage.getItem('authToken');
  return apiFetch('/likes', {
    method: 'POST',
    body: JSON.stringify({ post_id: postId, user_id: userId }),
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
}

export async function removeLike(postId, userId) {
  const token = sessionStorage.getItem('authToken');
  try {
    const response = await apiFetch('/likes', {
      method: 'DELETE',
      body: JSON.stringify({ post_id: postId, user_id: userId }),
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response || { success: true };
  } catch (error) {
    console.error('Errore nella rimozione like:', error);
    throw error;
  }
}

export async function toggleLike(postId, userId) {
  try {
    const existingLikes = await getLikes(postId, { userId });
    const alreadyLiked = existingLikes.items && existingLikes.items.length > 0;
    
    if (alreadyLiked) {
      return await removeLike(postId, userId);
    } else {
      return await addLike(postId, userId);
    }
  } catch (error) {
    console.error('Errore in toggleLike:', error);
    throw error;
  }
}

export async function checkUserLike(postId, userId) {
  return getLikes(postId, { userId });
}

export async function getLikedPosts(userId, options = {}) {
  const { limit = 20, offset = 0 } = options;
  
  const likesResponse = await apiFetch(`/likes?user_id=${userId}&limit=${limit}&offset=${offset}`);
  const likes = likesResponse.items || [];
  
  const postPromises = likes.map(like => 
    getPost(like.post_id).catch(err => {
      console.error(`Errore nel caricamento post ${like.post_id}:`, err);
      return null;
    })
  );
  
  const posts = await Promise.all(postPromises);
  const validPosts = posts.filter(post => post !== null);
  
  return validPosts.map(post => ({
    ...post,
    likedByUser: true
  }));
}

export async function getLikesCount(userId) {
  const response = await apiFetch(`/likes?user_id=${userId}&count=true`);
  return response.count || 0;
}

export async function getReceivedLikes(userId, options = {}) {
  const { limit = 50, offset = 0 } = options;
  
  try {
    const userPostsResponse = await getPosts();
    const userPosts = userPostsResponse.filter((post) => post.user_id === userId);
    
    const likesPromises = userPosts.map(async (post) => {
      try {
        const likesResponse = await getLikes(post.id);
        const likes = likesResponse.items || [];
        
        const receivedLikes = likes.filter((like) => like.user_id !== userId);
        
        return {
          post,
          likes: receivedLikes,
          totalReceivedLikes: receivedLikes.length
        };
      } catch (error) {
        console.error(`Errore nel caricamento like per post ${post.id}:`, error);
        return { post, likes: [], totalReceivedLikes: 0 };
      }
    });
    
    const postsWithLikes = await Promise.all(likesPromises);
    const postsWithReceivedLikes = postsWithLikes.filter(item => item.totalReceivedLikes > 0);
    
    return postsWithReceivedLikes;
  } catch (error) {
    console.error('Errore nel caricamento like ricevuti:', error);
    throw error;
  }
}