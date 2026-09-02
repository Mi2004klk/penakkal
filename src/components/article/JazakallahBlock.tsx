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
      className={`my-24 py-16 px-8 text-center rounded-[length:var(--radius-productframes)] bg-[color:var(--color-surface-card)] border border-[color:var(--color-border-default)] relative overflow-hidden transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <GeometricPattern className="opacity-10 dark:opacity-[0.05]" />
      <div className="relative z-10">
        <p className="text-3xl md:text-5xl font-[family-name:var(--font-arabic)] text-[color:var(--color-ember-coral)] mb-6 leading-loose">
          جَزَاكَ اللَّهُ خَيْرًا
        </p>
        <p className="text-[length:var(--text-subheading)] md:text-2xl font-[family-name:var(--font-display)] font-bold text-[color:var(--color-heading)]">
          வாசித்தமைக்கு நன்றி!
        </p>
        <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] mt-3 max-w-lg mx-auto">
          அல்லாஹ்தஆலா நம் அனைவருக்கும் நற்கூலியை வழங்குவானாக.
        </p>
      </div>
    </div>
  );
}
