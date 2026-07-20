import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL: BASE, withCredentials: true });

// Attach JWT from localStorage
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("portfolio_token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

// Redirect to login on 401
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("portfolio_token");
            window.location.href = "/admin/login";
        }
        return Promise.reject(err);
    },
);

// ── Auth ─────────────────────────────────────────────────────────────
export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    getMe: () => api.get("/auth/me"),
    changePassword: (data) => api.post("/auth/change-password", data),
};

// ── Site Config ──────────────────────────────────────────────────────
export const configAPI = {
    get: () => api.get("/site-config"),
    update: (data) => api.put("/site-config", data),
    uploadProfile: (formData) =>
        api.post("/site-config/upload-profile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};

// ── Projects ─────────────────────────────────────────────────────────
export const projectsAPI = {
    getAll: (params) => api.get("/projects", { params }),
    getAllAdmin: () => api.get("/projects/all"),
    getOne: (id) => api.get(`/projects/${id}`),
    getBySlug: (slug) => api.get(`/projects/slug/${slug}`),
    create: (formData) =>
        api.post("/projects", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, formData) =>
        api.put(`/projects/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (id) => api.delete(`/projects/${id}`),
    reorder: (orders) => api.patch("/projects/reorder", { orders }),
};

// ── Skills ───────────────────────────────────────────────────────────
export const skillsAPI = {
    getAll: () => api.get("/skills"),
    getAllAdmin: () => api.get("/skills/all"),
    create: (data) => api.post("/skills", data),
    update: (id, data) => api.put(`/skills/${id}`, data),
    delete: (id) => api.delete(`/skills/${id}`),
    reorder: (orders) => api.patch("/skills/reorder", { orders }),
};

// ── Experience ───────────────────────────────────────────────────────
export const experienceAPI = {
    getAll: () => api.get("/experience"),
    getAllAdmin: () => api.get("/experience/all"),
    // 👇 ADD HEADERS FOR FILE UPLOADS 👇
    create: (data) =>
        api.post("/experience", data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, data) =>
        api.put(`/experience/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (id) => api.delete(`/experience/${id}`),
};

// ── Contact ──────────────────────────────────────────────────────────
export const contactAPI = {
    send: (data) => api.post("/contact", data),
    getMessages: () => api.get("/contact/messages"),
    markRead: (id) => api.patch(`/contact/messages/${id}/read`),
    deleteMessage: (id) => api.delete(`/contact/messages/${id}`),
    reply: (id, data) => api.post(`/contact/messages/${id}/reply`, data),
};

// ── Resume ───────────────────────────────────────────────────────────
export const resumeAPI = {
    get: () => api.get("/resume"),
    upload: (fd) =>
        api.post("/resume/upload", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    download: () => `${BASE}/resume/download`,
};

// ── Gallery ──────────────────────────────────────────────────────────
export const galleryAPI = {
    getAll: () => api.get("/gallery"),
    upload: (fd) =>
        api.post("/gallery/upload", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (id) => api.delete(`/gallery/${id}`),
};

// ── Social Links ─────────────────────────────────────────────────────
export const socialAPI = {
    getAll: () => api.get("/social"),
    getAllAdmin: () => api.get("/social/all"),
    create: (data) => api.post("/social", data),
    update: (id, data) => api.put(`/social/${id}`, data),
    delete: (id) => api.delete(`/social/${id}`),
};

// ── Certificates ─────────────────────────────────────────────────────
export const certsAPI = {
    getAll: () => api.get("/gallery/certs"),
    getAllAdmin: () => api.get("/gallery/certs/all"),
    create: (fd) =>
        api.post("/gallery/certs", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, fd) =>
        api.put(`/gallery/certs/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (id) => api.delete(`/gallery/certs/${id}`),
};

// ── GitHub (external) ────────────────────────────────────────────────
export const githubAPI = {
    getUser: (username) =>
        axios.get(`https://api.github.com/users/${username}`),
    getRepos: (username) =>
        axios.get(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
        ),
};
export const semesterAPI = {
    getAll: () => api.get("/semesters"),
    getAllAdmin: () => api.get("/semesters/all"),
    create: (data) => api.post("/semesters", data),
    update: (id, data) => api.put(`/semesters/${id}`, data),
    delete: (id) => api.delete(`/semesters/${id}`),
};
export default api;
