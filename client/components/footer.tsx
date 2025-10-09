"use client";

import Link from "next/link";
import { Coins, Facebook, Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { FaEthereum } from "react-icons/fa";
import { GiFox } from "react-icons/gi";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLocale } from "./locale-provider";
import Logo from "./Logo";

export default function Footer() {
    const { t } = useLocale();

    return (
        <footer className="bg-green-950 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand + Socials */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Logo height={50} width={50} />
                            <span className="font-bold text-2xl">
                                FarmBridge
                            </span>
                        </Link>
                        <p className="text-green-300 mb-4">
                            {t("footer.tagline")}
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://sepolia.etherscan.io/address/0x0FE27a83959FD45bb9E173DeD862596fB0755165"
                                className="text-green-300 hover:text-white"
                                target="_blank"
                            >
                                <FaEthereum className="h-5 w-5" />
                                <span className="sr-only">Etherscan</span>
                            </a>
                            <a
                                href="https://metamask.io/en-GB/download"
                                className="text-green-300 hover:text-white"
                                target="_blank"
                            >
                                <GiFox className="h-5 w-5" />
                                <span className="sr-only">Metamask</span>
                            </a>
                            <a
                                href="https://github.com/MohammadArmaan/farm-bridge"
                                className="text-green-300 hover:text-white"
                                target="_blank"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub Repo</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/mohammad-armaan-8b61b127a/"
                                className="text-green-300 hover:text-white"
                                target="_blank"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a
                                href="https://mail.google.com/mail/?view=cm&fs=1&to=farmbridge.chain@gmail.com&su=FarmBridge%20Inquiry&body=Hello%2C%20I%20would%20like%20to%20know%20more..."
                                className="text-green-300 hover:text-white"
                                target="_blank"
                            >
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Mail To</span>
                            </a>
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
                            {/* <li>
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
                            </li> */}
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
