import { Heart, Database } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 backdrop-blur-md mt-auto py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand/Info Column */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-foreground tracking-wider uppercase">PayrollPro HRMS</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              An enterprise-grade multi-tenant HR & Payroll management platform powered by Supabase.
            </p>
          </div>

          {/* System Status Indicators */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Operational
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-medium">
              <Database className="h-3.5 w-3.5" />
              Supabase Database Live
            </span>
          </div>

          {/* Github ID / Profile Info Column */}
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/prince-up"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                @prince-up
              </a>
              <span className="text-muted-foreground/30">|</span>
              <a
                href="https://github.com/prince-up/employee-referal"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
              >
                Repository
              </a>
            </div>
            <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 justify-center md:justify-end">
              Developed with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> by Prince Yadav
            </p>
          </div>
        </div>

        <div className="border-t border-border/60 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
          <p>© 2026 PayrollPro Systems. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Support Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
