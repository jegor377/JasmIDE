function JASMCompiler() {
	this.hasError = false;
	this.errorMessage = "";

	this.removeGarbage = function(data) {
		result = [];
		lines = data.split('\n');
		for(var index in lines) {
			if(lines[index] != "") {
				lineWithoutGarbage = lines[index];
				lineWithoutGarbage = lineWithoutGarbage.replace("\t", '').replace("\r", '');
				quote = lineWithoutGarbage.indexOf(';');
				if(quote != -1) {
					lineWithoutGarbage = lineWithoutGarbage.substr(0, quote);
				}
				lineWithoutGarbage = removeCharWhileIsDontLetter(lineWithoutGarbage, ' ');
				if(lineWithoutGarbage != undefined) result.push(lineWithoutGarbage);
			}
		}
		return result;
	};

	this.isLabel(line) {
		hasSpecificChar = line.indexOf(':') == -1;
		return hasSpecificChar;
	};

	this.compile = function(code) {
		codeLines = this.removeGarbage(code);

		Labels = [];
		Opcodes = [];

		for(var index in codeLines) {
			if(!this.isLabel(codeLines[index])) {
				line = codeLines[index];
				try
				{
					mnemonicsBase = new FMnemonics();
					opcodeCreator = mnemonicsBase.getMnemonicByLine(line);
					if(opcodeCreator == null) throw new CompilationErrorException(
						"Cannot compile line ["+line+"], because there is not any command like that.", index);

					opcode = opcodeCreator.getOpcode(line);
					opcode.line = index;
					Opcodes.push(opcode);
				}
				catch(e)
				{
					throw new CompilationErrorException(e.message, index);
				}
			}
		}
	};
}

function JASMRunner() {
	this.run = function(opcodes) {
		;
	};
}

function CompilationErrorException(message, line) {
	this.message = message;
	this.line = line;
}

function Label(name, line) {
	this.name = name;
	this.line = line;
	this.adress = 0;
}

function Opcode() {
	this.bitset = new BitSet;

}

function removeCharWhileIsDontLetter(text, ch) {
	res = text;
	for(var index in text)
	{
		if(text.charAt(index) == ch) res = text.substring(index+1);
		else return res;
	}
}