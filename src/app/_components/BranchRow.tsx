export default function BranchRow(props: {
  name: string;
  status: string;
  action: string;
  actionLabel: string;
}) {
  return (
    <div className="flex justify-between items-center py-3 px-12 shadow-inner">
      <span>
        {props.name} / {props.status}
      </span>
      <span>
        {props.status} /{" "}
        <a href="#" className="text-blue-500 hover:underline">
          {props.actionLabel}
        </a>
      </span>
      <button>
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={`M${props.action}`}
          />
        </svg>
      </button>
      <button>
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
