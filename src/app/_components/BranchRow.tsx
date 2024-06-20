export default function BranchRow(props: {
  creator: string;
  name: string;
  baseConnection?: string | null;
}) {
  return (
    <div className="flex justify-between items-center py-3 pl-12 pr-8 shadow-inner">
      <span className="flex flex-row w-3/5">
        {props.creator} / {props.name}
      </span>
      <span className=" w-2/5">
        {props.baseConnection && (
          <a
            onClick={() =>
              navigator.clipboard.writeText(
                `${props.baseConnection}/${props.name}`,
              )
            }
            className="hover:underline"
          >
            Copy Connection URL
          </a>
        )}
      </span>
      <div className=" flex flex-row gap-4 w-1/5 justify-end"></div>
    </div>
  );
}
