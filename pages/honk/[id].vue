<script setup lang="ts">
import type { Database } from "~/types/database.types";
const supabase = useSupabaseClient<Database>();
const route = useRoute();
const postId = route.params.id as string;
const loading = ref<boolean>(false);

const honk = ref<Honk>({
  content: "",
  created_at: "",
  likes: 0,
  reposts: 0,
  replys: 0,
  user_id: "",
  post_id: 0,
  imgURL: "",
});

onBeforeMount(async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from("honks")
      .select("*")
      .eq("post_id", postId)
      .single();

    if (error) throw error;
    honk.value = data;
  } catch (error: any | unknown) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <LazyFeedOtherHonk v-bind="honk" v-if="!loading" />

  <FeedPostLoading v-else />
</template>
