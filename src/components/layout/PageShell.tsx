import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileNav from "./MobileNav";
import { Container } from "../ui/Container";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  hasHero?: boolean;
}

export default function PageShell({ children, className = "", hasHero = false }: PageShellProps) {
  return (
    <div className={`min-h-screen flex flex-col pt-[var(--header-height)] ${className}`}>
      <Header />
      {hasHero ? (
        <main id="main-content" tabIndex={-1} className="flex-grow focus:outline-none">
          {children}
        </main>
      ) : (
        <Container as="main" id="main-content" tabIndex={-1} className="flex-grow py-12 md:py-20 focus:outline-none">
          {children}
        </Container>
      )}
      <Footer />
      <MobileNav />
    </div>
  );
}
