<script setup lang="ts">
import { SupabaseClient } from "@supabase/supabase-js";

const supabase: SupabaseClient = useSupabaseClient();

const props = defineProps<{
  postId: number;
  action: string;
  initialState: boolean;
  initialCount: number;
  icon: string;
}>();

const value = ref(props.initialState);
const count = ref(props.initialCount);

// Returns 1 if the button is checked and -1 if it is not
const getCheckboxValue = (): number => {
  return value.value ? 1 : -1;
};

const handleClick = async () => {
  try {
    await supabase
      .from("honks")
      .update({
        [props.action]:
          (count.value += getCheckboxValue())! >= 0
            ? count.value
            : (count.value = 0), //safe guard against negative values
      })
      .eq("post_id", props.postId);

    console.log(count.value);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="flex flex-col gap-1 items-center">
    <label class="swap swap-rotate">
      <input type="checkbox" @change="handleClick" v-model="value" />
      <!-- Empty icon SVG-->
      <!-- TODO: alt text -->
      <img :src="icon" class="w-6 h-6 swap-off" role="img" />
      <!-- Full icon SVG -->
      <!-- FIXME: fill-current class not working -->
      <img :src="icon" class="w-6 h-6 fill-current swap-on" role="img" />
    </label>
    <div class="badge badge-primary text-primary-content">{{ count }}</div>
  </div>
</template>
