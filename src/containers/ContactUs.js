import React, { useState } from "react";
import { API } from "aws-amplify";
import "./ContactUs.css";

export default function ContactUs() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await API.post("notes", "/submit-query", {
        body: { username: username.trim(),
        email: email.trim(),
        query: query.trim(), },
      });
      setMessage("✅ Your query has been sent successfully!");
      setUsername("");
      setEmail("");
      setQuery("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to send query. Try again later.");
    }
  }

  return (
    <div className="ContactUs">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Send Query</button>
      </form>
      {message && <p className="status">{message}</p>}
    </div>
  );
}
