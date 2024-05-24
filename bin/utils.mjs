
import { extract } from 'tar'
import { Readable } from 'node:stream'
import { rename } from 'node:fs/promises'

export async function getLatestTagName(url){

  const response = await fetch(url)
  const resp = await response.json()
  return resp.tag_name

}

export async function downloadExtract(url, filename, dirname){

  const response = await fetch(url)

  const x = extract()
  Readable.fromWeb(response.body).pipe(x)

  await new Promise((r,j) => {
    x.on('error', (e) => {
      j(e)
    })

    x.on('close',() => {
      r(true) 
    })
  })

  await rename(filename, dirname)

}