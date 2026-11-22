import {useQuery} from '@tanstack/react-query'
import {Loader} from 'lucide-react'
import {formatDistance} from 'date-fns'
import React from 'react'

export interface Comment {
    id: string
    comment: string
    user?: {
        name?: string
        current_position?: string
    }
    created_at?: string
    replies?: Array<Comment>

    [key: string]: any
}

export interface CommentThreadViewProps {
    commentableId?: string
    commentableType: string
    fetchFn: (params: any) => Promise<Array<Comment>>

    /** Optional Custom Renderers */
    renderCommentCard?: (comment: Comment) => React.ReactNode
    renderLoading?: () => React.ReactNode
    renderEmpty?: () => React.ReactNode
}

export default function CommentThreadViewer({
                                                commentableId,
                                                commentableType,
                                                fetchFn,
                                                renderCommentCard,
                                                renderLoading,
                                                renderEmpty,
                                            }: CommentThreadViewProps) {
    const {data: commentsResponse = [], isLoading} = useQuery({
        queryKey: ['comments', commentableType, commentableId],
        queryFn: () =>
            fetchFn({
                filters: {
                    commentable_id: commentableId,
                    commentable_type: commentableType,
                },
                includes: ['user', 'replies'],
                fields: {
                    user: ['name', 'current_position'],
                    comments: [
                        'commentable_type',
                        'commentable_id',
                        'comment',
                        'parent_id',
                        'user_id',
                        'created_at',
                    ],
                },
            }),
        enabled: !!commentableId,
    })

    /** Loading State */
    if (isLoading)
        return (
            renderLoading?.() ?? (
                <div className="flex justify-center items-center p-4">
                    <Loader className="h-6 w-6 animate-spin text-gray-500"/>
                </div>
            )
        )

    /** Empty State */
    if (!commentsResponse?.length)
        return (
            renderEmpty?.() ?? (
                <div className="text-sm text-gray-500 italic p-4">
                    No comments available for this item.
                </div>
            )
        )

    /** Render Comment List */
    return (
        <div className="flex flex-col gap-4 p-4 max-w-3xl w-full">
            {commentsResponse.map((comment) =>
                renderCommentCard ? (
                    renderCommentCard(comment)
                ) : (
                    <CommentCard key={comment.id} comment={comment}/>
                ),
            )}
        </div>
    )
}

/* ----------------------------------------
 * Default CommentCard Component
 * ---------------------------------------- */
function CommentCard({comment}: { comment: Comment }) {
    const user = comment.user

    return (
        <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            {/* Header: User Info */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className="font-medium text-gray-900">{user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                        {user?.current_position || 'User'}
                    </p>
                </div>
                <p className="text-xs text-gray-400">
                    {formatDistance(comment.created_at as string, new Date(), {
                        addSuffix: true,
                    })}
                </p>
            </div>

            {/* Comment Text */}
            <p className="text-gray-800 text-sm whitespace-pre-wrap">
                {comment.comment}
            </p>

            {/* Replies */}
            {(comment.replies?.length ?? 0) > 0 && (
                <div className="mt-3 border-l-2 border-gray-100 pl-3">
                    {comment.replies?.map((reply) => (
                        <CommentCard key={reply.id} comment={reply}/>
                    ))}
                </div>
            )}
        </div>
    )
}
