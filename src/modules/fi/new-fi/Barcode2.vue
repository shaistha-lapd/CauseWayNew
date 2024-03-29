<template>
	<v-container>
		<v-dialog key="1" ref="scannerDialog" v-model="scannerDialog" :fullscreen="$vuetify.breakpoint.mdAndDown" max-width="600px">
			<template v-slot:activator="{ on, attrs }">
				<v-btn icon dark v-bind="attrs" v-on="on" @click="start">
					<v-progress-circular v-if="isLoading" indeterminate color="cyan lighten-4"></v-progress-circular>
					<v-icon v-else large color="cyan lighten-4">mdi-barcode-scan</v-icon>
				</v-btn>
			</template>
			<v-card>
				<v-card-title class="text-h5 secondary"> Barcode Scanner </v-card-title>

				<v-card-text>
					<v-container>
						<v-row justify="center">
							<v-card class="mt-6" tile max-width="500">
								<video id="video" ref="video" autoplay muted playsinline></video>
								<div ref="overlay" class="overlay" :class="{ 'overlay-scanned': scanned }">
									<div class="overlay-helper">
										<div class="overlay-element top-left"></div>
										<div class="overlay-element top-right"></div>
										<div class="overlay-element bottom-left"></div>
										<div class="overlay-element bottom-right"></div>
									</div>
								</div>
								<v-card-actions>
									<button icon>
										<v-icon color="orange" x-large>mdi-camera</v-icon>
									</button>
								</v-card-actions>
							</v-card>
						</v-row>
					</v-container>
				</v-card-text>

				<v-card-text v-if="scanResult">
					<v-alert text color="success">
						<div>ID successfully scanned and imported.</div>

						<v-divider class="my-4 success" style="opacity: 0.22"></v-divider>

						<v-row align="center" no-gutters>
							<v-col class="grow"> Click here to close </v-col>
							<v-spacer></v-spacer>
							<v-col class="shrink">
								<v-btn color="success" outlined @click="close()"> Close </v-btn>
							</v-col>
						</v-row>
					</v-alert>
				</v-card-text>
				<div v-else>
					<v-divider></v-divider>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="error" text @click="stopCam"> Cancel </v-btn>
					</v-card-actions>
				</div>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script>
