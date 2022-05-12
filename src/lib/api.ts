// hr/presenze
export const getProjectName = async () => await getGitlabProjectNameFromContentScript()

export const getRepoUrl = async () => await getGitlabUrlFromContentScript()

export const getApiUrl = async () =>
  `${await getRepoUrl()}/api/v4/projects/${encodeURIComponent(await getProjectName())}/`

export const getBrowserUrl = async () => `${await getRepoUrl()}/${await getProjectName()}/`

export async function Fetch<T>(
  path: string,
  method?: string,
  body?: Record<string, string | number | boolean>
): Promise<T> {
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
        'PRIVATE-TOKEN': await getGitlabAccessTokenFromContentScript()
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

export async function createBranch(branchName: string, issueDescription: string): Promise<{ name: string } | null> {
  const branchDescription = window.prompt(
    'Enter branch description',
    issueDescription.toLowerCase().replaceAll(' ', '-')
  )
  if (branchDescription == null) {
    return null
  }
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
export const getValue = (key: string, def: string): Promise<string> =>
  new Promise((resolve) => {
    chrome.storage.sync.get([key], function (items) {
      resolve(items[key] || def)
    })
  })
export const setValue = (key: string, value: string) =>
  new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [key]: value }, resolve)
  })

export const getValueFromContentScript = (key: string, def: string): Promise<string> =>
  new Promise((resolve) => {
    window.postMessage({ type: 'getStorageData', key }, '*')

    const listener = (event: MessageEvent<{ value: string; key: string; type: string }>) => {
      if (event.data.type === 'getStorageDataResponse' && event.data.key === key) {
        resolve(event.data.value || def)
        console.log('ask for value', key, event.data.value)
        window.removeEventListener('message', listener)
      }
    }

    window.addEventListener('message', listener)
  })
export const setValueFromContentScript = (key: string, value: string) => {
  window.postMessage({ type: 'setStorageData', key, value }, '*')
}

export const getGitlabUrl = (def = '') => getValue('gitlabUrl', def)
export const getGitlabProjectName = (def = '') => getValue('gitlabProjectName', def)
export const getGitlabAccessToken = (def = '') => getValue('gitlabAccessToken', def)

export const getGitlabUrlFromContentScript = (def = '') => getValueFromContentScript('gitlabUrl', def)
export const getGitlabProjectNameFromContentScript = (def = '') => getValueFromContentScript('gitlabProjectName', def)
export const getGitlabAccessTokenFromContentScript = (def = '') => getValueFromContentScript('gitlabAccessToken', def)

export const setGilabUrl = (value: string) => setValue('gitlabUrl', value)
export const setGilabProjectName = (value: string) => setValue('gitlabProjectName', value)
export const setGilabAccessToken = (value: string) => setValue('gitlabAccessToken', value)
