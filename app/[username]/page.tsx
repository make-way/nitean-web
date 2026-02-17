const socials = ["Telegram", "LinkedIn", "GitHub", "YouTube", "TikTok", "Facebook", "Instagram"];

const experiences = [
  {
    id: 1,
    letter: "I",
    color: "bg-blue-600",
    title: "Founder, Host, and Content Creator",
    company: "ITPodcast",
    period: "2024 – Present",
    bullets: [
      "I am the Founder and Host of IT Podcast, where I also take on the roles of Content Strategist, Video/Audio Editor, and Social Media Manager.",
      "IT Podcast is dedicated to sharing knowledge and inspiration with young people who are interested in the IT field or dream of becoming IT professionals.",
    ],
  },
  {
    id: 2,
    letter: "W",
    color: "bg-blue-500",
    title: "Senior Software Engineer (Short Term Business Trip)",
    company: "Webcash Inc. (Busan S.Korea)",
    period: "2024 – Present",
    bullets: [
      "Delegated an outsourcing project from the Korea team to the Cambodia team.",
      "Understood assigned responsibilities, technical requirements, and overall workflow.",
      "Created progress reports and delivered weekly presentations.",
    ],
  },
  {
    id: 3,
    letter: "K",
    color: "bg-blue-700",
    title: "Senior Software Engineer",
    company: "KOSIGN",
    period: "2017 – Present",
    bullets: [
      "Led two global projects and one outsourcing project related to web-based accounting systems.",
      "Responsible for analyzing requirements from storyboard to deployment.",
    ],
  },
];

export default function ProfilePage() {
  return (
    <div className="mx-auto space-y-8">
      {/* Bio */}
      <p className="text-[15px] leading-relaxed text-slate-700">
        Im a Senior Software Engineer with 6 years of experience in full-stack development, system design, and team leadership. Ive worked in both local and international environments, including South Korea. Im also a content creator and host of ITpodcasts, sharing tech and career insights on YouTube, TikTok, and Facebook. Lets connect—follow me on social media!
      </p>

      {/* Social links */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Connect with me</p>
        <div className="flex flex-wrap gap-2">
          {socials.map((s) => (
            <a
              key={s}
              href="#"
              className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:shadow-sm transition-all"
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Experience</h2>
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div key={exp.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${exp.color} text-base font-bold text-white`}>
                  {exp.letter}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                  <p className="text-sm text-blue-600">
                    {exp.company} <span className="text-slate-400">· {exp.period}</span>
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}