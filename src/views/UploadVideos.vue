<template>
	<v-container>
		<h1 class="text-center text-h4 py-8">Subir videos</h1>

		<v-row justify="center" class="m-0 p-0">
			<v-col cols="12" md="5">
				<v-responsive max-width="350">
					<div class="d-flex flex-column">
						<v-text-field
							v-model="dateSelected"
							label="Elije una nombre  para el directorio"
						>
						</v-text-field>
						<v-btn
							color="green"
							class="mx-3"
							@click="handleCreateFolder()"
							:disabled="folderAlreadyExists"
							>Crear directorio</v-btn
						>
					</div>
				</v-responsive>
				<v-container class="d-flex justify-start align-center">
					<v-date-picker
						v-model="datePickerSelected"
						title="Selecciona una fecha"
						color="primary"
						rounded="lg"
						:max="currentDate"
					>
						<template v-slot:header>
							<span class="px-6 text-h5">Fecha: {{ dateSelected }}</span>
						</template>
					</v-date-picker>
				</v-container>
			</v-col>
			<v-col cols="12" md="7" v-if="folderAlreadyExists">
				<p class="text-center text-h5 pb-4">
					La fecha selecionada
					<span class="text-indigo font-weight-bold">{{ dateSelected }}</span> <br />
					tiene un folder existente
				</p>
				<div class="d-flex justify-center py-4">
					<v-btn :disabled="!selectedFiles" color="green" @click="habldeSelectedFiles"
						>Guardar Archivos</v-btn
					>
				</div>
				<v-file-input
					label="Selecciona o arrastra los videos"
					accept=".webm"
					multiple
					counter
					v-model="selectedFiles"
				>
					<template v-slot:selection="{ fileNames }">
						<template v-for="fileName in fileNames" :key="fileName">
							<v-chip size="x-small" label color="primary" class="me-1">
								{{ fileName }}
							</v-chip>
						</template>
					</template>
				</v-file-input>
			</v-col>
			<v-col cols="12" md="7" v-else>
				<p class="text-center text-h5 pb-4">
					La fecha selecionada
					<span class="text-indigo font-weight-bold">{{ dateSelected }}</span> <br />No
					existe, por favor crea el director
				</p>
			</v-col>
		</v-row>
		<v-row justify="center" v-if="folderAlreadyExists">
			<v-btn size="large" color="red" @click="handleDelete()"
				>Eliminar Directorio y todos sus archivos</v-btn
			>
		</v-row>
	</v-container>
</template>

<script setup>
	import { ref, reactive, watch, onMounted, computed } from 'vue'
	import { useUploadStore } from '@/stores/UploadStore'
	const useUpload = useUploadStore()

	const selectedFiles = ref(null)
	const fileNames = ref(null)
	const date = ref(new Date())
	const currentDate =
		date.value.getFullYear() +
		'-' +
		String(date.value.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(date.value.getDate()).padStart(2, '0')
	const dateSelected = ref(currentDate)
	const datePickerSelected = ref(null)

	watch(datePickerSelected, (newValue) => {
		if (newValue instanceof Date) {
			const formattedDate =
				newValue.getFullYear() +
				'-' +
				String(newValue.getMonth() + 1).padStart(2, '0') +
				'-' +
				String(newValue.getDate()).padStart(2, '0')
			dateSelected.value = formattedDate
		}
	})
	async function handleCreateFolder() {
		useUpload.createFolder(dateSelected.value)
	}

	const folderAlreadyExists = computed(() => {
		if (useUpload.directoryList != null) {
			return useUpload.directoryList.includes(dateSelected.value)
		}
	})

	async function habldeSelectedFiles() {
		const isSaved = await useUpload.saveFilesIntoDirectory(
			selectedFiles.value,
			dateSelected.value
		)
		if (isSaved) selectedFiles.value = null
	}

	async function handleDelete() {
		await useUpload.deleteDirectory(dateSelected.value)
	}

	onMounted(async () => {
		await useUpload.getAllDirectories()
	})
</script>

<style scoped></style>
