<script setup lang="ts">
import type { Database } from "~/types/database.types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const content = ref<string>("");
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
  if (!user.value) throw new Error("User is not logged in!");
  try {
    //TODO: design custom alert
    validateContent();

    const { error } = await supabase.from("honks").insert({
      created_at: new Date().toISOString(),
      user_id: user.value.id,
      content: content.value,
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
    <div class="prose w-full flex flex-col gap-2">
      <span
        class="indicator-item badge"
        :class="{
          'indicator-item badge badge-error text-error-content':
            characterCount < 0,
          'indicator-item badge badge-primary text-primary-content':
            characterCount >= 0,
        }"
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
