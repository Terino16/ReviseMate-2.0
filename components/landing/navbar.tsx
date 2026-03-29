import Link from "next/link"

export default function Navbar()
{
    return (
        <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-dark">Revise<span className="text-cord">Mate</span></span>
            </div>
            <div className="flex items-center gap-2">
                <Button>
                    <Link href="/login">Login</Link>
                </Button>
                <Button>
                    <Link href="/register">Register</Link>
                </Button>
            </div>
        </nav>
    )
}