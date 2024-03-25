<template>
	<v-container>
		<v-dialog width="700" v-model="props.videoModal" persistent>
			<v-card>
				<v-data-iterator :items="props.videoList" :items-per-page="1">
					<template v-slot:default="{ items }">
						<div class="d-flex justify-end pr-3 pt-3">
							<v-icon
								icon="mdi-close"
								color="red"
								size="x-large"
								@click="emits('closeModal')"
							></v-icon>
						</div>
						<p class="text-center py-2">{{ convertName(items[0].raw.filename) }}</p>
						<v-row justify="space-evenly">
							<v-col cols="6">
								<p class="text-center py-3">
									{{ items[0].raw.truck_name }} -
									<span class="text-red">{{ items[0].raw.load_name }}</span>
								</p>
							</v-col>
							<v-col cols="6">
								<p class="text-center py-3">{{ items[0].raw.register_name }}</p>
							</v-col>
						</v-row>
						<v-container class="video-container">
							<video
								type="video/webm"
								controls
								muted
								autoplay
								loop
								:src="useGeneral.VIDEO_PATH + items[0].raw.videoPath"
							/>
						</v-container>
					</template>

					<!-- header -->
					<template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
						<div class="d-flex align-center justify-center">
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
			</v-card>
		</v-dialog>
	</v-container>
</template>

<script setup>
	import { useGeneralStore } from '@/stores/GeneralStore'
	const useGeneral = useGeneralStore()

	const props = defineProps({
		videoList: { type: Array, required: true, default: null },
		videoModal: { type: Boolean, requiered: true, default: false },
	})

	const emits = defineEmits(['closeModal'])
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
