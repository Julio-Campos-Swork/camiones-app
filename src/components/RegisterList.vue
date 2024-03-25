<template>
	<v-container>
		<div class="d-flex flex-column py-3">
			<p class="text-center py-4">Registros actuales</p>
			<div
				class="text-center d-flex justify-center px-2 py-2"
				v-for="(register, index) in props.registerList"
			>
				<p class="px-2">{{ register.id_register_type == 1 ? 'Entrada' : 'Salida' }}</p>
				||
				<p class="px-2">{{ returnTruck(register.id_truck) }}</p>
				||
				<p class="px-2">{{ register.id_load == 1 ? 'Vacio' : 'Lleno' }}</p>
				<v-icon
					icon="mdi-delete"
					color="red"
					@click="emits('deleteRegister', index)"
				></v-icon>
			</div>
		</div>
	</v-container>
</template>

<script setup>
	const props = defineProps(['registerList', 'fileName'])
	const emits = defineEmits(['deleteRegister'])
	function returnTruck(id_truck) {
		switch (parseInt(id_truck)) {
			case 1:
				return 'Trailer'
			case 2:
				return 'Torton'
			case 3:
				return 'Rabon'
			case 4:
				return 'Full'
			case 5:
				return 'Otros'
		}
	}
</script>
