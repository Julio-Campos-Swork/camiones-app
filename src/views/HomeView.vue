<template>
	<v-container class="d-flex flex-column justify-center align-center">
		<h1 class="text-center text-h2 pb-16">Bienvenido</h1>
		<router-link to="/entrada-salida" v-if="useGeneral.AUTH">
			<v-btn size="large" color="green">Registrar Entradas / Salidas</v-btn>
		</router-link>
		<router-link to="/login" v-else>
			<v-btn size="large" color="green">Login</v-btn>
		</router-link>
	</v-container>
</template>

<script setup>
	import { useGeneralStore } from '@/stores/GeneralStore'
	const useGeneral = useGeneralStore()
</script>
