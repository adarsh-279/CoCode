import React, { useMemo, useRef } from 'react'
import { Editor } from "@monaco-editor/react"
import { MonacoBinding } from "y-monaco"
import * as Y from "yjs"
import { SocketIOProvider } from "y-socket.io"

const Home = () => {

  const editorRef = useRef(null)

  const ydoc = useMemo(() => new Y.Doc(), [])
  const yText = useMemo(()=> ydoc.getText("Monaco"), [ydoc])

  const handleMount = (editor) => {
    editorRef.current = editor

    const provider = new SocketIOProvider("http://localhost:8000", "monaco", ydoc, {
      autoConnect: true
    })
    const monacoBinding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    )
  }

  return (
    <div className="h-screen flex items-center justify-between gap-4 p-4 bg-gray-950">
      <div className='w-1/5 h-full rounded-lg bg-[#ffeedd]'></div>
      <div className='w-4/5 h-full rounded-lg bg-neutral-800'>
        <Editor height="100%" defaultLanguage='javascript' defaultValue='// write your code here!' theme='vs-dark' onMount={handleMount}/>
      </div>
    </div>
  );
};

export default Home