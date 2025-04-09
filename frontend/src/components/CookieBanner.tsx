import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    } else {
      if (consent === "accepted" && !Cookies.get("interactionId")) {
        const id = generateInteractionId();
        Cookies.set("interactionId", id, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        });
      }
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookieConsent", "accepted", { expires: 365 });
    const id = generateInteractionId();
    Cookies.set("interactionId", id, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    setShowBanner(false);
  };

  const handleReject = () => {
    Cookies.set("cookieConsent", "rejected", { expires: 365 });
    setShowBanner(false);
  };

  const generateInteractionId = (): string => {
    return "xxxxxx-xxxx-4xxx-yxxx-xxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  };

  if (!showBanner) return null;

  return (
    <div style={styles.banner}>
      <p style={styles.text}>
        We use cookies to understand how users interact with the site and
        improve your experience. Accept or reject?
      </p>
      <div>
        <button onClick={handleAccept} style={styles.button}>
          Accept
        </button>
        <button onClick={handleReject} style={styles.button}>
          Reject
        </button>
      </div>
    </div>
  );
};

// Type-safe styles object
const styles: { [key: string]: React.CSSProperties } = {
  banner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#eee",
    padding: "1rem",
    borderTop: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    marginBottom: "0.5rem",
  },
  button: {
    margin: "0 5px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
};

export default CookieBanner;
