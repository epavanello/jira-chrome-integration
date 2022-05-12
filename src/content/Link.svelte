<script>
  export let title = ''
  export let icon = ''
  export let href = ''
</script>

{#if href}
  <a {title} class="aui-button toolbar-trigger" on:click {href} {...$$restProps}>
    {#if icon}
      <span class={'aui-icon aui-icon-small ' + icon} />
    {/if}
    <span class="trigger-label">
      <slot />
    </span>
  </a>
{:else}
  <div {title} class="aui-button toolbar-trigger" on:click {...$$restProps}>
    {#if icon}
      <span class={'aui-icon aui-icon-small ' + icon} />
    {/if}
    <span class="trigger-label">
      <slot />
    </span>
  </div>
{/if}
