// src/App.tsx
import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

// SVG imports with TypeScript declaration handling
// To these require statements
const DeliveryLogoFullSrc = require("./assets/DeliveryLogoFull.svg").default;
const DeliveryLogoSmallSrc = require("./assets/DeliveryLogoSmall.svg").default;
const JustBretheLogoSrc = require("./assets/JustBretheLogo.svg").default;
import MapComponent from "./MapComponent"; // <--- Import your separate component

// Animation timing constants
const LOADING_DELAY = 1500;
const FADE_DURATION = 800; // ms for fade animations

// TypeScript interfaces
interface LoadingScreenProps {
  animateOut: boolean;
  onAnimationComplete: () => void;
}

interface AgeGateProps {
  onYes: () => void;
  onNo: () => void;
  animateOut: boolean;
}

interface ProductCardProps {
  productKey: string;
  title?: string;
  category?: string;
  brand?: string;
}

interface ProductCarouselProps {
  title: string;
  itemCount: number;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isOfAge, setIsOfAge] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [currentScreen, setCurrentScreen] = useState("loading");

  // Called when Loading Screen finishes animating out
  const handleLoadingComplete = () => {
    setCurrentScreen("ageGate");
    setAnimateOut(false);
  };

  useEffect(() => {
    // Trigger loading-screen fade out after LOADING_DELAY ms
    const timer = setTimeout(() => {
      setAnimateOut(true);
    }, LOADING_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Age Gate: user says "Yes"
  const handleAgeYes = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setIsOfAge(true);
      setCurrentScreen("home");
      localStorage.setItem("isOfAge", "true");
      setAnimateOut(false);
    }, FADE_DURATION);
  };

  // Age Gate: user says "No"
  const handleAgeNo = () => {
    alert("Sorry, you must be 21 or older to view this content.");
  };

  // Conditionally render the current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case "loading":
        return (
          <LoadingScreen
            animateOut={animateOut}
            onAnimationComplete={handleLoadingComplete}
          />
        );
      case "ageGate":
        return (
          <AgeGate
            onYes={handleAgeYes}
            onNo={handleAgeNo}
            animateOut={animateOut}
          />
        );
      case "home":
        return <HomePage />;
      default:
        return (
          <LoadingScreen
            animateOut={animateOut}
            onAnimationComplete={handleLoadingComplete}
          />
        );
    }
  };

  return renderScreen();
}

// ----------------------------------------------------
// Loading Screen Component
function LoadingScreen({
  animateOut,
  onAnimationComplete,
}: LoadingScreenProps) {
  useEffect(() => {
    if (animateOut) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, FADE_DURATION);
      return () => clearTimeout(timer);
    }
  }, [animateOut, onAnimationComplete]);

  return (
    <div
      className={`screen loading-screen ${animateOut ? "fade-out" : "fade-in"}`}
    >
      <div className={`logo-container ${animateOut ? "logo-shrink" : ""}`}>
        <img
          src={DeliveryLogoFullSrc}
          alt="Cannabis delivery logo"
          className="logo"
          style={{ width: "198px" }}
        />
      </div>
      <p className="loading-subtitle">
        <span className="powered-by">powered by</span>
      </p>
      <img
        src={JustBretheLogoSrc}
        alt="Just Breathe"
        className="just-breathe-logo"
      />
    </div>
  );
}

