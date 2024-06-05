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
