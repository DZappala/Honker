<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const username = ref("");
const website = ref("");
const avatar_path = ref("");

//TODO: add bio to supabase users table
const bio = ref("");

const { data } = await supabase
  .from("users")
  .select(`username, website, avatar_url`)
  .eq("id", user.value?.id)
  .single();

if (data) {
  username.value = data.username;
  website.value = data.website;
  avatar_path.value = data.avatar_url;
}
</script>
<template>
  <div
    class="flex flex-col md:flex-row card indicator justify-between items-center w-2/3 mt-6 bg-primary text-primary-content p-5"
  >
    <div class="indicator-item">
      <button class="btn btn-sm no-animation text-base-content">
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
    <div class="avatar p-6 md:w-1/3 h-full">
      <div
        class="rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-4"
      >
        <img
          :src="
            avatar_path
              ? avatar_path
              : `https://robohash.org/${username}?bgset=bg1&set=set5`
          "
        />
      </div>
    </div>
    <article class="card-body prose md:w-2/3 h-auto">
      <h1>@{{ username }}</h1>
      <div class="not-prose">
        <NuxtLink class="link" :to="`http://${website}`">{{
          website
        }}</NuxtLink>
      </div>
      <p>
        {{
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Integer malesuada nunc vel risus commodo viver."
        }}
      </p>
    </article>
  </div>
</template>
