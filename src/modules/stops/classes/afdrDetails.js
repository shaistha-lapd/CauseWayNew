export default class AfdrDetails {
	constructor() {
		this.id = Date.now().toString();
		this.createdDate = new Date().toISOString("sv");
		this.status = null;
		this.afisStatus = null;
		this.afisId = null;
		this.percentComplete = null;
		this.locked = false;
		this.creator = null;
	}
}
