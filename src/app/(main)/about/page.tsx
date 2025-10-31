"use client";

import { useEffect, useState } from "react";
import {
  HeartHandshake,
  Users,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  Leaf,
  Globe2,
  Heart,
  HandCoins,
  LineChart,
  BookOpen,
} from "lucide-react";

// 👉 Drop this file into `app/about/page.tsx` (Next.js App Router)
// Uses TailwindCSS only (no external UI libs). Nexa font will apply globally from your CSS.

export default function AboutPage() {
  return (
    <main className="font-sans text-[oklch(0.145_0_0)] dark:text-[oklch(0.985_0_0)]">
      <HeroSection />
      <TrustedRibbon />
      <HowItWorks />
      <ImpactStats />
      <ValuesGrid />
      <JourneyTimeline />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* background gradient blob */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "conic-gradient(from 120deg, oklch(0.73 0.12 200) 0%, oklch(0.78 0.18 140) 40%, oklch(0.86 0.19 90) 80%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Giving that turns{" "}
              <span className="text-[oklch(0.6_0.118_184.704)]">intention</span>{" "}
              into
              <br className="hidden sm:block" />
              <span className="text-[#2B8C73]">impact</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[oklch(0.556_0_0)] dark:text-white/70">
              Illiyyin is a trusted platform that helps believers fund what
              matters—fast, transparently, and with ihsaan. Launch a cause in
              minutes, or join thousands supporting verified campaigns.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/fundraising"
                className="inline-flex items-center justify-center rounded-full bg-[oklch(0.6_0.118_184.704)] px-6 py-3 text-white transition hover:scale-[1.02]"
              >
                Start a fundraiser
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-[oklch(0.556_0_0)] dark:text-white/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Verified campaigns
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Zakat & Sadaqah-friendly
              </div>
            </div>
          </div>
          <div className="relative">
            <IllustrationCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function IllustrationCard() {
  return (
    <div className="relative mx-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-[0_10px_60px_-15px_rgba(0,0,0,0.25)] ring-1 ring-black/5 dark:bg-[oklch(0.205_0_0)]">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-2xl bg-[oklch(0.97_0_0)] p-4 dark:bg-white/5">
          <h3 className="text-lg font-bold">Your Cause</h3>
          <p className="mt-1 text-sm text-[oklch(0.556_0_0)] dark:text-white/70">
            Create a beautiful page and start receiving support worldwide.
          </p>
          <div className="mt-4 h-24 rounded-xl bg-gradient-to-tr from-[oklch(0.78_0.18_140)] to-[oklch(0.6_0.118_184.704)]" />
        </div>
        <div className="flex flex-col justify-between rounded-2xl bg-[oklch(0.985_0_0)] p-4 ring-1 ring-[oklch(0.922_0_0)] dark:bg-white/5 dark:ring-white/10">
          <div className="flex items-center gap-2 text-[oklch(0.205_0_0)] dark:text-white">
            <Users className="h-4 w-4" />
            Community
          </div>
          <div className="flex items-center gap-2 text-[oklch(0.205_0_0)] dark:text-white">
            <HandCoins className="h-4 w-4" />
            Support
          </div>
          <div className="flex items-center gap-2 text-[oklch(0.205_0_0)] dark:text-white">
            <Globe2 className="h-4 w-4" />
            Reach
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustedRibbon() {
  return (
    <section className="border-y border-[oklch(0.922_0_0)]/60 bg-[oklch(0.985_0_0)] py-6 dark:border-white/10 dark:bg-[oklch(0.205_0_0)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 text-sm text-[oklch(0.556_0_0)] dark:text-white/70">
        <span className="inline-flex items-center gap-2 font-medium text-[oklch(0.205_0_0)] dark:text-white">
          <ShieldCheck className="h-4 w-4" /> Trusted by scholars, NGOs & donors
          worldwide
        </span>
        <span className="hidden h-5 w-px bg-[oklch(0.922_0_0)]/70 sm:block" />
        <span>100% transparency • Quick onboarding • Global reach</span>
      </div>
    </section>
  );
}

function HowItWorks() {
  const items = [
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Start your fundraiser",
      points: ["Set a clear goal", "Tell your story", "Add photos/videos"],
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Share with friends",
      points: ["Share on social", "Send messages", "Invite your community"],
    },
    {
      icon: <HeartHandshake className="h-6 w-6" />,
      title: "Manage donations",
      points: ["Accept instantly", "Thank supporters", "Withdraw safely"],
    },
  ];

  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-3xl font-bold sm:text-4xl">How Illiyyin Works</h2>
      <p className="mt-2 max-w-2xl text-[oklch(0.556_0_0)] dark:text-white/70">
        Purpose-built for the Ummah: fast to launch, easy to share, and designed
        for trust.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[oklch(0.922_0_0)] bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[oklch(0.205_0_0)]"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.97_0_0)] dark:bg-white/10">
                {it.icon}
              </div>
              <h3 className="text-lg font-semibold">{it.title}</h3>
            </div>
            <ul className="mt-4 space-y-2 text-[oklch(0.556_0_0)] dark:text-white/70">
              {it.points.map((p, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function ImpactStats() {
  const stats = [
    { label: "Raised for causes", value: 5.8, suffix: "M+" },
    { label: "Donor community", value: 120, suffix: "K+" },
    { label: "Countries reached", value: 55, suffix: "+" },
    { label: "Avg. approval time", value: 24, suffix: "h" },
  ];

  return (
    <section className="bg-[oklch(0.985_0_0)] py-14 dark:bg-[oklch(0.205_0_0)]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const target = value;
    const duration = 1200;
    const start = performance.now();
    const r = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setN(Number((target * p).toFixed(1)));
      if (p < 1) requestAnimationFrame(r);
    };
    requestAnimationFrame(r);
  }, [value]);

  return (
    <div className="rounded-2xl border border-[oklch(0.922_0_0)] bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-[oklch(0.205_0_0)]">
      <div className="text-3xl font-extrabold tracking-tight">
        {n}
        {suffix}
      </div>
      <p className="mt-1 text-sm text-[oklch(0.556_0_0)] dark:text-white/70">
        {label}
      </p>
    </div>
  );
}

function ValuesGrid() {
  const values = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Amanah (Trust)",
      desc: "Verified campaigns and transparent handling.",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Ikhlaas (Sincerity)",
      desc: "Built to make giving an act of worship.",
    },
    {
      icon: <LineChart className="h-5 w-5" />,
      title: "Ihsaan (Excellence)",
      desc: "High standards in product, vetting, and support.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Ukhuwah (Unity)",
      desc: "Connecting hearts across borders through kindness.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid items-end gap-6 md:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Our Values</h2>
          <p className="mt-2 max-w-2xl text-[oklch(0.556_0_0)] dark:text-white/70">
            Rooted in Islamic ethics and modern transparency, these principles
            guide every campaign and every decision.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-[oklch(0.922_0_0)] bg-white p-4 dark:border-white/10 dark:bg-[oklch(0.205_0_0)]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(0.97_0_0)] dark:bg-white/10">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{v.title}</h3>
                  <p className="text-sm text-[oklch(0.556_0_0)] dark:text-white/70">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-[oklch(0.78_0.18_140)] to-[oklch(0.6_0.118_184.704)] p-1">
          <div className="rounded-3xl bg-white p-8 dark:bg-[oklch(0.205_0_0)]">
            <QuoteCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteCard() {
  return (
    <figure>
      <blockquote className="text-lg leading-relaxed">
        “The believers are like one body; if one part is in pain, the whole body
        feels it.”
      </blockquote>
      <figcaption className="mt-4 text-sm text-[oklch(0.556_0_0)] dark:text-white/70">
        — Prophetic Tradition
      </figcaption>
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[oklch(0.985_0_0)] p-3 ring-1 ring-[oklch(0.922_0_0)] dark:bg-white/5 dark:ring-white/10">
        <Leaf className="h-5 w-5" />
        <p className="text-sm">
          Every donation plants a seed of mercy that continues to grow.
        </p>
      </div>
    </figure>
  );
}

function JourneyTimeline() {
  const steps = [
    {
      year: "2023",
      title: "The Spark",
      desc: "A small team set out to modernize sadaqah with sincerity and excellence.",
    },
    {
      year: "2024",
      title: "First 1M Raised",
      desc: "Communities across 20+ countries joined hands to support urgent causes.",
    },
    {
      year: "2025",
      title: "Illiyyin Today",
      desc: "A trusted platform for verified campaigns, impact tracking, and global reach.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-8 max-w-2xl">
        <h2 className="text-3xl font-bold sm:text-4xl">Our Journey</h2>
        <p className="mt-2 text-[oklch(0.556_0_0)] dark:text-white/70">
          From a heartfelt idea to a global community of givers.
        </p>
      </div>
      <ol className="relative grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <li
            key={i}
            className="group rounded-2xl border border-[oklch(0.922_0_0)] bg-white p-6 transition hover:shadow-md dark:border-white/10 dark:bg-[oklch(0.205_0_0)]"
          >
            <div className="flex items-center gap-3 text-sm text-[oklch(0.556_0_0)] dark:text-white/70">
              <BookOpen className="h-4 w-4" /> {s.year}
            </div>
            <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-[oklch(0.556_0_0)] dark:text-white/70">
              {s.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative isolate overflow-hidden rounded-3xl border border-[oklch(0.922_0_0)] bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-[oklch(0.205_0_0)] sm:p-16">
        <div
          className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.6_0.118_184.704), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-20 blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.78_0.18_140), transparent)",
          }}
        />
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Start receiving funds
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[oklch(0.556_0_0)] dark:text-white/70">
          Millions trust Illiyyin to support real people with real needs. Create
          a campaign in minutes.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="/fundraising"
            className="inline-flex items-center justify-center rounded-full bg-[oklch(0.6_0.118_184.704)] px-6 py-3 text-white transition hover:scale-[1.02]"
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
}
