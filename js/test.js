convertToFunc = function( string ) {
	//takes a string and converts it to a function
	var functionBody = string.slice(string.indexOf("{") + 1, string.length - 1),
		functionArgs = string.slice(string.indexOf("(") + 1, string.indexOf(")")),
		newFunc = new Function([functionArgs], functionBody);

		return newFunc;
}