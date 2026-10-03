# ATUNED Onboarding and First Experience
## Creative + Technical Design Document
### Working TDD for implementation

## 1. Purpose

This document defines the onboarding experience from the first encounter through the first release, reflection, integrity assessment, and archetype assessment.

The implementation goal is not to create a conventional onboarding questionnaire.

The experience should feel like entering an instrument.

The system should introduce ATUNED by letting the user experience the mechanics before explaining the mechanics.

Core principle:

> Experience first. Evidence second. Explanation third.

The onboarding should establish the core ATUNED loop:

**Mirror → Test → Change**

The user tells the system what is happening.

ATUNED reflects what it notices.

The user tests whether the reflection is accurate.

The system works with the selected pattern.

The user notices what changes.

The system remembers what happened.

---

# 2. Product Hierarchy

```text
THE MECHANICS OF BEING
        ↓
     SOURCE OS
        ↓
      ATUNED
```

The Mechanics of Being contains the intellectual framework, mechanics, and methodology.

SOURCE OS is the intelligence architecture that operationalizes those mechanics.

ATUNED is the customer-facing experience.

Core positioning:

> ATUNED is the instrument through which The Mechanics of Being becomes visible.

ATUNED does not tell the user who they are.

It shows the user what they are doing, lets them test what it sees, and remembers what changes.

The experience should feel like a living mirror that observes how the user operates, lets the user test what it sees, and remembers what actually changes.

---

# 3. Creative Direction

## 3.1 The Field is the Interface

The Field should not behave like a decorative background.

It is the interface.

When the user writes, the Field changes.

When ATUNED notices something, a signal appears.

When two things connect, a line forms.

When the user disagrees, a line breaks and another path opens.

When something repeats, a pattern gathers.

When the user works with it, the structure changes.

When the user returns later, the Field remembers.

The system should visually communicate that the user's input is changing the instrument.

---

# 4. Visual Language

Use the visual language already established by the Field and Body sections of ATUNED.

Required qualities:

2D.

Iconographic.

Symbolic.

Clean.

Precise.

Scientific + symbolic.

Modern.

Future edge.

Dark field.

Geometry.

Nodes.

Addresses.

Paths.

Bands.

Waves.

Color registers.

Ordered geometry.

State transitions.

Thin paths.

Minimal purposeful interface.

Alive and breathing.

Do not use:

Human figures as decorative elements.

Stock photography.

Mystical portals.

Religious imagery.

Spiritual imagery.

Decorative sci-fi effects.

Dashboard clutter.

Generic wellness imagery.

Artificial glowing effects that do not communicate state.

The experience is not supposed to look mystical.

It is an instrument.

---

# 5. Visual Grammar

Every visual event should have a semantic purpose.

```text
SIGNAL        = node appears
NOTICE        = node brightens
CONNECT       = line forms
CONTRADICTION = paths diverge
TEST          = paths become selectable
CONFIRM       = path stabilizes
UNKNOWN       = path remains open
PATTERN       = repetition gathers
RELEASE       = structure loosens
CHANGE        = state reorganizes
VERIFY        = before/after separates
MIRROR        = system gathers what it has observed
```

Do not add animation merely because animation is available.

Motion should communicate state.

The visual system should feel alive, but not theatrical.

---

# 6. Core Onboarding Principle

The onboarding must not begin by explaining the entire system.

The user should encounter the system through experience.

Preferred progression:

```text
INFORMATION
    ↓
RECOGNITION
    ↓
CURIOSITY
    ↓
EXPERIENCE
    ↓
CHOICE
    ↓
EMBODIMENT
```

Do not build:

```text
READ
    ↓
EXPLAIN
    ↓
TEST
    ↓
EXPORT
    ↓
IMPORT
    ↓
START
```

There should be no unnecessary handoff between the funnel and the software.

The funnel is the first room of the product.

---

# 7. Complete Journey

```text
LAND
 ↓
ENCOUNTER
 ↓
SELECT_GROUND
 ↓
STARTER_GIFT_ISSUED
 ↓
ACCOUNT_CREATED
 ↓
TUTORIAL_STARTED
 ↓
PATTERN_SELECTED
 ↓
FIRST_RELEASE
 ↓
VERIFY
 ↓
RERUN
 ↓
FREE_PRACTICE
 ↓
REFERRAL
 ↓
NEW_GROUND_LIMIT
 ↓
TIER_SELECTED
 ↓
PAYMENT
 ↓
ENTITLEMENT_GRANTED
 ↓
NEW_GROUND
 ↓
CONTINUED_PRACTICE
```

