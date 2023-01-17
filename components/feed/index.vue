<script setup lang="ts">
//TODO: when new honks are loaded, old honks animate down and out of the way, new honk slides in smoothly. Right now honks are just appearing immediately and it's jarring

import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/realtime-js";
import { Database } from "~/types/database.types";
import { Honk, feedType } from "~/types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const loading = ref<boolean>(false);
let honksChannel: RealtimeChannel;

const honks = ref<Honk[]>([]);
const queue = ref<Honk[]>([]);
const honk = ref<Honk>();
const queueCount = ref<number>(queue.value.length);

const props = defineProps<{
  type: feedType;
  forUser?: string; // UUID
  postId?: string;
}>();

interface honkLocation {
  index: number;
  location: "queue" | "honks";
}

const loadNewHonks = () => {
  honks.value.unshift(...queue.value);
  queue.value = [];
};

//TODO: change supabase to useFetch from nuxt composition api

const findHonk = (inHonk: Honk): honkLocation | null => {
  if (queue.value.includes(inHonk))
    return {
      index: queue.value.findIndex((honk) => honk.post_id === inHonk.post_id),
      location: "queue",
    };
  else if (honks.value.includes(inHonk))
    return {
      index: honks.value.findIndex((honk) => honk.post_id === inHonk.post_id),
      location: "honks",
    };
  else return null;
};

onMounted(async () => {
  try {
    loading.value = true;
    //Get a list of users the current user is following
    switch (props.type) {
      case feedType.MAIN:
        if (!user.value) throw new Error("User not logged in");
        const { data: usersFollowing, error: usersFollowingError } =
          await supabase
            .from("users")
            .select("following")
            .eq("id", user.value.id)
            .single();
        if (usersFollowingError) throw usersFollowingError;
        if (!usersFollowing.following)
          throw new Error("User following list was not found");
        if (usersFollowing.following?.length === 0)
          throw new Error("User is not following anyone");

        const { data: honksData, error: honksError } = await supabase
          .from("honks")
          .select("*")
          .eq("is_reply", false)
          .eq("is_repost", false)
          .in("user_id", usersFollowing.following)
          .order("created_at", { ascending: false });

        if (!honksData) throw new Error("No data returned from honks query");
        if (honksError) throw honksError;
        if (honksData.length === 0) throw new Error("No honks found");
        honksData.forEach((honk) => {
          honks.value.push({
            post_id: honk.post_id,
            content: honk.content,
            created_at: honk.created_at,
            user_id: honk.user_id,
            likes: honk.likes,
            reposts: honk.reposts,
            replys: honk.replys,
            is_reply: honk.is_reply,
            is_repost: honk.is_repost,
            reference: honk.reference,
          });
        });
        break;
      case feedType.PROFILE:
        if (!props.forUser)
          throw new Error("No user id provided to ProfileFeed component");
        const { data, error } = await supabase
          .from("honks")
          .select("*")
          .eq("user_id", props.forUser);

        if (error) throw error;
        honks.value = data;
        break;
      case feedType.POST:
        const { data: honkData, error: honkError } = await supabase
          .from("honks")
          .select("*")
          .eq("post_id", props.postId)
          .single();

        if (honkError) throw honkError;
        honk.value = honkData;

        const { data: replysData, error: replysError } = await supabase
          .from("honks")
          .select("*")
          .eq("reference", props.postId)
          .eq("is_reply", true)
          .order("created_at", { ascending: false });

        if (replysError) throw replysError;

        replysData.forEach(() => {
          honks.value.push({
            content: honkData.content,
            created_at: honkData.created_at,
            likes: honkData.likes,
            reposts: honkData.reposts,
            replys: honkData.replys,
            user_id: honkData.user_id,
            post_id: honkData.post_id,
            is_reply: honkData.is_reply,
            is_repost: honkData.is_repost,
            reference: honkData.reference,
          });
        });
        break;
      default:
        console.log("FeedType was not recognized");
        break;
    }
  } catch (error: any | unknown) {
    console.error(Error(error.message));
  } finally {
    loading.value = false;
  }
});

