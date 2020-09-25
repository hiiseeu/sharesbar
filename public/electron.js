const { app, BrowserWindow, Tray, ipcMain } = require('electron')
const path = require("path")
const isDev = require("electron-is-dev");

const imgDir = path.join(__dirname, './assets')

let tray = null
let window = null

app.dock.hide()
app.on('ready', () => {
  createTray()
  createWindow()
})

const createTray = () => {
  tray = new Tray(path.join(imgDir, 'logo.png'))
  // tray.on('right-click', toggleWindow)
  // tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()
  })
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

function createWindow() {
  // 创建浏览器窗口
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  window.loadURL(isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`)

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      if (window.isVisible()) {
        window.hide()
      }
    }
  })

  // window.webContents.openDevTools();
}


const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

ipcMain.on('closeApp', () => {
  app.quit()
  // try{
  //   window.close()
  // } catch(e){
  //   console.log(e)
  // }
  tray.destroy()

})