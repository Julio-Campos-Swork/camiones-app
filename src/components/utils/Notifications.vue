<template>
	<v-snackbar
		rounded="xl"
		v-model="useGeneral.statusNotification"
		:color="useGeneral.messageColor"
		location="top"
		:timeout="5000"
		height="85"
	>
		<p class="text-center text-h5">{{ useGeneral.messageText }}</p></v-snackbar
	>
</template>

<script setup>
	import { useGeneralStore } from '@/stores/GeneralStore'
	const useGeneral = useGeneralStore()
</script>
