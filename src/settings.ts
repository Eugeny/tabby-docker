import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'

import { DockerSettingsTabComponent } from './components/dockerSettingsTab.component'

/** @hidden */
@Injectable()
export class DockerSettingsTabProvider extends SettingsTabProvider {
    id = 'docker'
    icon = 'docker fab'
    title = 'Docker'

    getComponentType (): any {
        return DockerSettingsTabComponent
    }
}
