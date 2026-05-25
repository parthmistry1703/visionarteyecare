import { useState, useEffect } from "react";
import eyeTestingRoom from "@assets/eye-testing-room.jpg";
import shopFront from "@assets/shop-front.jpg";
import shopInterior from "@assets/shop-interior.jpg";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * VISIONART OPTICAL & EYECARE - HOME PAGE
 * Design Philosophy: Premium, modern optical store with elegant typography,
 * sophisticated color palette (blue, green, gold), and smooth interactions.
 */

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const whatsappLink =
    "https://wa.me/918866778396?text=Hello%20Dr.%20Milan%20Mistry%2C%20I%20want%20to%20know%20more%20about%20Visionart%20Optical%20%26%20Eyecare.";

  // Scroll reveal animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        navbar.style.background =
          window.scrollY > 60
            ? "rgba(6, 15, 30, 0.96)"
            : "rgba(6, 15, 30, 0.82)";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // tRPC mutation for creating appointments
  const createAppointmentMutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 4000);
      const form = document.querySelector("#appointment-form") as HTMLFormElement;
      if (form) form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to book appointment");
    },
  });

  // Form submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector("#f-name") as HTMLInputElement)?.value.trim();
    const phone = (form.querySelector("#f-phone") as HTMLInputElement)?.value.trim();
    const email = (form.querySelector("#f-email") as HTMLInputElement)?.value.trim();
    const service = (form.querySelector("#f-service") as HTMLSelectElement)?.value;
    const dateStr = (form.querySelector("#f-date") as HTMLInputElement)?.value;
    const message = (form.querySelector("#f-msg") as HTMLTextAreaElement)?.value.trim();

    if (!name || !phone || !service) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const preferredDateTime = dateStr ? new Date(dateStr) : undefined;

    createAppointmentMutation.mutate({
      name,
      phone,
      email: email || undefined,
      service,
      preferredDateTime,
      message: message || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#060f1e] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-100 px-[6%] py-[18px] flex items-center justify-between bg-[rgba(6,15,30,.82)] backdrop-blur-[18px] border-b border-[rgba(255,255,255,.06)] transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[42px] h-[42px]"
          >
            <circle
              cx="40"
              cy="40"
              r="38"
              fill="white"
              fillOpacity=".07"
              stroke="rgba(255,255,255,.12)"
              strokeWidth="1"
            />
            <circle cx="28" cy="40" r="14" fill="none" stroke="#2e7fc2" strokeWidth="6" />
            <circle cx="52" cy="40" r="14" fill="none" stroke="#4a9e5c" strokeWidth="6" />
            <circle cx="28" cy="40" r="5" fill="#e8a820" />
            <circle cx="52" cy="40" r="5" fill="#e8a820" />
            <line x1="42" y1="40" x2="38" y2="40" stroke="rgba(255,255,255,.6)" strokeWidth="3" />
          </svg>
          <div>
            <div className="font-serif text-[1.35rem] font-bold leading-tight">
              <span className="text-[#2e7fc2]">VISION</span>
              <span className="text-[#4a9e5c]">ART</span>
            </div>
            <small className="block text-[0.65rem] font-normal text-[#8a9ab5] tracking-[0.12em] uppercase font-sans">
              Optical & Eyecare
            </small>
          </div>
        </div>

        <ul
          className={`nav-links ${isMenuOpen ? "open" : ""} hidden md:flex gap-[34px] items-center`}
          id="nav-links"
        >
          <li>
            <a href="#hero" className="text-[0.88rem] font-medium tracking-[0.04em] text-[rgba(255,255,255,.72)] hover:text-white transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="#services" className="text-[0.88rem] font-medium tracking-[0.04em] text-[rgba(255,255,255,.72)] hover:text-white transition-colors">
              Services
            </a>
          </li>
          <li>
            <a href="/shop" className="text-[0.88rem] font-medium tracking-[0.04em] text-[rgba(255,255,255,.72)] hover:text-white transition-colors">
              Shop Online
            </a>
          </li>
          <li>
            <a href="#collections" className="text-[0.88rem] font-medium tracking-[0.04em] text-[rgba(255,255,255,.72)] hover:text-white transition-colors">
              Collections
            </a>
          </li>
          <li>
            <a href="#why" className="text-[0.88rem] font-medium tracking-[0.04em] text-[rgba(255,255,255,.72)] hover:text-white transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#testimonials" className="text-[0.88rem] font-medium tracking-[0.04em] text-[rgba(255,255,255,.72)] hover:text-white transition-colors">
              Reviews
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] text-white px-6 py-[10px] rounded-full font-semibold text-[0.82rem] tracking-[0.06em] hover:shadow-lg hover:-translate-y-[2px] transition-all"
            >
              Book Appointment
            </a>
          </li>
        </ul>

        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
          <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
          <span className="w-6 h-0.5 bg-white rounded transition-all"></span>
        </button>
      </nav>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="min-h-screen flex items-center relative overflow-hidden pt-[120px] pb-20 px-[6%]"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 70% 40%, rgba(46,127,194,.18) 0%, transparent 60%),
                         radial-gradient(ellipse 60% 80% at 20% 70%, rgba(74,158,92,.12) 0%, transparent 60%),
                         linear-gradient(160deg,#060f1e 0%,#0d1f3a 50%,#061528 100%)`,
          }}
        ></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        ></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center max-w-5xl mx-auto w-full">
          <div className="reveal">
            <div className="flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.12em] uppercase text-[#e8a820] mb-[22px]">
              <span className="w-8 h-px bg-[#e8a820]"></span>
              Navsari's Premier Optical Store
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
              See the World<br />
              in <em className="italic text-[#e8a820]">Perfect</em>
              <br />
              <span className="text-[#2e7fc2]">Style</span>
            </h1>
            <p className="text-base text-[#8a9ab5] leading-relaxed max-w-md mb-[38px]">
              Expert eye care, designer frames & premium lenses — crafted for those who value
              clarity, comfort & timeless elegance. Trusted optometrist in Navsari since 2020.
            </p>
            <div className="flex gap-4 flex-wrap mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-[#2e7fc2] to-[#1a6bb0] text-white px-[34px] py-[14px] rounded-full font-semibold text-[0.9rem] tracking-[0.04em] hover:shadow-lg hover:-translate-y-[3px] transition-all"
              >
                Book Free Eye Test
              </a>
              <a
                href="#collections"
                className="border border-[rgba(255,255,255,.2)] text-white px-[34px] py-[14px] rounded-full font-medium text-[0.9rem] hover:border-[#e8a820] hover:text-[#e8a820] transition-all"
              >
                View Collections
              </a>
              <a
                href="/shop"
                className="border border-[rgba(46,127,194,.42)] bg-[rgba(46,127,194,.12)] text-white px-[34px] py-[14px] rounded-full font-medium text-[0.9rem] hover:border-[#4a9e5c] hover:text-[#dff7e4] transition-all"
              >
                Shop Online
              </a>
            </div>
            <div className="flex gap-10 flex-wrap pt-9 border-t border-[rgba(255,255,255,.08)]">
              <div>
                <div className="font-serif text-4xl font-bold">
                  500<span className="text-[#e8a820]">+</span>
                </div>
                <div className="text-[0.78rem] text-[#8a9ab5] mt-1 font-medium tracking-[0.04em]">
                  Happy Customers
                </div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold">
                  200<span className="text-[#e8a820]">+</span>
                </div>
                <div className="text-[0.78rem] text-[#8a9ab5] mt-1 font-medium tracking-[0.04em]">
                  Frame Styles
                </div>
              </div>
              <div>
                <div className="font-serif text-4xl font-bold">
                  5<span className="text-[#e8a820]">★</span>
                </div>
                <div className="text-[0.78rem] text-[#8a9ab5] mt-1 font-medium tracking-[0.04em]">
                  Customer Rating
                </div>
              </div>
            </div>
          </div>

          <div className="reveal hidden md:flex justify-center items-center">
            <div className="bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.09)] rounded-3xl p-5 relative w-full max-w-[460px] backdrop-blur-[10px] shadow-[0_22px_60px_rgba(2,8,20,.45)]">
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg,rgba(46,127,194,.12),rgba(74,158,92,.08))",
                }}
              ></div>
              <div className="relative z-10">
                <div className="overflow-hidden rounded-[24px] border border-[rgba(255,255,255,.1)]">
                  <img
                    src={shopFront}
                    alt="Visionart Optical storefront in Navsari"
                    className="h-[320px] w-full object-cover"
                  />
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-8 top-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 font-semibold text-[#062313] shadow-[0_14px_34px_rgba(37,211,102,.32)] transition-all hover:-translate-y-[2px] hover:shadow-[0_18px_38px_rgba(37,211,102,.4)]"
                >
                  <span className="text-lg leading-none">💬</span>
                  <span className="text-[0.82rem] tracking-[0.04em]">WhatsApp Dr. Milan</span>
                </a>
                <div className="text-center mt-6 font-serif text-2xl italic text-[rgba(255,255,255,.85)]">
                  Visit Our Visionart Storefront
                </div>
                <div className="text-center text-[0.82rem] text-[#8a9ab5] mt-1.5 tracking-[0.08em] uppercase font-medium">
                  Optometrist · Designer Eyewear · Navsari
                </div>
                <div className="flex gap-2.5 flex-wrap justify-center mt-5.5">
                  <span className="px-3.5 py-1.5 rounded-full text-[0.74rem] font-semibold bg-[rgba(46,127,194,.2)] text-[#7bbde8] border border-[rgba(46,127,194,.3)]">
                    Walk-In Store
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-[0.74rem] font-semibold bg-[rgba(74,158,92,.2)] text-[#7fd48f] border border-[rgba(74,158,92,.3)]">
                    Premium Eyewear
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-[0.74rem] font-semibold bg-[rgba(232,168,32,.2)] text-[#f0c84a] border border-[rgba(232,168,32,.3)]">
                    Trusted Eye Care
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden">
            <div className="bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.09)] rounded-3xl p-11 relative w-full max-w-[460px] backdrop-blur-[10px]">
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg,rgba(46,127,194,.12),rgba(74,158,92,.08))",
                }}
              ></div>
              <div className="relative z-10">
                <div className="w-full h-[180px] flex items-center justify-center">
                  <svg
                    viewBox="0 0 300 130"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[260px] h-[120px] drop-shadow-lg"
                    style={{
                      filter: "drop-shadow(0 8px 32px rgba(46,127,194,.5))",
                      animation: "float 5s ease-in-out infinite",
                    }}
                  >
                    <circle cx="85" cy="65" r="52" fill="rgba(46,127,194,.15)" stroke="#2e7fc2" strokeWidth="9" />
                    <circle cx="215" cy="65" r="52" fill="rgba(74,158,92,.15)" stroke="#4a9e5c" strokeWidth="9" />
                    <circle cx="85" cy="65" r="28" fill="rgba(255,255,255,.05)" />
                    <circle cx="215" cy="65" r="28" fill="rgba(255,255,255,.05)" />
                    <circle cx="85" cy="65" r="14" fill="#e8a820" />
                    <circle cx="215" cy="65" r="14" fill="#e8a820" />
                    <circle cx="85" cy="65" r="5" fill="#fff5cc" />
                    <circle cx="215" cy="65" r="5" fill="#fff5cc" />
                    <path
                      d="M137 65 Q150 48 163 65"
                      stroke="rgba(200,185,150,.8)"
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <line x1="33" y1="35" x2="6" y2="15" stroke="#2e7fc2" strokeWidth="7" strokeLinecap="round" />
                    <line x1="267" y1="35" x2="294" y2="15" stroke="#4a9e5c" strokeWidth="7" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="text-center mt-6 font-serif text-2xl italic text-[rgba(255,255,255,.85)]">
                  Where Vision Meets Art
                </div>
                <div className="text-center text-[0.82rem] text-[#8a9ab5] mt-1.5 tracking-[0.08em] uppercase font-medium">
                  Optometrist · Designer Eyewear · Navsari
                </div>
                <div className="flex gap-2.5 flex-wrap justify-center mt-5.5">
                  <span className="px-3.5 py-1.5 rounded-full text-[0.74rem] font-semibold bg-[rgba(46,127,194,.2)] text-[#7bbde8] border border-[rgba(46,127,194,.3)]">
                    Blue Frames
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-[0.74rem] font-semibold bg-[rgba(74,158,92,.2)] text-[#7fd48f] border border-[rgba(74,158,92,.3)]">
                    Green Frames
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-[0.74rem] font-semibold bg-[rgba(232,168,32,.2)] text-[#f0c84a] border border-[rgba(232,168,32,.3)]">
                    Gold Frames
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </section>

      {/* STORE GALLERY SECTION */}
      <section className="py-[90px] px-[6%] bg-[#081426]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-[54px] reveal">
            <div className="flex items-center justify-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[#e8a820] mb-4">
              <span className="w-7 h-px bg-[#e8a820]"></span>
              Inside Visionart
              <span className="w-7 h-px bg-[#e8a820]"></span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              A Look at Our <em className="italic text-[#e8a820]">Store &amp; Clinic</em>
            </h2>
            <div className="w-[60px] h-1 bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] rounded mx-auto mb-5"></div>
            <p className="text-[#8a9ab5] text-sm leading-relaxed max-w-2xl mx-auto">
              Visit our welcoming showroom, explore our eyewear displays, and
              experience modern eye-testing care in a calm, professional space.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-6 mb-6">
            <div className="reveal group relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)]">
              <img
                src={shopInterior}
                alt="Visionart Optical showroom interior with illuminated frame displays"
                className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,15,30,.92)] via-[rgba(6,15,30,.52)] to-transparent p-6">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#e8a820]">
                  Showroom Interior
                </p>
                <h3 className="font-serif text-2xl font-bold mt-2">
                  Premium frame displays in a bright, elegant shopping space
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="reveal group relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)]">
                <img
                  src={shopFront}
                  alt="Visionart Optical storefront entrance in Navsari"
                  className="h-[198px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,15,30,.9)] to-transparent p-5">
                  <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#e8a820]">
                    Storefront
                  </p>
                  <p className="text-sm text-[#d9e4f2] mt-1">
                    Easy-to-find location with clear branding and walk-in access.
                  </p>
                </div>
              </div>

              <div className="reveal group relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)]">
                <img
                  src={eyeTestingRoom}
                  alt="Visionart eye testing room with optical equipment and patient seating"
                  className="h-[198px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,15,30,.9)] to-transparent p-5">
                  <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#e8a820]">
                    Eye Testing Room
                  </p>
                  <p className="text-sm text-[#d9e4f2] mt-1">
                    Modern equipment for accurate eye exams and comfortable consultations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="reveal group relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)]">
              <img
                src={shopInterior}
                alt="Visionart optical frame displays and showroom lighting"
                className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ objectPosition: "center top" }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,15,30,.92)] to-transparent p-5">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#e8a820]">
                  Display Zone
                </p>
                <p className="text-sm text-[#d9e4f2] mt-1">
                  Designer frames arranged in a bright premium showroom.
                </p>
              </div>
            </div>

            <div className="reveal group relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)]">
              <img
                src={eyeTestingRoom}
                alt="Visionart consultation and eye examination area"
                className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ objectPosition: "center center" }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,15,30,.92)] to-transparent p-5">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#e8a820]">
                  Consultation Area
                </p>
                <p className="text-sm text-[#d9e4f2] mt-1">
                  A clean and comfortable room for accurate eye testing.
                </p>
              </div>
            </div>

            <div className="reveal group relative overflow-hidden rounded-[24px] border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)]">
              <img
                src={shopFront}
                alt="Visionart Optical exterior entrance"
                className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ objectPosition: "center top" }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,15,30,.92)] to-transparent p-5">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-[#e8a820]">
                  Exterior View
                </p>
                <p className="text-sm text-[#d9e4f2] mt-1">
                  Visionart Optical &amp; Eyecare welcoming customers in Navsari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-[100px] px-[6%] bg-[#0c1c35]">
        <div className="text-center mb-[60px] reveal">
          <div className="flex items-center justify-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[#e8a820] mb-4">
            <span className="w-7 h-px bg-[#e8a820]"></span>
            What We Offer
            <span className="w-7 h-px bg-[#e8a820]"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Our <em className="italic text-[#e8a820]">Services</em>
          </h2>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] rounded mx-auto mb-5"></div>
          <p className="text-[#8a9ab5] text-sm leading-relaxed max-w-md mx-auto">
            Complete eye health and eyewear solutions under one roof, by certified professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: "👁️", title: "Eye Examination", desc: "Comprehensive vision tests and eye health screening by our certified optometrist using modern diagnostic equipment.", color: "#2e7fc2" },
            { icon: "🕶️", title: "Designer Frames", desc: "Curated collection of 200+ frames — from classic elegance to bold modern styles, for every face shape and personality.", color: "#4a9e5c" },
            { icon: "🔬", title: "Zeiss Lenses", desc: "Premium Zeiss optical lenses with golden coat technology — anti-reflection, scratch-resistant & UV protection included.", color: "#e8a820" },
            { icon: "💎", title: "Contact Lenses", desc: "Wide range of daily, monthly and coloured contact lenses. Expert fitting and aftercare guidance included.", color: "#7c5cbf" },
            { icon: "🔧", title: "Repairs & Adjustments", desc: "Frame repairs, nose-pad replacement, temple tightening — quick in-store service to keep your glasses perfect.", color: "#e8a820" },
            { icon: "👶", title: "Kids Eyecare", desc: "Gentle, specialised eye tests for children with fun, durable frames designed to grow with them.", color: "#4a9e5c" },
          ].map((service, idx) => (
            <div
              key={idx}
              className="reveal bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.07)] rounded-2xl p-9 transition-all hover:translate-y-[-6px] hover:border-[rgba(255,255,255,.14)] hover:shadow-2xl"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5.5"
                style={{ background: `rgba(${parseInt(service.color.slice(1, 3), 16)}, ${parseInt(service.color.slice(3, 5), 16)}, ${parseInt(service.color.slice(5, 7), 16)}, 0.15)` }}
              >
                {service.icon}
              </div>
              <h3 className="font-serif text-xl font-bold mb-2.5">{service.title}</h3>
              <p className="text-[0.88rem] text-[#8a9ab5] leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS SECTION */}
      <section id="collections" className="py-[100px] px-[6%] bg-gradient-to-r from-[#060f1e] to-[#0f2540]">
        <div className="text-center mb-[60px] reveal">
          <div className="flex items-center justify-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[#e8a820] mb-4">
            <span className="w-7 h-px bg-[#e8a820]"></span>
            Eyewear Collections
            <span className="w-7 h-px bg-[#e8a820]"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Find Your <em className="italic text-[#e8a820]">Perfect Frame</em>
          </h2>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] rounded mx-auto mb-5"></div>
          <p className="text-[#8a9ab5] text-sm leading-relaxed max-w-md mx-auto">
            Handpicked styles for every look — from boardrooms to beaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {[
            { name: "Classic Round", desc: "Timeless circular frames — perfect for oval and heart-shaped faces. Lightweight titanium options available.", tag: "Most Popular", tagBg: "rgba(46,127,194,.2)", tagText: "#7bbde8" },
            { name: "Wayfarer", desc: "Bold rectangular frames with a modern edge. Versatile enough for every occasion, loved by all ages.", tag: "New Arrivals", tagBg: "rgba(74,158,92,.2)", tagText: "#7fd48f" },
            { name: "Aviator Oval", desc: "Iconic teardrop-inspired shape with a contemporary twist. Premium metal frames with spring hinges.", tag: "Premium Pick", tagBg: "rgba(232,168,32,.2)", tagText: "#f0c84a" },
            { name: "Cat Eye", desc: "Dramatic upswept corners for a bold, fashion-forward statement. Available in acetate and metal variants.", tag: "Trending", tagBg: "rgba(180,80,200,.15)", tagText: "#d480f0" },
            { name: "Sporty Shield", desc: "Wrap-around sport frames with impact-resistant lenses. Perfect for outdoor and athletic lifestyles.", tag: "Active Wear", tagBg: "rgba(220,80,80,.15)", tagText: "#f08080" },
            { name: "Rimless & Semi-Rim", desc: "Minimalist, lightweight design for a barely-there look. Ultra-thin lenses for maximum comfort all day long.", tag: "Lightweight", tagBg: "rgba(46,127,194,.2)", tagText: "#7bbde8" },
          ].map((col, idx) => (
            <div
              key={idx}
              className="reveal bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.07)] rounded-2xl p-11 text-center transition-all hover:translate-y-[-8px] hover:border-[rgba(232,168,32,.3)] hover:shadow-3xl"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <div className="w-full h-[90px] flex items-center justify-center mb-6">
                <svg width="200" height="80" viewBox="0 0 200 80" fill="none" className="w-full h-auto">
                  <circle cx="52" cy="40" r="30" fill="rgba(46,127,194,.12)" stroke="#2e7fc2" strokeWidth="5" />
                  <circle cx="148" cy="40" r="30" fill="rgba(46,127,194,.12)" stroke="#2e7fc2" strokeWidth="5" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">{col.name}</h3>
              <p className="text-[0.83rem] text-[#8a9ab5] leading-relaxed mb-4">{col.desc}</p>
              <span
                className="inline-block px-3.5 py-1.5 rounded-full text-[0.74rem] font-semibold border"
                style={{ background: col.tagBg, color: col.tagText, borderColor: col.tagBg }}
              >
                {col.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US SECTION */}
      <section id="why" className="py-[100px] px-[6%] bg-[#0c1c35]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[#e8a820] mb-4 reveal">
              <span className="w-7 h-px bg-[#e8a820]"></span>
              Why Choose Us
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 reveal">
              Navsari's Most <em className="italic text-[#e8a820]">Trusted</em> Optometrist
            </h2>
            <div className="w-[60px] h-1 bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] rounded mb-5 reveal"></div>
            <p className="text-[#8a9ab5] text-sm leading-relaxed max-w-md mb-10 reveal">
              At Visionart Optical & Eyecare, we combine clinical expertise with personalised care — ensuring every customer leaves seeing better and feeling great.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: "🎯", title: "Certified Optometrist", desc: "Professional eye examinations using calibrated equipment for accurate prescriptions every time." },
                { icon: "🏆", title: "Zeiss Authorised Partner", desc: "We use and recommend authentic Zeiss lenses — globally trusted for optical clarity and durability." },
                { icon: "💰", title: "Best Prices in Navsari", desc: "Premium quality eyewear at honest, competitive prices. No hidden charges, ever." },
                { icon: "⚡", title: "Same-Day Service", desc: "Most prescriptions ready within hours. Urgent repairs while you wait." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="reveal flex gap-5 items-start p-5.5 rounded-2xl bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)] hover:border-[rgba(46,127,194,.3)] transition-colors"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="w-11 h-11 min-w-11 rounded-2xl flex items-center justify-center text-lg bg-[rgba(46,127,194,.15)]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-semibold mb-1">{item.title}</h4>
                    <p className="text-[0.83rem] text-[#8a9ab5] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal hidden md:flex justify-center">
            <div className="relative max-w-[460px]">
              <div
                className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[rgba(46,127,194,.18)] via-transparent to-[rgba(232,168,32,.12)] blur-2xl"
              ></div>
              <div className="relative z-10 overflow-hidden rounded-3xl border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.04)] p-4">
                <img
                  src={eyeTestingRoom}
                  alt="Visionart eye testing room and equipment"
                  className="h-[420px] w-full rounded-[24px] object-cover"
                />
                <div className="px-2 pt-5 pb-2 text-center">
                  <div className="font-serif text-2xl italic text-[rgba(255,255,255,.82)]">
                    Precision testing in a calm consultation space
                  </div>
                  <div className="mt-2 text-[0.8rem] uppercase tracking-[0.12em] text-[#8a9ab5]">
                    Modern Equipment · Accurate Eye Exams
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden">
            <div className="relative">
              <div
                className="absolute w-[300px] h-[300px] rounded-full border border-[rgba(46,127,194,.15)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              ></div>
              <div className="bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.08)] rounded-3xl p-12 text-center relative z-10 max-w-[420px]">
                <svg
                  viewBox="0 0 320 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full max-w-80 h-auto mx-auto mb-7"
                  style={{
                    filter: "drop-shadow(0 10px 40px rgba(46,127,194,.4))",
                    animation: "float 6s ease-in-out infinite",
                  }}
                >
                  <circle cx="90" cy="70" r="58" fill="rgba(46,127,194,.15)" stroke="#2e7fc2" strokeWidth="10" />
                  <circle cx="230" cy="70" r="58" fill="rgba(74,158,92,.15)" stroke="#4a9e5c" strokeWidth="10" />
                </svg>
                <div className="font-serif text-2xl italic text-[rgba(255,255,255,.75)]">
                  "See the World in Style"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-[100px] px-[6%] bg-[#060f1e]">
        <div className="text-center mb-[60px] reveal">
          <div className="flex items-center justify-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[#e8a820] mb-4">
            <span className="w-7 h-px bg-[#e8a820]"></span>
            Customer Reviews
            <span className="w-7 h-px bg-[#e8a820]"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            What Our <em className="italic text-[#e8a820]">Customers</em> Say
          </h2>
          <div className="w-[60px] h-1 bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] rounded mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {[
            { stars: "★★★★★", quote: "Best optical experience in Navsari! Milan sir gave a thorough eye test and helped me pick the perfect Zeiss lenses. My vision has never been clearer!", name: "Rishi Patel", location: "Navsari, Gujarat", avatar: "R", gradient: "from-[#2e7fc2] to-[#4a9e5c]" },
            { stars: "★★★★★", quote: "Huge collection of frames at amazing prices. The staff is so friendly and patient. Got my glasses the same day — couldn't be happier with the service!", name: "Priya Mistry", location: "Navsari, Gujarat", avatar: "P", gradient: "from-[#e8a820] to-[#c9901a]" },
            { stars: "★★★★★", quote: "Took my daughter for her first eye test. The doctor was so gentle and made her feel comfortable. Would strongly recommend Visionart to every family!", name: "Sneha Desai", location: "Navsari, Gujarat", avatar: "S", gradient: "from-[#7c5cbf] to-[#5a3d9e]" },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="reveal bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.07)] rounded-2xl p-7 transition-all"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              <div className="text-[#e8a820] mb-4">{testimonial.stars}</div>
              <blockquote className="text-[0.95rem] text-[#8a9ab5] leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-r ${testimonial.gradient}`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-[0.75rem] text-[#8a9ab5]">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-[100px] px-[6%] bg-[#0c1c35]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <div className="flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-[#e8a820] mb-4 reveal">
              <span className="w-7 h-px bg-[#e8a820]"></span>
              Get In Touch
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 reveal">
              Visit Us or <em className="italic text-[#e8a820]">Book Online</em>
            </h2>
            <div className="w-[60px] h-1 bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] rounded mb-5 reveal"></div>
            <p className="text-[#8a9ab5] text-sm leading-relaxed max-w-md mb-10 reveal">
              Walk in anytime or book an appointment for priority service. We're here to give your eyes the care they deserve.
            </p>

            <div className="flex flex-col gap-6">
              {[
                { icon: "📍", title: "Address", content: "Shop No.3, Crystal Apartment,\nSindhi Camp Road, Navsari – 396445\nGujarat, India\nDr. Milan Mistry\nContact No. +91 8866778396" },
                { icon: "🕐", title: "Opening Hours", content: "Mon – Sat: 9:00 AM – 8:00 PM\nSunday: 10:00 AM – 5:00 PM" },
                { icon: "📸", title: "Instagram", content: "@visionartmilan_2025" },
                { icon: "✅", title: "Free Eye Check-Up", content: "Walk in for a complimentary eye examination — no appointment needed!" },
              ].map((info, idx) => (
                <div
                  key={idx}
                  className="reveal flex gap-4 items-start"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="text-2xl">{info.icon}</div>
                  <div>
                    <h4 className="font-semibold mb-1">{info.title}</h4>
                    <p className="text-[0.86rem] text-[#8a9ab5] leading-relaxed whitespace-pre-line">{info.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            <form id="appointment-form" onSubmit={handleSubmitForm} className="bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.07)] rounded-2xl p-8">
              <h3 className="font-serif text-2xl font-bold mb-6">Book an Appointment</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    id="f-name"
                    placeholder="Full name"
                    required
                    className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-lg px-4 py-2.5 text-white placeholder-[rgba(255,255,255,.4)] focus:outline-none focus:border-[#2e7fc2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    id="f-phone"
                    placeholder="+91 8866778396"
                    required
                    className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-lg px-4 py-2.5 text-white placeholder-[rgba(255,255,255,.4)] focus:outline-none focus:border-[#2e7fc2]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="f-email"
                  placeholder="your@email.com"
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-lg px-4 py-2.5 text-white placeholder-[rgba(255,255,255,.4)] focus:outline-none focus:border-[#2e7fc2]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Service Required *</label>
                <select
                  id="f-service"
                  required
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#2e7fc2]"
                >
                  <option value="">Select a service...</option>
                  <option>Eye Examination</option>
                  <option>Designer Frames</option>
                  <option>Zeiss Lenses</option>
                  <option>Contact Lenses</option>
                  <option>Repairs & Adjustments</option>
                  <option>Kids Eyecare</option>
                  <option>General Enquiry</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  id="f-date"
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#2e7fc2]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                  id="f-msg"
                  rows={3}
                  placeholder="Any special requirements or questions..."
                  className="w-full bg-[rgba(255,255,255,.05)] border border-[rgba(255,255,255,.1)] rounded-lg px-4 py-2.5 text-white placeholder-[rgba(255,255,255,.4)] focus:outline-none focus:border-[#2e7fc2]"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={createAppointmentMutation.isPending}
                className="w-full bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAppointmentMutation.isPending ? "Booking..." : "✦ Confirm Appointment"}
              </button>
              <p className="text-[0.8rem] text-[#8a9ab5] mt-4 text-center">We'll confirm your appointment via WhatsApp or call.</p>
            </form>
          </div>
        </div>

        <div className="reveal mt-[70px] bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.07)] rounded-2xl p-6 text-center max-w-2xl mx-auto">
          <p className="mb-4">📍 Shop No.3, Crystal Apartment, Sindhi Camp Road, Navsari – 396445</p>
          <a
            href="https://maps.google.com/?q=Visionart+Optical+Eyecare+Navsari+Gujarat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-[#2e7fc2] hover:text-[#e8a820] transition-colors"
          >
            🗺️ Open in Google Maps
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <div className="h-1 bg-gradient-to-r from-[#2e7fc2] via-[#e8a820] to-[#4a9e5c]"></div>
      <footer className="bg-[rgba(0,0,0,.5)] border-t border-[rgba(255,255,255,.07)] py-[60px] px-[6%]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-serif text-2xl font-bold mb-3.5 block">
              <span className="text-[#2e7fc2]">VISION</span>
              <span className="text-[#4a9e5c]">ART</span>
            </div>
            <p className="text-[0.85rem] text-[#8a9ab5] leading-relaxed max-w-44 mb-4.5">
              Navsari's premier optical store — combining expert eye care with a stunning collection of designer eyewear since 2020.
            </p>
            <div className="flex gap-2.5">
              <a
                href="https://instagram.com/visionartmilan_2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9.5 h-9.5 rounded-2xl border border-[rgba(255,255,255,.1)] flex items-center justify-center hover:border-[#e8a820] hover:text-[#e8a820] hover:-translate-y-[2px] transition-all"
              >
                📸
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9.5 h-9.5 rounded-2xl border border-[rgba(255,255,255,.1)] flex items-center justify-center hover:border-[#e8a820] hover:text-[#e8a820] hover:-translate-y-[2px] transition-all"
              >
                💬
              </a>
              <a
                href="https://maps.google.com/?q=Visionart+Optical+Navsari"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9.5 h-9.5 rounded-2xl border border-[rgba(255,255,255,.1)] flex items-center justify-center hover:border-[#e8a820] hover:text-[#e8a820] hover:-translate-y-[2px] transition-all"
              >
                🗺️
              </a>
            </div>
          </div>

          {[
            { title: "Services", items: ["Eye Examination", "Designer Frames", "Zeiss Lenses", "Contact Lenses", "Kids Eyecare", "Repairs"] },
            { title: "Collections", items: ["Classic Round", "Wayfarer", "Aviator Oval", "Cat Eye", "Sporty Shield", "Rimless"] },
            { title: "Visit Us", items: ["Shop No.3, Crystal Apt", "Sindhi Camp Road", "Navsari – 396445", "Gujarat, India", "Mon–Sat: 10am–8pm", "Sun: 11am–5pm"] },
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="text-[0.8rem] font-bold tracking-[0.1em] uppercase text-[#e8a820] mb-4.5">
                {col.title}
              </h4>
              <ul>
                {col.items.map((item, i) => (
                  <li key={i} className="mb-2.5">
                    <a href="#" className="text-[0.86rem] text-[#8a9ab5] hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-7 border-t border-[rgba(255,255,255,.07)] flex justify-between items-center flex-wrap gap-3">
          <p className="text-[0.8rem] text-[#8a9ab5]">© 2025 Visionart Optical & Eyecare. All rights reserved.</p>
          <p className="text-[0.8rem] text-[#8a9ab5]">
            Built with ❤️ for <a href="#hero" className="text-[#2e7fc2] hover:text-[#e8a820] transition-colors">Visionart Navsari</a>
          </p>
        </div>
      </footer>

      {/* TOAST NOTIFICATION */}
      <div
        className={`fixed bottom-8 right-8 bg-[#4a9e5c] text-white px-6 py-3.5 rounded-2xl font-semibold text-[0.9rem] transition-all duration-300 z-999 ${
          toastVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
        style={{ boxShadow: "0 10px 30px rgba(74,158,92,.4)" }}
      >
        ✓ Appointment request sent! We'll contact you shortly.
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 left-6 z-[998] inline-flex items-center gap-3 rounded-full border border-[rgba(255,255,255,.12)] bg-[#25D366] px-5 py-3 text-[#062313] shadow-[0_18px_40px_rgba(37,211,102,.28)] transition-all hover:-translate-y-[2px] hover:shadow-[0_22px_46px_rgba(37,211,102,.38)]"
      >
        <span className="text-[1.2rem] leading-none">💬</span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[rgba(6,35,19,.78)]">
            WhatsApp
          </span>
          <span className="text-[0.88rem] font-bold">Dr. Milan Mistry</span>
        </span>
      </a>

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
