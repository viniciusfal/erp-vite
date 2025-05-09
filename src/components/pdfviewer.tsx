import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { zoomPlugin } from '@react-pdf-viewer/zoom'
import { printPlugin } from '@react-pdf-viewer/print'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/zoom/lib/styles/index.css'
import '@react-pdf-viewer/print/lib/styles/index.css'

interface PdfViewerProps {
  pdfUrl: string
  pageNumber?: number
}

export function PdfViewer({ pdfUrl, pageNumber = 1 }: PdfViewerProps) {
  const zoom = zoomPlugin()
  const print = printPlugin()

  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoom
  const { PrintButton } = print

  return (
    <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
      <div className="relative flex h-1/5  w-full flex-col">
        {/* Barra de ferramentas personalizada */}
        <div className="flex justify-between bg-gray-100 p-2">
          <div className="flex gap-2">
            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />
          </div>
          <PrintButton />
        </div>

        {/* Visualizador de PDF */}
        <div className="h-full w-full overflow-y-auto">
          <Viewer
            fileUrl={pdfUrl}
            initialPage={pageNumber - 1} // Página inicial (baseada em zero)
            defaultScale={SpecialZoomLevel.PageWidth} // Ajusta a largura da página automaticamente
            plugins={[zoom, print]}
          />
        </div>
      </div>
    </Worker>
  )
}
