<script lang="ts">
  import Ps1 from "./components/Ps1.svelte";
  import Input from "./components/Input.svelte";
  import History from "./components/History.svelte";
  import { theme } from "./stores/theme";
</script>

<svelte:head>
  {#if import.meta.env.VITE_TRACKING_ENABLED === "true"}
    <script
      async
      defer
      data-website-id={import.meta.env.VITE_TRACKING_SITE_ID}
      src={import.meta.env.VITE_TRACKING_URL}
    ></script>
  {/if}
</svelte:head>

<main
  class="h-full p-4 overflow-auto text-xs border-2 rounded-md sm:text-sm md:text-base"
  style={`background-color: ${$theme.background}; color: ${$theme.foreground}; border-color: transparent;`}
>

  <History />

  <div class="lex-col md:flex-row">
    <Ps1 />

    <Input />

    <div class="buttons-row">{`
----------------------------------------------------------------------------
                        < Apply >           < X >
-----------------------------------------------------------------------------
`}
    </div>
  </div>
</main>
