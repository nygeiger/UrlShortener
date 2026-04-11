
interface IHeaderProps {
}

export default function Header(props: IHeaderProps) {
    return (
        <div className="bg-slate-900">
            <div className="container p-2 mx-auto">
                <nav className="py-5">
                    <div className="text-base text-white">URL SHORTENER</div>
                </nav>
            </div>
        </div>
    )
}
