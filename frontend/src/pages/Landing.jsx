import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CircleDollarSign,
  Euro,
  Flame,
  Palette,
  PlayCircle,
  ScanText,
  Sparkles,
  Square,
  Type,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { PageMotion } from '../components/ui/PageMotion';

const pillars = [
  {
    n: '01',
    icon: Palette,
    title: 'Golden-Amber Color Universe',
    desc: 'Warm Ivory (#fffaeb) through Mistral Orange (#fa520f), with no cool blue/purple accents.',
  },
  {
    n: '02',
    icon: Type,
    title: 'Billboard Typography',
    desc: 'Display headlines at 82px, line-height 1.0, and aggressive negative tracking for strong hierarchy.',
  },
  {
    n: '03',
    icon: Sparkles,
    title: 'Golden Shadow Depth',
    desc: 'Multi-layer amber shadows create signature warm elevation and premium card presence.',
  },
];

const features = [
  {
    icon: Flame,
    badge: 'Primary',
    title: 'Mistral Orange #fa520f',
    desc: 'Core brand signal color for key calls to action and high-attention moments.',
  },
  {
    icon: Square,
    badge: 'Gradient System',
    title: 'Block Identity',
    desc: 'Yellow (#ffd900) to Gold (#ffe295) to Amber (#ffa110) to Orange (#ff8105) to Flame (#fb6424).',
  },
  {
    icon: ScanText,
    badge: 'Typography Rule',
    title: 'Weight 400 Only',
    desc: 'Hierarchy is created by size and spacing, not heavy font weights.',
  },
  {
    icon: ArrowUpRight,
    badge: 'Geometry',
    title: 'Sharp Corners',
    desc: 'Near-zero radius and architectural edges keep the system crisp and declarative.',
  },
];

const contentBlocks = [
  {
    title: 'Do',
    body: 'Use warm tones, uppercase CTAs, sharp geometry, amber shadows, and size-driven hierarchy.',
  },
  {
    title: "Don't",
    body: 'Avoid cool palettes, heavy weights, generic gray text, and rounded “soft app” corners.',
  },
  {
    title: 'Responsive Behavior',
    body: 'Desktop headline scale tapers from 82px to 56px to 48px and down to ~32px on mobile.',
  },
];

