function FMnemonics() {
	this.addressConverter = new AddressConverter();
	this.mnemonics = [];
	this.mnemonics['add'] = new JAdd(this.addressConverter); // done
	this.mnemonics['sub'] = new JSub(this.addressConverter); // done
	this.mnemonics['mov'] = new JMov(this.addressConverter); // done
	this.mnemonics['call'] = new JCall(this.addressConverter); // done
	this.mnemonics['ret'] = new JRet(); // done
	this.mnemonics['in'] = new JIn(this.addressConverter);
	this.mnemonics['out'] = new JOut(this.addressConverter);
	this.mnemonics['push'] = new JPush(this.addressConverter); // done
	this.mnemonics['pop'] = new JPop(this.addressConverter); // done

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
		commandMembers = line.substr(3, line.length-3).replace(/ /g, '').trim().split(',').map(function(e) {
			return e.trim();
		});

		destinationMemory = commandMembers[0];
		sourceMemory = commandMembers[1];
		
		if(checkIfMemberIsNumber(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;

				destinationValue = ProgramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = ProgramEnvironment.programData.Memory.getMemory(sourceMemoryAddress).memory.parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));

				destinationValue = ProgramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));

				destinationValue = ProgramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsLabel(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;
				
				destinationValue = rogramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = parseInt(sourceMemory, 10);
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = rogramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = rogramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsRegister(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				sourceMemoryValue = setAddressToMemoryArchitectureAddress(programEnvironment.programData.Labels.getLabel(sourceMemory).address);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue + sourceMemoryValue), false);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue + sourceMemoryValue), false);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue + sourceMemoryValue), false);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue + sourceMemoryValue), false);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsMemoryReference(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				sourceMemoryValue = programEnvironment.programData.Memory.getMemory(sourceMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue + sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else throw new FMErrorException("Incorrect destination memory ["+destinationMemory+"].");
		return programEnvironment;
	};
}

