"use client";

import { useRef, useState } from "react";

export default function Page() {
  const data = useRef<number[]>([]);
  const [counter, setCounter] = useState(0);

  function onClick() {
    setCounter(counter + 1);
    data.current.push(counter);
    console.log(data.current.length);
  }
  return (
    <div className="flex gap-1.5">
      <button onClick={onClick}>click me</button>
      <p>{JSON.stringify(data.current)}</p>
    </div>
  );
}
