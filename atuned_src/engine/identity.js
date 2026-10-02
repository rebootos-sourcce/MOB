/* ============================================================
   WHO A PERSON SAYS THEY ARE, AT THE DOOR. Round OT, his words: "We don't
   want people to log in by email. We want them to log in by their username.
   So when they create their account, they can set up by username." Round OX
   ruled the bounds: "Username 3 to 20 is great."

   This file is only the shape of the thing a person types into the one
   identifier field. It makes no request and holds no account, and it cannot:
   the engine has no host. What goes over the wire, and which route takes it,
   is ui/auth.js's authIdent, which asks this file what kind of thing was
   typed so the two cannot disagree about it.

   THE KIND IS DECIDED BY ONE CHARACTER, AND THAT IS ON PURPOSE. A username
   may not contain an at sign (the shape below has no room for one), and an
   email always does, so the presence of one is a complete test and a person
   never has to say which they are typing. It is also the reason the existing
   email sign in needs no change at all: everything that carried an at sign
   before still does, and still goes where it went.

   THE BOUNDS ARE HERE AND NOWHERE ELSE. The card prints them in its hint and
   its refusal off these two numbers, so a ruling that moves them moves the
   screen. A count typed into a sentence is the defect this repository has
   recorded a dozen times, and a hint that says "3 to 20" in a string is the
   next one waiting.

   A USERNAME IS LOWER CASE BECAUSE A PHONE CAPITALISES THE FIRST LETTER.
   identNorm folds case on a username before anything is checked or sent, so
   "Mika" typed on a phone reaches the server as the "mika" the person chose,
   rather than being refused for a capital they never meant. An email is left
   exactly as typed: its case is the server's business, as it always was.
   ============================================================ */
var USERNAME_MIN=3, USERNAME_MAX=20;
/* the whole rule in one class: lower case letters, digits, underscore and
   hyphen. No dot, no space and no at sign. The mockup's "mika.salas" was a
   draft; the ruling has no dot in it, and a dot would also have let a
   username look like the start of an email address. */
var USERNAME_SHAPE=/^[a-z0-9_-]+$/;
/* 'email' when an at sign is present, 'username' for anything else, and ''
   for nothing at all, so an empty field is its own answer and not a kind. */
function identKind(s){
 s=String(s==null?'':s).trim();
 if(!s) return '';
 return s.indexOf('@')>=0?'email':'username';}
/* what is sent and checked: trimmed always, and folded to lower case only for
   a username. */
function identNorm(s){
 s=String(s==null?'':s).trim();
 return identKind(s)==='username'?s.toLowerCase():s;}
/* '' when the username is acceptable, one plain sentence when it is not. The
   sentence states the whole rule at once, because a person told only that
   they are too short will next be told that an underscore is not allowed, and
   a refusal that arrives in installments is a refusal that costs three
   presses. It is checked after identNorm, so capitals never reach it. */
function usernameWhy(s){
 s=identNorm(s);
 if(!s) return 'Enter a username.';
 if(s.length<USERNAME_MIN||s.length>USERNAME_MAX||!USERNAME_SHAPE.test(s))
  return usernameRule();
 return '';}
/* the rule as a sentence, for the hint under the field, so the hint and the
   refusal are one string and cannot say two different bounds */
function usernameRule(){
 return 'A username is '+USERNAME_MIN+' to '+USERNAME_MAX+' characters: lower case letters, digits, underscore and hyphen.';}
