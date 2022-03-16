import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import TabbyCoreModule, { ConfigProvider, ProfileProvider, TabRecoveryProvider } from 'tabby-core'
import TabbyTerminalModule from 'tabby-terminal'
import { SettingsTabProvider } from 'tabby-settings'

import { DockerTabComponent } from './components/dockerTab.component'
import { DockerProfileSettingsComponent } from './components/dockerProfileSettings.component'
import { DockerProfileProvider } from './profiles'
import { RecoveryProvider } from './recoveryProvider'
import { DockerConfigProvider } from './config'
import { DockerSettingsTabProvider } from './settings'
import { DockerSettingsTabComponent } from 'components/dockerSettingsTab.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabbyCoreModule,
        TabbyTerminalModule,
        NgbModule,
    ],
    providers: [
        { provide: ProfileProvider, useClass: DockerProfileProvider, multi: true },
        { provide: TabRecoveryProvider, useClass: RecoveryProvider, multi: true },
        { provide: ConfigProvider, useClass: DockerConfigProvider, multi: true },
        { provide: SettingsTabProvider, useClass: DockerSettingsTabProvider, multi: true },
    ],
    entryComponents: [
        DockerTabComponent,
        DockerProfileSettingsComponent,
        DockerSettingsTabComponent,
    ],
    declarations: [
        DockerTabComponent,
        DockerProfileSettingsComponent,
        DockerSettingsTabComponent,
    ],
})
export default class DockerModule { }
