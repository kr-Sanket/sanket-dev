# DESIGN SYSTEM

> **Version 1.0 — established 2026-08-21.**
> The visual constitution of sanket.dev. Companion to `DECISIONS.md` (which governs
> engineering architecture through ADRs) and `CLAUDE_START.md` (the working entry
> point). This document governs visual decisions the same way ADRs govern technical
> ones: it records the principles, and future work either follows them or amends
> this document deliberately — never silently.

## Purpose

Every product accumulates hundreds of small visual decisions. Without a written
philosophy, those decisions drift toward whatever is fashionable, convenient, or
recently seen — and the product slowly loses its identity one reasonable-looking
change at a time.

The engineering side of sanket.dev is already protected against this drift: ADRs
record why the architecture is the way it is, and new work is measured against
them. This document extends the same discipline to the visual layer. It is the
**visual source of truth**. When a future session, contributor, or redesign
impulse proposes a change, the question is not "does this look good?" but "does
this obey the constitution — and if not, is the constitution being amended on
purpose?"

This is not a styling guide, a component inventory, or a token reference. It
deliberately contains no implementation detail. Implementations change;
principles should not have to.

---

# 1. Visual North Star

**sanket.dev is not designed to impress through spectacle. It is designed to
build trust.**

The site is a premium engineering product that showcases one engineer. Its means
of persuasion are clarity, evidence, calm craftsmanship, and thoughtful
interaction — the same qualities the work itself should demonstrate. A recruiter
should leave thinking "this person is careful"; an engineer should leave thinking
"this person understands systems." Neither impression is produced by decoration.

The highest compliment the interface can receive is that nobody remembers it —
they remember the work. **The interface should disappear behind the work it
presents.** Every visual decision is evaluated against that disappearing act:
anything that pulls attention from the content to itself is working against the
product, no matter how beautiful it is in isolation.

---

# 2. Design Philosophy

**Engineering over decoration.** Every visual element must do a job — establish
hierarchy, communicate state, guide the eye, or carry information. An element
whose only job is "looks nice" is removed. The aesthetic emerges from rigor, the
way a well-designed tool is beautiful because nothing on it is arbitrary.

**Light over color.** Depth, emphasis, and atmosphere come from illumination —
brightness, temperature, soft falloff — not from pigment. A lit neutral surface
feels premium; a colored one feels themed. When the interface needs to direct
attention, it brightens or warms; it does not paint.

**Depth over effects.** The page is built from physical planes: a canvas, papers
resting on it, surfaces floating above. Depth is achieved through the honest cues
of that physical model — tone, elevation, occlusion, overlap — never through
effects applied for their own sake. If a viewer can name the effect, it has
already failed.

**Content over animation.** Motion exists to explain (something appeared,
something responded, something settled) — never to entertain. The content is
always the protagonist; motion is stagehand work, done quietly and ideally
unnoticed.

**Calm over excitement.** The emotional register is composure. The site should
lower the reader's pulse, not raise it. Excitement is the content's job — a
measured deployment-time reduction is exciting; a pulsing gradient is noise
pretending to be excitement.

**Purpose over trends.** Trends are adopted only when they solve a problem this
product actually has, and only after they survive the review checklist (§11).
"Everyone is doing it" is an argument against, not for: this product's value is
partly that it does not look like everything else this year.

**Evidence over marketing.** The visual language must never write checks the
content can't cash. No inflated numbers, no decorative charts, no placeholder
text dressed as substance. Where data is missing, the interface says less and
says it honestly — sparse and true always beats full and fabricated.

---

# 3. Brand Personality

If sanket.dev were a person, they would be the engineer you trust in an
incident: **calm** under pressure, **precise** in language, **thoughtful** before
speaking, **honest** about what they don't know, **curious** enough to have
already read the docs, **professional** without being cold. They own few things,
all of high quality — **premium** in the sense of care, not price. They are
**engineering-first**: they would rather show you the architecture diagram than
the awards shelf.

They explain trade-offs unprompted. They say "this part is still research" when
it is. They keep their workshop clean.

**What sanket.dev is not:** it is **not flashy** — it never raises its voice to
get attention. It is **not cyberpunk** — no neon, no terminal-green theatrics, no
hacker aesthetics; competence doesn't cosplay. It is **not startup hype** — no
rocket-ship copy, no inflated superlatives, no artificial urgency. It is **not
gaming-inspired** — no HUDs, no glow, no achievement-unlocked energy. Each of
these registers signals excitement over substance, which is the exact inversion
of this product's promise.

---

# 4. Material Language

The interface is built from a fixed hierarchy of materials. Every surface in the
product must identify as exactly one of these; a surface that belongs to no
material — or to two — is a design error.

**Canvas.** The environment everything else lives in. Not pure, not blank: a
quiet, softly lit field that establishes atmosphere. The canvas is never
decorated directly; it is *illuminated* (§5). Users should never consciously see
it, only feel that the room has light in it.

