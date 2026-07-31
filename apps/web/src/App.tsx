import * as React from "react";
import {
  GlassProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dock,
  DockItem,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Switch,
  Slider,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
  Progress,
  Toggle,
} from "@lglite/react";

const GITHUB_URL = "https://github.com"; // TODO: real repo URL once public

// Inline SVG glyphs (same approach as the storybook Dock story: no icon-lib dep).
const Glyph = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ICONS = {
  Finder: "M4 5h16v14H4z M9 9h.01 M15 9h.01 M9 14c1 1 5 1 6 0",
  Mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  Photos: "M4 5h16v14H4z M8 13l3-3 4 4 2-2 3 3",
  Music: "M9 18V5l10-2v13 M9 18a3 3 0 11-6 0 3 3 0 016 0z M19 16a3 3 0 11-6 0 3 3 0 016 0z",
  Settings: "M12 9a3 3 0 100 6 3 3 0 000-6z M19 12l2 1-2 4-2-1 M5 12l-2 1 2 4 2-1",
};

function InstallSnippet() {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const copy = () => {
    navigator.clipboard
      ?.writeText("npm i @lglite/react")
      .then(() => {
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  };
  return (
    <code className="snippet">
      npm i @lglite/react
      <button
        type="button"
        className={`snippet__copy${copied ? " is-copied" : ""}`}
        onClick={copy}
        aria-label="Copy install command"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </code>
  );
}

/** One repeat of the conveyor contents: the brand letters interleaved with
 *  calibration marks (token-color dots, a ring target). Rendered twice for a
 *  seamless loop; purely decorative (the parent track is aria-hidden). */
function BeltSet() {
  return (
    <div className="belt__set">
      <span className="belt__glyph">L</span>
      <span className="belt__dot belt__dot--blue" />
      <span className="belt__glyph">G</span>
      <span className="belt__target" />
      <span className="belt__glyph">L</span>
      <span className="belt__dot belt__dot--green" />
      <span className="belt__glyph">I</span>
      <span className="belt__dot belt__dot--red" />
      <span className="belt__glyph">T</span>
      <span className="belt__target" />
      <span className="belt__glyph">E</span>
      <span className="belt__dot belt__dot--ink" />
    </div>
  );
}

type Tone = "default" | "primary" | "destructive" | "success";
const TONES: Tone[] = ["default", "primary", "success", "destructive"];
const BACKDROPS = ["photo", "grid", "stripes"] as const;

/** Segmented picker from flat `Toggle`s (never a glass ToggleGroup bar: budget). */
function Seg<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <Toggle key={o} size="sm" pressed={value === o} onPressedChange={(on) => on && onChange(o)}>
          {o.charAt(0).toUpperCase() + o.slice(1)}
        </Toggle>
      ))}
    </div>
  );
}

/** The specimen catalog: real components over the same test patterns the engine is
 *  calibrated against (grid hides displacement, stripes/rings expose it). Index codes
 *  are true inventory numbers, not decoration. */
const CATALOG: Array<{ id: string; name: string; bg: string; node: React.ReactNode }> = [
  { id: "LG-01", name: "Button", bg: "rings", node: <Button variant="glass">Continue</Button> },
  {
    id: "LG-02",
    name: "Card",
    bg: "grid",
    node: (
      <Card className="cell__card">
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>Glass surface</CardDescription>
        </CardHeader>
      </Card>
    ),
  },
  {
    id: "LG-03",
    name: "Input",
    bg: "stripes",
    node: <Input lens={false} placeholder="Email address" aria-label="Email address" />,
  },
  { id: "LG-04", name: "Switch", bg: "bars", node: <Switch defaultChecked aria-label="Demo switch" /> },
  { id: "LG-05", name: "Slider", bg: "grid", node: <Slider defaultValue={[40]} aria-label="Demo slider" /> },
  {
    id: "LG-06",
    name: "Tabs",
    bg: "rings",
    node: (
      <Tabs defaultValue="one">
        <TabsList aria-label="Demo tabs">
          <TabsTrigger value="one">Music</TabsTrigger>
          <TabsTrigger value="two">Podcasts</TabsTrigger>
        </TabsList>
        <TabsContent value="one" />
        <TabsContent value="two" />
      </Tabs>
    ),
  },
  {
    id: "LG-07",
    name: "Badge",
    bg: "bars",
    node: (
      <div className="cell__row">
        <Badge>Glass</Badge>
        <Badge variant="solid" tone="success">
          Active
        </Badge>
      </div>
    ),
  },
  {
    id: "LG-08",
    name: "Progress",
    bg: "stripes",
    node: <Progress value={66} aria-label="Demo progress" />,
  },
];

