import React from 'react';
import { Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

interface InfoBoxProps {
  type?: 'note' | 'warning' | 'important' | 'tip';
  title?: string;
  children: React.ReactNode;
}

export default function InfoBox({ type = 'note', title, children }: InfoBoxProps) {
  const config = {
    note: {
      icon: Info,
      bgClass: 'bg-[color:var(--color-surface-card)]',
      borderClass: 'border-[color:var(--color-moss)]',
      iconClass: 'text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]',
      defaultTitle: 'குறிப்பு (Note)',
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-[color:var(--color-surface-card)]',
      borderClass: 'border-[color:var(--color-ember-coral)]',
      iconClass: 'text-[color:var(--color-ember-coral)]',
      defaultTitle: 'எச்சரிக்கை (Warning)',
    },
    important: {
      icon: AlertCircle,
      bgClass: 'bg-[color:var(--color-surface-card)]',
      borderClass: 'border-[color:var(--color-true-black)] dark:border-[color:var(--color-cream-paper)]',
      iconClass: 'text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)]',
      defaultTitle: 'முக்கியம் (Important)',
    },
    tip: {
      icon: Lightbulb,
      bgClass: 'bg-[color:var(--color-surface-card)]',
      borderClass: 'border-[color:var(--color-lime-sprout)]',
      iconClass: 'text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]',
      defaultTitle: 'உதவிக்குறிப்பு (Tip)',
    }
  };

  const { icon: Icon, bgClass, borderClass, iconClass, defaultTitle } = config[type];
  const displayTitle = title || defaultTitle;

  return (
    <div className={`my-8 flex gap-4 rounded-[length:var(--radius-cards)] border border-l-4 ${borderClass} ${bgClass} p-5`}>
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${iconClass}`} />
      </div>
      <div className="flex-1">
        <h4 className={`mb-2 font-[family-name:var(--font-ui)] text-[length:var(--text-body)] font-bold ${iconClass}`}>
          {displayTitle}
        </h4>
        <div className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] leading-[var(--leading-body)] text-[color:var(--color-body-text)]">
          {children}
        </div>
      </div>
    </div>
  );
}
