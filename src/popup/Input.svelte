<script lang="ts">
  export let label: string
  export let value: string
  export let placeholder: string = ''
  export let help: string | undefined = undefined
</script>

<div>
  <label for="email" class="block text-sm font-medium text-gray-700">{label}</label>
  <div class="mt-1">
    <input
      type="text"
      bind:value
      class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      {placeholder}
      aria-describedby="email-description"
    />
  </div>
  {#if help}
    <p class="mt-2 text-sm text-gray-500">{help}</p>
  {/if}
</div>
