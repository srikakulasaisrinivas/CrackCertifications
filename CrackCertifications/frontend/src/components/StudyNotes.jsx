import { useState } from 'react';
import '../styles/StudyNotes.css';

const studyTopics = [
  {
    title: 'GitHub Copilot Fundamentals',
    icon: '🤖',
    points: [
      'GitHub Copilot is an AI pair programmer powered by OpenAI Codex model',
      'It works as an extension in VS Code, JetBrains, Neovim, and Visual Studio',
      'Copilot suggests code inline as you type (ghost text completions)',
      'It uses context from open files, comments, and function names to generate suggestions',
      'Copilot Chat allows natural language conversations for code help',
      'Copilot is NOT deterministic — same prompt can give different results',
    ],
  },
  {
    title: 'Copilot Plans & Licensing',
    icon: '💳',
    points: [
      'Copilot Individual — for personal accounts, billed monthly/yearly',
      'Copilot Business — for organizations, managed by org admins',
      'Copilot Enterprise — adds knowledge bases, Bing search, and fine-tuning on private repos',
      'Organization owners manage seat assignments via Settings → Copilot',
      'Admins can enable/disable Copilot for specific teams or the entire org',
      'Policy settings control: suggestions matching public code, chat in IDE, CLI, etc.',
    ],
  },
  {
    title: 'Copilot Features & Capabilities',
    icon: '⚡',
    points: [
      'Code completions — inline ghost text suggestions as you type',
      'Copilot Chat — ask questions, explain code, fix bugs, generate tests',
      'Slash commands: /explain, /fix, /tests, /doc, /generate, /simplify',
      'Chat participants: @workspace (project context), @terminal, @vscode',
      '#file and #selection to reference specific context in Chat',
      'Copilot CLI — suggests terminal commands using natural language',
      'Copilot for Pull Requests — generates PR summaries and descriptions',
      'Copilot Knowledge Bases — index private repos for Enterprise users',
    ],
  },
  {
    title: 'Prompt Engineering for Copilot',
    icon: '🎯',
    points: [
      'Provide clear, descriptive comments before code to guide suggestions',
      'Use meaningful function names and variable names for better context',
      'Open relevant files — Copilot uses neighboring tabs as context',
      'Break complex tasks into smaller functions for better completions',
      'Be specific in prompts: include input/output types, edge cases',
      'Use examples in comments to guide the pattern of suggestions',
      'The more context you provide, the better the suggestions will be',
    ],
  },
  {
    title: 'Responsible AI & Ethics',
    icon: '🛡️',
    points: [
      'Microsoft\'s 6 AI principles: Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency, Accountability',
      'Copilot has a filter to block suggestions matching public code (optional)',
      'Code suggestions should always be reviewed — Copilot can produce incorrect or insecure code',
      'Copilot does NOT store your private code for training (Business/Enterprise)',
      'Telemetry data (accepted/rejected suggestions) is collected for improvement',
      'Users are responsible for the code they accept and commit',
    ],
  },
  {
    title: 'Copilot Administration & Settings',
    icon: '⚙️',
    points: [
      'Org admins manage Copilot via github.com → Org Settings → Copilot',
      'Seat management: assign/remove seats for individual members or teams',
      'Content exclusion: admins can exclude specific files/repos from Copilot suggestions',
      'Policy controls: allow/block suggestions matching public code',
      'Audit logs track Copilot usage across the organization',
      'API endpoints available for managing Copilot subscriptions programmatically',
      'POST /orgs/{org}/copilot/billing/selected_teams — assign teams',
    ],
  },
  {
    title: 'Copilot in IDE — Tips & Shortcuts',
    icon: '⌨️',
    points: [
      'Tab — accept the full suggestion',
      'Esc — dismiss the current suggestion',
      'Alt+] / Alt+[ — cycle through alternative suggestions',
      'Ctrl+Enter — open Copilot completions panel (see 10 suggestions)',
      'Ctrl+I — open inline Chat in VS Code',
      'Copilot status icon in status bar shows if it\'s active or disabled',
      'You can disable Copilot for specific languages in settings',
    ],
  },
  {
    title: 'Copilot Extensions & Integrations',
    icon: '🔌',
    points: [
      'Copilot Extensions allow third-party tools to integrate with Copilot Chat',
      'Extensions are invoked using @mention in Chat (e.g., @docker, @azure)',
      'Extensions can be built using GitHub Copilot Extension API',
      'Copilot integrates with GitHub Actions for CI/CD suggestions',
      'GitHub Mobile also supports Copilot Chat',
      'Copilot for Docs helps navigate documentation with AI',
    ],
  },
  {
    title: 'Security & Privacy',
    icon: '🔒',
    points: [
      'Copilot Business/Enterprise: your code is NOT retained or used for training',
      'Individual plan: snippets may be used to improve the model (opt-out available)',
      'Suggestions are generated in real-time and not stored on GitHub servers',
      'Content exclusion lets admins block sensitive files from being sent to Copilot',
      'Copilot uses TLS encryption for all data in transit',
      'SOC 2 compliant for enterprise deployments',
    ],
  },
  {
    title: 'Exam Tips & Key Reminders',
    icon: '📝',
    points: [
      'Know the difference between Individual, Business, and Enterprise plans',
      'Understand which settings are admin-only vs user-configurable',
      'Remember the slash commands and chat participants',
      'Focus on responsible AI principles — commonly tested',
      'Know how content exclusion and public code filter work',
      'Understand the API endpoints for managing Copilot seats',
      'Practice questions about prompt engineering best practices',
      'GH-300 exam: 60 questions, 100 minutes, 70% passing score',
    ],
  },
];

export default function StudyNotes() {
  const [search, setSearch] = useState('');
  const [expandedIdx, setExpandedIdx] = useState(null);

  const filtered = studyTopics.filter(topic =>
    topic.title.toLowerCase().includes(search.toLowerCase()) ||
    topic.points.some(p => p.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="study-notes">
      <h2>📖 Study Notes</h2>
      <p className="study-subtitle">Key concepts and important points for quick revision before the exam</p>

      <input
        className="study-search"
        type="text"
        placeholder="🔍 Search topics or key points…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="study-list">
        {filtered.map((topic, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <div key={idx} className="study-item" onClick={() => setExpandedIdx(isExpanded ? null : idx)}>
              <div className="study-item-header">
                <span className="study-num">{topic.icon}</span>
                <span className="study-question">{topic.title}</span>
                <span className="study-toggle">{isExpanded ? '▲' : '▼'}</span>
              </div>

              {isExpanded && (
                <div className="study-item-body">
                  <ul className="study-bullets">
                    {topic.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