Every state must be recoverable.

There must be no silent loss of user input.

---

# 8. Funnel to Software

Preferred activation path:

**CONCERN → PERSONALIZED GIFT → TUTORIAL → FIRST RELEASE → RERUN → FREE PRACTICE → REFERRAL → PAID**

The product should not feel like a marketing funnel sitting in front of an application.

The first experience should already be the application.

---

# 9. Starting Point

## Screen purpose

Allow the user to select the experience that brought them here.

Heading:

**What brought you here?**

Present 6–12 symbolic starting points.

Examples:

Anxiety

Overwhelm

Anger

Burnout

Fatigue

Grief

Fear

Relationships

Self-worth

Money

Purpose

Something else

These are entry conditions.

They are not diagnoses.

The selected starting point determines the ground from which ATUNED begins the first experience.

## Visual behavior

Each starting point should be represented by an icon or symbolic field state.

When selected, the selected symbol becomes active and the surrounding field responds.

The system should feel as though it has received an address.

---

# 10. Personalized Starter Gift

Immediately after selecting the starting point, issue a personalized starter set.

Message:

**Your first 100 patterns are ready.**

The 100 patterns must be relevant to the selected starting ground.

Do not give the user a generic set.

The starter gift becomes the user's actual pattern bank.

The user should be able to use those patterns immediately.

When the user creates an account, the funnel state transfers directly into the account.

There should be no manual export or import.

## Starter Gift Object

```yaml
StarterGift:
  id
  user_id
  source: funnel
  selected_ground
  pattern_ids[]
  granted: 100
  remaining
  issued_at
  transferred_at
  status
```

## Funnel Activation Object

```yaml
FunnelActivation:
  session_id
  selected_ground
  starter_gift_id
  selected_pattern_ids[]
  user_input
  source_event_ids[]
  created_at
```

Reruns of already-opened ground cost zero.

The user should not be charged again to revisit something they have already opened.

---

# 11. Feeling Page

The next page moves from selecting the starting ground into direct experience.

The driving words for this part of the experience are:

**REFLECT**

and

**FEEL**

The page should ask about the user's actual experience.

Do not phrase it as:

"What do you want your mirror to reflect back?"

This is too conceptual.

Use a direct feeling-oriented question.

Possible primary prompt:

**What are you feeling today?**

Then deepen:

**How does that feeling run through you?**

The exact final copy can be tuned during implementation, but the intent must remain:

Move the user from naming a topic into noticing the actual experience.

The user should not need to understand ATUNED's architecture.

They simply notice what is present.

---

# 12. Story Intake

The user now tells ATUNED what is happening.

Provide two equivalent input modes:

Text.

Voice.

The user should be able to tell the story naturally.

Do not force a form before the story.

Primary prompt:

**Tell us what’s off.**

The system should accept a real story rather than requiring the user to translate their experience into ATUNED terminology.

---

# 13. Story Sniffer

The Story Sniffer is not merely a keyword extractor.

It extracts the structure of the lived experience.

The system should identify:

```text
Story Tag
Story Snippet
Quality / Adjective
Intensity
Cause / Experience
Body Location
Relationships
```

Example:

```text
Story Tag:
Over-responsibility

Story Snippet:
“I keep taking care of everybody else.”

Quality:
Overwhelmed

Intensity:
8

Cause / Experience:
Fear that things will fall apart if I don’t handle them.
```

The Story Sniffer should preserve the user's actual language wherever possible.

Do not replace the user's experience with clinical terminology.

Do not claim certainty when the system is interpreting.

---

# 14. Story Signal

The extracted structure becomes a Story Signal.

The Story Signal drives:

```text
STORY
 ↓
PATTERN
 ↓
RELATIONSHIP
 ↓
BODY
 ↓
COLOR
 ↓
ICON
 ↓
ANIMATION
 ↓
RELEASE
```

The visual system must make these relationships observable.

---

# 15. Story Synthesis / Mirror

After the Sniffer has interpreted the story, present the result back to the user.

Show:

Story Tag.

Story Snippet.

Quality.

Intensity.

Cause / Experience.

