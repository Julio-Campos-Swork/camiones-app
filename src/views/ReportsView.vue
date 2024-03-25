<template>
	<v-container fluid>
		<v-tabs v-model="tab" align-tabs="center" color="cyan">
			<v-tab :value="1" @click="getToday()">Hoy</v-tab>
			<v-tab :value="2" @click="rangeDate()">Rango de Fechas</v-tab>
		</v-tabs>
		<v-window v-model="tab">
			<v-window-item :value="1">
				<Reportes
					v-if="useReport?.dataReport?.reports"
					:data-report="useReport?.dataReport?.reports"
					:initial-date="todayDate"
				/>
			</v-window-item>
			<v-window-item :value="2">
				<div class="d-flex justify-end">
					<div class="d-flex flex-column">
						<v-icon
							icon="mdi-reload"
							color="green"
							size="x-large"
							class="ml-5"
							@click="reload()"
						></v-icon>
						<span class="text-overline">Reiniciar</span>
					</div>
				</div>
				<div class="d-flex justify-space-evenly py-6">
					<v-btn
						color="indigo"
						@click="showInitialDate = !showInitialDate"
						v-show="!firstDateSelected"
						>Selecciona primera fecha</v-btn
					>
					<v-btn
						color="indigo"
						@click="showFinalDate = !showFinalDate"
						v-show="firstDateSelected"
						>Selecciona Segunda fecha fecha</v-btn
					>
				</div>
				<p class="text-center text-h6">
					Fecha Inicial:
					<span class="text-red font-weight-bold">{{
						setInitialDate ? setInitialDate : 'No selecionado'
					}}</span>
					- Fecha Final:
					<span class="text-red font-weight-bold">{{
						setFinalDate ? setFinalDate : 'No selecionado'
					}}</span>
				</p>
				<div class="d-flex justify-space-evenly">
					<v-date-picker
						v-if="showInitialDate"
						v-model="initialDate"
						title="Selecciona una fecha"
						color="primary"
						rounded="lg"
						:max="currentDate"
					></v-date-picker>
					<v-date-picker
						v-if="showFinalDate"
						v-model="finaldate"
						title="Selecciona una fecha"
						color="primary"
						rounded="lg"
						:max="currentDate"
					></v-date-picker>
				</div>
				<Reportes
					v-if="useReport?.dataReport?.reports"
					:data-report="useReport?.dataReport?.reports"
					:initial-date="setInitialDate"
					:final-date="setFinalDate"
				/>
			</v-window-item>
		</v-window>
	</v-container>
</template>

<script setup>
	import { ref, defineAsyncComponent, onMounted, watch } from 'vue'
	import { useReportStore } from '@/stores/ReportStore'
	const Reportes = defineAsyncComponent(() => import('@/components/Reports/Reports.vue'))
	const useReport = useReportStore()
	const tab = ref(null)
	const showInitialDate = ref(false)
	const showFinalDate = ref(false)
	const date = ref(new Date())
	const currentDate =
		date.value.getFullYear() +
		'-' +
		String(date.value.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(date.value.getDate()).padStart(2, '0')
	const todayDate = ref(currentDate)
	const initialDate = ref(null)
	const finaldate = ref(null)
	const setInitialDate = ref(null)
	const setFinalDate = ref(null)
	const firstDateSelected = ref(false)
	onMounted(async () => {
		await useReport.getReports(todayDate.value, '')
	})
	watch(initialDate, async (newValue) => {
		if (newValue instanceof Date) {
			const formattedDate =
				newValue.getFullYear() +
				'-' +
				String(newValue.getMonth() + 1).padStart(2, '0') +
				'-' +
				String(newValue.getDate()).padStart(2, '0')
			setInitialDate.value = formattedDate
			showInitialDate.value = false
			showFinalDate.value = true
			firstDateSelected.value = true
		}
	})

	watch(finaldate, async (newValue) => {
		useReport.dataReport.reports = null
		if (newValue instanceof Date) {
			const formattedDate =
				newValue.getFullYear() +
				'-' +
				String(newValue.getMonth() + 1).padStart(2, '0') +
				'-' +
				String(newValue.getDate()).padStart(2, '0')
			setFinalDate.value = formattedDate
			showFinalDate.value = false
			firstDateSelected.value = false
			await useReport.getReports(setInitialDate.value, setFinalDate.value)
		}
	})

	function reload() {
		setInitialDate.value = null
		setFinalDate.value = null
		firstDateSelected.value = false
		useReport.dataReport.reports = null
	}

	async function getToday() {
		useReport.dataReport.reports = null

		await useReport.getReports(todayDate.value, '')
	}
	function rangeDate() {
		useReport.dataReport.reports = null
	}
</script>
