<script lang="ts">
  import {
    getBrowserUrl,
    createBranch,
    createMergeRequest,
    searchBranchByIssueID,
    searchMergeRequestByIssueID
  } from '../lib/api'

  const issueID = document.querySelector<HTMLMetaElement>('meta[name="ajs-issue-key"]').content

  let issueDescription = document.getElementById('summary-val')!.textContent

  let branchName = ''
  let branchMeged = false
  let mergeRequestID: string | number = ''
  let mergeRequestMerged = false
  let mergeRequestClosed = false

  searchBranchByIssueID(issueID).then((branch) => {
    if (branch) {
      branchName = branch.name
      branchMeged = branch.merged
    }
  })

  searchMergeRequestByIssueID(issueID).then((mergeRequest) => {
    if (mergeRequest) {
      mergeRequestID = mergeRequest.iid
      mergeRequestMerged = mergeRequest.state === 'merged'
      mergeRequestClosed = mergeRequest.state === 'closed'
    }
  })
</script>

{#if !mergeRequestMerged}
  {#if branchName == ''}
    <a
      id="create-branch"
      title="Create branch"
      class="aui-button toolbar-trigger"
      on:click={() => createBranch(issueID, issueDescription).then((branch) => (branchName = branch.name))}
    >
      <span class="icon aui-icon aui-icon-small aui-iconfont-create-branch" />
      <span class="trigger-label">Create branch</span>
    </a>
  {:else}
    {#await getBrowserUrl then browserUrl}
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
  <a
    id="create-merge-request"
    title="Create merge request"
    class="aui-button toolbar-trigger"
    target="_blank"
    href={`${browserUrl}-/merge_requests/${mergeRequestID}`}
  >
    <span class="aui-icon aui-icon-small aui-iconfont-create-pull-request" />
    <span class="trigger-label"
      >View merge request
      {#if mergeRequestClosed || mergeRequestMerged}
        (closed)
      {:else}
        (open)
      {/if}
    </span>
  </a>
{:else if branchName}
  <a
    id="create-merge-request"
    title="Create merge request"
    class="aui-button toolbar-trigger"
    on:click={() => createMergeRequest(issueID, branchName).then((mergeRequest) => (mergeRequestID = mergeRequest.iid))}
  >
    <span class="aui-icon aui-icon-small aui-iconfont-create-pull-request" />
    <span class="trigger-label">Create merge request</span>
  </a>
{/if}
