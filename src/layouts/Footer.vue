<template>
	<v-layout id="footer">
		<v-footer border class="bg-indigo-accent-2 d-flex flex-column foter">
			<v-divider></v-divider>

			<p class="pt-2 pb-2 text-light-blue-accent-1">{{ date }}</p>
		</v-footer>
	</v-layout>
</template>

<script setup>
	import { ref } from 'vue'
	const date = ref('')
	const getFecha = () => {
		// console.log(new Date())
		setInterval(function () {
			const addZero = (i) => {
				if (i < 10) {
					i = '0' + i
				}
				return i
			}

			const currentDate = new Date()

			date.value =
				addZero(currentDate.getHours()) +
				':' +
				addZero(currentDate.getMinutes()) +
				':' +
				addZero(currentDate.getSeconds()) +
				' - ' +
				addZero(currentDate.getDate()) +
				'/' +
				addZero(currentDate.getMonth() + 1) +
				'/' +
				addZero(currentDate.getFullYear())
		}, 1000)
	}
	getFecha()
</script>

<style scoped>
	.foter {
		position: relative;
		bottom: 0;
		width: 100%;
	}
	#footer {
		display: flex;
		flex-direction: column;
		/* min-height: 100vh; */
	}
</style>
