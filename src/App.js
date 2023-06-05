import React, { useState, useRef, useCallback } from "react";
import TextField from "@mui/material/TextField";
import useBookSearch from "./useBookSearch";

import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <div
      style={{
        margin: "2rem",
        width: "400px",
      }}
    >
      <TextField
        sx={{ margin: "0 auto" }}
        id="outlined-basic"
        label="Search book"
        variant="outlined"
        autoFocus
        value={query}
        onChange={handleSearch}
      />

      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <h1>{loading && "Loading..."}</h1>
      <div>{error && "Error"}</div>
    </div>
  );
}