function JSub(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMembers = line.substr(3, line.length-3).replace(/ /g, '').trim().split(',').map(function(e) {
			return e.trim();
		});

		destinationMemory = commandMembers[0];
		sourceMemory = commandMembers[1];
		
		if(checkIfMemberIsNumber(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;

				destinationValue = ProgramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = ProgramEnvironment.programData.Memory.getMemory(sourceMemoryAddress).memory.parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));

				destinationValue = ProgramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));

				destinationValue = ProgramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsLabel(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;
				
				destinationValue = rogramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = parseInt(sourceMemory, 10);
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = rogramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = rogramEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsRegister(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				sourceMemoryValue = setAddressToMemoryArchitectureAddress(programEnvironment.programData.Labels.getLabel(sourceMemory).address);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue - sourceMemoryValue), false);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue - sourceMemoryValue), false);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue - sourceMemoryValue), false);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(destinationValue - sourceMemoryValue), false);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsMemoryReference(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				sourceMemoryValue = programEnvironment.programData.Memory.getMemory(sourceMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(destinationValue - sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else throw new FMErrorException("Incorrect destination memory ["+destinationMemory+"].");
		return programEnvironment;
	};
}

function JMov(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMembers = line.substr(3, line.length-3).replace(/ /g, '').trim().split(',').map(function(e) {
			return e.trim();
		});

		destinationMemory = commandMembers[0];
		sourceMemory = commandMembers[1];
		
		if(checkIfMemberIsNumber(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;

				sourceMemoryValue = ProgramEnvironment.programData.Memory.getMemory(sourceMemoryAddress).memory.parseDec();
				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = setArchitectureAddressToRelativeAddress(parseInt(destinationMemory, 10));
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsLabel(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;
				sourceMemoryValue = parseInt(sourceMemory, 10);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsRegister(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				sourceMemoryValue = setAddressToMemoryArchitectureAddress(programEnvironment.programData.Labels.getLabel(sourceMemory).address);

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(sourceMemoryValue), false);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				sourceMemoryValue = parseInt(sourceMemory, 10);

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(sourceMemoryValue), false);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(sourceMemoryValue), false);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();

				programEnvironment.registers.setRegisterByName(destinationMemory, new SizedBitSet(16).setTo(sourceMemoryValue), false);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsMemoryReference(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;

				sourceMemoryValue = programEnvironment.programData.Memory.getMemory(sourceMemoryAddress);

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();

				programEnvironment.programData.Memory.setMemory(new NumberMemory(sourceMemoryValue), destMemoryAddress);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = parseInt(sourceMemory, 10);

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
		commandMember = line.substr(4, line.length-4).replace(/ /g, '').trim();

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
		commandMembers = line.substr(2, line.length-2).replace(/ /g, '').trim().split(',').map(function(e) {
			return e.trim();
		});

		destinationMemory = commandMembers[0];
		sourceMemory = commandMembers[1];
		
		if(checkIfMemberIsNumber(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;
				sourceMemoryValue = ProgramEnvironment.programData.Memory.getMemory(sourceMemoryAddress).memory.parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryValue = parseInt(sourceMemory, 10);
				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsLabel(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;
				
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = parseInt(sourceMemory, 10);
				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsRegister(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				sourceMemoryValue = setAddressToMemoryArchitectureAddress(programEnvironment.programData.Labels.getLabel(sourceMemory).address);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsMemoryReference(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				sourceMemoryValue = programEnvironment.programData.Memory.getMemory(sourceMemoryAddress);

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory = programEnvironment.devices.inDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else throw new FMErrorException("Incorrect destination memory ["+destinationMemory+"].");
		return programEnvironment;
	};
}

function JOut(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMembers = line.substr(3, line.length-3).replace(/ /g, '').trim().split(',').map(function(e) {
			return e.trim();
		});

		destinationMemory = commandMembers[0];
		sourceMemory = commandMembers[1];
		
		if(checkIfMemberIsNumber(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;
				sourceMemoryValue = ProgramEnvironment.programData.Memory.getMemory(sourceMemoryAddress).memory.parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destinationValue = parseInt(destinationMemory, 10);
				sourceMemoryValue = parseInt(sourceMemory, 10);
				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsLabel(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsNumber(sourceMemory)) {
				destinationValue = setAddressToMemoryArchitectureAddress(programEnvironment.programData.Labels.getLabel(destinationMemory).address);
				sourceMemoryValue = parseInt(sourceMemory, 10);
				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				destMemoryAddress = programEnvironment.programData.Labels.getLabel(destinationMemory).address;

				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress).memory.parseDec();
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsRegister(destinationMemory, programEnvironment)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				sourceMemoryValue = setAddressToMemoryArchitectureAddress(programEnvironment.programData.Labels.getLabel(sourceMemory).address);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsMemoryReference(sourceMemory)) {
				sourceMemoryValue = this.addressConverter.getValueFromAddress(sourceMemory, programEnvironment);
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.registers.getRegisterByName(destinationMemory, false).parseDec();

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else if(checkIfMemberIsMemoryReference(destinationMemory)) {
			if(checkIfMemberIsLabel(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryAddress = programEnvironment.programData.Labels.getLabel(sourceMemory).address;
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				sourceMemoryValue = programEnvironment.programData.Memory.getMemory(sourceMemoryAddress);

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsRegister(sourceMemory, programEnvironment)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = programEnvironment.registers.getRegisterByName(sourceMemory, false).parseDec();
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else if(checkIfMemberIsNumber(sourceMemory)) {
				destMemoryAddress = this.addressConverter.getValueFromAddress(destinationMemory, programEnvironment);
				sourceMemoryValue = parseInt(sourceMemory, 10);
				destinationValue = programEnvironment.programData.Memory.getMemory(destMemoryAddress);

				programEnvironment.programData.Memory = programEnvironment.devices.outDevice(programEnvironment.programData.Memory, 
					new SizedBitSet(16).setTo(destinationValue), sourceMemoryValue);
			}
			else throw FMErrorException("Incorrect source memory ["+sourceMemory+"].");
		}
		else throw new FMErrorException("Incorrect destination memory ["+destinationMemory+"].");
		return programEnvironment;
	};
}

function JPush(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMember = line.substr(4, line.length-4).replace(/ /g, '').trim();
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

function JPop(addressConverter)
{
	this.addressConverter = addressConverter;
	this.doOperation = function(line, programEnvironment) {
		commandMember = line.substr(3, line.length-3).replace(/ /g, '').trim();
		if(checkIfMemberIsNumber(commandMember)) {
			popAddress = setArchitectureAddressToRelativeAddress(parseInt(commandMember, 10));
			popData = PopElementFromStack(programEnvironment);
			programEnvironment = popData.ProgramEnvironment;
			programEnvironment.programData.Memory.setMemory(popData.element, popAddress);
		}
		else if(checkIfMemberIsLabel(commandMember, programEnvironment)) {
			popAddress = programEnvironment.programData.Labels.getLabel(commandMember).address;
			popData = PopElementFromStack(programEnvironment);
			programEnvironment = popData.ProgramEnvironment;
			programEnvironment.programData.Memory.setMemory(popData.element, popAddress);
		}
		else if(checkIfMemberIsMemoryReference(commandMember)) {
			popAddress = this.addressConverter.getValueFromAddress(commandMember, programEnvironment);
			popData = PopElementFromStack(programEnvironment);
			programEnvironment = popData.ProgramEnvironment;
			programEnvironment.programData.Memory.setMemory(popData.element, popAddress);
		}
		else if(checkIfMemberIsRegister(commandMember, programEnvironment)) {
			popData = PopElementFromStack(programEnvironment);
			programEnvironment = popData.ProgramEnvironment;
			programEnvironment.registers.setRegisterByName(commandMember, popData.element.memory, false);
		}
		else throw new FMErrorException("Incorrect expression ["+commandMember+"].");
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
	this.getValueFromAddress = function(addressMembers, programEnvironment, toAdd) {
		addressRegister = addressMembers[0].trim();
		addressDispose = addressMembers[1].trim();
		if(checkIfMemberIsLabel(addressDispose, programEnvironment)) throw new FMErrorException("Dispose cannot be a label. It must be a constant value.");
		if(checkIfMemberIsLabel(addressDispose, programEnvironment)) throw new FMErrorException("Register cannot be a label. It must be the name of a register.");
		if(checkIfMemberIsNumber(addressRegister)) throw new FMErrorException("Register cannot be a constant value. It must be the name of a register.");
		registerValue = programEnvironment.registers.getRegisterByName(addressRegister, false).parseDec();
		addressDisposeValue = setArchitectureAddressToRelativeAddress(registerValue+parseInt(addressDispose, 10));
		relativeAddress = programEnvironment.programData.Memory.getMemory(addressDisposeValue);
		if(relativeAddress.type == "com") throw new FMErrorException("The memory is not a command. Cannot to perform this data.");
		return relativeAddress.memory.parseDec();
	};
}

function OnlyRegAddressConverter()
{
	this.getValueFromAddress = function(addressMembers, programEnvironment, toAdd) {
		addressRegister = addressMembers[0].trim();
		if(checkIfMemberIsLabel(addressRegister, programEnvironment)) throw new FMErrorException("Register cannot be a label. It must be the name of a register.");
		if(checkIfMemberIsNumber(addressRegister)) throw new FMErrorException("Register cannot be a constant value. It must be the name of a register.");
		registerValue = setArchitectureAddressToRelativeAddress(programEnvironment.registers.getRegisterByName(addressRegister, false).parseDec());
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