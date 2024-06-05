import Link from "next/link";

export default function Button(props: {
  href: string;
  text: string;
  yellow?: boolean;
  newTab?: boolean;
}) {
  return (
    <Link
      rel={props.newTab ? "noopener noreferrer" : ""}
      target={props.newTab ? "_blank" : ""}
      href={props.href}
      passHref
    >
      <button
        className={`${props.yellow ? "bg-generate-sw hover:bg-generate-sw-dark" : "bg-white hover:bg-project-row"} text-black py-3 px-12`}
      >
        {props.text}
      </button>
    </Link>
  );
}

export function CreateButton(props: { onClick: () => void }) {
  return (
    <button onClick={props.onClick}>
      <img className=" px-4" src="./images/PlusIcon.svg" />
    </button>
  );
}

export function DeleteButton(props: { onClick: () => void }) {
  return (
    <button onClick={props.onClick}>
      <img className=" px-4" src="./images/DeleteIcon.svg" />
    </button>
  );
}

export function PauseButton(props: { onClick: () => void }) {
  return (
    <button onClick={props.onClick}>
      <img className=" px-4" src="./images/PauseIcon.svg" />
    </button>
  );
}

export function PlayButton(props: { onClick: () => void }) {
  return (
    <button onClick={props.onClick}>
      <img className=" px-4" src="./images/PlayIcon.svg" />
    </button>
  );
}
