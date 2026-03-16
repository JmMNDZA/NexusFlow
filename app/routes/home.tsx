import type { Route } from "./+types/home";
import { GridLayoutHome } from "~/components/GridLayoutHome"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NexusFlow" },
    { name: "description", content: "Welcome to NexusFlow!" },
  ];
}

export default function Home() {
  return (
    <div className="bg-base-200 min-h-screen w-full flex flex-col items-center justify-center">
      <GridLayoutHome />
    </div>
  );
}