Body location.

Relevant relationships.

Color.

Visual pattern.

Animation.

The summary should explain what the behavior appears to be doing.

The Body Map should show where the user experiences it.

The animation should show how the pattern operates.

These are three different representations of the same signal.

---

# 16. Dynamic Body Map

The body map should respond to the Story Signal.

It should not simply display a static human body illustration.

The body representation should communicate location through the existing Body visual language.

When the Story Signal is associated with a body area:

The relevant area becomes active.

The color register corresponds to the signal.

The animation communicates density, movement, contraction, pressure, or other experiential qualities without making medical claims.

Do not claim that the map has medically diagnosed a body condition.

---

# 17. Accuracy Check

The system must ask:

**Does this feel accurate?**

Provide three clear paths:

**That’s it**

**Not quite**

**Adjust**

The user must be able to reject the interpretation.

The system must treat rejection as meaningful information.

---

# 18. Adjustment

If the user chooses Adjust, present:

**Tell us what’s off.**

Allow both text and voice.

The user should be able to explain what ATUNED misunderstood.

SOURCE OS must reinterpret the correction.

The correction should update:

```text
Story Tag
Story Snippet
Quality
Intensity
Cause / Experience
Body Location
Relationships
```

Then return the user to:

**Does this feel accurate?**

Do not force the user to accept the first interpretation.

---

# 19. Living Story Animation

The story intake should feel continuous.

The Field should breathe.

Signals should gather.

Detected patterns should pull toward one another.

Stronger signals should become denser or heavier.

When enough information exists, the Field should settle into the Mirror state.

When the user adjusts the interpretation, the Field should reconfigure.

This is not a sequence of static forms.

It is a continuous instrument.

---

# 20. Somatic Setup

Before the first release, there must be a distinct setup.

Do not immediately put the user into the release script.

The system first explains what the user is about to do.

Preferred opening language:

**Welcome to a somatic experience. Turn your senses inward.**

Then guide the user to notice what they experience while holding the identified thought or pattern in awareness.

The purpose is observation.

Possible experiences include:

Pressure.

Density.

Relief.

Movement.

Activation.

No noticeable sensation.

The system must explicitly communicate that there is no required sensation.

If the user notices something, they simply notice it.

If they notice nothing, that is also information.

Do not tell the user that a particular sensation proves that a pattern exists.

Do not make medical claims.

---

# 21. Mini Release

The first release should be short and linear.

The system should automatically select relevant patterns from the Story Signal.

The initial mini release should contain approximately 10 relevant patterns.

The user should read the release continuously.

Do not insert unnecessary pauses between every phrase.

The release language begins:

**I am releasing believing, thinking, feeling, behaving, acting.**

Use this formulation consistently unless the product owner changes it.

The release is an experiential exercise.

Do not describe it as a medical treatment.

Do not claim that it clinically changes the nervous system.

---

# 22. Release State

During the release, the visual Field should communicate a change of state.

Preferred progression:

```text
HELD
 ↓
CONTRACTED
 ↓
RELEASING
 ↓
OPENING
 ↓
SETTLING
 ↓
OBSERVING
```

The animation should visually represent the selected pattern becoming less fixed and the Field reorganizing.

The animation should remain 2D and symbolic.

Do not use decorative particles or generic energy effects.

Every visual change should correspond to a state.

---

# 23. First Release Success

The first release must require almost no system knowledge.

The user should not need to understand pattern architecture, Source OS, advanced controls, tier structures, achievement systems, telemetry, or advanced terminology.

The system should do the configuration automatically.

First session objective:

```text
WRITE
 ↓
IDENTIFY
 ↓
RELEASE
 ↓
PRACTICE
```

Maximum required decision count before first release:

**One.**

Default behavior:

```yaml
first_session:
  pattern_selection: automatic
  release_configuration: automatic
  advanced_settings: hidden
  system_vocabulary: minimal
  achievement_layer: hidden
```

Do not optimize payment before optimizing first successful release.

---

# 24. Post-Release Transition

After the release, do not immediately ask the user to score themselves.

First acknowledge the range of possible experience.

The user may feel:

Something.

Nothing.

Density.

Relief.

Movement.

No noticeable sensation.

They may have been highly focused on thought.

They may not have been holding the pattern strongly.

The product must not interpret any of these as failure.

The user is simply being invited to notice.

