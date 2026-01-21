import Sidebar from "../../components/Sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="w-full p-4 sm:p-6 md:ml-64 pt-16 md:pt-6 mt-0 sm:mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
