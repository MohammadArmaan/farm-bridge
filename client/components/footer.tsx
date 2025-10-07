"use client";

import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "./locale-provider";

export default function Footer() {
    const { t } = useLocale();

    return (
        <footer className="bg-green-950 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand + Socials */}
                    <div className="md:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            <span className="font-bold text-2xl">
                                FarmBridge
                            </span>
                        </Link>
                        <p className="text-green-300 mb-4">
                            {t("footer.tagline")}
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

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-medium text-lg mb-4">
                            {t("footer.quickLinks")}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.home")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.about")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/farmers"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.farmers")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/donors"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.donors")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/how-it-works"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.howItWorks")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources + Language Switcher */}
                    <div>
                        <h3 className="font-medium text-lg mb-4">
                            {t("footer.resources")}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <LanguageSwitcher />
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.faq")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/documentation"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.documentation")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.terms")}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-green-300 hover:text-white"
                                >
                                    {t("footer.privacy")}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-green-800 mt-12 pt-8 text-center text-green-300 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} FarmBridge.{" "}
                        {t("footer.rights")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
