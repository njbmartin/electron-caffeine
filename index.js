function caffeineMain () {
  const { powerSaveBlocker, ipcMain } = require('electron')

  if (!ipcMain) return

  let caffeineId = -1
  let sender
  let isStarted = false

  function emitStatus (channel) {
    if (sender) sender.send(channel, isStarted)
  }

  function checkStatus (emit = true, channel = 'caffeine-status') {
    if (caffeineId > -1) {
      isStarted = powerSaveBlocker.isStarted(caffeineId)
    }
    if (emit) emitStatus(channel)

    return isStarted
  }

  function isRunning (emit = false) {
    return checkStatus(emit)
  }

  function start (emit = true) {
    console.log('start')
    if (caffeineId >= 0) {
      stop(caffeineId)
    }
    caffeineId = powerSaveBlocker.start('prevent-display-sleep')
    return checkStatus(emit)
  }

  function stop (emit = true) {
    powerSaveBlocker.stop(caffeineId)
    return checkStatus(emit)
  }
  ipcMain.on('start-caffeine', () => {
    start()
  })

  ipcMain.on('check-caffeine', (event) => {
    sender = event.sender
    checkStatus()
  })

  ipcMain.on('stop-caffeine', () => {
    stop()
  })

  return {
    start,
    stop,
    isRunning
  }
}

function caffeineRenderer () {
  const { ipcRenderer } = require('electron')
  if (!ipcRenderer) return

  function checkStatus () {
    ipcRenderer.send('check-caffeine')
  }

  function start () {
    ipcRenderer.send('start-caffeine')
  }

  function stop () {
    ipcRenderer.send('stop-caffeine')
  }

  checkStatus()

  return {
    start,
    stop,
    checkStatus
  }
}

module.exports = {
  caffeineMain: caffeineMain(),
  caffeineRenderer: caffeineRenderer()
}
