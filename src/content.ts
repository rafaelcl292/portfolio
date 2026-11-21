export const profile = {
  name: "Rafael Coca Leventhal",
  email: "rafael.cleventhal@gmail.com",
  github: "https://github.com/rafaelcl292",
  linkedin: "https://www.linkedin.com/in/rafael-leventhal",
  chess: "https://www.chess.com/member/rltakes",
  url: "https://rafaelcl.com",
  location: "São Paulo, Brazil",
};

export const chessh = {
  name: "CheSSH",
  category: "Multiplayer chess over SSH",
  stack: ["Rust", "Tokio", "Ratatui"],
  description:
    "A multiplayer chess server you play from your terminal. Matchmaking, persistent game history, and games against Zander, all over SSH.",
  command: "ssh -p 2222 chess.rafaelcl.com",
  host: "chess.rafaelcl.com",
  facts: [
    ["Play", "Multiplayer games with matchmaking"],
    ["History", "Persistent game history"],
    ["Engine", "UCI engine integration, with games against Zander"],
    ["Interface", "Interactive terminal interface"],
    ["Hosting", "Runs on Oracle Cloud"],
  ],
  url: `${profile.github}/chessh`,
};

export const zander = {
  name: "Zander",
  category: "A native Zig port of Stockfish",
  stack: ["Zig", "NNUE", "UCI"],
  description:
    "A chess engine with neural network evaluation and parallel search. Differential tests compare the Zig implementation with a pinned Stockfish reference.",
  facts: [
    ["Evaluation", "Neural network (NNUE)"],
    ["Search", "Parallel"],
    ["Protocol", "UCI"],
    ["Status", "In development"],
  ],
  url: `${profile.github}/zander`,
};

export const localCinema = {
  name: "Local Cinema",
  category: "Shared movie screenings",
  stack: ["Rust", "Axum", "React", "TypeScript"],
  description:
    "A self-hosted cinema with synchronized playback, HLS video preparation, subtitles, and per-user access. Built with a Rust backend and a React frontend.",
  note: "Private source",
};

export const earlierProjects = [
  {
    name: "Flux",
    description: "Language and compiler project in Go.",
    stack: "Go",
    repo: "flux-lang",
  },
  {
    name: "Currency scraper",
    description:
      "Scheduled currency data collection into SQLite using Python’s standard library.",
    stack: "Python, SQLite",
    repo: "scraper-coding-challenge",
  },
  {
    name: "FireDefender",
    description:
      "Firefox extension for inspecting cookies, local storage, and third-party requests.",
    stack: "JavaScript",
    repo: "FireDefender",
  },
  {
    name: "run.nvim",
    description: "A Neovim plugin that saves and runs commands per project.",
    stack: "Lua",
    repo: "run.nvim",
  },
];

export type Resume = {
  title: string;
  location: string;
  summary: string;
  headings: {
    experience: string;
    projects: string;
    skills: string;
    education: string;
    languages: string;
  };
  jobs: { company: string; title: string; dates: string; bullets: string[] }[];
  projects: { name: string; stack: string; text: string; url?: string }[];
  skills: string[];
  education: string;
  languages: string;
};