export function App() {
  const [dark, setDark] = React.useState(false);
  const [aa, setAa] = React.useState(false);
  const [frosted, setFrosted] = React.useState(false);
  const [clear, setClear] = React.useState(false);
  const [tone, setTone] = React.useState<Tone>("default");
  const [backdrop, setBackdrop] = React.useState<(typeof BACKDROPS)[number]>("photo");

  return (
    <GlassProvider theme={dark ? "dark" : "light"} contrast={aa ? "aa" : "default"}>
      <header className="hero">
        {/* the test sheet: glass is invisible until it bends something, so we print
            something worth bending: specimen glyphs, a calibration grid, token-color
            bars, rings. Purely decorative for AT. */}
        <div className="field" aria-hidden="true">
          <span className="field__word">GLASS</span>
          <span className="field__bars" />
          <span className="field__rings" />
        </div>

        <Navbar magnify className="hero__nav">
          <NavbarBrand>LGLite</NavbarBrand>
          <NavbarContent justify="end">
            {/* section anchors are redundant on a one-page scroll; hidden on small screens */}
            <NavbarItem asChild className="nav-anchor">
              <a href="#playground">Playground</a>
            </NavbarItem>
            <NavbarItem asChild className="nav-anchor">
              <a href="#catalog">Components</a>
            </NavbarItem>
            <NavbarItem asChild>
              <a href={GITHUB_URL}>GitHub</a>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        <div className="hero__center">
          <Card frosted className="hero__card">
            <CardContent className="hero__cardBody">
              <span className="anno">React component library</span>
              <h1>
                Liquid Glass
                <br />
                for React.
              </h1>
              <p>
                shadcn-style components in Apple's glass material. Real edge refraction
                on desktop Chromium, honest frost everywhere else, WCAG AA one prop away.
              </p>
              <InstallSnippet />
              <div className="hero__cta">
                <Button variant="solid" tone="primary" className="aa-primary" asChild>
                  <a href="#playground">See it live</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={GITHUB_URL}>GitHub</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="anno hero__legend">
            The letterforms behind this card exist to be bent. On desktop Chromium they
            are: watch the edges.
          </p>
        </div>

        <Dock aria-label="Demo dock" className="hero__dock">
          {Object.entries(ICONS).map(([label, d]) => (
            <DockItem key={label} label={label} icon={<Glyph d={d} />} />
          ))}
        </Dock>
      </header>

      <main>
        <section id="playground" className="playground">
          <span className="anno">Playground</span>
          <h2>Feel the material</h2>
          <p className="section-sub">
            Every knob is a real library lever: provider props, component props, and the
            engine's stage classes. Nothing here is demo paint.
          </p>

          <div className="knobs">
            <label className="knob">
              <Switch checked={dark} onCheckedChange={setDark} aria-label="Dark material" />
              Dark
            </label>
            <label className="knob">
              <Switch checked={aa} onCheckedChange={setAa} aria-label="AA contrast" />
              AA contrast
            </label>
            <label className="knob">
              <Switch checked={frosted} onCheckedChange={setFrosted} aria-label="Frosted material" />
              Frosted
            </label>
            <label className="knob">
              <Switch checked={clear} onCheckedChange={setClear} aria-label="Clear glass, no blur" />
              Clear
            </label>
            <Seg options={TONES} value={tone} onChange={setTone} label="Card tone" />
            <Seg options={BACKDROPS} value={backdrop} onChange={setBackdrop} label="Backdrop" />
          </div>

          <div
            className={`stage stage--${backdrop}${frosted ? " lg-frosted" : ""}${clear ? " lg-no-blur" : ""}`}
          >
            <Card tone={tone} frosted={frosted} className="stage__card">
              <CardHeader>
                <CardTitle>Liquid Glass</CardTitle>
                <CardDescription>One surface, every lever</CardDescription>
              </CardHeader>
              <CardContent className="stage__controls">
                <Slider defaultValue={[60]} aria-label="Demo slider" />
                <div className="stage__buttons">
                  <Button variant="solid" tone="primary" className="aa-primary">
                    Save
                  </Button>
                  <Button variant="ghost">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="motion" className="conveyor">
          <span className="anno">Motion test</span>
          <h2>Things pass behind it</h2>
          <p className="section-sub">
            A conveyor of specimens runs behind a fixed pane of glass. On desktop
            Chromium, watch each one bend as it crosses the rim; hover to pause the
            belt.
          </p>
          <div className="belt">
            {/* the moving layer is a SIBLING behind the pane (an animated ancestor
                would become the backdrop root and kill refraction) */}
            <div className="belt__track" aria-hidden="true">
              <BeltSet />
              <BeltSet />
            </div>
            <Card aria-hidden="true" className="belt__lens" />
          </div>
        </section>

        <section id="catalog" className="catalog">
          <span className="anno">Specimen catalog</span>
          <h2>The components you already know</h2>
          <p className="section-sub">
            shadcn names, glass material. Eight live specimens over the engine's own test
            patterns; about forty more in the Storybook.
          </p>
          <div className="catalog__grid">
            {CATALOG.map((c) => (
              <div key={c.id} className={`cell cell--${c.bg}`}>
                <span className="cell__tag">
                  {c.id} · {c.name}
                </span>
                <div className="cell__body">{c.node}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="engine" className="engine">
          <span className="anno">Instrument readings</span>
          <h2>Honest about the engine</h2>
          <p className="section-sub">
            True live-backdrop refraction (<code>backdrop-filter: url()</code>) only
            renders on desktop Chromium today, so that's exactly where we use it. Safari,
            Firefox and mobile get the frosted material: no fakes, no broken effects.
            And AA contrast is one line.
          </p>
          <pre className="engine__code">{`<GlassProvider contrast="aa">…</GlassProvider>`}</pre>
          <div className="engine__pair">
            {/* Captured from this page's playground: Chrome via CDP, WebKit via Playwright.
                Regen: see HANDOFF.md §5 harness. */}
            <figure>
              <img
                src="./engine-chromium.jpg"
                alt="The playground card on desktop Chromium: the backdrop bends at the card's rim (edge refraction)"
                loading="lazy"
              />
              <figcaption>Desktop Chromium · edge refraction</figcaption>
            </figure>
            <figure>
              <img
                src="./engine-webkit.jpg"
                alt="The same card in Safari/WebKit: clean frosted glass, no refraction"
                loading="lazy"
              />
              <figcaption>Safari, Firefox, mobile · frosted glass</figcaption>
            </figure>
          </div>
        </section>

        <section className="outro">
          <div className="field field--outro" aria-hidden="true">
            <span className="field__word">SHIP</span>
          </div>
          <h2 className="outro__title">Ship glass.</h2>
          <div className="outro__actions">
            <InstallSnippet />
            <Button variant="solid" tone="primary" className="aa-primary" asChild>
              <a href={GITHUB_URL}>Star it on GitHub</a>
            </Button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span className="anno">
          LGLite · MIT · built with its own components · refraction on desktop Chromium,
          frost everywhere else
        </span>
      </footer>
    </GlassProvider>
  );
}
