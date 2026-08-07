import { useState } from 'react'
import PageHeader from '../components/PageHeader'

const conversations = [
  { id: 1, name: 'Samuel Mwanza',  initials: 'SM', preview: 'Thanks for the referral, really appreciated!', time: '2m',  unread: true,  msgs: [
    { id: 1, from: 'them', text: 'Hi! I saw you are also in the healthcare field.', time: '10:02' },
    { id: 2, from: 'me',   text: 'Yes! I specialise in cardiology. You?', time: '10:05' },
    { id: 3, from: 'them', text: 'I am a pharmacist at Lusaka Trust Hospital.', time: '10:07' },
    { id: 4, from: 'me',   text: 'Great, we should connect more formally.', time: '10:10' },
    { id: 5, from: 'them', text: 'Thanks for the referral, really appreciated!', time: '10:15' },
  ]},
  { id: 2, name: 'Grace Tembo',    initials: 'GT', preview: 'When is the next mentorship session?', time: '1h',  unread: true,  msgs: [
    { id: 1, from: 'me',   text: 'Hey Grace, loved your talk at the career fair!', time: '09:00' },
    { id: 2, from: 'them', text: 'Thank you! It was a great event.', time: '09:05' },
    { id: 3, from: 'them', text: 'When is the next mentorship session?', time: '09:30' },
  ]},
  { id: 3, name: 'Peter Chanda',   initials: 'PC', preview: 'The project proposal is ready for review.', time: '3h',  unread: false, msgs: [
    { id: 1, from: 'them', text: 'The project proposal is ready for review.', time: '07:00' },
    { id: 2, from: 'me',   text: 'Perfect, I will look at it today.', time: '07:45' },
  ]},
  { id: 4, name: 'Mulenga Kabwe',  initials: 'MK', preview: 'See you at the gala dinner!', time: 'Fri',  unread: false, msgs: [
    { id: 1, from: 'me',   text: 'Are you attending the gala dinner this year?', time: 'Fri 14:00' },
    { id: 2, from: 'them', text: 'Absolutely! See you at the gala dinner!', time: 'Fri 14:30' },
  ]},
  { id: 5, name: 'Beatrice Phiri', initials: 'BP', preview: 'We need more volunteers for the library.', time: 'Thu',  unread: false, msgs: [
    { id: 1, from: 'them', text: 'We need more volunteers for the library project.', time: 'Thu 10:00' },
    { id: 2, from: 'me',   text: 'I can spare a weekend in August.', time: 'Thu 11:00' },
  ]},
]

export default function Messages() {
  const [activeId, setActiveId]   = useState(1)
  const [input,    setInput]      = useState('')
  const [threads,  setThreads]    = useState(conversations)

  const active = threads.find(c => c.id === activeId)

  function sendMessage() {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setThreads(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, preview: input, msgs: [...c.msgs, { id: Date.now(), from: 'me', text: input, time: now }] }
        : c
    ))
    setInput('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div className="page-layout">
      <PageHeader
        title="Messages"
        subtitle="Communicate directly with fellow BASEGA alumni."
        breadcrumbs={[{ label: 'Messages' }]}
      />

      <div className="container messages-wrap">
        <div className="messages-layout">
          {/* Sidebar */}
          <div className="msgs-sidebar">
            <div className="msgs-sidebar-hdr">
              <h3>Messages</h3>
              <button className="btn btn-primary btn-xs">+ New</button>
            </div>
            <div className="msgs-search">
              <input type="text" placeholder="Search conversations…" />
            </div>
            <div className="convos-list">
              {threads.map(c => (
                <div
                  key={c.id}
                  className={`convo-item ${activeId === c.id ? 'active' : ''}`}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className="convo-ava">{c.initials}</div>
                  <div className="convo-info">
                    <div className="convo-name">{c.name}</div>
                    <div className="convo-prev">{c.preview}</div>
                  </div>
                  <div className="convo-right">
                    <div className="convo-time">{c.time}</div>
                    {c.unread && <div className="convo-dot" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thread */}
          {active && (
            <div className="msg-thread">
              <div className="msg-thread-hdr">
                <div className="convo-ava">{active.initials}</div>
                <div>
                  <h4>{active.name}</h4>
                  <span>BASEGA Alumni · Active now</span>
                </div>
              </div>
              <div className="msg-body">
                {active.msgs.map(msg => (
                  <div key={msg.id} className={`msg-bubble ${msg.from === 'me' ? 'mine' : 'theirs'}`}>
                    <div className="bubble">{msg.text}</div>
                    <div className="bubble-time">{msg.time}</div>
                  </div>
                ))}
              </div>
              <div className="msg-input-bar">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button className="msg-send-btn" onClick={sendMessage}>➤</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
