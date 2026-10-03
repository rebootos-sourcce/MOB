/* ============================================================
   THE LEXICON PATCH, AS A PROPOSAL AND AS A MEASUREMENT.

   The ninety day run measured that the shipped sniffer reads nothing out of 19
   of the 41 ordinary sentences in sim/stories.js, and that where it does read
   it frequently offers an address carrying `inferred` which the panel then
   prints as a finding. That is two of the five worst sticking points, F1 at 68
   people lost of a thousand and F2 at 13, and between them 614 encounters.

   A proposal to "improve the sniffer" is a wish. This is the change instead:
   one entry a miss, each one a phrase, a seat, an amount and the address it
   states outright. LEX already carries a third element for exactly this, added
   when the owner ruled that exhaustion sits at the solar plexus and is not
   anger, and thirty entries already use it.

   Nothing here is asserted to work. sim/lexcheck.js applies this patch to the
   shipped LEX in memory, runs the shipped parseStory over the same bank, and
   reports the read rate and the inferred rate before and after. The harness
   consumes that measurement and never this file's intentions.

   Where it lands in the product: atuned_src/engine/data/lex.js, as data.
   ============================================================ */

/* key => [seat, amount, stated address]. The seats are the lowercase keys the
   artwork uses. The addresses are the nine LEX already states. */
const PATCH={
 /* Diane. Both of her signature lines read nothing. */
 'nothing to show':            ['sacral',24,'Shame'],
 'moral failure':              ['sacral',26,'Shame'],
 /* Derek. A decline he cannot explain, and pain held as information. */
 'nothing in the data explains':['solar',22,'Anticipation'],
 'pain is information':        ['throat',24,'Apathy'],
 'stress fracture':            ['root',22,'Fear'],
 /* Marcus. The judgement, the sabotage and the disgust. */
 'what is wrong with anything':['crown',24,'Shame'],
 'killed a good idea':         ['crown',26,'Shame'],
 'disgusted by':               ['sacral',26,'Disgust'],
 /* Angela. The search, the pattern and the caretaking. */
 'still looking for':          ['solar',22,'Anticipation'],
 'keep choosing the same':     ['sacral',22,'Disgust'],
 'tired of being the one':     ['throat',24,'Apathy'],
 /* Sofia. Held nobody, held by nobody, and the car. */
 'hold the room':              ['throat',22,'Apathy'],
 'not been held':              ['heart',26,'Sad'],
 'sat in the car':             ['heart',22,'Sad'],
 'cannot read myself':         ['eye',24,'Shock'],
 /* James. The cold, and the cost paid on purpose. */
 'find that cold':             ['throat',26,'Apathy'],
 'do it anyway':               ['throat',24,'Apathy'],
 /* Ana. Inside it, with no far side. */
 'cannot see the far side':    ['eye',26,'Shock'],
 /* Gordon. Denial is a reading, and it is the largest one in the roster. */
 'nothing wrong with me':      ['crown',26,'Shame'],
 'do not have a problem':      ['crown',24,'Shame'],
 /* AND THE SECOND HALF, WHICH IS THE OTHER DEFECT. These words already fire.
    They fire without stating an address, so the address is chosen by the seat's
    modal fallback and the imprint comes back carrying `inferred`, which the
    panel prints as a finding. "I am ashamed of how long this is taking" is
    answered with Pride, Arrogance, Competition. Stating the address is the
    same one line change as above. */
 'ashamed of':                 ['sacral',26,'Shame'],
 'i lied':                     ['sacral',24,'Shame'],
 'not apologised':             ['sacral',22,'Shame'],
 'not apologized':             ['sacral',22,'Shame'],
 'felt nothing':               ['throat',26,'Apathy'],
 'shoulders are up':           ['solar',22,'Anger'],
 'chest is tight':             ['heart',24,'Fear'],
 'jaw is tight':               ['solar',22,'Anger'],
 'have not slept':             ['root',24,'Fear'],
 'happens for a reason':       ['crown',22,'Apathy'],
 'worse now than':             ['heart',26,'Sad'],
 'he died':                    ['heart',28,'Sad']};

module.exports={PATCH:PATCH, count:Object.keys(PATCH).length};
