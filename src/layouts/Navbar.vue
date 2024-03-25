<template>
	<v-app-bar color="indigo-accent-2" elevation="0">
		<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
		<div class="d-flex px-2 flex-column" v-if="!useGeneral.versionisUpdate">
			<p class="pt-1 text-center">¡Nueva versión disponible!</p>
			<v-btn color="yellow" @click="updateVersion()">Click para Actualizar</v-btn>
		</div>

		<v-spacer></v-spacer>
		<RouterLink to="/home">
			<v-app-bar-title class="text-center text-sm-caption text-md-h6"
				>Sistema de Registro Entradas y Salidas TSJ</v-app-bar-title
			>
		</RouterLink>
		<v-spacer></v-spacer>
		<p class="text-sm-caption">Tema</p>
		<v-btn
			@click="toggleTheme"
			:color="bText == 'Light' ? 'white' : 'black'"
			size="large"
			icon="mdi-theme-light-dark"
		></v-btn>
	</v-app-bar>
	<v-navigation-drawer
		v-model="drawer"
		class="bg-indigo-accent-2 z-1"
		disable-resize-watcher
	>
		<p class="text-center text-sm-caption text-md-h5 mt-2">Menu</p>
		<v-list color="transparent" class="mt-4">
			<RouterLink v-for="(link, index) in navLinks" :key="index" :to="link.linkTo"
				><v-list-item
					@click="drawer = !drawer"
					:prepend-icon="link.prependIcon"
					class="text-sm-body-1 text-md-subtitle-1"
					v-if="link.isVisible"
					>{{ link.listText }}
				</v-list-item></RouterLink
			>
		</v-list>

		<p class="text-center mt-4">
			Version: <span class="text-orange">{{ AppVersion }}</span>
		</p>
		<template v-slot:append>
			<div class="pa-8">
				<RouterLink to="/home" @click="drawer = !drawer">
					<v-btn color="red" block @click="useGeneral.logout()"> Cerrar Sesion </v-btn>
				</RouterLink>
			</div>
		</template>
	</v-navigation-drawer>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { useTheme } from 'vuetify'
	import { useGeneralStore } from '@/stores/GeneralStore'
	const useGeneral = useGeneralStore()
	const bText = ref('Light')
	const theme = useTheme()
	const drawer = ref(false)
	const AppVersion = ref(window?.appVersion)
	const toggleTheme = () => {
		theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
		bText.value = bText.value === 'Dark' ? 'Light' : 'Dark'
	}

	const navLinks = ref([
		{
			linkTo: '/home',
			prependIcon: 'mdi-home',
			listText: 'Inicio',
			isVisible: true,
		},
		{
			linkTo: '/entrada-salida',
			prependIcon: 'mdi-email-newsletter',
			listText: 'Registro de camiones',
			isVisible: computed(() => useGeneral.AUTH),
		},
		{
			linkTo: '/login',
			prependIcon: 'mdi-login',
			listText: 'Iniciar Sesión',
			isVisible: computed(() => !useGeneral.AUTH),
		},
		{
			linkTo: '/register',
			prependIcon: 'mdi-account-plus',
			listText: 'Registrar Nuevo Usuario',
			isVisible: computed(() => useGeneral.userData.user.id_level === 1),
		},
		{
			linkTo: '/subir-video',
			prependIcon: 'mdi-upload',
			listText: 'Subir Videos',
			isVisible: computed(() => useGeneral.userData.user.id_level === 1),
		},
		{
			linkTo: '/reportes',
			prependIcon: 'mdi-office-building-minus-outline',
			listText: 'Reportes',
			isVisible: computed(() => useGeneral.userData.user.id_level === 1),
		},
	])

	function updateVersion() {
		useGeneral.versionisUpdate = false
		location.reload()
	}
</script>

<style scoped>
	a:link,
	a:visited,
	a:active {
		text-decoration: none;
		color: white;
	}
</style>
