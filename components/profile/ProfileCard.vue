<script setup lang="ts">
import type { Database } from "~~/types/database.types";

const props = defineProps<{
  forUser?: String;
}>();

const router = useRouter();

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const username = ref("");
const website = ref("");
const avatar_url = ref("");
const bio = ref("");
const location = ref("");

const openSettings = () => {
  router.push("/settings");
};

const { data } = await supabase
  .from("users")
  .select("*")
  .eq("id", props.forUser)
  .single();

if (data) {
  username.value = data.username || "";
  website.value = data.website || "";
  avatar_url.value = data.avatar_url || "";
  bio.value = data.bio || "";
  location.value = data.location || "";
}
</script>
<template>
  <div
    class="card indicator justify-between items-center w-full mt-6 bg-primary p-6"
  >
    <div class="indicator-item">
      <button
        class="btn btn-sm no-animation text-base-content"
        @click="openSettings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="white"
          class="w-6 h-6 hover:animate-[spin_1s_ease-in-out]"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
    <div class="avatar p-6">
      <div
        class="rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-4"
      >
        <img
          :src="
            avatar_url
              ? avatar_url
              : `https://robohash.org/${username}?bgset=bg1&set=set5`
          "
        />
      </div>
    </div>
    <article class="card-body prose text-primary-content w-full p-6">
      <h1 class="text-primary-content">@{{ username }}</h1>
      <div v-if="website" class="not-prose flex flex-row gap-2">
        <DefaultIcon of="/website.svg" class="w-6" />
        <NuxtLink class="link" :to="`http://${website}`">{{
          website
        }}</NuxtLink>
      </div>
      <div v-if="location" class="not-prose flex flex-row gap-2">
        <DefaultIcon of="/location.svg" class="w-6" />
        <p>{{ location }}</p>
      </div>
      <p v-if="bio">
        {{ bio }}
      </p>
      <label
        v-else-if="!bio && user?.id === props.forUser"
        class="btn btn-secondary"
        @click="openSettings"
        >add a bio!</label
      >
      <p v-else>This user doesn't have a bio 😔</p>
    </article>
  </div>
</template>
