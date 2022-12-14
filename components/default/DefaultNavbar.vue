<script setup lang="ts">
import { SupabaseClient } from "@supabase/supabase-js";

const supabaseAuth: SupabaseClient = useSupabaseAuthClient();
const user = useSupabaseUser();
const loading = ref<boolean>(true);
const router = useRouter();

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
</script>
<template>
  <nav class="navbar bg-base-100 ps-4">
    <div class="flex-1 gap-2">
      <NuxtLink to="feed" class="btn btn-ghost normal-case text-xl">
        Honker
      </NuxtLink>
      <img src="goose.png" alt="Honker Logo" class="w-1/12" />
    </div>
    <div v-if="user" class="flex-none gap-2">
      <div class="form-control">
        <!-- TODO: Implement search  and adv. search-->
        <input type="text" placeholder="Search" class="input input-bordered" />
      </div>
      <div class="dropdown dropdown-end dropdown-hover">
        <label
          tabindex="0"
          class="btn btn-ghost btn-circle avatar hover:btn-primary m-1 no-animation"
        >
          <div class="w-10 rounded-full">
            <!-- TODO: should be user provided image or blank dude-->
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
