<script setup lang="ts">
import { Database } from "~/types/database.types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

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

const isFollowing = ref<boolean>(false);
const username = ref<string>("");

const handleFollowUnfollow = async () => {
  try {
    const { error } = await supabase.rpc("handle_follow_user", {
      current_user_id: user.value?.id,
      input: props.user_id,
    });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any | unknown) {
    console.error(error.message);
  } finally {
    setIsFollowing();
  }
};

const getPostUsername = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", props.user_id)
      .single();

    if (error) throw error;
    username.value = data.username;
  } catch (error: any | unknown) {
    console.error(error.message);
  }
};

const setIsFollowing = async () => {
  if (!user.value) throw new Error("User is not logged in!");
  try {
    const { data, error } = await supabase
      .from("users")
      .select("following")
      .eq("id", user.value.id)
      .single();

    if (error) throw error;
    if (data.following?.includes(props.user_id)) {
      isFollowing.value = true;
    } else {
      isFollowing.value = false;
    }
  } catch (error: any | unknown) {
    console.error(error.message);
  }
};

onBeforeMount(async () => {
  setIsFollowing();
  getPostUsername();
});
</script>

<template>
  <div class="card bg-base-300 flex">
    <figure>
      <img
        :src="`https://source.unsplash.com/random/400x500?sig=${Math.floor(
          Math.random() * 1000
        )})}`"
        alt="Album"
      />
    </figure>
    <div class="card-body">
      <div class="dropdown dropdown-end dropdown-hover">
        <NuxtLink
          tabindex="0"
          :to="`/profile/${user_id}`"
          class="card-actions justify-end link link-accent link-hover"
        >
          @{{ username }}
        </NuxtLink>
        <ul
          tabindex="0"
          class="shadow menu menu-compact dropdown-content rounded-box p-2"
          :class="{
            'bg-success text-success-content': !isFollowing,
            'bg-error text-error-content': isFollowing,
          }"
        >
          <li>
            <div @click="handleFollowUnfollow">
              {{ isFollowing ? "Unfollow" : "Follow" }}
            </div>
          </li>
        </ul>
      </div>
      <p class="prose text-base-content break-words">{{ content }}</p>
      <div
        class="card-actions justify-end flex-nowrap justify-content-center gap-4"
      >
        <FeedSocialButton
          :initial-count="likes"
          :post-id="post_id"
          :action="'likes'"
          :initial-state="false"
          :icon="'heart.svg'"
        />
        <FeedSocialButton
          :initial-count="reposts"
          :post-id="post_id"
          :action="'reposts'"
          :initial-state="false"
          :icon="'loop.svg'"
        />
        <FeedSocialButton
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
