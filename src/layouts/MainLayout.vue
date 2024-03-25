<template>
	<v-main>
		<Navbar />
		<router-view class="h-100"></router-view>
		<Notifications />
		<Loader />
		<Footer />
	</v-main>
</template>

<script setup>
	import Navbar from './Navbar'
	import Footer from './Footer'
	import Notifications from '@/components/utils/Notifications.vue'
	import Loader from '@/components/utils/Loader.vue'
</script>
