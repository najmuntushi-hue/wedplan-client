import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-rose-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-rose-600">
            <img src="/logo.jfif" alt="WedPlan logo" className="h-9 w-auto" /> WedPlan
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Discover trusted wedding vendors and plan your perfect day in one place.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-rose-600">Home</Link></li>
            <li><Link href="/services" className="hover:text-rose-600">Browse Services</Link></li>
            <li><Link href="/sign-in" className="hover:text-rose-600">Sign In</Link></li>
            <li><Link href="/sign-up" className="hover:text-rose-600">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@wedplan.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Sylhet, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold">Follow Us</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-rose-600">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-rose-600">Instagram</a></li>
            <li><a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-rose-600">X (Twitter)</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-rose-600">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-sm text-muted-foreground">
        © 2026 WedPlan. All rights reserved.
      </div>
    </footer>
  );
}