// ----------------------------------------------------
// Age Gate Component
function AgeGate({ onYes, onNo, animateOut }: AgeGateProps) {
  return (
    <div
      className={`screen agegate-screen ${animateOut ? "fade-out" : "fade-in"}`}
    >
      <div className="agegate-content">
        <div className="agegate-logo">
          <img
            src={DeliveryLogoFullSrc}
            alt="Cannabis delivery logo"
            className="logo-agegate"
          />
        </div>
        <h1 className="agegate-title">we have to ask...</h1>
        <p className="agegate-subtitle">are you 21 or older?</p>
        <div className="agegate-buttons">
          <button className="btn-yes" onClick={onYes}>
            yes
          </button>
          <button className="btn-no" onClick={onNo}>
            no
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// ProductCard
function ProductCard({
  productKey,
  title = ".5G Vape Pen",
  category = "All-In-One",
  brand = "Ayrloom",
}: ProductCardProps) {
  return (
    <div className="product-card" key={productKey}>
      <div className="product-card-inner">
        <div className="product-image-container">
          <img
            src="https://ayrloom.com/cdn/shop/files/ayr-vapes-cerealmilk-1g.png?v=1721221278"
            alt="Vape pen"
            className="product-image"
          />
        </div>
        <div className="product-info">
          <span className="product-category">{category}</span>
          <h4 className="product-title">{title}</h4>
          <span className="product-brand">{brand}</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// ProductCarousel
function ProductCarousel({ title, itemCount }: ProductCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="product-carousel-container">
      <div className="carousel-header">
        <h3 className="category-title">{title}</h3>
        <div className="carousel-controls">
          <button
            className="carousel-control carousel-control-left"
            onClick={() => handleScroll("left")}
          >
            &#10094;
          </button>
          <button
            className="carousel-control carousel-control-right"
            onClick={() => handleScroll("right")}
          >
            &#10095;
          </button>
        </div>
      </div>
      <div className="product-carousel" ref={carouselRef}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <ProductCard productKey={`${title}-${index}`} />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Home Page
function HomePage() {
  const [countdown, setCountdown] = useState("");
  const address = "195 State St, Binghamton, NY 13901";

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateTimeTo9PM());
    }, 1000);

    // Initial
    setCountdown(calculateTimeTo9PM());

    return () => clearInterval(interval);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        alert("Address copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy address.");
      });
  };

  return (
    <div className="screen home-screen fade-in">
      <header className="header">
        <img
          src={DeliveryLogoSmallSrc}
          alt="Cannabis delivery small logo"
          width="30"
          height="30"
        />
        <div>
          <h2 className="header-title">cannabis delivery</h2>
          <img
            src={JustBretheLogoSrc}
            alt="Just Breathe"
            className="header-just-breathe-logo"
            style={{ height: "18px", width: "auto" }}
          />
        </div>
      </header>

      {/* Delivery Info & Map */}
      <div className="map-section">
        <div className="map-placeholder">
          {/* <-- Importing our separate MapComponent */}
          <MapComponent address={address} />
        </div>

        <div className="delivery-info">
          <p className="delivery-to">delivery to...</p>
          <div className="location-container">
            <h3 className="location-title">Crowbar Arcade</h3>
            <div className="address-copy-container">
              <p className="location-subtitle">{address}</p>
              <span className="copy-address-link" onClick={handleCopyAddress}>
                Copy Address
              </span>
            </div>
          </div>

          <div className="delivery-times">
            <p className="delivery-times-title">Delivery times:</p>
            <div className="time-buttons">
              <button className="time-btn time-btn-first">9:00pm</button>
              <button className="time-btn time-btn-other">10:00pm</button>
              <button className="time-btn time-btn-other">11:00pm</button>
            </div>
            <p className="order-timer">order in {countdown}</p>
          </div>
        </div>
      </div>

      {/* Product Carousels */}
      <div className="products-section">
        <ProductCarousel title="Vapes" itemCount={6} />
        <ProductCarousel title="Edibles" itemCount={8} />
        <ProductCarousel title="Flower" itemCount={5} />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Countdown Helper
function calculateTimeTo9PM() {
  const now = new Date();
  const target = new Date();

  // Set to 9:00 PM local time
  target.setHours(21, 0, 0, 0);

  // If it's already past 9pm, assume tomorrow
  if (now.getTime() > target.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - now.getTime(); // ms until 9pm
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  // Format as HH:MM:SS
  const hh = hours < 10 ? `0${hours}` : `${hours}`;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hh}:${mm}:${ss}`;
}

export default App;
