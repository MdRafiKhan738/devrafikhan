import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import sanitizeHtml from "sanitize-html";

const app = express();
const PORT = Number(process.env.PORT || 5050);
const origins = (process.env.CLIENT_URL || "").split(",").map(v => v.trim()).filter(Boolean);

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin(origin, cb) {
    if (!origin || !origins.length || origins.includes(origin)) return cb(null, true);
    return cb(new Error("Origin not allowed"));
  },
  credentials: true
}));
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15, standardHeaders: true, legacyHeaders: false });
const publicLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 40, standardHeaders: true, legacyHeaders: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
  category: { type: String, trim: true }, year: { type: String, trim: true }, client: { type: String, trim: true }, role: { type: String, trim: true },
  summary: { type: String, trim: true, maxlength: 400 }, description: { type: String, trim: true, maxlength: 1500 },
  fullDescription: { type: String, trim: true, maxlength: 20000 }, overview: String, challenge: String, solution: String,
  heroImage: String, thumbnail: String, gallery: { type: [String], default: [] }, liveUrl: String, githubUrl: String,
  tags: { type: [String], default: [] }, features: { type: [String], default: [] }, results: { type: [String], default: [] }, metrics: { type: [String], default: [] },
  featured: { type: Boolean, default: false, index: true }, published: { type: Boolean, default: true, index: true }, order: { type: Number, default: 0, index: true },
  seoTitle: String, seoDescription: String
}, { timestamps: true });
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 }, slug: { type: String, required: true, unique: true, index: true, lowercase: true },
  category: String, excerpt: String, content: { type: String, maxlength: 100000 }, coverImage: String,
  author: { type: String, default: "Mohammad Rafi Khan" }, tags: { type: [String], default: [] }, readingTime: { type: Number, default: 4 },
  featured: { type: Boolean, default: false, index: true }, published: { type: Boolean, default: false, index: true }, publishedAt: Date
}, { timestamps: true });
const siteSchema = new mongoose.Schema({ key: { type: String, unique: true, index: true }, value: mongoose.Schema.Types.Mixed }, { timestamps: true });
const messageSchema = new mongoose.Schema({ name: String, email: String, company: String, projectType: String, budget: String, message: String, status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new", index: true } }, { timestamps: true });
const guestSchema = new mongoose.Schema({ name: String, email: String, website: String, message: String, status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true } }, { timestamps: true });
const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true, index: true, lowercase: true }, passwordHash: String, role: { type: String, enum: ["admin", "editor", "guest"], default: "guest" }, isActive: { type: Boolean, default: true }, lastLoginAt: Date }, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
const Site = mongoose.models.SiteContent || mongoose.model("SiteContent", siteSchema);
const Message = mongoose.models.ContactMessage || mongoose.model("ContactMessage", messageSchema);
const Guest = mongoose.models.Guestbook || mongoose.model("Guestbook", guestSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const slugify = value => String(value || "").trim().toLowerCase().replace(/[^a-z0-9\\s-]/g, "").replace(/\\s+/g, "-").replace(/-+/g, "-");
const emailOk = value => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(value || ""));
const cleanArticle = value => sanitizeHtml(String(value || ""), {
  allowedTags: ["p", "h2", "h3", "h4", "strong", "em", "ul", "ol", "li", "a", "blockquote", "code", "pre", "br", "hr", "img"],
  allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt", "width", "height"] },
  allowedSchemes: ["http", "https", "mailto"]
});
const makeToken = user => jwt.sign({ id: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "2d" });
const auth = (req, res, next) => { try { req.user = jwt.verify(String(req.headers.authorization || "").replace(/^Bearer\\s+/, ""), process.env.JWT_SECRET); next(); } catch { res.status(401).json({ success: false, message: "Authentication required" }); } };
const editor = (req, res, next) => ["admin", "editor"].includes(req.user?.role) ? next() : res.status(403).json({ success: false, message: "Insufficient permissions" });

