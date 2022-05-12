<script lang="ts">
  import {
    getGitlabAccessToken,
    getGitlabProjectName,
    getGitlabUrl,
    setGilabAccessToken,
    setGilabProjectName,
    setGilabUrl
  } from '../lib/api'

  import Input from './Input.svelte'

  let gitlabUrl = ''
  let gitlabProject = ''
  let gitlabAccessToken = ''

  getGitlabUrl().then((url) => {
    gitlabUrl = url
  })
  getGitlabProjectName().then((project) => {
    gitlabProject = project
  })
  getGitlabAccessToken().then((token) => {
    gitlabAccessToken = token
  })

  $: {
    gitlabUrl
    setGilabUrl(gitlabUrl)
  }
  $: {
    gitlabAccessToken
    setGilabAccessToken(gitlabAccessToken)
  }
  $: {
    gitlabProject
    setGilabProjectName(gitlabProject)
  }
</script>

<Input bind:value={gitlabUrl} label="Gitlab url" placeholder="https://www.gitlab.com" />
<Input bind:value={gitlabProject} label="Gitlab project" placeholder="COMPANY/REPO" />
<Input bind:value={gitlabAccessToken} label="Gitlab access token" placeholder="xxxxxxx" type="password" />
