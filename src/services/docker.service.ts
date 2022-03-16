import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'
import Docker, { ImageInfo } from 'dockerode'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import type { Duplex } from 'stream'
import { ConfigService, Logger, LogService } from 'tabby-core'

export interface Container {
    id: string
    names: string[]
    image: string
    state: string
}

export interface Image {
    id: string
    description: string
    tags: string[]
}

export class DockerProcess {
    get output$ (): Observable<Buffer> { return this.output }
    get closed$ (): Observable<void> { return this.closed }
    private output = new Subject<Buffer>()
    private closed = new Subject<void>()
    private stream: Duplex
    private dead = false

    constructor (private exec: any) { }

    async start (): Promise<void> {
        this.stream = await this.exec.start({
            hijack: true,
            stdin: true,
            Tty: true,
        })
        this.stream.on('data', data => this.output.next(data))
        this.stream.on('close', () => {
            this.dead = true
            this.close()
        })
    }

    async resize (w: number, h: number): Promise<void> {
        await this.exec.resize({ w, h })
    }

    write (data: Buffer) {
        if (!this.dead) {
            this.stream.write(data)
        }
    }

    async stop (): Promise<void> {
        this.write(Buffer.from([31])) // Ctrl-_
        const state = await this.exec.inspect()
        if (state.Pid && !this.dead) {
            try {
                process.kill(state.Pid)
            } catch (e) {
                if (!e.toString().includes('ESRCH')) {
                    throw e
                }
            }
        }
    }

    private close () {
        this.output.complete()
        this.closed.next()
        this.closed.complete()
    }
}

@Injectable({ providedIn: 'root' })
export class DockerService {
    logger: Logger

    constructor (log: LogService, private config: ConfigService) {
        this.logger = log.create('docker')
    }

    async listContainers (): Promise<Container[]> {
        return (await this.getDocker().listContainers()).map(container => ({
            id: container.Id,
            names: container.Names ?? [],
            image: container.Image,
            state: container.State,
        }))
    }

    async listImages (): Promise<Image[]> {
        return (await this.getDocker().listImages()).map(image => ({
            id: image.Id,
            description: this.getImageDescription(image),
            tags: image.RepoTags,
        }))
    }

    async createContainer (imageID: string, name: string, args: string[]|null): Promise<Container> {
        this.logger.info('run', args, 'in', imageID)
        const container = await this.getDocker().createContainer({
            name: slugify(`tabby-${name}-${uuidv4()}`),
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            OpenStdin: true,
            Entrypoint: args ?? undefined,
            Image: imageID,
        })
        await container.start()
        const info = await container.inspect()
        return {
            id: info.Id,
            names: [info.Name],
            image: info.Image,
            state: info.State.Status,
        }
    }

    async destroyContainer (containerID: string): Promise<void> {
        const container = await this.getDocker().getContainer(containerID)
        try {
            await container.kill()
        } catch { }
        await container.remove()
    }

    async exec (containerID: string, args: string[]): Promise<DockerProcess> {
        this.logger.info('exec', args, 'in', containerID)
        const container = await this.getDocker().getContainer(containerID)
        const exec = await container.exec({
            Cmd: args,
            DetachKeys: 'ctrl-_',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
        })
        return new DockerProcess(exec)
    }

    getImageDescription (image: ImageInfo): string {
        if (image.RepoTags[0] === '<none>:<none>') {
            return image.Id
        }
        return image.RepoTags[0]
    }

    private getDocker (): Docker {
        let opts: any = {}
        if (this.config.store.docker.socket) {
            opts.socketPath = this.config.store.docker.socket
        }
        if (this.config.store.docker.host) {
            opts.host = this.config.store.docker.host
        }
        if (this.config.store.docker.port) {
            opts.port = this.config.store.docker.port
        }
        return new Docker(opts)
    }

}