async function seed() {
  const defaults = {
    name: "Mohammad Rafi Khan", role: "Full-Stack Software Engineer", email: process.env.PUBLIC_EMAIL || "", phone: process.env.PUBLIC_PHONE || "+880 1831-624571", location: "Dhaka, Bangladesh",
    socials: { github: "https://github.com/MdRafiKhan738", linkedin: "", facebook: "", whatsapp: process.env.PUBLIC_PHONE ? "https://wa.me/" + String(process.env.PUBLIC_PHONE).replace(/\\D/g, "") : "", x: "", youtube: "" },
    stack: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Redis", "React Native", "TypeScript", "Git", "VS Code"],
    heroCopy: { eyebrow: "Hi, I’m Mohammad Rafi Khan", titleLineOne: "Full-Stack", titleLineTwo: "Software Engineer", description: "I build modern web applications, SaaS products and backend systems with clean architecture and practical UX.", quote: "I help founders ship software that scales without leaving a fragile MVP behind." },
    portraitImage: "assets/images/rafi-portrait.webp.b64", portraitColorImage: "assets/images/rafi-portrait.webp.b64", collabImage: "assets/images/rafi-portrait.webp.b64", signature: "Rafi Khan"
  };
  for (const [key, value] of Object.entries(defaults)) await Site.findOneAndUpdate({ key }, { key, value }, { upsert: true, setDefaultsOnInsert: true });
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && !await User.exists({ role: "admin" })) await User.create({ name: "Rafi Admin", email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: "admin" });
  if (!await Project.exists({ slug: "webin-business-website" })) await Project.insertMany([
    { title: "Webin — Business Website", slug: "webin-business-website", category: "Web Development", year: "2026", summary: "A conversion-first agency website.", description: "Editorial layout, motion and responsive sections.", heroImage: "https://developerrafikhan.vercel.app/assets/images/projects/softunebd/hero.webp", tags: ["HTML", "GSAP", "Responsive"], featured: true, order: 1 },
    { title: "OneCart — E-Commerce Platform", slug: "onecart-ecommerce", category: "Full-Stack", year: "2026", summary: "MERN commerce experience.", description: "Products, auth, cart, wishlist, reviews and orders.", heroImage: "https://developerrafikhan.vercel.app/assets/images/projects/hoteleasy/hero.webp", tags: ["React", "Node", "MongoDB"], featured: true, order: 2 },
    { title: "AI Workflow Studio", slug: "ai-workflow-studio", category: "AI / Automation", year: "2026", summary: "Lead-generation workflow tooling.", description: "Scraping, enrichment, scoring and outreach workflows.", heroImage: "https://developerrafikhan.vercel.app/assets/images/projects/zinetic/hero.webp", tags: ["AI", "Automation", "APIs"], featured: true, order: 3 },
    { title: "Shadamon Investment Platform", slug: "shadamon-investment", category: "SaaS", year: "2026", summary: "Investment marketplace.", description: "Investor and business-owner marketplace with connects and packages.", heroImage: "https://developerrafikhan.vercel.app/assets/images/projects/wonderscore/hero.webp", tags: ["MERN", "SaaS", "Admin"], featured: true, order: 4 }
  ]);
  if (!await Blog.exists({ slug: "building-software-that-lasts" })) await Blog.create({ title: "Building software that lasts beyond launch week", slug: "building-software-that-lasts", category: "Engineering", excerpt: "Architecture, communication and shipping.", content: "<p>Good software is the system your team can still understand later.</p><h2>Clarity compounds</h2><p>Small choices around boundaries, naming and observability save time later.</p>", coverImage: "https://developerrafikhan.vercel.app/assets/images/blog/blog-1.webp", published: true, publishedAt: new Date() });
}

app.get("/", (_, res) => res.json({ name: "DevRafiKhan API", status: "online" }));
app.get("/api/health", (_, res) => res.json({ success: true, database: ["disconnected", "connected", "connecting", "disconnecting"][mongoose.connection.readyState] || "unknown" }));
app.get("/api/site", async (_, res) => { const rows = await Site.find({}).lean(); res.json({ success: true, site: Object.fromEntries(rows.map(row => [row.key, row.value])) }); });
app.get("/api/projects", async (req, res) => { const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12))); const projects = await Project.find({ published: true }).sort({ featured: -1, order: 1, createdAt: -1 }).limit(limit).lean(); res.json({ success: true, projects }); });
app.get("/api/projects/:slug", async (req, res) => { const project = await Project.findOne({ slug: req.params.slug, published: true }).lean(); if (!project) return res.status(404).json({ success: false, message: "Project not found" }); res.json({ success: true, project }); });
app.get("/api/blogs", async (_, res) => res.json({ success: true, blogs: await Blog.find({ published: true }).sort({ featured: -1, publishedAt: -1, createdAt: -1 }).limit(50).lean() }));
app.get("/api/blogs/:slug", async (req, res) => { const blog = await Blog.findOne({ slug: req.params.slug, published: true }).lean(); if (!blog) return res.status(404).json({ success: false, message: "Post not found" }); res.json({ success: true, blog }); });

app.post("/api/auth/signup", authLimiter, async (req, res) => { const { name, email, password } = req.body || {}; if (!name || !emailOk(email) || String(password || "").length < 8) return res.status(400).json({ success: false, message: "Use a valid email and a password with at least 8 characters" }); const normalized = email.toLowerCase(); if (await User.exists({ email: normalized })) return res.status(409).json({ success: false, message: "Account already exists" }); const user = await User.create({ name, email: normalized, passwordHash: await bcrypt.hash(password, 12) }); res.status(201).json({ success: true, token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } }); });
app.post("/api/auth/login", authLimiter, async (req, res) => { const normalized = String(req.body?.email || "").toLowerCase(); const user = await User.findOne({ email: normalized }); if (!user || !user.isActive || !(await bcrypt.compare(req.body?.password || "", user.passwordHash))) return res.status(401).json({ success: false, message: "Invalid credentials" }); user.lastLoginAt = new Date(); await user.save(); res.json({ success: true, token: makeToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } }); });
app.get("/api/auth/me", auth, (req, res) => res.json({ success: true, user: req.user }));

