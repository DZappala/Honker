<script setup lang="ts">
//TODO: switch database from postgresql to graphql
import { use } from "h3";
import type { Database } from "~/types/database.types";

const router = useRouter();
const authClient = useSupabaseAuthClient<Database>();
const user = useSupabaseUser();
if (user.value) {
  router.push("/feed");
}

const loading = ref<boolean>(false);
const email = ref<string>("");
const username = ref<string>("");
const fullName = ref<string>("");
const loginSuccess = ref<boolean>(false);
const isUser = ref(true); //by default, assume user exists

const handleLogin = async () => {
  try {
    loading.value = true;

    //check if user exists by looking up email in profiles table
    const response = await authClient.rpc("is_user", {
      email_to_check: email.value,
    });

    if (response.error || response.data == null) {
      throw new Error(
        `Error checking if user exists ${response.error.message}`
      );
    }

    //if user exists, sign in with Otp and email
    if (response.data) {
      const { error } = await authClient.auth.signInWithOtp({
        email: email.value,
        options: {
          emailRedirectTo: `localhost:3000/feed`, //FIXME: this should append the magic link with the feed route, but currently, the magic link redirects to '/' instead of '/feed'
        },
      });
      if (error) throw error;
    } else {
      isUser.value = false;
      return;
    }
  } catch (error: any | unknown) {
    console.error(error.message);
    return;
  } finally {
    loading.value = false;
    loginSuccess.value = true;
  }
};

const handleSignUp = async () => {
  try {
    loading.value = true;
    const { error } = await authClient.auth.signInWithOtp({
      email: email.value,
      options: {
        data: {
          username: username.value,
          full_name: fullName.value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        emailRedirectTo: `localhost:3000/feed`,
      },
    });

    if (error) throw error;
  } catch (error: any | unknown) {
    console.error(error.message);
    return;
  } finally {
    loading.value = false;
    loginSuccess.value = true;
  }
};
</script>

<template>
  <form
    class="h-screen prose container mx-auto flex justify-center items-center flex-col"
    @submit.prevent="isUser ? handleLogin() : handleSignUp()"
  >
    <h1>WELCOME TO HONKER</h1>
    <p>
      {{
        isUser
          ? "Sign in via magic link with your email below"
          : "Sign up with your email!"
      }}
    </p>
    <div class="flex gap-4 flex-col items-center">
      <label class="form-control" for="email">
        <input
          class="input input-bordered"
          type="email"
          placeholder="info@site.com"
          v-model="email"
        />
      </label>
      <label class="form-control" for="username" v-if="!isUser">
        <input
          class="input input-bordered"
          type="text"
          placeholder="username"
          v-model="username"
        />
      </label>
      <label class="form-control" for="full_name" v-if="!isUser">
        <input
          class="input input-bordered"
          type="text"
          placeholder="full name"
          v-model="fullName"
        />
      </label>
      <label class="form-control" for="submit">
        <DefaultTooltip
          :isShown="loginSuccess"
          type="success"
          direction="bottom"
          tooltipMessage="Success! Check your email"
        >
          <input
            type="submit"
            class="btn btn-primary"
            :value="loading ? 'Loading' : 'Send me a magic link'"
            :disabled="loading"
          />
        </DefaultTooltip>
      </label>
    </div>
  </form>
</template>
