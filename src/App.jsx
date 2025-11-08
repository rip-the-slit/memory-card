import { useState, useEffect, useRef } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const sbKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(sbUrl, sbKey);

function ScoresPanel({ scores }) {
  return (
    <section className="mb-3 ">
      <p>
        <b className="">Current score: </b>
        {!scores.current && scores.best ? (
          <span className="failed">{scores.current}</span>
        ) : (
          scores.current
        )}
      </p>
      <p>
        <b className="">Best score: </b>
        {scores.best}
      </p>
    </section>
  );
}

function Card(props) {
  return (
    <img
      className="cursor-pointer active:scale-90 rounded-lg"
      onClick={props.onclick}
      src={props.img_url}
    />
  );
}

function Board({ children }) {
  return (
    <section className="grid grid-cols-3 gap-2 sm:gap-5 place-content-center sm:max-w-[40vw]">
      {children}
    </section>
  );
}

function App() {
  const [scores, setScores] = useState({ current: 0, best: 0 });
  const deck = useRef(null);

  const reset = () => {
    if (!deck.current) return;

    for (const card of deck.current) {
      card.clicked = false;
    }
  };

  const checkCard = (uuid) => {
    if (!deck.current) return;

    for (const card of deck.current) {
      if (card.uuid != uuid) continue;

      if (card.clicked) {
        reset();
        setScores({
          current: 0,
          best: scores.current > scores.best ? scores.current : scores.best,
        });
      } else {
        card.clicked = true;
        setScores({ ...scores, current: scores.current + 1 });
      }
    }
  };

  useEffect(() => {
    supabase
      .from("photos")
      .select("*")
      .then(({ data }) => {
        deck.current = data.map((c) => ({ ...c, clicked: false }));
        setScores({ ...scores });
      });
  }, []);

  const deckSubset = deck.current?.sort((c) => Math.random() - 0.5).slice(0, 6);

  return (
    <>
      <main className="bg-black text-white font-display m-0 h-screen p-5 flex justify-center">
        <div className="max-w-[1000px]">
          <h1 className="text-xl text-center mb-3">
            act i RENAISSANCE <span className="mx-5">Memory Game</span>
          </h1>
          <ScoresPanel scores={scores}></ScoresPanel>
          <Board>
            {deckSubset?.map((c) => (
              <Card
                key={c.uuid}
                onclick={() => checkCard(c.uuid)}
                {...c}
              ></Card>
            ))}
          </Board>
        </div>
      </main>
    </>
  );
}

export default App;
