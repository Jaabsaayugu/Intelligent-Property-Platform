export default function BuyerDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Welcome, Buyer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">Featured Properties</h3>
          <p>Browse the latest listings...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2">My Messages</h3>
          <p>Check your conversations...</p>
        </div>
      </div>
    </div>
  );
}