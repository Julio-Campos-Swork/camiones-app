<template>
	<div class="centerPossition" v-if="useGeneral.generalLoading">
		<v-progress-circular color="primary" indeterminate :size="72"></v-progress-circular>
	</div>
</template>

<script setup>
	import { useGeneralStore } from '@/stores/GeneralStore'
	const useGeneral = useGeneralStore()
</script>

<style>
	.centerPossition {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 9999;
	}
</style>
