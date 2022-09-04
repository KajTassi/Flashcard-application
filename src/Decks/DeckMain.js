import React, { useEffect, useState } from "react";
import "../App.css";
import { useHistory } from "react-router-dom";
import DeckItem from "./DeckItem";
import { deleteDeck, listDecks } from "../utils/api";

//create the main component for decks
function DeckMain() {
  const [decks, setDecks] = useState([]);

  //create a useEffect hook for that updates every time there is a change submitted
  useEffect(() => {
    const abortController = new AbortController();
    listDecks(abortController.signal).then((decks) => {
      setDecks(decks)
    })

    return () => {
      abortController.abort();
    };
  }, [])

//create a function that deletes an exisiting deck
  async function processDelete(deck) {
    const abortController = new AbortController();

    await deleteDeck(deck.id, abortController.signal);

    await listDecks(abortController.signal).then((decks) => {
      setDecks(decks)
    })
  }

  //create a function that displays the message before deleting a deck
  const deleteHandler = (deck) => {

    if (window.confirm('Are you sure you wish to delete this item?'))
    {
      processDelete(deck);
    }
  }

  const deckElement = decks.map((deck, index) => (
    < DeckItem deck={deck} deleteHandler={deleteHandler} key={index} />
  ))

  const history = useHistory();

  return (
    <>
      <div className="create-deck">
        <button className="button-sm btn-create" onClick={() => history.push("/decks/new")}>Create Deck</button>
      </div>
      {deckElement}
    </>
  );
}

export default DeckMain;