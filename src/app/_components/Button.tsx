import Link from "next/link";

export default function Button(props: {
  href: string;
  text: string;
  yellow?: boolean;
}) {
  return (
    <Link href={props.href} passHref>
      <button
        className={`${props.yellow ? "bg-generate-sw hover:bg-generate-sw-dark" : "bg-white hover:bg-project-row"} text-black py-3 px-12`}
      >
        {props.text}
      </button>
    </Link>
  );
}
