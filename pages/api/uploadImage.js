// This endpoint resizes and stores images (example, uses sharp and Supabase client)
import formidable from 'formidable'
import fs from 'fs'
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } }

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) return res.status(500).json({ error: 'form parse error' })
      const { x, y, width, height, tx_id } = fields
      const file = files.file
      if (!file) return res.status(400).json({ error: 'no file' })
      // resize image to block pixel size. We assume cellSize = 6 (same default from front)
      const cellSize = 6
      const outW = parseInt(width) * cellSize
      const outH = parseInt(height) * cellSize
      const buffer = fs.readFileSync(file.path)
      const resized = await sharp(buffer).resize(outW, outH, { fit: 'contain', background: '#ffffff' }).png().toBuffer()
      const filename = `uploads/${tx_id}_${Date.now()}.png`
      const { data, error } = await supabase.storage.from('uploads').upload(filename, resized, { contentType: 'image/png', upsert: false })
      if (error) return res.status(500).json({ error: 'upload failed', details: error })
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL.replace('/','')}/storage/v1/object/public/uploads/${filename}`
      // TODO: update pixel record in DB to status=approved after admin review (or mark pending)
      return res.status(200).json({ url: publicUrl })
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: 'server error' })
    }
  })
}
