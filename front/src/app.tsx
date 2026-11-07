import { bytesToMB } from '@utils/bytes-to-mb'
import { cn } from 'cn'
import { CloudUpload } from 'lucide-react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './components/ui/button'

export function App() {
  const [file, setFile] = useState<File>()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop: ([acceptedFile]) => {
      setFile(acceptedFile)
    },
  })

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold tracking-tighter">
        Upload da arquivos
      </h1>

      <div
        {...getRootProps()}
        className={cn(
          'group border-accent group grid w-full cursor-pointer place-items-center gap-4 rounded-lg border-2 border-dashed p-30 transition-all hover:border-white/30',
          isDragActive && 'bg-accent/20',
        )}
      >
        <input {...getInputProps()} />

        <CloudUpload className="text-muted-foreground size-10 stroke-1 group-hover:text-white" />

        <span className="text-muted-foreground text-sm group-hover:text-white">
          Solte o arquivo aqui.
        </span>
      </div>

      {file && (
        <div className="border-accent hover:bg-accent/20 mt-5 rounded-lg border px-4 py-2 transition-all">
          <span>{file.name}</span>
          <small className="text-muted-foreground block">
            {bytesToMB(file.size)} MB
          </small>
        </div>
      )}

      <Button disabled={!file}>Upload</Button>
    </main>
  )
}
