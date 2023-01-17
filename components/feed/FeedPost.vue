<script setup lang="ts">
import { Database } from "~/types/database.types";
import { postActions } from "~/types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

//HACK: At this time defineProps only accepts an object literal or interface within the same file, it does not accept an imported interface so we can't use Honk from ~~/types/index.ts | read more at: https://vuejs.org/guide/typescript/composition-api.html#syntax-limitations

const props = defineProps<{
  content: string;
  created_at: string | Date;
  user_id: string;
  post_id: number;
  imgURL?: string;
  likes: number;
  reposts: number;
  replys: number;
  is_reply: boolean;
  is_repost: boolean;
  reference?: number | null;
}>();

const isFollowing = ref<boolean>(false);
const username = ref<string>("");
const loading = ref<boolean>(false);

const isReposting = ref<boolean>(false);
const isReplying = ref<boolean>(false);
const hasLiked = ref<boolean>(false);
const hasReposted = ref<boolean>(false);
const hasReplied = ref<boolean>(false);

const handleLike = async () => {
  return;
};

const handleRepost = async () => {
  isReposting.value = true;
};

const handleReply = async () => {
  isReplying.value = true;
};

const handleFollowUnfollow = async () => {
  try {
    if (!user.value) throw new Error("User is not logged in!");
    const { error } = await supabase.rpc("handle_follow_user", {
      current_user_id: user.value.id,
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

onMounted(async () => {
  loading.value = true;
  setIsFollowing();
  getPostUsername();
  loading.value = false;
});
</script>

<template>
  <div class="card bg-base-300 flex" v-if="!loading">
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
        <FeedButtonLike
          @click.prevent="handleLike"
          :count="likes"
          :state="hasLiked"
        />
        <FeedButtonRepost
          @click.prevent="handleRepost"
          :count="reposts"
          :state="hasReposted"
        />
        <FeedButtonReply
          :count="replys"
          :state="hasReplied"
          @click.prevent="handleReply"
        />
      </div>
    </div>
    <div v-if="isReplying">
      <div class="indicator w-full">
        <FeedHonk
          :action="postActions.REPLY"
          :reference="post_id"
          @reply="
            {
              hasReplied = !hasReplied;
              isReplying = false;
            }
          "
        />
      </div>
    </div>
    <div v-if="isReposting">
      <div class="indicator w-full">
        <FeedHonk
          :action="postActions.REPOST"
          :reference="post_id"
          @repost="
            {
              hasReposted = !hasReposted;
              isReposting = false;
            }
          "
        />
      </div>
    </div>
  </div>
  <LazyFeedPostLoading v-else />
</template>
