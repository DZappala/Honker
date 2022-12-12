<script setup lang="ts">
import { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref<boolean>(true);
// TODO: this activeBlock state should use the Component type so that someone can't just pass any string into it. The activeBlock composable should just check whether the component is valid else throw an error.
const activeBlock = useActiveBlock();

const load = (comp: string) => {
  activeBlock.value = comp;
};

const signOut = async () => {
  try {
    loading.value = true;
    let { error } = await supabase.auth.signOut();

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
  <div class="navbar bg-base-100 ps-4">
    <div class="flex-1 gap-2">
      <a @click="load('Feed')" class="btn btn-ghost normal-case text-xl"
        >Honker</a
      >
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
          <li><a @click="load('Feed')"> Feed </a></li>
          <li><a @click="load('Profile')"> Profile </a></li>
          <li @click="load('Account')"><a>Settings</a></li>
          <li @click="signOut"><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>
