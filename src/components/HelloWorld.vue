<script setup>
import { ref } from "vue";

defineProps({
	msg: String,
});

const count = ref(0);
</script>

<template>
	<h1>{{ msg }}</h1>

	<div class="card">
		<button type="button">
			<router-link
				class="px-2 py-1 text-white bg-blue-500 rounded shadow hover:bg-blue-400"
				:to="{ path: '/posts' }"
				>Go to Posts Page</router-link
			>
		</button>
	</div>
</template>
