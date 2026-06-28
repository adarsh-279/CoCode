import React, { useEffect, useMemo, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";

const Home = () => {
  const initialUsername =
    new URLSearchParams(window.location.search).get("username") || "";

  const [username, setUsername] = useState(initialUsername);
  const [inputValue, setInputValue] = useState(initialUsername);
  const [users, setUsers] = useState([]);
  const [editor, setEditor] = useState(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("Monaco"), [ydoc]);

  const handleMount = (editorInstance) => {
    setEditor(editorInstance);
  };

  const handleJoin = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    setUsername(inputValue);
    window.history.pushState({}, "", `?username=${inputValue}`);
  };

  useEffect(() => {
    if (!username || !editor) return;

    const provider = new SocketIOProvider(
      "/",
      "monaco",
      ydoc,
      {
        autoConnect: true,
      },
    );

    provider.awareness.setLocalStateField("user", {
      username,
    });

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      provider.awareness,
    );

    const updateUsers = () => {
      const states = Array.from(provider.awareness.getStates().values());

      setUsers(
        states
          .filter((state) => state.user?.username)
          .map((state) => state.user),
      );
    };

    updateUsers();

    provider.awareness.on("change", updateUsers);

    const handleBeforeUnload = () => {
      provider.awareness.setLocalStateField("user", null);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      binding.destroy();
      provider.awareness.off("change", updateUsers);
      provider.disconnect();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [username, editor, ydoc, yText]);

  if (!username) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <form onSubmit={handleJoin} className="flex flex-col gap-4 w-80">
          <input
            type="text"
            placeholder="Enter your name"
            className="p-3 rounded-lg bg-gray-800 text-white outline-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <button
            type="submit"
            className="p-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300"
          >
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen flex gap-4 p-4 bg-gray-950">
      <div className="w-1/5 rounded-lg bg-[#ffeedd] overflow-auto">
        <h1 className="text-2xl font-bold p-4 border-b">Users Online</h1>

        <ul className="p-4 space-y-2">
          {users.map((user, index) => (
            <li key={index} className="bg-gray-800 text-white rounded-lg p-2">
              👤 {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-4/5 rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// Start coding..."
          theme="vs-dark"
          onMount={handleMount}
        />
      </div>
    </div>
  );
};

export default Home;