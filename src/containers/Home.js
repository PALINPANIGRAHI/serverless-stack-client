import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API, Auth } from "aws-amplify"; // Import the Amplify API module
import { BsPencilSquare } from "react-icons/bs"; // Import BsPencilSquare icon
import { LinkContainer } from "react-router-bootstrap"; // Import LinkContainer


export default function Home() {
    const [notes, setNotes] = useState([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [queries, setQueries] = useState([]);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) return;
            try {
                const notes = await loadNotes();
                setNotes(notes);

                await loadQueries();
            } catch (e) {
                onError(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, [isAuthenticated]); 

    function loadNotes() {
        return API.get("notes", "/notes");
    }
     async function loadQueries() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const email = user.attributes.email;

      const result = await API.get("notes", `/user-queries/${email}`);
      setQueries(result);
    } catch (e) {
      console.error("Error loading queries:", e);
    }
  }

    function renderNotesList(notes) {
        return (
            <>
                <LinkContainer to="/notes/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ml-2 font-weight-bold">Create a new note</span>
                    </ListGroup.Item>
                </LinkContainer>
                {notes.map(({ noteid, content, createdAt }) => (
                    <LinkContainer key={noteid} to={`/notes/${noteid}`}>
                        <ListGroup.Item action>
                            <span className="font-weight-bold">
                                {content.trim().split("\n")[0]}
                            </span>
                            <br />
                            <span className="text-muted">
                                Created: {new Date(createdAt).toLocaleString()}
                            </span>
                        </ListGroup.Item>
                    </LinkContainer>
                ))}
            </>
        );
    }
    function renderQueriesList() {
    return (
      <div className="queries-section mt-4">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Submitted Queries</h2>
        {queries.length === 0 ? (
          <p className="text-muted">No queries found yet.</p>
        ) : (
          <ListGroup>
            {queries.map((q, index) => (
              <ListGroup.Item key={index}>
                <strong>{q.username}</strong> ({q.email})<br />
                <span>{q.query}</span>
                <br />
                <small className="text-muted">
                  Submitted: {new Date(q.createdAt).toLocaleString()}
                </small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    );
  }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p className="text-muted">A simple note-taking app</p>
            </div>
        );
    }

    function renderNotes() {
        return (
            <div className="notes">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
                <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderNotes() : renderLander()}
        </div>
    );
}
