<script setup lang="ts">
import type { Database } from "~/types/database.types";
interface searchPrediction {
  searchType: string;
  value: string;
  endpoint: string;
}

const supabaseAuth = useSupabaseAuthClient<Database>();
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const loading = ref<boolean>(false);
const router = useRouter();

const search = ref("");
const searchPredictions = ref<searchPrediction[]>([]);

const signOut = async () => {
  try {
    loading.value = true;
    const { error } = await supabaseAuth.auth.signOut();

    if (error) throw error;

    user.value = null;
  } catch (error: any | unknown) {
    alert(error.message);
  } finally {
    alert("You have been logged out!");
    router.push("/auth");
    loading.value = false;
  }
};

const getSearchType = (search: string) => {
  if (search.startsWith("#")) {
    return "tag";
  } else if (search.startsWith("@")) {
    return "at";
  } else {
    return "text";
  }
};

const getSearchPredictions = async () => {
  loading.value = true;
  searchPredictions.value = [];
  const searchType = getSearchType(search.value);
  //FIXME: supabase is only returning search predictions if they match the string completely. I.E. "Monica" will return "Monica" but "Moni" will not return "Monica
  switch (searchType) {
    case "tag":
      //TODO: add tags to supabase honks table
      // const { data, error } = await supabase.from("honks").select().textSearch("tags", `${search.value}`).limit(5);
      // if (error) throw error;
      // searchPredictions.value = data.map((honk) => honk.tags);
      break;
    case "at":
      const { data, error } = await supabase
        .from("users")
        .select()
        .ilike("username", `%${search.value.substring(1)}%`) //HACK usernames should have `ats` in front of them on database
        .limit(5);

      if (error) throw error;

      data.forEach((user) => {
        searchPredictions.value.push({
          searchType: searchType,
          value: `@${user.username}`,
          endpoint: `/profile/${user.id}`,
        });
      });
      break;
    case "text":
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select()
        .ilike("username", `%${search.value}%`)
        .limit(5);

      if (usersError) throw usersError;

      const { data: honks, error: honksError } = await supabase
        .from("honks")
        .select()
        .ilike("content", `%${search.value}%`)
        .limit(5);

      if (honksError) throw honksError;

      honks.forEach((honk) =>
        searchPredictions.value.push({
          searchType: searchType,
          value: honk.content,
          endpoint: `/honk/${honk.post_id}`,
        })
      );

      users.forEach((user) => {
        searchPredictions.value.push({
          searchType: searchType,
          value: `@${user.username}`,
          endpoint: `/profile/${user.id}`,
        });
      });
      break;
    default:
      break;
  }
};

watch(search, async () => {
  if (search.value.length < 3) {
    searchPredictions.value = [];
    return;
  }

  await getSearchPredictions()
    .catch((error) => {
      //TODO: handle error for user (validation)
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
});

//FIXME: Goose logo too small
</script>
<template>
  <nav>
    <div class="flex flex-row gap-2">
      <div class="">
        <NuxtLink to="/feed" class="btn btn-ghost normal-case text-xl">
          Honker
        </NuxtLink>
      </div>
      <img
        src="/goose.png"
        alt="Honker Logo"
        class="hidden md:block md:w-1/12 p-2"
      />
    </div>
    <div v-if="user" class="gap-2">
      <div class="hidden md:flex form-control">
        <!-- TODO: Implement search  and adv. search-->
        <div class="relative">
          <input
            class="input input-bordered"
            id="search"
            type="text"
            autocomplete="off"
            autocorrect="off"
            v-model="search"
            placeholder="🔍 Search"
            tabindex="0"
          />
          <div v-if="loading" class="absolute inset-y-0 right-0">
            <svg
              class="animate-spin mx-4 h-full w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>

        <div class="dropdown dropdown-open" v-if="searchPredictions.length > 0">
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-300 text-base-content rounded-box"
          >
            <li v-for="prediction in searchPredictions" :key="prediction.value">
              <span
                @click="
                  {
                    $router.push(prediction.endpoint);
                    search = '';
                  }
                "
                >{{ prediction.value }}</span
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="dropdown dropdown-end">
        <label
          tabindex="0"
          class="btn btn-ghost btn-circle avatar hover:btn-primary m-1 no-animation"
        >
          <div class="w-10 rounded-full">
            <!-- TODO: should be user provided image or robots generated dude-->
            <img src="https://placeimg.com/80/80/people" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="p-2 shadow-lg shadow-primary menu menu-compact dropdown-content bg-primary text-primary-content rounded-box"
        >
          <li><NuxtLink to="/feed">Feed</NuxtLink></li>
          <li><NuxtLink to="/profile">Profile</NuxtLink></li>
          <li><NuxtLink to="/settings">Settings</NuxtLink></li>
          <li @click="signOut"><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>
