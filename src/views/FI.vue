<template>
	<v-container>
		<transition name="page" mode="out-in">
			<router-view />
		</transition>
		<SubmitSuccess></SubmitSuccess>
		<Loader></Loader>
	</v-container>
</template>

<script>
import SubmitSuccess from "../modules/fi/_submitSuccess.vue";
import Loader from "../components/core/_loader.vue";
export default {
	components: { SubmitSuccess, Loader },
	name: "FI",
	data: () => ({}),
	computed: {},
};
</script>
