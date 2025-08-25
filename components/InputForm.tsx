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
    <div className="glass p-6 rounded-2xl space-y-4 w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Describe the item (e.g. red satin top)"
            className="w-full p-3 rounded-lg bg-transparent border border-[color:var(--border)] placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Mood or occasion (e.g. party, work)"
            className="w-full p-3 rounded-lg bg-transparent border border-[color:var(--border)] placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary px-4 py-3 rounded-lg w-full transition-transform active:scale-[0.99]"
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Outfit Suggestions"}
        </button>
      </form>

      {loading && (
        <p className="text-center opacity-70 mt-1 animate-pulse">
          Generating outfit suggestions...
        </p>
      )}
    </div>
  );
}
