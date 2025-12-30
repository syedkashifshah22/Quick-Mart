import Sidebar from "../../components/Sidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="ml-64 p-6 w-full">{children}</main>
      </div>
    );
  }
  