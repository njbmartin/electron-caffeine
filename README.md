<img src='https://octodex.github.com/images/femalecodertocat.png' width='240' height='240' />

# electron-caffeine

> Easily prevent an [Electron](http://electron.atom.io) app from sleeping from either the `main` or `renderer` process.

## installation

``` bash
npm install njbmartin/electron-caffeine --save
```

## Usage

Include the `caffeineMain` in your `main` process.

```js
const { caffeineMain } = require('electron-caffeine')
```

> **Note:** `caffeineMain` is an _immediately-invoked function_ which automatically registers as a listener for `electron-caffeine` ipc events, as well as exposing methods to the `main` process.
This allows you to control the process using methods exposed by either `caffeineMain` or `caffeineRenderer`, as outlined below.

### `caffeineMain`

> **Process:** `main`

## Methods

The following methods can be used by the `main` process:

> **Note:** These are the methods used by `electronRenderer` during the ipc call, hence the _immediately-invoked function_.

### `start(emit)`
- `emit`: boolean _(default: `true`)_

Start the caffeine process globally, preventing the display from sleeping.

`returns`: _boolean_

### `stop(emit)`
- `emit`: boolean _(default: `true`)_

Stop the caffeine process globally.

`returns`: _boolean_

### `isRunning(emit)`
- `emit`: boolean _(default: `false`)_

Check the caffeine process is running.

`returns`: _boolean_

#### `main` process example

```js
const { caffeineMain } = require('electron-caffeine')

// Start the process
caffeineMain.start() // returns boolean

// check the process is running
if(caffeineMain.isRunning()){
    doSomething()
}

// Stop the process
caffeineMain.stop() // returns boolean
```

## `caffeineRenderer`

> **Process:** `renderer`

`caffeineRenderer` uses `ipcRenderer` to send and receive `caffeine` events.

### Events

### `caffeine-status`

When using any of the methods below, you will need to first subscribe to the `caffeine-status` channel to get the result.

```js
const { ipcRenderer } = require('electron')

ipcRenderer.on('caffeine-status', (_, status) => {
  console.log('status', status)
})
``` 

### Methods

The following methods can be used by the `renderer` process:
> **Note:** As these calls are made via ipc, you will need to subscribe to the `caffeine-status` channel as described above.

### `start()`

Start the caffeine process via an ipc call to the `main` process, preventing the display from sleeping.

### `stop()`

Stop the caffeine process via an ipc call to the `main` process.

### `checkStatus()`

Check the caffeine process is running.

#### `renderer` process example

```js
const { caffeineRenderer } = require('electron-caffeine')
const { ipcRenderer } = require('electron')

// register for status updates
ipcRenderer.on('caffeine-status', (_, status) => {
  console.log('status', status)
});

// Start the process
caffeineRenderer.start()

// Stop the process
caffeineRenderer.stop()
```