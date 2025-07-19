"use client";

function doSomething() {
  return "this is just some random data";
}

export default function Page() {
  return (
    <div>
      <h1>{doSomething()}</h1>
    </div>
  );
}
