import type { ReactNode } from "react";
import Providers from "@/components/providers";
import StudentSidebar from "@/components/student/StudentSidebar";
import MobileBottomNav from "@/components/student/MobileBottomNav";
import PageTransition from "@/components/student/PageTransition";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="student-scope grain min-h-screen relative bg-[color:var(--cream)] pb-24 lg:pb-0" data-testid="student-shell">
        <div className="lg:flex">
          <StudentSidebar />
          <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-8 lg:py-10" data-testid="student-main">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <MobileBottomNav />
      </div>
    </Providers>
  );
}
