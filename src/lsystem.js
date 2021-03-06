// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
var Node = {
	symbol : '',
	nextNode : null,
	prevNode : null
};

function LinkedList(){
	this.head = null;
	this.tail = null;
	this.push = function(val) {
		if (!this.head) {
			this.head = {symbol: val, nextNode: null, prevNode: null};
			this.tail = this.head;
		} else if (this.head == this.tail) {
			var newNode = {symbol: val, nextNode: null, prevNode: this.head};
			this.head.nextNode = newNode;
			this.tail = newNode;
		} else {
			var newNode = {symbol: val, nextNode: null, prevNode: this.tail};
			this.tail.nextNode = newNode;
			this.tail = newNode;
		}
	};
};

// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	for (var i = 0; i < input_string.length; i++) {
		ll.push(input_string.charAt(i));
	}
	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var node = linkedList.head;
	var result = '';

	while (node) {
		result = result.concat(node.symbol);
		node = node.nextNode;
	}
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	var replacementList = stringToLinkedList(replacementString);
	if (linkedList.head == linkedList.tail == node) {
		linkedList = replacementList;
	}
	else if (linkedList.head == node) {
		var next = node.next;
		linkedList.head = replacementList.head;
		next.prevNode = replacementList.tail;
		replacementList.tail.next = next;
	} 
	else if (linkedList.tail == node) {
		var prev = node.prevNode;
		linkedList.tail = replacementList.tail;
		prev.nextNode = replacementList.head;
		replacementList.head.prevNode = prev;
	} else {
		var next = node.nextNode;
		var prev = node.prevNode;
		next.prevNode = replacementList.tail;
		replacementList.tail.nextNode = next;

		prev.nextNode = replacementList.head;
		replacementList.head.nextNode = prev;
	}
	return replacementList.tail.next;
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FX";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(1.0, '[-FX][+FX]')
	];
	this.iterations = 0; 
	
	// Set up the axiom string
	if (typeof axiom !== "undefined") {
		this.axiom = axiom;
	}

	// Set up the grammar as a dictionary that 
	// maps a single character (symbol) to a Rule.
	if (typeof grammar !== "undefined") {
		this.grammar = Object.assign({}, grammar);
	}
	
	// Set up iterations (the number of times you 
	// should expand the axiom in DoIterations)
	if (typeof iterations !== "undefined") {
		this.iterations = iterations;
	}

	// A function to alter the axiom string stored 
	// in the L-system
	this.updateAxiom = function(axiom) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}

	this.updateString = function(n) {
		var stringResult = this.axiom;

		for (var i = 0; i < n; i++) {
			var newString = '';
			for (var j = 0; j < stringResult.length; j++) {
				var currentChar = stringResult.charAt(j);
				if (this.grammar[currentChar]) {
					newString = newString.concat(this.grammar[currentChar][0].successorString);
				} else {
					newString = newString.concat(currentChar);
				}
			}
			stringResult = newString;
		}

		// console.log(stringResult);
		return stringResult;
	}


	// TODO
	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	

		var lSystemLL = stringToLinkedList(this.updateString(n));

		return lSystemLL;
	}
}