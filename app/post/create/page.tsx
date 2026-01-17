import Header from '@/components/Header'
import RichTextEditor from '@/components/rich-text-editor'

const page = () => {

    return (
        <div>
            <Header />

            <main className="mx-auto max-w-6xl h-screen px-3 sm:px-6 py-18 sm:py-24">
                <div className="max-w-6xl mx-auto bg-white border p-6 sm:p-10">
                
                    <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">Create New Post</h1>
                    <div className="flex justify-end gap-3">
                        <button
                            type="submit"
                            className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]  cursor-pointer"
                        >
                            Draft
                        </button>
                        <button
                            type="submit"
                            className="flex h-10 w-full items-center justify-center rounded-full border border-solid border-black px-3 transition-colors hover:border-transparent hover:bg-black/[.8] dark:border-white/[.145] bg-black text-white cursor-pointer"
                        >
                            Publish
                        </button>
                        </div>

                    </div>

                    <form className="space-y-6">

                        {/* Title */}
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            placeholder="Post title..."
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />

                        {/* Slug */}
                        <div>
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <input
                            type="text"
                            placeholder="post-title-slug"
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        </div>

                        {/* Summary */}
                        <div>
                        <label className="block text-sm font-medium mb-1">Summary</label>
                        <textarea
                            rows={3}
                            placeholder="Short summary..."
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                        </div>

                        {/* Content */}
                        <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <RichTextEditor/>

                        </div>

                    </form>

                </div>
            </main>
        </div>
    )
}

export default page
