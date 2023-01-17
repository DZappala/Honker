<script setup lang="ts">
import type { Database } from "~/types/database.types";
import { postActions } from "~/types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

/**
 * Props
 * @prop {postActions} action - The action the user is performing. I.E. reply, repost, or post
 * @prop {number} reference - The post_id of the honk the user is replying to or reposting
 */
const props = defineProps<{
  action: postActions;
  reference?: number;
}>();

const emit = defineEmits(["reply", "repost"]);

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

    switch (props.action) {
      case postActions.REPLY:
        const { error: errorReply } = await supabase.from("honks").insert({
          created_at: new Date().toISOString(),
          user_id: user.value.id,
          content: content.value,
          is_reply: true,
          is_repost: false,
          reference: props.reference,
        });
        if (errorReply) throw errorReply;
        await supabase
          .from("honks")
          .select("replys")
          .eq("post_id", props.reference)
          .single()
          .then((res) => {
            if (res.error) throw new Error(res.error.message);
            if (!res.data) throw new Error("No reply found");
            supabase
              .from("honks")
              .update({ replys: res.data.replys + 1 })
              .eq("post_id", props.reference);
          });

        emit("reply", true);

        break;
      case postActions.REPOST:
        const { error: errorRepost } = await supabase.from("honks").insert({
          created_at: new Date().toISOString(),
          user_id: user.value.id,
          content: content.value,
          is_reply: false,
          is_repost: true,
          reference: props.reference,
        });
        if (errorRepost) throw errorRepost;
        await supabase
          .from("honks")
          .select("reposts")
          .eq("post_id", props.reference)
          .single()
          .then((res) => {
            if (res.error) throw new Error(res.error.message);
            if (!res.data) throw new Error("No repost found");
            supabase
              .from("honks")
              .update({ reposts: res.data.reposts + 1 })
              .eq("post_id", props.reference);
          });

        emit("repost", true);
        break;
      case postActions.POST:
        const { error: errorPost } = await supabase.from("honks").insert({
          created_at: new Date().toISOString(),
          user_id: user.value.id,
          content: content.value,
          is_reply: false,
          is_repost: false,
        });
        if (errorPost) throw errorPost;
        break;
    }
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
    <div class="prose flex flex-col gap-2 w-full">
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
        class="textarea textarea-primary resize-none"
        placeholder="What's on your mind?"
        v-model="content"
      />
    </div>
    <button
      class="btn btn-primary shadow-md shadow-primary hover:shadow-primary-focus w-1/3"
    >
      {{ action }}
    </button>
  </form>
</template>
