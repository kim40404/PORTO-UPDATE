'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

const SYSTEM_PROMPT = `You are an AI assistant on Kimsang Silalahi's portfolio website.
Answer ANYTHING naturally — math, jokes, motivation, coding, life advice, general knowledge.
Also know everything about Kim:
- Full name: Kimsang Silalahi
- Role: AI-Oriented Software Engineer, Full Stack, Web3, Game Developer
- From: Medan, North Sumatra, Indonesia  
- GPA: 3.78/4.00 — Universitas Sumatera Utara, Computer Science (2021-2025)
- Skills: Python, PHP 8.2, PostgreSQL, ReactJS, PyTorch, K-Means, DBSCAN,
  cGANs, Lua, Web3/ICP, Firebase, ESP32, Git, CodeIgniter4, Next.js
- Projects: Mobile Legends Player Analytics (thesis+ML), Decodream (Web3+AI hackathon team lead),
  IoT Honey Quality Monitor (88.25% accuracy), CareerVerse (blockchain), Corkcicle Scrollytelling,
  Secure Task Management Platform
- Experience: Game Developer Exstore.id (Roblox), Freelance Full Stack & AI Engineer,
  Software Engineer Intern Ministry of Law and Human Rights Indonesia
- Exchange: INTI University Malaysia (MBKM 2023-2024)
- Hobbies: Chess (chess.com/member/kim_766), guitar, indie/lo-fi music, gaming
- Available for work: YES immediately
- Email: kimsilalahi@gmail.com
- LinkedIn: https://www.linkedin.com/in/kimsang-silalahi-3a8b13308/
- GitHub: https://github.com/KimiSilalahi766
RULES: Reply same language as user. Answer anything helpfully. Friendly witty tone.`

