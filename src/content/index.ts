import DetailButtons from './DetailButtons.svelte'

const detailContainer = document.getElementById('opsbar-edit-issue_container')
if (detailContainer) {
  new DetailButtons({
    target: detailContainer
  })
}
