interface SortableHeaderProps {
  label: string;
  columnKey: string;
  sortColumn: string | null;
  sortOrder: "asc" | "desc" | null;
  onSort: (columnKey: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  columnKey,
  sortColumn,
  sortOrder,
  onSort,
}) => {
  const isActive = sortColumn === columnKey;

  return (
    <div className="flex items-center gap-1 cursor-pointer group" onClick={() => onSort(columnKey)}>
      {label}

      <span className="flex items-center">
        {isActive && sortOrder === "asc" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-400 group-hover:text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {isActive && sortOrder === "desc" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-400 group-hover:text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {!isActive && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 14.707a1 1 0 001.414 0L10 11.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>
    </div>
  );
};

export default SortableHeader;
