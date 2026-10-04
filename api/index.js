import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json({ limit: "7mb" }));

let connected = false;
const uri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET || "change-this-secret";

const projectSchema = new mongoose.Schema({
  title:String, slug:{type:String,unique:true}, category:String, year:String,
  summary:String, description:String, fullDescription:String, heroImage:String,
  gallery:[String], liveUrl:String, githubUrl:String, tags:[String],
  featured:{type:Boolean,default:true}, order:{type:Number,default:0}
},{timestamps:true});
const blogSchema = new mongoose.Schema({
  title:String, slug:{type:String,unique:true}, category:String, excerpt:String,
  content:String, coverImage:String, published:{type:Boolean,default:true}, publishedAt:{type:Date,default:Date.now}
},{timestamps:true});
const siteSchema = new mongoose.Schema({ key:{type:String,unique:true}, value:mongoose.Schema.Types.Mixed },{timestamps:true});
const messageSchema = new mongoose.Schema({name:String,email:String,company:String,projectType:String,message:String,status:{type:String,default:"new"}},{timestamps:true});
const guestSchema = new mongoose.Schema({name:String,email:String,message:String,approved:{type:Boolean,default:false}},{timestamps:true});
const userSchema = new mongoose.Schema({name:String,email:{type:String,unique:true},passwordHash:String,role:{type:String,default:"user"}},{timestamps:true});

