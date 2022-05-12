<script lang="ts">
  import { getBrowserUrl, createBranch, searchBranchByIssueID, searchMergeRequestByIssueID } from '../lib/api'
  import Link from './Link.svelte'

  export let view: 'detail' | 'full'
  export let issueID: string
  let issueDescription = document.getElementById('summary-val')?.textContent || ''

  let branchName = ''
  let branchMeged = false
  let mergeRequestID: string | number = ''
  let mergeRequestMerged = false
  let mergeRequestClosed = false

  let loaded = false

  console.log('Gitlab', 'search by', issueID)

  Promise.all([searchBranchByIssueID(issueID), searchMergeRequestByIssueID(issueID)]).then(([branch, mergeRequest]) => {
    if (branch) {
      branchName = branch.name
      branchMeged = branch.merged
    }
    if (mergeRequest) {
      mergeRequestID = mergeRequest.iid
      mergeRequestMerged = mergeRequest.state === 'merged'
      mergeRequestClosed = mergeRequest.state === 'closed'
    }
    loaded = true
  })
</script>

{#if !loaded}
  <aui-spinner size="small" style="margin: 10px;" />
{/if}

{#if !mergeRequestMerged}
  {#if branchName == ''}
    <Link
      title="Create branch"
      on:click={() =>
        createBranch(issueID, issueDescription).then((branch) => {
          if (branch) branchName = branch.name
        })}
      icon="aui-iconfont-create-branch"
      >Create branch
    </Link>
  {:else}
    {#await getBrowserUrl() then browserUrl}
      <a
        id="open-branch"
        title="Open branch"
        class="aui-button toolbar-trigger"
        target="_blank"
        href={`${browserUrl}-/tree/${branchName}`}
      >
        <span class="aui-icon aui-icon-small aui-iconfont-open" />
        <span class="trigger-label">View branch</span>
      </a>
    {/await}
  {/if}
{/if}

{#if mergeRequestID}
  {#await getBrowserUrl() then browserUrl}
    <Link
      title="Create merge request"
      target="_blank"
      href={`${browserUrl}-/merge_requests/${mergeRequestID}`}
      icon="aui-iconfont-create-pull-request"
    >
      View merge request
      {#if mergeRequestClosed || mergeRequestMerged}
        (closed)
      {:else}
        (open)
      {/if}
    </Link>
  {/await}
{:else if branchName}
  <Link title="Create merge request" icon="aui-iconfont-create-pull-request">Create merge request</Link>
{/if}
