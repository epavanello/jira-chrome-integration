// hr/presenze
export const getProjectName = async () => await getGitlabProjectName()

// https://biosphere.teamsystem.com
export const getRepoUrl = async () => await getGitlabUrl()

// https://biosphere.teamsystem.com/api/v4/projects/hr%2Fpresenze/
export const getApiUrl = async () =>
  `${await getRepoUrl()}/api/v4/projects/${encodeURIComponent(await getProjectName())}/`
// https://biosphere.teamsystem.com/hr/presenze/
export const getBrowserUrl = async () => `${await getRepoUrl()}/${await getProjectName()}/`

export async function Fetch<T extends {}>(path: string, method?: string, body?: Record<string, any>): Promise<T> {
  const resource = (await getApiUrl()) + path
  const separator = resource.indexOf('?') > 0 ? '&' : '?'
  const response = await fetch(
    resource +
      (body
        ? separator +
          Object.entries(body)
            .map(([key, value]) => key + '=' + encodeURIComponent(value))
            .join('&')
        : ''),
    {
      method,
      headers: {
        'PRIVATE-TOKEN': await getGitlabAccessToken()
      }
    }
  )
  return (await response.json()) as T
}

export async function searchBranchByIssueID(issueID: string): Promise<{ name: string; merged: boolean } | undefined> {
  const searchBranch = await Fetch<{ name: string; merged: boolean }[]>(
    `repository/branches?search=^feature/${issueID}`,
    'GET'
  )
  console.log(searchBranch)
  return searchBranch[0]
}

export async function createBranch(branchName: string, issueDescription: string): Promise<{ name: string }> {
  const branchDescription = window.prompt(
    'Enter branch description',
    issueDescription.toLowerCase().replaceAll(' ', '-')
  )
  const newBranch = await Fetch<{ name: string }>(
    `repository/branches?branch=${encodeURIComponent(`feature/${branchName}-${branchDescription}`)}&ref=develop`,
    'POST'
  )
  return newBranch
}

// Non uso branch id perchè il brach può anche esser eliminato
export async function searchMergeRequestByIssueID(
  issueID: string
): Promise<{ iid: string | number; state: string } | undefined> {
  const searchBranch = await Fetch<{ iid: string | number; state: string }[]>(
    `merge_requests?search=${encodeURIComponent(issueID)}`,
    'GET'
  )
  console.log(searchBranch)
  return searchBranch[0]
}

export async function createMergeRequest(issueID: string, branchName: string) {
  return await Fetch<{ iid: string | number }>('merge_requests', 'POST', {
    id: issueID,
    source_branch: branchName,
    target_branch: 'develop',
    title: `Feature: ${issueID} ${branchName.replace(`feature/${issueID}`, '').replaceAll('-', ' ')}`
  })
}

// export let getValue = (key: string): Promise<string> =>
//   new Promise((resolve) => {

//     chrome.storage.sync.get([key], function (items) {
//       resolve(items[key] || '')
//     })
//   })

// export let setValue = (key: string, value: string) =>
//   new Promise<void>((resolve) => {
//     chrome.storage.sync.set({ [key]: value }, resolve)
//   })
export let getValue = (key: string, def: string): Promise<string> =>
  new Promise((resolve) => {
    resolve(localStorage.getItem(key) || def)
  })
export let setValue = (key: string, value: string) =>
  new Promise<void>((resolve) => {
    localStorage.setItem(key, value)
    resolve()
  })

export let getGitlabUrl = (def = 'https://biosphere.teamsystem.com') => getValue('gitlabUrl', def)
export let getGitlabProjectName = (def = 'hr/presenze') => getValue('gitlabProjectName', def)
export let getGitlabAccessToken = (def = 'eHXcs6sC8L1c1w8YhkoF') => getValue('gitlabAccessToken', def)

export let setGilabUrl = (value: string) => setValue('gitlabUrl', value)
export let setGilabProjectName = (value: string) => setValue('gitlabProjectName', value)
export let setGilabAccessToken = (value: string) => setValue('gitlabAccessToken', value)
