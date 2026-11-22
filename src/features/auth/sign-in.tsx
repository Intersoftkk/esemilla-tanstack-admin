import {SignInForm} from '#/features/auth/components/sign-in-form.tsx'

interface SignInPageProps {
    search?: any
}

export default function SignInPage({search}: SignInPageProps) {
    return <SignInForm search={search} />
}