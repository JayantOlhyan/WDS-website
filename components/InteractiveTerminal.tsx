"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/soundEffects";
import { Terminal, CornerDownLeft, Sparkles, RefreshCw } from "lucide-react";

interface TerminalLine {
  id: string;
  type: "input" | "output" | "system" | "error" | "success";
  text: string | React.ReactNode;
}

export function InteractiveTerminal({
  initialCommands = ["whoami", "ls projects/"],
  compact = false,
}: {
  initialCommands?: string[];
  compact?: boolean;
}) {
  const router = useRouter();
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize terminal banner
  useEffect(() => {
    const lines: TerminalLine[] = [
      {
        id: "banner-1",
        type: "system",
        text: "WDS MSIT UNIX-COMPATIBLE SHELL [Version 2.6.0-release]",
      },
      {
        id: "banner-2",
        type: "system",
        text: "Type 'help' to see all available commands. Try 'whoami', 'status', or 'join'.",
      },
    ];

    // Run initial commands
    if (initialCommands.includes("whoami")) {
      lines.push({
        id: "init-whoami-cmd",
        type: "input",
        text: "WDS@MSIT:~$ whoami",
      });
      lines.push({
        id: "init-whoami-out",
        type: "output",
        text: (
          <div className="space-y-0.5 text-wds-white">
            <div>&gt; student</div>
            <div>&gt; builder</div>
            <div>&gt; problem-solver</div>
            <div>&gt; community member</div>
            <div>&gt; future creator</div>
          </div>
        ),
      });
    }

    if (initialCommands.includes("ls projects/")) {
      lines.push({
        id: "init-ls-cmd",
        type: "input",
        text: "WDS@MSIT:~$ ls projects/",
      });
      lines.push({
        id: "init-ls-out",
        type: "output",
        text: (
          <div className="space-y-1 text-wds-white font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-wds-yellow font-bold">📁 bug-hunt/</span>
              <span className="text-wds-muted">- Find bugs. Earn points. Get rewarded.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-wds-yellow font-bold">📁 msit-website/</span>
              <span className="text-wds-muted">- Official MSIT website portal.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-wds-yellow font-bold">📁 newsletter/</span>
              <span className="text-wds-muted">- Stay updated with curated tech insights.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-wds-yellow font-bold">📁 freshers-hub/</span>
              <span className="text-wds-muted">- Resources, survival guide &amp; events.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-wds-yellow font-bold">📁 coming-soon/</span>
              <span className="text-wds-muted">- Something awesome is in development.</span>
            </div>
          </div>
        ),
      });
    }

    setHistory(lines);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    sound.playClick();
    const cmd = trimmed.toLowerCase();

    // Append to cmd history
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [
      ...history,
      {
        id: `cmd-${Date.now()}`,
        type: "input",
        text: `WDS@MSIT:~$ ${trimmed}`,
      },
    ];

    if (cmd === "help") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs py-1">
            <div><span className="text-wds-yellow font-bold">whoami</span> — Show identity &amp; ethos</div>
            <div><span className="text-wds-yellow font-bold">ls projects/</span> — List active WDS platforms</div>
            <div><span className="text-wds-yellow font-bold">status</span> — Real-time society metrics</div>
            <div><span className="text-wds-yellow font-bold">events</span> — Upcoming workshops &amp; dates</div>
            <div><span className="text-wds-yellow font-bold">team</span> — Meet the core leadership &amp; wings</div>
            <div><span className="text-wds-yellow font-bold">join / apply</span> — Open Recruitment 2026 application</div>
            <div><span className="text-wds-yellow font-bold">bughunt</span> — Open Bug Hunt details</div>
            <div><span className="text-wds-yellow font-bold">clear</span> — Clear terminal screen</div>
          </div>
        ),
      });
    } else if (cmd === "whoami") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="space-y-0.5 text-wds-white">
            <div>&gt; student</div>
            <div>&gt; builder</div>
            <div>&gt; problem-solver</div>
            <div>&gt; community member</div>
            <div>&gt; future creator</div>
          </div>
        ),
      });
    } else if (cmd === "ls projects/" || cmd === "ls" || cmd === "projects") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="space-y-1 text-wds-white">
            <div><span className="text-wds-yellow font-bold">📁 bug-hunt/</span> - Find bugs. Earn points. Get rewarded.</div>
            <div><span className="text-wds-yellow font-bold">📁 msit-website/</span> - Official MSIT website portal.</div>
            <div><span className="text-wds-yellow font-bold">📁 newsletter/</span> - Weekly tech &amp; opportunity drop.</div>
            <div><span className="text-wds-yellow font-bold">📁 freshers-hub/</span> - Student resource portal.</div>
            <div><span className="text-wds-yellow font-bold">📁 coming-soon/</span> - Something awesome is cooking.</div>
          </div>
        ),
      });
    } else if (cmd === "status") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="space-y-1 font-mono text-xs text-wds-white">
            <div>SYSTEM      : <span className="text-wds-green font-bold">ONLINE</span></div>
            <div>PROJECTS    : <span className="text-wds-green font-bold">ACTIVE</span></div>
            <div>COMMUNITY   : <span className="text-wds-yellow font-bold">GROWING</span></div>
            <div>IMPACT      : <span className="text-wds-yellow font-bold">REAL</span></div>
            <div>BUGS FOUND  : <span className="text-wds-yellow font-bold">128</span></div>
            <div>COFFEE      : <span className="text-wds-yellow font-bold">LOADING...</span></div>
          </div>
        ),
      });
    } else if (cmd === "join" || cmd === "apply" || cmd === "recruit") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "success",
        text: "Redirecting to WDS Recruitment 2026 Application form...",
      });
      setTimeout(() => router.push("/recruitment/apply"), 800);
    } else if (cmd === "bughunt" || cmd === "hunt") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "success",
        text: (
          <div className="space-y-1">
            <div className="text-wds-green font-bold">✓ Launching WDS Bug Hunt portal...</div>
            <div className="text-wds-muted text-xs">
              URL: <a href="https://wds-bug-hunt.netlify.app/bug-hunt" target="_blank" rel="noopener noreferrer" className="text-wds-yellow underline">https://wds-bug-hunt.netlify.app/bug-hunt</a>
            </div>
          </div>
        ),
      });
      if (typeof window !== "undefined") {
        setTimeout(() => window.open("https://wds-bug-hunt.netlify.app/bug-hunt", "_blank"), 600);
      }
    } else if (cmd === "events") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: (
          <div className="space-y-1 text-xs text-wds-white">
            <div>• <span className="text-wds-yellow font-bold">Orientation 2026</span> : Intro to WDS &amp; Bug Hunt launch</div>
            <div>• <span className="text-wds-yellow font-bold">Web Dev 101</span> : Git, Frontend architecture &amp; Next.js</div>
            <div>• <span className="text-wds-yellow font-bold">Bug Hunt Sprint</span> : 48h campus bug discovery hackathon</div>
          </div>
        ),
      });
    } else if (cmd === "team") {
      newLines.push({
        id: `out-${Date.now()}`,
        type: "output",
        text: "WDS Wings: Technical Wing, Design & UI/UX Wing, Content & Media, Events & Community Operations. Type 'team-view' or visit /team to view roles.",
      });
    } else if (cmd === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    } else if (cmd.startsWith("sudo")) {
      sound.playSuccess();
      newLines.push({
        id: `out-${Date.now()}`,
        type: "success",
        text: "🚀 [SUPERUSER AUTHENTICATED] Welcome, Architect! You now have unrestricted build permissions.",
      });
    } else {
      newLines.push({
        id: `err-${Date.now()}`,
        type: "error",
        text: `bash: command not found: ${trimmed}. Type 'help' for available commands.`,
      });
    }

    setHistory(newLines);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sound.playKey();
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIndex + 1 < cmdHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  const commandShortcuts = [
    "whoami",
    "ls projects/",
    "status",
    "events",
    "team",
    "join",
    "help",
    "clear",
  ];

  return (
    <div className="flex flex-col h-full font-mono text-sm">
      {/* Terminal Output Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`bg-wds-bg p-4 overflow-y-auto space-y-2 border border-wds-yellow/20 cursor-text select-text ${
          compact ? "max-h-[360px]" : "min-h-[440px] max-h-[560px]"
        }`}
      >
        {history.map((line) => (
          <div key={line.id} className="leading-relaxed">
            {line.type === "system" && (
              <p className="text-wds-muted text-xs font-mono">{line.text}</p>
            )}
            {line.type === "input" && (
              <p className="text-wds-yellow font-bold">{line.text}</p>
            )}
            {line.type === "output" && (
              <div className="pl-3 text-wds-white text-xs">{line.text}</div>
            )}
            {line.type === "success" && (
              <p className="text-wds-green font-bold text-xs pl-3">{line.text}</p>
            )}
            {line.type === "error" && (
              <p className="text-wds-red text-xs pl-3">{line.text}</p>
            )}
          </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center gap-2 text-wds-yellow font-bold text-xs pt-1">
          <span>WDS@MSIT:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-wds-white outline-none border-none font-mono text-xs focus:ring-0 p-0"
            autoFocus
            spellCheck={false}
          />
          <span className="terminal-cursor" />
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Clickable Command Shortcuts Bar */}
      <div className="mt-3 pt-3 border-t border-wds-yellow/20 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-pixel text-wds-yellow flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-wds-yellow" />
          TRY COMMANDS:
        </span>
        {commandShortcuts.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleCommand(cmd)}
            className="px-2 py-0.5 border border-wds-border-dim bg-wds-card hover:border-wds-yellow hover:bg-wds-yellow hover:text-wds-bg text-wds-muted text-xs font-mono transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
