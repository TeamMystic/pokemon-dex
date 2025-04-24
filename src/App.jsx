import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useParams } from "react-router-dom";
import useSearchPokemon from "./hook/useSearchPokemon";

function App() {
  const { query } = useParams();
  const [count, setCount] = useState(0);
  const scrollContainer = useRef();
  const [toBottom, settoBottom] = useState(false);
  const [scrollTop, setscrollTop] = useState(0);
  const { dataQuery, search, type, attr } = useSearchPokemon(query, toBottom);

  const handleScroll = () => {
    setscrollTop(scrollContainer.current.scrollTop);
    Math.ceil(
      scrollContainer.current.scrollTop + scrollContainer.current.clientHeight
    ) >= scrollContainer.current.scrollHeight
      ? settoBottom(true)
      : settoBottom(false);
  };

  useEffect(() => {
    console.log(scrollContainer.current.scrollHeight, "this scroll height");
    console.log(scrollContainer.current.scrollTop, "this scroll Top");
    console.log(
      scrollContainer.current.clientHeight + scrollContainer.current.scrollTop,
      "this client height"
    );
  }, []);
  return (
    <>
      <div
        ref={scrollContainer}
        onScroll={handleScroll}
        className="bg-blue-300 overflow-y-scroll h-screen"
      >
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
        <div className="pb-[999px]">d</div>
      </div>
    </>
  );
}

export default App;
