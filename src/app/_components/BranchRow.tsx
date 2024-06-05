function CreateButton() {
  return (
    <button>
      <img className=" px-4" src="./images/PlusIcon.svg" />
    </button>
  );
}

function DeleteButton() {
  return (
    <button>
      <img className=" px-4" src="./images/DeleteIcon.svg" />
    </button>
  );
}

function PauseButton() {
  return (
    <button>
      <img className=" px-4" src="./images/PauseIcon.svg" />
    </button>
  );
}

function PlayButton() {
  return (
    <button>
      <img className=" px-4" src="./images/PlayIcon.svg" />
    </button>
  );
}

export default function BranchRow(props: {
  creator: string;
  name: string;
  status: string;
}) {
  const actionLabel =
    status === "No DB" ? "Create Database" : "Connect to Database";

  return (
    <div className="flex justify-between items-center py-3 pl-12 pr-8 shadow-inner">
      <span>
        {props.creator} / {props.name}
      </span>
      <span>
        {props.status} /{" "}
        <a href="#" className="text-blue-500 hover:underline">
          {actionLabel}
        </a>
      </span>
      <div className=" flex flex-row gap-4">
        {props.status === "No DB" && <CreateButton />}
        {props.status === "Stopped" && <PlayButton />}
        {props.status === "Running" && <PauseButton />}
        {(props.status === "Running" || props.status === "Stopped") && (
          <DeleteButton />
        )}
      </div>
    </div>
  );
}
