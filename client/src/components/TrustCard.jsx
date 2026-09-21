function TrustCard({ value, label, description }) {
  return (
    <div className="border-l border-gray-200 pl-6">
      <p className="text-4xl font-bold tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-2 font-semibold text-gray-900">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default TrustCard;