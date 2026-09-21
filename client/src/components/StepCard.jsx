function StepCard({ number, icon, title, description }) {
  return (
    <div className="relative">

      <div className="flex items-start gap-5">
        {/* Number */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-950 text-sm font-bold text-white">
          {number}
        </div>

        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
            {icon}
          </div>

          <h3 className="text-xl font-bold text-gray-950">
            {title}
          </h3>

          <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>
      </div>

    </div>
  );
}

export default StepCard;