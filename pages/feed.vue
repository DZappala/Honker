<script setup lang="ts">
//TODO: when new honks are loaded, old honks animate down and out of the way, new honk slides in smoothly. Right now honks are just appearing immediately and it's jarring

import { RealtimePostgresChangesPayload } from "@supabase/realtime-js";
import { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = useSupabaseClient();
const user = useSupabaseUser();

const feed = reactive({
  honks: [] as Honk[],
  queue: [] as Honk[],
  queueCount: 0,
});

const loadNewHonks = () => {
  feed.honks.unshift(...feed.queue);
  feed.queue = [];
  feed.queueCount = 0;
};

//TODO: change supabase to useFetch from nuxt composition api

const parseHonk = (payload: RealtimePostgresChangesPayload<any>): Honk => {
  return {
    post_id: payload.new.post_id,
    content: payload.new.content,
    created_at: payload.new.created_at,
    user_id: payload.new.user_id,
    likes: payload.new.likes,
    reposts: payload.new.reposts,
    replys: payload.new.replys,
  };
};

const channel = supabase
  .channel("realtime:honks")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "honks" },
    (payload: RealtimePostgresChangesPayload<any>) => {
      switch (payload.eventType) {
        case "INSERT":
          if (payload.new.user_id === user.value?.id) {
            feed.honks.unshift(parseHonk(payload));
            break;
          } else {
            //HACK: This is precarious as it opens up a vulnerability if the queueCount != queue.length. The issue being you can't use a function in a reactive object. or rather you can't reference a reactive object in the same reactive object.
            feed.queue.unshift(parseHonk(payload));
            feed.queueCount++;
            break;
          }
        case "UPDATE":
          //FIXME: updates entire honk object, not just the changed values
          feed.queue.splice(
            feed.queue.findIndex(
              (honk) => honk.post_id === payload.new.post_id
            ),
            1,
            parseHonk(payload)
          );
          break;
        case "DELETE":
          feed.queue.splice(
            feed.queue.findIndex(
              (honk) => honk.post_id === payload.old.post_id
            ),
            1
          );
          break;
        default:
          break;
      }
    }
  )
  .subscribe();

onMounted(async () => {
  try {
    //Get all the honks from users followed
    const { data, error } = await supabase.rpc("get_honks_for_feed", {
      input_user_id: user.value?.id,
    });
    if (error) throw error;

    for (let i = 0; i < data.length; i++) {
      feed.honks.push({
        post_id: data[i].post_id,
        content: data[i].content,
        created_at: data[i].created_at,
        user_id: data[i].user_id,
        likes: data[i].likes,
        reposts: data[i].reposts,
        replys: data[i].replys,
      });
    }
  } catch (error: any | unknown) {
    console.error(Error(error.message));
  }
});

onUnmounted(() => {
  supabase.removeChannel(channel);
});
</script>

<template>
  <div class="flex flex-col gap-6 p-4 items-center w-full">
    <FeedHonk />
    <label
      v-if="feed.queueCount != 0"
      @click="loadNewHonks"
      class="btn btn-secondary shadow-md shadow-secondary hover:shadow-secondary-focus w-full"
    >
      load {{ feed.queueCount }} new honks?
    </label>
    <div v-for="(honk, index) in feed.honks" :key="index">
      <LazyFeedOtherHonk v-bind="honk" />
    </div>
  </div>
</template>
