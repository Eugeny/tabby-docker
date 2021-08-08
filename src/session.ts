import * as shellQuote from 'shell-quote'
import { Injector } from '@angular/core'
import { LogService } from 'tabby-core'
import { BaseSession } from 'tabby-terminal'
import { DockerProfile } from './profiles'
import { Container, DockerProcess, DockerService } from './services/docker.service'

export class DockerSession extends BaseSession {
    private docker: DockerService
    private process: DockerProcess|undefined
    private container: Container|undefined

    constructor (injector: Injector, private profile: DockerProfile) {
        super(injector.get(LogService).create(`docker-${profile.options.containerName ?? profile.options.containerID ?? profile.options.imageID ?? 'unknown'}`))
        this.docker = injector.get(DockerService)
    }

    async start (): Promise<void> {
        let containerID = this.profile.options.containerID
        let args: string|string[] = this.profile.options.command || '/bin/sh'
        if (args && args[0].length > 0) {
            args = shellQuote.parse(args)
        }

        if (this.profile.options.imageID) {
            this.emitOutput(Buffer.from(`Starting container with image ${this.profile.options.imageID}\r\n`))
            this.container = await this.docker.createContainer(this.profile.options.imageID, this.profile.name, ['/bin/cat'])
            containerID = this.container.id
        }

        if (!containerID && this.profile.options.containerName) {
            containerID = (await this.docker.listContainers()).find(x => x.names.includes(this.profile.options.containerName)).id
            if (!containerID) {
                throw new Error(`Container ${this.profile.options.containerName} not found`)
            }
        }

        this.emitOutput(Buffer.from(`Attaching to ${containerID}\r\n`))
        this.process = await this.docker.exec(
            containerID,
            args as string[],
        )
        this.process.output$.subscribe(data => {
            this.emitOutput(data)
        })
        this.process.closed$.subscribe(() => this.destroy())
        await this.process.start()
        this.logger.info('Attached')
        this.open = true
    }

    resize (columns: number, rows: number): void {
        this.process?.resize(columns, rows)
    }

    write (data: Buffer): void {
        this.process?.write(data)
    }

    kill (): void {
        if (this.container) {
            this.docker.destroyContainer(this.container.id)
        }
        this.process?.stop()
    }

    async gracefullyKillProcess (): Promise<void> {
        this.process?.stop()
    }

    supportsWorkingDirectory (): boolean {
        return false
    }

    async getWorkingDirectory (): Promise<null> {
        return null
    }
}