**Section.** A region of the canvas set apart by a barely perceptible tonal
shift and a hairline boundary. Sections give a long page rhythm — the feeling of
walking through rooms rather than down a corridor. A section is a place, not an
object: it has no elevation and casts nothing.

**Paper.** The default surface content sits on — cards, panels, tiles. Paper
rests *on* the canvas and is one step brighter than it, separated by a fine edge
and, in the light environment, a soft, shallow shadow: the shadow of a sheet
lying on a desk, not an object hovering above it. Paper is where most reading
happens; it must be the most restful material in the system.

**Elevated Paper.** Paper that has been deliberately raised because it is the
focal object of its region — an anchor, a highlight, the one thing this room is
about. Slightly deeper shadow, slightly stronger presence. Elevation is a
scarce resource: at most one elevated surface per view, or the hierarchy
collapses into noise.

**Floating Surface.** A surface detached from the page flow — it follows the
user or responds to them, and visibly belongs to a layer above the papers.
Floating is justified only by function (persistent navigation, contextual
detail); nothing floats for style.

**Overlay.** The topmost material: dialogs, drawers, menus. An overlay
temporarily owns the screen, dims or softens the world beneath it, and must
leave as gracefully as it arrived. Overlays are visitors, not residents — the
page must feel fully restored when they close.

---

# 5. Lighting Philosophy

**The interface is illuminated, not decorated.** The mental model is a physical
one: neutral materials sitting in a softly lit room. Design decisions about
depth and emphasis are lighting decisions.

**Light creates atmosphere.** The canvas carries large, extremely soft fields of
light — so diffuse they have no findable edges. Their job is to make the page
feel like a space rather than a document. They may respond to the user's
presence, slowly and at a distance, the way ambient light shifts when someone
moves through a room — never like a spotlight chasing them.

**Temperature guides attention.** Warmth and coolness — at near-imperceptible
strength — are legitimate compositional tools: warmth where the human lives,
coolness where the engineering lives, neutrality everywhere between. Temperature
is not color (§6); it is the character of the light, and it must stay subtle
enough that no one could name the hue.

**Shadows communicate elevation — nothing else.** A shadow exists only to state
a surface's place in the material hierarchy, and it must stay physically
plausible: shallow, soft, and consistent with one gentle light from above. Cards
*receive light* and rest on the page; they do not hover dramatically on heavy
shadows. In the dark environment, tone does the work shadows do in the light —
each theme uses its native depth cue rather than forcing one model onto both.

**Forbidden light:** colorful gradients used as decoration, neon of any kind,
glowing edges, lens flares, and any light source the user is meant to *look at*
rather than *see by*.

---

# 6. Color Philosophy

**Color is expensive.** Every hue added to a view spends attention the content
can never get back. sanket.dev budgets color the way good engineering budgets
complexity: spend nothing by default, and pay gladly where it buys meaning.

**Most of the interface remains neutral.** Surfaces, text, boundaries, and
chrome live in the neutral range. This is a deliberate identity, not an absence
of design — restraint held everywhere is what makes the few colored elements
legible instantly.

**Semantic information earns color.** Color appears where it carries meaning a
neutral cannot:

- **Status** — a project's lifecycle state, availability, liveness.
- **Charts and data** — language distributions, activity, measured values.
- **Architecture** — distinguishing systems and relationships in diagrams.
- **Metrics** — the small set of numbers the product stakes its credibility on.
- **GitHub activity** — real, external, living data.

In every case the color *is* the information. Remove the meaning and the color
must go with it.

**Decorative color is forbidden.** No colored backgrounds for mood, no accent
color applied to make a section "pop," no brand color spread across the page for
recognition. If a colored element could be neutral without losing information,
it should be.

---

# 7. Typography Philosophy

**Typography is the primary interface.** This is a product made of words —
claims, evidence, explanations. Type does the work that imagery does elsewhere;
it deserves the corresponding care.

**Hierarchy is structural, not cosmetic.** Sizes, weights, and the two voices of
the system (a humanist voice for reading, a technical voice for labels, data,
and machine-adjacent text) map onto the actual structure of the content. A
reader should be able to reconstruct the document outline from the typography
alone — and never encounter two elements at the same visual rank with different
importance.

**Reading rhythm over density.** Line lengths stay comfortable, measures stay
honest, and text is grouped into breaths rather than walls. The page is designed
for a reader moving at a natural pace with a specific goal — not for maximizing
information per viewport.

**Whitespace is the load-bearing element.** Space is what separates ideas,
establishes importance, and produces calm. It is never "empty" and never
available for reclamation just because something could fit there. When a layout
feels wrong, the first suspect is missing space, not missing decoration.

**No oversized marketing copy.** The largest text on any page is a name or a
plain statement of fact — never a slogan inflated to fill a viewport. Type earns
its size through informational rank, not persuasion.

