import { useState, useEffect, useRef } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const sbKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(sbUrl, sbKey);

function ScoresPanel({ scores }) {
  return (
    <section>
      <p>
        <b className="">Current score: </b>
        {scores.current}
      </p>
      <p>
        <b className="">Best score: </b>
        {scores.best}
      </p>
    </section>
  );
}

function Card(props) {
  return <img onClick={props.onclick} src={props.img_url} />;
}

function Board({ children }) {
  return <section className="grid grid-cols-5">{children}</section>;
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

  const deckSubset = deck.current?.sort((c) => Math.random() - 0.5).slice(0, 5);

  return (
    <>
      <main className="bg-black text-white m-0 h-screen">
        <ScoresPanel scores={scores}></ScoresPanel>
        <Board>
          {deckSubset?.map((c) => (
            <Card key={c.uuid} onclick={() => checkCard(c.uuid)} {...c}></Card>
          ))}
        </Board>
      </main>
    </>
  );
}

export default App;