//TODO: should only listen to honks from users the current user is following
onBeforeMount(() => {
  switch (props.type) {
    case feedType.MAIN:
      honksChannel = supabase
        .channel("realtime:honks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "honks",
            filter: `is_reply = false AND user_id IN (SELECT following FROM users WHERE id = '${user.value?.id}')`,
          },
          (payload: RealtimePostgresChangesPayload<Honk>) => {
            {
              switch (payload.eventType) {
                case "INSERT":
                  queue.value.push(payload.new);
                  break;
                case "UPDATE":
                  if (!payload.old) break;
                  const honkToUpdate = findHonk(payload.new);
                  if (!honkToUpdate) break;
                  if (honkToUpdate.location === "queue") {
                    queue.value[honkToUpdate.index] = payload.new;
                  } else if (honkToUpdate.location === "honks") {
                    honks.value[honkToUpdate.index] = payload.new;
                  }

                  break;
                case "DELETE":
                  if (!payload.old) break;
                  const honkToDelete = findHonk(payload.old as Honk);
                  if (!honkToDelete) break;
                  if (honkToDelete.location === "queue") {
                    queue.value.splice(honkToDelete.index, 1);
                  } else if (honkToDelete.location === "honks") {
                    honks.value.splice(honkToDelete.index, 1);
                  }
                  break;
                default:
                  console.log(
                    "postgres_change event for `realtime:honks` not handled, breaking"
                  );
                  break;
              }
            }
          }
        )
        .subscribe();
      break;
    case feedType.PROFILE:
      honksChannel = supabase
        .channel("realtime:honks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "honks",
            filter: `is_reply = false && user_id = ${props.forUser}`,
          },
          (payload: RealtimePostgresChangesPayload<Honk>) => {
            switch (payload.eventType) {
              case "INSERT":
                honks.value.push(payload.new);
                break;
              case "UPDATE":
                if (!payload.old) break;
                const index = honks.value.findIndex(
                  (honk) => honk.post_id === payload.old.post_id
                );
                honks.value[index] = payload.new;
                break;
              case "DELETE":
                if (!payload.old) break;
                const honkToDelete = honks.value.findIndex(
                  (honk) => honk.post_id === payload.old.post_id
                );
                honks.value.splice(honkToDelete, 1);
                break;
              default:
                break;
            }
          }
        )
        .subscribe();
      break;
    case feedType.POST:
      honksChannel = supabase
        .channel("realtime:honks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "honks",
            filter: "post_id",
          },
          (
            payload: RealtimePostgresChangesPayload<{
              honk: Honk;
            }>
          ) => {
            switch (payload.eventType) {
              case "INSERT":
                honks.value.push(payload.new.honk);
                break;
              case "UPDATE":
                if (!payload.old.honk) break;
                const index = honks.value.findIndex(
                  (reply) => reply.post_id === payload.old.honk?.post_id
                );
                honks.value[index] = payload.new.honk;
                break;
              case "DELETE":
                if (!payload.old.honk) break;
                const honkToDelete = honks.value.findIndex(
                  (reply) => reply.post_id === payload.old.honk?.post_id
                );
                honks.value.splice(honkToDelete, 1);
                break;
              default:
                break;
            }
          }
        )
        .subscribe();
      break;
    default:
      console.log("FeedType was not recognized");
      break;
  }
});

onUnmounted(() => {
  supabase.removeChannel(honksChannel);
});
</script>

<template>
  <div>
    <label
      v-if="queueCount != 0"
      @click="loadNewHonks"
      class="btn btn-secondary shadow-md shadow-secondary hover:shadow-secondary-focus w-full"
    >
      load {{ queueCount }} new honks?
    </label>
    <div v-for="(honk, index) in honks" :key="index">
      <LazyFeedPost v-bind="honk" v-if="!loading" class="my-6" />
      <LazyFeedPostLoading v-else />
    </div>
  </div>
</template>
