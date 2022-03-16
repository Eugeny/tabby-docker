import { ConfigProvider } from 'tabby-core'

/** @hidden */
export class DockerConfigProvider extends ConfigProvider {
    defaults = {
        docker: {
            host: null,
            port: null,
            socket: null,
        },
    }

    platformDefaults = { }
}
