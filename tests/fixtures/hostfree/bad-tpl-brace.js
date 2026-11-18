/* a brace inside the slot must not end it early */
var x=`${(function(){return 1;})()+navigator.language}`;
