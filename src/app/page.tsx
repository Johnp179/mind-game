import _ from "lodash";
import Link from "next/link";
export default function Home() {
  const arr1 = [1, 3, [4]];
  const arr2 = [1, 3, [4]];
  console.log(_.isEqual(arr1, arr2));
  return (
    <div className="flex min-h-screen flex-col  justify-center items-center gap-2.5">
      <h1 className="uppercase">Welcome to Mind Game</h1>
      <Link href="/number-game" className="border p-2 rounded-md">
        Number-Game
      </Link>
      <Link href="/puzzle-game" className="border p-2 rounded-md">
        Puzzle-Game
      </Link>
    </div>
  );
}
