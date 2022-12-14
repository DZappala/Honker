<script setup lang="ts">
import { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = useSupabaseClient();
const user = useSupabaseUser();

const content = ref<string>("");
const likes = ref<number>();
const reposts = ref<number>();
const replys = ref<number>();

const characterCount = computed(() => {
  return 256 - content.value.length;
});

const validateContent = () => {
  if (content.value.length > 256) {
    throw new Error("Honk cannot be longer than 256 characters");
  }
  if (!content.value || content.value == "") {
    throw new Error("Honk cannot be empty");
  }
};

const handleHonk = async () => {
  try {
    //TODO: design custom alert
    validateContent();

    const { error } = await supabase.from("honks").insert({
      created_at: new Date().toISOString(),
      user_id: user.value?.id,
      content: content.value,
      likes: likes.value,
      reposts: reposts.value,
      replys: replys.value,
    });

    if (error) throw error;
  } catch (error: any | unknown) {
    console.error(error);
  } finally {
    content.value = "";
  }
};
</script>

<template>
  <form
    class="form-control flex flex-col gap-4 items-end w-full"
    @submit.prevent="handleHonk"
  >
    <div class="indicator prose w-full">
      <span
        :class="
          characterCount < 0
            ? 'indicator-item badge badge-error text-error-content'
            : 'indicator-item badge badge-primary text-primary-content'
        "
        >{{ characterCount }}</span
      >
      <textarea
        class="textarea textarea-primary resize-none w-full"
        placeholder="What's on your mind?"
        v-model="content"
      />
    </div>
    <button
      class="btn btn-primary shadow-md shadow-primary hover:shadow-primary-focus w-1/3"
    >
      Honk!
    </button>
  </form>
</template>
