function JASMCompiler() {
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
				lineWithoutGarbage = lineWithoutGarbage.trim();
				if(lineWithoutGarbage != undefined) result.push(lineWithoutGarbage);
			}
		}
		return result;
	};

	this.isLabel = function(line) {
		return line.charAt(line.length-1) == ':' && line.indexOf(' ') == -1;
	};

	this.isSuperCommand = function(line, superCommands) {
		command = line.split(' ')[0].toLowerCase();
		return command == 'dd';
	};

	this.compile = function(code) {
		codeLines = this.removeGarbage(code);

		memory = [];
		labels = new Labels();

		address = 0;
		for(var index in codeLines) {
			line = codeLines[index];
			if(!this.isLabel(line)) {
				if(!this.isSuperCommand(line)) {
					memory.push(new CommandMemory(line));
					address++;
				} else {
					data = DefineData(line);
					for(var i in data) {
						memory.push(data[i]);
						address++;
					}
				}
			} else {
				labelName = line.substr(0, line.length-1);
				if(!labels.hasLabel(labelName)) {
					labels.labels.push(new Label(labelName, address));
				} else throw new CodeErrorException("Label ["+labelName+"] already exists.", index);
			}
		}

		return {
			Memory: memory,
			Labels: labels
		};
	};
}

function CodeErrorException(message, line) {
	this.message = message;
	this.line = line;
}

function CommandMemory(memory) {
	this.type = "com";
	this.memory = memory;
}

function NumberMemory(memory) {
	this.type = "num";
	this.memory = new SizedBitSet(16).setTo(memory);
}

function Labels() {
	this.labels = [];
	this.hasLabel = function(name) {
		for(var index in this.labels) {
			if(this.labels[index].name == name) return true;
		}
		return false;
	}
}

function Label(name, address) {
	this.name = name;
	this.address = address;
}

function DefineData(line)
{
	lineRes = line.substr(2, line.length-2).split(',').map(function(e){
		return e.trim();
	});

	res = [];
	textOperator = new TextOperator();

	for(var index in lineRes) {
		line = lineRes[index];
		if(textOperator.isText(line)) {
			text = line.substr(1, line.length-2);
			for(var i in text) {
				toAdd = new NumberMemory(parseInt(text.charCodeAt(i), 10));
				res.push(toAdd);
			}
		}
		else if(textOperator.isCharacter(line)) {
			sign = line.substr(1, line.length-2).charCodeAt(0);
			toAdd = new NumberMemory(parseInt(sign, 10));
			res.push(toAdd);
		}
		else {
			toAdd = new NumberMemory(parseInt(line, 10));
			res.push(toAdd);
		}
	}

	return res;
}

function TextOperator() {
	this.isText = function(line) {
		return line.charAt(0) == '"' && line.charAt(line.length-1) == '"';
	};

	this.isCharacter = function(line) {
		return line.charAt(0) == "'" && line.charAt(line.length-1) == "'" && line.length == 3;
	}
}