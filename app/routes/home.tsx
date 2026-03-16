import type { Route } from "./+types/home";
import { GridLayoutHome } from "~/components/GridLayoutHome"
import { Navbar } from "~/components/Navbar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NexusFlow" },
    { name: "description", content: "Welcome to NexusFlow!" },
  ];
}

export default function Home() {
  return (
    <div className="bg-base-200 min-h-screen w-full flex flex-col">
      <Navbar modifyType="simple" />
      <main className="flex items-center">
        <GridLayoutHome />
      </main>
    </div>
  );
}