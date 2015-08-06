
'use strict';

var container = document.getElementById('yaflo');
var yaflo = new Yaflo({
	container: container
});

var state1 = yaflo.createState();
var state2 = yaflo.createState();

var transition = state1.linkTo(state2);
transition.createCondition('count == 1');
transition.createCondition('1 == 3');
yaflo.select(yaflo);
