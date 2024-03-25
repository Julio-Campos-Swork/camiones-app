<template>
	<v-container>
		<p class="text-center pb-4" v-if="!props.finalDate">
			Reportes de la fecha:
			<strong
				>{{ props.initialDate }}
				{{ props.finalDate ? '- ' + props.finalDate : '' }}</strong
			>
		</p>
		<div class="d-flex justify-space-evenly pt-3">
			<v-btn class="my-2 text-capitalize" color="blue" @click="showGeneralReport()"
				>Mostrar reporte general</v-btn
			>
			<v-btn class="my-2 text-capitalize" color="blue" @click="showFilterReport()"
				>Filtrar por tipo de camion</v-btn
			>
		</div>
		<v-row>
			<v-col cols="12" class="m-0 p-0">
				<div
					class="d-flex flex-column justify-space-around mx-2 w-100 py-4"
					v-if="showGeneral"
				>
					<div class="d-flex justify-space-around px-2">
						<p class="px-4">
							Total de entradas:
							<span class="text-red font-weight-bold">{{ dataEntradas.total }}</span>
						</p>
						<p class="px-4">
							Llenos:
							<span class="text-red font-weight-bold">{{ dataEntradas.llenos }}</span>
						</p>
						<p class="px-4">
							Vacios:
							<span class="text-red font-weight-bold">{{ dataEntradas.vacios }}</span>
						</p>
					</div>
					<div class="d-flex justify-space-around px-2">
						<p class="px-4">
							Total de Salidas:
							<span class="text-red font-weight-bold">{{ dataSalidas.total }}</span>
						</p>
						<p class="px-4">
							Llenos:
							<span class="text-red font-weight-bold">{{ dataSalidas.llenos }}</span>
						</p>
						<p class="px-4">
							Vacios:
							<span class="text-red font-weight-bold">{{ dataSalidas.vacios }}</span>
						</p>
					</div>

					<div class="d-flex justify-center pt-2">
						<p class="px-4 py-1 text-h6">
							Total Registros:
							<span class="text-red font-weight-bold">{{
								useReport?.dataReport?.reports.length
							}}</span>
						</p>
					</div>
				</div>
			</v-col>
			<v-col cols="12" v-if="showFilter" class="m-0 p-0">
				<p class="text-center text-h5 py-2">Filtrar</p>
				<div class="d-flex justify-center align-center">
					<v-responsive max-width="350">
						<v-select
							v-if="useReport?.dataReport.truckList"
							:items="useReport.dataReport.truckList"
							v-model="selectedTruck"
							item-value="truck_name"
							item-title="truck_name"
							label="Seleciona un tipo de camion"
							class="mx-2"
							@update:model-value="calculateTotalbyTruck()"
						></v-select>
					</v-responsive>
				</div>
				<div class="d-flex justify-space-evenly pb-2">
					<p class="" v-if="selectedTruck">
						ENTRADAS<br />
						Vacios:
						<span class="text-red font-weight-bold px-1">
							{{ totalTruckFilter.entradas.vacios }}</span
						><br />
						Llenos:
						<span class="text-red font-weight-bold px-1">
							{{ totalTruckFilter.entradas.llenos }}</span
						>
					</p>
					<p class="" v-if="selectedTruck">
						SALIDAS<br />
						Vacios:
						<span class="text-red font-weight-bold px-1">
							{{ totalTruckFilter.salidas.vacios }}</span
						><br />
						Llenos:
						<span class="text-red font-weight-bold px-1">
							{{ totalTruckFilter.salidas.llenos }}</span
						>
					</p>
				</div>
			</v-col>
		</v-row>
		<div class="d-flex justify-end py-2">
			<v-btn prepend-icon="mdi-video" color="blue-grey" @click="showVideo()"
				>Mostrar videos</v-btn
			>
		</div>
		<v-data-table
			:loading="loading"
			v-if="props.dataReport"
			:headers="headers"
			:items="dataShow"
			item-key="id_load_register"
			items-per-page="5"
		>
			<template v-slot:item.filename="{ item }">
				<p>{{ convertName(item.filename) }}</p>
			</template>
			<template v-slot:item.truck_name="{ item, index }">
				<p v-if="itemToEditIndex != index">{{ item.truck_name }}</p>
				<v-select
					v-else
					v-model="item.id_truck"
					:items="useReport.dataReport.truckList"
					item-value="id_truck"
					item-title="truck_name"
					variant="underlined"
				></v-select>
			</template>
			<template v-slot:item.load_name="{ item, index }">
				<p v-if="itemToEditIndex != index">{{ item.load_name }}</p>

				<v-select
					v-else
					v-model="item.id_load"
					:items="useRegister.dataToDisplay.loads"
					item-value="id_load"
					item-title="load_name"
					variant="underlined"
				></v-select>
			</template>
			<template v-slot:item.register_name="{ item, index }">
				<p v-if="itemToEditIndex != index">{{ item.register_name }}</p>
				<v-select
					v-else
					v-model="item.id_register_type"
					:items="useRegister.dataToDisplay.register_type"
					item-value="id_register_type"
					item-title="register_name"
					variant="underlined"
				></v-select>
			</template>
			<template v-slot:item.actions="{ item, index }">
				<div class="d-flex justify-space-around">
					<div
						class="d-flex flex-column px-1 aling-center"
						v-if="itemToEditIndex != index"
					>
						<v-icon
							color="blue"
							size="large"
							icon="mdi-pencil"
							@click="editElement(index)"
						></v-icon>
						<span class="text-caption">Editar</span>
					</div>
					<div class="d-flex flex-column px-1 aling-center" v-else>
						<v-icon
							color="green"
							size="large"
							icon="mdi-content-save"
							@click="saveElement(item)"
						></v-icon>
						<span class="text-caption">Guardar</span>
					</div>
					<div class="d-flex flex-column px-1 aling-center">
						<v-icon
							color="red"
							size="large"
							icon="mdi-trash-can"
							@click="deleteElement(item, index)"
						></v-icon>
						<span class="text-caption">Eliminar</span>
					</div>
				</div>
			</template>

			<template v-slot:loading>
				<v-skeleton-loader type="table-row@10"></v-skeleton-loader>
			</template>
		</v-data-table>

		<DialogVideo
			:video-modal="videoModal"
			:video-list="dataShow"
			@close-modal="videoModal = false"
		/>
		<v-dialog v-model="dialogConfirm" max-width="500">
			<v-card>
				<v-card-title class="text-center bg-indigo">Confirmacion</v-card-title>
				<v-card-text class="d-flex flex-column justify-center align-center">
					<p class="text-h6">Estás seguro que quieres descartar este video?</p>
					<p class="text-h6">Esta acción no se puede deshacer</p>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green" @click="handleDelete()">Confirmar</v-btn>
					<v-btn color="red" @click="cancelDelete()">Cancelar</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup>
	import { ref, reactive, onMounted, defineAsyncComponent, watch } from 'vue'
	import { useReportStore } from '@/stores/ReportStore'
	import { useRegisterStore } from '@/stores/RegisterStore'
	const DialogVideo = defineAsyncComponent(() =>
		import('@/components/Reports/DialogVideo.vue')
	)
	const useRegister = useRegisterStore()
	const props = defineProps({
		dataReport: { type: Array, required: false },
		initialDate: { type: String, required: false },
		finalDate: { type: String, required: false },
	})

	const useReport = useReportStore()
	const showGeneral = ref(false)
	const showFilter = ref(false)
	const dataShow = ref([])

	watch(dataShow, () => {
		calculateTotal()
	})

	const loading = ref(false)
	onMounted(async () => {
		loading.value = true
		dataShow.value = props.dataReport

		await useRegister.getRegisterData()
		calculateTotal()
		setTimeout(() => {
			loading.value = false
		}, 500)
	})

	const headers = ref([
		{ title: 'Fecha de Registro', key: 'filename' },
		{ title: 'Tipo de camion', key: 'truck_name' },
		{ title: 'Tipo de carga', key: 'load_name' },
		{ title: 'Tipo de Registro', key: 'register_name' },
		{ title: 'Usuario que registró', key: 'name' },
		{ title: 'Acciones', key: 'actions' },
	])

	const selectedTruck = ref(null)

	function showGeneralReport() {
		showGeneral.value = !showGeneral.value
		showFilter.value = false
		selectedTruck.value = null
		dataShow.value = props.dataReport
	}

	function showFilterReport() {
		showGeneral.value = false
		showFilter.value = !showFilter.value
	}

	const videoModal = ref(false)
	function showVideo() {
		videoModal.value = true
	}
	const itemToEditIndex = ref(null)

	async function editElement(index) {
		itemToEditIndex.value = index
	}

	async function saveElement(item) {
		await useReport.editRegisterByID(item)
		useReport.dataReport.reports[itemToEditIndex.value].truck_name =
			useRegister.dataToDisplay.trucks[item.id_truck - 1].truck_name
		useReport.dataReport.reports[itemToEditIndex.value].load_name =
			useRegister.dataToDisplay.loads[item.id_load - 1].load_name
		useReport.dataReport.reports[itemToEditIndex.value].register_name =
			useRegister.dataToDisplay.register_type[item.id_register_type - 1].register_name
		if (selectedTruck.value != null) {
			calculateTotalbyTruck()
		}
		calculateTotal()
		itemToEditIndex.value = null
	}

	const deletedIndex = ref(null)
	const deletedItem = ref(null)
	const dialogConfirm = ref(false)
	function deleteElement(item, index) {
		deletedItem.value = item
		deletedIndex.value = index
		dialogConfirm.value = true
	}

	async function handleDelete() {
		const response = await useReport.deleteRegisterByID(deletedItem.value)
		if (response) {
			let IndexFind = useReport.dataReport.reports.findIndex(
				(report) => report.id_load_register == deletedItem.value.id_load_register
			)
			if (IndexFind != -1) {
				useReport.dataReport.reports.splice(IndexFind, 1)
			}
		}
		dialogConfirm.value = false
		if (selectedTruck.value != null) calculateTotalbyTruck()
		calculateTotal()
	}

	function cancelDelete() {
		deletedItem.value = null
		deletedIndex.value = null
		dialogConfirm.value = false
	}

	const dataEntradas = reactive({
		total: 0,
		llenos: 0,
		vacios: 0,
		camiones: [],
	})
	const dataSalidas = reactive({
		total: 0,
		llenos: 0,
		vacios: 0,
		camiones: [],
	})
	const totalTruckFilter = reactive({
		entradas: { vacios: 0, llenos: 0 },
		salidas: { vacios: 0, llenos: 0 },
	})
	function calculateTotalbyTruck() {
		dataShow.value = null
		dataShow.value = props.dataReport
		totalTruckFilter.entradas.llenos = 0
		totalTruckFilter.entradas.vacios = 0
		totalTruckFilter.salidas.llenos = 0
		totalTruckFilter.salidas.vacios = 0
		dataShow.value.forEach((report) => {
			//entradas
			if (report.truck_name == selectedTruck.value && report.id_register_type == 1) {
				if (report.id_load == 1) totalTruckFilter.entradas.vacios += 1
				if (report.id_load == 2) totalTruckFilter.entradas.llenos += 1
			}
			//salidas
			if (report.truck_name == selectedTruck.value && report.id_register_type == 2) {
				if (report.id_load == 1) totalTruckFilter.salidas.vacios += 1
				if (report.id_load == 2) totalTruckFilter.salidas.llenos += 1
			}
		})
		const filteredTruck = dataShow.value.filter(
			(element) => element.truck_name == selectedTruck.value
		)
		dataShow.value = filteredTruck
	}
	function calculateTotal() {
		dataEntradas.total = 0
		dataEntradas.llenos = 0
		dataEntradas.vacios = 0
		dataSalidas.total = 0
		dataSalidas.llenos = 0
		dataSalidas.vacios = 0
		dataShow.value.forEach((report) => {
			//si es entrada
			if (report.id_register_type == 1) {
				dataEntradas.total += 1
				if (report.id_load == 1) {
					dataEntradas.vacios += 1
				}
				if (report.id_load == 2) {
					dataEntradas.llenos += 1
				}
			}
			//si es salida
			if (report.id_register_type == 2) {
				dataSalidas.total += 1
				if (report.id_load == 1) {
					dataSalidas.vacios += 1
				}
				if (report.id_load == 2) {
					dataSalidas.llenos += 1
				}
			}
		})
	}

	function convertName(filename) {
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
</script>
