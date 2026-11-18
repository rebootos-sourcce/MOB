/* Must pass. Every host word below is inside a comment, a string or the
   literal text of a template, none in code: document, window, fetch,
   WebSocket, indexedDB, globalThis. */
var GL={"t":"window","d":"a window of tolerance, document it"};
var a='fetch the localStorage of the navigator';
var b=`a window you don't open, it isn't ${1+2} wide`;
var c=`nested ${`inner window ${String(4)}`} document`;
var d=`
 a multi line template naming WebSocket and indexedDB and globalThis
`;
// whole line comment naming EventSource and importScripts
function leanAdmit(self,other){ return self+other; }
var ob={send:null}; function obBind(send){ ob.send=send; }
var e=`${ {a:1}.a }`;
