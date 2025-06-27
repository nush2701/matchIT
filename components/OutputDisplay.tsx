type OutputDisplayProps = {
  output: string[];
};

export default function OutputDisplay({ output }: OutputDisplayProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mt-8">
      {output.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition duration-200"
        >
          <p className="text-gray-800">{item}</p>
        </div>
      ))}
    </div>
  );
}
