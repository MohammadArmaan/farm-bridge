import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Leaf, Shield, Users, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HowItWorksPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
                    How FarmFund Works
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Our blockchain-powered platform ensures every donation
                    reaches the right farmer with complete transparency and
                    accountability.
                </p>
            </div>

            {/* Process Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl text-green-700 dark:text-green-500">
                            <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-green-600">
                                1
                            </div>
                            Registration & Verification
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Farmers and donors sign up on the platform by
                            sharing basic information. The platform team
                            verifies their identities to make sure everyone
                            involved is real and trustworthy. This builds a safe
                            and transparent community from the start.
                        </p>
                        <div className="flex items-center text-green-600 font-medium">
                            <Shield className="h-4 w-4 mr-2" />
                            Ensures trust and accountability
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl text-green-700 dark:text-green-500">
                            <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-pink-600">
                                2
                            </div>
                            Farmers Request Help, Donors Support
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Verified farmers can ask for help by posting what
                            they need - like money for seeds, tools, or water
                            systems - and how much it will cost. Donors then
                            browse these requests and choose which ones to
                            support. Donations go directly to the farmer with
                            full transparency.
                        </p>
                        <div className="flex items-center text-pink-600 font-medium">
                            <Wallet className="h-4 w-4 mr-2" />
                            Transparent fund allocation
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl text-green-700 dark:text-green-500">
                            <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-yellow-600">
                                3
                            </div>
                            Funds Delivered, Reputation Grows
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            When a farmer receives help and uses it properly,
                            the donor’s trust score goes up. This encourages
                            more honest giving and builds a strong cycle of
                            support. If help isn’t claimed in time, the money is
                            safely returned to the donor. Every action is
                            recorded and visible to everyone — so nothing is
                            hidden.
                        </p>
                        <div className="flex items-center text-yellow-600 font-medium">
                            <Leaf className="h-4 w-4 mr-2" />
                            Empowers farmers to grow
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Explanation */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-500  mb-4">
                        The FarmFund Process
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A detailed look at how our platform connects donors with
                        farmers through blockchain technology.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Step 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4">
                                Registration & Verification
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Donor Registration:
                                        </span>{" "}
                                        Organizations or individuals register by
                                        providing their name, description, and
                                        connecting their Ethereum wallet. This
                                        creates a transparent identity on the
                                        blockchain.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Farmer Registration:
                                        </span>{" "}
                                        Farmers register by providing their
                                        name, location, farm type, and
                                        connecting their Ethereum wallet. This
                                        creates a verifiable profile that donors
                                        can review.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Verification Process:
                                        </span>{" "}
                                        The platform owner verifies both donors
                                        and farmers to ensure legitimacy. This
                                        adds an extra layer of trust to the
                                        ecosystem.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <Image
                                src="/registerandverify.jpg"
                                alt="Registration Process"
                                width={400}
                                height={200}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        {/* Left column: text */}
                        <div className="order-2">
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4">
                                Disbursement Creation
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Farmers Request Help:{" "}
                                        </span>{" "}
                                        Verified farmers explain what they need,
                                        why they need it, and how much money is
                                        required - like support for seeds,
                                        irrigation, or tools.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Donors Choose Who to Support:
                                        </span>{" "}
                                        Verified donors go through these
                                        requests and decide who they want to
                                        help, based on the farmer’s story,
                                        location, or type of farming.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Secure & Transparent Funding:
                                        </span>{" "}
                                        Once a donor sends support, the platform
                                        makes sure the money is safely sent to
                                        the right farmer and records everything
                                        openly on the blockchain — so nothing
                                        can be hidden or changed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right column: image */}
                        <div className="order-1">
                            <Image
                                src="/disbursementcreation.jpg"
                                alt="Disbursement Process"
                                width={400}
                                height={200}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4">
                                Secure & Transparent Funding:
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Farmers Receive the Help:{" "}
                                        </span>{" "}
                                        When a donor supports a farmer’s
                                        request, the farmer gets notified and
                                        can claim the funds directly into their
                                        wallet before the deadline.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            Building Trust Through Reputation:
                                        </span>{" "}
                                        Every time a donation is successfully
                                        claimed and used, the donor’s trust
                                        score goes up — encouraging more honest
                                        giving and long-term support.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            No Wasted Funds:{" "}
                                        </span>{" "}
                                        If a farmer doesn’t claim the help in
                                        time, the money safely goes back to the
                                        donor, making sure nothing is lost or
                                        stuck.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <Image
                                src="/securetransparentfunding.jpg"
                                alt="Claiming Process"
                                width={400}
                                height={200}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-4">
                        Benefits of FarmFund
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our platform offers unique advantages for both donors
                        and farmers through blockchain technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-500">
                                Transparency
                            </h3>
                            <p className="text-muted-foreground">
                                All transactions are recorded on the blockchain,
                                creating a transparent and immutable record of
                                fund movement.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-500">
                                Direct Connection
                            </h3>
                            <p className="text-muted-foreground">
                                Donors and farmers connect directly without
                                intermediaries, reducing overhead and increasing
                                impact.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-500">
                                Efficiency
                            </h3>
                            <p className="ttext-muted-foreground">
                                Smart contracts automate the disbursement and
                                claiming process, reducing administrative
                                overhead.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Leaf className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-500">
                                Sustainability
                            </h3>
                            <p className="text-muted-foreground">
                                The platform encourages long-term relationships
                                between donors and farmers, promoting
                                sustainable development.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-6">
                    Ready to Get Started?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    Join FarmFund today and be part of a transparent ecosystem
                    that empowers small farmers around the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Link href="/register?type=donor">
                            Register as Donor
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
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
