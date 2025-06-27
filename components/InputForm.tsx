import { useState } from "react";

export default function InputForm({
  onResult,
}: {
  onResult: (result: string[]) => void;
}) {
  const [item, setItem] = useState("");
  const [occasion, setOccasion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, occasion }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      onResult(data.suggestions);
    } else {
      onResult(["Failed to generate outfit. Please try again."]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Describe the item (e.g. red satin top)"
          className="w-full p-3 rounded-lg bg-white text-gray-800 shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mood or occasion (e.g. party, work)"
          className="w-full p-3 rounded-lg bg-white text-gray-800 shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full transition-all hover:bg-gray-900"
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Outfit Suggestions"}
        </button>
      </form>

      {loading && (
        <p className="text-center text-gray-500 mt-2 animate-pulse">
          Generating outfit suggestions...
        </p>
      )}
    </div>
  );
}
