import {useState} from 'react'
import {useQueries, useQuery} from '@tanstack/react-query'
import {Download, Eye} from 'lucide-react'
import {Card, CardContent} from '#/components/ui/card'
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from '#/components/ui/dialog'

/* -------------------------------------------------------------------------- */
/*  Generic attachment shape – keep only the fields you really need          */

/* -------------------------------------------------------------------------- */
export interface Attachment {
    id: string | number
    file_name: string
    /** optional – used to decide how to render the thumbnail */
    document_type?: 'image' | 'pdf' | 'text' | string

    /** any extra data you might want to pass through */
    [key: string]: any
}

/* -------------------------------------------------------------------------- */
/*  Props for the generic viewer                                              */

/* -------------------------------------------------------------------------- */
export interface AttachmentViewerProps<T extends Attachment = Attachment> {
    /** Already‑fetched attachments (optional) */
    attachments?: Array<T>

    /** OR a function that fetches them (receives the `entityId`) */
    fetchFn?: (entityId: string | number) => Promise<Array<T>>

    /** Unique identifier of the parent entity (required when using `fetchFn`) */
    entityId?: string | number

    /** Cache key prefix – defaults to "attachments" */
    queryKeyPrefix?: string

    /** Function that returns a **signed URL** for a given attachment id */
    loadAttachment: (id: T['id']) => Promise<string>

    /** Function that returns a **download URL** (or blob) for a given id */
    downloadAttachment: (id: T['id']) => Promise<string>

    /** Optional UI overrides */
    classNames?: {
        grid?: string
        card?: string
        thumbnail?: string
        dialogContent?: string
    }

    /** Text overrides */
    texts?: {
        loading?: string
        error?: string
        empty?: string
        previewUnavailable?: string
    }

    /** Which file extensions can be shown inside an `<iframe>` */
    previewableExtensions?: Array<string>

    /** Render custom thumbnail when `document_type` !== "image" */
    renderFallbackThumbnail?: (attachment: T) => React.ReactNode
}

/* -------------------------------------------------------------------------- */
/*  Default previewable extensions                                            */
/* -------------------------------------------------------------------------- */
const DEFAULT_PREVIEWABLE_EXTS = [
    'pdf',
    'txt',
    'html',
    'htm',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'svg',
    'json',
    'md',
]

/* -------------------------------------------------------------------------- */
/*  Generic AttachmentViewer Component                                        */