Transition language should return to the two driving words:

**FEEL**

**REFLECT**

---

# 25. Integrity Self Assessment

The assessment is not a conventional personality test.

It is reflective self-observation.

Ask one question at a time.

Each question should describe a real behavior or real moment.

Do not ask the user to rate an abstract virtue without context.

Primary setup:

> **Reflect on a real moment.**
>
> Think about how you actually operate when this shows up in your life.
>
> Not how you want to operate.
>
> Not how you think you should operate.
>
> Where would you put yourself on the scale?

Scale meaning:

```text
0 = I almost never operate this way
5 = I operate this way about half the time
10 = I operate this way consistently
```

Supporting copy:

> Most people operate somewhere in the middle.
>
> The midpoint is 5.
>
> This isn't a test, and there isn't a good or bad number.
>
> You're assessing yourself against the moments you've actually lived.
>
> Be as honest with yourself as you can.

The highest value represents consistency, not perfection.

---

# 26. Integrity Question Design

There are 10 integrity questions.

They should be based on real moments.

They should ask the user to reflect and feel into actual behavior.

They should not become abstract moral philosophy.

The questions should map to the established CQ100 integrity architecture.

Current integrity laws:

```text
Truth
Transparency
Unity
Awareness
Presence
Equanimity
Compassion
Forgiveness
Courage
Temperance
Duty
Accountability
Justice
Non-Harm
Responsibility
Humility
Generosity
Detachment
Patience
Aesthetic Beauty
Nature
```

Do not add Wisdom, Love, or Ownership as laws unless explicitly requested.

The assessment should record the user's self-assessment as evidence about how they perceive their own behavior.

It is not a diagnosis.

It is not a grade.

It is not a measure of human worth.

---

# 27. Integrity Visual Design

Do not make the page look like a survey form.

Keep the Field present.

Use:

One question.

One symbolic visual.

One continuum.

One clear action.

The Field should subtly respond to the user's selection.

Do not use celebratory animation for high scores.

Do not use punitive animation for low scores.

The purpose is reflection.

---

# 28. Transition to Archetypes

After the integrity assessment, move into archetype exploration.

The transition should explain that the next section looks at how the user tends to operate.

The user has identified archetypes such as:

Warrior.

Sage.

Mage.

Rebel.

The system should not assume these are the only archetypes.

The user's selected Avatar configuration is authoritative.

---

# 29. Archetype Questions

Archetype questions should use polar behavior.

Example:

**When something needs to change, do you tend to:**

Act immediately

or

Understand it deeply first?

Another:

**When faced with resistance, do you tend to:**

Push through

or

Find another way around it?

The purpose is not to force a binary identity.

The UI should support a continuum or a Both option where appropriate.

Do not force false binaries.

The system is observing tendencies, not assigning a rigid identity.

---

# 30. Archetype Visuals

Use the existing archetype icon system.

The icons should be visible in the left navigation or relevant archetype area.

Baseline saturation should be approximately neutral.

The system can adjust saturation based on observed language and behavior.

Do not make a visual change imply a permanent identity.

The system is tracking expression.

---

# 31. Avatar Connection

The onboarding should ultimately feed the user's Avatar.

The Avatar represents who the user is becoming and how they currently operate.

It should include:

Alignment.

Moral compass.

Behavior conditioning.

Integrity conditioning.

Current state.

User-defined becoming.

Archetypes.

Purpose.

Patterns.

Rituals.

Evidence.

The Sniffer identifies patterns that interfere with becoming the person the user has defined.

Explicit Avatar definitions should receive strong priority when the system determines what to work with.

---

# 32. What the Onboarding Has Established

By the end of this sequence, ATUNED should know enough to establish an initial model of:

```text
Starting Ground
↓
Current Feeling
↓
Story
↓
Story Signal
↓
Pattern
↓
Body / Experience
↓
First Release
↓
Observed Change
↓
Integrity Self-Assessment
↓
Archetypal Tendencies
↓
Initial Avatar State
```

This should be enough to hand the user into the core product.

The user should not need another orientation lecture.

---

# 33. Handoff Into the Software

The tutorial should end by showing the user what just happened.

Use:

```text
YOU SAID
    ↓
ATUNED NOTICED
    ↓
YOU TESTED
    ↓
YOU WORKED WITH IT
    ↓
YOU OBSERVED
```

