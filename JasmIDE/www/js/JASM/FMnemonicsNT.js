function FMnemonics() {
	this.addressConverter = new AddressConverter();
	this.mnemonics = [];
	this.mnemonics['add'] = new JAdd(this.addressConverter);
	this.mnemonics['sub'] = new JSub(this.addressConverter);
	this.mnemonics['mov'] = new JMov(this.addressConverter);
	this.mnemonics['call'] = new JCall(this.addressConverter);
	this.mnemonics['ret'] = new JRet();
	this.mnemonics['in'] = new JIn(this.addressConverter);
	this.mnemonics['out'] = new JOut(this.addressConverter);
	this.mnemonics['push'] = new JPush(this.addressConverter);

	this.getMnemonicByLine = function(line) {
		mnemonic = line.toLowerCase().split(' ')[0];
		if(this.mnemonics[mnemonic] != undefined) return this.mnemonics[mnemonic];
		else throw new FMErrorException("There is no command like ["+mnemonic+"].");
	};
}

function FMErrorException(message)
{
	this.message = message;
}

function JAdd(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JSub(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JMov(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMembers = line.substr(3, line.length-3).trim().split(',').map(function(e) {
			return e.trim();
		});

		destinationMemory = commandMembers[0];
		sourceMemory = commandMembers[1];
		
		if(checkIfMemberIsNumber(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;

				sourceMemoryValue = ProgramEnvironment.programData.Memory.getMemory(sourceMemoryAddress).memory.parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsLabel(destinationMemory)) {
			if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destMemoryAddress).address;
				sourceMemoryValue = setArchitectureAddressToRelativeAddress(parseInt(sourceMemory, 10));

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destMemoryAddress).address;
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destMemoryAddress).address;
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsRegister(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory)) {
				destMemoryAddress = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;

				sourceMemoryValue = programEnvironment.programData.Memory.getMemory(sourceMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();
				sourceMemoryValue = setArchitectureAddressToRelativeAddress(parseInt(sourceMemory, 10));

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsMemoryReference(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;

				sourceMemoryValue = programEnvironment.programData.Memory.getMemory(sourceMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory);
				sourceMemoryValue = setArchitectureAddressToRelativeAddress(parseInt(sourceMemory, 10));

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else throw new FMErrorException("Incorrect destination memory ["+destinationMemory+"].");

		return programEnvironment;
	};
}

function JCall(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMember = line.substr(4, line.length-4).trim();

		if(checkIfMemberIsNumber(commandMember)) {
			jmpAddress = parseInt(commandMember, 10);
		}
		else if(checkIfMemberIsLabel(commandMember, programEnvironment)) {
			jmpAddress = programEnvironment.programData.Labels.getLabel(commandMember).address;
		}
		else if(checkIfMemberIsMemoryReference(commandMember)) {
			jmpAddress = this.addressConverter.getValueFromAddress(commandMember, programEnvironment);
		}
		else if(checkIfMemberIsRegister(commandMember, programEnvironment)) {
			jmpAddress = programEnvironment.registers.getRegisterByName(commandMember, false).parseDec();
		}
		else throw new FMErrorException("Incorrect address ["+commandMember+"].");

		actualIP = programEnvironment.registers.getRegisterByName('ip', true);
		callbackAddress = actualIP;
		programEnvironment = PushElementOnStack(callbackAddress.parseDec(), programEnvironment);
		relativeJmpAddress = setArchitectureAddressToRelativeAddress(jmpAddress-1);
		programEnvironment.registers.setRegisterByName('ip', new SizedBitSet(16).setTo(relativeJmpAddress), true);

		return programEnvironment;
	};
}

function JRet()
{
	this.doOperation = function(line, programEnvironment) {
		result = PopElementFromStack(programEnvironment);
		programEnvironment = result.ProgramEnvironment;

		programEnvironment.registers.setRegisterByName('ip', result.element.memory, true);

		return programEnvironment;
	};
}

function JIn(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JOut(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JPush(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMember = line.substr(4, line.length-4).trim();
		if(checkIfMemberIsNumber(commandMember)) {
			pushData = parseInt(commandMember, 10);
		}
		else if(checkIfMemberIsLabel(commandMember, programEnvironment)) {
			pushData = programEnvironment.programData.Labels.getLabel(commandMember).address;
		}
		else if(checkIfMemberIsMemoryReference(commandMember)) {
			pushData = this.addressConverter.getValueFromAddress(commandMember, programEnvironment);
		}
		else if(checkIfMemberIsRegister(commandMember, programEnvironment)) {
			pushData = programEnvironment.registers.getRegisterByName(commandMember, false).parseDec();
		}
		else throw new FMErrorException("Incorrect expression ["+commandMember+"].");

		programEnvironment = PushElementOnStack(pushData, programEnvironment);
		
		return programEnvironment;
	};
}

function PushElementOnStack(number, programEnvironment) {
	actualSP = programEnvironment.registers.getRegisterByName('sp', false);
	if(actualSP.parseDec() > 0)
	{
		programEnvironment.programData.Memory.pushMemory(new NumberMemory(number));
		newSP = actualSP.sub(new SizedBitSet(16).setTo(1));
		programEnvironment.registers.setRegisterByName('sp', newSP, false);
		return programEnvironment;
	} else throw new FMErrorException("Stack overflow.");
}

function PopElementFromStack(programEnvironment) {
	actualSP = programEnvironment.registers.getRegisterByName('sp', false);
	relativeAddress = setAddressToMemoryArchitectureAddress(actualSP.parseDec());
	stackElement = programEnvironment.programData.Memory.getMemory(relativeAddress);
	newSP = actualSP.add(new SizedBitSet(16).setTo(1));
	programEnvironment.registers.setRegisterByName('sp', newSP, false);
	return {
		element: stackElement,
		ProgramEnvironment: programEnvironment
	};
}

function AddressConverter()
{
	this.converters = [
		new OnlyRegAddressConverter(),
		new RegAndDisposeAddressConverter()
	];

	this.getSpecialConverter = function(addressMembers) {
		if(this.converters[addressMembers.length-1] != undefined) return this.converters[addressMembers.length-1];
		else throw new FMErrorException("Cannot to get data from [["+addressMembers.join('+')+"]] address.");
	};

	this.getValueFromAddress = function(address, programEnvironment) {
		addressMembers = address.replace('[', '').replace(']', '').split('+');
		return this.getSpecialConverter(addressMembers).getValueFromAddress(addressMembers, programEnvironment);
	};
}

function RegAndDisposeAddressConverter()
{
	this.getValueFromAddress = function(addressMembers, programEnvironment) {
		addressRegister = addressMembers[0];
		addressDispose = addressMembers[1];
		if(checkIfMemberIsLabel(addressDispose, programEnvironment)) throw new FMErrorException("Dispose cannot be a label. It must be a constant value.");
		if(checkIfMemberIsLabel(addressDispose, programEnvironment)) throw new FMErrorException("Register cannot be a label. It must be the name of a register.");
		if(checkIfMemberIsNumber(addressRegister)) throw new FMErrorException("Register cannot be a constant value. It must be the name of a register.");
		registerValue = setRegisterAddressToMemoryArchitectureAddress(addressRegister, programEnvironment);
		relativeAddress = programEnvironment.programData.Memory.getMemory(registerValue+parseInt(addressDispose, 10));
		if(relativeAddress.type == "com") throw new FMErrorException("The memory is not a command. Cannot to perform this data.");
		return relativeAddress.memory.parseDec();
	};
}

function OnlyRegAddressConverter()
{
	this.getValueFromAddress = function(addressMembers, programEnvironment) {
		addressRegister = addressMembers[0];
		if(checkIfMemberIsLabel(addressRegister, programEnvironment)) throw new FMErrorException("Register cannot be a label. It must be the name of a register.");
		if(checkIfMemberIsNumber(addressRegister)) throw new FMErrorException("Register cannot be a constant value. It must be the name of a register.");
		registerValue = setRegisterAddressToMemoryArchitectureAddress(addressRegister, programEnvironment);
		relativeAddress = programEnvironment.programData.Memory.getMemory(registerValue);
		if(relativeAddress.type == "com") throw new FMErrorException("The memory is not a command. Cannot to perform this data.");
		return relativeAddress.memory.parseDec();
	};
}

function setAddressToMemoryArchitectureAddress(address) {
	maxMemorySize = 65535;
	return Math.abs(address - maxMemorySize);
}

function setArchitectureAddressToRelativeAddress(address) {
	maxMemorySize = 65535;
	return maxMemorySize - address;
}

function setRegisterAddressToMemoryArchitectureAddress(addressRegister, programEnvironment) {
	registerValue = programEnvironment.registers.getRegisterByName(addressRegister, false);
	maxMemorySize = 65535;
	return Math.abs(registerValue.parseDec()-maxMemorySize);
};

function checkIfMemberIsMemoryReference(member) {
	return member.charAt(0) == '[' && member.charAt(member.length-1) == ']';
}

function checkIfMemberIsNumber(member) {
	return !isNaN(member);
}

function checkIfMemberIsLabel(member, programEnvironment) {
	if(!checkIfMemberIsNumber(member) && programEnvironment.programData.Labels.hasLabel(member)) return true;
	return false;
}

function checkIfMemberIsRegister(member, programEnvironment) {
	if(programEnvironment.registers.getRegisterByName(member, true) != null) return true;
	return false;
}