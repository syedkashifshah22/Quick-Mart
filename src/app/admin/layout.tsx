import Sidebar from "../../components/Sidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    );
  }
  