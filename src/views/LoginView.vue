<template>
	<v-container fluid class="d-flex justify-center align-center">
		<v-card elevation="24" max-width="700" min-width="420">
			<v-card-title class="text-center bg-indigo">Login</v-card-title>
			<v-card-text class="mt-6">
				<v-text-field
					v-model="useGeneral.loginData.email"
					label="Nombre de Usuario o Email"
					:rules="userRules"
					variant="solo-filled"
					@keypress.enter="useGeneral.loginUser()"
				></v-text-field>
				<v-text-field
					v-model="useGeneral.loginData.password"
					label="Contraseña"
					type="password"
					variant="solo-filled"
					:rules="passRules"
					border
					@keypress.enter="useGeneral.loginUser()"
				></v-text-field>
			</v-card-text>
			<v-card-actions class="mb-2">
				<v-spacer></v-spacer>
				<v-btn
					:disabled="useGeneral.generalLoading"
					class="bg-green"
					rounded="lg"
					@click="useGeneral.loginUser()"
					>Iniciar Sesion</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-container>
</template>

<script setup>
	import { useGeneralStore } from '@/stores/GeneralStore'
	const useGeneral = useGeneralStore()
	const userRules = [
		(v) => !!v || 'Usuario requerido',
		(v) => (v && v.length > 4) || 'Usuario invalido',
	]
	const passRules = [
		(v) => !!v || 'Contraseña requerida',
		(v) => (v && v.length > 3) || 'Contraseña corta',
	]
</script>
