// Yeh component ab filtering karega
const ResourcesNav = ({
  items,
  activeItem,
  onItemClick,
}: {
  items: string[];
  activeItem: string;
  onItemClick: (item: string) => void;
}) => {
  return (
    // Sticky positioning
    <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* H-14 class se height fix rahegi */}
        <nav className="flex items-center gap-6 overflow-x-auto h-14">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onItemClick(item)}
              // Conditional styling: Active button alag dikhega
              className={`
                flex-shrink-0 text-sm font-semibold h-full flex items-center border-b-2 transition-colors duration-200
                ${
                  activeItem === item
                    ? "border-indigo-600 text-indigo-600" // Active state ka style
                    : "border-transparent text-slate-600 hover:text-indigo-600" // Inactive state ka style
                }
              `}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
