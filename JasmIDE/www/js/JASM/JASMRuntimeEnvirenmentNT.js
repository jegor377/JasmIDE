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

	// returns ProgramData
	this.compile = function(code) {
		codeLines = this.removeGarbage(code);

		memory = new Memory();
		labels = new Labels();

		address = 0;
		for(var index in codeLines) {
			line = codeLines[index];
			if(!this.isLabel(line)) {
				if(!this.isSuperCommand(line)) {
					memory.pushMemory(new CommandMemory(line));
					address++;
				} else {
					data = DefineData(line);
					for(var i in data) {
						memory.pushMemory(data[i]);
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
		memory.pushMemory(new NumberMemory(1));

		return {
			Memory: memory,
			Labels: labels,
			SpStart: memory.memory.length-1
		};
	};
}

function JASMRuntimeEnvironment() {
	this.programEnvironment = {
		registers: new Registers(),
		mnemonics: new FMnemonics(),
		programData: null
	};

	this.run = function(ProgramData) {
		this.programEnvironment.programData = ProgramData;

		maxMemorySize = 65535; // beqause 2^16 = 65536, but we count from 0, so it's 65535
		minMemorySize = 0;

		this.programEnvironment.registers.setRegisterByName('sp', 
			new SizedBitSet(16).setTo(setArchitectureAddressToRelativeAddress(this.programEnvironment.programData.SpStart)), true);

		this.setIP(new SizedBitSet(16).setTo(maxMemorySize));

		ip = this.getIP();
		while(ip.parseDec() > minMemorySize)
		{
			comAddress = setAddressToMemoryArchitectureAddress(ip.parseDec());
			try
			{
				this.invokeMnemonicByMemory(comAddress);
				this.manageSpRegister();
				this.decrementIP();
				ip = this.getIP();
				console.log(comAddress);
			}
			catch(e) {
				throw new CodeErrorException(e.message, comAddress);
			}
		}
	};

	this.manageSpRegister = function() {
		sp = setArchitectureAddressToRelativeAddress(this.programEnvironment.registers.getRegisterByName('sp', true).parseDec());
		if(sp < this.programEnvironment.programData.Memory.memory.length-1) {
			this.programEnvironment.programData.Memory.memory = this.programEnvironment.programData.Memory.memory.slice(0, sp+1);
		}
	};

	this.decrementIP = function() {
		oldValue = this.programEnvironment.registers.getRegisterByName('ip', true);
		toAdd = new SizedBitSet(16).setTo(1);
		newAddress = oldValue.sub(toAdd);
		this.programEnvironment.registers.setRegisterByName('ip', newAddress, true);
	};

	this.setIP = function(newValue) {
		this.programEnvironment.registers.setRegisterByName('ip', newValue, true);
	};
	
	this.getIP = function() {
		return this.programEnvironment.registers.getRegisterByName('ip', true);
	};

	this.invokeMnemonicByMemory = function(memAddress) {
		code = this.programEnvironment.programData.Memory.getMemory(memAddress);
		try
		{
			if(code.type == "com") {
				mnemonic = this.programEnvironment.mnemonics.getMnemonicByLine(code.memory);
				mnemonic.doOperation(code.memory, this.programEnvironment);
			} else throw new CodeErrorException("The memory is not a command. Cannot to perform this data.", null);
		}
		catch(e)
		{
			throw new CodeErrorException(e.message, null);
		}
	};
}

function Memory() {
	this.memory = [];
	this.pushMemory = function(memory) {
		this.memory.push(memory);
	};

	this.popMemory = function() {
		return this.memory.pop();
	};

	this.setMemory = function(mem, address) {
		this.memory[address] = mem;
	};

	this.getMemory = function(address) {
		return this.memory[address] == undefined ? new NumberMemory(0) : this.memory[address];
	};
}

function Registers() {
	this.registers = [
		new RegisterAX(),
		new RegisterBX(),
		new RegisterCX(),
		new RegisterDX(),
		new RegisterSP(),
		new RegisterBP(),
		new RegisterSI(),
		new RegisterDI(),
		new RegisterFLAGS(),
		new RegisterIP()
	];

	this.getRegisterByName = function(name, priority) {
		for(var regIndex in this.registers) {
			register = this.registers[regIndex];
			for(var nameIndex in register.name) {
				if(register.name[nameIndex] == name) {
					if(priority) {
						return register.getMemory(name);
					} else {
						if(!register.isShared) throw new CodeErrorException("Cannot get data from ["+name+"] register.");
						return register.getMemory(name);
					}
				}
			}
		}
		return null;
	}

	this.setRegisterByName = function(name, memory, priority) {
		for(var regIndex in this.registers) {
			register = this.registers[regIndex];
			for(var nameIndex in register.name) {
				if(register.name[nameIndex] == name) {
					if(priority) {
						return this.registers[regIndex].setMemory(name, memory);
					} else {
						if(!register.isShared) throw new CodeErrorException("Cannot set data in ["+name+"] register.");
						return this.registers[regIndex].setMemory(name, memory);
					}
				}
			}
		}
		return null;
	}
}

function Devices() {
	this.devices = [
		new DeviceDecSendOutput(),
		new DeviceSignedDecSendOutput(),
		new DeviceCharSendOutput(),
		new DeviceDecOutput(),
		new DeviceSignedDecOutput(),
		new DeviceCharOutput(),
		new DeviceDecInput(),
		new DeviceSignedDecInput(),
		new DeviceStringInput()
	];
	this.setting = {
		buffers : {
			input : "",
			output : ""
		},
		streams : {
			outputElement : null,
			inputElement : null
		}
	};

	this.inDevice = function(memory, information, port) {
		returnMemory = memory;
		if(port >= 0 && port < this.devices.length) {
			result = this.devices[port].in(memory, information, this.setting);
			this.setting = result.Setting;
			returnMemory = result.Memory;
		}
		return returnMemory;
	};

	this.outDevice = function(memory, information, port) {
		returnMemory = memory;
		if(port >= 0 && port < this.devices.length) {
			result = this.devices[port].out(memory, information, this.setting);
			this.setting = result.Setting;
			returnMemory = result.Memory;
		}
		return returnMemory;
	};
}

function DeviceDecSendOutput() {
	this.in = function(memory, information, setting) {
		setting.buffers.output += information.parseDec().toString();
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information) {
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function DeviceSignedDecSendOutput() {
	this.in = function(memory, information, setting) {
		setting.buffers.output += information.parseSignedDec().toString();
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information) {
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function DeviceCharSendOutput() {
	this.in = function(memory, information, setting) {
		setting.buffers.output += information.parseDec() == 10 ? '<br/>' : String.fromCharCode(information.parseDec());
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information, setting) {
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function DeviceDecOutput() {
	this.in = function(memory, information, setting) {
		if(setting.streams.outputElement != null)
		{
			setting.streams.outputElement.innerHTML = setting.streams.outputElement.innerHTML + setting.buffers.output;
			setting.buffers.output = "";
		} else throw new CodeErrorException("There is no output element pinned.");
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information, setting) {
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function DeviceSignedDecOutput() {
	this.in = function(memory, information, setting) {
		if(setting.streams.outputElement != null)
		{
			setting.streams.outputElement.innerHTML = setting.streams.outputElement.innerHTML + 
				(setting.buffers.output.charAt(0) != '-' ? parseInt(setting.buffers.output, 10) : parseInt(setting.buffers.output, 10)*-1).toString();
			setting.buffers.output = "";
		} else throw new CodeErrorException("There is no output element pinned.");
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information, setting) {
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function DeviceCharOutput() {
	this.in = function(memory, information, setting) {
		if(setting.streams.outputElement != null)
		{
			setting.streams.outputElement.innerHTML = setting.streams.outputElement.innerHTML + setting.buffers.output;
			setting.buffers.output = "";
		} else throw new CodeErrorException("There is no output element pinned.");
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information, setting) {
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function DeviceStringInput() {
	this.in = function(memory, information, setting) {
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information, setting) {
		if(setting.buffers.input.length > 0) {
			text = setting.buffers.input;
			console.log(memory.memory.length);
			for(var index in text) {
				data = new NumberMemory(text.charCodeAt(index));
				address = information.parseDec()+parseInt(index, 10);
				memory.setMemory(data, address);
			}
			console.log(memory.memory.length);
			setting.buffers.input = "";
		}
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function DeviceDecInput() {
	this.in = function(memory, information, setting) {
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information, setting) {
		mem = new NumberMemory(parseDec(setting.buffers.input, 10));
		memory.setMemory(mem, information.parseDec());
		setting.buffers.input = "";
		return memory;
	};
}

function DeviceSignedDecInput() {
	this.in = function(memory, information, setting) {
		return {
			Memory: memory,
			Setting: setting
		};
	};

	this.out = function(memory, information, setting) {
		mem = new NumberMemory(parseInt(setting.buffers.input, 10)*(setting.buffers.input.charAt(0)=='-' ? -1 : 1));
		memory.setMemory(mem, information.parseDec());
		setting.buffers.input = "";
		return {
			Memory: memory,
			Setting: setting
		};
	};
}

function RegisterAX() {
	this.name = [
		'ax',
		'ah',
		'al'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'ax') return this.memory;
		else if(name == 'al') return this.memory.getRange(0, 8);
		else if(name == 'ah') return this.memory.getRange(8, 16);
	};

	this.setMemory = function(name, memory) {
		if(name == 'ax') this.memory = this.memory.clear().add(memory);
		else if(name == 'al') this.memory = this.memory.pastePos(memory, 0);
		else if(name == 'ah') this.memory = this.memory.pastePos(memory, 8);
	};
}

function RegisterBX() {
	this.name = [
		'bx',
		'bh',
		'bl'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'bx') return this.memory;
		else if(name == 'bl') return this.memory.getRange(0, 8);
		else if(name == 'bh') return this.memory.getRange(8, 16);
	};

	this.setMemory = function(name, memory) {
		if(name == 'bx') this.memory = this.memory.clear().add(memory);
		else if(name == 'bl') this.memory = this.memory.pastePos(memory, 0);
		else if(name == 'bh') this.memory = this.memory.pastePos(memory, 8);
	};
}

function RegisterCX() {
	this.name = [
		'cx',
		'ch',
		'cl'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'cx') return this.memory;
		else if(name == 'cl') return this.memory.getRange(0, 8);
		else if(name == 'ch') return this.memory.getRange(8, 16);
	};

	this.setMemory = function(name, memory) {
		if(name == 'cx') this.memory = this.memory.clear().add(memory);
		else if(name == 'cl') this.memory = this.memory.pastePos(memory, 0);
		else if(name == 'cl') this.memory = this.memory.pastePos(memory, 8);
	};
}

function RegisterDX() {
	this.name = [
		'dx',
		'dh',
		'dl'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'dx') return this.memory;
		else if(name == 'dl') return this.memory.getRange(0, 8);
		else if(name == 'dh') return this.memory.getRange(8, 16);
	};

	this.setMemory = function(name, memory) {
		if(name == 'dx') this.memory = this.memory.clear().add(memory);
		else if(name == 'dl') this.memory = this.memory.pastePos(memory, 0);
		else if(name == 'dl') this.memory = this.memory.pastePos(memory, 8);
	};
}

function RegisterSP() {
	this.name = [
		'sp'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'sp') return this.memory;
	};

	this.setMemory = function(name, memory) {
		if(name == 'sp') this.memory = this.memory.clear().add(memory);
	};
}

function RegisterBP() {
	this.name = [
		'bp'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'bp') return this.memory;
	};

	this.setMemory = function(name, memory) {
		if(name == 'bp') this.memory = this.memory.clear().add(memory);
	};
}

function RegisterSI() {
	this.name = [
		'si'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'si') return this.memory;
	};

	this.setMemory = function(name, memory) {
		if(name == 'si') this.memory = this.memory.clear().add(memory);
	};
}

function RegisterDI() {
	this.name = [
		'di'
	];
	this.isShared = true;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'di') return this.memory;
	};

	this.setMemory = function(name, memory) {
		if(name == 'di') this.memory = this.memory.clear().add(memory);
	};
}

function RegisterFLAGS() {
	this.name = [
		'flags'
	];
	this.isShared = false;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'flags') return this.memory;
	};

	this.setMemory = function(name, memory) {
		if(name == 'flags') this.memory = this.memory.clear().add(memory);
	};
}

function RegisterIP() {
	this.name = [
		'ip'
	];
	this.isShared = false;
	this.memory = new SizedBitSet(16);

	this.getMemory = function(name) {
		if(name == 'ip') return this.memory;
	};

	this.setMemory = function(name, memory) {
		if(name == 'ip') this.memory = this.memory.clear().add(memory);
	};
}

function CodeErrorException(message, line, isRegisterException) {
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

	this.getLabel = function(name) {
		for(var index in this.labels) {
			if(this.labels[index].name == name) return this.labels[index];
		}
		return null;
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