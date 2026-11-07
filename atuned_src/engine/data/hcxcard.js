
/* ============================================================
   HCXCARD · the hyper complex card, round HC.

   HCX_LIB in engine/data/nodes.js carries six families, each with a short
   house line, nm.d, and that line is the one thing a person has ever been
   shown: on hover, in ui/ui.js, and nowhere inside the drill a click opens.
   This table carries what each family actually does, where it starts, a
   scene a person might recognise, what it costs, the move out of it, and
   the coherent mode on the other side of it, named and defined. None of it
   was written for this table. It was already researched and written, once,
   in proto/knowledge/src/gen-data.js's HYPERCOMPLEX_MODES (HYPERCOMPLEX,
   SNIFFER_SPEC.md section 5), and it sat there, read by nothing in
   atuned_src, while the drill kept showing the one line. This is that
   content, keyed the way SABCARD already keys its own, and nothing here is
   new copy: every sentence is the source table's own.

   WHAT IS PORTED AND WHAT IS NOT. The source table also carries a cluster
   name (the clinical correspondence, "I . Narcissism" and the rest), a
   confidence number, a basis paragraph on why the entry is called
   research informed rather than canon, and two research sources per
   family. HCX_LIB already keeps its own clinical correspondence privately
   as sub, printed to nobody; the same ruling holds here, so cluster is
   left in the source table and not carried in. Confidence, basis and the
   two sources are provenance for whoever reviews the record, in the
   reviewer's own words, the same thing the DESCENT table in
   engine/data/compass.js keeps beside its own content for the same
   reason, and nothing that ships reads either table's provenance
   fields. They stay in proto/knowledge/src/gen-data.js, where
   they can be checked against the sources named, rather than duplicated
   into a table that would need the same NOT COPY exemption written twice.
   What is carried is only what a reading could put in front of a person.

   behavior          what the mode looks like from outside.
   triggerMechanism  what tends to start it. Composed with behavior into
                     one block, "What happens", the same order and the same
                     reason SABCARD's own h is: the situation before the
                     behaviour, so the payoff does not arrive before the
                     cost. Composed from these two fields and from nothing
                     else.
   livedExample      one scene. "What you might recognise", the same
                     eyebrow runCircleDrill already uses for exactly this,
                     a sentence a person might see themselves in.
   impact            "What it costs", the eyebrow ui/summary.js already
                     uses for this concept.
   practice          "Next move", SABCARD's own eyebrow for the same
                     concept: notice, separate, choose.
   inverseName,
   inverseDefinition the coherent mode on the other side, named and given
                     its meaning in the same place it is named, which is
                     what a label on a person owes the person under V9 and
                     V23: never a bare name with nothing beside it.

   THREE LINES CHANGED ON THE WAY IN, and nowhere else. The source material
   is adjacent research prose, carrying its own hedges throughout ("may",
   "can", "possible"), and it is kept exactly as written except where it
   used the one word this product's own objection log refuses outright:
   "framework" is on the abstract word list check.py holds against his
   objection CO-29, a ten year old has to ask what it means, and the source
   material itself already says the same thing with a plainer word in
   four other places ("a working formulation, not a universal cause").
   Three lines used "framework" where the rest of the table uses "working"
   or nothing, and they are brought in line with the table's own other
   wording, not rewritten:
     Collapse.triggerMechanism   "a framework hypothesis" to "a working
                                 hypothesis"
     Dysregulation.impact        "a descriptive framework aid" to "a
                                 descriptive aid"
     Dissociation.triggerMechanism "this framework label" to "this label"
   Checked: python3 .claude/skills/atuned-voice/check.py --line, on all
   thirty six fields across the six families, before and after. Three hard
   failures on the word framework, all three on these lines, none anywhere
   else. Zero after.
   ============================================================ */
