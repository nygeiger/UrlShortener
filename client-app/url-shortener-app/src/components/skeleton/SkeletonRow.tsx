export default function SkeletonRow() {
    return (
        <tr className="border-b bg-gray-600">
            <td className="px-6 py-3">
                <div className="skeleton-loader"></div>
            </td>
            <td className="px-6 py-3">
                <div className="skeleton-loader"></div>
            </td>
            <td className="px-6 py-3">
                <div className="skeleton-loader"></div>
            </td>
            <td className="px-6 py-3">
                <div className="flex flex-row gap-2">
                    <div className="skeleton-loader rounded-full w-6 h-6"></div>
                    <div className="skeleton-loader rounded-full w-6 h-6"></div>
                </div>
            </td>
        </tr>
    )
}
