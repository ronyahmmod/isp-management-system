export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-center flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        ISP Management System
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md">
        A complete billing, employee, and network management system for ISPs.
      </p>
      <a
        href="/login"
        className="mt-6 inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
      >
        Login
      </a>
    </main>
  );
}