This is the core product demonstration.

The system has already shown the user the mechanics.

Now the user can enter the software.

---

# 34. Core Product Loop After Onboarding

The onboarding hands directly into:

```text
DISCOVER
    ↓
PLAY
    ↓
FLOW
    ↓
EMBODY
```

Discover identifies what is present.

Play allows the user to work with it.

Flow represents sustained practice and movement.

Embody represents integration into behavior.

Do not explain these concepts at length before the user experiences them.

---

# 35. Free Practice

The starter 100 patterns are consumed as new ground is opened.

Rerunning patterns that have already been opened costs zero.

After the starter gift is exhausted, Free continues with a weekly allowance.

Current intended behavior:

```text
Free:
10 new patterns / week

Unused Free patterns:
bank
```

The free experience should remain meaningful.

The restriction is on new ground.

---

# 36. Referral

Once the user has experienced value, provide a simple referral path.

Invite-a-friend behavior:

**25 free patterns**

The referral should feel like sharing an experience, not a sales mechanism.

---

# 37. Monetization Principle

ATUNED is a results-as-a-service model.

It is a purpose-based impact product.

It is not primarily selling information.

The reading is visible across tiers.

Paid access buys additional new ground and throughput.

Core principle:

> **Sight is not for sale.**
>
> **New ground is.**

Do not hide the user's own reading behind a paywall.

Do not artificially restrict insight that has already been established.

Current working tiers:

```text
Free
$12
$29
$59
$99
```

Tier 4 has the same 1,200-pattern allowance as Tier 3 plus cohort-lead capability.

---

# 38. Paywall Trigger

Do not introduce payment before value.

The user should first have:

A relevant pattern.

A completed release.

An opportunity to notice change.

A reason to return.

The paywall should appear when additional new ground becomes the meaningful constraint.

Preferred conceptual message:

**You’ve worked through this ground. There is more to explore.**

Then show the available throughput choices.

Do not create artificial urgency.

---

# 39. Product Value Model

The most important progression is not payment.

It is demonstrated value.

Human lifecycle:

```text
ACQUIRE
 ↓
ARRIVE
 ↓
ORIENT
 ↓
WRITE
 ↓
FIRST RELEASE
 ↓
SECOND RELEASE
 ↓
THIRD RELEASE
 ↓
PRACTICE
 ↓
EXPERIENCE CHANGE
 ↓
RETURN
 ↓
FORM HABIT
 ↓
DEVELOP MASTERY
 ↓
NEED MORE GROUND
 ↓
SELECT TIER
 ↓
RECEIVE VALUE
 ↓
RETAIN / DOWNGRADE / UPGRADE
 ↓
OPTIONAL LEADERSHIP
 ↓
HELP OTHER PEOPLE
```

Primary product question:

**Does ATUNED produce enough demonstrated value for the person to continue practicing?**

---

# 40. Failure and Recovery

The system must account for unsuccessful or ambiguous experiences.

Possible release states:

```text
RELEASE_SUCCESS
RELEASE_PARTIAL
RELEASE_REJECTED
RELEASE_ABANDONED
RELEASE_CONFUSED
RELEASE_NO_EFFECT
```

Do not interpret every incomplete experience as user failure.

Each state needs a recovery path.

The system should learn from:

What was selected.

What was rejected.

What was changed.

What was completed.

What the user reported.

---

# 41. Second and Third Release

The product must deliberately support:

```text
FIRST SUCCESS
    ↓
SECOND SUCCESS
    ↓
THIRD SUCCESS
    ↓
WEEKLY RITUAL
    ↓
SELF-DIRECTED PRACTICE
    ↓
DEMONSTRATED VALUE
    ↓
OPTIONAL UPGRADE
```

The first release proves the mechanism.

The second release establishes repeatability.

The third release begins habit formation.

The system should progressively reveal more capability after repeated use.

---

# 42. Progressive Disclosure

Do not expose the entire architecture at the beginning.

After first release, reveal:

Pattern detail.

Why this pattern was selected.

Additional release controls.

After repeated use, reveal:

Advanced vocabulary.

Deeper system architecture.

Achievements.

Additional tools.

The user earns understanding through use.

---

# 43. Creative Rule

The product should always demonstrate before it explains.

When possible:

Show the signal.

Let the user interact with the signal.

Show what changed.

Then explain what happened.

