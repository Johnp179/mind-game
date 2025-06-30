"use client";

import {
  useState,
  useEffect,
  FormEvent,
  SetStateAction,
  Dispatch,
} from "react";

const buttonStyle =
  "border border-b-white rounded-md p-1.5 hover:bg-white hover:text-black";
const inputBorder = "border rounder-md p-2 text-white";

function Digit({ digit }: { digit: string }) {
  return <div className="border-2 uppercase p-2">{digit}</div>;
}

function IntroScene({
  setIntro,
  setOptions,
}: {
  setIntro: (val: boolean) => void;
  setOptions: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="uppercase">Welcome to Number Game</h1>
      <button
        onClick={() => setIntro(false)}
        className={`${buttonStyle} w-[80px]`}
      >
        start
      </button>
      <button
        onClick={() => setOptions(true)}
        className={`${buttonStyle} w-[80px]`}
      >
        Options
      </button>
    </div>
  );
}
function getRandom(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function generateDigits(difficulty: number) {
  let res = "";
  for (let i = 0; i < difficulty; i++) {
    res = res + getRandom(0, 9);
  }
  return res;
}

function Digits({
  digits,
  setShowDigits,
}: {
  digits: string[];
  setShowDigits: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const timeOut = setTimeout(() => setShowDigits(false), 4000);
    return () => clearTimeout(timeOut);
  }, []);

  return (
    <div className="flex gap-1.5 uppercase">
      {digits.map((digit, idx) => (
        <Digit key={idx} digit={digit} />
      ))}
    </div>
  );
}

function Form({
  setScore,
  randomNum,
  reset,
}: {
  setScore: Dispatch<SetStateAction<number>>;
  randomNum: string;
  reset: () => void;
}) {
  const [answer, setAnswer] = useState("");
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (answer === randomNum) {
      setScore((val) => val + 1);
    }
    reset();
  }
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        className={inputBorder}
        placeholder="answer..."
        type="text"
        autoFocus
        onChange={(event) => setAnswer(event.target.value)}
      />
    </form>
  );
}

function MainScene({
  difficulty,
  setScore,
  setIterationCount,
}: {
  difficulty: number;
  setIterationCount: Dispatch<SetStateAction<number>>;
  setScore: Dispatch<SetStateAction<number>>;
}) {
  function reset() {
    setIterationCount((val) => val + 1);
    setRandomNum(generateDigits(difficulty));
    setShowDigits(true);
  }

  const [showDigits, setShowDigits] = useState(true);
  const [randomNum, setRandomNum] = useState<string>(
    generateDigits(difficulty)
  );
  return (
    <div className="flex flex-col gap-10 min-h-screen items-center justify-center">
      {showDigits ? (
        <Digits digits={randomNum.split("")} setShowDigits={setShowDigits} />
      ) : (
        <Form setScore={setScore} randomNum={randomNum} reset={reset} />
      )}
    </div>
  );
}

function OptionsScene({
  setDifficulty,
  difficulty,
  setOptions,
}: {
  difficulty: number;
  setOptions: (val: boolean) => void;
  setDifficulty: (val: number) => void;
}) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOptions(false);
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="flex flex-col justify-center items-center gap-2"
        onSubmit={onSubmit}
      >
        <input
          className="border text-white p-0.5"
          value={difficulty}
          min="5"
          max="12"
          type="range"
          onChange={(e) => setDifficulty(Number(e.target.value))}
        />
        <p className="text-center">{difficulty}</p>
        <button className={`${buttonStyle} w-[80%] block`}>Submit</button>
      </form>
    </div>
  );
}
function ScoreScene({
  score,
  setOptions,
  iterations,
  startNewGame,
}: {
  setOptions: (val: boolean) => void;
  score: number;
  iterations: number;
  startNewGame: () => void;
  setDifficulty: (val: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
      <h1>Your score is {(score / iterations) * 100} %</h1>
      <button className={buttonStyle} onClick={() => startNewGame()}>
        Play Again?
      </button>
      <button className={buttonStyle} onClick={() => setOptions(true)}>
        Options
      </button>
    </div>
  );
}

export default function Page() {
  const numOfIterations = 2;
  const [intro, setIntro] = useState(true);
  const [options, setOptions] = useState(false);
  const [difficulty, setDifficulty] = useState(8);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [iterationCount, setIterationCount] = useState(0);

  function startNewGame() {
    setIterationCount(0);
    setGameOver(false);
    setScore(0);
  }

  if (options)
    return (
      <OptionsScene
        setDifficulty={setDifficulty}
        setOptions={setOptions}
        difficulty={difficulty}
      />
    );

  if (gameOver) {
    return (
      <ScoreScene
        setOptions={setOptions}
        startNewGame={startNewGame}
        score={score}
        iterations={numOfIterations}
        setDifficulty={setDifficulty}
      />
    );
  }

  if (iterationCount === numOfIterations) {
    setGameOver(true);
  }

  if (intro) {
    return <IntroScene setIntro={setIntro} setOptions={setOptions} />;
  }
  return (
    <MainScene
      difficulty={difficulty}
      setScore={setScore}
      setIterationCount={setIterationCount}
    />
  );
}
