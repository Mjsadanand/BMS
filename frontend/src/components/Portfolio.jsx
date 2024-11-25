import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './portfolio.css';
import { useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaBlog, FaPhoneAlt,  FaSignInAlt, FaUserPlus , FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram} from 'react-icons/fa';

// Import images
import image1 from '../assets/back1.jpg';
import image2 from '../assets/back2.jpg';
import image3 from '../assets/back3.jpg';
import image4 from '../assets/back4.jpg';
import image6 from '../assets/back6.jpg';
import image7 from '../assets/back7.jpg';
import image8 from '../assets/back8.jpg';
import image9 from '../assets/back9.jpg';
import image10 from '../assets/back10.jpg';
import serviceImage1 from '../assets/service1.png';
import serviceImage2 from '../assets/Digi.webp';
import serviceImage3 from '../assets/BM.jpeg';
import serviceImage4 from '../assets/LED.webp';
import serviceImage6 from '../assets/MARK.jpg';

// Loader Component
const Loader = () => (
  <div className="popup-overlay">
    <div className="popup-loader">Sending...</div>
  </div>
);

// Popup Message Component
const PopupMessage = ({ message, onClose }) => (
  <div className="popup-overlay" onClick={onClose}>
    <div className="popup-message">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

PopupMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const Portfolio = () => {
  const navigate = useNavigate();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const toggleDropdown = () => setShowLoginDropdown((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Navigate functions
  const navigateTo = (path) => navigate(path);

  // Image carousel logic
  const images = [image1, image2, image3, image4, image6, image7, image8, image9, image10];
  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  const [formData, setFormData] = useState({
    fname: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
      const handleSubmit = (e) => {
      e.preventDefault();
  
      const { fname, email, message } = formData;
      const whatsappNumber = '919019994562'; // Replace with your WhatsApp number (without +)
      const whatsappMessage = `Hello, my name is ${fname}. My email is ${email}. Here is my message: ${message}`;
  
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappURL, '_blank');
    };
  // Form submission logic
  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    const formData = new FormData(event.target);
    formData.append("access_key", "faf329a0-2af4-498d-abe2-ef5ef78bc4c8");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult("Form Submitted Successfully");
        event.target.reset();
      } else {
        setResult(data.message || "Submission failed");
      }
    } catch (error) {
      setResult("An error occurred. Please try again.",error);
    } finally {
      setLoading(false);
    }
  };

  // Services data
  const services = [
    { title: "Billboard Advertising", description: "High-quality billboard advertisements to promote your brand and services.", image: serviceImage1 },
    { title: "Digital Billboards", description: "Innovative digital billboards offering dynamic and eye-catching advertisements.", image: serviceImage2 },
    { title: "Billboard Maintenance", description: "Reliable and professional maintenance services for your billboards.", image: serviceImage3 },
    { title: "LED Billboard Rentals", description: "State-of-the-art LED billboards available for rent.", image: serviceImage4 },
    { title: "Market Analysis", description: "Research to identify the best locations for your billboard’s impact.", image: serviceImage6 },
  ];

  return (
    <div className="portfolio-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="logo">Billboard</h1>
        </div>
        <div className={`nav-right ${isMobileMenuOpen ? 'active' : ''}`}>
          <button className="nav-button" onClick={() => navigateTo("/")}><FaHome /> Home</button>
          <button className="nav-button" onClick={() => navigateTo("/about")}><FaInfoCircle /> About</button>
          <button className="nav-button" onClick={() => navigateTo("/blog")}><FaBlog /> Service</button>
          <button className="nav-button" onClick={() => navigateTo("/contact")}><FaPhoneAlt /> Contact</button>
          <div className="dropdown">
            <button className="nav-button" onClick={toggleDropdown}><FaSignInAlt /></button>
            {showLoginDropdown && (
              <div className="dropdown-content">
                <button onClick={() => navigateTo("/login")} className='dropdown-item'> Admin</button>
                <button onClick={() => navigateTo("/userlogin")} className='dropdown-item'> User</button>
                <button onClick={() => navigateTo("/staff")} className='dropdown-item'> Staff</button>
              </div>
            )}
          </div>
          <button className="nav-button signup" onClick={() => navigateTo("/signup")}><FaUserPlus /> Signup</button>
        </div>
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </nav>

      {/* Home Banner */}
      <section className="home-banner">
        <img src={images[currentImageIndex]} alt="Home Banner" className={`banner-image ${fade ? 'fade-in' : 'fade-out'}`} />
        <div className="banner-content">
          <h2>Welcome to Billboard</h2>
          <p>Your one-stop solution for all billboard management needs.</p>
          <button className="banner-button">Learn More</button>
        </div>
      </section>

      {/* About */}
      <div className='color'>
      <section className="about-section">
      <div className="container content">
        <h2 className="about-title">About</h2>
        <p className="about-description">
          The <strong>Billboard Management System</strong> is a cutting-edge platform 
          designed to simplify the process of managing advertising billboards. 
          With a user-friendly interface, robust functionality, and dynamic analytics, 
          our system streamlines operations, maximizes efficiency, and enhances decision-making.
        </p>
        <div className="features">
          <div className="feature-card">
            <h3>📊 Real-time Analytics</h3>
            <p>Monitor performance metrics with real-time updates and insightful reports.</p>
          </div>
          <div className="feature-card">
            <h3>🌐 Interactive Map Integration</h3>
            <p>Easily locate and manage billboards with an intuitive map interface.</p>
          </div>
          <div className="feature-card">
            <h3>🛠️ Easy Customization</h3>
            <p>Adapt the system to your unique needs with flexible settings and tools.</p>
          </div>
        </div>
      </div>
    </section>

      {/* Services */}
      <section className="services-section">
        <h2>Our Services</h2>
        <p>Explore the services we offer to elevate your brand visibility.</p>
        <div className="services-container">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <img src={service.image} alt={service.title} className="service-image" />
              <h3>{service.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <form id="whatsappForm" onSubmit={handleSubmit} className="contact-form">
          <input  type="text"
            id="fname"
            name="fname"
            placeholder='Name'
            value={formData.fname}
            onChange={handleChange}
            required/>
               <input
            type="email"
            id="email"
            name="email"
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            required
          />
                <textarea
            id="message"
            name="message"
            placeholder='Type your message.....!!'
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {loading && <Loader />}
        {result && <PopupMessage message={result} onClose={() => setResult("")} />}
      </section>

          <footer className="footer">
      {/* Background Shape */}
      <div className="footer-shape"></div>
      
      {/* Footer Content */}
      <div className="footer-content">
        {/* Navigation Links */}
        <nav className="footer-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/team">Team</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="https://facebook.com" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
          <a href="https://instagram.com" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2024 Your Company Name | All Rights Reserved</p>
      </div>
    </footer>
    </div>
    </div>
  );
};

export default Portfolio;
