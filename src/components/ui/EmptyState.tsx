import { LucideIcon } from "lucide-react";
import React from "react";
import { Button } from "./Button";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export default function EmptyState({ icon: Icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="text-center py-24 bg-surface-card rounded-cards border border-border-default shadow-card animate-fade-in-up">
      <div className="w-20 h-20 bg-surface-page rounded-full flex items-center justify-center mx-auto mb-6 shadow-card">
        <Icon className="w-10 h-10 text-muted-text" />
      </div>
      <p className="font-display text-2xl font-bold text-heading mb-2">{title}</p>
      <div className="font-body text-body text-body-text max-w-md mx-auto">
        {description}
      </div>
      
      {(action || secondaryAction) && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {action && (
            <Button 
              href={action.href}
              onClick={action.onClick}
              variant={action.variant || 'primary'}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button 
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
              variant={secondaryAction.variant || 'secondary'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