export const resumes: Record<"en" | "pt", Resume> = {
  en: {
    title: "Software Developer | Full-stack & Backend",
    location: "São Paulo, Brazil",
    summary:
      "Software developer at BTG Pactual building C#/.NET services and React portals for supply chain finance. Personal projects span Rust web services, real-time multiplayer, and a Zig chess engine. Interested in full-stack and backend roles and AI-assisted development.",
    headings: {
      experience: "Experience",
      projects: "Selected projects",
      skills: "Technical skills",
      education: "Education",
      languages: "Languages",
    },
    jobs: [
      {
        company: "BTG Pactual",
        title: "Analyst",
        dates: "Jan 2026 – Present",
        bullets: [
          "Develop and maintain C#/.NET backend services and React portals for receivables financing operations in the Risco Sacado (supply chain finance) team.",
        ],
      },
      {
        company: "BTG Pactual",
        title: "IT Assistant",
        dates: "Mar 2025 – Dec 2025",
        bullets: [
          "Contributed to backend and frontend development for the Risco Sacado team before moving into an analyst role.",
        ],
      },
      {
        company: "Moveu",
        title: "Software Development Intern",
        dates: "Aug 2024 – Oct 2024",
        bullets: [
          "Worked as the startup’s sole developer, automating JSON specification files for customizable furniture, including component dimensions and drilling patterns.",
        ],
      },
      {
        company: "BTG Pactual",
        title: "Summer Intern",
        dates: "Jan & Jul 2024",
        bullets: [
          "Built a .NET logging library to standardize logs across the Risco Sacado team and integrated it into an Azure CI pipeline.",
        ],
      },
    ],
    projects: [
      {
        name: "Local Cinema",
        stack: "Rust, Axum, React, TypeScript",
        text: "Built a self-hosted cinema with synchronized screenings, HLS video preparation, subtitle workflows, and per-user access. Deployed on an Oracle Cloud ARM64 VM with Nginx and systemd.",
      },
      {
        name: "CheSSH",
        stack: "Rust, Tokio, Ratatui",
        text: "Built a multiplayer chess server over SSH with matchmaking, persistent game history, and UCI engine integration. Runs on Oracle Cloud with an interactive terminal interface.",
        url: `${profile.github}/chessh`,
      },
      {
        name: "Zander",
        stack: "Zig, NNUE, UCI",
        text: "Developing a native Zig port of Stockfish with neural network evaluation, parallel search, and differential testing against a pinned C++ reference.",
        url: `${profile.github}/zander`,
      },
    ],
    skills: [
      "C# / .NET, React, TypeScript, Rust, Zig, Python, Go, SQL",
      "Git, Bun, Linux, Nginx, systemd, Oracle Cloud, Azure CI, AI-assisted development",
    ],
    education:
      "Insper — Bachelor’s degree in Computer Engineering | Jan 2021 – Dec 2025",
    languages:
      "Portuguese: native · English: advanced (school exchange in Canada, 2019)",
  },
  pt: {
    title: "Desenvolvedor de Software | Full-stack & Backend",
    location: "São Paulo, Brasil",
    summary:
      "Desenvolvedor no BTG Pactual, com atuação em serviços C#/.NET e portais React para operações de risco sacado. Projetos pessoais incluem serviços web em Rust, multiplayer em tempo real e uma engine de xadrez em Zig. Interesse em full-stack, backend e desenvolvimento com apoio de IA.",
    headings: {
      experience: "Experiência",
      projects: "Projetos selecionados",
      skills: "Competências técnicas",
      education: "Formação",
      languages: "Idiomas",
    },
    jobs: [
      {
        company: "BTG Pactual",
        title: "Analista",
        dates: "Jan 2026 – Atual",
        bullets: [
          "Desenvolvimento e manutenção de serviços backend em C#/.NET e portais React para operações de antecipação de recebíveis na equipe de Risco Sacado.",
        ],
      },
      {
        company: "BTG Pactual",
        title: "Assistente de TI",
        dates: "Mar 2025 – Dez 2025",
        bullets: [
          "Atuação no desenvolvimento de backend e frontend da equipe de Risco Sacado antes da transição para o cargo de analista.",
        ],
      },
      {
        company: "Moveu",
        title: "Estagiário de Desenvolvimento",
        dates: "Ago 2024 – Out 2024",
        bullets: [
          "Único desenvolvedor da startup, responsável pela automação de arquivos JSON com especificações de móveis personalizáveis, incluindo dimensões e padrões de furação das peças.",
        ],
      },
      {
        company: "BTG Pactual",
        title: "Estagiário de Verão",
        dates: "Jan e Jul 2024",
        bullets: [
          "Desenvolvimento de uma biblioteca .NET para padronizar os logs da equipe de Risco Sacado, integrada a uma pipeline de CI no Azure.",
        ],
      },
    ],
    projects: [
      {
        name: "Local Cinema",
        stack: "Rust, Axum, React, TypeScript",
        text: "Cinema auto-hospedado com sessões sincronizadas, preparação de vídeo em HLS, legendas e permissões por usuário. Implantado em uma VM ARM64 na Oracle Cloud com Nginx e systemd.",
      },
      {
        name: "CheSSH",
        stack: "Rust, Tokio, Ratatui",
        text: "Servidor de xadrez multiplayer via SSH com matchmaking, histórico persistente e integração com engine UCI. Hospedado na Oracle Cloud, com interface interativa no terminal.",
        url: `${profile.github}/chessh`,
      },
      {
        name: "Zander",
        stack: "Zig, NNUE, UCI",
        text: "Port nativo do Stockfish em Zig, em desenvolvimento, com avaliação por rede neural, busca paralela e testes diferenciais contra uma referência fixada em C++.",
        url: `${profile.github}/zander`,
      },
    ],
    skills: [
      "C# / .NET, React, TypeScript, Rust, Zig, Python, Go, SQL",
      "Git, Bun, Linux, Nginx, systemd, Oracle Cloud, Azure CI, desenvolvimento com IA",
    ],
    education:
      "Insper — Bacharelado em Engenharia da Computação | Jan 2021 – Dez 2025",
    languages:
      "Português: nativo · Inglês: avançado (intercâmbio escolar no Canadá, 2019)",
  },
};
