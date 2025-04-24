import Sidebar from '@/app/components/Sidebar';

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to the admin dashboard.</p>
      </main>
    </div>
  );
}
