import React from "react";
import "../App.css";
import { useEffect, useState } from "react";
import { Route, Link, useParams, useHistory } from "react-router-dom";
import { readDeck, deleteCard, deleteDeck } from "../utils/api";
import CardItem from "../Cards/CardItem";


//create a component function that allows you to view existing decks
function DeckView() {
  const [deck, setDeck] = useState({});

  const { deckId } = useParams();

//create a useEffect hook with an abort controller that updates the page whenever a deckId is changed
  useEffect(() => {
    const abortController = new AbortController();
    readDeck(deckId, abortController.signal).then((deck) => {
      setDeck(deck)
    })
      .catch(err => {
        alert(err)
      });

    return () => {
      abortController.abort();
    };
  }, [deckId])

  //create a function that allows you to delete an existing card when viewing it
  async function processCardDelete(card) {
    const abortController = new AbortController();
    await deleteCard(card.id, abortController.signal);
    const deckFromServer = await readDeck(deck.id, abortController.signal)
    try
    {
      setDeck(deckFromServer)
    } catch (err)
    {
      alert(err)
    }
  }

  //create a handle click that allwos us to delete a card in a deck
  const deleteCardHandler = (card) => {
    if (window.confirm('Delete this item?'))
    {
      processCardDelete(card);
    }
  }

  //create a function that allows us to delete a selected deck
  async function processDeckDelete(deck) {
    const abortController = new AbortController();
    await deleteDeck(deck.id, abortController.signal);
  }

  const history = useHistory();

  //create a function that allows us to delete a deck and asks a string before
  const deleteDeckHandler = (deck) => {
    if (window.confirm('Are you sure you wish to delete this item?'))
    {
      processDeckDelete(deck);
      history.push("/");
    }
  }

  return (
    <>
      <div className="main-container">
        <Route path="/decks">
          <nav className="breadcrumb-nav">
            <ul className="breadcrumb-list">
              <Link to="/">
                <li className="breadcrumbx-item">
                  Home
                  <span> / </span>
                </li>
              </Link>
              <li className="breadcrumb-item">&nbsp;{deck.name}</li>
            </ul>
          </nav>
        </Route>

        <div>
          <div className="card-name">
            <h1>{deck.name}</h1>
          </div>

          <div className="card-question">
            <p>{deck.description}</p>
          </div>
          <div className="deck-buttons-container">
            <div className="btn-group-left">
              <button className="button-sm btn-edit" onClick={() => history.push(`/decks/${deck.id}/edit`)}>Edit</button>
              <button className="button-sm btn-study" onClick={() => history.push(`/decks/${deck.id}/study`)}>Study</button>
              <button className="button-sm btn-add" onClick={() => history.push(`/decks/${deck.id}/cards/new`)}>Add Cards</button>

            </div>
            <div className="btn-group-right">

              <button className="button-sm btn-delete" onClick={event => deleteDeckHandler(deck)}>Delete</button>
            </div>
          </div>
        </div>

        <h1>Cards</h1>
        {(deck.cards) ? deck.cards.map((card, index) => (
          <CardItem card={card} deleteCardHandler={deleteCardHandler} deck={deck} key={index} />
        )) : null}
      </div >

    </>
  );
}

export default DeckView;