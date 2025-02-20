export type Mantela = {
    $schema?: string
    version: string
    aboutMe: AboutMe
    extensions:Extension[]
    providers:Provider[]
}

export type AboutMe = {
    name: string
    prefferedPrefix?: string
    identifier?: string
    sipUser?: string
    sipPassword?: string
    sipServer?: string
    sipPort?: string
}

export type Extension = {
    name: string
    extension: string
    type?: "phone" | "fax" |
    "modem" | "switchboard" |
    "other" | "reserved" |
    "unused" | "unknown"
    model?: string
}

export type Provider = {
    name: string
    prefix?: string
    identifier?: string
    mantela?: string
}