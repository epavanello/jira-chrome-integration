import DetailButtons from './DetailButtons.svelte'

function onRemove(el: HTMLElement, callback: () => void) {
  new MutationObserver((mutations, observer) => {
    if (!document.body.contains(el)) {
      observer.disconnect()
      callback()
    }
  }).observe(document.body, { childList: true })
}

function onAppair(selector: string, callback: (e: Element) => void, timeout = 0) {
  let found: Element | null = null
  const search = () => (found = document.body.querySelector(selector))
  search()
  if (found) {
    callback(found)
  } else {
    const c = new MutationObserver((mutations, observer) => {
      search()
      if (found) {
        observer.disconnect()
        callback(found)
      }
    })

    c.observe(document.body, { childList: true })

    if (timeout) {
      setTimeout(() => {
        if (!found) {
          c.disconnect()
        }
      }, timeout)
    }
  }
}

console.warn('Gitlab extension: Start')

onAppair(
  '#opsbar-edit-issue_container',
  () => {
    const detailContainer = document.getElementById('opsbar-edit-issue_container')
    if (detailContainer) {
      new DetailButtons({
        target: detailContainer,
        props: {
          issueID: document.querySelector<HTMLMetaElement>('meta[name="ajs-issue-key"]')?.content || ''
        }
      })
    }
  },
  1000
)
// listen for click event on issue to append actions

function renderDetailActions() {
  const renderAfter = document.querySelector('#ghx-detail-head > header')

  // Get issue selected from data-issuekey attribute
  const issueSelected = document.getElementById('ghx-detail-issue')?.getAttribute('data-issuekey')

  console.log('Gitlab extension: issue selected: ' + issueSelected)

  if (renderAfter) {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.marginTop = '5px'
    renderAfter.parentNode?.insertBefore(container, renderAfter.nextSibling)
    const buttons = new DetailButtons({
      target: container,
      props: {
        view: 'detail',
        issueID: issueSelected
      }
    })

    onRemove(container, () => {
      buttons.$destroy()
      console.warn('Gitlab extension: Deleted')
    })

    console.warn('Gitlab extension: Done')
  }
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  const issue = target.closest('.ghx-issue') || target.closest('.ghx-issue-compact')
  if (issue) {
    console.warn('Gitlab extension: Issue clicked')

    const watch = document.querySelector('#ghx-detail-head .spinner') as HTMLElement
    if (watch) {
      onRemove(watch, renderDetailActions)
    }
  }
})

onAppair('#ghx-detail-head', renderDetailActions, 1000)