import { BrowserMultiFormatReader, BrowserPDF417Reader, Exception, PDF417Reader } from "@zxing/library";
import { mapMutations } from "vuex";
export default {
	props: ["person", "states", "races", "eyeColors", "hairColors", "genders"],
	data: () => ({
		//scan properties
		pdfReader: null,
		scanned: false,
		scannerDialog: false,
		isLoading: false,
		showScan: false,
		scanResult: null,
		scanAddress: {
			formattedAddress: "",
			city: "",
			state: "",
			zip: "",
			type: "",
		},
		//camera properties
		stream: null,
		ready: false,
		tracks: null,
	}),

	methods: {
		...mapMutations({
			addAddress: "Fi/ADD_ADDRESS",
		}),
		async start() {
			this.stream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: "environment",
				},
			});
			this.$refs.video.srcObject = this.stream;
			this.$refs.video.onloadedmetadata = (e) => {
				this.ready = true;
				this.tracks = this.stream.getTracks();
				this.pdfReader = new BrowserPDF417Reader();
			};
		},

		stopCam() {
			this.tracks.forEach((track) => track.stop());
			this.scannerDialog = false;
		},
		scanStart() {
			this.scanner.decodeFromVideoDevice(this.selectedDeviceId, "video", (result, err) => {
				if (result) {
					navigator.vibrate(50);
					this.scanned = true;
					this.scanResult = result.text;
					this.parseIdValues(this.scanResult);
				}
				if (err && !(err instanceof Exception)) {
					console.error(err);
				}
			});
		},

		parseIdValues(scan) {
			var lines = scan.split("\n");
			for (var i = 0; i < lines.length; i++) {
				if (lines[i].includes("DAQ")) {
					var extract = lines[i].indexOf("DAQ");
					lines[i] = lines[i].substring(extract);
				}
				this.mapFormValues(lines[i]);
			}
			if (this.scanAddress.formattedAddress !== "") this.addAddress(this.scanAddress);
		},
		parseDate(date) {
			var year = date.substring(4, 8);
			var month = date.substring(0, 2);
			var day = date.substring(4, 2);
			return year + "-" + month + "-" + day;
		},
		getHeight(inches) {
			inches = inches.substring(0, 3);
			var feet = Math.floor(inches / 12).toString();
			inches %= 12;
			var inString = inches.toString();
			if (inString.length < 2) {
				inString = "0" + inString;
			}
			var _height = feet + inString;
			return parseInt(_height);
		},
		getWeight(weight) {
			return parseInt(weight);
		},
		getSex(code) {
			if (code == 1) return "M";
			if (code == 2) return "F";
			else return "NB";
		},

		mapFormValues(field) {
			field = field.trim(); //remove any whitespace
			var value = field.substring(3); //strip off first three character codes for the remaining field value
			switch (
				field.substring(0, 3) //map field based on first three character codes
			) {
				case "DAQ":
					this.person.idNumber = value;
					break;
				case "DAJ":
					this.person.idState = value;
					this.scanAddress.state = value;
					this.scanAddress.type = "Primary";
					break;
				case "DCS":
					this.person.lastName = value;
					break;
				case "DAC":
					this.person.firstName = value;
					break;
				case "DAD":
					this.person.middleName = value;
					break;
				case "DCU":
					this.person.suffix = value;
					break;
				case "DBB":
					this.person.dobISO = this.parseDate(value);
					break;
				case "DCL":
					this.person.descent = this.races.find((item) => item.code === value);
					break;
				case "DAY":
					if (value === "BRN") {
						value = "BRO";
					}
					this.person.eyeColor = this.eyeColors.find((item) => item.value === value);
					break;
				case "DAZ":
					if (value === "BRN") {
						value = "BRO";
					}
					this.person.hairColor = this.hairColors.find((item) => item.value === value);
					break;
				case "DAU":
					this.person.height = this.getHeight(value);
					break;
				case "DAW":
					this.person.weight = this.getWeight(value);
					break;
				case "DBC":
					this.person.gender = this.genders.find((item) => item.code === value);
					break;
				case "DAG":
					this.scanAddress.formattedAddress = value;
					break;
				case "DAI":
					this.scanAddress.city = value;
					break;
				case "DAK":
					this.scanAddress.zip = value.substring(0, 5);
					break;
				case "DBN":
					this.person.moniker += value + " ";
					break;
				case "DBS":
					this.person.moniker += value + " ";
					break;
				case "DCU":
					this.person.moniker += value;
					break;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
video {
	max-width: 100%;
	max-height: 100%;
}

.overlay {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	--border-style: 2px solid red;
	--border-space: 16px;
}
.overlay-scanned {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	--border-style: 2px solid green;
	--border-space: 16px;
}
.overlay-helper {
	position: relative;
	top: 24%;
	width: 100%; /* make this element same size as the wrapper */
	height: 50%;
}

.overlay-element {
	position: absolute;
	width: 25%; /* controls the length of the borders */
	height: 25%; /* controls the height of the borders */
}

.overlay .top-left {
	border-left: var(--border-style);
	border-top: var(--border-style);
	top: var(--border-space);
	left: var(--border-space);
}

.overlay .top-right {
	border-right: var(--border-style);
	border-top: var(--border-style);
	top: var(--border-space);
	right: var(--border-space);
}

.overlay .bottom-left {
	border-left: var(--border-style);
	border-bottom: var(--border-style);
	bottom: var(--border-space);
	left: var(--border-space);
}

.overlay .bottom-right {
	border-right: var(--border-style);
	border-bottom: var(--border-style);
	bottom: var(--border-space);
	right: var(--border-space);
}
</style>
