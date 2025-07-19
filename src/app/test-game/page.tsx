"use client";

function doSomething() {
  return "the data has not changed";
}

export default function Page() {
  return (
    <div>
      <h1>{doSomething()}</h1>
    </div>
  );
}
