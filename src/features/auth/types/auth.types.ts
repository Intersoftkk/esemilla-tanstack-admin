import type {SignUpFormData} from "#/features/auth/schema/sign-up.schema.ts";
import type {SignInFormData} from "#/features/auth/schema/sign-in.schema.ts";

export interface AddressRecord {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface AuthUser {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    mobile: string
    phone: string
    bio: string
    avatar: string
    dateOfBirth: string
    emailVerifiedAt: string
    mobileVerifiedAt: string
    roles: string[]
    permissions: string[]
    address: AddressRecord
    createdAt?: string
    updatedAt?: string
}

export interface LoginData {
    message: string
    type: string | null
    user: AuthUser
}

export interface LoginResponse {
    data: LoginData
}

export interface UserResponse {
    data: AuthUser
}

export interface AuthContextValue {
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: SignInFormData) => Promise<AuthUser>
    register: (payload: SignUpFormData) => Promise<AuthUser>
    forgotPassword: (email: string) => Promise<void>
    logout: () => Promise<void>
    hasPermission: (permission: string) => boolean
    hasAnyPermission: (permissions: string[]) => boolean
    hasRole: (role: string) => boolean
    hasAnyRole: (roles: string[]) => boolean
}