// Native
import { join } from 'path'
import { format } from 'url'

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import { Socket } from 'net'

// Prepare the renderer once the app is ready

const client = new Socket();
client.connect(1337, `127.0.0.1`);

app.on('ready', async () => {
  await prepareNext('./renderer')
  
  
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  })
  
  const url = isDev
  ? 'http://localhost:8000/'
  : format({
    pathname: join(__dirname, '../renderer/out/index.html'),
    protocol: 'file:',
    slashes: true,
  })
  
  mainWindow.loadURL(url)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

const dataArray:string[] = []

// cliente
client.on("data", data => {
  dataArray.push(data.toString())
})

ipcMain.on('clear', (event: IpcMainEvent) => {
  dataArray.splice(0, dataArray.length)
  event.sender.send('message', JSON.stringify(dataArray));
})

ipcMain.on('read', (event: IpcMainEvent) => {
  event.sender.send('message', JSON.stringify(dataArray));
})
// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', ((event: IpcMainEvent, message: any) => {
  console.log(message)
  client.write(message)
  event.sender.send("read")
}))
