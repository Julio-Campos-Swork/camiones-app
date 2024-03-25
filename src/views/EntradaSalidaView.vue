<template>
	<v-container fluid class="px-8">
		<h1 class="text-center text-h4 py-8">Registro Entrada/Salida</h1>
		<v-row>
			<v-col cols="12" md="6">
				<v-row justify="center" v-if="useRegister?.dataToDisplay">
					<v-col cols="12">
						<v-radio-group inline label="Tipo de registro" v-model="registerTypeSelected">
							<v-radio
								v-for="register in useRegister.dataToDisplay.register_type"
								:label="register.register_name"
								:value="register.id_register_type"
								color="success"
							></v-radio>
						</v-radio-group>
					</v-col>
					<v-col cols="12">
						<v-radio-group inline label="Tipo de camion" v-model="truckSelected">
							<v-radio
								v-for="truck in useRegister.dataToDisplay.trucks"
								:label="truck.truck_name"
								:value="truck.id_truck"
								color="success"
							></v-radio>
						</v-radio-group>
					</v-col>
					<v-col cols="12">
						<v-radio-group inline label="Estado de carga" v-model="loadSelected">
							<v-radio
								v-for="load in useRegister.dataToDisplay.loads"
								:label="load.load_name"
								:value="load.id_load"
								color="success"
							></v-radio>
						</v-radio-group>
					</v-col>
				</v-row>
				<div v-else class="d-flex justify-center align-center">
					<p class="text-h5">Cargando...</p>
				</div>

				<div class="d-flex justify-center align-center pt-8">
					<v-btn
						append-icon="mdi-check-circle-outline"
						color="green"
						rounded="lg"
						class="mx-6"
						:disabled="!fileName"
						@click="handleSaveData()"
						>Añadir registro</v-btn
					>
					<v-btn
						color="indigo"
						rounded="lg"
						:disabled="viewRegisters.length == 0"
						@click="handleConfirm()"
						>Completar video</v-btn
					>
				</div>
				<div v-if="viewRegisters.length > 0">
					<RegisterList
						:registerList="viewRegisters"
						:fileName="fileName"
						@deleteRegister="handleDeleteRegister"
					/>
				</div>
			</v-col>

			<v-col cols="12" md="6">
				<div class="d-flex justify-start">
					<v-responsive class="" max-width="200" v-if="!isMobile">
						<v-text-field
							v-model="dateSelected"
							label="Selecciona una fecha"
							prepend-icon="mdi-calendar"
							variant="underlined"
							@click="showCalendar = !showCalendar"
							@click:prepend-icon="showCalendar = !showCalendar"
						></v-text-field>
					</v-responsive>
					<div class="d-flex flex-column" v-else @click="showCalendar = !showCalendar">
						<span class="text-center">Selecciona una fecha</span>
						<p class="text-center">
							<v-icon icon="mdi-calendar"> </v-icon> {{ dateSelected }}
						</p>
					</div>
				</div>
				<v-row justify="center" class="m-0 p-0">
					<v-container class="d-flex justify-center align-center" v-if="showCalendar">
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

					<v-col cols="12" v-if="useRegister?.videoList != null && !showCalendar">
						<v-data-iterator :items="useRegister?.videoList" :items-per-page="1">
							<template v-slot:default="{ items }">
								<p class="text-center py-2">{{ convertName(items[0].raw.src) }}</p>
								<v-container class="video-container">
									<video
										type="video/webm"
										controls
										muted
										autoplay
										loop
										:src="useGeneral.VIDEO_PATH + dateSelected + '/' + items[0].raw.src"
									/>
								</v-container>
								<div class="d-flex justify-center py-6">
									<v-btn color="red" @click="showModal = !showModal"
										>Descartar este video</v-btn
									>
								</div>
							</template>

							<!-- header -->
							<template v-slot:header="{ page, pageCount, prevPage, nextPage }">
								<div
									class="d-flex align-center justify-center"
									v-if="useRegister?.videoList != null"
								>
									<v-icon
										:disabled="page === 1"
										icon="mdi-arrow-left"
										rounded
										@click="prevPage"
									></v-icon>

									<div class="mx-2 text-caption">Video {{ page }} de {{ pageCount }}</div>

									<v-icon
										:disabled="page >= pageCount"
										icon="mdi-arrow-right"
										rounded
										@click="nextPage"
									></v-icon>
								</div>
							</template>
							<template v-slot:no-data>
								<p class="text-center py-4">No hay video en esta fecha</p>
							</template>
						</v-data-iterator>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
		<v-dialog v-model="showModal" max-width="600">
			<v-card>
				<v-card-title class="text-center bg-indigo">Confirmacion</v-card-title>
				<v-card-text class="d-flex flex-column justify-center align-center">
					<p class="text-h6">Estás seguro que quieres descartar este video?</p>
					<p class="text-h6">Esta acción no se puede deshacer</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green" @click="handleDiscart()">Confirmar</v-btn>
					<v-btn color="red" @click="showModal = !showModal">Cancelar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup>
	import { ref, onMounted, watch, computed } from 'vue'
	import { useRegisterStore } from '@/stores/RegisterStore'
	import { useGeneralStore } from '@/stores/GeneralStore'
	import { useDisplay } from 'vuetify'
	import { defineAsyncComponent } from 'vue'
	const useGeneral = useGeneralStore()
	const useRegister = useRegisterStore()
	const registerTypeSelected = ref(1)
	const truckSelected = ref(1)
	const loadSelected = ref(1)
	const showCalendar = ref(true)
	const showModal = ref(false)
	const RegisterList = defineAsyncComponent(() => import('@/components/RegisterList.vue'))

	onMounted(async () => {
		useRegister.getRegisterData()
	})
	const video = ref()
	const date = ref(new Date())
	const currentDate =
		date.value.getFullYear() +
		'-' +
		String(date.value.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(date.value.getDate()).padStart(2, '0')
	const dateSelected = ref(currentDate)
	const datePickerSelected = ref(null)

	watch(datePickerSelected, async (newValue) => {
		if (newValue instanceof Date) {
			const formattedDate =
				newValue.getFullYear() +
				'-' +
				String(newValue.getMonth() + 1).padStart(2, '0') +
				'-' +
				String(newValue.getDate()).padStart(2, '0')
			dateSelected.value = formattedDate
		}
		await handleDateVideo()
		viewRegisters.value = []
		showCalendar.value = false
	})

	watch(registerTypeSelected, () => {
		registerTypeSelected.value == 2 ? (loadSelected.value = 2) : (loadSelected.value = 1)
	})
	async function handleSaveData() {
		const newRegister = {
			filename: fileName.value,
			id_load: loadSelected.value,
			id_register_type: registerTypeSelected.value,
			id_truck: truckSelected.value,
			register_date: dateSelected.value,
		}
		viewRegisters.value.push(newRegister)
		registerTypeSelected.value = 1
		truckSelected.value = 1
		loadSelected.value = 1
	}
	function refreshRegister() {
		viewRegisters.value = []
	}

	async function handleDateVideo() {
		await useRegister.getVideoByDate(dateSelected.value)
	}

	const { name } = useDisplay()

	const isMobile = computed(() => {
		// name is reactive and
		// must use .value
		switch (name.value) {
			case 'xs':
				return true
			case 'sm':
				return true
			case 'md':
				return false
			case 'lg':
				return false
			case 'xl':
				return false
			case 'xxl':
				return false
		}
	})

	const fileName = ref(null)

	function convertName(filename) {
		fileName.value = filename

		let splitedString = filename.split('_')
		const indexDate = splitedString.findIndex(
			(element) => element.length == 8 && typeof Number(element) === 'number'
		)
		const indexTime = splitedString.findIndex(
			(element) => element.length == 6 && typeof Number(element) === 'number'
		)

		let date = splitedString[indexDate].replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
		let time = splitedString[indexTime].replace(/^(\d{2})(\d{2})(\d{2})$/, '$1:$2:$3')
		return date + ' - ' + time
	}
	async function handleDiscart() {
		await useRegister.discartVideo(dateSelected.value, fileName.value)
		let indexOfVideo = useRegister?.videoList.findIndex(
			(element) => element.src == fileName.value
		)
		if (indexOfVideo != -1) {
			useRegister.videoList.splice(indexOfVideo, 1)
		}
		showModal.value = false
	}

	async function handleConfirm() {
		const response = await useRegister.saveNewRegisters(viewRegisters.value)
		if (response) {
			viewRegisters.value = []
			await useRegister.confirmVideo(dateSelected.value, fileName.value)
		}
		const indexOfVideo = useRegister?.videoList.findIndex(
			(element) => element.src == fileName.value
		)
		if (indexOfVideo != -1) {
			useRegister.videoList.splice(indexOfVideo, 1)
		}
	}

	const viewRegisters = ref([])
	watch(fileName, () => {
		refreshRegister()
	})

	function handleDeleteRegister(registerIndex) {
		viewRegisters.value.forEach((element, index) => {
			if (registerIndex == index) {
				viewRegisters.value.splice(registerIndex, 1)
			}
		})
	}
</script>

<style scoped>
	.video-container {
		max-width: 100%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-content: center;
	}
	.video-container video {
		width: 100%;
		height: auto;
		display: block;
		aspect-ratio: 16/9;
	}
</style>
