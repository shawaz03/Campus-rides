import type { ReactNode } from "react";
import Providers from "@/components/providers";
import StudentSidebar from "@/components/student/StudentSidebar";
import PageTransition from "@/components/student/PageTransition";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="grain min-h-screen relative bg-[color:var(--cream)]" data-testid="student-shell">
        <div className="lg:flex">
          <StudentSidebar />
          <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-8 lg:py-10" data-testid="student-main">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </Providers>
  );
}
