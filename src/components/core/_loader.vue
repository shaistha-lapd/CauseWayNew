<template>
	<v-overlay :opacity="1" :value="$store.state.loading">
		<v-progress-circular color="primary" indeterminate :size="86"> Loading... </v-progress-circular>
	</v-overlay>
</template>

<script></script>
