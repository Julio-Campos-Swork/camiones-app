<template>
	<v-app>
		<MainLayout />
	</v-app>
</template>

<script setup>
	import { onMounted } from 'vue'
	import { useGeneralStore } from './stores/GeneralStore'
	import MainLayout from '@/layouts/MainLayout'

	const useGeneral = useGeneralStore()

	onMounted(async () => {
		await useGeneral.validateSession()
	})
</script>
