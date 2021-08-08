import { Injectable } from '@angular/core'
import { BaseTabComponent, NewTabParameters, PartialProfile, Profile, ProfileProvider } from 'tabby-core'
import { DockerTabComponent } from './components/dockerTab.component'
import { DockerProfileSettingsComponent } from './components/dockerProfileSettings.component'
import { Container, DockerService } from './services/docker.service'

export interface DockerProfileOptions {
    containerID?: string
    containerName?: string
    imageID?: string
    command: string
}

export interface DockerProfile extends Profile {
    type: 'docker'
    options: DockerProfileOptions
}

@Injectable()
export class DockerProfileProvider extends ProfileProvider<DockerProfile> {
    id = 'docker'
    name = 'Docker'
    weight = 10
    settingsComponent = DockerProfileSettingsComponent
    configDefaults = {
        options: {
            containerID: null,
            containerName: null,
            imageID: null,
            command: null,
        }
    }

    constructor (private docker: DockerService) {
        super()
    }

    async getBuiltinProfiles (): Promise<PartialProfile<DockerProfile>[]> {
        let containers: Container[]
        try {
            containers = await this.docker.listContainers()
        } catch (e) {
            console.error('Could not load Docker containers:', e)
            return []
        }
        return [
            ...containers.map(container => ({
                id: `docker:container-${container.id}`,
                type: 'docker',
                name: container.names[0],
                isBuiltin: true,
                icon: 'fab fa-docker',
                options: {
                    containerID: container.id,
                    containerName: container.names[0],
                },
            })),
            {
                id: `docker:template`,
                type: 'docker',
                name: 'Docker container shell',
                isBuiltin: true,
                isTemplate: true,
                icon: 'fab fa-docker',
                options: { },
            }
        ]
    }

    async getNewTabParameters (profile: DockerProfile): Promise<NewTabParameters<BaseTabComponent>> {
        return {
            type: DockerTabComponent,
            inputs: {
                profile,
            },
        }
    }

    getDescription (_profile: PartialProfile<DockerProfile>): string {
        return ''
    }

}
