import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-green-950 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <span className="font-bold text-2xl">FarmFund</span>
                        </Link>
                        <p className="text-green-300 mb-4">
                            A transparent aid distribution system for small
                            farmers powered by blockchain technology.
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="#"
                                className="text-green-300 hover:text-white"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-green-300 hover:text-white"
                            >
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-green-300 hover:text-white"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-green-300 hover:text-white"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-green-300 hover:text-white"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-green-300 hover:text-white"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-green-300 hover:text-white"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/farmers"
                                    className="text-green-300 hover:text-white"
                                >
                                    Farmers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/donors"
                                    className="text-green-300 hover:text-white"
                                >
                                    Donors
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/how-it-works"
                                    className="text-green-300 hover:text-white"
                                >
                                    How It Works
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-lg mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-green-300 hover:text-white"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/documentation"
                                    className="text-green-300 hover:text-white"
                                >
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-green-300 hover:text-white"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-green-300 hover:text-white"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* <div>
            <h3 className="font-medium text-lg mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-green-300 mb-4">Stay updated with the latest news and updates from FarmFund.</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-green-900 border-green-800 text-white placeholder:text-green-400"
              />
              <Button className="bg-pink-600 hover:bg-pink-700">Subscribe</Button>
            </div>
          </div> */}
                </div>

                <div className="border-t border-green-800 mt-12 pt-8 text-center text-green-300 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} FarmFund. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
