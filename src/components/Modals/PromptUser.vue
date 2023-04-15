<template>
	<div class="fixed inset-0 z-10 overflow-y-auto">
		<div class="flex items-center justify-center min-h-screen px-4">
			<div class="fixed inset-0 transition-opacity" aria-hidden="true">
				<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>
			<div
				class="overflow-hidden transition-all transform bg-white rounded-lg shadow-xl sm:w-full md:w-1/2 lg:w-1/3"
			>
				<div class="p-4 bg-gray-100">
					<h2 class="mb-2 text-xl font-bold">{{ title }}</h2>
					<div>
						<div class="mb-4">
							<textarea
								class="w-full px-3 py-2 leading-tight text-gray-700 border rounded focus:outline-none focus:shadow-outline"
								id="comment"
								:placeholder="placeholder"
								v-model.trim="userInput"
							></textarea>
						</div>
						<div class="flex items-center justify-end">
							<button
								class="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
								type="button"
								@click="submit()"
							>
								Submit
							</button>
							<button
								class="px-4 py-2 ml-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline"
								type="button"
								@click="$emit('close')"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const props = defineProps(["title", "placeholder", "currentValue"]);
const emit = defineEmits(["close", "submit"]);
const userInput = ref();
const submit = () => {
	emit("submit", userInput.value);
};
onMounted(() => {
	if (props.currentValue) {
		userInput.value = props.currentValue;
	}
});
</script>
