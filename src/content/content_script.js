const script = document.createElement('script')
script.setAttribute('type', 'module')
script.setAttribute('src', chrome.extension.getURL('content/index.js'))
const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement
head.insertBefore(script, head.lastChild)

window.addEventListener('message', function (e) {
  if (e.data.type === 'getStorageData') {
    const key = e.data.key

    chrome.storage.sync.get([key], function (items) {
      e.source.postMessage({ type: 'getStorageDataResponse', key, value: items[key] })
    })
  } else if (e.data.type === 'setStorageData') {
    chrome.storage.sync.set({ [e.data.key]: e.data.value })
  }
})