app.post("/api/contact", publicLimiter, async (req, res) => { const { name, email, company, projectType, budget, message, website } = req.body || {}; if (website) return res.json({ success: true }); if (!name || !emailOk(email) || !message) return res.status(400).json({ success: false, message: "Name, valid email and message are required" }); const created = await Message.create({ name, email, company, projectType, budget, message }); res.status(201).json({ success: true, id: created._id }); });
app.get("/api/guestbook", async (_, res) => res.json({ success: true, entries: await Guest.find({ status: "approved" }).sort({ createdAt: -1 }).limit(40).lean() }));
app.post("/api/guestbook", publicLimiter, async (req, res) => { const { name, email, website, message } = req.body || {}; if (!name || !message) return res.status(400).json({ success: false, message: "Name and message are required" }); await Guest.create({ name, email, website, message }); res.status(201).json({ success: true, message: "Submitted for approval." }); });

app.use("/api/admin", auth, editor);
app.get("/api/admin/data", async (_, res) => res.json({ success: true, projects: await Project.find({}).sort({ order: 1, createdAt: -1 }).lean(), blogs: await Blog.find({}).sort({ publishedAt: -1, createdAt: -1 }).lean(), messages: await Message.find({}).sort({ createdAt: -1 }).lean(), guestbook: await Guest.find({}).sort({ createdAt: -1 }).lean() }));
app.post("/api/admin/projects", async (req, res) => { const data = { ...req.body, slug: slugify(req.body?.slug || req.body?.title) }; if (!data.title || !data.slug) return res.status(400).json({ success: false, message: "Title and slug are required" }); if (await Project.exists({ slug: data.slug })) return res.status(409).json({ success: false, message: "Slug already exists" }); const project = await Project.create(data); res.status(201).json({ success: true, project }); });
app.put("/api/admin/projects/:id", async (req, res) => { const data = { ...req.body }; if (data.slug) data.slug = slugify(data.slug); const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).lean(); if (!project) return res.status(404).json({ success: false, message: "Project not found" }); res.json({ success: true, project }); });
app.delete("/api/admin/projects/:id", async (req, res) => { await Project.findByIdAndDelete(req.params.id); res.json({ success: true }); });
app.post("/api/admin/blogs", async (req, res) => { const data = { ...req.body, slug: slugify(req.body?.slug || req.body?.title), content: cleanArticle(req.body?.content), published: !!req.body?.published, publishedAt: req.body?.published ? new Date() : undefined }; if (!data.title || !data.slug) return res.status(400).json({ success: false, message: "Title and slug are required" }); const blog = await Blog.create(data); res.status(201).json({ success: true, blog }); });
app.put("/api/admin/blogs/:id", async (req, res) => { const data = { ...req.body }; if (data.slug) data.slug = slugify(data.slug); if (data.content !== undefined) data.content = cleanArticle(data.content); if (data.published && !data.publishedAt) data.publishedAt = new Date(); const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).lean(); if (!blog) return res.status(404).json({ success: false, message: "Post not found" }); res.json({ success: true, blog }); });
app.delete("/api/admin/blogs/:id", async (req, res) => { await Blog.findByIdAndDelete(req.params.id); res.json({ success: true }); });
app.put("/api/admin/site", async (req, res) => { for (const [key, value] of Object.entries(req.body || {})) await Site.findOneAndUpdate({ key }, { key, value }, { upsert: true }); res.json({ success: true }); });
app.put("/api/admin/messages/:id", async (req, res) => res.json({ success: true, message: await Message.findByIdAndUpdate(req.params.id, { status: req.body?.status }, { new: true }).lean() }));
app.put("/api/admin/guestbook/:id", async (req, res) => { const status = ["pending", "approved", "rejected"].includes(req.body?.status) ? req.body.status : (req.body?.approved ? "approved" : "pending"); res.json({ success: true, entry: await Guest.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean() }); });

app.use((err, _, res, __) => { console.error(err); res.status(500).json({ success: false, message: "Internal server error" }); });
const dbReady = mongoose.connect(process.env.MONGODB_URI).then(seed);
if (!process.env.VERCEL) {
  dbReady.then(() => app.listen(PORT, () => console.log("DevRafiKhan API running on " + PORT))).catch(error => { console.error(error); process.exit(1); });
}
export default async function handler(req, res) {
  await dbReady;
  return app(req, res);
}
