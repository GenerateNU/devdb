import { CreateButton, DeleteButton } from "./Button";

export default function BranchRow(props: {
  creator: string;
  name: string;
  status: string;
}) {
  const actionLabel =
    props.status === "No DB" ? "Create Database" : "Connect to Database";

  return (
    <div className="flex justify-between items-center py-3 pl-12 pr-8 shadow-inner">
      <span className="flex flex-row w-3/5">
        {props.creator} / {props.name}
      </span>
      <span className=" w-2/5">
        <a href="#" className="hover:underline">
          {actionLabel}
        </a>
      </span>
      <div className=" flex flex-row gap-4 w-1/5 justify-end">
        {props.status === "No DB" ? <CreateButton /> : <DeleteButton />}
      </div>
    </div>
  );
}
