import Head from 'next/head'
import { useState } from 'react'
import PixelMural from '../components/PixelMural'

export default function Home() {
  const [occupied, setOccupied] = useState([]) // should fetch from API in real use
  const handleStartPurchase = (block) => {
    // open modal - simplified flow: console.log
    alert(`Você selecionou: x=${block.x} y=${block.y} w=${block.width} h=${block.height}. Próximo: checkout.`)
    // In production: call API /api/createPreference, redirect to Mercado Pago
  }

  return (
    <div>
      <Head>
        <title>A Pagina de 1 Milhão de Reais</title>
        <meta name="description" content="Compre pixels - mínimo 5x5 - Mercado Pago" />
      </Head>
      <main style={{padding:20}}>
        <h1>A Pagina de 1 Milhão de Reais</h1>
        <p>Grid 1000x1000 — mínimo de compra 5x5 células.</p>
        <PixelMural occupiedBlocks={occupied} onStartPurchase={handleStartPurchase} />
      </main>
    </div>
  )
}
