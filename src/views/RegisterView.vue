<template>
	<v-container class="d-flex justify-center align-center">
		<v-card elevation="24" max-width="1000" min-width="620">
			<v-card-title class="text-center bg-indigo">Registrar</v-card-title>
			<v-card-text class="mt-6">
				<v-text-field
					v-model="useGeneral.registerData.name"
					label="Nombre"
					:rules="userRules"
					variant="solo-filled"
					class="py-2"
				></v-text-field>
				<v-text-field
					v-model="useGeneral.registerData.email"
					label="Email"
					type="email"
					:rules="emailRules"
					variant="solo-filled"
					class="py-2"
				></v-text-field>
				<v-text-field
					v-model="useGeneral.registerData.password"
					label="Contraseña"
					type="password"
					variant="solo-filled"
					class="py-2"
					:rules="passRules"
					border
					@keypress.enter="handleRegister()"
				></v-text-field>
				<v-select
					v-model="useGeneral.registerData.id_level"
					:items="userType"
					label="Selecciona Tipo de usuario"
					item-title="name"
					item-value="id_level"
				></v-select>
				<div class="d-flex justify-center">
					<v-btn
						:disabled="
							useGeneral.registerData.name == null ||
							useGeneral.registerData.email == null ||
							useGeneral.registerData.password == null
						"
						class="bg-green"
						rounded="lg"
						@click="handleRegister()"
						>Registrar</v-btn
					>
				</div>
			</v-card-text>
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
		(v) => (v && v.length >= 6) || 'La contraseña debe ser minimo 6 caracteres',
	]

	const emailRules = [
		(v) => !!v || 'Correo requerido',
		(v) =>
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				v
			) || 'Ingresa correo válido',
	]

	async function handleRegister() {
		await useGeneral.registerUser()
	}

	const userType = [
		{
			id_level: 0,
			name: 'Usuario',
		},
		{ id_level: 1, name: 'Administrador' },
	]
</script>
