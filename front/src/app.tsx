import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Progress } from '@components/ui/progress'
import { useUpload } from '@hooks/use-upload'
import { bytesToMB } from '@utils/bytes-to-mb'
import { cn } from 'cn'
import { CloudUpload, Loader2 } from 'lucide-react'

export function App() {
  const {
    uploads,
    isLoading,
    getRootProps,
    getInputProps,
    isDragActive,
    setAllowMultiple,
    handleUpload,
  } = useUpload()

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

      <div className="my-4 flex items-center gap-2">
        <Checkbox onCheckedChange={setAllowMultiple} />
        <span className="text-muted-foreground text-sm">
          Permitir múltiplos arquivos
        </span>
      </div>

      {!!uploads.length && (
        <div>
          {uploads.map((upload) => (
            <div
              key={upload.file.name}
              className="border-accent hover:bg-accent/20 mt-5 rounded-lg border px-4 py-2 transition-all"
            >
              <span>{upload.file.name}</span>
              <small className="text-muted-foreground block">
                {bytesToMB(upload.file.size)} MB
              </small>

              <Progress value={upload.progress} />
            </div>
          ))}
        </div>
      )}

      <Button disabled={!uploads || isLoading} onClick={handleUpload}>
        {isLoading && <Loader2 className="size-4 animate-spin" />}
        Upload
      </Button>
    </main>
  )
}
