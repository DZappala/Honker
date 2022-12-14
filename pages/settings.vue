<script setup lang="ts">
import { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref(true);
const username = ref("");
const website = ref("");
const avatar_path = ref("");

loading.value = true;
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
loading.value = false;

const updateUser = async () => {
  try {
    loading.value = true;

    const { error } = await supabase
      .from("users")
      .update({
        id: user.value?.id,
        username: username.value,
        website: website.value,
        avatar_url: avatar_path.value,
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
    loading.value = false;
  }
};
</script>

<template>
  <form
    class="form-control h-screen container mx-auto flex flex-col justify-center items-center prose gap-4 w-1/3"
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
      />
    </label>

    <label class="input-group input-group-vertical" for="username">
      <span>Website</span>
      <input
        class="input input-bordered"
        id="username"
        type="text"
        v-model="website"
      />
    </label>

    <div class="flex gap-4">
      <input
        type="submit"
        class="btn btn-primary"
        :value="loading ? 'Loading ...' : 'Update'"
        :disabled="loading"
      />
      <button class="btn btn-warning" @click="signOut" :disabled="loading">
        Sign Out
      </button>
    </div>
  </form>
</template>
