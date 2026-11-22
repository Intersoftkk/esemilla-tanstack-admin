import {cn} from "#/lib/utils";
import {Card, CardContent} from "#/components/ui/card";
import React from "react";
import Logo from "#/assets/logo-full.svg";

interface Props {
    children: React.ReactNode;
}

export default function AuthLayout({children}: Props) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className={cn("flex flex-col gap-6")}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2 min-h-75"> {/* Added min-h */}
                            {children}
                            <div
                                className="bg-black hidden md:flex items-center justify-center min-h-75"> {/* Added min-h */}
                                <img
                                    src={Logo}
                                    alt="Image"
                                    className="w-full h-auto object-contain md:max-h-100 lg:max-h-125"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
