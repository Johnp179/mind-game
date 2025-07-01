"use client";

import { useState, useEffect } from "react";

function useInitializer(id: string) {
  useEffect(() => {
    console.log(`comp ${id} has just been created`);
    return () => console.log(`comp ${id} is now destroyed`);
  }, []);
}

function CompTwo({ switcher }: { switcher: () => void }) {
  useInitializer("2");
  return (
    <div>
      <h1>This is the the second Component</h1>
      <button onClick={() => switcher()}>switch</button>
    </div>
  );
}
function CompOne({ switcher }: { switcher: () => void }) {
  useInitializer("1");
  return (
    <div>
      <h1>This is the first Component</h1>
      <button onClick={switcher}>switch</button>
    </div>
  );
}

export default function Page() {
  const [switcher, setSwitcher] = useState(false);

  function onClick() {
    setSwitcher(!switcher);
  }

  if (switcher) return <CompOne switcher={onClick} />;
  return <CompTwo switcher={onClick} />;
}
