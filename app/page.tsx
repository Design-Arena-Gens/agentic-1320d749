"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { VoiceButton } from '@/components/VoiceButton';
import { ChatMessages } from '@/components/ChatMessages';
import { sendChat } from '@/lib/clientApi';
import { loadMemory, saveMemory } from '@/lib/memory';

export default function HomePage() {
  const [messages, setMessages] = useState<Array<{role: 'user'|'assistant', content: string}>>(() => {
    if (typeof window === 'undefined') return [];
    return loadMemory('messages', []);
  });
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [input, setInput] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => { saveMemory('messages', messages); }, [messages]);

  const handleSend = async (text: string) => {
    const userText = text.trim();
    if (!userText) return;
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const { response, spoken } = await sendChat([...messages, { role: 'user', content: userText }], controller);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      if (spoken) speak(spoken);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      abortRef.current = null;
    }
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <main className="mx-auto max-w-xl px-4 pb-24">
      <header className="sticky top-0 z-10 -mx-4 mb-4 border-b border-slate-800 bg-slate-900/80 px-4 py-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Friday</h1>
            <p className="text-sm text-slate-400">Your voice-first AI agent</p>
          </div>
          <link rel="manifest" href="/manifest.json" />
        </div>
      </header>

      <ChatMessages messages={messages} />

      <form className="fixed inset-x-0 bottom-0 mx-auto max-w-xl bg-slate-900/95 p-4 backdrop-blur" onSubmit={(e)=>{e.preventDefault(); handleSend(input); setInput('');}}>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
            placeholder="Type or press and talk..."
            value={input}
            onChange={(e)=>setInput(e.target.value)}
          />
          <button type="submit" className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-slate-900 hover:bg-emerald-400">Send</button>
          <VoiceButton onTranscript={(t)=>handleSend(t)} listening={listening} setListening={setListening} />
        </div>
      </form>
    </main>
  );
}
