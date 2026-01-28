function MessageToHost() {
  return (
    <div className="border border-gray-200 rounded-xl p-8 bg-white">
      <h2 className="text-xl font-semibold mb-4">
        2. Write a message to the host
      </h2>

      <textarea
        placeholder="Hi, I'll be arriving around 2 PM..."
        className="w-full border rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}

export default MessageToHost;
