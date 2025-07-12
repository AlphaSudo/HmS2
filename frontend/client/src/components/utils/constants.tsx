// export const STATUS_COLORS: Record<string, string> = {
//   Completed: 'bg-green-100 text-green-800',
//   Scheduled: 'bg-blue-100 text-blue-800',
//   Cancelled: 'bg-red-100 text-red-800',
// };

// export const AVATAR_BG: Record<string, string> = {
//   female: 'bg-pink-200',
//   male: 'bg-blue-200',
// };



export const AVATAR_BG: Record<string, string> = {
  male: "bg-[#0C4A6E]",
  female: "bg-[#5D0A72]",
};

export const STATUS_COLORS: Record<string, string> = {
  Scheduled: "bg-blue-500/20 text-blue-400",
  Completed: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

export const TruncatedWithTooltip = ({ text, maxWidth }: { text: string; maxWidth: string }) => (
  <div className="relative group inline-block max-w-full">
    <div 
      className={`truncate ${maxWidth}`} 
      title={text} // Improves accessibility
    >
      {text}
    </div>
    <div className="absolute z-10 invisible group-hover:visible bg-[#3466ad] text-white text-xs rounded py-1 px-2 bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap max-w-xs overflow-hidden overflow-ellipsis">
      {text}
      <div className="absolute w-2 h-2 bg-[#3466ad] rotate-45 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
    </div>
  </div>
);
