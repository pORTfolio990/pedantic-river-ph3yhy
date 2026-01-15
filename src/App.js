import React, { useState, useEffect } from "react";
import {
  Camera,
  Mail,
  Instagram,
  Twitter,
  X,
  ChevronRight,
  Menu,
  MapPin,
  Phone,
  Trash2,
  Plus,
  Edit3,
  Save,
  Lock,
  LogOut,
  Loader2,
  UploadCloud,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

// --- DEFAULT DATA ---
const DEFAULT_PROFILE = {
  name: "ALEX R.",
  tagline: "Visual Storyteller.",
  bio: "I capture the moments that others miss. Specializing in high-contrast urban and landscape photography.",
  coverImage:
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000",
  email: "contact@alexr.com",
  phone: "+1 (555) 000-0000",
  address: "123 Creative Ave, NY",
  aboutImage:
    "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=800",
  aboutText:
    "My journey began with a cheap film camera and a desire to document the world around me. I believe that every image should evoke an emotion.",
  statYears: "5+",
  statProjects: "200+",
  statAwards: "15",
};

const Portfolio = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Password UI
  const [loginPassword, setLoginPassword] = useState("");
  const [showPasswordText, setShowPasswordText] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState(DEFAULT_PROFILE);

  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoCategory, setNewPhotoCategory] = useState("Landscape");
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    script.onload = () => setTimeout(() => setLoading(false), 800);
    document.head.appendChild(script);

    const savedProfile = localStorage.getItem("my_portfolio_profile");
    const savedPhotos = localStorage.getItem("my_portfolio_photos");
    const savedPassword = localStorage.getItem("my_admin_password");

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setTempProfile(JSON.parse(savedProfile));
    }
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }

    // CHECK URL FOR EDIT MODE (?edit=true)
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get("edit") === "true";

    if (isEditMode) {
      if (!savedPassword) {
        setShowSetupModal(true);
      } else {
        setShowLoginModal(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- IMAGE COMPRESSOR ---
  const handleImageUpload = (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        callback(canvas.toDataURL("image/jpeg", 0.8));
        setIsProcessing(false);
      };
    };
  };

  // --- ACTIONS ---
  const handleSetupPassword = (e) => {
    e.preventDefault();
    if (loginPassword.length < 4) {
      alert("Password too short");
      return;
    }
    localStorage.setItem("my_admin_password", loginPassword);
    setShowSetupModal(false);
    setIsAdmin(true);
    setLoginPassword("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem("my_admin_password");
    if (loginPassword === savedPassword) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginPassword("");
    } else {
      alert("Incorrect Password");
    }
  };

  const saveProfile = () => {
    setProfile(tempProfile);
    localStorage.setItem("my_portfolio_profile", JSON.stringify(tempProfile));
    setIsEditingProfile(false);
  };

  const addPhoto = (e) => {
    e.preventDefault();
    if (!uploadPreview) return;
    const newPhoto = {
      id: Date.now(),
      src: uploadPreview,
      title: newPhotoTitle || "Untitled",
      category: newPhotoCategory,
    };
    const updatedPhotos = [...photos, newPhoto];
    setPhotos(updatedPhotos);
    localStorage.setItem("my_portfolio_photos", JSON.stringify(updatedPhotos));
    setShowAddPhotoModal(false);
    setUploadPreview(null);
    setNewPhotoTitle("");
  };

  const deletePhoto = (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    const updatedPhotos = photos.filter((p) => p.id !== photoId);
    setPhotos(updatedPhotos);
    localStorage.setItem("my_portfolio_photos", JSON.stringify(updatedPhotos));
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const categories = ["All", "Landscape", "Portrait", "Urban", "Black & White"];
  const filteredImages =
    activeCategory === "All"
      ? photos
      : photos.filter((img) => img.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-neutral-500 text-sm tracking-widest uppercase">
          Loading Portfolio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-800 selection:text-white pb-24">
      {/* ADMIN BAR */}
      {isAdmin && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-red-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-red-700/50 animate-fade-in-up w-max max-w-[90vw] overflow-x-auto">
          <span className="font-bold text-xs tracking-wider flex items-center gap-2 text-red-200 whitespace-nowrap">
            <Lock size={12} /> OWNER
          </span>
          <div className="h-4 w-px bg-white/20"></div>
          <button
            onClick={() => setShowAddPhotoModal(true)}
            className="flex items-center gap-1 hover:text-red-300 text-xs font-bold uppercase whitespace-nowrap"
          >
            <Plus size={14} /> Add Photo
          </button>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="flex items-center gap-1 hover:text-red-300 text-xs font-bold uppercase whitespace-nowrap"
          >
            <Edit3 size={14} /> Edit Info
          </button>
          <button
            onClick={() => setIsAdmin(false)}
            className="ml-2 p-1 hover:bg-red-800 rounded-full"
          >
            <LogOut size={14} />
          </button>
        </div>
      )}

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-neutral-950/95 backdrop-blur-md border-b border-red-900/30 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <Camera className="w-6 h-6 text-red-700" />
            <span>
              {profile.name}
              <span className="text-red-800">.</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {["Portfolio", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-red-600 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-950 border-b border-neutral-800 p-6 flex flex-col gap-4 shadow-2xl">
            {["Portfolio", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-left py-2 hover:text-red-600"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-40 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/50 to-neutral-950"></div>
          <div className="absolute inset-0 bg-red-950/30 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16 w-full">
          <p className="text-red-700 font-bold tracking-[0.3em] mb-6 text-sm">
            PORTFOLIO
          </p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            {profile.name}
          </h1>
          <p className="text-2xl md:text-3xl font-light text-neutral-300 mb-8">
            {profile.tagline}
          </p>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {profile.bio}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection("portfolio")}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-red-700 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              View Work <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PORTFOLIO */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">Gallery</h2>
            <div className="h-1 w-20 bg-red-800"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-red-800 text-white"
                    : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {photos.length === 0 && (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-12 text-center">
            <Camera className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400 mb-4">Gallery is empty.</p>
            {isAdmin && (
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="text-red-500 hover:text-red-400 font-bold underline"
              >
                Add Photo
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-900 transition-colors"
            >
              <div
                onClick={() => setSelectedImage(image)}
                className="w-full h-full cursor-pointer"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-red-600 text-xs font-bold tracking-widest mb-1 uppercase">
                    {image.category}
                  </span>
                  <h3 className="text-xl font-bold">{image.title}</h3>
                </div>
              </div>
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePhoto(image.id);
                  }}
                  className="absolute top-4 right-4 bg-red-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg z-10"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT (RESTORED) */}
      <section
        id="about"
        className="py-24 bg-neutral-900 border-t border-red-900/20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[3/4] rounded-lg overflow-hidden border border-neutral-800">
                <img
                  src={profile.aboutImage}
                  alt="Photographer"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-red-800 text-white p-8 rounded-lg hidden md:block shadow-xl">
                <p className="text-3xl font-bold">{profile.statYears}</p>
                <p className="text-sm font-medium opacity-90">
                  Years Experience
                </p>
              </div>
            </div>
            <div>
              <p className="text-red-600 font-bold tracking-widest mb-2 uppercase text-sm">
                About The Artist
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Behind the Lens
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
                {profile.aboutText}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8 border-t border-neutral-800 pt-8">
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">
                    {profile.statProjects}
                  </h4>
                  <p className="text-neutral-500 text-sm">Projects</p>
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">
                    {profile.statAwards}
                  </h4>
                  <p className="text-neutral-500 text-sm">Awards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT (RESTORED) */}
      <section
        id="contact"
        className="py-24 px-6 max-w-7xl mx-auto border-t border-neutral-900"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Get In Touch</h2>
            <p className="text-neutral-400">
              Ready to start a project? Contact me for bookings.
            </p>
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 bg-neutral-900 p-6 rounded-lg hover:bg-neutral-800 transition-colors group"
              >
                <Mail className="text-red-700 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{profile.email}</span>
              </a>
              <div className="flex items-center gap-4 bg-neutral-900 p-6 rounded-lg">
                <Phone className="text-red-700" />
                <span className="font-medium">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-4 bg-neutral-900 p-6 rounded-lg">
                <MapPin className="text-red-700" />
                <span className="font-medium">{profile.address}</span>
              </div>
            </div>
          </div>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg focus:border-red-700 outline-none text-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg focus:border-red-700 outline-none text-white"
              />
            </div>
            <textarea
              rows={4}
              placeholder="Message"
              className="w-full bg-neutral-900 border border-neutral-800 p-4 rounded-lg focus:border-red-700 outline-none text-white"
            ></textarea>
            <button className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-red-700 hover:text-white transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-neutral-600 text-sm bg-neutral-950 border-t border-neutral-900">
        <p>© 2024 {profile.name}. All rights reserved.</p>
      </footer>

      {/* SETUP MODAL */}
      {showSetupModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full max-w-sm text-center shadow-2xl">
            <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <KeyRound size={20} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2 tracking-wide">
              Owner Setup
            </h2>
            <p className="text-neutral-500 text-sm mb-6">
              Create your admin password.
            </p>
            <form onSubmit={handleSetupPassword} className="space-y-4">
              <div className="relative">
                <input
                  type={showPasswordText ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-black border border-neutral-700 p-3 rounded-lg text-center text-white focus:border-red-600 outline-none transition-colors pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button className="w-full bg-white text-black py-3 rounded-lg font-bold hover:bg-neutral-200 text-sm tracking-wide">
                Set Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && !isAdmin && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl w-full max-w-sm relative shadow-2xl">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-neutral-600 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold mb-6 text-white text-center tracking-wide">
              Owner Login
            </h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPasswordText ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full bg-black border border-neutral-700 p-3 rounded-lg text-center text-white focus:border-red-600 outline-none transition-colors pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <button className="w-full bg-red-800 text-white py-3 rounded-lg font-bold hover:bg-red-700 text-sm tracking-wide">
                Unlock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-900/30 p-8 rounded-2xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit3 className="text-red-700" /> Edit Info
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-6">
                <h4 className="text-red-500 text-xs font-bold uppercase mb-4 tracking-widest">
                  Main Header & Cover
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                      Name
                    </label>
                    <input
                      value={tempProfile.name}
                      onChange={(e) =>
                        setTempProfile({ ...tempProfile, name: e.target.value })
                      }
                      className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                      Tagline
                    </label>
                    <input
                      value={tempProfile.tagline}
                      onChange={(e) =>
                        setTempProfile({
                          ...tempProfile,
                          tagline: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                    Top Bio
                  </label>
                  <textarea
                    value={tempProfile.bio}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, bio: e.target.value })
                    }
                    className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                    Upload New Cover Image
                  </label>
                  <div className="border-2 border-dashed border-neutral-700 p-4 rounded-lg text-center cursor-pointer hover:border-red-500 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, (url) =>
                          setTempProfile({ ...tempProfile, coverImage: url })
                        )
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      {isProcessing ? (
                        <Loader2 className="animate-spin text-red-500" />
                      ) : (
                        <UploadCloud className="text-neutral-400" />
                      )}
                      <span className="text-xs text-neutral-400">
                        {isProcessing
                          ? "Compressing..."
                          : "Click to upload cover"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b border-neutral-800 pb-6">
                <h4 className="text-red-500 text-xs font-bold uppercase mb-4 tracking-widest">
                  About Section
                </h4>
                <div className="mb-4">
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                    Upload About Image
                  </label>
                  <div className="border-2 border-dashed border-neutral-700 p-4 rounded-lg text-center cursor-pointer hover:border-red-500 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e, (url) =>
                          setTempProfile({ ...tempProfile, aboutImage: url })
                        )
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2">
                      {isProcessing ? (
                        <Loader2 className="animate-spin text-red-500" />
                      ) : (
                        <UploadCloud className="text-neutral-400" />
                      )}
                      <span className="text-xs text-neutral-400">
                        {isProcessing
                          ? "Compressing..."
                          : "Click to upload portrait"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                    About Text
                  </label>
                  <textarea
                    value={tempProfile.aboutText}
                    onChange={(e) =>
                      setTempProfile({
                        ...tempProfile,
                        aboutText: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white"
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                      Years Exp.
                    </label>
                    <input
                      value={tempProfile.statYears}
                      onChange={(e) =>
                        setTempProfile({
                          ...tempProfile,
                          statYears: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                      Projects
                    </label>
                    <input
                      value={tempProfile.statProjects}
                      onChange={(e) =>
                        setTempProfile({
                          ...tempProfile,
                          statProjects: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">
                      Awards
                    </label>
                    <input
                      value={tempProfile.statAwards}
                      onChange={(e) =>
                        setTempProfile({
                          ...tempProfile,
                          statAwards: e.target.value,
                        })
                      }
                      className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white text-center"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-red-500 text-xs font-bold uppercase mb-4 tracking-widest">
                  Contact Info
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    value={tempProfile.email}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, email: e.target.value })
                    }
                    className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white text-sm"
                    placeholder="Email"
                  />
                  <input
                    value={tempProfile.phone}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, phone: e.target.value })
                    }
                    className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white text-sm"
                    placeholder="Phone"
                  />
                  <input
                    value={tempProfile.address}
                    onChange={(e) =>
                      setTempProfile({
                        ...tempProfile,
                        address: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-neutral-700 p-2 rounded focus:border-red-700 outline-none text-white text-sm"
                    placeholder="Address"
                  />
                </div>
              </div>
              <button
                onClick={saveProfile}
                className="w-full bg-red-800 text-white py-4 rounded-lg font-bold hover:bg-red-700 mt-4 flex justify-center gap-2"
              >
                <Save size={20} /> Save All Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddPhotoModal && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-900/30 p-8 rounded-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowAddPhotoModal(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Plus className="text-red-700" /> Add Photo
            </h3>
            <form onSubmit={addPhoto} className="space-y-4">
              <div className="border-2 border-dashed border-neutral-700 p-8 rounded-lg text-center cursor-pointer hover:border-red-500 transition-colors relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setUploadPreview)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {uploadPreview ? (
                  <div className="relative">
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold">
                      Click to Change
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-4">
                    {isProcessing ? (
                      <Loader2 className="animate-spin w-10 h-10 text-red-500" />
                    ) : (
                      <UploadCloud className="w-10 h-10 text-neutral-500 group-hover:text-red-500" />
                    )}
                    <p className="font-bold text-white">Click to Upload</p>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={newPhotoTitle}
                onChange={(e) => setNewPhotoTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-black border border-neutral-700 p-3 rounded-lg focus:border-red-700 outline-none text-white"
              />
              <select
                value={newPhotoCategory}
                onChange={(e) => setNewPhotoCategory(e.target.value)}
                className="w-full bg-black border border-neutral-700 p-3 rounded-lg focus:border-red-700 outline-none text-white"
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <button
                disabled={isProcessing}
                className="w-full bg-red-800 text-white py-3 rounded-lg font-bold hover:bg-red-700 mt-2 disabled:opacity-50"
              >
                Add to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[80] bg-black/98 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={32} />
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.title}
            className="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-sm"
          />
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <h3 className="text-xl font-bold text-white">
              {selectedImage.title}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
