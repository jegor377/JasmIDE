function FMnemonics() {
	this.mnemonics = [
		new JAdc(),
		new JAdd(),
		new JAnd(),
		new JCall(),
		new JCbw(),
		new JCwd(),
		new JCdq(),
		new JClc(),
		new JCld(),
		new JCli(),
		new JCmc(),
		new JCmova(),
		new JCmovae(),
		new JCmovb(),
		new JCmovbe(),
		new JCmovc(),
		new JCmove(),
		new JCmovg(),
		new JCmovge(),
		new JCmovl(),
		new JCmovle(),
		new JCmovna(),
		new JCmovnae(),
		new JCmovnb(),
		new JCmovnbe(),
		new JCmovnc(),
		new JCmovne(),
		new JCmovng(),
		new JCmovnge(),
		new JCmovnl(),
		new JCmovnle(),
		new JCmovno(),
		new JCmovnp(),
		new JCmovns(),
		new JCmovnz(),
		new JCmovo(),
		new JCmovp(),
		new JCmovpe(),
		new JCmovpo(),
		new JCmovs(),
		new JCmovz(),
		new JCmp(),
		new JCmpxchg(),
		new JDec(),
		new JDiv(),
		new JEnter(),
		new JIn(),
		new JInc(),
		new JInt(),
		new JA(),
		new JAe(),
		new JBe(),
		new JC(),
		new JEcxz(),
		new JE(),
		new JGe(),
		new JL(),
		new JLe(),
		new JNe(),
		new JNs(),
		new JO(),
		new JPe(),
		new JPo(),
		new JS(),
		new JB(),
		new JG(),
		new JNo(),
		new JMp(),
		new JLahf(),
		new JLea(),
		new JLeave(),
		new JLoop(),
		new JLoope(),
		new JLoopz(),
		new JLoopne(),
		new JLoopnz(),
		new JMov(),
		new JMovd(),
		new JMovq(),
		new JMovs(),
		new JMovsx(),
		new JMovzx(),
		new JMul(),
		new JNeg(),
		new JNop(),
		new JNot(),
		new JOr(),
		new JOut(),
		new JPop(),
		new JPopad(),
		new JPopfd(),
		new JPush(),
		new JPushad(),
		new JPushfd(),
		new JPxor(),
		new JRol(),
		new JRor(),
		new JRet(),
		new JShl(),
		new JShr(),
		new JStc(),
		new JStd(),
		new JSti(),
		new JSub(),
		new JTest(),
		new JXadd(),
		new JXchg(),
		new JXor()
	];

	getMnemonicByLine: function(line) {
		if(line.length != 0){
			mnemonic = line.split(' ')[0];

			for(var index in this.mnemonics)
				if(this.mnemonics[index] == mnemonic) return this.mnemonics[index];
			return null;
		}
		throw new LineIsEmptyException();
	};
}

function LineIsEmptyException(){
	this.message = "The line is empty";
}

function JAdc() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JAdd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JAnd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCall() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCbw() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCwd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCdq() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JClc() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCld() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCli() {
	this.mnemonic = "";
	
	this.getOpcode = function(line) {
		return "";
	};
}

function JCmc() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmova() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}}

function JCmovae() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}}

function JCmovb() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovbe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovc() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmove() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovg() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovge() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovl() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovle() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovna() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnae() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnb() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnbe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnc() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovne() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovng() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnge() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnl() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnle() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovno() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnp() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovns() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovnz() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovo() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovp() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovpe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovpo() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovs() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmovz() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmp() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JCmpxchg() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JDec() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JDiv() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JEnter() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JIn() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JInc() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JInt() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JA() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JAe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JBe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JC() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JEcxz() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JE() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JGe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JL() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JNe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JNo() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPe() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPo() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JS() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JB() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JG() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMp() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLahf() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLea() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLeave() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLoop() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLoope() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLoopz() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLoopne() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JLoopnz() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMov() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMovd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMovq() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMovs() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMovsx() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMovzx() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JMul() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JNeg() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JNop() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JNot() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JOr() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JOut() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPop() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPopad() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPopfd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPush() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPushad() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPushfd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JPxor() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JRol() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JRet() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JRor() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JShl() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JShr() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JStc() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JStd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JSti() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JSub() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JXadd() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JTest() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JXchg() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}

function JXor() {
	this.mnemonic = "";

	this.getOpcode = function(line) {
		return "";
	};
}