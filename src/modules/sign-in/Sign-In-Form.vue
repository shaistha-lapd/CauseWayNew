<template>
	<v-container fill-height class="justify-center">
		<v-card rounded height="100%" width="100%" max-width="500" elevation="8" class="d-flex flex-column px-0">
			<v-toolbar flat dark max-height="56" color="primary">
				<v-toolbar-title>POST Course Roster</v-toolbar-title>
			</v-toolbar>
			<v-list-item three-line>
				<v-list-item-content>
					<v-list-item-title class="text-h5 mb-1">
						{{ course.title }}
					</v-list-item-title>
					<v-list-item-subtitle>{{ course.subtitle }}</v-list-item-subtitle>
					<div class="text-caption grey--text text--lighten-1">
						{{ course.date }}
					</div>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
			<v-card-text class="pt-0">
				<v-card-title class="pl-0">
					<v-col cols="12" class="text-decoration-underline pl-0 ml-0 mb-2">Attendee:</v-col>
				</v-card-title>
				<v-form ref="roster" v-model="valid">
					<div class="ml-2">
						<v-row dense>
							<v-col cols="6">
								<v-text-field
									v-model="appUser.lastName"
									autocomplete="new-password"
									label="Last Name"
									:outlined="settings.outlined"
									required
									:rules="[(v) => (v && v.length >= 2) || 'Field must contain at least 2 letters']"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row dense justify="space-between">
							<v-col cols="5">
								<v-text-field
									v-model="appUser.firstName"
									autocomplete="new-password"
									label="First Name"
									:outlined="settings.outlined"
									required
									:rules="[(v) => (v && v.length >= 2) || 'Field must contain at least 2 letters']"
								></v-text-field>
							</v-col>
							<v-spacer></v-spacer>
							<v-col cols="5">
								<v-text-field
									v-model="appUser.serial"
									label="Serial"
									:outlined="settings.outlined"
									required
									:rules="[(v) => (v && v.length >= 2) || 'Field must contain at least 2 letters']"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row dense justify="space-between">
							<v-col cols="5">
								<v-text-field
									v-model="appUser.assignment"
									label="Division"
									:outlined="settings.outlined"
									required
									:rules="[(v) => (v && v.length >= 2) || 'Field must contain at least 2 letters']"
								></v-text-field>
							</v-col>
							<v-col cols="5">
								<v-text-field
									v-model="postId"
									label="POST ID"
									:outlined="settings.outlined"
									required
									:loading="loading"
									:rules="[(v) => (v && v.length > 2) || 'Field must contain more than 2 letters']"
								>
									<template v-slot:append>
										<v-btn small :loading="loading" icon color="primary" @click="getPostId(appUser.serial)">
											<v-icon>mdi-refresh</v-icon>
										</v-btn>
									</template>
								</v-text-field>
							</v-col>
						</v-row>
						<v-radio-group v-model="transport" label="How did you get to training today?" :rules="[(v) => !!v || 'Please make a selection']">
							<v-radio label="Personal Vehicle" value="pov" class="ml-4"></v-radio>
							<v-radio label="City Vehicle" value="cityveh" class="ml-4"></v-radio>
							<v-radio label="Carpool" value="carpool" class="ml-4"></v-radio>
						</v-radio-group>
					</div>
				</v-form>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions class="my-4 justify-center">
				<v-btn width="48%" class="ma-2" :loading="uploading" :disabled="!valid" color="success" @click="signInUser">
					Sign In
					<v-icon right dark> mdi-check-underline </v-icon>
					<template v-slot:loader>
						<span class="custom-loader">
							<v-icon light>mdi-cached</v-icon>
						</span>
					</template>
				</v-btn>
			</v-card-actions>
		</v-card>
		<v-row>
			<v-dialog v-model="popup" transition="dialog-bottom-transition" max-width="600">
				<template v-slot:default="dialog">
					<v-card class="text-wrap">
						<v-toolbar color="primary" dark>
							<span class="text-h4 text-capitalize font-weight-bold">Hi, {{ msg.name.toLowerCase() }}!</span>
						</v-toolbar>
						<v-card-title primary-title>
							<h3>Welcome!</h3>
							<v-spacer></v-spacer>
							<v-avatar>
								<v-icon x-large color="light-green lighten-3">mdi-thumb-up</v-icon>
							</v-avatar>

							<v-card-text class="text-wrap wrap">{{ msg.msg }}</v-card-text>

							<v-card-text>You may close your browser now.</v-card-text>
						</v-card-title>
						<v-card-actions class="justify-end">
							<v-btn text @click="acknowledge">Close</v-btn>
						</v-card-actions>
					</v-card>
				</template>
			</v-dialog>
			<v-dialog v-model="userLoad" :scrim="false" persistent width="auto">
				<v-card color="secondary">
					<v-card-title></v-card-title>
					<v-card-text>
						Loading user info
						<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-row>
	</v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	data: () => ({
		valid: false,
		postId: "",
		transport: null,
		loading: false,
		uploading: false,
		userLoad: true,
		loader: null,
		popup: false,
		course: {
			title: "RMS Ambassador Training",
			subtitle: "Central Bureau",
			date: "01/16/2024 - 01/19/2024",
			hours: "40",
			courseId: "1",
		},
		msg: null,
	}),
	computed: {
		...mapGetters({
			appUser: "User/appUser",
			settings: "User/settings",
		}),
	},
	methods: {
		reset() {
			this.$refs.roster.reset();
		},
		getPostId(serial) {
			var authCode = "Hw0JWC1ErotmaMmUwykZR-6t5aHdtuEjtGjntdQfokVLAzFuYjV_Zg==";
			this.loading = true;
			fetch(`https://lapd-cdnjs.azurewebsites.us/api/getPostId?code=${authCode}&serial=${serial}`)
				.then((res) => res.json())
				.then((data) => {
					this.postId = data[0].PostID;
				})
				.finally((this.loading = false));
		},
		signInUser() {
			this.uploading = true;
			this.loader = this.uploading;
			let student = {
				lastName: this.appUser.lastName,
				firstName: this.appUser.firstName,
				serial: this.appUser.serial,
				postId: this.postId,
				transport: this.transport,
			};
			var authCode = "fP_iSA2OrNxjL8PkHsPyySGMUIIxuuon0SVPXdSsex5OAzFuh741Jg==";
			var url = `https://lapd-cdnjs.azurewebsites.us/api/addAttendee?code=${authCode}`;

			fetch(url, {
				method: "POST",
				body: JSON.stringify({
					courseId: this.course.courseId,
					person: student,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					this.msg = data;
					this.uploading = false;
					this.loader = null;
					this.popup = true;
				})
				.catch((error) => {
					// enter your logic for when there is an error (ex. error toast)
					console.log(error);
				});
		},
		acknowledge() {
			this.reset();
			this.popup = false;
		},
	},

	watch: {
		appUser(val) {
			if (!val.serial) {
				this.userLoad = true;
			} else this.userLoad = false;
			this.getPostId(val.serial);
		},
		loader() {
			const l = this.loader;
			this[l] = !this[l];

			setTimeout(() => (this[l] = false), 3000);

			this.loader = null;
		},
	},
};
</script>

<style scoped>
.wrap {
	word-break: break-word;
}
.custom-loader {
	animation: loader 1s infinite;
	display: flex;
}
@-moz-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@-webkit-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@-o-keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
@keyframes loader {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
