"use client";

import { useState, useRef } from "react";

export default function Page() {
  const [state, setState] = useState(0);
  console.log(state);
  const ref = useRef(state);
  return (
    <div>
      {ref.current}
      <button onClick={() => setState(state + 1)}>click</button>
    </div>
  );
}