---

# 8. Motion Philosophy

**Motion follows physics.** Everything that moves behaves like a real object
with mass in a damped medium: it eases in, travels believably, and **settles**.
Nothing snaps, nothing bounces, nothing springs for personality. When motion
ends, it ends completely — the page comes to true rest, and an idle page is a
still page.

**Motion is information.** The permitted jobs: acknowledging input, revealing
continuity between states, expressing ambient presence at the very edge of
perception. If a motion's job cannot be stated in one sentence, the motion is
decoration, and decoration does not move here. **Nothing exists only for
decoration.**

**Slowness is a feature.** Ambient motion operates below conscious attention —
the user should feel the page is alive and never catch it performing. The moment
a viewer thinks "nice effect," the effect has overreached.

**Reduced-motion users receive equal respect.** A user who asks for less motion
gets the complete product — full content, full atmosphere in its static form,
full function — with motion removed, not with a degraded experience. Honoring
that preference is not an edge case; it is part of the product's definition of
craftsmanship, and it extends to preferences changing mid-session.

---

# 9. Signature Components

Five experiences define this product. They receive the highest polish budget
because they are the product's argument: each one demonstrates engineering
judgment in a way no paragraph could.

**Engineering Status Panel.** The first object a visitor meets — a live,
console-like statement of who this engineer is right now: available, located,
graduating, seeking, building. It is the hero's anchor and the clearest
expression of the material language: the one elevated paper in its room,
receiving the most light. It deserves polish because first impressions are
formed here in seconds.

**Architecture Viewer.** The claim "I understand systems," made interactively:
real architecture, real relationships, explorable component by component. It is
the most engineering-dense surface in the product and the place where the color
budget (§6) is spent most visibly. It deserves polish because it is the feature
a senior engineer will judge hardest.

**Project Mentor.** An honest machine: it answers from authored knowledge,
admits what it doesn't know, and fabricates nothing. Its interface must radiate
that honesty — calm, matter-of-fact, never pretending to be more intelligent
than it is. It deserves polish because it demonstrates values, not just skills.

**Recruiter / Developer Mode.** One product, two truthful depths — respect for
two different readers' time, expressed as a single quiet control. The switch
must feel like refocusing a lens, not flipping a theme. It deserves polish
because it *is* the product thesis: the same evidence, served with empathy for
its audience.

**GitHub Hub.** The living proof: external, verifiable, un-curated activity.
Its design must stay subordinate to its data — real numbers presented plainly —
and degrade with grace when the outside world doesn't answer. It deserves polish
because it is the one section the visitor knows the author cannot embellish.

---

# 10. Things We Never Do

A permanent list. Amending it requires amending this document — deliberately,
in writing, with a reason.

- **Never neon.** No glow, no luminous accents, no terminal-chic.
- **Never mesh gradients.** No amorphous multicolor fields; atmosphere comes
  from light, not pigment.
- **Never particles.** No floating dots, stars, confetti, or ambient debris.
- **Never glass everywhere.** Translucency, if it ever appears, is a single
  deliberate material decision — never a default coat of paint.
- **Never meaningless animation.** If the motion's job can't be named, it
  doesn't ship.
- **Never visual clutter.** Every view holds a small number of things worth
  looking at; density is a failure mode, not a feature.
- **Never decoration without purpose.** Ornament is not a category this
  product has.
- **Never artificial complexity.** Nothing is made to look sophisticated;
  sophistication is demonstrated, not costumed.
- **Never trend-copying without reason.** A pattern enters this product
  because it solves our problem, survives §11, and would still make sense
  when the trend is over.

---

# 11. Design Review Checklist

Before implementing any UI change, answer all of these. A single honest "no"
means stop and reconsider.

1. **Does it improve clarity?** Is something easier to see, read, or
   understand than before?
2. **Does it improve trust?** Does the change make the product feel more
   honest and more carefully made?
3. **Does it support engineering?** Does it serve the presentation of real
   work and real evidence?
4. **Does it preserve the material language?** Does every touched surface
   still belong to exactly one material in §4?
5. **Does it strengthen hierarchy?** Is the most important thing on the page
   more clearly the most important thing?
6. **Does it reduce cognitive load?** Is there less to parse, not more?
7. **Would this still feel good in five years?** Or is it this year's
   texture applied to a product meant to outlast it?

---

# Closing Statement

The objective of sanket.dev is not to look like every modern portfolio — the
gradients, the glass, the borrowed excitement. Those sites are interchangeable
by design. The objective is to be a memorable engineering product: a place
whose calm, lit, precise visual language reflects exactly the same care as the
architecture underneath it — so that the strongest impression a visitor takes
away is not "beautiful website," but "careful engineer." The pixels and the
ADRs are making the same argument. This document exists to keep them in
agreement.
