<script setup lang="ts">
import { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = useSupabaseClient();

//HACK: At this time defineProps only accepts an object literal or interface within the same file, it does not accept an imported interface so we can't use Honk from ~~/types/index.ts | read more at: https://vuejs.org/guide/typescript/composition-api.html#syntax-limitations

const props = defineProps<{
  content: string;
  created_at: string | Date;
  likes: number;
  reposts: number;
  replys: number;
  user_id: string;
  post_id: number;
  imgURL?: string;
}>();

const username = ref<string>("");

const getUsername = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", props.user_id)
      .single();

    if (error) throw error;

    let output: any = data;
    if (!output.username) throw new Error("No username found");
    if (output.length > 1) throw new Error("More than one username found");
    if (typeof output.username !== "string") {
      throw new Error("Username is not a string");
    }

    //TODO: @ should be part of the username. Add a username type in supabase that enforces this. Right now the @ symbol is cosmetic.
    username.value = `@${output.username}`;
  } catch (error: any | unknown) {
    console.error(
      `Error:
      Message: ${error.message}
      Details: ${error.details}
      Hint: ${error.hint}
      Code: ${error.code}`
    );
  }
};

onBeforeMount(() => {
  getUsername();
});
</script>

<template>
  <div class="card lg:card-side bg-base-300 flex">
    <figure class="lg:w-3/5 sm:w-full">
      <img src="https://placeimg.com/400/500/arch" alt="Album" />
    </figure>
    <div class="card-body lg:w-2/3 sm:w-full">
      <p class="card-actions justify-end link link-accent link-hover">
        {{ username }}
      </p>
      <p class="prose text-base-content break-words">{{ content }}</p>
      <div
        class="card-actions justify-end flex-nowrap justify-content-center gap-4"
      >
        <SocialButton
          :initial-count="likes"
          :post-id="post_id"
          :action="'likes'"
          :initial-state="false"
          :icon="'heart.svg'"
        />
        <SocialButton
          :initial-count="reposts"
          :post-id="post_id"
          :action="'reposts'"
          :initial-state="false"
          :icon="'loop.svg'"
        />
        <SocialButton
          :initial-count="replys"
          :post-id="post_id"
          :action="'replys'"
          :initial-state="false"
          :icon="'chatBubble.svg'"
        />
      </div>
    </div>
  </div>
</template>