const paletteSwatches = [
  { icon: CircleDollarSign, label: 'Warm Ivory', value: '#fffaeb' },
  { icon: Euro, label: 'Cream', value: '#fff0c2' },
  { icon: Flame, label: 'Mistral Orange', value: '#fa520f' },
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
    <PageMotion>
      <section id="home" className="relative overflow-hidden pb-14 pt-6 sm:pt-10">
        <div className="hero-aura" />
        <div className="section-wrap relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge tone="accent" className="mb-5 border border-[#ffe2954b] bg-[#fff0c212] text-[#ffd06a]">
              Design System Inspired by Mistral AI
            </Badge>
            <h1 className="hero-title max-w-2xl text-5xl leading-[0.92] sm:text-7xl lg:text-[5.1rem]">
              <span className="text-white">WARM, BOLD,</span>
              <br />
              <span className="text-[#ffd06a]">AND DECLARATIVE</span>
              <br />
              <span className="text-[#ffb83e]">INTERFACE LANGUAGE</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted sm:text-lg">
              A sun-drenched visual system built on amber gradients, billboard typography, and architectural cards.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register">
                <Button variant="gradient" size="lg" className="border-0 px-7 text-[#1f1f1f] hover:shadow-glow">
                  Start Free Trial
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                onClick={scrollToHowItWorks}
                className="border-[#ffe29545] bg-[#fff0c20f] px-7 hover:bg-[#fff0c21a]"
              >
                <PlayCircle className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {['82px Hero Scale', 'Weight 400 System', 'Warm Shadow Cascade'].map((stat) => (
                <Card key={stat} className="border border-[#ffe29531] bg-[#1d1912] p-4 shadow-clay-sm">
                  <CardContent className="space-y-1">
                    <p className="text-2xl font-medium text-white">{stat.split(' ')[0]}</p>
                    <p className="text-xs uppercase tracking-wide text-muted">{stat.split(' ').slice(1).join(' ')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {paletteSwatches.map((chip) => (
                <div key={chip.label} className="market-chip">
                  <chip.icon className="h-4 w-4 text-[#ffd06a]" />
                  <ArrowUpRight className="ml-auto h-4 w-4 text-[#ffb83e]" />
                  <p className="mt-10 text-sm text-white">{chip.label}</p>
                  <p className="text-sm text-[#ffd06a]">{chip.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[370px]">
            <div className="phone-shell">
              <div className="flex items-center justify-between text-white/70">
                <div className="h-6 w-6 rounded-full border border-[#ffe2954f] bg-[#fff0c214]" />
                <div className="h-4 w-4 rounded-full border border-[#ffe2954f]" />
                <div className="h-4 w-4 rounded-[0.2rem] border border-[#ffe2954f]" />
              </div>
              <p className="mt-7 text-5xl font-medium tracking-tight text-white">#fa520f</p>
              <p className="mt-2 text-sm text-[#ffd06a]">Mistral Orange (Primary)</p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {['Cream Surface', 'Dark Solid', 'Ghost', 'Text / Underline'].map((action) => (
                  <button
                    key={action}
                    className="rounded-xl2 border border-[#ffe29530] bg-[#fff0c20a] px-3 py-5 text-sm text-[#fbe8c3] transition hover:bg-[#fff0c217]"
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm">
                <span className="text-white/60">Palette</span>
                <span className="rounded-full bg-[#fff0c2] px-3 py-1 text-[#1f1f1f]">Discover</span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                {[
                  { icon: Palette, name: 'Bright Yellow', val: '#ffd900' },
                  { icon: Square, name: 'Block Gold', val: '#ffe295' },
                  { icon: Flame, name: 'Sunshine 700', val: '#ffa110' },
                  { icon: Sparkles, name: 'Mistral Flame', val: '#fb6424' },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between text-white/85">
                    <div className="flex items-center gap-2">
                      <row.icon className="h-4 w-4 text-[#ffd06a]" />
                      <span>{row.name}</span>
                    </div>
                    <span>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-wrap py-16 sm:py-20">
        <div className="feature-shell px-6 py-10 sm:px-12">
          <h2 className="mx-auto max-w-4xl text-center text-3xl font-medium leading-tight text-[#ffd06a] sm:text-5xl">
            Key Characteristics
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pillars.map((step) => (
              <Card key={step.n} className="border border-[#ffe2952d] bg-[#201a12] shadow-none">
                <CardHeader>
                  <p className="text-3xl font-medium text-[#ffe29556]">{step.n}</p>
                  <step.icon className="h-7 w-7 text-[#ffd06a]" />
                  <CardTitle className="text-white">{step.title}</CardTitle>
                  <CardDescription className="text-muted">{step.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="section-wrap py-6 sm:py-10">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <Card key={feature.title} className="grid gap-6 border border-[#ffe2952d] bg-[#1a1610] p-6 shadow-none md:grid-cols-2 md:items-center">
              <div className={index % 2 ? 'md:order-2' : ''}>
                <Badge tone="accent" className="border border-[#ffe29543] bg-[#fff0c211] text-[#ffd06a]">
                  {feature.badge}
                </Badge>
                <h3 className="mt-3 text-2xl font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-muted">{feature.desc}</p>
                <button className="mt-3 text-sm text-[#ffd06a]">Learn more →</button>
              </div>
              <div className="h-44 border border-[#ffe29534] bg-gradient-to-br from-[#fff0c216] to-[#fa520f14]" />
            </Card>
          ))}
        </div>
      </section>

      <section id="stats" className="section-wrap py-16">
        <Card className="border border-[#ffe2952e] bg-gradient-to-r from-[#fff0c214] to-[#fa520f18]">
          <CardContent className="grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
            {['#fffaeb Warm Ivory', '#fff0c2 Cream', '#ffa110 Sunshine', '#fa520f Orange'].map((item) => (
              <MotionDiv key={item} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <p className="text-3xl font-medium text-white">{item.split(' ')[0]}</p>
                <p className="text-sm text-muted">{item.split(' ').slice(1).join(' ')}</p>
              </MotionDiv>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="testimonials" className="section-wrap py-14">
        <h2 className="text-center text-3xl font-medium text-white">Rules That Keep It Cohesive</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {contentBlocks.map((item) => (
            <Card key={item.title} className="border border-[#ffe2952f] bg-[#19150f] shadow-none">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="cta" className="section-wrap pb-16 pt-10">
        <Card className="border border-[#ffe29537] bg-gradient-to-r from-[#ffd90025] to-[#fa520f25] text-center shadow-none">
          <CardContent>
            <h2 className="text-3xl font-medium text-white">Ready to apply this system across your product?</h2>
            <Link to="/register" className="mt-4 inline-block">
              <Button variant="gradient" className="border-0 px-7 text-[#1f1f1f]">
                Sign Up Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </PageMotion>
  );
}
