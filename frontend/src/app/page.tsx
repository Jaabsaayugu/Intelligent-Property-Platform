export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Intelligent Property Platform</h1>
      <p className="text-xl mb-8">Welcome! Choose your role to continue</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="/login?role=buyer" className="px-8 py-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center">
          Buyer
        </a>
        <a href="/login?role=seller" className="px-8 py-6 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center">
          Seller
        </a>
        <a href="/login?role=admin" className="px-8 py-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center">
          Admin
        </a>
      </div>
    </main>
  );
}