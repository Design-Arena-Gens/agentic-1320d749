"use client";

type Msg = { role: 'user'|'assistant', content: string };

export function ChatMessages({ messages }: { messages: Msg[] }) {
  return (
    <div className="flex flex-col gap-4 pb-28">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role==='user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-relaxed ${m.role==='user' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-100'}`}>
            {m.content}
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <div className="mt-12 text-center text-slate-400">
          Try: "What\'s the weather in Paris?" or "Summarize Hacker News."
        </div>
      )}
    </div>
  );
}
