<template>
	<v-container fill-height fluid max-width="500" class="justify-center">
		<v-card rounded width="100%" max-width="500" class="d-flex flex-column px-0 py-0 parent-container">
			<v-container class="pa-0">
				<div v-if="!!fi">
					<ReviewFi ref="review" :person="fi.person" :vehicle="fi.vehicle" :incident="fi.incident" :data="fi.data" :text="text"> </ReviewFi>
				</div>
				<v-card-text v-else> Nothing to see here... yet </v-card-text>
			</v-container>
		</v-card>
		<v-speed-dial v-model="fab" class="fab" direction="left" transition="slide-y-reverse" :open-on-hover="$vuetify.breakpoint.mdAndUp">
			<template v-slot:activator>
				<v-btn v-model="fab" color="#00BFA5" dark fab>
					<v-icon v-if="fab"> mdi-close </v-icon>
					<v-icon v-else x-large> mdi-gesture-tap </v-icon>
				</v-btn>
			</template>
			<v-btn v-if="!!fi && fi.data.status === statuses.READY" fab :loading="loading" dark small color="primary" @click.stop="submit()">
				<v-icon>mdi-cloud-upload</v-icon>
			</v-btn>
			<v-btn v-if="!!fi && showButton && fi.data.status != statuses.ACCEPTED" fab small color="warning" @click.stop="edit()">
				<v-icon>mdi-pencil</v-icon>
			</v-btn>

			<v-btn v-if="!!fi && showButton && fi.data.status == statuses.ABANDONED" fab small color="error" @click.stop="deleteFi()">
				<v-icon>mdi-trash-can</v-icon>
			</v-btn>
			<v-btn fab small color="secondary" @click="print()"> <v-icon>mdi-printer</v-icon> </v-btn>
			<v-btn fab small color="grey lighten-2" :disabled="text > 1" @click.stop="zoomIn">
				<v-icon large color="grey darken-2">mdi-magnify-plus-outline</v-icon>
			</v-btn>
			<v-btn fab small color="grey lighten-2" :disabled="text < 1" @click.stop="zoomOut">
				<v-icon large color="grey darken-2">mdi-magnify-minus-outline</v-icon>
			</v-btn>
		</v-speed-dial>
	</v-container>
</template>

<script>
import ReviewFi from "./new-fi/ReviewFi.vue";
import { mapActions, mapGetters } from "vuex";
export default {
	components: { ReviewFi },
	name: "ViewFi",

	data: () => ({
		fab: false,
		loading: false,
		text: 0,
		fi: null,
		submitted: false,
	}),

	computed: {
		...mapGetters({
			appUser: "User/appUser",
			statuses: "Fi/statuses",
		}),
		showButton() {
			return this.fi.incident.incOfficers.findIndex((o) => o.serial === this.appUser.serial) > -1;
		},
	},
	methods: {
		...mapActions({
			postFi: "Fi/submit",
			getFi: "Fi/getFiFromDb",
			editFi: "Fi/editFi",
			save: "Fi/saveProgress",
			delFi: "Fi/deleteFromDex",
		}),
		async submit() {
			this.loading = true;
			this.$store.commit("Fi/UPDATE_NARRATIVE");
			await this.postFi();
			this.submitted = true;
			this.loading = false;

			setTimeout(() => {
				this.fab = false;
			}, 500);
		},
		async edit() {
			this.loading = true;
			await this.editFi(this.$route.params.id);
			this.loading = false;

			setTimeout(() => {
				this.$router.push("/fi/new");
				this.fab = false;
			}, 500);
		},
		async deleteFi() {
			this.loading = true;
			await this.delFi(this.$route.params.id);
			this.loading = false;

			setTimeout(() => {
				this.$router.push("/");
				this.fab = false;
			}, 500);
		},
		print() {
			this.$refs.review.print();
		},
		zoomIn() {
			this.text++;
		},
		zoomOut() {
			this.text--;
		},
	},
	async mounted() {
		this.$store.state.loading = true;
		this.fi = await this.getFi(this.$route.params.id);
		this.$store.state.loading = false;
	},
	beforeRouteLeave(to, from, next) {
		if (this.fi.data.status === this.statuses.READY && !this.submitted) {
			const reply = window.confirm("Your FI has not been submitted yet. Are you sure you want to leave?");
			if (!reply) {
				// deny navigation
				next(false);
			} else {
				this.fi.data.status = this.statuses.ABANDONED;
				this.save(this.fi);

				next(true);
			}
		} else {
			next(true);
		}
	},
};
</script>

<style scoped>
.skinny {
	max-width: 25vw;
	position: relative;
}
.parent-container {
	overflow-y: scroll;
	max-height: 86vh;
}
.fab {
	position: absolute;
	bottom: 25px;
	right: 25px;
}
/* .v-speed-dial {
	transform: scale(1);
	animation: pulse 2s infinite;
}
@keyframes pulse {
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
} */ ;
</style>
