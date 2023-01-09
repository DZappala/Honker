<script setup lang="ts">
import type { Database } from "~/types/database.types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const router = useRouter();

const loading = ref(true);
const username = ref("");
const website = ref("");
const bio = ref("");
const avatar_url = ref("");
const location = ref("");
const locationPredictions = ref<string[]>([]);
const unsavedChanges = ref(false); //implement save changes state
const characterCount = computed(() => {
  return 256 - bio.value.length;
});

loading.value = true;
const { data } = await supabase
  .from("users")
  .select("*")
  .eq("id", user.value?.id)
  .single();

if (data) {
  username.value = data.username;
  website.value = data.website || "";
  bio.value = data.bio || "";
  avatar_url.value = data.avatar_url || "";
  location.value = data.location || "";
}
loading.value = false;

//TODO: if the user has entered text into any of the fields and hasn't pressed update, warn them before they leave the page

const validateBio = () => {
  if (bio.value.length > 256) {
    throw new Error("Bio cannot be longer than 256 characters");
  }
  if (!bio.value || bio.value == "") {
    throw new Error("Bio cannot be empty");
  }
};

const updateUser = async () => {
  try {
    loading.value = true;
    validateBio(); //TODO: add other validations

    const { error } = await supabase
      .from("users")
      .update({
        id: user.value?.id,
        username: username.value,
        website: website.value,
        bio: bio.value,
        location: location.value,
        avatar_url: avatar_url.value,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.value?.id);

    if (error) throw error;
  } catch (error: any | unknown) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};

const signOut = async () => {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();

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

const getLocationPredictions = async () => {
  const { data, pending, error, refresh } = await useFetch<locationQueryResult>(
    `https://public.opendatasoft.com/api/v2/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=5&offset=0&select=name,cou_name_en&where=search(name,"${location.value}")&order_by=population DESC`
  );

  if (pending) {
    locationPredictions.value = ["Loading ..."];
  }

  if (error.value) {
    throw new Error(error.value.message);
  }

  locationPredictions.value =
    data?.value?.records.map(
      (record) =>
        `${record.record.fields.name}, ${record.record.fields.cou_name_en}`
    ) || [];
};

watch(location, async () => {
  if (location.value.length < 3) {
    locationPredictions.value = [];
    return;
  }
  await getLocationPredictions().catch((error) => {
    console.error(error);
  });
});

//TODO: implement more robust location search with city, country, etc.
// interface queryBuilderWhereOpts {
//   filter: string[];
//   combine: "AND" | "OR";
// }

// const locationQueryBuilder = (
//   uri: string,
//   params: {
//     limit?: number;
//     offset?: number;
//     select?: string;
//     where?: string | queryBuilderWhereOpts;
//   }
// ) => {
//   if (typeof params.where === "object") {
//     const { filter, combine } = params.where;
//     params.where = filter.join(` ${combine} `);
//   }
//   return `${uri}?${Object.entries(params)
//     .map(([key, value]) => `${key}=${value}`)
//     .join("&")}`;
// };
</script>

<template>
  <form
    class="form-control h-screen container mx-auto flex flex-col justify-center items-center prose gap-4 w-full p-6 sm:p-0"
    @submit.prevent="updateUser"
  >
    <input
      class="input input-bordered"
      id="email"
      type="text"
      :value="user?.email"
      placeholder="example@site.com"
      disabled
    />

    <label class="input-group input-group-vertical" for="username">
      <span>Username</span>
      <input
        class="input input-bordered"
        id="username"
        type="text"
        v-model="username"
        placeholder="choose a username"
      />
    </label>

    <label class="input-group input-group-vertical" for="website">
      <span>Website</span>
      <input
        class="input input-bordered"
        id="website"
        type="text"
        v-model="website"
        placeholder="link your website"
      />
    </label>

    <label class="input-group input-group-vertical" for="location">
      <span>Location</span>
      <input
        class="input input-bordered"
        id="location"
        type="text"
        autocomplete="off"
        autocorrect="off"
        v-model="location"
        placeholder="where are you?"
      />
      <div class="dropdown dropdown-open" v-if="locationPredictions.length > 0">
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 shadow bg-base-300 text-base-content rounded-box"
        >
          <li v-for="prediction in locationPredictions" :key="prediction">
            <span @click="location = prediction">{{ prediction }}</span>
          </li>
        </ul>
      </div>
    </label>

    <label class="input-group input-group-vertical" for="bio">
      <span
        :class="{
          'text-error': characterCount < 0,
        }"
        >{{ characterCount }}</span
      >
      <textarea
        id="bio"
        type="text"
        v-model="bio"
        placeholder="write a bio!"
        class="textarea resize-none w-full"
        :class="{
          'textarea-error': characterCount < 0,
          'textarea-bordered': characterCount >= 0,
        }"
      />
    </label>

    <div class="flex gap-4">
      <input
        type="submit"
        class="btn btn-primary"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
      <button class="btn btn-error" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
</template>
