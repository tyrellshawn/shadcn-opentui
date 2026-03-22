import { spawn, type ChildProcess } from 'node:child_process'
import process from 'node:process'

import waitOn from 'wait-on'

export interface NextServerHandle {
  port: number
  baseUrl: string
  stop: () => Promise<void>
}

export async function startNextServer(port = 3010): Promise<NextServerHandle> {
  const child = spawn('bun', ['--bun', 'next', 'dev', '--port', String(port)], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      CI: '1',
    },
    stdio: 'pipe',
  })

  await waitOn({
    resources: [`http://127.0.0.1:${port}`],
    timeout: 120000,
  })

  return {
    port,
    baseUrl: `http://127.0.0.1:${port}`,
    stop: () => stopProcess(child),
  }
}

function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.killed) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      child.kill('SIGKILL')
    }, 5000)

    child.once('exit', () => {
      clearTimeout(timeout)
      resolve()
    })

    child.kill('SIGTERM')
  })
}
