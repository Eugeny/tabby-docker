import { Component, HostBinding } from '@angular/core'
import { DockerService } from 'services/docker.service'
import { BaseComponent, ConfigService } from 'tabby-core'

/** @hidden */
@Component({
    template: require('./dockerSettingsTab.component.pug'),
})
export class DockerSettingsTabComponent extends BaseComponent {
    @HostBinding('class.content-box') true
    connected = false

    constructor (
        public config: ConfigService,
        private docker: DockerService,
    ) {
        super()
        this.subscribeUntilDestroyed(this.config.changed$, async () => {
            this.connected = false
            await this.docker.listContainers()
            this.connected = true
        })
    }
}
