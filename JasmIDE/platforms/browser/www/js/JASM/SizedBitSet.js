function SizedBitSet(size) {
	this.bitset = CreateString('0', size);

	this.smul = function(Bitset) {
		result = this.clone().concat(new SizedBitSet(Bitset.getSize()));
		result = result.setTo(result.parseSignedDec()*Bitset.parseSignedDec());
		return result;
	};

	this.sdiv = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseSignedDec()/Bitset.parseSignedDec());
		return result;
	};

	this.add = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseDec()+Bitset.parseDec());
		return result;
	};

	this.sub = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseDec()-Bitset.parseDec());
		return result;
	};

	this.mul = function(Bitset) {
		result = this.clone().concat(new SizedBitSet(Bitset.getSize()));
		result = result.setTo(result.parseDec()*Bitset.parseDec());
		return result;
	};

	this.div = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseDec()/Bitset.parseDec());
		return result;
	};

	this.and = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseDec()&Bitset.parseDec());
		return result;
	};

	this.or = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseDec()|Bitset.parseDec());
		return result;
	};

	this.not = function() {
		result = this.clone();

		for(var index in result.toString()) {
			if(this.get(index) == 1) result = result.clr(index);
			else result = result.set(index);
		}

		return result;
	};

	this.xor = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseDec()^Bitset.parseDec());
		return result;
	};

	this.mod = function(Bitset) {
		result = this.clone();
		result = result.setTo(result.parseDec()%Bitset.parseDec());
		return result;
	};

	this.shr = function(offset) {
		result = this.clone();
		result = result.setTo(result.parseDec()>>offset);
		return result;
	};

	this.shl = function(offset) {
		result = this.clone();
		result = result.setTo(result.parseDec()<<offset);
		return result;
	};

	this.set = function(index) {
		if(index < this.getSize()) {
			result = new SizedBitSet(0);
			result.bitset = this.toString();
			result.bitset = setCharAt(result.toString(), (result.getSize()-1)-index, '1');
			return result;
		}
		return this.clone();
	};

	this.clr = function(index) {
		if(index < this.getSize()) {
			result = new SizedBitSet(0);
			result.bitset = this.toString();
			result.bitset = setCharAt(result.toString(), (result.getSize()-1)-index, '0');
			return result;
		}
		return this.clone();
	};

	this.get = function(index) {
		return index < this.getSize() ? (this.toString().charAt(Math.abs(this.getSize()-1)-index) == '1' ? 1 : 0) : 0;
	};

	this.equals = function(Bitset) {
		return this.parseDec() == Bitset.parseDec();
	};

	this.getSize = function() {
		return this.bitset.length;
	};

	this.clone = function() {
		result = new SizedBitSet(this.getSize());
		result.bitset = this.bitset;
		return result;
	};

	this.concat = function(Bitset) {
		result = new SizedBitSet(0);
		result.bitset = Bitset.toString() + this.toString();
		return result;
	};

	this.getRange = function(startPos, endPos) {
		result = new SizedBitSet(Math.abs(endPos - startPos));
		index = 0;
		while(startPos != endPos) {
			if(this.get(startPos++) == 1) result = result.set(index++);
			else result = result.clr(index++);
		}
		return result;
	};

	this.putPos = function(Bitset, startPos) {
		return this.clone().or(Bitset.shl(startPos));
	};

	this.pastePos = function(Bitset, startPos) {
		result = this.clone();
		endPos = startPos + Bitset.getSize();
		index = 0;
		while(startPos != endPos) {
			if(Bitset.get(index++) == 1) result = result.set(startPos++);
			else result = result.clr(startPos++);
		}
		return result;
	};

	this.clear = function() {
		return new SizedBitSet(this.getSize());
	};

	this.toString = function() {
		return this.bitset;
	};

	this.parseDec = function() {
		return parseInt(this.toString(), 2);
	};

	this.parseSignedDec = function() {
		if(this.getHighestBit() != 1) return this.parseDec();
		result = parseInt(this.sub(new SizedBitSet(this.getSize()).setTo(1)).not(), 2);
		return result != 0 ? result*-1 : 0;
	};

	this.setTo = function(value) {
		result = new SizedBitSet(this.getSize());
		sign = value < 0;
		value = value.toString(2);
		for(index = value.length-1; index >= 0; index--) {
			if(value.charAt(index) == '1') result = result.set((value.length-1)-index);
			else result = result.clr((value.length-1)-index);
		}
		return sign ? result.not().add(new SizedBitSet(result.getSize()).set(0)) : result;
	};

	this.getHighestBit = function() {
		return this.get(this.getSize()-1);
	};

	this.getLowerBit = function() {
		return this.get(0);
	};
}

function CreateString(ch, count) {
	result = "";
	while(count-- != 0) result += ch;
	return result;
}

function setCharAt(str,index,chr) {
	if(index > str.length-1) return str;
	return str.substr(0,index) + chr + str.substr(index+1);
}