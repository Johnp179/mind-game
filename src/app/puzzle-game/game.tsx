import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import _ from "lodash";

const buttonStyle =
  "border border-white rounded-md p-1.5 hover:bg-white hover:text-black";

function IntroScene({
  setIntro,
  setOptions,
}: {
  setIntro: (val: boolean) => void;
  setOptions: (val: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
      <h1 className="uppercase">Welcome to Puzzle Game!!</h1>
      <button className={buttonStyle} onClick={() => setIntro(false)}>
        Start the game
      </button>
      <button className={buttonStyle} onClick={() => setOptions(true)}>
        Options
      </button>
    </div>
  );
}

function OptionsScene({
  time,
  difficulty,
  sequenceLength,
  setDifficulty,
  setTime,
  setSequenceLength,
  setOptions,
}: {
  time: number;
  difficulty: number;
  sequenceLength: number;
  setTime: (val: number) => void;
  setOptions: (val: boolean) => void;
  setDifficulty: (val: number) => void;
  setSequenceLength: (val: number) => void;
}) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOptions(false);
  }
  const formItemStyle = "flex flex-col gap-2";
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <div className={formItemStyle}>
          <label>Difficulty</label>
          <input
            type="range"
            value={difficulty}
            min="2"
            max="5"
            onChange={(e) => setDifficulty(Number(e.target.value))}
          />
          <p className="text-center">{difficulty}</p>
        </div>
        <div className={formItemStyle}>
          <label>Sequence Length</label>
          <input
            type="range"
            value={sequenceLength}
            min="1"
            max="4"
            onChange={(e) => setSequenceLength(Number(e.target.value))}
          />
          <p className="text-center">{sequenceLength}</p>
        </div>
        <div className={formItemStyle}>
          <label>Time</label>
          <input
            type="range"
            value={time / 1000}
            min="1"
            max="5"
            step="0.5"
            onChange={(e) => setTime(Number(e.target.value) * 1000)}
          />
          <p className="text-center">{`${time / 1000} seconds`}</p>
        </div>
        <button className={buttonStyle}>Submit</button>
      </form>
    </div>
  );
}

function ScoreScene({
  score,
  iterations,
  reset,
  setOptions,
}: {
  reset: () => void;
  score: number;
  setOptions: (val: boolean) => void;
  iterations: number;
}) {
  return (
    <div className="min-h-screen flex flex-col gap-4 justify-center items-center">
      <h1>Your score is {Math.round((score / iterations) * 100)} %</h1>
      <button className={`${buttonStyle} uppercase`} onClick={() => reset()}>
        Play again
      </button>
      <button
        className={`${buttonStyle} uppercase`}
        onClick={() => setOptions(true)}
      >
        Options
      </button>
    </div>
  );
}

