"use client";

import { useEffect, useRef } from 'react';

type Props = {
  onTranscript: (text: string) => void;
  listening: boolean;
  setListening: (v: boolean) => void;
};

export function VoiceButton({ onTranscript, listening, setListening }: Props) {
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = navigator.language || 'en-US';
    rec.onresult = (event: any) => {
      const t = Array.from(event.results).map((r: any) => r[0].transcript).join(' ');
      onTranscript(t);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    return () => { try { rec.abort(); } catch {} };
  }, [onTranscript, setListening]);

  const toggle = () => {
    const rec = recognitionRef.current;
    if (!rec) return alert('Speech recognition not supported on this device.');
    if (listening) {
      try { rec.stop(); } catch {}
      setListening(false);
    } else {
      try { rec.start(); setListening(true); } catch {}
    }
  };

  return (
    <button type="button" onClick={toggle} className={`rounded-md px-4 py-2 font-medium ${listening ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-100 hover:bg-slate-600'}`}>
      {listening ? 'Listening?' : 'Talk'}
    </button>
  );
}
