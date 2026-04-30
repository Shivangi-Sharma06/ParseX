import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, BriefcaseBusiness, ClipboardList, SearchCheck, ShieldCheck, Trophy, UploadCloud } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { PageMotion } from '../components/ui/PageMotion';

const howItWorks = [
  {
    n: '1',
    icon: UploadCloud,
    title: 'Upload Resumes',
    desc: 'Drop PDF or DOCX resumes into the system. We handle the rest.',
  },
  {
    n: '2',
    icon: ClipboardList,
    title: 'Define Requirements',
    desc: 'Enter the skills and qualifications you need for the role.',
  },
  {
    n: '3',
    icon: Trophy,
    title: 'Get Ranked Results',
    desc: 'Candidates are scored and ranked. Shortlist with one click.',
  },
];

const features = [
  {
    icon: SearchCheck,
    badge: 'Smart Parsing',
    title: 'Smart Parsing',
    desc: 'Extracts skills, education, and experience from any resume format.',
  },
  {
    icon: SearchCheck,
    badge: 'Skill Matching',
    title: 'Skill Matching',
    desc: 'Compares candidate profiles against your exact job requirements.',
  },
  {
    icon: BriefcaseBusiness,
    badge: 'Ranked Shortlists',
    title: 'Ranked Shortlists',
    desc: 'Candidates sorted by match score so you focus on the best.',
  },
  {
    icon: ShieldCheck,
    badge: 'Secure Auth',
    title: 'Secure Auth',
    desc: 'JWT-protected access, your data stays yours.',
  },
];

const metrics = [
  { value: '500+', label: 'Resumes Parsed' },
  { value: '98%', label: 'Extraction Accuracy' },
  { value: '10x', label: 'Faster Screening' },
  { value: 'Built for', label: 'Modern Recruiters' },
];

const MotionDiv = motion.div;

export default function Landing() {
  useEffect(() => {
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return;
    const target = document.getElementById(hash);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageMotion className="relative">
      <div aria-hidden className="landing-orb landing-orb-primary" />
      <div aria-hidden className="landing-orb landing-orb-accent" />
      <div aria-hidden className="landing-orb landing-orb-info" />

      <section id="home" className="relative z-10 overflow-hidden pb-14 pt-8 sm:pt-12">
        <div className="section-wrap">
          <div className="glass-panel relative grid items-center gap-10 overflow-hidden px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 opacity-40 blur-[80px]"
            />
            <div className="relative">
              <div className="hero-heading-glow" />
              <Badge tone="accent" className="mb-5 border-lineStrong bg-surfaceSoft text-ink">
                Resume Parser & Matching Engine
              </Badge>
              <h1 className="hero-title relative z-10 max-w-2xl text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-[4.9rem]">
                <span className="text-ink">FROM RESUME CHAOS</span>
                <br />
                <span className="text-ink">TO RANKED CANDIDATES</span>
                <br />
                <span className="text-ink">IN SECONDS</span>
              </h1>
              <p className="mt-4 text-lg font-medium text-ink">
                Because reading 300 resumes by hand is a 2010 problem.
              </p>
              <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">
                Upload resumes, define your requirements, and let the engine rank your best candidates automatically.
                <br className="hidden sm:block" />
                Recruitment, reimagined.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/register">
                  <Button variant="gradient" size="lg" className="border-0 px-7 glow-primary">
                    Get Started - It&apos;s Free
                  </Button>
                </Link>
                <Button variant="ghost" size="lg" onClick={scrollToHowItWorks} className="border-line px-7">
                  See How It Works
                </Button>
              </div>

              <div className="mt-12 grid gap-3 sm:grid-cols-3">
                {[
                  { title: 'Resume Parsing', sub: 'PDF and DOCX ready' },
                  { title: 'Skill Matching', sub: 'Role-specific ranking' },
                  { title: 'Recruiter Workflow', sub: 'Shortlist in one click' },
                ].map((item) => (
                  <Card key={item.title} className="bg-surfaceSoft/90 p-4">
                    <CardContent className="space-y-1">
                      <p className="text-base font-medium text-ink">{item.title}</p>
                      <p className="text-xs uppercase tracking-wide text-muted">{item.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[380px]">
              <div className="phone-shell">
                <p className="text-sm uppercase tracking-[0.18em] text-muted">Recruiter Snapshot</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">Today&apos;s Hiring Pipeline</p>
                <div className="mt-6 space-y-3 text-sm">
                  {[
                    { icon: ArrowUpRight, name: 'Resumes Uploaded', val: '127' },
                    { icon: SearchCheck, name: 'Profiles Parsed', val: '124' },
                    { icon: Trophy, name: 'Top Match Score', val: '94%' },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between rounded-xl bg-surface px-3 py-3 text-ink/85 shadow-[0_0_0_1px_rgba(255,255,255,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <row.icon className="h-4 w-4 text-muted" />
                        <span>{row.name}</span>
                      </div>
                      <span>{row.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl bg-surface px-4 py-4 shadow-[0_0_0_1px_rgba(255,255,255,0.10)]">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted">Shortcut</p>
                  <p className="mt-1 text-sm text-ink">Run matching and instantly focus on shortlist-ready candidates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-wrap relative z-10 py-16 sm:py-20">
        <div className="glass-panel px-6 py-10 sm:px-12">
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
            How It Works
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {howItWorks.map((step) => (
              <Card key={step.n} className="bg-surface/90">
                <CardHeader>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-lg font-semibold text-ink shadow-clay-sm">
                    {step.n}
                  </div>
                  <step.icon className="h-7 w-7 text-ink" />
                  <CardTitle className="text-ink">{step.title}</CardTitle>
                  <CardDescription className="text-muted">{step.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section-wrap relative z-10 py-6 sm:py-10">
        <h2 className="text-center text-3xl font-medium tracking-tight text-ink sm:text-4xl">Why Teams Choose ParseX</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
          Built for modern recruiters who need fast, reliable shortlists without manual resume sorting.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="grid gap-6 bg-surface/90 p-6 md:grid-cols-[auto_1fr] md:items-center">
              <div className="grid h-12 w-12 place-items-center rounded-xl2 bg-baseElevated shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
                <feature.icon className="h-6 w-6 text-ink" />
              </div>
              <div>
                <Badge tone="accent" className="border-lineStrong bg-surfaceSoft text-ink">
                  {feature.badge}
                </Badge>
                <h3 className="mt-3 text-2xl font-medium tracking-tight text-ink">{feature.title}</h3>
                <p className="mt-2 text-muted">{feature.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="stats" className="section-wrap relative z-10 py-16">
        <Card className="bg-surfaceSoft/75 text-center">
          <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((item) => (
              <MotionDiv key={item.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-3xl font-medium text-ink">{item.value}</p>
                <p className="text-sm text-muted">{item.label}</p>
              </MotionDiv>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="cta" className="section-wrap relative z-10 pb-16 pt-10">
        <Card className="glass-panel text-center">
          <CardContent>
            <h2 className="text-3xl font-medium tracking-tight text-ink">Stop screening. Start shortlisting.</h2>
            <p className="mt-2 text-sm text-muted">
              Create your recruiter account and turn incoming resumes into ranked candidates in minutes.
            </p>
            <Link to="/register" className="mt-4 inline-block">
              <Button variant="gradient" className="border-0 px-7">
                Get Started - It&apos;s Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </PageMotion>
  );
}