Do not reverse that order unless explanation is necessary for safe or understandable use.

---

# 44. Implementation Contract

The implementation AI must not infer missing behavior.

Every screen must explicitly define:

```text
SCREEN PURPOSE
USER ACTION
SYSTEM RESPONSE
VISUAL RESPONSE
DATA CREATED
NEXT STATE
RECOVERY PATH
```

For every interactive element specify:

What happens when selected.

What happens when rejected.

What happens when the user changes their answer.

What happens if the user provides no answer.

What happens if the user exits.

What state is persisted.

What state is restored on return.

---

# 45. Required Screen Schema

```yaml
Screen:
  id:
  purpose:
  title:
  supporting_copy:
  inputs:
  actions:
  default_action:
  validation:
  system_response:
  visual_response:
  persistence:
  next_state:
  alternate_paths:
  recovery:
  analytics_events:
```

Do not leave any of these behaviors to inference when the screen is implemented.

---

# 46. Required Events

Track at minimum:

```text
funnel_started
ground_selected
starter_gift_issued
account_created
tutorial_started
story_submitted
story_signal_generated
story_signal_confirmed
story_signal_rejected
story_adjustment_submitted
story_signal_updated
somatic_setup_started
first_release_started
pattern_released
first_release_completed
post_release_observation
integrity_assessment_started
integrity_question_answered
integrity_assessment_completed
archetype_assessment_started
archetype_question_answered
archetype_assessment_completed
tutorial_completed
software_entered
pattern_rerun
free_practice_started
referral_started
new_ground_limit_reached
tier_viewed
tier_selected
payment_completed
```

Events should contain enough context to reconstruct the user's journey.

---

# 47. Data Integrity

No user input should be silently discarded.

Preserve:

Original story.

Story Signal versions.

User corrections.

Confirmed interpretation.

Rejected interpretation.

Release history.

Pattern history.

Post-release observation.

Integrity responses.

Archetype responses.

Starter Gift state.

Funnel state.

Tutorial state.

The system should be able to reconstruct what the user experienced.

---

# 48. Must Not Happen

Do not:

Make the user configure a release before the first release.

Force a binary archetype identity.

Treat a self-assessment as a clinical measurement.

Treat a sensation as proof of a pattern.

Claim medical treatment or diagnosis.

Hide the user's reading behind payment.

Use decorative animation without semantic purpose.

Make the funnel feel separate from the application.

Require export/import between funnel and software.

Over-explain the system before the user experiences it.

Use mystical or religious visual language.

Turn the onboarding into a generic survey.

Turn the Field into a decorative background.

Make high scores feel morally superior.

Make low scores feel like failure.

---

# 49. Build Priority

## P0

First experience clarity.

Starting point selection.

Personalized 100-pattern gift.

Story intake.

Story Sniffer.

Mirror and correction loop.

Somatic setup.

Automatic 10-pattern mini release.

First release completion.

Post-release reflection.

Integrity assessment.

Archetype assessment.

Clean handoff into the software.

Failure and recovery.

Persistence.

## P1

Rerun behavior.

Free weekly pattern banking.

Referral.

Progressive disclosure.

Starter gift transfer.

Additional visual telemetry.

## P2

Advanced achievement systems.

Deep historical telemetry.

Advanced comparative visualizations.

Additional archetype intelligence.

---

# 50. Final Creative Standard

The onboarding should feel like this:

The user arrives with something they cannot quite articulate.

They select where to begin.

They tell the story.

The system listens.

The Field responds.

ATUNED reflects what it noticed.

The user says whether the reflection is true.

The system adjusts when it is wrong.

The user turns attention inward.

The user works with the pattern.

Something may change.

The user notices.

Then the system asks the user to reflect on how they actually operate.

Not how they wish they operated.

Not how they think they should operate.

How they actually operate.

The system begins to understand the relationship between:

```text
STORY
PATTERN
BODY
BEHAVIOR
INTEGRITY
ARCHETYPE
PURPOSE
PRACTICE
EVIDENCE
```

And that becomes the beginning of the user's living model.

The product is not telling the user who they are.

It is giving them a place to see what they are doing.

Test what they see.

Change what they choose to change.

And remember what actually changes.

The final creative principle is:

> **ATUNED should feel like a living mirror that observes how you operate, lets you test what it sees, and remembers what actually changes.**
