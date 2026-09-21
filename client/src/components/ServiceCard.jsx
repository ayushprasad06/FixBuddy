import { Link } from "react-router-dom";

function ServiceCard({ icon, title, description }) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-gray-950">
        {title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
        {description}
      </p>

      <Link
        to="/services"
        className="mt-auto pt-5 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700"
      >
        Explore service →
      </Link>
    </div>
  );
}

export default ServiceCard;