function Timer({
  cumTime,
  time,
  displaySolution,
}: {
  cumTime: number;
  time: number;
  displaySolution: boolean;
}) {
  const width = Math.round((cumTime / time) * 100);
  return (
    <div
      className={`${
        displaySolution ? "invisible" : "visible"
      } relative w-52 h-9`}
    >
      <div
        className="absolute inset-0 bg-green-500 h-full"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
}

function Tile({ active }: { active: boolean }) {
  return (
    <div
      onClick={() => console.log("this tile was just clicked!")}
      className={`w-10 h-10 ${active ? "bg-red-500" : "bg-yellow-400"}`}
    ></div>
  );
}
function Board({ puzzle }: { puzzle: boolean[][] }) {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div className="flex flex-col gap-2">
        {puzzle.map((row, idx) => (
          <div className="flex gap-2" key={idx}>
            {row.map((col, idx) => (
              <Tile active={col} key={idx} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function calculateActiveTiles(input: boolean[][]) {
  let count = 0;
  for (let r = 0; r < input.length; r++) {
    for (let c = 0; c < input[r].length; c++) {
      if (input[r][c] == true) count++;
    }
  }
  return count;
}

function InteractiveTile({
  active,
  solution,
  rowIdx,
  colIdx,
  difficulty,
  setSolution,
}: {
  solution: boolean[][];
  active: boolean;
  difficulty: number;
  rowIdx: number;
  colIdx: number;
  setSolution: Dispatch<SetStateAction<boolean[][]>>;
}) {
  function onClick() {
    if (!active && calculateActiveTiles(solution) >= difficulty) return;
    setSolution((prevVal) => {
      const copy = [...prevVal];
      copy[rowIdx][colIdx] = !active;
      return copy;
    });
  }
  return (
    <div
      onClick={onClick}
      className={`w-10 h-10 ${active ? "bg-red-500" : "bg-yellow-400"}`}
    ></div>
  );
}

function InteractiveBoard({
  solution,
  difficulty,
  setSolution,
}: {
  solution: boolean[][];
  difficulty: number;
  setSolution: Dispatch<SetStateAction<boolean[][]>>;
}) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col gap-2">
          {solution.map((row, rowIdx) => (
            <div className="flex gap-2" key={rowIdx}>
              {row.map((col, colIdx) => (
                <InteractiveTile
                  solution={solution}
                  difficulty={difficulty}
                  active={col}
                  setSolution={setSolution}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  key={colIdx + row.length * rowIdx}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function getRandom(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function getRandomPair(rows: number, cols: number) {
  const r = getRandom(0, rows - 1);
  const c = getRandom(0, cols - 1);
  return [r, c];
}

function generatePuzzle(rows: number, cols: number) {
  const puzzle: boolean[][] = [];
  for (let i = 0; i < rows; i++) {
    puzzle.push([]);
  }
  for (const row of puzzle) {
    for (let i = 0; i < cols; i++) {
      row.push(false);
    }
  }
  return puzzle;
}

function generateRandomPuzzle(rows: number, cols: number, difficulty: number) {
  const puzzle: boolean[][] = generatePuzzle(rows, cols);
  let counter = 0;
  const randomPositions: number[][] = [];
  let skip = false;
  while (counter < difficulty) {
    skip = false;
    const pair = getRandomPair(rows, cols);
    for (const val of randomPositions) {
      if (val[0] === pair[0] && val[1] === pair[1]) {
        skip = true;
        continue;
      }
    }
    if (!skip) {
      randomPositions.push(pair);
      counter++;
    }
  }
  for (const val of randomPositions) {
    const [r, c] = val;
    puzzle[r][c] = true;
  }
  return puzzle;
}

type TwoDArray = boolean[][];
function win(puzzle: TwoDArray[], solution: TwoDArray[]) {
  for (let i = 0; i < puzzle.length; i++) {
    if (!_.isEqual(puzzle[i], solution[i])) return false;
  }
  return true;
}

function MainScene({
  difficulty,
  sequenceLength,
  time,
  setIterations,
  setScore,
}: {
  setIterations: Dispatch<SetStateAction<number>>;
  setScore: Dispatch<SetStateAction<number>>;
  totalIterations: number;
  time: number;
  difficulty: number;
  sequenceLength: number;
}) {
  const rows = 3;
  const cols = 3;
  const puzzles = useRef<TwoDArray[]>([]);
  const solutions = useRef<TwoDArray[]>([]);
  const [puzzle, setPuzzle] = useState(
    generateRandomPuzzle(rows, cols, difficulty)
  );
  const baseSolution = generatePuzzle(rows, cols);
  const [solution, setSolution] = useState(baseSolution);
  const [displaySolution, setDisplaySolution] = useState(false);
  const [sequences, setSequences] = useState(0);
  const deltaT = 15;
  const [cumTime, setCumTime] = useState(0);
  const [paused, setPaused] = useState(false);
  function alterPuzzle() {
    setPuzzle(generateRandomPuzzle(rows, cols, difficulty));
  }

  function restart(correct: boolean) {
    if (correct) {
      setScore((val) => val + 1);
    }
    puzzles.current = [];
    solutions.current = [];
    setDisplaySolution(false);
    setIterations((val) => val + 1);
    setPaused(false);
    // pass pause to timer to tweak visibility
  }

  function handleSubmit() {
    solutions.current.push(solution);
    setSolution(baseSolution);
    if (solutions.current.length < sequenceLength) return;
    if (win(puzzles.current, solutions.current)) {
      restart(true);
    } else {
      restart(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;
      setCumTime((val) => val + deltaT);
    }, deltaT);
    return () => clearInterval(interval);
  }, [paused]);

  if (cumTime > time) {
    puzzles.current.push(puzzle);
    alterPuzzle();
    setCumTime(0);
    setSequences(sequences + 1);
  }

  if (sequences === sequenceLength) {
    setSequences(0);
    setPaused(true);
    setDisplaySolution(true);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <Timer displaySolution={displaySolution} cumTime={cumTime} time={time} />
      {displaySolution ? (
        <InteractiveBoard
          difficulty={difficulty}
          solution={solution}
          setSolution={setSolution}
        />
      ) : (
        <Board puzzle={puzzle} />
      )}
      <button
        className={`${buttonStyle} ${
          displaySolution ? "visible" : "invisible"
        }`}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}

export default function Game() {
  const totalIterations = 3;
  const [iterations, setIterations] = useState(0);
  const [time, setTime] = useState(1500);
  const [intro, setIntro] = useState(true);
  const [options, setOptions] = useState(false);
  const [score, setScore] = useState(0);
  const [sequenceLength, setSequenceLength] = useState(2);
  const [difficulty, setDifficulty] = useState(2);
  const [gameOver, setGameOver] = useState(false);

  function reset() {
    setGameOver(false);
    setIterations(0);
    setScore(0);
  }

  if (options)
    return (
      <OptionsScene
        time={time}
        setTime={setTime}
        difficulty={difficulty}
        sequenceLength={sequenceLength}
        setOptions={setOptions}
        setDifficulty={setDifficulty}
        setSequenceLength={setSequenceLength}
      />
    );

  if (gameOver) {
    return (
      <ScoreScene
        setOptions={setOptions}
        reset={reset}
        score={score}
        iterations={totalIterations}
      />
    );
  }

  if (iterations === totalIterations) {
    setGameOver(true);
  }

  if (intro) return <IntroScene setIntro={setIntro} setOptions={setOptions} />;

  return (
    <MainScene
      setScore={setScore}
      setIterations={setIterations}
      totalIterations={totalIterations}
      time={time}
      difficulty={difficulty}
      sequenceLength={sequenceLength}
    />
  );
}
