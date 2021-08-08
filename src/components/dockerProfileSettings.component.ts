/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component } from '@angular/core'
import { ProfileSettingsComponent, SelectorService } from 'tabby-core'
import { DockerProfile } from '../profiles'
import { Container, DockerService, Image } from '../services/docker.service'

/** @hidden */
@Component({
    template: require('./dockerProfileSettings.component.pug'),
})
export class DockerProfileSettingsComponent implements ProfileSettingsComponent<DockerProfile> {
    profile: DockerProfile
    images: Image[] = []
    containers: Container[] = []
    startMode = 'image'

    constructor (
        docker: DockerService,
        private selector: SelectorService,
    ) {
        docker.listContainers().then(containers => {
            this.containers = containers
            this.containers.sort((a, b) => a.names[0].localeCompare(b.names[0]))
        })
        docker.listImages().then(images => {
            this.images = images
            this.images.sort((a, b) => a.description.localeCompare(b.description))
        })
    }

    ngOnInit () {
        if (this.profile.options.containerName) {
            this.startMode = 'container'
        }
    }

    updateStartMode () {
        if (this.startMode === 'container') {
            this.profile.options.imageID = null
        } else {
            this.profile.options.containerID = null
            this.profile.options.containerName = null
        }
    }

    getImageDescription () {
        return this.images.find(x => x.id === this.profile.options.imageID)?.description ?? this.profile.options.imageID ?? 'Not selected'
    }

    async pickImage () {
        const img = await this.selector.show('Select image', this.images.map(img => ({
            result: img,
            name: img.description,
            description: img.description === img.id ? null : img.id,
        })))
        this.profile.options.imageID = img.id
    }

    clearContainerID () {
        this.profile.options.containerID = null
    }
}
