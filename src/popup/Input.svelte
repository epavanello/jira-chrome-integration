<script lang="ts">
  export let label: string
  export let value: string
  export let type = 'text'
  export let placeholder = ''
  export let help: string | undefined = undefined

  const handleInput = ({ target }: { target: EventTarget | null }) => {
    value = (target as HTMLInputElement)?.value
  }
</script>

<div>
  <label class="block text-sm font-medium text-gray-600">
    <span class="mb-2 inline-block">
      {label}
    </span>
    <input
      {type}
      {value}
      on:input={handleInput}
      class="bg-purple-white shadow rounded border-0 p-3 w-full"
      {placeholder}
      aria-describedby={label}
    />
  </label>
  {#if help}
    <p class="mt-2 text-sm text-gray-500">{help}</p>
  {/if}
</div>
