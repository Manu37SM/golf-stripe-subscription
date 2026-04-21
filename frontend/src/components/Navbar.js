"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/scores", label: "Scores" },
    { href: "/charity", label: "Charity" },
    { href: "/subscription", label: "Subscription" },
  ];

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/dashboard" className="nav-brand">Golf<span>Gives</span></Link>
        <div className="nav-links">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={`nav-link${path === l.href ? ' active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <button onClick={logout} className="nav-link" style={{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:14}}>
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
