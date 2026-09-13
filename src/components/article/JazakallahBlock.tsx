"use client";

import { useEffect, useState, useRef } from "react";
import GeometricPattern from "../ui/GeometricPattern";

export default function JazakallahBlock() {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={blockRef}
      className={`my-24 py-16 px-8 text-center rounded-productframes bg-surface-card border border-border-default relative overflow-hidden transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <GeometricPattern className="opacity-10" />
      <div className="relative z-10">
        <p dir="rtl" lang="ar" className="text-3xl md:text-5xl arabic-text text-ember-coral mb-6 leading-loose">
          جَزَاكَ اللَّهُ خَيْرًا
        </p>
        <p className="text-subheading md:text-2xl font-display font-bold text-heading">
          வாசித்தமைக்கு நன்றி!
        </p>
        <p className="font-body text-body text-body-text mt-3 max-w-lg mx-auto">
          அல்லாஹ்தஆலா நம் அனைவருக்கும் நற்கூலியை வழங்குவானாக.
        </p>
      </div>
    </div>
  );
}
