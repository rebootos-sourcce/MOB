/* ============================================================
   THE STORY BANK.

   Forty one lines of ordinary first person writing, five or six for each
   figure in the cohort, written in that figure's voice off their `says` line
   in engine/data/people.js and their psychographic in RESEARCH-icp.md.

   WRITTEN BEFORE THE LEXICON WAS CONSULTED, deliberately. The point of this
   bank is to measure what the shipped sniffer reads out of the sentences these
   people would actually type, not to hand it sentences built from its own
   vocabulary. Nothing here was tuned to make a number better. harness.js
   reports the share of these lines that return no loadable address, and that
   share is a finding rather than a fault of the bank.

   A line is tagged with the reason the person was at the box: what made them
   open it that day. The harness draws from the reason, not at random.
   ============================================================ */
const STORYBANK={
 Diane:[
  ['status', 'I worked until eleven again and I have nothing to show anyone for it.'],
  ['status', 'Rest feels like a moral failure. I said that out loud in a board meeting and nobody blinked.'],
  ['pressure','Payroll is Friday and I have not told anyone how close it is. My jaw is tight from the moment I wake up.'],
  ['pressure','I am terrified the round does not close and I am the only one who knows.'],
  ['crack',  'I snapped at my cofounder in front of the team and I have not apologised.'],
  ['crack',  'I am exhausted and I cannot stop. Those two things are the same sentence now.']],
 Derek:[
  ['output', 'My last three sessions were slower and nothing in the data explains it.'],
  ['output', 'Pain is information. I have raced on a stress fracture and I would do it again.'],
  ['body',   'My shoulders are up by my ears before I even start. My chest is tight on the warm up.'],
  ['body',   'I have not slept properly in eleven days and I am still training twice a day.'],
  ['crack',  'I am angry all the time and there is nothing to be angry at.'],
  ['crack',  'I am numb through the last ten percent and I used to feel everything there.']],
 Marcus:[
  ['judge',  'I can see what is wrong with anything in four seconds. It has cost me two studios.'],
  ['judge',  'I killed a good idea today because it was not mine and I knew I was doing it.'],
  ['crack',  'I am ashamed of how I spoke to the junior and I will not bring it up tomorrow.'],
  ['crack',  'I lied about the timeline. Again. It is easier than the conversation.'],
  ['flat',   'Nothing I made this year interests me. I am disgusted by all of it.']],
 Angela:[
  ['feel',   'Everything happens for a reason. I have said that at three funerals and I believed it each time.'],
  ['feel',   'I am sad in a way that does not attach to anything and it has been weeks.'],
  ['seek',   'I have done six modalities and I am still looking for the one that lands.'],
  ['seek',   'I want to know why I keep choosing the same kind of person.'],
  ['crack',  'I am so tired of being the one who understands everybody else.'],
  ['crack',  'I am afraid that this is just who I am now.']],
 Sofia:[
  ['night',  'I hold the room for everyone. I have not been held in four years and I would not know how to ask.'],
  ['night',  'The last client left at nine and I sat in the car for twenty minutes before I drove home.'],
  ['client', 'I can read my clients in a minute and I cannot read myself at all.'],
  ['crack',  'I am angry with a client and that has never happened before. I am ashamed of it.'],
  ['crack',  'I am exhausted in a way that sleep does not touch.']],
 James:[
  ['number', 'I make the call and I sleep fine. People find that cold. It is what they hired.'],
  ['number', 'Third turnaround. I know exactly what it costs and I do it anyway.'],
  ['crack',  'I felt nothing when we let forty people go and that is the part that frightens me.'],
  ['crack',  'My chest is tight in every meeting and I have told no one, including my doctor.'],
  ['flat',   'I am numb. I have been numb since the second company and I called it discipline.']],
 Ana:[
  ['night',  'I am in the middle of something and I cannot see the far side of it.'],
  ['night',  'It is two in the morning and I am terrified and I do not know what of.'],
  ['grief',  'He died a year ago and I am worse now than I was in the first month.'],
  ['grief',  'I am ashamed of how long this is taking. Everyone has moved on and I have not.'],
  ['crack',  'I have not slept. I sat in the car outside work for half an hour.']],
 Gordon:[
  ['deny',   'There is nothing wrong with me. Four people left in a year and each had their reasons.'],
  ['deny',   'I do not have a problem. I have a business that needs running.']],
 Rosa:[
  ['none',   'Nothing in particular. Things do not sit on me the way they used to.']]};
if(typeof module!=='undefined')module.exports={STORYBANK:STORYBANK};
