export default class Person {
	constructor() {
		this.races = [];
		this.perceivedPriorToStop = false;
		this.gender = "";
		this.age = "";
		this.lgbtq = false;
		this.limitedEnglish = false;
		this.disability = false;
		this.disabilities = [];
		this.stopType = null;
		this.stopReason = "";
		this.suspicionBasis = [];
		this.stopCode = "";
		this.stopExplanation = "";
		this.stopActions = [];
		this.evidence = [];
		this.stopResults = [];
		this.searchBasis = [];
		this.searchConducted = false;
		this.searchConsented = false;
	}
}
