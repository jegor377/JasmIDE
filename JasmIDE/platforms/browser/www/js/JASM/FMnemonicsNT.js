function FMnemonics() {
	this.mnemonics = [];
	this.mnemonics['add'] = new JAdd();
	this.mnemonics['sub'] = new JSub();
	this.mnemonics['mov'] = new JMov();
	this.mnemonics['call'] = new JCall();
	this.mnemonics['ret'] = new JRet();
	this.mnemonics['in'] = new JIn();
	this.mnemonics['out'] = new JOut();
	this.mnemonics['push'] = new JPush();

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

function JAdd()
{
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JSub()
{
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JMov()
{
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JCall()
{
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JRet()
{
	this.doOperation = function(line, programEnvironment) {
		sp = programEnvironment.registers.getRegisterByName('sp', false);
		if(sp.parseDec() >= programEnvironment.programData.SpStart)
		{
			jmpAddress = programEnvironment.programData.Memory.getMemory(sp.parseDec());
			programEnvironment.registers.setRegisterByName('ip', jmpAddress.memory, true);
			programEnvironment.registers.setRegisterByName('sp', sp.sub(new SizedBitSet(1)), false);
			programEnvironment.programData.Memory.memory.pop();
		}
		return programEnvironment;
	};
}

function JIn()
{
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JOut()
{
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
	};
}

function JPush()
{
	this.doOperation = function(line, programEnvironment) {
		return programEnvironment;
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
	this.isNumber = function(string) {
		return !isNaN(string);
	};

	this.checkIfDisposeIsLabel = function(addressDispose, programEnvironment) {
		if(!this.isNumber(addressDispose) && programEnvironment.programData.Labels.hasLabel(addressDispose)) return true;
		return false;
	};

	this.setRegiserAddressToMemoryArchitectureAddress = function(addressRegister, programEnvironment) {
		registerValue = programEnvironment.registers.getRegisterByName(addressRegister, false);
		maxMemorySize = 65535;
		return Math.abs(registerValue.parseDec()-maxMemorySize);
	};

	this.getValueFromAddress = function(addressMembers, programEnvironment) {
		addressRegister = addressMembers[0];
		addressDispose = addressMembers[1];
		if(this.checkIfDisposeIsLabel(addressDispose)) throw new FMErrorException("Dispose cannot be a label.");
		registerValue = this.setRegiserAddressToMemoryArchitectureAddress(addressRegister, programEnvironment);
		relativeAddress = programEnvironment.programData.Memory.getMemory(registerValue+parseInt(addressDispose, 10));
		if(relativeAddress.type == "com") throw new FMErrorException("The memory is not a command. Cannot to perform this data.");
		return relativeAddress.memory.parseDec().toString();
	};
}

function OnlyRegAddressConverter()
{
	this.getValueFromAddress = function(addressMembers, programEnvironment) {
		addressRegister = addressMembers[0];
	};
}