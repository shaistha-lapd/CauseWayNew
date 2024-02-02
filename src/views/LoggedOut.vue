<template>
	<v-container fill-height class="justify-center">
		<v-card flat color="transparent" height="90%" width="90%" max-width="600">
			<v-card-title class="text-center justify-center pa-4">
				<h3 class="font-weight-bold h4">You have been logged out.</h3>
			</v-card-title>
			<v-divider class="mx-4"></v-divider>
			<v-card-text>
				<v-card-title>You will be directed to the login page shortly...</v-card-title>
				<v-divider class="mx-4"></v-divider>
				<v-progress-linear indeterminate color="primary"></v-progress-linear>
			</v-card-text>
		</v-card>
	</v-container>
</template>
