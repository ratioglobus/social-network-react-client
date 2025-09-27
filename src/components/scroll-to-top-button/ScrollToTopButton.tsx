// src/components/scroll-to-top.tsx
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { ChevronUp } from "lucide-react";

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      isIconOnly
      color="primary"
      className="fixed bottom-6 right-6 shadow-lg rounded-full"
      onPress={scrollToTop}
    >
      <ChevronUp className="w-6 h-6" />
    </Button>
  );
};