const Project = mongoose.models.Project || mongoose.model("Project",projectSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog",blogSchema);
const Site = mongoose.models.Site || mongoose.model("Site",siteSchema);
const Message = mongoose.models.Message || mongoose.model("Message",messageSchema);
const Guest = mongoose.models.Guest || mongoose.model("Guest",guestSchema);
const User = mongoose.models.User || mongoose.model("User",userSchema);

async function db(){
  if(!uri) throw new Error("MONGODB_URI is not configured");
  if(!connected){ await mongoose.connect(uri); connected=true; await seed(); }
}
async function seed(){
  const defaults={name:"Mohammad Rafi Khan",role:"Full-Stack Software Engineer",email:"rafi@webin.agency",phone:"+8801831-624571",location:"Dhaka, Bangladesh",github:"https://github.com/MdRafiKhan738",linkedin:"https://www.linkedin.com/",facebook:"https://www.facebook.com/",whatsapp:"https://wa.me/8801831624571",x:"https://x.com/",stack:["React","Next.js","Node.js","Express","MongoDB","Redis","React Native","TypeScript","Git","VS Code"]};
  for(const [key,value] of Object.entries(defaults)) await Site.findOneAndUpdate({key},{key,value},{upsert:true});
  if(!await Project.exists({slug:"webin-business-website"})){
    await Project.insertMany([
      {title:"Webin — Business Website",slug:"webin-business-website",category:"Web Development",year:"2026",summary:"A conversion-first agency website.",description:"Editorial layout, motion, responsive sections and a clean conversion path.",heroImage:"https://developerrafikhan.vercel.app/assets/images/projects/softunebd/hero.webp",tags:["HTML","GSAP","Responsive"],liveUrl:"#",order:1},
      {title:"OneCart — E-Commerce Platform",slug:"onecart-ecommerce",category:"Full-Stack",year:"2026",summary:"MERN e-commerce experience.",description:"Products, auth, cart, wishlist, reviews and order flows.",heroImage:"https://developerrafikhan.vercel.app/assets/images/projects/hoteleasy/hero.webp",tags:["React","Node","MongoDB"],liveUrl:"#",order:2},
      {title:"AI Workflow Studio",slug:"ai-workflow-studio",category:"AI / Automation",year:"2026",summary:"Lead-generation workflow tooling.",description:"A practical foundation for scraping, enrichment, scoring and outreach.",heroImage:"https://developerrafikhan.vercel.app/assets/images/projects/zinetic/hero.webp",tags:["AI","Automation","APIs"],liveUrl:"#",order:3},
      {title:"Shadamon Investment Platform",slug:"shadamon-investment",category:"SaaS",year:"2026",summary:"Investment marketplace.",description:"Investor and business-owner marketplace with connects, packages, proposals and admin management.",heroImage:"https://developerrafikhan.vercel.app/assets/images/projects/wonderscore/hero.webp",tags:["MERN","SaaS","Admin"],liveUrl:"#",order:4}
    ]);
  }
  if(!await Blog.exists({slug:"building-software-that-lasts"})) await Blog.create({title:"Building software that lasts beyond launch week",slug:"building-software-that-lasts",category:"Engineering",excerpt:"Architecture, communication and shipping.",content:"<p>Good software is the system your team can still understand later.</p><h2>Clarity compounds</h2><p>Small decisions around boundaries, naming and observability save time.</p>",coverImage:"https://developerrafikhan.vercel.app/assets/images/blog/blog-1.webp"});
}
function token(u){return jwt.sign({id:u._id.toString(),role:u.role,email:u.email},jwtSecret,{expiresIn:"7d"})}
function auth(req,res,next){try{const h=req.headers.authorization||"";req.user=jwt.verify(h.replace("Bearer ",""),jwtSecret);next()}catch{res.status(401).json({message:"Unauthorized"})}}
function admin(req,res,next){if(req.user?.role!=="admin")return res.status(403).json({message:"Admin only"});next()}

app.get("/api",async(req,res)=>res.json({ok:true,name:"DevRafiKhan API"}));
app.get("/api/site",async(req,res)=>{await db();const rows=await Site.find({});const site={};rows.forEach(r=>site[r.key]=r.value);res.json({site})});
app.get("/api/projects",async(req,res)=>{await db();res.json({projects:await Project.find({}).sort({order:1,createdAt:-1})})});
app.get("/api/projects/:slug",async(req,res)=>{await db();const project=await Project.findOne({slug:req.params.slug});if(!project)return res.status(404).json({message:"Project not found"});res.json({project})});
app.get("/api/blogs",async(req,res)=>{await db();res.json({blogs:await Blog.find({published:true}).sort({publishedAt:-1})})});
app.get("/api/blogs/:slug",async(req,res)=>{await db();const blog=await Blog.findOne({slug:req.params.slug,published:true});if(!blog)return res.status(404).json({message:"Post not found"});res.json({blog})});
app.post("/api/contact",async(req,res)=>{await db();const {name,email,company,projectType,message}=req.body;if(!name||!email||!message)return res.status(400).json({message:"Name, email and message are required"});await Message.create({name,email,company,projectType,message});res.json({success:true})});
app.get("/api/guestbook",async(req,res)=>{await db();res.json({entries:await Guest.find({approved:true}).sort({createdAt:-1}).limit(40)})});
app.post("/api/guestbook",async(req,res)=>{await db();const {name,email,message}=req.body;if(!name||!message)return res.status(400).json({message:"Name and message are required"});await Guest.create({name,email,message});res.json({success:true})});
app.post("/api/auth/signup",async(req,res)=>{await db();const {name,email,password}=req.body;if(!email||!password)return res.status(400).json({message:"Email and password required"});if(await User.exists({email}))return res.status(409).json({message:"Account already exists"});const u=await User.create({name,email,passwordHash:await bcrypt.hash(password,12)});res.json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}})});
app.post("/api/auth/login",async(req,res)=>{await db();const u=await User.findOne({email:req.body.email});if(!u||!(await bcrypt.compare(req.body.password||"",u.passwordHash)))return res.status(401).json({message:"Invalid credentials"});res.json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}})});
app.get("/api/admin/data",auth,admin,async(req,res)=>{await db();res.json({projects:await Project.find({}).sort({order:1}),blogs:await Blog.find({}).sort({publishedAt:-1}),messages:await Message.find({}).sort({createdAt:-1}),guestbook:await Guest.find({}).sort({createdAt:-1})})});
app.post("/api/admin/projects",auth,admin,async(req,res)=>{await db();res.json({project:await Project.create(req.body)})});
app.put("/api/admin/projects/:id",auth,admin,async(req,res)=>{await db();res.json({project:await Project.findByIdAndUpdate(req.params.id,req.body,{new:true})})});
app.delete("/api/admin/projects/:id",auth,admin,async(req,res)=>{await db();await Project.findByIdAndDelete(req.params.id);res.json({success:true})});
app.post("/api/admin/blogs",auth,admin,async(req,res)=>{await db();res.json({blog:await Blog.create(req.body)})});
app.delete("/api/admin/blogs/:id",auth,admin,async(req,res)=>{await db();await Blog.findByIdAndDelete(req.params.id);res.json({success:true})});
app.put("/api/admin/guestbook/:id",auth,admin,async(req,res)=>{await db();res.json({entry:await Guest.findByIdAndUpdate(req.params.id,req.body,{new:true})})});
app.put("/api/admin/site",auth,admin,async(req,res)=>{await db();for(const [key,value] of Object.entries(req.body))await Site.findOneAndUpdate({key},{key,value},{upsert:true});res.json({success:true})});

if(process.env.NODE_ENV!=="production"){app.listen(process.env.PORT||5050,()=>console.log("DevRafiKhan API running"))}
export default app;
