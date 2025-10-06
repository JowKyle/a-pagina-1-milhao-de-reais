import React, { useRef, useEffect, useState } from 'react'

export default function PixelMural({ occupiedBlocks = [], onStartPurchase }) {
  const canvasRef = useRef(null)
  const [viewportScale, setViewportScale] = useState(0.6)
  const gridSize = 1000
  const cellSize = 6
  const minBlock = 5
  const canvasWidth = gridSize * cellSize
  const canvasHeight = gridSize * cellSize
  const sel = useRef({ startX: null, startY: null, endX: null, endY: null, dragging:false })

  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) return
    canvas.width = Math.floor(canvasWidth * viewportScale)
    canvas.height = Math.floor(canvasHeight * viewportScale)
    const ctx = canvas.getContext('2d')
    ctx.setTransform(viewportScale,0,0,viewportScale,0,0)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,canvasWidth,canvasHeight)
    occupiedBlocks.forEach(b => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        ctx.drawImage(img, b.x * cellSize, b.y * cellSize, b.width * cellSize, b.height * cellSize)
      }
      img.onerror = () => {
        ctx.fillStyle = '#cccccc'
        ctx.fillRect(b.x * cellSize, b.y * cellSize, b.width * cellSize, b.height * cellSize)
      }
      img.src = b.image_url
    })
    ctx.strokeStyle = 'rgba(0,0,0,0.03)'
    ctx.lineWidth = 1
    for (let i=0;i<=gridSize;i+=10){
      ctx.beginPath()
      ctx.moveTo(i*cellSize,0)
      ctx.lineTo(i*cellSize,canvasHeight)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0,i*cellSize)
      ctx.lineTo(canvasWidth,i*cellSize)
      ctx.stroke()
    }
  }, [occupiedBlocks, viewportScale])

  function getCellFromEvent(e){
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.floor(((e.clientX - rect.left) / viewportScale) / cellSize)
    const y = Math.floor(((e.clientY - rect.top) / viewportScale) / cellSize)
    return { x: Math.max(0, Math.min(gridSize-1, x)), y: Math.max(0, Math.min(gridSize-1, y)) }
  }

  function snapToMin(value){
    return Math.max(minBlock, Math.floor(value / minBlock) * minBlock)
  }

  function startDrag(e){
    const c = getCellFromEvent(e)
    sel.current.startX = c.x
    sel.current.startY = c.y
    sel.current.dragging = true
  }
  function moveDrag(e){
    if(!sel.current.dragging) return
    const c = getCellFromEvent(e)
    sel.current.endX = c.x
    sel.current.endY = c.y
    drawSelection()
  }
  function endDrag(e){
    if(!sel.current.dragging) return
    sel.current.dragging = false
    const startX = Math.min(sel.current.startX, sel.current.endX)
    const startY = Math.min(sel.current.startY, sel.current.endY)
    const widthCells = Math.abs(sel.current.endX - sel.current.startX) + 1
    const heightCells = Math.abs(sel.current.endY - sel.current.startY) + 1
    const snappedW = snapToMin(widthCells)
    const snappedH = snapToMin(heightCells)
    const finalW = Math.min(snappedW, gridSize - startX)
    const finalH = Math.min(snappedH, gridSize - startY)
    if(finalW < minBlock || finalH < minBlock) return
    onStartPurchase && onStartPurchase({ x: startX, y: startY, width: finalW, height: finalH })
  }

  function drawSelection(){
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0,0,canvas.width/viewportScale, canvas.height/viewportScale)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,gridSize*cellSize, gridSize*cellSize)
    occupiedBlocks.forEach(b=>{
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = ()=> ctx.drawImage(img, b.x * cellSize, b.y * cellSize, b.width * cellSize, b.height * cellSize)
      img.src = b.image_url
    })
    if(sel.current.startX==null || sel.current.endX==null) return
    const startX = Math.min(sel.current.startX, sel.current.endX)
    const startY = Math.min(sel.current.startY, sel.current.endY)
    const width = Math.abs(sel.current.endX - sel.current.startX) + 1
    const height = Math.abs(sel.current.endY - sel.current.startY) + 1
    const snappedW = snapToMin(width)
    const snappedH = snapToMin(height)
    ctx.strokeStyle = 'rgba(255,0,0,0.8)'
    ctx.lineWidth = 2
    ctx.strokeRect(startX*cellSize, startY*cellSize, snappedW*cellSize, snappedH*cellSize)
    ctx.fillStyle = 'rgba(255,0,0,0.08)'
    ctx.fillRect(startX*cellSize, startY*cellSize, snappedW*cellSize, snappedH*cellSize)
  }

  return (
    <div style={{overflow: 'auto', maxWidth: '100%', border: '1px solid #ddd'}}>
      <canvas
        ref={canvasRef}
        style={{ touchAction: 'none', cursor: 'crosshair', width: canvasRef.current ? canvasRef.current.width + 'px' : '100%'}}
        onMouseDown={startDrag}
        onMouseMove={moveDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      />
    </div>
  )
}
