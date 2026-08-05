import { Outlet } from "react-router-dom";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Topbar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
