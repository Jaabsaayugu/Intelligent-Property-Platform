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
          <div className="mb-2">
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={3}
              placeholder="Type your message to the seller..."
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              type="button"
            >
              Send
            </button>
          </div>
          {/* Conversation thread would be displayed here */}
          <div className="bg-gray-50 border rounded p-2 min-h-[60px] text-sm text-gray-700">
            No messages yet.
          </div>
        </div>
      </div>
    </div>
  );
}