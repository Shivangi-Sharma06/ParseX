import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Brain, FileUp, Mail, PlayCircle, Sparkles, Target } from 'lucide-react';
import { PageMotion } from '../components/ui/PageMotion';

const steps = [
  { n: '01', icon: FileUp, title: 'Upload', desc: 'Drag & drop resumes in PDF or DOCX format.' },
  {
    n: '02',
    icon: Brain,
    title: 'Extract',
    desc: 'AI parses name, skills, education, and experience automatically.',
  },
  { n: '03', icon: Target, title: 'Match', desc: 'Candidates are ranked by skill-match score against your job requirements.' },
];

const features = [
  {
    icon: Brain,
    badge: 'AI Parsing',
    title: 'AI Resume Parsing',
    desc: 'Extracts 15+ data points from any resume format instantly.',
  },
  {
    icon: Target,
    badge: 'Matching',
    title: 'Skill Matching Engine',
    desc: 'Calculates weighted match scores using NLP similarity.',
  },
  {
    icon: Sparkles,
    badge: 'Dashboard',
    title: 'Candidate Dashboard',
    desc: 'Visual profiles with skill tags, experience timeline, and score ring.',
  },
  {
    icon: Mail,
    badge: 'Automation',
    title: 'Automated Emails',
    desc: 'Auto-notifies shortlisted candidates with a personalized email.',
  },
];

const testimonials = [
  { name: 'Anita M', role: 'HR Lead, Nexa', quote: 'ResumeIQ cut our initial screening time by more than half.' },
  { name: 'David R', role: 'Talent Ops, Quantix', quote: 'Matching quality has improved and shortlists are much cleaner.' },
  { name: 'Priya K', role: 'Recruiter, LoopLabs', quote: 'Our team now focuses on interviews, not manual filtering.' },
];

const MotionDiv = motion.div;

export default function Landing() {
  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageMotion>
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="section-wrap relative flex min-h-[90vh] flex-col items-center justify-center text-center">
          <Badge tone="accent" className="mb-4">AI-Powered Recruitment Platform</Badge>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">Find the Right Talent, Instantly.</h1>
          <p className="mt-5 max-w-3xl text-lg text-muted sm:text-xl">
            Upload resumes, let AI extract skills and rank candidates against your job requirements all in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register"><Button variant="gradient" size="lg">Start Free Trial</Button></Link>
            <Button variant="ghost" size="lg" onClick={scrollToHowItWorks}><PlayCircle className="h-5 w-5" />Watch Demo</Button>
          </div>
          <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="text-center"><CardContent><p className="text-2xl font-bold">500+</p><p className="text-sm text-muted">Companies</p></CardContent></Card>
            <Card className="text-center"><CardContent><p className="text-2xl font-bold">1M+</p><p className="text-sm text-muted">Resumes Parsed</p></CardContent></Card>
            <Card className="text-center"><CardContent><p className="text-2xl font-bold">98%</p><p className="text-sm text-muted">Match Accuracy</p></CardContent></Card>
          </div>
          <div className="mt-12 text-sm text-muted">Scroll to explore</div>
        </div>
      </section>

      <section id="how-it-works" className="section-wrap py-20">
        <h2 className="text-center text-3xl font-bold">Simple. Fast. Intelligent.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.n} className="relative">
              <CardHeader>
                <p className="text-3xl font-bold text-white/20">{step.n}</p>
                <step.icon className="h-7 w-7 text-accentStart" />
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-wrap py-8">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <Card key={feature.title} className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className={index % 2 ? 'md:order-2' : ''}>
                <Badge tone="accent">{feature.badge}</Badge>
                <h3 className="mt-3 text-2xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-muted">{feature.desc}</p>
                <button className="mt-3 text-sm text-accentStart">Learn more →</button>
              </div>
              <div className="h-44 rounded-xl border border-line bg-base/70" />
            </Card>
          ))}
        </div>
      </section>

      <section className="section-wrap py-20">
        <Card className="border border-accentStart/40 bg-gradient-to-r from-accentStart/10 to-accentEnd/10">
          <CardContent className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {['500+ Companies', '1M+ Resumes', '98% Accuracy', '3x Faster Hiring'].map((item) => (
              <MotionDiv key={item} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-3xl font-bold">{item.split(' ')[0]}</p>
                <p className="text-sm text-muted">{item.split(' ').slice(1).join(' ')}</p>
              </MotionDiv>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="section-wrap py-10">
        <h2 className="text-center text-3xl font-bold">Trusted by Recruiters</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name}>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">★★★★★</p>
                <p className="text-sm text-muted">{item.quote}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-wrap pb-16 pt-10">
        <Card className="bg-gradient-to-r from-accentStart/20 to-accentEnd/20 text-center">
          <CardContent>
            <h2 className="text-3xl font-bold">Ready to hire smarter?</h2>
            <Link to="/register" className="mt-4 inline-block"><Button variant="gradient">Sign Up Free</Button></Link>
          </CardContent>
        </Card>
      </section>
    </PageMotion>
  );
}