/* -------------------------------------------------------------------------- */
export function AttachmentViewer<T extends Attachment = Attachment>({
                                                                        attachments: staticAttachments,
                                                                        fetchFn,
                                                                        entityId,
                                                                        queryKeyPrefix = 'attachments',
                                                                        loadAttachment,
                                                                        downloadAttachment,
                                                                        classNames = {},
                                                                        texts = {},
                                                                        previewableExtensions = DEFAULT_PREVIEWABLE_EXTS,
                                                                        renderFallbackThumbnail,
                                                                    }: AttachmentViewerProps<T>) {
    const [viewFile, setViewFile] = useState<T | null>(null)

    /* ---------------------------------------------------------------------- */
    /*  1. Fetch attachments (only when `fetchFn` + `entityId` are supplied)   */
    /* ---------------------------------------------------------------------- */
    const {
        data: fetchedAttachments = [],
        isLoading: fetching,
        isError: fetchError,
    } = useQuery({
        queryKey: [queryKeyPrefix, entityId],
        queryFn: async () => {
            if (!fetchFn || entityId == null) return []
            const result = await fetchFn(entityId)
            return Array.isArray(result) ? result : []
        },
        enabled: !!fetchFn && entityId != null,
    })

    const attachments = staticAttachments ?? fetchedAttachments
    const isLoading = !staticAttachments && fetching
    const isError = !staticAttachments && fetchError

    /* ---------------------------------------------------------------------- */
    /*  2. Pre‑load signed URLs for **all** thumbnails (parallel)            */
    /* ---------------------------------------------------------------------- */
    const signedUrlQueries = useQueries({
        queries:
            attachments?.map((file) => ({
                queryKey: [`${queryKeyPrefix}-preview`, file.id],
                queryFn: () => loadAttachment(file.id),
                enabled: !!file.id,
                staleTime: 5 * 60 * 1000, // 5 min – adjust as needed
            })) ?? [],
    })

    /* ---------------------------------------------------------------------- */
    /*  3. Load signed URL for the **modal** preview (on demand)              */
    /* ---------------------------------------------------------------------- */
    const {data: previewUrl} = useQuery({
        queryKey: [`${queryKeyPrefix}-preview`, viewFile?.id],
        queryFn: () => loadAttachment(viewFile!.id),
        enabled: !!viewFile?.id,
        staleTime: 5 * 60 * 1000,
    })

    /* ---------------------------------------------------------------------- */
    /*  4. Helper – download file                                             */
    /* ---------------------------------------------------------------------- */
    const handleDownload = async (file: T) => {
        try {
            const url = await downloadAttachment(file.id)
            const link = document.createElement('a')
            link.href = url
            link.download = file.file_name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.error('Download failed:', err)
        }
    }

    /* ---------------------------------------------------------------------- */
    /*  5. UI text defaults                                                   */
    /* ---------------------------------------------------------------------- */
    const {
        loading = 'Loading attachments...',
        error = 'Failed to load attachments.',
        empty = 'No attachments available.',
        previewUnavailable = 'Preview not available. Please download to view.',
    } = texts

    /* ---------------------------------------------------------------------- */
    /*  6. Render                                                             */
    /* ---------------------------------------------------------------------- */
    return (
        <div>
            {/* ---------- States ---------- */}
            {isLoading && <p className="text-sm text-gray-500 mt-3">{loading}</p>}
            {isError && <p className="text-sm text-red-500 mt-3">{error}</p>}
            {!isLoading && attachments.length === 0 && (
                <p className="text-sm text-gray-500 mt-3">{empty}</p>
            )}

            {/* ---------- Grid ---------- */}
            {attachments.length > 0 && (
                <div
                    className={`mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${classNames.grid ?? ''}`}
                >
                    {attachments.map((file, idx) => {
                        const signedUrl = signedUrlQueries[idx]?.data

                        const defaultFallback = (
                            <div
                                className="flex flex-col items-center justify-center w-full h-36 bg-linear-to-br from-gray-50 to-gray-100 text-gray-700">
                                <div className="text-4xl font-bold">
                                    {file.file_name.split('.').pop()?.toUpperCase() ?? 'FILE'}
                                </div>
                                <span className="text-xs mt-1 truncate max-w-[90%]">
                  {file.file_name}
                </span>
                            </div>
                        )

                        const thumbnail =
                            file.document_type === 'image' && signedUrl ? (
                                <img
                                    src={signedUrl}
                                    alt={file.file_name}
                                    className={`object-cover w-full h-36 ${classNames.thumbnail ?? ''}`}
                                />
                            ) : (
                                (renderFallbackThumbnail?.(file) ?? defaultFallback)
                            )

                        return (
                            <Card
                                key={file.id}
                                className={`relative group rounded-md shadow overflow-hidden hover:-translate-y-1 transition ${classNames.card ?? ''}`}
                            >
                                <CardContent className="p-0">
                                    {thumbnail}

                                    {/* File name overlay for images */}
                                    {file.document_type === 'image' && (
                                        <div
                                            className="absolute bottom-0 w-full bg-linear-to-t from-black/60 to-transparent px-2 py-1">
                                            <p className="text-xs text-white truncate">
                                                {file.file_name}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div
                                        className="absolute inset-0 flex items-start justify-end p-2 gap-1 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            type="button"
                                            onClick={() => setViewFile(file)}
                                            className="p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition"
                                            aria-label="View"
                                        >
                                            <Eye className="w-4 h-4 text-gray-700"/>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDownload(file)}
                                            className="p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition"
                                            aria-label="Download"
                                        >
                                            <Download className="w-4 h-4 text-gray-700"/>
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* ---------- Preview Dialog ---------- */}
            <Dialog open={!!viewFile} onOpenChange={() => setViewFile(null)}>
                <DialogContent
                    className={`w-full min-w-full h-screen p-4 ${classNames.dialogContent ?? ''}`}
                >
                    <DialogHeader>
                        <DialogTitle>{viewFile?.file_name}</DialogTitle>
                    </DialogHeader>

                    <div
                        className="relative w-full h-[calc(100vh-73px)] flex items-center justify-center overflow-hidden">
                        {viewFile && previewUrl ? (
                            (() => {
                                const ext =
                                    viewFile.file_name.split('.').pop()?.toLowerCase() ?? ''
                                const canPreview = previewableExtensions.includes(ext)

                                return canPreview ? (
                                    /* ------------------- IFRAME (PDF, images, text…) ------------------- */
                                    <iframe
                                        src={previewUrl}
                                        title={viewFile.file_name}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                    />
                                ) : (
                                    /* ------------------- NON-PREVIEWABLE FILE ------------------- */
                                    <div className="flex flex-col items-center justify-center text-white">
                                        <Download className="w-12 h-12 mb-4"/>
                                        <p className="text-lg">{previewUnavailable}</p>
                                        <button
                                            onClick={() => handleDownload(viewFile)}
                                            className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                                        >
                                            Download File
                                        </button>
                                    </div>
                                )
                            })()
                        ) : (
                            <div className="text-white">Loading preview...</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
