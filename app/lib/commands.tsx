import type { ReactNode } from "react";

export type ContentCommand = {
  id: string;
  description: string;
  content: ReactNode;
};

function Bold({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[var(--accent)]">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

const experience = [
  {
    role: "Engineering Research Intern",
    org: "Sunnybrook Research Institute",
    period: "July 2026 — Present",
    bullets: [
      "Developed and calibrated a custom **robotic arm system** to automate **hydrophone data collection** through **skull phantoms** for ultrasound propagation modeling and targeting improvement.",
      "Implemented **ROS** and **inverse kinematics** for repeatable hydrophone positioning across skull regions and angles.",
      "Designed an experimental **control interface** to streamline robotic manipulation, pose selection, and data collection.",
    ],
  },
  {
    role: "Co-Founder & Co-President",
    org: "Science Fair Club",
    period: "Oct 2025 — Present",
    bullets: [
      "Co-founded and scaled a **50+ member** student club, overseeing an executive team across various operations.",
      "Designed and delivered **workshops** on research design, experimentation, and scientific presentation.",
    ],
  },
  {
    role: "Design & Build Lead",
    org: "VEX Robotics Team 3004A",
    period: "Mar 2024 — Present",
    bullets: [
      "Led the iterative design and construction of **competition robots**, coordinating team timelines and strategies.",
      "Mentored new members in mechanical design and **CAD**, ensuring technical consistency and quality across robots.",
      "Adapted match strategies in real time during tournament play, contributing to multiple **championship placements**.",
    ],
  },
];

const projects = [
  {
    name: "NEXUS: A Novel Deafblind Communication Device",
    tagline:
      "Wearable accessibility device that converts conversations into speaker-attributed transcripts for deafblind individuals, using a custom 6-mic array and a dynamic speaker-ID framework. 5x National Awards.",
    tags: ["Python", "C", "Embedded Systems"],
  },
  {
    name: "Fluctus: An Accessible Digital Hearing Aid",
    tagline:
      "Fully digital hearing aid app with real-time adaptive amplification, a 10-band equalizer, noise suppression, and tinnitus support. National Finalist.",
    tags: ["Python", "SciPy", "NumPy"],
  },
  {
    name: "Longitudinal Multi-Omics Modeling for Early Risk Stratification in IBD",
    tagline:
      "Dual-encoder deep learning model predicting inflammatory bowel disease progression across 130 patients and 1,600+ samples, surfacing 3 molecularly distinct patient subgroups.",
    tags: ["Python", "PyTorch", "Scikit-learn"],
  },
  {
    name: "SIGMA: Sign Identification with Guided Machine Assistance",
    tagline:
      "Multilingual AI road sign recognition system using smartphone cameras and a custom-trained YOLOv8 model, achieving 95% real-time detection accuracy.",
    tags: ["Python", "OpenCV", "YOLOv8", "Figma"],
  },
];

const skills = ["Python", "C", "Embedded Systems", "Fusion 360", "OnShape", "Git"];

export const CONTENT_COMMANDS: ContentCommand[] = [
  {
    id: "background",
    description: "A bit about who I am",
    content: (
      <div className="space-y-3">
        <p>
          <Bold
            text={
              "Hi, I'm **Tyler** and I'm currently a grade 12 student from Toronto, " +
              "Ontario! Throughout the past few years, I've grown a fascination " +
              "for **engineering** and I've developed this passion through **robotics**, " +
              "personal projects, and showcasing my research at **science fairs**. " +
              "Because of these experiences, I love building things—especially " +
              "things that can help solve real-world problems. That has led me " +
              "to become a summer engineering research intern at **Sunnybrook " +
              "Research Institute**, where I get to apply my skills and contribute " +
              "to focused **ultrasound research** alongside"
            }
          />
        </p>
        <p>
          <Bold
            text={
              "Outside of my engineering endeavours, you can find me playing " +
              "**table tennis** or experimenting with new recipes in the kitchen. " +
              "I've also been an **artist for 10 years**, a hobby that's shaped the " +
              "way I approach problems with both functionality and design in " +
              "mind!"
            }
          />
        </p>
        <div className="grid grid-cols-2 gap-3">
          <img
            src="/banana-stand.jpg"
            alt="Tyler at the Amazon Spheres in Seattle"
            className="aspect-square w-full rounded-md object-cover"
          />
          <img
            src="/aurora-silhouette.png"
            alt="Silhouette watching the aurora borealis"
            className="aspect-square w-full rounded-md object-cover"
          />
        </div>
        <p>
          {"Whether I'm in a lab, at a competition, or just at home doing my "}
          {"hobbies, I'm always looking for a new challenge. I'm excited to "}
          {"continue exploring where my passions will take me and to keep "}
          {"building things that make a difference!"}
        </p>
      </div>
    ),
  },
  {
    id: "experience",
    description: "Where I've worked and what I've built",
    content: (
      <div className="space-y-5">
        {experience.map((entry, i) => (
          <div key={i}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <span className="font-semibold text-zinc-100">
                {entry.role}
                <span className="font-normal text-white"> | {entry.org}</span>
              </span>
              <span className="text-xs text-zinc-600">{entry.period}</span>
            </div>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-white">
              {entry.bullets.map((b, j) => (
                <li key={j}>
                  <Bold text={b} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "projects",
    description: "Things I've made",
    content: (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.map((p, i) => (
            <div
              key={i}
              className="rounded-md border border-zinc-800 p-3"
            >
              <div className="font-semibold text-zinc-100">{p.name}</div>
              <div className="mt-1 text-xs text-white">{p.tagline}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.tags.map((t, j) => (
                  <span
                    key={j}
                    className="rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "skills",
    description: "Languages, tools, and technologies",
    content: (
      <div className="flex flex-wrap gap-1.5">
        {skills.map((item, i) => (
          <span
            key={i}
            className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-300"
          >
            {item}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "resume",
    description: "Download my resume",
    content: (
      <div className="space-y-3">
        <a
          href="/resume-2.pdf"
          className="inline-block rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
        >
          Download Resume ↓
        </a>
      </div>
    ),
  },
  {
    id: "contact",
    description: "How to reach me",
    content: (
      <div className="space-y-1.5">
        <div>
          <span className="text-white">Email </span>
          <a
            href="mailto:tylerzeng16@gmail.com"
            className="text-zinc-100 underline decoration-zinc-700 underline-offset-2 hover:decoration-zinc-400"
          >
            tylerzeng16@gmail.com
          </a>
        </div>
        <div>
          <span className="text-white">GitHub </span>
          <a
            href="https://github.com/tylerzeng02"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-100 underline decoration-zinc-700 underline-offset-2 hover:decoration-zinc-400"
          >
            github.com/tylerzeng02
          </a>
        </div>
        <div>
          <span className="text-white">LinkedIn </span>
          <a
            href="https://linkedin.com/in/tylerzeng02"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-100 underline decoration-zinc-700 underline-offset-2 hover:decoration-zinc-400"
          >
            linkedin.com/in/tylerzeng02
          </a>
        </div>
      </div>
    ),
  },
];
