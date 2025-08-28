import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Heart, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
    // Team members data
    const team = [
        {
            name: "Mohammad Armaan",
            role: "DBIT CSE",
            bio: "4th Year Student",
            image: "/Armaan.png?height=200&width=200&text=CR",
        },
        {
            name: "Mohammed Moinuddin",
            role: "DBIT CSE",
            bio: "4th Year Student",
            image: "/Moinuddin.png?height=200&width=200&text=SJ",
        },
        {
            name: "Muhammed Shaheer",
            role: "DBIT CSE",
            bio: "4th Year Student",
            image: "/Shaheer.jpg?height=200&width=200&text=AP",
        },
        {
            name: "Koustav Das",
            role: "DBIT CSE",
            bio: "4th Year Student",
            image: "/Koustav.png?height=200&width=200&text=MC",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-green-900 mb-4">
                    About FarmFund
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We're on a mission to create a transparent and efficient
                    system for supporting small farmers around the world.
                </p>
            </div>

            {/* Our Story */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                    <h2 className="text-3xl font-bold text-green-900 mb-6">
                        Our Vision
                    </h2>
                    <div className="space-y-4 text-gray-600">
                        <p className="text-lg">
                            At FarmFund, we envision a world where small farmers
                            thrive through direct, transparent access to the
                            resources they need. By leveraging blockchain
                            technology, we aim to eliminate inefficiencies and
                            intermediaries in aid distribution—empowering
                            farmers, restoring trust, and fostering sustainable
                            agricultural growth across developing communities.
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Image
                        src="/vision.jpg"
                        alt="FarmFund Story"
                        width={400}
                        height={400}
                        className="rounded-lg shadow-xl"
                    />
                </div>
            </div>

            {/* Our Mission */}
            <div className="bg-green-50 rounded-xl p-8 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-900 mb-4">
                        Our Mission
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're committed to creating a more equitable and
                        sustainable agricultural ecosystem through transparency
                        and direct support.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-900">
                                Transparency
                            </h3>
                            <p className="text-gray-600">
                                We believe in complete transparency in aid
                                distribution. Our blockchain-based platform
                                ensures that every transaction is recorded and
                                visible to all stakeholders.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Heart className="h-6 w-6 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-900">
                                Empowerment
                            </h3>
                            <p className="text-gray-600">
                                We aim to empower small farmers by providing
                                them with direct access to resources and
                                support, enabling them to develop sustainable
                                farming practices.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-900">
                                Sustainability
                            </h3>
                            <p className="text-gray-600">
                                We're committed to promoting sustainable farming
                                practices that protect the environment and
                                ensure long-term food security for communities
                                around the world.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Our Team */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-900 mb-4">
                        Our Team
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        This project, <strong>FarmFund</strong>, is our Final
                        Year Project developed by students from{" "}
                        <strong>Don Bosco Institute of Technology</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member, index) => (
                        <Card
                            key={index}
                            className="border-none shadow-lg overflow-hidden"
                        >
                            <div className="h-48 bg-gradient-to-br from-green-100 to-pink-100 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={member.image || "/placeholder.svg"}
                                        alt={member.name}
                                        width={100}
                                        height={100}
                                        className="rounded-full border-4 border-white"
                                    />
                                </div>
                            </div>
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-bold text-lg text-green-900">
                                    {member.name}
                                </h3>
                                <p className="text-pink-600 mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600">{member.bio}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Impact */}
            {/* <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-green-900 mb-4">Our Impact</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Since our launch, we've made a significant impact on farming communities around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-green-50 rounded-xl p-8 text-center">
            <div className="text-4xl font-bold text-green-900 mb-2">350+</div>
            <div className="text-lg text-green-700">Farmers Supported</div>
          </div>
          <div className="bg-pink-50 rounded-xl p-8 text-center">
            <div className="text-4xl font-bold text-pink-900 mb-2">120+</div>
            <div className="text-lg text-pink-700">Active Donors</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-8 text-center">
            <div className="text-4xl font-bold text-yellow-900 mb-2">$1.2M+</div>
            <div className="text-lg text-yellow-700">Funds Distributed</div>
          </div>
        </div>
      </div> */}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-pink-500 text-white rounded-xl p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Join Us in Making a Difference
                </h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                    Whether you're a donor looking to make an impact or a farmer
                    seeking support, FarmFund provides a transparent platform to
                    connect and create positive change.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-yellow-400 hover:bg-yellow-500 text-green-900"
                    >
                        <Link href="/register?type=donor">
                            Register as Donor
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="border-white text-white hover:bg-green-700 bg-green-600"
                    >
                        <Link href="/register?type=farmer">
                            Register as Farmer
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
