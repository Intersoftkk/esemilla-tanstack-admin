import type { ComponentProps } from "react";

export function FormWrapper(props: Omit<ComponentProps<"form">, "className">) {
	return <form className="space-y-6" {...props} />;
}
