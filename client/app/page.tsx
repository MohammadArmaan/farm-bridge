import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Leaf, Shield, Users, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import StatsCounter from "@/components/stats-counter";
import FarmerList from "./demo/page";
import ContractStatsSection from "@/components/ContractStatsSection";

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-600 via-green-900 to-yellow-200 py-20 md:py-32">
                <div className="absolute inset-0 bg-[url('/heroCoverImage.jpeg?height=500&width=1000')] bg-cover bg-center opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                Transparent Aid Distribution for Farmers
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-white/90">
                                FarmFund connects donors directly with small
                                farmers, ensuring transparency and
                                accountability through blockchain technology.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-yellow-400 hover:bg-yellow-500 text-green-700"
                                >
                                    <Link href="/register">Get Started</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    className="border-white text-white hover:bg-green-700 bg-green-500"
                                >
                                    <Link href="/about">Learn More</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Image
                                src="personWithTab.jpg"
                                alt="Farmers working in field"
                                width={500}
                                height={400}
                                className="rounded-lg shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCounter title="Total Donors" value={124} icon={<Users className="h-8 w-8 text-green-500" />} />
            <StatsCounter title="Farmers Supported" value={356} icon={<Leaf className="h-8 w-8 text-pink-500" />} />
            <StatsCounter
              title="Funds Distributed"
              value={1250000}
              prefix="$"
              icon={<Wallet className="h-8 w-8 text-yellow-500" />}
            />
          </div>
        </div>
      </section> */}
            <ContractStatsSection />

            {/* How It Works */}
            <section className="py-20 bg-gray-50 dark:bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
                            How FarmFund Works
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our blockchain-powered platform ensures every
                            donation reaches the right farmer with complete
                            transparency.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Shield className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-green-500">
                                    1. Register & Verify
                                </h3>
                                <p className="text-muted-foreground">
                                    Donors and farmers register on the platform
                                    and get verified to ensure legitimacy and
                                    trust.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Wallet className="h-8 w-8 text-pink-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-green-500">
                                    2. Create Disbursements
                                </h3>
                                <p className="text-muted-foreground">
                                    Donors create disbursements specifying the
                                    farmer, purpose, and deadline for claiming
                                    funds.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Leaf className="h-8 w-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-green-500">
                                    3. Claim & Grow
                                </h3>
                                <p className="text-muted-foreground">
                                    Farmers claim their funds before the
                                    deadline and use them to develop their
                                    farms.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Button
                            asChild
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Link href="/how-it-works">
                                Learn More About The Process
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Farmers */}
            {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">Featured Farmers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet some of the farmers who have benefited from the FarmFund platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 relative">
                  <Image
                    src={`/placeholder.svg?height=200&width=400&text=Farmer ${i}`}
                    alt={`Farmer ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2 text-green-700">Farmer Name {i}</h3>
                  <p className="text-sm text-gray-500 mb-3">Location {i} • Organic Farming</p>
                  <p className="text-gray-600 mb-4">
                    "FarmFund has helped me expand my farm and implement sustainable farming practices. The transparent
                    process gives me confidence."
                  </p>
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              <Link href="/farmers">
                View All Farmers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section> */}

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-500 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            Join FarmFund today and be part of a transparent
                            ecosystem that empowers small farmers around the
                            world.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-yellow-400 hover:bg-yellow-500 text-green-700"
                            >
                                <Link href="/register?type=donor">
                                    Register as Donor
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                className="bg-green-600 text-white hover:bg-green-700"
                            >
                                <Link href="/register?type=farmer">
                                    Register as Farmer
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
                {/* <FarmerList/> */}
            </section>
        </div>
    );
}