var HCXCARD={
 grandiosity:{
  behavior:'May appear as superiority claims, status-seeking, special-rule expectations, dismissal of feedback, or using admiration to stabilize self-worth.',
  triggerMechanism:'Possible triggers include perceived disrespect, criticism, loss of status, shame, or a threat to the preferred self-image. This is a working formulation, not a universal cause.',
  livedExample:'After receiving corrective feedback, a person dismisses the source as inferior and insists ordinary standards do not apply to them.',
  impact:'Can impair reciprocity, learning, trust, and accountability when the pattern dominates; assess observable behavior and context rather than assigning an identity.',
  practice:'Describe the observable event without ranking people; identify the threatened need; invite disconfirming evidence; acknowledge one specific contribution or boundary from another person.',
  inverseName:'Grounded Mutual Worth',
  inverseDefinition:'An inferred counterpart emphasizing stable self-respect without superiority: equal human worth, realistic appraisal, openness to feedback, and respect for others’ agency.'},
 predatory:{
  behavior:'May include cold strategic pressure, exploitation, concealment of intent, treating people as obstacles, or planning actions without regard for harm.',
  triggerMechanism:'May be activated by a perceived obstacle, rival, threat, or desired gain. This describes a possible pattern, not a diagnosis or a claim about any person.',
  livedExample:'A person quietly plans how to remove a rival and evaluates only whether the plan will succeed, not the foreseeable harm.',
  impact:'Can create significant relational or physical risk. Prioritize concrete behavior, boundaries, and safety; do not infer this mode from a label alone.',
  practice:'Stop the harmful action; state the intended outcome and who could be affected; assess consent and foreseeable harm; choose a lawful, transparent alternative and seek appropriate support if safety is at risk.',
  inverseName:'Protective, Consensual Agency',
  inverseDefinition:'An inferred counterpart that pursues legitimate goals transparently while respecting consent, safety, rights, and the other party’s independent interests.'},
 collapse:{
  behavior:'May appear as shutdown, giving up, passivity, inability to initiate, or treating a difficult state as proof that no useful action is possible.',
  triggerMechanism:'Possible triggers include overwhelm, repeated perceived failure, threat, exhaustion, or loss. The label is a working hypothesis and must not be used to infer a medical condition.',
  livedExample:'After a setback, a person stops seeking options and concludes that no action can change the outcome.',
  impact:'May narrow problem-solving and access to support. Similar outward behavior can have many causes, so assess context and needs rather than pathologizing it.',
  practice:'Reduce the task to one safe, observable next step; identify available support; distinguish present constraints from global conclusions; seek professional care when distress is severe or persistent.',
  inverseName:'Supported Re-engagement',
  inverseDefinition:'An inferred counterpart emphasizing grounded support, small feasible actions, restored choice, and realistic hope without denying pain or constraints.'},
 unbending:{
  behavior:'May appear as all-or-nothing standards, repeated insistence on one correct method, intolerance of ambiguity, or prioritizing control over adaptation.',
  triggerMechanism:'Possible triggers include uncertainty, perceived disorder, mistakes, or threat to predictability. These are hypotheses to test, not assumed causes.',
  livedExample:'A plan no longer fits the situation, but a person insists on following it because changing course feels unacceptable.',
  impact:'Can impair adaptation, collaboration, and repair; structure itself is not the problem unless it overrides evidence, context, or people’s needs.',
  practice:'Name the purpose behind the rule; list what has changed; generate two safe alternatives; retain the principle while adapting the method.',
  inverseName:'Flexible Integrity',
  inverseDefinition:'An inferred counterpart that preserves values and accountability while adapting methods to evidence, context, and legitimate needs.'},
 dysregulation:{
  behavior:'May include rapid escalation, abrupt shifts, impulsive action, or difficulty returning to baseline after activation; record the actual observed behavior.',
  triggerMechanism:'Activation can be shaped by stress, unmet needs, threat, sleep, environment, and other factors. Do not assume a single cause or diagnosis.',
  livedExample:'During conflict, activation rises quickly and the person acts before checking the facts or considering consequences.',
  impact:'Can strain relationships and decision-making. This record is a descriptive aid, not a substitute for assessment of medical or mental-health concerns.',
  practice:'Pause when safe; orient to immediate facts; reduce stimulation; use a practiced grounding or regulation skill; revisit the decision after activation decreases.',
  inverseName:'Regulated Responsiveness',
  inverseDefinition:'An inferred counterpart emphasizing awareness of activation, proportionate response, recovery, and deliberate choice without suppressing legitimate emotion.'},
 dissociation:{
  behavior:'Possible signs can include feeling detached, emotionally distant, unreal, or disconnected from the present; these signs are nonspecific and should not be used to diagnose dissociation.',
  triggerMechanism:'Dissociative experiences can have multiple causes and require careful contextual assessment. Do not presume trauma, disorder, or a specific mechanism from this label.',
  livedExample:'In a stressful interaction, a person reports feeling distant from the situation and has difficulty staying connected to what is happening.',
  impact:'May affect presence, communication, and recall. If symptoms are recurrent, distressing, or impairing, recommend assessment by a qualified health professional.',
  practice:'Use a gentle present-orientation exercise if welcome and safe; invite the person to notice current surroundings and choices; avoid forcing recall or exposure; seek qualified support for persistent symptoms.',
  inverseName:'Integrated Present Connection',
  inverseDefinition:'An inferred counterpart emphasizing safe contact with present experience, continuity between feeling and action, and paced integration without forcing or denying experience.'}};