const STARTERS = [
  "Is Kim available for hire?",
  "Ceritain project Kim 🔥",
  "Kasih motivasi 💪",
  "Tell me a joke 😄",
  "1+1 berapa? 😄",
  "Kim suka musik apa?",
]

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hey! I'm Kim's AI 👋 Tanya apa saja — soal Kim, coding, atau ngobrol santai!"
  }])
  const historyRef = useRef<{ role: string, content: string }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  const lastSentRef = useRef<number>(0)

  const send = useCallback(async (text: string) => {
    const msg = text.trim()
    if (!msg || loading) return

    // 1.5s debounce
    const now = Date.now()
    if (now - lastSentRef.current < 1500) return
    lastSentRef.current = now

    const userMsg = { role: 'user' as const, content: msg }
    setMessages(prev => [...prev, userMsg])
    historyRef.current = [...historyRef.current, userMsg]
    setInput('')
    setLoading(true)

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

    // Verify key exists
    if (!apiKey) {
      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: '⚠️ API key missing. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local'
      }])
      setLoading(false)
      return
    }

    const contents = historyRef.current.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    // gemini-2.0-flash
    const MODEL = 'gemini-2.0-flash'

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT }]
            },
            contents,
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.85,
            }
          })
        }
      )

      const data = await res.json()

      // Log full response for debugging
      console.log('[ChatBot] Status:', res.status, 'Response:', JSON.stringify(data).slice(0, 200))

      if (!res.ok) {
        const errMsg = data?.error?.message ?? `HTTP ${res.status}`
        console.error('[ChatBot] Error:', errMsg)

        if (res.status === 429) {
          setMessages(prev => [...prev, {
            role: 'assistant' as const,
            content: '⏳ Terlalu banyak request. Tunggu 1 menit lalu coba lagi!\nAtau hubungi Kim: kimsilalahi@gmail.com'
          }])
        } else if (res.status === 400) {
          setMessages(prev => [...prev, {
            role: 'assistant' as const,
            content: `❌ API Error 400: ${errMsg}`
          }])
        } else if (res.status === 403) {
          setMessages(prev => [...prev, {
            role: 'assistant' as const,
            content: '🔑 API key tidak valid atau API belum diaktifkan di Google Cloud Console.'
          }])
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant' as const,
            content: `Error ${res.status}: ${errMsg}`
          }])
        }
        setLoading(false)
        return
      }

      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?? 'Hmm, coba tanya lagi ya!'

      const assistantMsg = { role: 'assistant' as const, content: reply }
      setMessages(prev => [...prev, assistantMsg])
      historyRef.current = [...historyRef.current, assistantMsg]

    } catch (err) {
      console.error('[ChatBot] Network error:', err)
      setMessages(prev => [...prev, {
        role: 'assistant' as const,
        content: '🌐 Koneksi gagal. Pastikan internet aktif dan coba lagi.'
      }])
    }

    setLoading(false)
  }, [loading])

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {/* FAB */}
      <div onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 18px',
        background: 'rgba(10,7,2,0.92)',
        border: '1px solid rgba(232,160,32,0.45)',
        borderRadius: 50, cursor: 'pointer',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        userSelect: 'none',
      }}>
        <div style={{ position: 'relative', width: 8, height: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#00d4ff', position: 'absolute'
          }} />
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'rgba(0,212,255,0.4)', position: 'absolute',
            animation: 'chatPulse 2s ease-out infinite'
          }} />
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono', fontSize: 12,
          color: '#e8a020', whiteSpace: 'nowrap'
        }}>
          {open ? 'Close ✕' : "🤖 Ask Kim's AI"}
        </span>
      </div>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 76, right: 24,
          width: 'min(390px, calc(100vw - 32px))',
          height: 'min(540px, calc(100vh - 100px))',
          zIndex: 99998,
          display: 'flex', flexDirection: 'column',
          background: 'rgba(10,7,2,0.97)',
          border: '1px solid rgba(232,160,32,0.2)',
          borderRadius: 20, overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          animation: 'slideUp 0.28s cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(232,160,32,0.12)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg,#e8a020,#f5c842)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 16
              }}>🤖</div>
              <div>
                <div style={{
                  fontFamily: 'Syne', fontSize: 13,
                  fontWeight: 600, color: '#f0f0f0'
                }}>Kim's AI Assistant</div>
                <div style={{
                  fontFamily: 'JetBrains Mono', fontSize: 10,
                  color: '#00d4ff', display: 'flex', alignItems: 'center', gap: 4
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#00d4ff', display: 'inline-block'
                  }} />
                  Online · Gemini
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', color: '#555',
              fontSize: 18, cursor: 'pointer', padding: 4,
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px',
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '84%', padding: '9px 13px',
                  borderRadius: m.role === 'user'
                    ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user'
                    ? 'linear-gradient(135deg,rgba(232,160,32,0.2),rgba(245,200,66,0.1))'
                    : 'rgba(255,255,255,0.04)',
                  border: m.role === 'user'
                    ? '1px solid rgba(232,160,32,0.28)'
                    : '1px solid rgba(255,255,255,0.06)',
                  fontFamily: 'Syne', fontSize: 13, lineHeight: 1.6,
                  color: m.role === 'user' ? '#f5e8c0' : '#d0d0d0',
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>{m.content}</div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px 14px 14px 4px',
                  display: 'flex', gap: 5, alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#e8a020',
                      animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starters */}
          {messages.length === 1 && (
            <div style={{
              padding: '0 14px 8px',
              display: 'flex', flexWrap: 'wrap', gap: 6, flexShrink: 0
            }}>
              {STARTERS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding: '4px 10px',
                  background: 'rgba(232,160,32,0.07)',
                  border: '1px solid rgba(232,160,32,0.2)',
                  borderRadius: 20,
                  fontFamily: 'JetBrains Mono', fontSize: 10,
                  color: '#c8a060', cursor: 'pointer',
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '10px 14px',
            borderTop: '1px solid rgba(232,160,32,0.1)',
            display: 'flex', gap: 8,
            alignItems: 'flex-end', flexShrink: 0
          }}>
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Tanya apa saja..."
              rows={1}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(232,160,32,0.2)',
                borderRadius: 10, padding: '9px 12px',
                fontFamily: 'Syne', fontSize: 13, color: '#f0f0f0',
                resize: 'none', outline: 'none', lineHeight: 1.5,
                maxHeight: 90, overflowY: 'auto'
              }} />
            <button onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg,#e8a020,#f5c842)'
                  : 'rgba(232,160,32,0.15)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontSize: 15, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>➤</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPulse {
          0%   { transform:scale(1);   opacity:0.8; }
          100% { transform:scale(2.8); opacity:0; }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(14px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%,60%,100% { transform:translateY(0);    opacity:0.4; }
          30%          { transform:translateY(-5px); opacity:1; }
        }
      `}</style>
    </>
  )
}
