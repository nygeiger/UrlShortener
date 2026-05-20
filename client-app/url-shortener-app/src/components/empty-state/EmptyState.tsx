export default function EmptyState() {
    return (
        <div className="mx-4 md:container md:mx-auto pt-2 pb-10">
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m2.828-2.829a4.5 4.5 0 016.364 0M9 10h.01" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No links yet</h3>
                    <p className="text-gray-400 mb-2">Start saving and shortening links!</p>
                    <p className="text-gray-400">
                        Don't have one in mind?{" "}
                        <a href="https://pop-kulture.netlify.app/" target="_blank" rel="noreferrer noopener" className="text-blue-500 hover:text-blue-400 underline">
                            Try https://pop-kulture.netlify.app/
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
