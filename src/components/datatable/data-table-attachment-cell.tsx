import {useMutation} from '@tanstack/react-query'
import {toast} from 'sonner'
import {Download} from 'lucide-react'

type AttachmentCellProps = {
    fileName: string
    downloadFn: (fileName: string) => Promise<Blob>
    label?: string
    className?: string
}

/**
 * A dynamic, reusable download cell components.
 */
export function AttachmentCell({
                                   fileName,
                                   downloadFn,
                                   label = 'Download',
                                   className = '',
                               }: AttachmentCellProps) {
    const downloadMutation = useMutation({
        mutationFn: async (name: string) => {
            return await downloadFn(name)
        },
        onSuccess: (blob, name) => {
            const safeName = name || `file_${Date.now()}.pdf`
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', safeName)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
            toast.success(`${safeName} downloaded successfully`)
        },
        onError: () => toast.error('Failed to download attachment'),
    })

    if (!fileName) return <span>-</span>

    return (
        <button
            disabled={downloadMutation.isPending}
            className={`flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 
        disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
            onClick={() => downloadMutation.mutate(fileName)}
        >
            <Download className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"/>
            <span className="text-sm font-medium">
        {downloadMutation.isPending ? 'Downloading...' : label}
      </span>
        </button>
    )
}
