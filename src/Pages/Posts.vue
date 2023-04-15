<template>
	<div class="container">
		<h1 class="text-6xl font-bold">POSTS</h1>

		<div class="p-4 mb-3 bg-white rounded-md shadow-md">
			<div class="items-center justify-between flex-grow mb-3">
				<textarea
					v-model.trim="postToAdd"
					class="w-full p-2 border rounded bg-gray-50"
					placeholder="What's on your mind?"
				></textarea>
				<button
					@click="addPost()"
					:disabled="!postToAdd"
					:class="{
						'bg-gray-200': !postToAdd,
						'bg-blue-500 hover:bg-blue-400 shadow': postToAdd,
					}"
					class="flex-shrink-0 px-2 py-1 text-sm text-white rounded place-self-start"
				>
					Add Post
				</button>
			</div>
		</div>
		<hr class="mx-4 my-8 border-t border-gray-300" />
		<div v-if="isLoading" class="text-center">Loading...</div>
		<div v-else-if="displayedPosts && displayedPosts.length" class="pt-5">
			<div v-for="post in displayedPosts" :key="'post-' + post.guid" class="">
				<div class="p-4 mb-3 bg-white rounded-md shadow-md">
					<div class="flex items-center justify-between mb-3">
						<h2 class="text-4xl font-medium">{{ post.name }}</h2>
						<span class="text-sm text-gray-500 shrink-0 place-self-start">
							<button @click="showPrompt(post)" class="text-blue-400">
								<PencilSquareIcon class="w-5 h-5 text-gray-700" />
							</button>
							<button @click="deletePost(post.guid)" class="text-red-400">
								<TrashIcon class="w-5 h-5 text-red-500" />
							</button>
						</span>
					</div>
				</div>
				<button
					@click="toggleModal(post.guid)"
					class="float-right px-2 py-1 my-2 mr-2 text-sm text-white bg-blue-500 rounded shadow hover:bg-blue-400"
				>
					Add Comment
				</button>

				<!-- Comments section for Post 1 -->
				<div class="p-4 bg-white rounded-md shadow-md">
					<h3 class="mb-4 text-lg font-medium">Comments:</h3>
					<div v-if="post.comments.length === 0" class="italic text-gray-400">
						No comments available
					</div>
					<div
						v-for="comment in post.comments.sort(
							(a, b) => new Date(b.date) - new Date(a.date)
						)"
						class="p-4 mb-1 bg-gray-100 rounded-md"
					>
						<div class="flex items-center gap-4 mb-4">
							<img
								class="w-12 h-12 rounded-full"
								src="https://via.placeholder.com/150"
								alt="Profile Picture"
							/>
							<div>
								<h4 class="text-lg font-medium">
									{{ getNameByGuid(comment.by) }}
								</h4>
								<span class="text-sm text-gray-500">{{
									convertDateFormat(comment.date)
								}}</span>
							</div>
						</div>
						<p class="text-gray-700">
							{{ comment.comment }}
						</p>
					</div>
				</div>
				<hr class="mx-4 my-8 border-t border-gray-300" />
			</div>
			<div class="flex items-center justify-center my-4">
				<div class="inline-flex">
					<button
						v-if="currentPage > 1"
						class="px-3 py-1 mx-1 text-gray-700 rounded-md hover:bg-gray-300"
						@click="currentPage--"
					>
						Prev
					</button>
					<button
						v-for="(i, idx) in pageCount"
						:key="'page-' + i"
						class="px-3 py-1 mx-1 text-gray-700 rounded-md hover:bg-gray-300"
						:class="{
							'bg-gray-300': idx + 1 == currentPage,
							'bg-gray-200': idx + 1 != currentPage,
						}"
						@click="goToPage(idx + 1)"
					>
						{{ i }}
					</button>
					<button
						v-if="currentPage < pageCount"
						class="px-3 py-1 mx-1 text-gray-700 rounded-md hover:bg-gray-300"
						@click="currentPage++"
					>
						Next
					</button>
				</div>
			</div>
		</div>
		<div v-else>No post</div>
		<div v-if="errorMessage">{{ errorMessage }}</div>
		<CommentModal
			v-if="showModal"
			@addComment="addComment"
			@close="showModal = false"
		></CommentModal>
		<PromptUser
			v-if="prompting"
			:title="'Update Post'"
			:placeholder="'What\'s on your mind'"
			:currentValue="currentName"
			@submit="handleUpdatePost"
			@close="prompting = false"
		></PromptUser>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/solid";
import { convertDateFormat } from "../utils";
import CommentModal from "../components/Modals/CommentModal.vue";
import PromptUser from "../components/Modals/PromptUser.vue";

const store = useStore();
const showModal = ref(false);
const prompting = ref(false);
const postToAdd = ref("");
const posts = computed(() => store.getters.getPosts);
const persons = computed(() => store.getters.getPersons);
const pageCount = computed(() => Math.ceil(store.getters.getPosts.length / 20));
const displayedPosts = computed(() => {
	const start = (currentPage.value - 1) * 20;
	const end = Math.min(start + 20, posts.value.length);
	return posts.value.slice(start, end);
});
const currentPage = ref(1);
const goToPage = (page) => {
	currentPage.value = page;
};
const isLoading = ref(false);
const errorMessage = ref("");

const getNameByGuid = (guid) => {
	const _person = persons.value && persons.value.find((p) => p.guid === guid);
	if (_person) return `${_person.first} ${_person.last}`;
	return guid;
};
const deletePost = (guid) => {
	store.commit("deletePost", guid);
	currentPage.value = Math.min(currentPage.value, pageCount.value);
};

const addComment = (comment) => {
	store.commit("addComment", { guid: currentPostGuid.value, comment });
};

const addPost = () => {
	if (!postToAdd) return;
	store.commit("addPost", postToAdd.value);
	postToAdd.value = "";
};
const handleUpdatePost = (name) => {
	store.commit("updatePost", {
		guid: currentPostGuid.value,
		name,
	});
	prompting.value = false;
};
const currentName = ref("");
const showPrompt = (post) => {
	currentPostGuid.value = post.guid;
	currentName.value = post.name;
	prompting.value = true;
};
onMounted(async () => {
	console.log(store);
	try {
		isLoading.value = true;
		await store.dispatch("fetchPosts");
		isLoading.value = false;
	} catch (error) {
		errorMessage.value = error;
	}
});
const currentPostGuid = ref("");
const toggleModal = (guid) => {
	currentPostGuid.value = guid;
	showModal.value = !showModal.value;
};
</script>

<style lang="scss" scoped></style>
