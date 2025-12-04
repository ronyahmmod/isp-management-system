export default function Unauthorized({ message }) {
  return (
    <div className="flex items-center justify-center h-screen dark:bg-gray-900 dark:text-white">
      <div className="p-10 bg-red-100 border border-red-400 rounded-lg">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-red-500">{message}</p>
      </div>
    </div>
  );
}
